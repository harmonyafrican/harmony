# Use official Node.js 24 image
FROM node:24-alpine

# Set working directory
WORKDIR /app

# Copy package and lock files
COPY package*.json tsconfig.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY src ./src

# Build TypeScript
RUN npm run build

# Expose the port Cloud Run uses
EXPOSE 8080

# Start the server
CMD ["node", "dist/server.js"]
