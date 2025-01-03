# Use a smaller base image for the build stage
FROM node:18.13.0-alpine AS build

# Set the working directory
WORKDIR /usr/src/app

# Copy only package.json and package-lock.json to leverage Docker cache
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Use a smaller base image for the final stage
FROM node:18.13.0-alpine

# Set the working directory
WORKDIR /usr/src/app

# Copy only the necessary files from the build stage
COPY --from=build /usr/src/app .

# Change ownership of the application files
RUN chown -R node /usr/src/app

# Switch to the non-root user
USER node

# Expose the application port
EXPOSE 5436

# Start the application
CMD ["npm", "run", "start"]
