# Moot Chat Application

A Next.js-based chat application with Docker support and comprehensive testing.

## Quick Start with Make

This project includes a Makefile for easy development and deployment. Use these commands:

```bash
# Show all available commands
make

# Install all requirements
make install

# Run tests
make test

# Start the application with Docker (includes Ollama LLM service)
make run

# Stop all services
make down

# Clean up all Docker resources
make clean

# Ollama LLM management
make ollama-models              # List available models
make ollama-pull MODEL=llama3.2:1b   # Pull a specific model
make ollama-test               # Test the LLM service
```

## Manual Development Setup

If you prefer to run the development server manually:

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev
# or
npm run dev
# or
yarn dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Features

- **Chat API**: RESTful API for sending and receiving messages
- **Chat Archive**: View all conversations with message history
- **SQLite Database**: Persistent storage for chat history and conversations
- **Ollama Integration**: Real AI-powered responses using Ollama LLM service
- **Docker Support**: Full containerization with Docker and Docker Compose
- **Testing**: Comprehensive test suite with 100% coverage
- **TypeScript**: Full type safety throughout the application
- **Make Commands**: Easy development workflow with Makefile

## API Endpoints

- `POST /api/chat` - Send a message to start or continue a conversation
- `GET /api/chat?conversation_id=<id>` - Get conversation history
- `GET /api/chat` - Get all conversations

## Services

The application consists of two main services:

1. **moot-app**: The main Next.js chat application with SQLite database
2. **ollama**: LLM service for AI-powered chat responses

### Database

The application uses **SQLite** for persistent storage with the following schema:

- **conversations** table: Stores conversation metadata
- **messages** table: Stores all chat messages with user/bot roles
- Database file: `chat.db` (development) or `/app/data/chat.db` (Docker)

Benefits:
- ✅ Persistent storage across restarts
- ✅ No separate database server needed
- ✅ Fast queries with proper indexing
- ✅ Easy backup (just copy the .db file)

## Configuration

The application uses environment variables defined in `.env`:

```env
# App Configuration
NODE_ENV=production
PORT=3000

# LLM Configuration
OLLAMA_MODEL=llama3.2:1b    # Can be changed to any Ollama-supported model
OLLAMA_HOST=ollama          # Docker service name
OLLAMA_PORT=11434           # Ollama service port
```

### Model Setup

After starting the services, you can:

1. **Pull a specific model**: `make ollama-pull MODEL=llama3.2:1b`
2. **List available models**: `make ollama-models`
3. **Test the service**: `make ollama-test`

Popular lightweight models for development:
- `llama3.2:1b` - Small, fast model (1.3GB)
- `qwen2:0.5b` - Very small model (352MB)
- `phi3:mini` - Microsoft's mini model (2.3GB)

## Project Structure

```
├── app/
│   ├── api/chat/           # Chat API endpoints
│   ├── chat/               # Chat pages
│   ├── components/         # React components
│   └── layout.tsx          # Root layout
├── .env                    # Environment variables
├── Dockerfile              # Docker configuration
├── docker-compose.yml      # Docker Compose setup with Ollama
├── Makefile               # Development commands
└── __tests__/             # Test files
```

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
