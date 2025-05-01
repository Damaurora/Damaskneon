
import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const { Pool } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigration() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    console.log('Запуск миграции базы данных...');
    
    const sqlFile = path.join(__dirname, 'schema.sql');
    const sql = fs.readFileSync(sqlFile, 'utf8');
    
    await pool.query(sql);
    
    console.log('Миграция успешно завершена');
  } catch (error) {
    console.error('Ошибка при выполнении миграции:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runMigration();
