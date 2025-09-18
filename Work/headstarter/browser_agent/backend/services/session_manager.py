import asyncio
import logging
import json
import time
import uuid
from typing import Dict, List, Optional, Any
from datetime import datetime, timedelta
from models.schemas import SessionData, SessionExport, BrowserAction, AutomationResult
import os
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)

class SessionManager:
    def __init__(self):
        self.sessions: Dict[str, SessionData] = {}
        self.session_logs: Dict[str, List[Dict[str, Any]]] = {}
        self.session_screenshots: Dict[str, List[str]] = {}
        self.cleanup_interval = 3600  # 1 hour
        self.max_session_age = 86400  # 24 hours
        
    async def initialize(self):
        """Initialize the session manager"""
        try:
            # Start cleanup task
            asyncio.create_task(self._cleanup_old_sessions())
            logger.info("Session manager initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize session manager: {e}")
            raise
    
    async def create_session(self, session_id: str = None) -> SessionData:
        """Create a new session"""
        try:
            if not session_id:
                session_id = str(uuid.uuid4())
            
            # Check if session already exists
            if session_id in self.sessions:
                return self.sessions[session_id]
            
            # Create new session
            session_data = SessionData(
                session_id=session_id,
                created_at=datetime.now(),
                last_activity=datetime.now(),
                status="active"
            )
            
            # Store session
            self.sessions[session_id] = session_data
            self.session_logs[session_id] = []
            self.session_screenshots[session_id] = []
            
            logger.info(f"Session created: {session_id}")
            return session_data
            
        except Exception as e:
            logger.error(f"Failed to create session: {e}")
            raise Exception(f"Failed to create session: {str(e)}")
    
    async def create_new_session(self) -> str:
        """Create a new session and return session ID"""
        session_data = await self.create_session()
        return session_data.session_id
    
    async def get_session(self, session_id: str) -> Optional[SessionData]:
        """Get session data"""
        try:
            if session_id in self.sessions:
                # Update last activity
                self.sessions[session_id].last_activity = datetime.now()
                return self.sessions[session_id]
            return None
        except Exception as e:
            logger.error(f"Failed to get session: {e}")
            return None
    
    async def update_session(self, session_id: str, updates: Dict[str, Any]) -> bool:
        """Update session data"""
        try:
            if session_id not in self.sessions:
                return False
            
            session = self.sessions[session_id]
            
            # Update fields
            for key, value in updates.items():
                if hasattr(session, key):
                    setattr(session, key, value)
            
            # Update last activity
            session.last_activity = datetime.now()
            
            logger.info(f"Session updated: {session_id}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to update session: {e}")
            return False
    
    async def add_action(self, session_id: str, action: BrowserAction) -> bool:
        """Add an action to session"""
        try:
            if session_id not in self.sessions:
                return False
            
            session = self.sessions[session_id]
            session.actions_performed.append(action)
            session.last_activity = datetime.now()
            
            logger.info(f"Action added to session {session_id}: {action.action}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to add action to session: {e}")
            return False
    
    async def add_result(self, session_id: str, result: AutomationResult) -> bool:
        """Add a result to session"""
        try:
            if session_id not in self.sessions:
                return False
            
            session = self.sessions[session_id]
            session.results.append(result)
            session.last_activity = datetime.now()
            
            # Store screenshot if present
            if result.screenshot:
                self.session_screenshots[session_id].append(result.screenshot)
            
            logger.info(f"Result added to session {session_id}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to add result to session: {e}")
            return False
    
    async def add_log(self, session_id: str, log_entry: Dict[str, Any]) -> bool:
        """Add a log entry to session"""
        try:
            if session_id not in self.session_logs:
                self.session_logs[session_id] = []
            
            log_entry["timestamp"] = datetime.now().isoformat()
            self.session_logs[session_id].append(log_entry)
            
            logger.info(f"Log added to session {session_id}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to add log to session: {e}")
            return False
    
    async def get_session_status(self, session_id: str) -> Dict[str, Any]:
        """Get session status information"""
        try:
            if session_id not in self.sessions:
                return {"status": "not_found"}
            
            session = self.sessions[session_id]
            logs = self.session_logs.get(session_id, [])
            
            # Calculate statistics
            total_actions = len(session.actions_performed)
            successful_actions = len([r for r in session.results if r.success])
            success_rate = (successful_actions / total_actions * 100) if total_actions > 0 else 0
            
            return {
                "status": session.status,
                "created_at": session.created_at.isoformat(),
                "last_activity": session.last_activity.isoformat(),
                "total_actions": total_actions,
                "successful_actions": successful_actions,
                "success_rate": round(success_rate, 2),
                "screenshots_count": len(self.session_screenshots.get(session_id, [])),
                "logs_count": len(logs),
                "current_url": session.metadata.get("current_url", ""),
                "browser_session_id": session.browser_session_id
            }
            
        except Exception as e:
            logger.error(f"Failed to get session status: {e}")
            return {"status": "error", "error": str(e)}
    
    async def export_session(self, session_id: str) -> SessionExport:
        """Export session data"""
        try:
            if session_id not in self.sessions:
                raise Exception("Session not found")
            
            session = self.sessions[session_id]
            logs = self.session_logs.get(session_id, [])
            screenshots = self.session_screenshots.get(session_id, [])
            
            # Calculate actions summary
            actions_summary = {}
            for action in session.actions_performed:
                action_type = action.action.value
                actions_summary[action_type] = actions_summary.get(action_type, 0) + 1
            
            # Create export data
            export_data = SessionExport(
                session_id=session_id,
                session_data=session,
                actions_summary=actions_summary,
                screenshots=screenshots,
                logs=logs,
                metadata={
                    "export_timestamp": datetime.now().isoformat(),
                    "total_screenshots": len(screenshots),
                    "total_logs": len(logs),
                    "session_duration": (session.last_activity - session.created_at).total_seconds()
                }
            )
            
            logger.info(f"Session exported: {session_id}")
            return export_data
            
        except Exception as e:
            logger.error(f"Failed to export session: {e}")
            raise Exception(f"Failed to export session: {str(e)}")
    
    async def delete_session(self, session_id: str) -> bool:
        """Delete a session"""
        try:
            if session_id in self.sessions:
                del self.sessions[session_id]
            
            if session_id in self.session_logs:
                del self.session_logs[session_id]
            
            if session_id in self.session_screenshots:
                del self.session_screenshots[session_id]
            
            logger.info(f"Session deleted: {session_id}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to delete session: {e}")
            return False
    
    async def list_sessions(self, limit: int = 50) -> List[Dict[str, Any]]:
        """List all sessions"""
        try:
            sessions = []
            for session_id, session_data in self.sessions.items():
                status_info = await self.get_session_status(session_id)
                sessions.append({
                    "session_id": session_id,
                    "created_at": session_data.created_at.isoformat(),
                    "last_activity": session_data.last_activity.isoformat(),
                    "status": session_data.status,
                    **status_info
                })
            
            # Sort by last activity (most recent first)
            sessions.sort(key=lambda x: x["last_activity"], reverse=True)
            
            return sessions[:limit]
            
        except Exception as e:
            logger.error(f"Failed to list sessions: {e}")
            return []
    
    async def _cleanup_old_sessions(self):
        """Cleanup old sessions"""
        while True:
            try:
                await asyncio.sleep(self.cleanup_interval)
                
                current_time = datetime.now()
                sessions_to_delete = []
                
                for session_id, session_data in self.sessions.items():
                    age = (current_time - session_data.last_activity).total_seconds()
                    if age > self.max_session_age:
                        sessions_to_delete.append(session_id)
                
                for session_id in sessions_to_delete:
                    await self.delete_session(session_id)
                    logger.info(f"Cleaned up old session: {session_id}")
                
                if sessions_to_delete:
                    logger.info(f"Cleaned up {len(sessions_to_delete)} old sessions")
                    
            except Exception as e:
                logger.error(f"Session cleanup failed: {e}")
    
    async def get_session_statistics(self) -> Dict[str, Any]:
        """Get overall session statistics"""
        try:
            total_sessions = len(self.sessions)
            active_sessions = len([s for s in self.sessions.values() if s.status == "active"])
            
            total_actions = sum(len(s.actions_performed) for s in self.sessions.values())
            total_results = sum(len(s.results) for s in self.sessions.values())
            
            successful_results = sum(
                len([r for r in s.results if r.success]) 
                for s in self.sessions.values()
            )
            
            success_rate = (successful_results / total_results * 100) if total_results > 0 else 0
            
            return {
                "total_sessions": total_sessions,
                "active_sessions": active_sessions,
                "total_actions": total_actions,
                "total_results": total_results,
                "success_rate": round(success_rate, 2),
                "average_actions_per_session": round(total_actions / total_sessions, 2) if total_sessions > 0 else 0
            }
            
        except Exception as e:
            logger.error(f"Failed to get session statistics: {e}")
            return {}
