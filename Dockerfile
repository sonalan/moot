# Use Node.js 20 Alpine Linux as base image
FROM node:20-alpine AS base

# Install build dependencies for sqlite3 native module
RUN apk add --no-cache python3 make g++

# Set working directory
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Rebuild sqlite3 for the container architecture
RUN cd node_modules/.pnpm/sqlite3@*/node_modules/sqlite3 && npm run install || true

# Copy source code
COPY . .

# Build the application
RUN pnpm build

# Create data directory for SQLite database
RUN mkdir -p /app/data

# Expose port 3000
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Start the application
CMD ["pnpm", "start"]