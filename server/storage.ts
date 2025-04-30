import { 
  users, type User, type InsertUser,
  products, type Product, type InsertProduct,
  news, type News, type InsertNews,
  stores, type Store, type InsertStore,
  siteSettings, type SiteSettings, type InsertSiteSettings
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Product methods
  getProducts(): Promise<Product[]>;
  getTopProducts(): Promise<Product[]>;
  getProductById(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: InsertProduct): Promise<Product>;
  deleteProduct(id: number): Promise<void>;
  
  // News methods
  getNews(): Promise<News[]>;
  getNewsById(id: number): Promise<News | undefined>;
  createNews(newsItem: InsertNews): Promise<News>;
  updateNews(id: number, newsItem: InsertNews): Promise<News>;
  deleteNews(id: number): Promise<void>;
  
  // Store methods
  getStores(): Promise<Store[]>;
  getStoreById(id: number): Promise<Store | undefined>;
  createStore(store: InsertStore): Promise<Store>;
  updateStore(id: number, store: InsertStore): Promise<Store>;
  deleteStore(id: number): Promise<void>;
  
  // Settings methods
  getSettings(): Promise<SiteSettings | undefined>;
  updateSettings(settings: InsertSiteSettings): Promise<SiteSettings>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }
  
  // Product methods
  async getProducts(): Promise<Product[]> {
    return await db.select().from(products);
  }
  
  async getTopProducts(): Promise<Product[]> {
    return await db.select().from(products).where(eq(products.isTopProduct, true));
  }
  
  async getProductById(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }
  
  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const [product] = await db.insert(products).values(insertProduct).returning();
    return product;
  }
  
  async updateProduct(id: number, insertProduct: InsertProduct): Promise<Product> {
    const [product] = await db
      .update(products)
      .set(insertProduct)
      .where(eq(products.id, id))
      .returning();
    return product;
  }
  
  async deleteProduct(id: number): Promise<void> {
    await db.delete(products).where(eq(products.id, id));
  }
  
  // News methods
  async getNews(): Promise<News[]> {
    return await db.select().from(news);
  }
  
  async getNewsById(id: number): Promise<News | undefined> {
    const [newsItem] = await db.select().from(news).where(eq(news.id, id));
    return newsItem;
  }
  
  async createNews(insertNews: InsertNews): Promise<News> {
    const [newsItem] = await db.insert(news).values(insertNews).returning();
    return newsItem;
  }
  
  async updateNews(id: number, insertNews: InsertNews): Promise<News> {
    const [newsItem] = await db
      .update(news)
      .set(insertNews)
      .where(eq(news.id, id))
      .returning();
    return newsItem;
  }
  
  async deleteNews(id: number): Promise<void> {
    await db.delete(news).where(eq(news.id, id));
  }
  
  // Store methods
  async getStores(): Promise<Store[]> {
    return await db.select().from(stores);
  }
  
  async getStoreById(id: number): Promise<Store | undefined> {
    const [store] = await db.select().from(stores).where(eq(stores.id, id));
    return store;
  }
  
  async createStore(insertStore: InsertStore): Promise<Store> {
    const [store] = await db.insert(stores).values(insertStore).returning();
    return store;
  }
  
  async updateStore(id: number, insertStore: InsertStore): Promise<Store> {
    const [store] = await db
      .update(stores)
      .set(insertStore)
      .where(eq(stores.id, id))
      .returning();
    return store;
  }
  
  async deleteStore(id: number): Promise<void> {
    await db.delete(stores).where(eq(stores.id, id));
  }
  
  // Settings methods
  async getSettings(): Promise<SiteSettings | undefined> {
    const [settings] = await db.select().from(siteSettings);
    return settings;
  }
  
  async updateSettings(settings: InsertSiteSettings): Promise<SiteSettings> {
    // Проверяем существуют ли настройки
    const existingSettings = await this.getSettings();
    
    if (existingSettings) {
      // Обновляем существующие настройки
      const [updatedSettings] = await db
        .update(siteSettings)
        .set(settings)
        .where(eq(siteSettings.id, existingSettings.id))
        .returning();
      return updatedSettings;
    } else {
      // Создаем новые настройки
      const [newSettings] = await db
        .insert(siteSettings)
        .values(settings)
        .returning();
      return newSettings;
    }
  }
}

export const storage = new DatabaseStorage();

