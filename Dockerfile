# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application (dummy env vars for SvelteKit build analysis)
ENV DATABASE_URL="postgres://build:build@localhost:5432/build"
ENV JWT_ACCESS_SECRET="build-placeholder"
ENV JWT_REFRESH_SECRET="build-placeholder"
ENV ENCRYPTION_KEY="0000000000000000000000000000000000000000000000000000000000000000"
RUN npm run build

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

# Copy built application
COPY --from=builder /app/build ./build
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules

# Set environment to production
ENV NODE_ENV=production
ENV PORT=3000

# Expose the port
EXPOSE 3000

# Start the application
CMD ["node", "build"]
