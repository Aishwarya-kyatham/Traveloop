FROM node:18-slim

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5173

# Use npx to ensure we find vite in node_modules
CMD ["npx", "vite", "--host"]
