FROM node:latest

# Create app directory
WORKDIR /app

COPY package*.json ./

COPY . .

RUN npm install
