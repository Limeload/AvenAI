from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
import asyncio
import json
import logging
from typing import Dict, List, Optional
import os
from dotenv import load_dotenv

from services.voice_service import VoiceService
from services.intent_parser import IntentParser
from services.browser_automation import BrowserAutomationService
from services.session_manager import SessionManager
from services.monitoring import MonitoringService
from models.schemas import (
    VoiceCommand, BrowserAction, SessionData, 
    AutomationResult, IntentAnalysis, VoiceResponse
)

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Global services
voice_service: Optional[VoiceService] = None
intent_parser: Optional[IntentParser] = None
browser_service: Optional[BrowserAutomationService] = None
session_manager: Optional[SessionManager] = None
monitoring_service: Optional[MonitoringService] = None

# WebSocket connection manager
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []
        self.session_connections: Dict[str, List[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, session_id: str = None):
        await websocket.accept()
        self.active_connections.append(websocket)
        if session_id:
            if session_id not in self.session_connections:
                self.session_connections[session_id] = []
            self.session_connections[session_id].append(websocket)

    def disconnect(self, websocket: WebSocket, session_id: str = None):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
        if session_id and session_id in self.session_connections:
            if websocket in self.session_connections[session_id]:
                self.session_connections[session_id].remove(websocket)

    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)

    async def broadcast_to_session(self, message: str, session_id: str):
        if session_id in self.session_connections:
            for connection in self.session_connections[session_id]:
                try:
                    await connection.send_text(message)
                except:
                    # Remove dead connections
                    self.session_connections[session_id].remove(connection)

manager = ConnectionManager()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    global voice_service, intent_parser, browser_service, session_manager, monitoring_service
    
    logger.info("Initializing Voice Browser Agent services...")
    
    voice_service = VoiceService()
    intent_parser = IntentParser()
    browser_service = BrowserAutomationService()
    session_manager = SessionManager()
    monitoring_service = MonitoringService()
    
    # Initialize services
    await voice_service.initialize()
    await intent_parser.initialize()
    await browser_service.initialize()
    await session_manager.initialize()
    await monitoring_service.initialize()
    
    logger.info("All services initialized successfully")
    
    yield
    
    # Shutdown
    logger.info("Shutting down services...")
    if browser_service:
        await browser_service.cleanup()
    logger.info("Shutdown complete")

app = FastAPI(
    title="Voice Browser Agent API",
    description="Sophisticated voice-enabled browser automation agent",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Voice Browser Agent API", "status": "running"}

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "services": {
            "voice": voice_service is not None,
            "intent_parser": intent_parser is not None,
            "browser": browser_service is not None,
            "session": session_manager is not None,
            "monitoring": monitoring_service is not None
        }
    }

@app.websocket("/ws/{session_id}")
async def websocket_endpoint(websocket: WebSocket, session_id: str):
    await manager.connect(websocket, session_id)
    logger.info(f"WebSocket connected for session: {session_id}")
    
    try:
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)
            
            # Handle different message types
            if message.get("type") == "voice_command":
                await handle_voice_command(message, session_id, websocket)
            elif message.get("type") == "browser_action":
                await handle_browser_action(message, session_id, websocket)
            elif message.get("type") == "session_request":
                await handle_session_request(message, session_id, websocket)
            else:
                await websocket.send_text(json.dumps({
                    "type": "error",
                    "message": "Unknown message type"
                }))
                
    except WebSocketDisconnect:
        manager.disconnect(websocket, session_id)
        logger.info(f"WebSocket disconnected for session: {session_id}")

