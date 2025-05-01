#!/bin/bash

# Скрипт для запаковки проекта для деплоя

# Имя архива
ARCHIVE_NAME="damask-shop-$(date +%Y%m%d).tar.gz"

# Удаление временных файлов и старых сборок
echo "Очистка временных файлов..."
rm -rf dist node_modules

# Установка зависимостей
echo "Установка зависимостей..."
npm install

# Сборка проекта
echo "Сборка проекта..."
npm run build

# Создание архива с необходимыми файлами
echo "Создание архива $ARCHIVE_NAME..."
tar -czf $ARCHIVE_NAME \
    --exclude=".git" \
    --exclude=".gitignore" \
    --exclude="node_modules" \
    --exclude=".env" \
    --exclude=".env.local" \
    --exclude=".env.development" \
    dist/ \
    server/ \
    shared/ \
    migrations/ \
    render.yaml \
    package.json \
    package-lock.json \
    deploy.sh \
    README.md \
    .env.example

echo "Архив $ARCHIVE_NAME успешно создан"
echo "Размер архива: $(du -h $ARCHIVE_NAME | cut -f1)"
echo ""
echo "Для деплоя распакуйте архив на сервере и запустите: bash deploy.sh"