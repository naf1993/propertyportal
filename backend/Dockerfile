FROM node:14

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the entire application
COPY . .

# Build the NestJS project
RUN npm run build

# Expose the port (adjust as needed)
EXPOSE 5000
# Start the app in production mode
CMD ["node", "dist/main"]
