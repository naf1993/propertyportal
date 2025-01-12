# Use Node 18 image as the base
FROM node:18

# Set the working directory to /usr/src/app
WORKDIR /usr/src/app

# Copy package.json and package-lock.json from the backend folder to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Verify tsconfig.json is present before copying the rest of the files
COPY backend/tsconfig.json ./
RUN ls -la /usr/src/app && test -f /usr/src/app/tsconfig.json && echo "tsconfig.json exists" || echo "tsconfig.json not found"

# Copy the rest of the backend folder into the container
COPY . .

# List files to ensure tsconfig.json is copied correctly
RUN ls -la /usr/src/app

# Build the project
RUN npm run build

# Start the app
CMD ["npm", "run", "start:prod"]
