# Use an official Node.js runtime as a parent image (or another base image as required)
FROM node:14-alpine

# Set the working directory in the container
WORKDIR /app

# Copy the backend's package.json and install dependencies
COPY backend/package.json backend/yarn.lock ./

RUN yarn install

# Copy the rest of the backend app files
COPY backend/ .

# Expose the backend API port (usually 5000, change if needed)
EXPOSE 5000

# Command to run the backend server
CMD ["yarn", "start"]
