FROM node:18-alpine

# Install build dependencies for native modules and wget for healthcheck
RUN apk add --no-cache python3 make g++ wget

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code (excluding node_modules)
COPY . .

# Rebuild native modules for the container architecture after source is copied
# This ensures sqlite3 is built for the correct architecture even with volume mounts
RUN npm rebuild sqlite3

# Expose port
EXPOSE 3001

# Start the application
CMD ["npm", "run", "dev"]
