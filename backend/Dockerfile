# Use node 18 image as the base
FROM node:18

# Set working directory to /usr/src/app
WORKDIR /usr/src/app

# Copy the backend folder's package.json and package-lock.json files into the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the backend folder into the container
COPY . .

# Build the project
RUN npm run build

# Set the command to start the app
CMD ["npm", "run", "start:prod"]
