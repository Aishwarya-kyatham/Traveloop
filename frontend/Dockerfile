# Use an official Node runtime as a parent image
FROM node:18-slim

# Set work directory
WORKDIR /app

# Install dependencies
COPY package.json ./
RUN npm install

# Copy project
COPY . .

# Expose port 5173
EXPOSE 5173

# Default command
CMD ["npm", "run", "dev"]
