import asyncio
import logging
import base64
import time
from typing import Dict, List, Optional, Any
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from selenium.common.exceptions import TimeoutException, NoSuchElementException
from models.schemas import BrowserAction, AutomationResult, BrowserActionType
import os
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)

class BrowserAutomationService:
    def __init__(self):
        self.driver = None
        self.wait = None
        self.sessions: Dict[str, webdriver.Chrome] = {}
        self.session_metadata: Dict[str, Dict[str, Any]] = {}
        
    async def initialize(self):
        """Initialize the browser automation service"""
        try:
            # Check if Browserbase API key is available
            browserbase_api_key = os.getenv("BROWSERBASE_API_KEY")
            if browserbase_api_key:
                logger.info("Browserbase API key found, will use Browserbase for browser automation")
            else:
                logger.warning("Browserbase API key not found, using local Chrome driver")
            
            logger.info("Browser automation service initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize browser automation service: {e}")
            raise
    
    async def create_session(self, session_id: str) -> str:
        """Create a new browser session"""
        try:
            if session_id in self.sessions:
                await self.close_session(session_id)
            
            # Create Chrome options
            chrome_options = Options()
            chrome_options.add_argument("--no-sandbox")
            chrome_options.add_argument("--disable-dev-shm-usage")
            chrome_options.add_argument("--disable-gpu")
            chrome_options.add_argument("--window-size=1920,1080")
            chrome_options.add_argument("--disable-blink-features=AutomationControlled")
            chrome_options.add_experimental_option("excludeSwitches", ["enable-automation"])
            chrome_options.add_experimental_option('useAutomationExtension', False)
            
            # Use Browserbase if available
            browserbase_api_key = os.getenv("BROWSERBASE_API_KEY")
            if browserbase_api_key:
                # Configure Browserbase
                chrome_options.add_argument(f"--browserbase-api-key={browserbase_api_key}")
                chrome_options.add_argument("--browserbase-session-id=" + session_id)
            
            # Create driver
            driver = webdriver.Chrome(options=chrome_options)
            driver.execute_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")
            
            # Initialize wait
            wait = WebDriverWait(driver, 10)
            
            # Store session
            self.sessions[session_id] = driver
            self.session_metadata[session_id] = {
                "created_at": time.time(),
                "actions_count": 0,
                "last_activity": time.time()
            }
            
            logger.info(f"Browser session created: {session_id}")
            return session_id
            
        except Exception as e:
            logger.error(f"Failed to create browser session: {e}")
            raise Exception(f"Failed to create browser session: {str(e)}")
    
    async def execute_action(self, action: BrowserAction) -> AutomationResult:
        """Execute a browser action"""
        start_time = time.time()
        logs = []
        
        try:
            session_id = action.session_id
            
            # Ensure session exists
            if session_id not in self.sessions:
                await self.create_session(session_id)
            
            driver = self.sessions[session_id]
            wait = WebDriverWait(driver, action.wait_time or 10)
            
            logs.append(f"Executing action: {action.action} on target: {action.target}")
            
            # Execute the action
            result = await self._execute_browser_action(driver, wait, action, logs)
            
            # Take screenshot if requested
            screenshot = None
            if action.screenshot:
                screenshot = await self._take_screenshot(driver)
            
            # Update session metadata
            self.session_metadata[session_id]["actions_count"] += 1
            self.session_metadata[session_id]["last_activity"] = time.time()
            
            execution_time = time.time() - start_time
            
            return AutomationResult(
                success=True,
                screenshot=screenshot,
                logs=logs,
                extracted_data=result.get("extracted_data"),
                execution_time=execution_time
            )
            
        except Exception as e:
            logger.error(f"Browser action failed: {e}")
            execution_time = time.time() - start_time
            
            return AutomationResult(
                success=False,
                error=str(e),
                logs=logs,
                execution_time=execution_time
            )
    
    async def _execute_browser_action(self, driver: webdriver.Chrome, wait: WebDriverWait, 
                                    action: BrowserAction, logs: List[str]) -> Dict[str, Any]:
        """Execute the specific browser action"""
        try:
            if action.action == BrowserActionType.NAVIGATE:
                return await self._navigate(driver, action.target, logs)
            elif action.action == BrowserActionType.CLICK:
                return await self._click_element(driver, wait, action.target, logs)
            elif action.action == BrowserActionType.TYPE:
                return await self._type_text(driver, wait, action.target, action.value, logs)
            elif action.action == BrowserActionType.SCROLL:
                return await self._scroll_page(driver, action.target, logs)
            elif action.action == BrowserActionType.SCREENSHOT:
                return await self._take_screenshot_action(driver, logs)
            elif action.action == BrowserActionType.WAIT:
                return await self._wait_action(driver, action.wait_time or 5, logs)
            elif action.action == BrowserActionType.EXTRACT_TEXT:
                return await self._extract_text(driver, wait, action.target, logs)
            elif action.action == BrowserActionType.EXTRACT_ELEMENTS:
                return await self._extract_elements(driver, wait, action.target, logs)
            elif action.action == BrowserActionType.HOVER:
                return await self._hover_element(driver, wait, action.target, logs)
            elif action.action == BrowserActionType.SEARCH:
                return await self._search_action(driver, wait, action.target, action.value, logs)
            else:
                raise Exception(f"Unsupported action: {action.action}")
                
        except Exception as e:
            logs.append(f"Action execution failed: {str(e)}")
            raise
    
    async def _navigate(self, driver: webdriver.Chrome, url: str, logs: List[str]) -> Dict[str, Any]:
        """Navigate to a URL"""
        try:
            # Ensure URL has protocol
            if not url.startswith(('http://', 'https://')):
                url = 'https://' + url
            
            driver.get(url)
            logs.append(f"Navigated to: {url}")
            
            return {"success": True, "url": url}
            
        except Exception as e:
            logs.append(f"Navigation failed: {str(e)}")
            raise
    
    async def _click_element(self, driver: webdriver.Chrome, wait: WebDriverWait, 
                           selector: str, logs: List[str]) -> Dict[str, Any]:
        """Click an element"""
        try:
            element = await self._find_element(driver, wait, selector)
            element.click()
            logs.append(f"Clicked element: {selector}")
            
            return {"success": True, "element": selector}
            
        except Exception as e:
            logs.append(f"Click failed: {str(e)}")
            raise
    
    async def _type_text(self, driver: webdriver.Chrome, wait: WebDriverWait, 
                        selector: str, text: str, logs: List[str]) -> Dict[str, Any]:
        """Type text into an element"""
        try:
            element = await self._find_element(driver, wait, selector)
            element.clear()
            element.send_keys(text)
            logs.append(f"Typed '{text}' into element: {selector}")
            
            return {"success": True, "element": selector, "text": text}
            
        except Exception as e:
            logs.append(f"Type failed: {str(e)}")
            raise
    
    async def _scroll_page(self, driver: webdriver.Chrome, direction: str, logs: List[str]) -> Dict[str, Any]:
        """Scroll the page"""
        try:
            if direction.lower() in ["down", "bottom"]:
                driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
                logs.append("Scrolled down")
            elif direction.lower() in ["up", "top"]:
                driver.execute_script("window.scrollTo(0, 0);")
                logs.append("Scrolled up")
            else:
                # Try to parse as pixel amount
                try:
                    pixels = int(direction)
                    driver.execute_script(f"window.scrollBy(0, {pixels});")
                    logs.append(f"Scrolled {pixels} pixels")
                except ValueError:
                    raise Exception(f"Invalid scroll direction: {direction}")
            
            return {"success": True, "direction": direction}
            
        except Exception as e:
            logs.append(f"Scroll failed: {str(e)}")
            raise
    
    async def _take_screenshot_action(self, driver: webdriver.Chrome, logs: List[str]) -> Dict[str, Any]:
        """Take a screenshot"""
        try:
            screenshot = await self._take_screenshot(driver)
            logs.append("Screenshot taken")
            
            return {"success": True, "screenshot": screenshot}
            
        except Exception as e:
            logs.append(f"Screenshot failed: {str(e)}")
            raise
    
    async def _wait_action(self, driver: webdriver.Chrome, wait_time: int, logs: List[str]) -> Dict[str, Any]:
        """Wait for a specified time"""
        try:
            await asyncio.sleep(wait_time)
            logs.append(f"Waited {wait_time} seconds")
            
            return {"success": True, "wait_time": wait_time}
            
        except Exception as e:
            logs.append(f"Wait failed: {str(e)}")
            raise
    
    async def _extract_text(self, driver: webdriver.Chrome, wait: WebDriverWait, 
                          selector: str, logs: List[str]) -> Dict[str, Any]:
        """Extract text from an element"""
        try:
            element = await self._find_element(driver, wait, selector)
            text = element.text
            logs.append(f"Extracted text from {selector}: {text[:100]}...")
            
            return {"success": True, "extracted_data": {"text": text}}
            
        except Exception as e:
            logs.append(f"Text extraction failed: {str(e)}")
            raise
    
    async def _extract_elements(self, driver: webdriver.Chrome, wait: WebDriverWait, 
                              selector: str, logs: List[str]) -> Dict[str, Any]:
        """Extract multiple elements"""
        try:
            elements = driver.find_elements(By.CSS_SELECTOR, selector)
            extracted_data = []
            
            for i, element in enumerate(elements):
                element_data = {
                    "index": i,
                    "text": element.text,
                    "tag": element.tag_name,
                    "attributes": element.get_attribute("outerHTML")
                }
                extracted_data.append(element_data)
            
            logs.append(f"Extracted {len(elements)} elements matching {selector}")
            
            return {"success": True, "extracted_data": {"elements": extracted_data}}
            
        except Exception as e:
            logs.append(f"Element extraction failed: {str(e)}")
            raise
    
    async def _hover_element(self, driver: webdriver.Chrome, wait: WebDriverWait, 
                           selector: str, logs: List[str]) -> Dict[str, Any]:
        """Hover over an element"""
        try:
            element = await self._find_element(driver, wait, selector)
            ActionChains(driver).move_to_element(element).perform()
            logs.append(f"Hovered over element: {selector}")
            
            return {"success": True, "element": selector}
            
        except Exception as e:
            logs.append(f"Hover failed: {str(e)}")
            raise
    
    async def _search_action(self, driver: webdriver.Chrome, wait: WebDriverWait, 
                           selector: str, query: str, logs: List[str]) -> Dict[str, Any]:
        """Perform a search action"""
        try:
            # Try to find search input field
            search_selectors = [
                'input[type="search"]',
                'input[name="q"]',
                'input[name="search"]',
                'input[placeholder*="search" i]',
                'input[placeholder*="query" i]'
            ]
            
            search_element = None
            for sel in search_selectors:
                try:
                    search_element = driver.find_element(By.CSS_SELECTOR, sel)
                    break
                except NoSuchElementException:
                    continue
            
            if not search_element:
                raise Exception("No search input field found")
            
            search_element.clear()
            search_element.send_keys(query)
            search_element.send_keys(Keys.RETURN)
            
            logs.append(f"Searched for '{query}' using element: {selector}")
            
            return {"success": True, "query": query, "element": selector}
            
        except Exception as e:
            logs.append(f"Search failed: {str(e)}")
            raise
    
    async def _find_element(self, driver: webdriver.Chrome, wait: WebDriverWait, 
                          selector: str) -> Any:
        """Find an element using various strategies"""
        try:
            # Try CSS selector first
            try:
                return wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, selector)))
            except TimeoutException:
                pass
            
            # Try XPath
            try:
                return wait.until(EC.presence_of_element_located((By.XPATH, selector)))
            except TimeoutException:
                pass
            
            # Try by text content
            try:
                return wait.until(EC.presence_of_element_located((By.XPATH, f"//*[contains(text(), '{selector}')]")))
            except TimeoutException:
                pass
            
            # Try by partial text
            try:
                return wait.until(EC.presence_of_element_located((By.XPATH, f"//*[contains(translate(text(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), '{selector.lower()}')]")))
            except TimeoutException:
                pass
            
            raise NoSuchElementException(f"Element not found: {selector}")
            
        except Exception as e:
            raise Exception(f"Element finding failed: {str(e)}")
    
    async def _take_screenshot(self, driver: webdriver.Chrome) -> str:
        """Take a screenshot and return base64 encoded string"""
        try:
            screenshot_bytes = driver.get_screenshot_as_png()
            screenshot_base64 = base64.b64encode(screenshot_bytes).decode('utf-8')
            return screenshot_base64
        except Exception as e:
            logger.error(f"Screenshot failed: {e}")
            raise Exception(f"Screenshot failed: {str(e)}")
    
    async def close_session(self, session_id: str):
        """Close a browser session"""
        try:
            if session_id in self.sessions:
                driver = self.sessions[session_id]
                driver.quit()
                del self.sessions[session_id]
                del self.session_metadata[session_id]
                logger.info(f"Browser session closed: {session_id}")
        except Exception as e:
            logger.error(f"Failed to close browser session {session_id}: {e}")
    
    async def get_session_info(self, session_id: str) -> Optional[Dict[str, Any]]:
        """Get information about a browser session"""
        try:
            if session_id in self.sessions:
                driver = self.sessions[session_id]
                metadata = self.session_metadata.get(session_id, {})
                
                return {
                    "session_id": session_id,
                    "url": driver.current_url,
                    "title": driver.title,
                    "actions_count": metadata.get("actions_count", 0),
                    "created_at": metadata.get("created_at", 0),
                    "last_activity": metadata.get("last_activity", 0)
                }
            return None
        except Exception as e:
            logger.error(f"Failed to get session info: {e}")
            return None
    
    async def cleanup(self):
        """Cleanup all browser sessions"""
        try:
            for session_id in list(self.sessions.keys()):
                await self.close_session(session_id)
            logger.info("Browser automation service cleanup completed")
        except Exception as e:
            logger.error(f"Browser automation service cleanup failed: {e}")
