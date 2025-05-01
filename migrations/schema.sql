-- Миграционный файл схемы базы данных для Damask Shop

-- Создание таблицы пользователей
CREATE TABLE IF NOT EXISTS "users" (
    "id" SERIAL PRIMARY KEY,
    "username" TEXT NOT NULL UNIQUE,
    "password" TEXT NOT NULL
);

-- Создание таблицы товаров
CREATE TABLE IF NOT EXISTS "products" (
    "id" SERIAL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "brand" TEXT,
    "is_top_product" BOOLEAN DEFAULT false,
    "is_new" BOOLEAN DEFAULT false,
    "gagarin_availability" TEXT NOT NULL DEFAULT 'outOfStock',
    "pobedy_availability" TEXT NOT NULL DEFAULT 'outOfStock',
    "specifications" JSONB,
    "package_contents" JSONB
);

-- Создание таблицы новостей
CREATE TABLE IF NOT EXISTS "news" (
    "id" SERIAL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "full_content" TEXT,
    "date" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "valid_until" TEXT
);

-- Создание таблицы магазинов
CREATE TABLE IF NOT EXISTS "stores" (
    "id" SERIAL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "district" TEXT,
    "hours" TEXT NOT NULL,
    "additional_hours" TEXT,
    "phone" TEXT NOT NULL,
    "phone_hours" TEXT,
    "image_url" TEXT NOT NULL
);

-- Создание таблицы настроек сайта
CREATE TABLE IF NOT EXISTS "site_settings" (
    "id" SERIAL PRIMARY KEY,
    "site_name" TEXT NOT NULL,
    "logo_svg" TEXT,
    "contact_email" TEXT,
    "contact_phone" TEXT,
    "meta_title" TEXT,
    "meta_description" TEXT,
    "vk_url" TEXT,
    "telegram_url" TEXT
);

-- Создание таблицы сессий (для express-session)
CREATE TABLE IF NOT EXISTS "session" (
  "sid" varchar NOT NULL COLLATE "default",
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL,
  CONSTRAINT "session_pkey" PRIMARY KEY ("sid")
);

-- Создание индекса для таблицы сессий для улучшения производительности
CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON "session" ("expire");