# Use Node 18 image as the base
FROM node:18

# Set the working directory to /usr/src/app (this will be the root working directory for the container)
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json from the backend folder into /usr/src/app
COPY backend/package*.json ./

# Install dependencies
RUN npm install

# Now copy everything from the backend folder into /usr/src/app
COPY backend/ ./

# List the files to confirm tsconfig.json and others are present
RUN ls -la /usr/src/app

# Build the project
RUN npm run build

# Start the app in production mode
CMD ["npm", "run", "start:prod"]
