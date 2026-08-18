import {
  decimal,
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const categories = mysqlTable("categories", {
  id: int("id").autoincrement().primaryKey(),
  parentId: int("parentId"),
  name: varchar("name", { length: 160 }).notNull(),
  slug: varchar("slug", { length: 180 }).notNull().unique(),
  description: text("description"),
  bannerUrl: text("bannerUrl"),
  iconUrl: text("iconUrl"),
  seoTitle: varchar("seoTitle", { length: 255 }),
  metaDescription: text("metaDescription"),
  discountType: mysqlEnum("discountType", ["percentage", "fixed"]),
  discountValue: decimal("discountValue", { precision: 10, scale: 2 }),
  isVisible: int("isVisible").default(1).notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const products = mysqlTable("products", {
  id: int("id").autoincrement().primaryKey(),
  categoryId: int("categoryId").notNull(),
  subcategoryId: int("subcategoryId"),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  sku: varchar("sku", { length: 120 }).notNull().unique(),
  description: text("description"),
  careGuide: text("careGuide"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  discountPrice: decimal("discountPrice", { precision: 10, scale: 2 }),
  discountType: mysqlEnum("discountType", ["percentage", "fixed"]),
  discountValue: decimal("discountValue", { precision: 10, scale: 2 }),
  saleStartsAt: timestamp("saleStartsAt"),
  saleEndsAt: timestamp("saleEndsAt"),
  stock: int("stock").default(0).notNull(),
  material: varchar("material", { length: 120 }),
  color: varchar("color", { length: 80 }),
  size: varchar("size", { length: 80 }),
  imageUrl: text("imageUrl"),
  images: text("images"),
  isFeatured: int("isFeatured").default(0).notNull(),
  isNew: int("isNew").default(0).notNull(),
  isBestSeller: int("isBestSeller").default(0).notNull(),
  isVisible: int("isVisible").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const cartItems = mysqlTable("cartItems", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  productId: int("productId").notNull(),
  quantity: int("quantity").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const orders = mysqlTable("orders", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"),
  customerName: varchar("customerName", { length: 180 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 60 }).notNull(),
  address: text("address").notNull(),
  city: varchar("city", { length: 100 }).notNull(),
  province: varchar("province", { length: 100 }).notNull(),
  postalCode: varchar("postalCode", { length: 30 }).notNull(),
  orderNotes: text("orderNotes"),
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
  shipping: decimal("shipping", { precision: 10, scale: 2 }).notNull(),
  discount: decimal("discount", { precision: 10, scale: 2 }).notNull(),
  tax: decimal("tax", { precision: 10, scale: 2 }).notNull(),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  couponCode: varchar("couponCode", { length: 80 }),
  status: mysqlEnum("status", ["pending", "processing", "shipped", "delivered", "cancelled"]).default("pending").notNull(),
  paymentMethod: mysqlEnum("paymentMethod", ["cod", "stripe"]).default("cod").notNull(),
  paymentStatus: mysqlEnum("paymentStatus", ["pending", "paid", "failed", "refunded"]).default("pending").notNull(),
  stripeSessionId: varchar("stripeSessionId", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const orderItems = mysqlTable("orderItems", {
  id: int("id").autoincrement().primaryKey(),
  orderId: int("orderId").notNull(),
  productId: int("productId"),
  productName: varchar("productName", { length: 255 }).notNull(),
  unitPrice: decimal("unitPrice", { precision: 10, scale: 2 }).notNull(),
  quantity: int("quantity").notNull(),
});

export const coupons = mysqlTable("coupons", {
  id: int("id").autoincrement().primaryKey(),
  code: varchar("code", { length: 80 }).notNull().unique(),
  discountType: mysqlEnum("discountType", ["percentage", "fixed"]).notNull(),
  value: decimal("value", { precision: 10, scale: 2 }).notNull(),
  minimumOrder: decimal("minimumOrder", { precision: 10, scale: 2 }).default("0").notNull(),
  usageLimit: int("usageLimit").default(0).notNull(),
  usageCount: int("usageCount").default(0).notNull(),
  isActive: int("isActive").default(1).notNull(),
  expiresAt: timestamp("expiresAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const shippingRules = mysqlTable("shippingRules", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 160 }).notNull(),
  freeAbove: decimal("freeAbove", { precision: 10, scale: 2 }).notNull(),
  flatRate: decimal("flatRate", { precision: 10, scale: 2 }).notNull(),
  isActive: int("isActive").default(1).notNull(),
});

export const homepageSections = mysqlTable("homepageSections", {
  id: int("id").autoincrement().primaryKey(),
  sectionKey: varchar("sectionKey", { length: 80 }).notNull().unique(),
  label: varchar("label", { length: 160 }).notNull(),
  isVisible: int("isVisible").default(1).notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),
});

export const footerSettings = mysqlTable("footerSettings", {
  id: int("id").autoincrement().primaryKey(),
  tagline: text("tagline").notNull(),
  copyright: varchar("copyright", { length: 160 }).notNull(),
  exploreLinks: text("exploreLinks").notNull(),
  careLinks: text("careLinks").notNull(),
  socialText: text("socialText").notNull(),
  socialHandle: varchar("socialHandle", { length: 100 }).notNull(),
  socialHref: varchar("socialHref", { length: 255 }).notNull(),
  facebookHref: varchar("facebookHref", { length: 255 }).default("https://facebook.com").notNull(),
  instagramHref: varchar("instagramHref", { length: 255 }).default("https://instagram.com").notNull(),
  whatsappNumber: varchar("whatsappNumber", { length: 50 }).default("+923000000000").notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const contactInquiries = mysqlTable("contactInquiries", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 160 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  subject: varchar("subject", { length: 255 }).notNull(),
  message: text("message").notNull(),
  status: varchar("status", { length: 50 }).default("unread").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const storeSettings = mysqlTable("storeSettings", {
  id: int("id").autoincrement().primaryKey(),
  atelierLocation: varchar("atelierLocation", { length: 255 }).default("Gulberg III, Lahore, Pakistan").notNull(),
  supportEmail: varchar("supportEmail", { length: 320 }).default("concierge@bysalma.com").notNull(),
  supportPhone: varchar("supportPhone", { length: 100 }).default("+92 (42) 3500 SALMA").notNull(),
  hoursOfOperation: varchar("hoursOfOperation", { length: 255 }).default("Monday — Saturday: 10:00 AM – 7:00 PM PKT").notNull(),
  contactHeadline: varchar("contactHeadline", { length: 255 }).default("Get in touch.").notNull(),
  contactIntro: text("contactIntro").notNull(),
  shippingHeadline: varchar("shippingHeadline", { length: 255 }).default("Shipping & Returns.").notNull(),
  shippingIntro: text("shippingIntro").notNull(),
  shippingCards: text("shippingCards").notNull(),
  shippingSections: text("shippingSections").notNull(),
  storeDiscountEnabled: int("storeDiscountEnabled").default(0).notNull(),
  storeDiscountPercentage: decimal("storeDiscountPercentage", { precision: 5, scale: 2 }).default("0").notNull(),
  brandLogoUrl: text("brandLogoUrl").notNull().default(""),
  brandMonogram: varchar("brandMonogram", { length: 20 }).notNull().default("BS"),
  brandTitle: varchar("brandTitle", { length: 100 }).notNull().default("BY SALMA"),
  themeMode: varchar("themeMode", { length: 20 }).notNull().default("light"),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type FooterSetting = typeof footerSettings.$inferSelect;
export type ContactInquiry = typeof contactInquiries.$inferSelect;
export type StoreSetting = typeof storeSettings.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Category = typeof categories.$inferSelect;
export type Product = typeof products.$inferSelect;
export type CartItem = typeof cartItems.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type OrderItem = typeof orderItems.$inferSelect;
export type Coupon = typeof coupons.$inferSelect;
export type ShippingRule = typeof shippingRules.$inferSelect;
export type HomepageSection = typeof homepageSections.$inferSelect;

