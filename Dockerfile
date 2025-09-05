# Build stage
FROM node:22-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm install
COPY .env ./
COPY . .
RUN npm run build

# Production stage
FROM node:22-alpine AS prod
WORKDIR /app
RUN npm install -g serve

COPY --from=build /app/dist ./dist

EXPOSE 2003
CMD ["serve", "-s", "dist", "-l", "2003"]
