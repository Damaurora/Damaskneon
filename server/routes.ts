import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { availabilityStatuses } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all products
  app.get("/api/products", async (req, res) => {
    try {
      const products = await storage.getProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Ошибка при получении товаров" });
    }
  });

  // Get top products
  app.get("/api/products/top", async (req, res) => {
    try {
      const topProducts = await storage.getTopProducts();
      res.json(topProducts);
    } catch (error) {
      res.status(500).json({ message: "Ошибка при получении топовых товаров" });
    }
  });

  // Get product by ID
  app.get("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Некорректный ID товара" });
      }

      const product = await storage.getProductById(id);
      if (!product) {
        return res.status(404).json({ message: "Товар не найден" });
      }

      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Ошибка при получении товара" });
    }
  });

  // Get all news
  app.get("/api/news", async (req, res) => {
    try {
      const news = await storage.getNews();
      res.json(news);
    } catch (error) {
      res.status(500).json({ message: "Ошибка при получении новостей" });
    }
  });

  // Get news by ID
  app.get("/api/news/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Некорректный ID новости" });
      }

      const newsItem = await storage.getNewsById(id);
      if (!newsItem) {
        return res.status(404).json({ message: "Новость не найдена" });
      }

      res.json(newsItem);
    } catch (error) {
      res.status(500).json({ message: "Ошибка при получении новости" });
    }
  });

  // Get all stores
  app.get("/api/stores", async (req, res) => {
    try {
      const stores = await storage.getStores();
      res.json(stores);
    } catch (error) {
      res.status(500).json({ message: "Ошибка при получении магазинов" });
    }
  });

  // Get store by ID
  app.get("/api/stores/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Некорректный ID магазина" });
      }

      const store = await storage.getStoreById(id);
      if (!store) {
        return res.status(404).json({ message: "Магазин не найден" });
      }

      res.json(store);
    } catch (error) {
      res.status(500).json({ message: "Ошибка при получении магазина" });
    }
  });

  // Get site settings
  app.get("/api/settings", async (req, res) => {
    try {
      const settings = await storage.getSettings();
      res.json(settings || { siteName: "Damask Shop" });
    } catch (error) {
      res.status(500).json({ message: "Ошибка при получении настроек сайта" });
    }
  });

  // Update site settings
  app.put("/api/settings", async (req, res) => {
    try {
      const settings = req.body;
      const updatedSettings = await storage.updateSettings(settings);
      res.json(updatedSettings);
    } catch (error) {
      res.status(500).json({ message: "Ошибка при обновлении настроек сайта" });
    }
  });

  // Create HTTP server
  const httpServer = createServer(app);

  return httpServer;
}
