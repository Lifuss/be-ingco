# === Етап 1: Білд з TypeScript ===
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# === Етап 2: Продакшн-рантайм ===
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --only=production

COPY --from=builder /app/dist ./dist

EXPOSE 3030

CMD ["npm", "start"]
