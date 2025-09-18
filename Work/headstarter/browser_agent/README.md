# Voice Browser Agent

A sophisticated voice-enabled browser automation agent with a modern tech interface. This system combines cutting-edge voice recognition, AI-powered intent parsing, and browser automation to create an intelligent assistant for web interactions.

## 🚀 Features

### Core Capabilities
- **Voice Input**: Real-time speech recognition with OpenAI Whisper
- **Intent Parsing**: AI-powered command understanding and action suggestion
- **Browser Automation**: Selenium-based web automation with Browserbase integration
- **Live Monitoring**: Real-time execution logging and system status
- **Text-to-Speech**: Voice feedback for completed actions
- **Screenshot Capture**: Automatic screenshot capture for all actions
- **Session Management**: Persistent session tracking and export functionality

### Modern Interface
- **Dark Tech Aesthetics**: Cyberpunk-inspired UI with glowing effects
- **Real-time Dashboard**: Live monitoring with charts and metrics
- **Responsive Design**: Works on desktop and mobile devices
- **WebSocket Communication**: Real-time updates and notifications
- **Export Functionality**: Session data export in JSON format

## 🏗️ Architecture

The system consists of three main components:

### Backend (FastAPI)
- **Voice Service**: Handles speech-to-text and text-to-speech
- **Intent Parser**: Processes voice commands and extracts actions
- **Browser Automation**: Executes web automation tasks
- **Session Manager**: Manages user sessions and data persistence
- **Monitoring Service**: Tracks system metrics and logs

### Frontend (Next.js + React)
- **Voice Control Center**: Main voice interaction interface
- **Monitoring Dashboard**: Real-time system status and metrics
- **Execution Panel**: Manual browser action execution
- **Activity Logs**: Detailed execution history and logs
- **Session Manager**: Session management and export tools

### Infrastructure
- **Docker Containers**: Containerized deployment
- **Redis**: Session storage and caching
- **WebSocket**: Real-time communication
- **Chrome/Selenium**: Browser automation engine

## 🛠️ Installation

### Prerequisites
- Docker and Docker Compose
- Node.js 18+ (for local development)
- Python 3.11+ (for local development)

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd voice-browser-agent
   ```

2. **Set up environment variables**
   ```bash
   cp env.example .env
   # Edit .env with your API keys
   ```

3. **Start with Docker Compose**
   ```bash
   docker-compose up --build
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

### Local Development

1. **Backend Setup**
   ```bash
   cd backend
   pip install -r requirements.txt
   python -m uvicorn main:app --reload
   ```

2. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Start Redis**
   ```bash
   docker run -d -p 6379:6379 redis:7-alpine
   ```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENAI_API_KEY` | OpenAI API key for voice processing | Yes |
| `BROWSERBASE_API_KEY` | Browserbase API key for cloud automation | No |
| `REDIS_URL` | Redis connection URL | Yes |
| `DEBUG` | Enable debug mode | No |
| `LOG_LEVEL` | Logging level | No |

### Voice Commands

The system supports various voice commands:

- **Navigation**: "Go to google.com", "Navigate to example.com"
- **Clicking**: "Click the search button", "Click on login"
- **Typing**: "Type hello world", "Enter my email"
- **Scrolling**: "Scroll down", "Scroll to top"
- **Screenshots**: "Take a screenshot", "Capture the page"
- **Search**: "Search for Python tutorials", "Find login form"

## 📊 Monitoring

### System Metrics
- Total actions performed
- Success rate percentage
- Average response time
- Active sessions count
- Service health status

### Real-time Logs
- Action execution details
- Error messages and debugging info
- Performance metrics
- Session activity tracking

## 🔒 Security

- Non-root Docker containers
- Environment variable configuration
- Session-based authentication
- Input validation and sanitization
- Rate limiting on API endpoints

## 🚀 Deployment

### Production Deployment

1. **Set up production environment**
   ```bash
   # Copy production environment
   cp env.example .env.production
   
   # Update with production values
   # Set DEBUG=false
   # Use production Redis URL
   # Configure proper API keys
   ```

2. **Deploy with Docker Compose**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

3. **Set up reverse proxy (Nginx)**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
       
       location /api {
           proxy_pass http://localhost:8000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
       
       location /ws {
           proxy_pass http://localhost:8000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection "upgrade";
       }
   }
   ```

## 🧪 Testing

### Run Tests
```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
npm test
```

### Test Coverage
```bash
# Backend coverage
cd backend
pytest --cov=.

# Frontend coverage
cd frontend
npm run test:coverage
```

## 📝 API Documentation

### REST Endpoints

- `GET /health` - System health check
- `POST /api/sessions` - Create new session
- `GET /api/sessions/{id}` - Get session details
- `GET /api/sessions/{id}/export` - Export session data
- `GET /api/monitoring/status` - Get system metrics
- `GET /api/monitoring/logs` - Get activity logs

### WebSocket Events

- `voice_command` - Send voice command
- `browser_action` - Execute browser action
- `transcription` - Receive transcription result
- `browser_result` - Receive action result
- `tts_response` - Receive voice feedback

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the API documentation at `/docs`

## 🔮 Roadmap

- [ ] Multi-language support
- [ ] Advanced browser automation features
- [ ] Integration with more AI models
- [ ] Mobile app development
- [ ] Cloud deployment templates
- [ ] Advanced monitoring and analytics
- [ ] Plugin system for custom actions
