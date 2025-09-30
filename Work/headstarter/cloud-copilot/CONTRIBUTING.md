# Contributing to CloudCopilot

Thank you for your interest in contributing to CloudCopilot! This document provides guidelines and information for contributors.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Contributing Guidelines](#contributing-guidelines)
- [Pull Request Process](#pull-request-process)
- [Issue Reporting](#issue-reporting)
- [Development Workflow](#development-workflow)
- [Testing](#testing)
- [Deployment](#deployment)

## Code of Conduct

This project adheres to a code of conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

## Getting Started

### Prerequisites

- Node.js 18+ 
- Docker and Docker Compose
- PostgreSQL database
- Git

### Required Accounts

- Google OAuth credentials (for authentication)
- GitHub OAuth credentials (for authentication)
- OpenAI API key (for AI analysis)
- Stripe account (for payments)

## Development Setup

### 1. Fork and Clone

```bash
# Fork the repository on GitHub
# Then clone your fork
git clone https://github.com/your-username/cloud-copilot.git
cd cloud-copilot
```

### 2. Environment Setup

```bash
# Copy environment template
cp env.example .env.local

# Edit with your credentials
nano .env.local
```

### 3. Start Development Environment

```bash
# Quick setup with Docker
./scripts/setup.sh

# Or manual setup
npm install
npx prisma generate
npx prisma db push
```

### 4. Start Development Servers

```bash
# Start both frontend and backend
./scripts/dev.sh

# Or start individually
npm run dev  # Frontend
cd backend && python app.py  # Backend
```

## Project Structure

```
cloud-copilot/
├── src/                    # Next.js frontend
│   ├── app/               # App router pages
│   │   ├── api/           # API routes
│   │   ├── auth/          # Authentication pages
│   │   ├── dashboard/     # Dashboard pages
│   │   └── pricing/       # Marketing pages
│   ├── components/        # Reusable components
│   │   ├── ui/           # Base UI components
│   │   ├── ScanButton.tsx
│   │   ├── SummaryCard.tsx
│   │   ├── FixSnippet.tsx
│   │   ├── HistoryList.tsx
│   │   └── BillingCard.tsx
│   ├── lib/              # Utilities and configurations
│   │   ├── auth.ts       # NextAuth configuration
│   │   ├── prisma.ts     # Database client
│   │   ├── stripe.ts     # Stripe configuration
│   │   └── prompts.ts    # AI prompts
│   └── data/             # Mock data for testing
├── backend/              # Flask backend
│   ├── services/         # Cloud provider integrations
│   │   ├── aws_fetch.py
│   │   └── gcp_fetch.py
│   ├── app.py           # Flask application
│   └── requirements.txt # Python dependencies
├── prisma/              # Database schema
├── scripts/             # Development scripts
├── docker-compose.yml   # Multi-service orchestration
└── nginx.conf          # Reverse proxy configuration
```

## Contributing Guidelines

### Code Style

- **TypeScript**: Use TypeScript for all new code
- **ESLint**: Follow the project's ESLint configuration
- **Prettier**: Code formatting is handled by Prettier
- **Naming**: Use descriptive names for variables and functions
- **Comments**: Add comments for complex logic

### Component Guidelines

- Use functional components with hooks
- Implement proper TypeScript interfaces
- Follow the existing component structure
- Use Tailwind CSS for styling
- Implement proper error handling

### API Guidelines

- Follow RESTful conventions
- Implement proper error handling
- Use appropriate HTTP status codes
- Add input validation
- Document API endpoints

### Database Guidelines

- Use Prisma for database operations
- Follow the existing schema patterns
- Add proper relationships and constraints
- Use transactions for complex operations

## Pull Request Process

### 1. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

### 2. Make Changes

- Write clean, readable code
- Add tests for new functionality
- Update documentation as needed
- Follow the existing code style

### 3. Test Your Changes

```bash
# Run linting
npm run lint

# Run tests
npm run test

# Test the application
npm run dev
```

### 4. Commit Changes

```bash
git add .
git commit -m "feat: add new feature description"
```

Use conventional commit messages:
- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation changes
- `style:` for formatting changes
- `refactor:` for code refactoring
- `test:` for adding tests
- `chore:` for maintenance tasks

### 5. Push and Create PR

```bash
git push origin feature/your-feature-name
```

Create a pull request with:
- Clear description of changes
- Reference to related issues
- Screenshots for UI changes
- Testing instructions

## Issue Reporting

### Bug Reports

When reporting bugs, please include:

1. **Description**: Clear description of the bug
2. **Steps to Reproduce**: Detailed steps to reproduce the issue
3. **Expected Behavior**: What you expected to happen
4. **Actual Behavior**: What actually happened
5. **Environment**: OS, browser, Node.js version
6. **Screenshots**: If applicable

### Feature Requests

When requesting features, please include:

1. **Description**: Clear description of the feature
2. **Use Case**: Why this feature would be useful
3. **Proposed Solution**: How you think it should work
4. **Alternatives**: Other solutions you've considered

## Development Workflow

### 1. Planning

- Check existing issues and discussions
- Plan your approach before coding
- Consider edge cases and error handling

### 2. Development

- Start with small, focused changes
- Write tests as you develop
- Test your changes thoroughly
- Follow the existing patterns

### 3. Review

- Self-review your code before submitting
- Check for potential issues
- Ensure all tests pass
- Update documentation if needed

### 4. Integration

- Rebase on main branch if needed
- Resolve any conflicts
- Ensure CI/CD passes
- Address review feedback

## Testing

### Frontend Testing

```bash
# Run tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Backend Testing

```bash
cd backend
python -m pytest
```

### Integration Testing

```bash
# Start full stack
docker-compose up -d

# Run integration tests
npm run test:integration
```

## Deployment

### Development Deployment

```bash
# Build and start services
docker-compose up -d

# Check service health
docker-compose ps
```

### Production Deployment

1. **Environment Variables**: Set all required environment variables
2. **Database**: Run migrations
3. **Build**: Build Docker images
4. **Deploy**: Deploy to your platform
5. **Monitor**: Monitor application health

## Code Review Guidelines

### For Reviewers

- Be constructive and respectful
- Focus on code quality and functionality
- Check for security issues
- Ensure tests are adequate
- Verify documentation is updated

### For Authors

- Respond to feedback promptly
- Make requested changes
- Ask questions if feedback is unclear
- Update your PR as needed

## Security Considerations

- Never commit sensitive information
- Use environment variables for secrets
- Validate all user inputs
- Follow security best practices
- Report security issues privately

## Performance Considerations

- Optimize database queries
- Use proper indexing
- Implement caching where appropriate
- Monitor application performance
- Profile code for bottlenecks

## Documentation

- Update README.md for significant changes
- Add JSDoc comments for complex functions
- Document API endpoints
- Update setup instructions if needed
- Add examples for new features

## Getting Help

- Check existing issues and discussions
- Join our community discussions
- Ask questions in pull requests
- Contact maintainers for urgent issues

## Recognition

Contributors will be recognized in:
- CONTRIBUTORS.md file
- Release notes
- Project documentation

Thank you for contributing to CloudCopilot! 🚀
