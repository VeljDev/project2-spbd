FROM node:22.11-bookworm-slim

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .