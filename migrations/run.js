const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Функция для запуска миграции
async function runMigration() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  });

  try {
    console.log('Запуск миграции базы данных...');
    
    // Чтение SQL файла миграции
    const sqlFile = path.join(__dirname, 'schema.sql');
    const sql = fs.readFileSync(sqlFile, 'utf8');
    
    // Выполнение SQL-запросов
    await pool.query(sql);
    
    console.log('Миграция успешно завершена');
  } catch (error) {
    console.error('Ошибка при выполнении миграции:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Запуск миграции
runMigration();