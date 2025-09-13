# Dockerfile for Node.js/Express backend
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the server code
COPY . .

# Expose backend port (change if needed)
EXPOSE 5000

# Start the server
CMD ["npm", "start"]
