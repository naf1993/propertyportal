# Use node 18 image as the base
FROM node:18

# Set working directory to /usr/src/app (or wherever you'd like in the container)
WORKDIR /usr/src/app

# Copy the backend folder's package.json and tsconfig.json files into the container
COPY backend/package*.json ./backend/

# Install dependencies inside the /backend folder
RUN npm install --prefix ./backend

# Copy the rest of the backend folder into the container
COPY backend ./backend/

# Set the working directory to the backend folder
WORKDIR /usr/src/app/backend

# Build the project (ensure the tsconfig.json is inside the backend folder)
RUN npm run build

# Set the command to start the app
CMD ["npm", "run", "start:prod"]
