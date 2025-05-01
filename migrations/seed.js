import pg from 'pg';
import bcrypt from 'bcrypt';

const { Pool } = pg;

// Функция для загрузки начальных данных
async function seedDatabase() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    console.log('Загрузка начальных данных...');
    
    // Начало транзакции
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Проверка и создание админа
      const adminExists = await client.query('SELECT * FROM "users" WHERE username = $1', ['admin']);
      if (adminExists.rows.length === 0) {
        const hashedPassword = await bcrypt.hash('321', 10);
        await client.query(
          'INSERT INTO "users" (username, password) VALUES ($1, $2)',
          ['admin', hashedPassword]
        );
        console.log('Создан администратор с логином "admin"');
      }

      // Добавление демо-товаров если их нет
      const productsExist = await client.query('SELECT COUNT(*) FROM "products"');
      if (parseInt(productsExist.rows[0].count) === 0) {
        // Демо товары
        await client.query(`
          INSERT INTO "products" (name, description, image_url, category, brand, is_top_product, is_new, gagarin_availability, pobedy_availability, specifications, package_contents)
          VALUES 
          ('SMOK Nord 5', 'Компактная Pod-система для повседневного использования с улучшенной батареей и сменными картриджами.', 'https://images.unsplash.com/photo-1561299558-c8426c615987?w=800&auto=format&fit=crop', 'pod', 'SMOK', true, true, 'inStock', 'lowStock', 
           '{"1": "Ёмкость аккумулятора: 800 мАч", "2": "Мощность: 5-40 Вт", "3": "Объем картриджа: 4.5 мл", "4": "Сопротивление: 0.23-1.2 Ом"}',
           '{"1": "Pod-система SMOK Nord 5", "2": "Сменный картридж", "3": "Кабель USB Type-C", "4": "Инструкция"}'),
           
          ('Vaporesso Gen 200', 'Мощный и компактный мод, подходящий как для начинающих, так и для опытных вейперов.', 'https://images.unsplash.com/photo-1560373402-a2c77126d920?w=800&auto=format&fit=crop', 'mod', 'Vaporesso', true, false, 'outOfStock', 'inStock',
           '{"1": "Ёмкость аккумуляторов: 2 x 18650", "2": "Мощность: 5-200 Вт", "3": "Режимы: VW/TC/VV/BP", "4": "Разъем: 510"}',
           '{"1": "Мод Vaporesso Gen 200", "2": "Кабель USB Type-C", "3": "Инструкция"}'),
           
          ('Elf Bar BC5000', 'Одноразовая электронная сигарета с предзаполненными картриджами, обеспечивающая до 5000 затяжек.', 'https://images.unsplash.com/photo-1560373359-e666ac0f069d?w=800&auto=format&fit=crop', 'disposable', 'Elf Bar', false, true, 'inStock', 'inStock',
           '{"1": "Количество затяжек: до 5000", "2": "Ёмкость аккумулятора: 650 мАч", "3": "Объем жидкости: 13 мл", "4": "Никотин: 5%"}',
           '{"1": "Одноразовая электронная сигарета"}'),
           
          ('Bad Drip Dont Care Bear', 'Жидкость со вкусом сладких мармеладных мишек, идеально подходит для повседневного парения.', 'https://images.unsplash.com/photo-1560736241-0e9f4fe4e4e0?w=800&auto=format&fit=crop', 'liquid', 'Bad Drip', false, false, 'lowStock', 'expected',
           '{"1": "Объем: 60 мл", "2": "Крепость: 3 мг никотина", "3": "VG/PG: 70/30", "4": "Вкус: мармеладные мишки"}', null),
           
          ('GeekVape Zeus Mesh RTA', 'Обслуживаемый бак с верхним обдувом и сеточными койлами для максимального вкуса.', 'https://images.unsplash.com/photo-1560373355-a591a948d107?w=800&auto=format&fit=crop', 'accessories', 'GeekVape', true, false, 'expected', 'outOfStock',
           '{"1": "Диаметр: 25 мм", "2": "Объем: 4 мл", "3": "Тип: RTA", "4": "Обдув: верхний"}',
           '{"1": "Бак Zeus Mesh RTA", "2": "Запасное стекло", "3": "Набор уплотнителей", "4": "Инструкция"}')
        `);
        console.log('Добавлены демо товары');
      }

      // Добавление новостей если их нет
      const newsExist = await client.query('SELECT COUNT(*) FROM "news"');
      if (parseInt(newsExist.rows[0].count) === 0) {
        // Демо новости
        await client.query(`
          INSERT INTO "news" (title, content, full_content, date, image_url, type, valid_until)
          VALUES 
          ('Новое поступление устройств', 'В нашем магазине новое поступление Pod-систем SMOK и Vaporesso. Приходите на тест-драйв!', 'В магазинах Damask появилось новое поступление современных Pod-систем от ведущих производителей. Среди новинок: SMOK Nord 5, Vaporesso XROS 3, Voopoo Drag S Pro и многие другие популярные модели. Все устройства доступны для тестирования прямо в магазине. Наши консультанты помогут вам подобрать идеальную Pod-систему, исходя из ваших предпочтений. Не упустите возможность первыми оценить новинки вейп-индустрии!', '25 апреля 2025', 'https://images.unsplash.com/photo-1561299558-c8426c615987?w=800&auto=format&fit=crop', 'news', null),
          
          ('Скидка 20% на все жидкости', 'Только до конца мая скидка 20% на все жидкости при покупке от 3 флаконов. Успейте приобрести!', 'Специальное предложение для любителей разнообразных вкусов! Только до 31 мая 2025 года действует скидка 20% на все жидкости в нашем ассортименте при покупке от 3 флаконов. Акция распространяется на все бренды и линейки жидкостей, включая премиальные. Это отличная возможность попробовать новые вкусы или запастись любимыми жидкостями по выгодной цене. Акция действует во всех магазинах Damask и не суммируется с другими скидками.', '15 мая 2025', 'https://images.unsplash.com/photo-1560736241-0e9f4fe4e4e0?w=800&auto=format&fit=crop', 'promo', '31.05.2025'),
          
          ('Мастер-класс по намотке', 'В нашем магазине на Гагарина пройдет мастер-класс по намотке от профессионалов. Запись по телефону.', 'Приглашаем всех желающих на бесплатный мастер-класс по намотке и обслуживанию RBA/RTA/RDA устройств, который состоится 5 июня 2025 года в 18:00 в нашем магазине на ул. Гагарина. Профессиональный коилбилдер поделится секретами создания идеальных намоток, расскажет об особенностях различных видов проволоки и хлопка, а также продемонстрирует различные техники намотки. Вы сможете задать интересующие вас вопросы и получить персональные рекомендации. Количество мест ограничено, поэтому необходима предварительная запись по телефону.', '1 июня 2025', 'https://images.unsplash.com/photo-1560373402-a2c77126d920?w=800&auto=format&fit=crop', 'news', null)
        `);
        console.log('Добавлены демо новости');
      }

      // Добавление магазинов если их нет
      const storesExist = await client.query('SELECT COUNT(*) FROM "stores"');
      if (parseInt(storesExist.rows[0].count) === 0) {
        // Демо магазины
        await client.query(`
          INSERT INTO "stores" (name, address, district, hours, additional_hours, phone, phone_hours, image_url)
          VALUES 
          ('Магазин на Гагарина', 'ул. Гагарина, 32', 'Центральный', '10:00 - 20:00', 'Вс: 10:00 - 18:00', '+7 (999) 123-45-67', '9:00 - 21:00', 'https://images.unsplash.com/photo-1557689128-628c257a4016?w=800&auto=format&fit=crop'),
          ('Магазин на Победы', 'ул. Победы, 7', 'Западный', '10:00 - 19:00', null, '+7 (999) 765-43-21', '9:00 - 20:00', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop')
        `);
        console.log('Добавлены демо магазины');
      }

      // Добавление настроек сайта если их нет
      const settingsExist = await client.query('SELECT COUNT(*) FROM "site_settings"');
      if (parseInt(settingsExist.rows[0].count) === 0) {
        // Настройки сайта
        await client.query(`
          INSERT INTO "site_settings" (site_name, logo_svg, contact_email, contact_phone, meta_title, meta_description, vk_url, telegram_url)
          VALUES 
          ('Damask Shop', '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 3C10.9 3 9.8 3.2 8.8 3.6C7.7 4 6.8 4.6 5.9 5.4C5.1 6.2 4.4 7.1 3.9 8.2C3.5 9.3 3.2 10.4 3.2 11.6C3.2 12.7 3.4 13.8 3.9 14.8C4.3 15.9 5 16.8 5.8 17.6C6.6 18.4 7.5 19 8.6 19.5C9.7 19.9 10.8 20.2 12 20.2C13.1 20.2 14.2 20 15.2 19.6C16.3 19.2 17.2 18.6 18.1 17.8C18.9 17 19.6 16.1 20.1 15C20.5 13.9 20.8 12.8 20.8 11.6C20.8 10.5 20.6 9.4 20.1 8.4C19.7 7.3 19 6.4 18.2 5.6C17.4 4.8 16.5 4.2 15.4 3.7C14.3 3.3 13.2 3 12 3Z" fill="#ff7e47"></path><path d="M12 16.2C11.6 16.2 11.2 16.3 10.9 16.5C10.5 16.7 10.3 17 10.1 17.3C9.9 17.7 9.8 18.1 9.8 18.5C9.8 18.9 9.9 19.3 10.1 19.6C10.3 20 10.6 20.2 10.9 20.4C11.3 20.6 11.6 20.7 12 20.7C12.4 20.7 12.8 20.6 13.1 20.4C13.5 20.2 13.7 19.9 13.9 19.6C14.1 19.2 14.2 18.8 14.2 18.5C14.2 18.1 14.1 17.7 13.9 17.4C13.7 17 13.4 16.8 13.1 16.6C12.8 16.3 12.4 16.2 12 16.2Z"></path><path d="M17 14.8C13.4 12.6 10.6 12.6 7 14.8" stroke-width="2" stroke-linecap="round"></path><path d="M15.5 11.6C13.5 10.2 10.5 10.2 8.5 11.6" stroke-width="2" stroke-linecap="round"></path><path d="M14 8.4C12.8 7.6 11.2 7.6 10 8.4" stroke-width="2" stroke-linecap="round"></path></svg>', 'contact@damaskshop.ru', '+7 (999) 123-45-67', 'Damask Shop - премиальные вейп устройства', 'Damask Shop предлагает широкий ассортимент электронных устройств для парения в Москве. Актуальная информация о наличии товаров в магазинах.', 'https://vk.com/damaskshop', 'https://t.me/damaskshop')
        `);
        console.log('Добавлены настройки сайта');
      }

      // Завершение транзакции
      await client.query('COMMIT');
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
    
    console.log('Загрузка начальных данных завершена успешно');
  } catch (error) {
    console.error('Ошибка при загрузке начальных данных:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Запуск загрузки начальных данных
seedDatabase();