async def handle_voice_command(message: dict, session_id: str, websocket: WebSocket):
    """Handle voice command processing"""
    try:
        command_data = VoiceCommand(**message.get("data", {}))
        
        # Process voice command
        transcription = await voice_service.transcribe_audio(command_data.audio_data)
        
        # Parse intent
        intent_analysis = await intent_parser.parse_intent(transcription)
        
        # Send transcription and intent analysis
        await websocket.send_text(json.dumps({
            "type": "transcription",
            "data": {
                "text": transcription,
                "confidence": intent_analysis.confidence,
                "intent": intent_analysis.intent,
                "entities": intent_analysis.entities,
                "suggested_actions": intent_analysis.suggested_actions
            }
        }))
        
        # Execute browser action if applicable
        if intent_analysis.intent in ["navigate", "click", "type", "scroll", "screenshot"]:
            browser_action = BrowserAction(
                action=intent_analysis.intent,
                target=intent_analysis.entities.get("target", ""),
                value=intent_analysis.entities.get("value", ""),
                session_id=session_id
            )
            
            result = await browser_service.execute_action(browser_action)
            
            # Send browser action result
            await websocket.send_text(json.dumps({
                "type": "browser_result",
                "data": {
                    "action": browser_action.action,
                    "success": result.success,
                    "screenshot": result.screenshot,
                    "logs": result.logs,
                    "error": result.error
                }
            }))
            
            # Provide TTS feedback
            if result.success:
                feedback = f"Successfully executed {browser_action.action}"
            else:
                feedback = f"Failed to execute {browser_action.action}: {result.error}"
            
            tts_audio = await voice_service.text_to_speech(feedback)
            await websocket.send_text(json.dumps({
                "type": "tts_response",
                "data": {
                    "text": feedback,
                    "audio": tts_audio
                }
            }))
        
        # Update monitoring
        await monitoring_service.log_action(session_id, "voice_command", {
            "transcription": transcription,
            "intent": intent_analysis.intent,
            "success": True
        })
        
    except Exception as e:
        logger.error(f"Error handling voice command: {e}")
        await websocket.send_text(json.dumps({
            "type": "error",
            "message": str(e)
        }))

async def handle_browser_action(message: dict, session_id: str, websocket: WebSocket):
    """Handle direct browser action execution"""
    try:
        action_data = BrowserAction(**message.get("data", {}))
        action_data.session_id = session_id
        
        result = await browser_service.execute_action(action_data)
        
        await websocket.send_text(json.dumps({
            "type": "browser_result",
            "data": {
                "action": action_data.action,
                "success": result.success,
                "screenshot": result.screenshot,
                "logs": result.logs,
                "error": result.error
            }
        }))
        
        # Update monitoring
        await monitoring_service.log_action(session_id, "browser_action", {
            "action": action_data.action,
            "success": result.success
        })
        
    except Exception as e:
        logger.error(f"Error handling browser action: {e}")
        await websocket.send_text(json.dumps({
            "type": "error",
            "message": str(e)
        }))

async def handle_session_request(message: dict, session_id: str, websocket: WebSocket):
    """Handle session management requests"""
    try:
        request_type = message.get("request_type")
        
        if request_type == "create":
            session_data = await session_manager.create_session(session_id)
            await websocket.send_text(json.dumps({
                "type": "session_created",
                "data": session_data.dict()
            }))
        elif request_type == "export":
            export_data = await session_manager.export_session(session_id)
            await websocket.send_text(json.dumps({
                "type": "session_export",
                "data": export_data
            }))
        elif request_type == "status":
            status = await session_manager.get_session_status(session_id)
            await websocket.send_text(json.dumps({
                "type": "session_status",
                "data": status
            }))
        
    except Exception as e:
        logger.error(f"Error handling session request: {e}")
        await websocket.send_text(json.dumps({
            "type": "error",
            "message": str(e)
        }))

@app.post("/api/sessions")
async def create_session():
    """Create a new automation session"""
    session_id = await session_manager.create_new_session()
    return {"session_id": session_id}

@app.get("/api/sessions/{session_id}")
async def get_session(session_id: str):
    """Get session data"""
    session_data = await session_manager.get_session(session_id)
    if not session_data:
        raise HTTPException(status_code=404, detail="Session not found")
    return session_data

@app.get("/api/sessions/{session_id}/export")
async def export_session(session_id: str):
    """Export session data"""
    export_data = await session_manager.export_session(session_id)
    return export_data

@app.get("/api/monitoring/status")
async def get_monitoring_status():
    """Get system monitoring status"""
    status = await monitoring_service.get_system_status()
    return status

@app.get("/api/monitoring/logs")
async def get_monitoring_logs():
    """Get recent monitoring logs"""
    logs = await monitoring_service.get_recent_logs()
    return logs

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
