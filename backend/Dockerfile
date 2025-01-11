# Use a more recent version of Node.js
FROM node:16-slim

# Install curl, Docker, and Heroku CLI
RUN apt-get update && apt-get -y --no-install-recommends install curl \
    && curl -fsSLO https://download.docker.com/linux/static/stable/x86_64/docker-18.06.1-ce.tgz \
    && tar xzvf docker-18.06.1-ce.tgz --strip 1 -C /usr/local/bin docker/docker \
    && rm docker-18.06.1-ce.tgz \
    && rm -rf /var/lib/apt/lists/* \
    && yarn global add heroku

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the backend code
COPY . .

# Expose the port the app runs on
EXPOSE 5000

# Define the command to run the app
CMD ["npm", "run", "start"]
