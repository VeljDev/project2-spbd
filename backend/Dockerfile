FROM node:22.11-bookworm-slim

WORKDIR /app

COPY package*.json ./

RUN npm cache clean --force

RUN npm ci

COPY . .

RUN mkdir -p /app/logs

CMD ["npm", "run", "dev"]