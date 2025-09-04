# Build React app
FROM node:18 AS build

WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .

# Đặt NODE_OPTIONS ở đây (trước khi build)
ENV NODE_OPTIONS="--max-old-space-size=4096"

RUN npm run build

EXPOSE 2003

CMD ["npm", "start"]
