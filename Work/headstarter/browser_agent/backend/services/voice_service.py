import asyncio
import base64
import io
import logging
from typing import Optional, Dict, Any
import speech_recognition as sr
import pyttsx3
import openai
from pydantic import BaseModel
import os
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)

class VoiceService:
    def __init__(self):
        self.recognizer = sr.Recognizer()
        self.tts_engine = pyttsx3.init()
        self.openai_client = None
        self._setup_tts()
        
    def _setup_tts(self):
        """Configure text-to-speech engine"""
        try:
            voices = self.tts_engine.getProperty('voices')
            # Try to find a more natural voice
            for voice in voices:
                if 'english' in voice.name.lower() or 'us' in voice.id.lower():
                    self.tts_engine.setProperty('voice', voice.id)
                    break
            
            # Set speech rate and volume
            self.tts_engine.setProperty('rate', 180)  # Speed of speech
            self.tts_engine.setProperty('volume', 0.9)  # Volume level (0.0 to 1.0)
            
        except Exception as e:
            logger.warning(f"Could not configure TTS engine: {e}")
    
    async def initialize(self):
        """Initialize the voice service"""
        try:
            # Initialize OpenAI client if API key is available
            openai_api_key = os.getenv("OPENAI_API_KEY")
            if openai_api_key:
                self.openai_client = openai.AsyncOpenAI(api_key=openai_api_key)
                logger.info("OpenAI client initialized for enhanced speech processing")
            else:
                logger.warning("OpenAI API key not found, using basic speech recognition")
                
            logger.info("Voice service initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize voice service: {e}")
            raise
    
    async def transcribe_audio(self, audio_data: str) -> str:
        """Transcribe audio data to text"""
        try:
            # Decode base64 audio data
            audio_bytes = base64.b64decode(audio_data)
            
            # Use OpenAI Whisper for transcription if available
            if self.openai_client:
                return await self._transcribe_with_openai(audio_bytes)
            else:
                return await self._transcribe_with_speech_recognition(audio_bytes)
                
        except Exception as e:
            logger.error(f"Transcription failed: {e}")
            raise Exception(f"Transcription failed: {str(e)}")
    
    async def _transcribe_with_openai(self, audio_bytes: bytes) -> str:
        """Transcribe using OpenAI Whisper"""
        try:
            # Create a temporary file-like object
            audio_file = io.BytesIO(audio_bytes)
            audio_file.name = "audio.wav"
            
            # Transcribe with OpenAI Whisper
            response = await self.openai_client.audio.transcriptions.create(
                model="whisper-1",
                file=audio_file,
                response_format="text"
            )
            
            return response.strip()
            
        except Exception as e:
            logger.error(f"OpenAI transcription failed: {e}")
            # Fallback to speech recognition
            return await self._transcribe_with_speech_recognition(audio_bytes)
    
    async def _transcribe_with_speech_recognition(self, audio_bytes: bytes) -> str:
        """Transcribe using speech_recognition library"""
        try:
            # Create AudioData object
            audio_data = sr.AudioData(audio_bytes, 16000, 2)  # Assuming 16kHz, 16-bit audio
            
            # Try different recognition services
            recognition_methods = [
                ("google", lambda: self.recognizer.recognize_google(audio_data)),
                ("sphinx", lambda: self.recognizer.recognize_sphinx(audio_data)),
            ]
            
            for method_name, method_func in recognition_methods:
                try:
                    text = method_func()
                    logger.info(f"Transcription successful using {method_name}")
                    return text
                except sr.UnknownValueError:
                    logger.warning(f"Could not understand audio with {method_name}")
                    continue
                except sr.RequestError as e:
                    logger.warning(f"Error with {method_name}: {e}")
                    continue
            
            raise Exception("Could not transcribe audio with any available method")
            
        except Exception as e:
            logger.error(f"Speech recognition failed: {e}")
            raise Exception(f"Speech recognition failed: {str(e)}")
    
    async def text_to_speech(self, text: str) -> str:
        """Convert text to speech and return base64 encoded audio"""
        try:
            # Generate speech
            audio_data = await self._generate_speech_async(text)
            
            # Encode as base64
            audio_base64 = base64.b64encode(audio_data).decode('utf-8')
            
            return audio_base64
            
        except Exception as e:
            logger.error(f"Text-to-speech failed: {e}")
            raise Exception(f"Text-to-speech failed: {str(e)}")
    
    async def _generate_speech_async(self, text: str) -> bytes:
        """Generate speech asynchronously"""
        try:
            # Use OpenAI TTS if available
            if self.openai_client:
                return await self._generate_speech_with_openai(text)
            else:
                return await self._generate_speech_with_pyttsx3(text)
                
        except Exception as e:
            logger.error(f"Speech generation failed: {e}")
            raise
    
    async def _generate_speech_with_openai(self, text: str) -> bytes:
        """Generate speech using OpenAI TTS"""
        try:
            response = await self.openai_client.audio.speech.create(
                model="tts-1",
                voice="alloy",  # You can change this to nova, echo, fable, onyx, or shimmer
                input=text,
                response_format="mp3"
            )
            
            return response.content
            
        except Exception as e:
            logger.error(f"OpenAI TTS failed: {e}")
            # Fallback to pyttsx3
            return await self._generate_speech_with_pyttsx3(text)
    
    async def _generate_speech_with_pyttsx3(self, text: str) -> bytes:
        """Generate speech using pyttsx3"""
        try:
            # This is a simplified implementation
            # In a real implementation, you'd need to capture the audio output
            # For now, we'll return a placeholder
            
            # Run TTS in a thread to avoid blocking
            loop = asyncio.get_event_loop()
            await loop.run_in_executor(None, self.tts_engine.say, text)
            await loop.run_in_executor(None, self.tts_engine.runAndWait)
            
            # Return empty bytes as placeholder
            # In a real implementation, you'd capture the audio output
            return b""
            
        except Exception as e:
            logger.error(f"pyttsx3 TTS failed: {e}")
            raise
    
    async def analyze_speech_patterns(self, audio_data: str) -> Dict[str, Any]:
        """Analyze speech patterns for additional insights"""
        try:
            transcription = await self.transcribe_audio(audio_data)
            
            # Basic analysis
            analysis = {
                "word_count": len(transcription.split()),
                "character_count": len(transcription),
                "has_question": "?" in transcription,
                "has_exclamation": "!" in transcription,
                "confidence_indicators": {
                    "has_fillers": any(word in transcription.lower() for word in ["um", "uh", "like", "you know"]),
                    "is_command": any(word in transcription.lower() for word in ["click", "type", "go to", "navigate", "scroll"]),
                    "is_question": transcription.strip().endswith("?")
                }
            }
            
            return analysis
            
        except Exception as e:
            logger.error(f"Speech pattern analysis failed: {e}")
            return {"error": str(e)}
    
    async def cleanup(self):
        """Cleanup resources"""
        try:
            if self.tts_engine:
                self.tts_engine.stop()
            logger.info("Voice service cleanup completed")
        except Exception as e:
            logger.error(f"Voice service cleanup failed: {e}")
