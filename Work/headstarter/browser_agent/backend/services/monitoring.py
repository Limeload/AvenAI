import asyncio
import logging
import time
from typing import Dict, List, Optional, Any
from datetime import datetime, timedelta
from models.schemas import MonitoringLog, SystemStatus
import json
import os
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)

class MonitoringService:
    def __init__(self):
        self.logs: List[MonitoringLog] = []
        self.system_start_time = time.time()
        self.service_status: Dict[str, bool] = {}
        self.metrics: Dict[str, Any] = {}
        self.max_logs = 10000  # Keep last 10k logs
        
    async def initialize(self):
        """Initialize the monitoring service"""
        try:
            # Initialize service status
            self.service_status = {
                "voice_service": False,
                "intent_parser": False,
                "browser_automation": False,
                "session_manager": False,
                "monitoring": True
            }
            
            # Initialize metrics
            self.metrics = {
                "total_actions": 0,
                "successful_actions": 0,
                "failed_actions": 0,
                "total_sessions": 0,
                "active_sessions": 0,
                "average_response_time": 0.0,
                "peak_concurrent_sessions": 0
            }
            
            # Start monitoring tasks
            asyncio.create_task(self._monitor_system_health())
            asyncio.create_task(self._cleanup_old_logs())
            
            logger.info("Monitoring service initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize monitoring service: {e}")
            raise
    
    async def log_action(self, session_id: str, action_type: str, details: Dict[str, Any], 
                        execution_time: float = None, success: bool = True):
        """Log an action"""
        try:
            log_entry = MonitoringLog(
                session_id=session_id,
                action_type=action_type,
                success=success,
                details=details,
                execution_time=execution_time
            )
            
            self.logs.append(log_entry)
            
            # Update metrics
            self.metrics["total_actions"] += 1
            if success:
                self.metrics["successful_actions"] += 1
            else:
                self.metrics["failed_actions"] += 1
            
            # Update average response time
            if execution_time:
                current_avg = self.metrics["average_response_time"]
                total_actions = self.metrics["total_actions"]
                self.metrics["average_response_time"] = (
                    (current_avg * (total_actions - 1) + execution_time) / total_actions
                )
            
            logger.info(f"Action logged: {action_type} for session {session_id}")
            
        except Exception as e:
            logger.error(f"Failed to log action: {e}")
    
    async def update_service_status(self, service_name: str, status: bool):
        """Update service status"""
        try:
            self.service_status[service_name] = status
            
            # Log service status change
            await self.log_action(
                session_id="system",
                action_type="service_status_change",
                details={
                    "service": service_name,
                    "status": status,
                    "timestamp": datetime.now().isoformat()
                }
            )
            
            logger.info(f"Service status updated: {service_name} = {status}")
            
        except Exception as e:
            logger.error(f"Failed to update service status: {e}")
    
    async def update_session_metrics(self, active_sessions: int, total_sessions: int):
        """Update session metrics"""
        try:
            self.metrics["active_sessions"] = active_sessions
            self.metrics["total_sessions"] = total_sessions
            
            # Update peak concurrent sessions
            if active_sessions > self.metrics["peak_concurrent_sessions"]:
                self.metrics["peak_concurrent_sessions"] = active_sessions
            
        except Exception as e:
            logger.error(f"Failed to update session metrics: {e}")
    
    async def get_system_status(self) -> SystemStatus:
        """Get overall system status"""
        try:
            # Calculate success rate
            total_actions = self.metrics["total_actions"]
            successful_actions = self.metrics["successful_actions"]
            success_rate = (successful_actions / total_actions * 100) if total_actions > 0 else 0
            
            # Calculate uptime
            uptime = time.time() - self.system_start_time
            
            # Determine overall status
            all_services_healthy = all(self.service_status.values())
            overall_status = "healthy" if all_services_healthy else "degraded"
            
            return SystemStatus(
                status=overall_status,
                services=self.service_status.copy(),
                active_sessions=self.metrics["active_sessions"],
                total_actions=total_actions,
                success_rate=round(success_rate, 2),
                uptime=uptime
            )
            
        except Exception as e:
            logger.error(f"Failed to get system status: {e}")
            return SystemStatus(
                status="error",
                services={},
                active_sessions=0,
                total_actions=0,
                success_rate=0.0,
                uptime=0.0
            )
    
    async def get_recent_logs(self, limit: int = 100, session_id: str = None) -> List[Dict[str, Any]]:
        """Get recent monitoring logs"""
        try:
            filtered_logs = self.logs
            
            # Filter by session if specified
            if session_id:
                filtered_logs = [log for log in self.logs if log.session_id == session_id]
            
            # Sort by timestamp (most recent first)
            filtered_logs.sort(key=lambda x: x.timestamp, reverse=True)
            
            # Convert to dict and limit results
            logs_data = []
            for log in filtered_logs[:limit]:
                logs_data.append({
                    "session_id": log.session_id,
                    "action_type": log.action_type,
                    "timestamp": log.timestamp.isoformat(),
                    "success": log.success,
                    "details": log.details,
                    "execution_time": log.execution_time
                })
            
            return logs_data
            
        except Exception as e:
            logger.error(f"Failed to get recent logs: {e}")
            return []
    
    async def get_metrics_summary(self) -> Dict[str, Any]:
        """Get metrics summary"""
        try:
            # Calculate additional metrics
            total_actions = self.metrics["total_actions"]
            successful_actions = self.metrics["successful_actions"]
            failed_actions = self.metrics["failed_actions"]
            
            success_rate = (successful_actions / total_actions * 100) if total_actions > 0 else 0
            failure_rate = (failed_actions / total_actions * 100) if total_actions > 0 else 0
            
            # Get recent activity (last hour)
            one_hour_ago = datetime.now() - timedelta(hours=1)
            recent_logs = [log for log in self.logs if log.timestamp > one_hour_ago]
            recent_actions = len(recent_logs)
            
            return {
                "total_actions": total_actions,
                "successful_actions": successful_actions,
                "failed_actions": failed_actions,
                "success_rate": round(success_rate, 2),
                "failure_rate": round(failure_rate, 2),
                "average_response_time": round(self.metrics["average_response_time"], 3),
                "active_sessions": self.metrics["active_sessions"],
                "total_sessions": self.metrics["total_sessions"],
                "peak_concurrent_sessions": self.metrics["peak_concurrent_sessions"],
                "recent_actions_1h": recent_actions,
                "system_uptime": time.time() - self.system_start_time,
                "services_status": self.service_status.copy()
            }
            
        except Exception as e:
            logger.error(f"Failed to get metrics summary: {e}")
            return {}
    
    async def get_session_metrics(self, session_id: str) -> Dict[str, Any]:
        """Get metrics for a specific session"""
        try:
            session_logs = [log for log in self.logs if log.session_id == session_id]
            
            if not session_logs:
                return {"error": "Session not found"}
            
            total_actions = len(session_logs)
            successful_actions = len([log for log in session_logs if log.success])
            failed_actions = total_actions - successful_actions
            
            success_rate = (successful_actions / total_actions * 100) if total_actions > 0 else 0
            
            # Calculate average execution time for this session
            execution_times = [log.execution_time for log in session_logs if log.execution_time]
            avg_execution_time = sum(execution_times) / len(execution_times) if execution_times else 0
            
            # Get action type breakdown
            action_types = {}
            for log in session_logs:
                action_type = log.action_type
                action_types[action_type] = action_types.get(action_type, 0) + 1
            
            return {
                "session_id": session_id,
                "total_actions": total_actions,
                "successful_actions": successful_actions,
                "failed_actions": failed_actions,
                "success_rate": round(success_rate, 2),
                "average_execution_time": round(avg_execution_time, 3),
                "action_types": action_types,
                "first_action": session_logs[-1].timestamp.isoformat() if session_logs else None,
                "last_action": session_logs[0].timestamp.isoformat() if session_logs else None
            }
            
        except Exception as e:
            logger.error(f"Failed to get session metrics: {e}")
            return {"error": str(e)}
    
    async def _monitor_system_health(self):
        """Monitor system health periodically"""
        while True:
            try:
                await asyncio.sleep(60)  # Check every minute
                
                # Check if we have too many logs
                if len(self.logs) > self.max_logs:
                    await self._cleanup_old_logs()
                
                # Log system health check
                await self.log_action(
                    session_id="system",
                    action_type="health_check",
                    details={
                        "timestamp": datetime.now().isoformat(),
                        "total_logs": len(self.logs),
                        "system_uptime": time.time() - self.system_start_time
                    }
                )
                
            except Exception as e:
                logger.error(f"System health monitoring failed: {e}")
    
    async def _cleanup_old_logs(self):
        """Cleanup old logs to prevent memory issues"""
        try:
            if len(self.logs) > self.max_logs:
                # Keep only the most recent logs
                self.logs = self.logs[-self.max_logs:]
                logger.info(f"Cleaned up old logs, keeping {len(self.logs)} most recent logs")
                
        except Exception as e:
            logger.error(f"Log cleanup failed: {e}")
    
    async def export_monitoring_data(self, hours: int = 24) -> Dict[str, Any]:
        """Export monitoring data for the specified time period"""
        try:
            cutoff_time = datetime.now() - timedelta(hours=hours)
            recent_logs = [log for log in self.logs if log.timestamp > cutoff_time]
            
            # Group logs by session
            session_logs = {}
            for log in recent_logs:
                if log.session_id not in session_logs:
                    session_logs[log.session_id] = []
                session_logs[log.session_id].append(log)
            
            # Calculate statistics
            total_actions = len(recent_logs)
            successful_actions = len([log for log in recent_logs if log.success])
            success_rate = (successful_actions / total_actions * 100) if total_actions > 0 else 0
            
            return {
                "export_timestamp": datetime.now().isoformat(),
                "time_period_hours": hours,
                "total_actions": total_actions,
                "successful_actions": successful_actions,
                "success_rate": round(success_rate, 2),
                "unique_sessions": len(session_logs),
                "logs": [log.dict() for log in recent_logs],
                "session_summaries": {
                    session_id: {
                        "total_actions": len(logs),
                        "successful_actions": len([log for log in logs if log.success]),
                        "first_action": logs[-1].timestamp.isoformat() if logs else None,
                        "last_action": logs[0].timestamp.isoformat() if logs else None
                    }
                    for session_id, logs in session_logs.items()
                }
            }
            
        except Exception as e:
            logger.error(f"Failed to export monitoring data: {e}")
            return {"error": str(e)}
