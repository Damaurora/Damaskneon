import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Product Schema
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  category: text("category").notNull(),
  isTopProduct: boolean("is_top_product").default(false),
  isNew: boolean("is_new").default(false),
  gagarinAvailability: text("gagarin_availability").notNull().default("outOfStock"),
  pobedyAvailability: text("pobedy_availability").notNull().default("outOfStock"),
  specifications: jsonb("specifications"),
  packageContents: jsonb("package_contents"),
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
});

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;

// News Schema
export const news = pgTable("news", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  fullContent: text("full_content"),
  date: text("date").notNull(),
  imageUrl: text("image_url").notNull(),
  type: text("type").notNull(), // "news" or "promo"
  validUntil: text("valid_until"),
});

export const insertNewsSchema = createInsertSchema(news).omit({
  id: true,
});

export type InsertNews = z.infer<typeof insertNewsSchema>;
export type News = typeof news.$inferSelect;

// Store Schema
export const stores = pgTable("stores", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  address: text("address").notNull(),
  district: text("district"),
  hours: text("hours").notNull(),
  additionalHours: text("additional_hours"),
  phone: text("phone").notNull(),
  phoneHours: text("phone_hours"),
  imageUrl: text("image_url").notNull(),
});

export const insertStoreSchema = createInsertSchema(stores).omit({
  id: true,
});

export type InsertStore = z.infer<typeof insertStoreSchema>;
export type Store = typeof stores.$inferSelect;

// Availability Types
export const availabilityStatuses = ["inStock", "lowStock", "expected", "outOfStock"] as const;
export type AvailabilityStatus = typeof availabilityStatuses[number];

// Site Settings Schema
export const siteSettings = pgTable("site_settings", {
  id: serial("id").primaryKey(),
  siteName: text("site_name").notNull(),
  logoSvg: text("logo_svg"),
  contactEmail: text("contact_email"),
  contactPhone: text("contact_phone"),
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  vkUrl: text("vk_url"),
  telegramUrl: text("telegram_url"),
});

export const insertSiteSettingsSchema = createInsertSchema(siteSettings).omit({
  id: true,
});

export type InsertSiteSettings = z.infer<typeof insertSiteSettingsSchema>;
export type SiteSettings = typeof siteSettings.$inferSelect;
