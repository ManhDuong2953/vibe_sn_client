FROM node:22-slim AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ENV NODE_OPTIONS="--max-old-space-size=4096"

RUN npm install @rollup/rollup-linux-x64-gnu --save-dev

# Serve stage
FROM node:22-slim

WORKDIR /app
RUN npm install -g serve
COPY --from=build /app/dist ./dist

EXPOSE 2003
CMD ["serve", "-s", "dist", "-l", "2003"]