// Initialize demo data if needed
export async function initializeDemoData() {
  // Инициализируем настройки сайта, если они еще не созданы
  const existingSettings = await storage.getSettings();
  if (!existingSettings) {
    await storage.updateSettings({
      siteName: "Damask Shop",
      logoSvg: `<svg width="120" height="40" viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 8h25a8 8 0 0 1 8 8v16a8 8 0 0 1-8 8H10a8 8 0 0 1-8-8V16a8 8 0 0 1 8-8z" fill="#FF5722"/>
      <path d="M19 15h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2V17a2 2 0 0 1 2-2zm13 0h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2V17a2 2 0 0 1 2-2z" fill="#000"/>
      <text x="48" y="28" font-family="Unbounded, sans-serif" font-size="18" font-weight="bold" fill="#fff">Damask</text>
      </svg>`,
      contactEmail: "info@damaskshop.ru",
      contactPhone: "+7 (900) 123-45-67",
      metaTitle: "Damask Shop - магазин вейп-товаров",
      metaDescription: "Магазин вейп-товаров Damask Shop - большой выбор электронных сигарет, жидкостей и аксессуаров в Москве.",
      vkUrl: "https://vk.com/damaskshop",
      telegramUrl: "https://t.me/damaskshop"
    });
  }

  const existingProducts = await storage.getProducts();
  if (existingProducts.length === 0) {
    // Populate products
    const productsList = [
      {
        name: "SMOK Nord 5",
        description: "Компактный под-система с регулировкой мощности",
        imageUrl: "https://images.unsplash.com/photo-1696446866176-41da26f70d98?w=500&auto=format&fit=crop",
        category: "pod",
        isTopProduct: true,
        isNew: false,
        gagarinAvailability: "inStock",
        pobedyAvailability: "lowStock",
        specifications: {
          "1": "Мощность: 5-40W",
          "2": "Аккумулятор: 2000mAh",
          "3": "Емкость бака: 4.5ml",
          "4": "Встроенный чип с защитой",
          "5": "Регулируемый обдув"
        },
        packageContents: {
          "1": "Устройство SMOK Nord 5",
          "2": "Картридж 4.5ml",
          "3": "Испарители Nord 0.4Ω и 0.8Ω",
          "4": "USB Type-C кабель",
          "5": "Руководство пользователя"
        }
      },
      {
        name: "Voopoo Drag X",
        description: "Мощный под-мод с длительным сроком службы",
        imageUrl: "https://images.unsplash.com/photo-1606101273945-e9eba91c0dc4?w=500&auto=format&fit=crop",
        category: "pod",
        isTopProduct: true,
        isNew: false,
        gagarinAvailability: "inStock",
        pobedyAvailability: "inStock",
        specifications: {
          "1": "Мощность: 5-80W",
          "2": "Аккумулятор: 18650 (не входит в комплект)",
          "3": "Емкость бака: 4.5ml",
          "4": "Система GENE.TT Chip",
          "5": "Защита от короткого замыкания"
        },
        packageContents: {
          "1": "Устройство Voopoo Drag X",
          "2": "PnP Pod (4.5ml)",
          "3": "PnP-VM1 0.3Ω Coil",
          "4": "PnP-VM5 0.2Ω Coil",
          "5": "USB-C кабель",
          "6": "Руководство пользователя"
        }
      },
      {
        name: "GeekVape Aegis Legend",
        description: "Защищенный мод с двумя аккумуляторами",
        imageUrl: "https://images.unsplash.com/photo-1595784279873-62b38b5e7cd6?w=500&auto=format&fit=crop",
        category: "mod",
        isTopProduct: true,
        isNew: true,
        gagarinAvailability: "expected",
        pobedyAvailability: "inStock",
        specifications: {
          "1": "Мощность: 5-200W",
          "2": "Аккумуляторы: 2x 18650 (не входят в комплект)",
          "3": "Защита IP67 от воды и пыли",
          "4": "Ударопрочный корпус",
          "5": "Температурный контроль"
        },
        packageContents: {
          "1": "Мод GeekVape Aegis Legend",
          "2": "USB кабель",
          "3": "Руководство пользователя",
          "4": "Гарантийный талон"
        }
      },
      {
        name: "Elf Bar BC5000",
        description: "Одноразовое устройство с долгим сроком службы",
        imageUrl: "https://images.unsplash.com/photo-1641159661408-b015a530fce2?w=500&auto=format&fit=crop",
        category: "disposable",
        isTopProduct: true,
        isNew: false,
        gagarinAvailability: "lowStock",
        pobedyAvailability: "outOfStock",
        specifications: {
          "1": "Аккумулятор: 650mAh",
          "2": "До 5000 затяжек",
          "3": "Объем жидкости: 13ml",
          "4": "Никотин: 5%",
          "5": "Доступно 15+ вкусов"
        },
        packageContents: {
          "1": "Устройство Elf Bar BC5000"
        }
      },
      {
        name: "Uwell Caliburn G",
        description: "Компактная под-система с отличным вкусопередачей",
        imageUrl: "https://images.unsplash.com/photo-1606432487740-b24937318b8a?w=500&auto=format&fit=crop",
        category: "pod",
        isTopProduct: false,
        isNew: false,
        gagarinAvailability: "inStock",
        pobedyAvailability: "inStock",
        specifications: {
          "1": "Мощность: 18W",
          "2": "Аккумулятор: 690mAh",
          "3": "Емкость картриджа: 2ml",
          "4": "Система Pro-FOCS",
          "5": "Двойная система активации"
        },
        packageContents: {
          "1": "Устройство Uwell Caliburn G",
          "2": "Два сменных картриджа",
          "3": "Испаритель 0.8Ω (установлен)",
          "4": "Испаритель 1.0Ω",
          "5": "USB-C кабель",
          "6": "Руководство пользователя"
        }
      },
      {
        name: "Vaporesso Gen S",
        description: "Двухаккумуляторный мод с мощностью до 220W",
        imageUrl: "https://images.unsplash.com/photo-1600706143879-c3f37a7a2ff4?w=500&auto=format&fit=crop",
        category: "mod",
        isTopProduct: false,
        isNew: false,
        gagarinAvailability: "expected",
        pobedyAvailability: "lowStock",
        specifications: {
          "1": "Мощность: 5-220W",
          "2": "Аккумуляторы: 2x 18650 (не входят в комплект)",
          "3": "AXON чип 2.0",
          "4": "Более 10 режимов работы",
          "5": "Pulse режим"
        },
        packageContents: {
          "1": "Мод Vaporesso Gen S",
          "2": "USB кабель",
          "3": "Руководство пользователя",
          "4": "Гарантийный талон"
        }
      },
      {
        name: "HQD Cuvie Plus",
        description: "Одноразовое устройство на 1200 затяжек",
        imageUrl: "https://images.unsplash.com/photo-1591859538954-a9ae0b3a46a5?w=500&auto=format&fit=crop",
        category: "disposable",
        isTopProduct: false,
        isNew: true,
        gagarinAvailability: "inStock",
        pobedyAvailability: "inStock",
        specifications: {
          "1": "Аккумулятор: 550mAh",
          "2": "До 1200 затяжек",
          "3": "Объем жидкости: 6.5ml",
          "4": "Никотин: 5%",
          "5": "Доступно 12+ вкусов"
        },
        packageContents: {
          "1": "Устройство HQD Cuvie Plus"
        }
      },
      {
        name: "Smoke Kitchen Desserts",
        description: "Премиальная жидкость со вкусом десертов",
        imageUrl: "https://images.unsplash.com/photo-1566393028639-d108a42c46a7?w=500&auto=format&fit=crop",
        category: "liquid",
        isTopProduct: false,
        isNew: false,
        gagarinAvailability: "inStock",
        pobedyAvailability: "outOfStock",
        specifications: {
          "1": "Объем: 100ml",
          "2": "VG/PG: 70/30",
          "3": "Никотин: 0/3/6mg",
          "4": "5 десертных вкусов",
          "5": "Премиальные ингредиенты"
        },
        packageContents: {
          "1": "Флакон с жидкостью 100ml",
          "2": "Защитная пломба",
          "3": "Коробка с информацией"
        }
      },
      {
        name: "RDTA Rebuildable Tank",
        description: "Обслуживаемый атомайзер для опытных пользователей",
        imageUrl: "https://images.unsplash.com/photo-1636473543461-1d8ead7d1c4e?w=500&auto=format&fit=crop",
        category: "accessories",
        isTopProduct: false,
        isNew: false,
        gagarinAvailability: "lowStock",
        pobedyAvailability: "inStock",
        specifications: {
          "1": "Диаметр: 25mm",
          "2": "Емкость бака: 4ml",
          "3": "Двухслотовая база для намотки",
          "4": "Регулируемый обдув",
          "5": "Конструкция из нержавеющей стали"
        },
        packageContents: {
          "1": "RDTA атомайзер",
          "2": "Запасные уплотнители",
          "3": "Инструменты для обслуживания",
          "4": "Органайзер для хлопка и спиралей",
          "5": "Руководство пользователя"
        }
      },
      {
        name: "Lost Vape Centaurus",
        description: "Премиальный DNA мод с кожаными вставками",
        imageUrl: "https://images.unsplash.com/photo-1625108371327-eac630048732?w=500&auto=format&fit=crop",
        category: "mod",
        isTopProduct: false,
        isNew: false,
        gagarinAvailability: "outOfStock",
        pobedyAvailability: "expected",
        specifications: {
          "1": "DNA 250C чип",
          "2": "Мощность до 200W",
          "3": "Аккумуляторы: 2x 18650 (не входят в комплект)",
          "4": "Корпус из кожи и карбона",
          "5": "Цветной дисплей"
        },
        packageContents: {
          "1": "Мод Lost Vape Centaurus",
          "2": "USB кабель",
          "3": "Гарантийный талон",
          "4": "Руководство пользователя"
        }
      }
    ];
    
    for (const product of productsList) {
      await storage.createProduct(product as any);
    }
    
    // Initialize news
    const newsList = [
      {
        title: "Новое поступление устройств",
        content: "Встречайте новую коллекцию премиальных устройств от ведущих производителей.",
        fullContent: "Мы рады сообщить о поступлении новой коллекции премиальных устройств от ведущих производителей индустрии. В нашем магазине вы найдете самые последние модели подсистем, одноразовых устройств и модов, которые отличаются инновационным дизайном, высокой производительностью и надежностью.\n\nНаши специалисты тщательно отобрали лучшие продукты, чтобы предложить вам только качественные товары. Новые устройства уже доступны в обоих наших магазинах.\n\nПриглашаем вас посетить наши торговые точки и ознакомиться с новинками лично. Наши консультанты помогут подобрать устройство, которое идеально подойдет именно вам.",
        date: "20 января 2025",
        imageUrl: "https://images.unsplash.com/photo-1540224871915-bc8ffb782bdf?w=600&auto=format&fit=crop",
        type: "news"
      },
      {
        title: "Специальное предложение",
        content: "При покупке устройства получите жидкость в подарок. Акция действует до конца февраля!",
        fullContent: "В нашем магазине стартует выгодная акция для всех любителей вейпинга! При покупке любого устройства из нашей премиальной линейки вы получаете флакон жидкости (10 мл) на выбор абсолютно бесплатно!\n\nЭто отличная возможность попробовать новые вкусы от ведущих производителей или выбрать свой любимый вкус в качестве дополнения к новому устройству.\n\nПредложение ограничено по времени и действует только до конца февраля 2025 года. Количество подарков ограничено, поэтому не откладывайте свой визит!",
        date: "15 февраля 2025",
        imageUrl: "https://images.unsplash.com/photo-1587896661064-426d948176e6?w=600&auto=format&fit=crop",
        type: "promo",
        validUntil: "28 февраля 2025"
      },
      {
        title: "Расширение ассортимента",
        content: "Теперь в наших магазинах представлен расширенный ассортимент продукции.",
        fullContent: "Мы постоянно стремимся удовлетворять потребности наших клиентов, поэтому с удовольствием сообщаем о значительном расширении нашего ассортимента!\n\nТеперь в наших магазинах вы найдете еще больше вариантов продукции:\n\n• Новые линейки жидкостей с уникальными вкусами\n• Расширенный выбор одноразовых устройств\n• Премиальные моды от топовых производителей\n• Эксклюзивные комплектующие и аксессуары\n\nМы также добавили в каталог товары, которые ранее были доступны только под заказ. Теперь вы можете приобрести их прямо с полки в наших магазинах.\n\nПриглашаем вас оценить обновленный ассортимент лично. Наши консультанты всегда готовы помочь с выбором и ответить на все ваши вопросы.",
        date: "5 марта 2025",
        imageUrl: "https://images.unsplash.com/photo-1616166358812-6febd87da797?w=600&auto=format&fit=crop",
        type: "news"
      }
    ];
    
    for (const newsItem of newsList) {
      await storage.createNews(newsItem as any);
    }
    
    // Initialize stores
    const storesList = [
      {
        name: "Магазин на Гагарина",
        address: "ул. Гагарина, 32",
        district: "Центральный район",
        hours: "10:00 - 21:00",
        additionalHours: "Без выходных",
        phone: "+7 (900) 123-45-67",
        phoneHours: "Ежедневно 10:00 - 21:00",
        imageUrl: "https://images.unsplash.com/photo-1556740720-3b0be6721346?w=800&auto=format&fit=crop"
      },
      {
        name: "Магазин на Победы",
        address: "ул. Победы, 7",
        district: "Промышленный район",
        hours: "11:00 - 20:00",
        additionalHours: "Без выходных",
        phone: "+7 (900) 765-43-21",
        phoneHours: "Ежедневно 11:00 - 20:00",
        imageUrl: "https://images.unsplash.com/photo-1592182384341-88ec195cb2b2?w=800&auto=format&fit=crop"
      }
    ];
    
    for (const store of storesList) {
      await storage.createStore(store as any);
    }
  }
}
