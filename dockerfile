# === Етап 1: Побудова додатку ===
# Використовуємо базовий образ з Node.js 20 на Alpine Linux для збірки
FROM node:20-alpine AS builder

# Встановлюємо робочу директорію всередині контейнера
WORKDIR /app

# Копіюємо лише файли залежностей, щоб ефективно використовувати кеш
COPY package*.json ./

# Встановлюємо всі залежності (як production, так і dev, бо потрібні для компіляції TypeScript)
RUN npm install

# Копіюємо увесь проект
COPY . .

# Виконуємо збірку TypeScript коду
RUN npm run build

# === Етап 2: Запуск додатку ===
# Використовуємо чистий образ Node.js 20 для production
FROM node:20-alpine

# Встановлюємо робочу директорію
WORKDIR /app

# Копіюємо лише файли залежностей
COPY package*.json ./

# Встановлюємо тільки production залежності
RUN npm install --only=production

# Копіюємо скомпільований код з попереднього етапу
COPY --from=builder /app/dist ./dist

# Відкриваємо порт, на якому працює додаток (переконайся, що твій сервер слухає цей порт)
EXPOSE 3030

# Команда для запуску додатку. Вона використовує команду start з package.json,
# яка запускає node на скомпільованому файлі (dist/server.js)
CMD ["npm", "start"]
