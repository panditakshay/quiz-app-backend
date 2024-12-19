# Use Node.js LTS version as the base image
FROM node:lts-alpine

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the application files
COPY . .


# Copy the .env file (optional: secure handling of secrets)
COPY .env.example .env

# Build the TypeScript code
RUN npm run build

# Expose the application port
EXPOSE 3000

# Start the server
CMD ["npm", "start"]
