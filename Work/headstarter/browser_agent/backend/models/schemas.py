from pydantic import BaseModel, Field
from typing import Dict, List, Optional, Any, Union
from datetime import datetime
from enum import Enum

class IntentType(str, Enum):
    NAVIGATE = "navigate"
    CLICK = "click"
    TYPE = "type"
    SCROLL = "scroll"
    SCREENSHOT = "screenshot"
    WAIT = "wait"
    EXTRACT = "extract"
    FORM_FILL = "form_fill"
    SEARCH = "search"
    UNKNOWN = "unknown"

class BrowserActionType(str, Enum):
    NAVIGATE = "navigate"
    CLICK = "click"
    TYPE = "type"
    SCROLL = "scroll"
    SCREENSHOT = "screenshot"
    WAIT = "wait"
    EXTRACT_TEXT = "extract_text"
    EXTRACT_ELEMENTS = "extract_elements"
    FORM_FILL = "form_fill"
    SEARCH = "search"
    HOVER = "hover"
    DOUBLE_CLICK = "double_click"
    RIGHT_CLICK = "right_click"
    DRAG_DROP = "drag_drop"
    KEY_PRESS = "key_press"

class VoiceCommand(BaseModel):
    audio_data: str = Field(..., description="Base64 encoded audio data")
    session_id: Optional[str] = Field(None, description="Session ID")
    timestamp: datetime = Field(default_factory=datetime.now)

class IntentAnalysis(BaseModel):
    intent: IntentType = Field(..., description="Detected intent")
    confidence: float = Field(..., ge=0.0, le=1.0, description="Confidence score")
    entities: Dict[str, Any] = Field(default_factory=dict, description="Extracted entities")
    suggested_actions: List[BrowserActionType] = Field(default_factory=list, description="Suggested browser actions")
    raw_text: str = Field(..., description="Original transcribed text")

class BrowserAction(BaseModel):
    action: BrowserActionType = Field(..., description="Browser action to perform")
    target: str = Field(..., description="Target element selector or URL")
    value: Optional[str] = Field(None, description="Value to input or extract")
    session_id: str = Field(..., description="Browser session ID")
    wait_time: Optional[int] = Field(5, description="Wait time in seconds")
    screenshot: bool = Field(True, description="Take screenshot after action")
    metadata: Dict[str, Any] = Field(default_factory=dict, description="Additional metadata")

class AutomationResult(BaseModel):
    success: bool = Field(..., description="Whether the action was successful")
    screenshot: Optional[str] = Field(None, description="Base64 encoded screenshot")
    logs: List[str] = Field(default_factory=list, description="Execution logs")
    error: Optional[str] = Field(None, description="Error message if failed")
    extracted_data: Optional[Dict[str, Any]] = Field(None, description="Extracted data")
    execution_time: float = Field(..., description="Execution time in seconds")
    timestamp: datetime = Field(default_factory=datetime.now)

class SessionData(BaseModel):
    session_id: str = Field(..., description="Unique session identifier")
    created_at: datetime = Field(default_factory=datetime.now)
    last_activity: datetime = Field(default_factory=datetime.now)
    browser_session_id: Optional[str] = Field(None, description="Browser session ID")
    actions_performed: List[BrowserAction] = Field(default_factory=list, description="Actions performed in session")
    results: List[AutomationResult] = Field(default_factory=list, description="Results from actions")
    status: str = Field("active", description="Session status")
    metadata: Dict[str, Any] = Field(default_factory=dict, description="Session metadata")

class VoiceResponse(BaseModel):
    text: str = Field(..., description="Response text")
    audio: Optional[str] = Field(None, description="Base64 encoded audio response")
    confidence: float = Field(..., ge=0.0, le=1.0, description="Confidence score")
    timestamp: datetime = Field(default_factory=datetime.now)

class MonitoringLog(BaseModel):
    session_id: str = Field(..., description="Session ID")
    action_type: str = Field(..., description="Type of action performed")
    timestamp: datetime = Field(default_factory=datetime.now)
    success: bool = Field(..., description="Whether action was successful")
    details: Dict[str, Any] = Field(default_factory=dict, description="Action details")
    execution_time: Optional[float] = Field(None, description="Execution time in seconds")

class SystemStatus(BaseModel):
    status: str = Field(..., description="Overall system status")
    services: Dict[str, bool] = Field(..., description="Service status")
    active_sessions: int = Field(..., description="Number of active sessions")
    total_actions: int = Field(..., description="Total actions performed")
    success_rate: float = Field(..., description="Success rate percentage")
    uptime: float = Field(..., description="System uptime in seconds")
    last_updated: datetime = Field(default_factory=datetime.now)

class SessionExport(BaseModel):
    session_id: str = Field(..., description="Session ID")
    export_timestamp: datetime = Field(default_factory=datetime.now)
    session_data: SessionData = Field(..., description="Complete session data")
    actions_summary: Dict[str, int] = Field(..., description="Summary of actions performed")
    screenshots: List[str] = Field(default_factory=list, description="Base64 encoded screenshots")
    logs: List[MonitoringLog] = Field(default_factory=list, description="Session logs")
    metadata: Dict[str, Any] = Field(default_factory=dict, description="Export metadata")

class WebSocketMessage(BaseModel):
    type: str = Field(..., description="Message type")
    data: Dict[str, Any] = Field(default_factory=dict, description="Message data")
    timestamp: datetime = Field(default_factory=datetime.now)
    session_id: Optional[str] = Field(None, description="Session ID")

class ErrorResponse(BaseModel):
    error: str = Field(..., description="Error message")
    details: Optional[Dict[str, Any]] = Field(None, description="Error details")
    timestamp: datetime = Field(default_factory=datetime.now)
