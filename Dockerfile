# Build stage
FROM node:20-alpine as builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code and env file
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy package files and install production dependencies
COPY package*.json ./
RUN npm ci --production

# Copy built files and env from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/start.js ./start.js
COPY --from=builder /app/ecosystem.config.cjs ./ecosystem.config.cjs
COPY --from=builder /app/.env ./.env

# Install PM2 globally
RUN npm install -g pm2

# Expose the port your app runs on
EXPOSE 5000

# Start the application using PM2
CMD ["pm2-runtime", "start", "ecosystem.config.cjs"]
