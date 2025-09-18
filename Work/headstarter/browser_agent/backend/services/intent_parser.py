import asyncio
import logging
import re
from typing import Dict, List, Any, Optional
import openai
from models.schemas import IntentType, BrowserActionType, IntentAnalysis
import os
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)

class IntentParser:
    def __init__(self):
        self.openai_client = None
        self.intent_patterns = self._initialize_intent_patterns()
        
    def _initialize_intent_patterns(self) -> Dict[str, Dict[str, Any]]:
        """Initialize regex patterns for intent recognition"""
        return {
            "navigate": {
                "patterns": [
                    r"go to (.+)",
                    r"navigate to (.+)",
                    r"visit (.+)",
                    r"open (.+)",
                    r"load (.+)",
                    r"browse to (.+)"
                ],
                "entities": ["url", "website", "page"]
            },
            "click": {
                "patterns": [
                    r"click (.+)",
                    r"tap (.+)",
                    r"press (.+)",
                    r"select (.+)",
                    r"choose (.+)"
                ],
                "entities": ["element", "button", "link", "text"]
            },
            "type": {
                "patterns": [
                    r"type (.+)",
                    r"enter (.+)",
                    r"input (.+)",
                    r"write (.+)",
                    r"fill (.+)"
                ],
                "entities": ["text", "value", "input"]
            },
            "scroll": {
                "patterns": [
                    r"scroll (.+)",
                    r"move (.+)",
                    r"go (.+)",
                    r"slide (.+)"
                ],
                "entities": ["direction", "amount"]
            },
            "screenshot": {
                "patterns": [
                    r"take screenshot",
                    r"capture screen",
                    r"snap shot",
                    r"save image"
                ],
                "entities": []
            },
            "wait": {
                "patterns": [
                    r"wait (.+)",
                    r"pause (.+)",
                    r"sleep (.+)",
                    r"delay (.+)"
                ],
                "entities": ["time", "duration"]
            },
            "extract": {
                "patterns": [
                    r"extract (.+)",
                    r"get (.+)",
                    r"find (.+)",
                    r"read (.+)",
                    r"copy (.+)"
                ],
                "entities": ["data", "text", "element"]
            },
            "form_fill": {
                "patterns": [
                    r"fill form",
                    r"complete form",
                    r"submit form",
                    r"enter form data"
                ],
                "entities": ["form", "data"]
            },
            "search": {
                "patterns": [
                    r"search (.+)",
                    r"look for (.+)",
                    r"find (.+)",
                    r"query (.+)"
                ],
                "entities": ["query", "term", "keyword"]
            }
        }
    
    async def initialize(self):
        """Initialize the intent parser"""
        try:
            # Initialize OpenAI client if API key is available
            openai_api_key = os.getenv("OPENAI_API_KEY")
            if openai_api_key:
                self.openai_client = openai.AsyncOpenAI(api_key=openai_api_key)
                logger.info("OpenAI client initialized for enhanced intent parsing")
            else:
                logger.warning("OpenAI API key not found, using pattern-based intent parsing")
                
            logger.info("Intent parser initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize intent parser: {e}")
            raise
    
    async def parse_intent(self, text: str) -> IntentAnalysis:
        """Parse user intent from transcribed text"""
        try:
            text = text.lower().strip()
            
            # Use OpenAI for enhanced parsing if available
            if self.openai_client:
                return await self._parse_with_openai(text)
            else:
                return await self._parse_with_patterns(text)
                
        except Exception as e:
            logger.error(f"Intent parsing failed: {e}")
            return IntentAnalysis(
                intent=IntentType.UNKNOWN,
                confidence=0.0,
                entities={},
                suggested_actions=[],
                raw_text=text
            )
    
    async def _parse_with_openai(self, text: str) -> IntentAnalysis:
        """Parse intent using OpenAI GPT"""
        try:
            prompt = f"""
            Analyze the following user command and determine the intent and extract relevant entities.
            
            Command: "{text}"
            
            Possible intents: navigate, click, type, scroll, screenshot, wait, extract, form_fill, search
            
            Return a JSON response with:
            - intent: the detected intent
            - confidence: confidence score (0.0 to 1.0)
            - entities: dictionary of extracted entities
            - suggested_actions: list of suggested browser actions
            
            Example response:
            {{
                "intent": "navigate",
                "confidence": 0.95,
                "entities": {{"url": "google.com", "target": "https://google.com"}},
                "suggested_actions": ["navigate"]
            }}
            """
            
            response = await self.openai_client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are an expert at parsing user commands for browser automation. Always respond with valid JSON."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.1,
                max_tokens=500
            )
            
            result = response.choices[0].message.content.strip()
            
            # Parse JSON response
            import json
            parsed_result = json.loads(result)
            
            return IntentAnalysis(
                intent=IntentType(parsed_result.get("intent", "unknown")),
                confidence=float(parsed_result.get("confidence", 0.0)),
                entities=parsed_result.get("entities", {}),
                suggested_actions=[BrowserActionType(action) for action in parsed_result.get("suggested_actions", [])],
                raw_text=text
            )
            
        except Exception as e:
            logger.error(f"OpenAI intent parsing failed: {e}")
            # Fallback to pattern-based parsing
            return await self._parse_with_patterns(text)
    
    async def _parse_with_patterns(self, text: str) -> IntentAnalysis:
        """Parse intent using regex patterns"""
        try:
            best_match = None
            best_confidence = 0.0
            best_entities = {}
            
            for intent_name, intent_data in self.intent_patterns.items():
                for pattern in intent_data["patterns"]:
                    match = re.search(pattern, text)
                    if match:
                        confidence = self._calculate_pattern_confidence(match, pattern)
                        if confidence > best_confidence:
                            best_match = intent_name
                            best_confidence = confidence
                            best_entities = self._extract_entities_from_match(match, intent_data["entities"])
            
            if best_match:
                return IntentAnalysis(
                    intent=IntentType(best_match),
                    confidence=best_confidence,
                    entities=best_entities,
                    suggested_actions=[BrowserActionType(best_match)],
                    raw_text=text
                )
            else:
                return IntentAnalysis(
                    intent=IntentType.UNKNOWN,
                    confidence=0.0,
                    entities={},
                    suggested_actions=[],
                    raw_text=text
                )
                
        except Exception as e:
            logger.error(f"Pattern-based intent parsing failed: {e}")
            return IntentAnalysis(
                intent=IntentType.UNKNOWN,
                confidence=0.0,
                entities={},
                suggested_actions=[],
                raw_text=text
            )
    
    def _calculate_pattern_confidence(self, match: re.Match, pattern: str) -> float:
        """Calculate confidence based on pattern match quality"""
        try:
            # Base confidence from pattern complexity
            base_confidence = 0.7
            
            # Boost confidence for exact matches
            if match.group(0).lower() == match.string.lower().strip():
                base_confidence += 0.2
            
            # Boost confidence for longer matches
            match_length = len(match.group(0))
            text_length = len(match.string)
            if match_length / text_length > 0.8:
                base_confidence += 0.1
            
            return min(base_confidence, 1.0)
            
        except Exception:
            return 0.5
    
    def _extract_entities_from_match(self, match: re.Match, entity_types: List[str]) -> Dict[str, str]:
        """Extract entities from regex match"""
        entities = {}
        
        try:
            # Extract captured groups
            groups = match.groups()
            for i, group in enumerate(groups):
                if i < len(entity_types):
                    entity_type = entity_types[i]
                    entities[entity_type] = group.strip()
                else:
                    entities[f"value_{i}"] = group.strip()
            
            # Add the full match as target
            entities["target"] = match.group(0).strip()
            
        except Exception as e:
            logger.warning(f"Entity extraction failed: {e}")
        
        return entities
    
    async def suggest_actions(self, intent: IntentType, entities: Dict[str, Any]) -> List[BrowserActionType]:
        """Suggest browser actions based on intent and entities"""
        suggestions = []
        
        try:
            if intent == IntentType.NAVIGATE:
                suggestions.append(BrowserActionType.NAVIGATE)
            elif intent == IntentType.CLICK:
                suggestions.append(BrowserActionType.CLICK)
                suggestions.append(BrowserActionType.HOVER)
            elif intent == IntentType.TYPE:
                suggestions.append(BrowserActionType.TYPE)
            elif intent == IntentType.SCROLL:
                suggestions.append(BrowserActionType.SCROLL)
            elif intent == IntentType.SCREENSHOT:
                suggestions.append(BrowserActionType.SCREENSHOT)
            elif intent == IntentType.WAIT:
                suggestions.append(BrowserActionType.WAIT)
            elif intent == IntentType.EXTRACT:
                suggestions.append(BrowserActionType.EXTRACT_TEXT)
                suggestions.append(BrowserActionType.EXTRACT_ELEMENTS)
            elif intent == IntentType.FORM_FILL:
                suggestions.append(BrowserActionType.FORM_FILL)
            elif intent == IntentType.SEARCH:
                suggestions.append(BrowserActionType.SEARCH)
                suggestions.append(BrowserActionType.TYPE)
            
        except Exception as e:
            logger.error(f"Action suggestion failed: {e}")
        
        return suggestions
    
    async def validate_intent(self, intent_analysis: IntentAnalysis) -> bool:
        """Validate the parsed intent"""
        try:
            # Check confidence threshold
            if intent_analysis.confidence < 0.3:
                return False
            
            # Check if intent is supported
            if intent_analysis.intent == IntentType.UNKNOWN:
                return False
            
            # Check if required entities are present
            required_entities = {
                IntentType.NAVIGATE: ["target"],
                IntentType.CLICK: ["target"],
                IntentType.TYPE: ["value"],
                IntentType.SCROLL: ["direction"],
                IntentType.SEARCH: ["query"]
            }
            
            required = required_entities.get(intent_analysis.intent, [])
            for entity in required:
                if entity not in intent_analysis.entities:
                    return False
            
            return True
            
        except Exception as e:
            logger.error(f"Intent validation failed: {e}")
            return False
