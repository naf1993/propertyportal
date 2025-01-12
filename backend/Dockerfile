# Use Node 18 image as the base
FROM node:18

# Set the working directory to /usr/src/app
WORKDIR /usr/src/app

# Copy package.json and package-lock.json from the backend folder to the container
COPY package*.json ./

# List files after copying the package files
RUN ls -la /usr/src/app

# Install dependencies
RUN npm install

# Copy the rest of the backend folder into the container
COPY . .

# Build the project
RUN npm run build

# Start the app
CMD ["npm", "run", "start:prod"]
