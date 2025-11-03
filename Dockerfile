FROM node:20-alpine AS build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:20-alpine AS production-stage
WORKDIR /app

RUN npm install -g serve
COPY --from=build-stage /app/dist /app

EXPOSE 8080
CMD ["serve", "-s", "-l", "tcp://0.0.0.0:8080"]