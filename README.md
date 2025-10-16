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

# Start the application with Docker
make run

# Stop all services
make down

# Clean up all Docker resources
make clean
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
- **Docker Support**: Full containerization with Docker and Docker Compose
- **Testing**: Comprehensive test suite with 100% coverage
- **TypeScript**: Full type safety throughout the application
- **Make Commands**: Easy development workflow with Makefile

## API Endpoints

- `POST /api/chat` - Send a message to start or continue a conversation
- `GET /api/chat?conversation_id=<id>` - Get conversation history
- `GET /api/chat` - Get all conversations

## Project Structure

```
├── app/
│   ├── api/chat/           # Chat API endpoints
│   ├── chat/               # Chat pages
│   ├── components/         # React components
│   └── layout.tsx          # Root layout
├── Dockerfile              # Docker configuration
├── docker-compose.yml      # Docker Compose setup
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
