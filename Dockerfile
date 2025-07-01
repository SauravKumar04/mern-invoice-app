# ✅ Puppeteer-compatible image (comes with Chromium preinstalled)
FROM ghcr.io/puppeteer/puppeteer:latest

# Set working directory
WORKDIR /app

# Copy all files into the container
COPY . .

# Install dependencies
RUN npm install

# Expose your backend port
EXPOSE 4000

# Run your server
CMD ["node", "server.js"]
