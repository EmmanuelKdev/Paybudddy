# Use an official Node.js runtime as the base image
FROM node:20-alpine 

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json/yarn.lock
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Install TypeScript globally (optional if you have it locally)
RUN npm install -g typescript

# Compile TypeScript code to JavaScript
# RUN npm run build

# Expose the port your app runs on
#EXPOSE 3000

# Command to run your application
CMD ["npm", "start"]
