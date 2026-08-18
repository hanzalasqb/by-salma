import { and, asc, desc, eq, gte, like, lte, or } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  cartItems,
  categories,
  contactInquiries,
  coupons,
  footerSettings,
  homepageSections,
  orderItems,
  orders,
  products,
  shippingRules,
  storeSettings,
  type InsertUser,
  users,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) return;
  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};
  const textFields = ["name", "email", "loginMethod"] as const;
  for (const field of textFields) {
    if (user[field] !== undefined) {
      values[field] = user[field] ?? null;
      updateSet[field] = user[field] ?? null;
    }
  }
  if (user.lastSignedIn !== undefined) {
    values.lastSignedIn = user.lastSignedIn;
    updateSet.lastSignedIn = user.lastSignedIn;
  }
  if (user.role !== undefined) {
    values.role = user.role;
    updateSet.role = user.role;
  } else if (user.openId === ENV.ownerOpenId) {
    values.role = "admin";
    updateSet.role = "admin";
  }
  if (!values.lastSignedIn) values.lastSignedIn = new Date();
  if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();
  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0];
}

export async function listCategories(includeHidden = false) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(categories)
    .where(includeHidden ? undefined : eq(categories.isVisible, 1))
    .orderBy(asc(categories.sortOrder), asc(categories.name));
}

export type ProductFilters = {
  search?: string;
  categoryId?: number;
  material?: string;
  color?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: "newest" | "price-low" | "price-high" | "featured";
  page?: number;
  limit?: number;
};

export async function listProducts(filters: ProductFilters = {}) {
  const db = await getDb();
  if (!db) return { items: [], total: 0 };
  const conditions = [eq(products.isVisible, 1)];
  if (filters.categoryId) conditions.push(or(eq(products.categoryId, filters.categoryId), eq(products.subcategoryId, filters.categoryId))!);
  if (filters.search) conditions.push(like(products.name, `%${filters.search}%`));
  if (filters.material) conditions.push(eq(products.material, filters.material));
  if (filters.color) conditions.push(eq(products.color, filters.color));
  if (filters.minPrice !== undefined) conditions.push(gte(products.price, filters.minPrice.toFixed(2)));
  if (filters.maxPrice !== undefined) conditions.push(lte(products.price, filters.maxPrice.toFixed(2)));
  const page = Math.max(filters.page ?? 1, 1);
  const limit = Math.min(Math.max(filters.limit ?? 12, 1), 48);
  const offset = (page - 1) * limit;
  const orderBy = filters.sort === "price-low" ? asc(products.price) : filters.sort === "price-high" ? desc(products.price) : filters.sort === "featured" ? desc(products.isFeatured) : desc(products.createdAt);
  const rows = await db.select().from(products).where(and(...conditions)).orderBy(orderBy).limit(limit).offset(offset);
  const allRows = await db.select({ id: products.id }).from(products).where(and(...conditions));
  const pricingCategories = await db.select({ id: categories.id, discountType: categories.discountType, discountValue: categories.discountValue }).from(categories);
  const categoryPricing = new Map(pricingCategories.map(category => [category.id, category]));
  const store = await getStoreSettings();
  const storeDiscountPercentage = store.storeDiscountEnabled ? Number(store.storeDiscountPercentage) : 0;
  const now = new Date();
  const items = rows.map(product => {
    const productSaleActive = (!product.saleStartsAt || product.saleStartsAt <= now) && (!product.saleEndsAt || product.saleEndsAt >= now);
    let activeDiscount = product.discountPrice ? Number(product.discountPrice) : null;
    if (activeDiscount === null && productSaleActive && product.discountType && product.discountValue) {
      activeDiscount = product.discountType === "percentage" ? Number(product.price) * (1 - Number(product.discountValue) / 100) : Number(product.price) - Number(product.discountValue);
    }
    if (activeDiscount === null) {
      const categoryRule = categoryPricing.get(product.categoryId);
      if (categoryRule?.discountType && categoryRule.discountValue) {
        activeDiscount = categoryRule.discountType === "percentage" ? Number(product.price) * (1 - Number(categoryRule.discountValue) / 100) : Number(product.price) - Number(categoryRule.discountValue);
      }
    }
    if (storeDiscountPercentage > 0) {
      const storeDiscountedPrice = Number(product.price) * (1 - storeDiscountPercentage / 100);
      if (activeDiscount === null || storeDiscountedPrice < activeDiscount) {
        activeDiscount = storeDiscountedPrice;
      }
    }
    return { ...product, discountPrice: activeDiscount !== null ? Math.max(activeDiscount, 0).toFixed(2) : product.discountPrice };
  });
  return { items, total: allRows.length };
}

export async function getProductBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const rows = await db.select().from(products).where(eq(products.slug, slug)).limit(1);
  const product = rows[0];
  if (!product) return undefined;
  const pricingCategories = await db.select({ id: categories.id, discountType: categories.discountType, discountValue: categories.discountValue }).from(categories);
  const categoryPricing = new Map(pricingCategories.map(cat => [cat.id, cat]));
  const store = await getStoreSettings();
  const storeDiscountPercentage = store.storeDiscountEnabled ? Number(store.storeDiscountPercentage) : 0;
  const now = new Date();
  const productSaleActive = (!product.saleStartsAt || product.saleStartsAt <= now) && (!product.saleEndsAt || product.saleEndsAt >= now);
  let activeDiscount = product.discountPrice ? Number(product.discountPrice) : null;
  if (activeDiscount === null && productSaleActive && product.discountType && product.discountValue) {
    activeDiscount = product.discountType === "percentage" ? Number(product.price) * (1 - Number(product.discountValue) / 100) : Number(product.price) - Number(product.discountValue);
  }
  if (activeDiscount === null) {
    const categoryRule = categoryPricing.get(product.categoryId);
    if (categoryRule?.discountType && categoryRule.discountValue) {
      activeDiscount = categoryRule.discountType === "percentage" ? Number(product.price) * (1 - Number(categoryRule.discountValue) / 100) : Number(product.price) - Number(categoryRule.discountValue);
    }
  }
  if (storeDiscountPercentage > 0) {
    const storeDiscountedPrice = Number(product.price) * (1 - storeDiscountPercentage / 100);
    if (activeDiscount === null || storeDiscountedPrice < activeDiscount) {
      activeDiscount = storeDiscountedPrice;
    }
  }
  return { ...product, discountPrice: activeDiscount !== null ? Math.max(activeDiscount, 0).toFixed(2) : product.discountPrice };
}

export async function getHomepageSections() {
  const db = await getDb();
  if (!db) return [];
  const existing = await db.select().from(homepageSections).orderBy(asc(homepageSections.sortOrder));
  if (existing.length) return existing;
  const defaults = [
    { sectionKey: "categories", label: "Collection categories", isVisible: 1, sortOrder: 1 },
    { sectionKey: "featured", label: "Featured collection", isVisible: 1, sortOrder: 2 },
    { sectionKey: "flash-sale", label: "Flash sale banner", isVisible: 1, sortOrder: 3 },
    { sectionKey: "new-arrivals", label: "New arrivals", isVisible: 1, sortOrder: 4 },
    { sectionKey: "story", label: "Brand story", isVisible: 1, sortOrder: 5 },
    { sectionKey: "reviews", label: "Verified review module", isVisible: 1, sortOrder: 6 },
    { sectionKey: "newsletter", label: "Newsletter signup", isVisible: 1, sortOrder: 7 },
  ];
  await db.insert(homepageSections).values(defaults);
  return db.select().from(homepageSections).orderBy(asc(homepageSections.sortOrder));
}

export async function getFooterSettings() {
  const db = await getDb();
  if (!db) {
    return {
      id: 1,
      tagline: "Luxury jewelry and accessories crafted for every woman.",
      copyright: "© 2026 By Salma",
      exploreLinks: JSON.stringify([
        { label: "Shop all", href: "/shop" },
        { label: "Jewelry", href: "/shop?category=jewelry" },
        { label: "Purses", href: "/shop?category=purses" },
        { label: "Accessories", href: "/shop?category=accessories" },
      ]),
      careLinks: JSON.stringify([
        { label: "Our story", href: "/about" },
        { label: "Journal", href: "/journal" },
        { label: "Shipping & returns", href: "/shipping" },
        { label: "Contact us", href: "/contact" },
      ]),
      socialText: "Stories, styling and a closer look at the atelier.",
      socialHandle: "@bysalma",
      socialHref: "https://instagram.com",
      facebookHref: "https://facebook.com",
      instagramHref: "https://instagram.com",
      whatsappNumber: "+923000000000",
    };
  }
  const existing = await db.select().from(footerSettings).limit(1);
  if (existing[0]) return existing[0];
  const defaultSettings = {
    tagline: "Luxury jewelry and accessories crafted for every woman.",
    copyright: "© 2026 By Salma",
    exploreLinks: JSON.stringify([
      { label: "Shop all", href: "/shop" },
      { label: "Jewelry", href: "/shop?category=jewelry" },
      { label: "Purses", href: "/shop?category=purses" },
      { label: "Accessories", href: "/shop?category=accessories" },
    ]),
    careLinks: JSON.stringify([
      { label: "Our story", href: "/about" },
      { label: "Journal", href: "/journal" },
      { label: "Shipping & returns", href: "/shipping" },
      { label: "Contact us", href: "/contact" },
    ]),
    socialText: "Stories, styling and a closer look at the atelier.",
    socialHandle: "@bysalma",
    socialHref: "https://instagram.com",
    facebookHref: "https://facebook.com",
    instagramHref: "https://instagram.com",
    whatsappNumber: "+923000000000",
  };
  await db.insert(footerSettings).values(defaultSettings);
  const rows = await db.select().from(footerSettings).limit(1);
  return rows[0] ?? defaultSettings;
}

export async function updateFooterSettings(data: { tagline: string; copyright: string; exploreLinks: string; careLinks: string; socialText: string; socialHandle: string; socialHref: string; facebookHref: string; instagramHref: string; whatsappNumber: string }) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  const existing = await db.select().from(footerSettings).limit(1);
  if (existing[0]) {
    await db.update(footerSettings).set(data).where(eq(footerSettings.id, existing[0].id));
    const rows = await db.select().from(footerSettings).where(eq(footerSettings.id, existing[0].id)).limit(1);
    return rows[0];
  }
  const result = await db.insert(footerSettings).values(data);
  const rows = await db.select().from(footerSettings).where(eq(footerSettings.id, Number(result[0].insertId))).limit(1);
  return rows[0];
}

export async function getStoreSettings() {
  const db = await getDb();
  const defaultStore = {
    id: 1,
    atelierLocation: "Gulberg III, Lahore, Pakistan",
    supportEmail: "concierge@bysalma.com",
    supportPhone: "+92 (42) 3500 SALMA",
    hoursOfOperation: "Monday — Saturday: 10:00 AM – 7:00 PM PKT",
    contactHeadline: "Get in touch.",
    contactIntro: "We are at your disposal for styling inquiries, order tracking, and bespoke requests.",
    shippingHeadline: "Shipping & Returns.",
    shippingIntro: "Committed to immaculate presentation and secure doorstep delivery.",
    shippingCards: JSON.stringify([
      { title: "Complimentary Delivery", description: "Enjoy free insured delivery across Pakistan on all orders exceeding PKR 10,000.", icon: "package" },
      { title: "14-Day Exchanges", description: "Unworn pieces in original atelier packaging may be exchanged within 14 days.", icon: "refresh" },
      { title: "Secure Packaging", description: "Every order arrives in our signature branded keepsake box with care instructions.", icon: "shield" },
    ]),
    shippingSections: JSON.stringify([
      { title: "1. Delivery Timelines", body: "Orders are dispatched from our Lahore atelier within 24 to 48 hours. Standard delivery across major cities takes 2-4 business days. Express dispatch options are available upon request during checkout." },
      { title: "2. Returns & Care Guarantees", body: "We take immense pride in our craftsmanship. If you receive an item with a manufacturing defect or wish to exchange for a different size, our client concierge will arrange a complimentary return pickup." },
    ]),
    storeDiscountEnabled: 0,
    storeDiscountPercentage: "0",
    brandLogoUrl: "",
    brandMonogram: "BS",
    brandTitle: "BY SALMA",
    themeMode: "light",
  };
  if (!db) return defaultStore;
  const existing = await db.select().from(storeSettings).limit(1);
  if (existing[0]) return existing[0];
  await db.insert(storeSettings).values(defaultStore);
  const rows = await db.select().from(storeSettings).limit(1);
  return rows[0] ?? defaultStore;
}

export async function updateStoreSettings(data: { atelierLocation: string; supportEmail: string; supportPhone: string; hoursOfOperation: string; contactHeadline: string; contactIntro: string; shippingHeadline: string; shippingIntro: string; shippingCards: string; shippingSections: string; storeDiscountEnabled: number; storeDiscountPercentage: string; brandLogoUrl: string; brandMonogram: string; brandTitle: string; themeMode: string }) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  const existing = await db.select().from(storeSettings).limit(1);
  if (existing[0]) {
    await db.update(storeSettings).set(data).where(eq(storeSettings.id, existing[0].id));
    const rows = await db.select().from(storeSettings).where(eq(storeSettings.id, existing[0].id)).limit(1);
    return rows[0];
  }
  const result = await db.insert(storeSettings).values(data);
  const rows = await db.select().from(storeSettings).where(eq(storeSettings.id, Number(result[0].insertId))).limit(1);
  return rows[0];
}

export async function createContactInquiry(data: { name: string; email: string; subject: string; message: string }) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  const result = await db.insert(contactInquiries).values(data);
  const rows = await db.select().from(contactInquiries).where(eq(contactInquiries.id, Number(result[0].insertId))).limit(1);
  return rows[0];
}

export async function listContactInquiries() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(contactInquiries).orderBy(desc(contactInquiries.createdAt));
}

export async function updateContactInquiryStatus(id: number, status: string) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  await db.update(contactInquiries).set({ status }).where(eq(contactInquiries.id, id));
  const rows = await db.select().from(contactInquiries).where(eq(contactInquiries.id, id)).limit(1);
  return rows[0];
}

export async function getCart(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(cartItems).where(eq(cartItems.userId, userId)).orderBy(desc(cartItems.createdAt));
}

export async function addToCart(userId: number, productId: number, quantity: number) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  const existing = await db.select().from(cartItems).where(and(eq(cartItems.userId, userId), eq(cartItems.productId, productId))).limit(1);
  if (existing[0]) {
    await db.update(cartItems).set({ quantity: existing[0].quantity + quantity }).where(eq(cartItems.id, existing[0].id));
    return { ...existing[0], quantity: existing[0].quantity + quantity };
  }
  const result = await db.insert(cartItems).values({ userId, productId, quantity });
  return { id: Number(result[0].insertId), userId, productId, quantity };
}

export async function updateCartItem(userId: number, id: number, quantity: number) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  if (quantity <= 0) {
    await db.delete(cartItems).where(and(eq(cartItems.id, id), eq(cartItems.userId, userId)));
    return null;
  }
  await db.update(cartItems).set({ quantity }).where(and(eq(cartItems.id, id), eq(cartItems.userId, userId)));
  const rows = await db.select().from(cartItems).where(eq(cartItems.id, id)).limit(1);
  return rows[0];
}

export async function clearCart(userId: number) {
  const db = await getDb();
  if (!db) return;
  await db.delete(cartItems).where(eq(cartItems.userId, userId));
}

export async function getCoupon(code: string) {
  const db = await getDb();
  if (!db) return undefined;
  const rows = await db.select().from(coupons).where(eq(coupons.code, code.toUpperCase())).limit(1);
  const coupon = rows[0];
  if (!coupon || !coupon.isActive || (coupon.expiresAt && coupon.expiresAt < new Date())) return undefined;
  if (coupon.usageLimit > 0 && coupon.usageCount >= coupon.usageLimit) return undefined;
  return coupon;
}

export async function createOrder(input: {
  userId?: number;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  orderNotes?: string;
  subtotal: string;
  shipping: string;
  discount: string;
  tax: string;
  total: string;
  couponCode?: string;
  paymentMethod: "cod" | "stripe";
  items: Array<{ productId: number; productName: string; unitPrice: string; quantity: number }>;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  const result = await db.insert(orders).values({ ...input, userId: input.userId ?? null, couponCode: input.couponCode ?? null });
  const orderId = Number(result[0].insertId);
  await db.insert(orderItems).values(input.items.map(item => ({ ...item, orderId })));
  if (input.couponCode) {
    const coupon = await getCoupon(input.couponCode);
    if (coupon) await db.update(coupons).set({ usageCount: coupon.usageCount + 1 }).where(eq(coupons.id, coupon.id));
  }
  if (input.userId) await clearCart(input.userId);
  return { orderId };
}

export async function listOrders(userId?: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(orders).where(userId ? eq(orders.userId, userId) : undefined).orderBy(desc(orders.createdAt));
}

export async function createCategory(input: typeof categories.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  const result = await db.insert(categories).values(input);
  return { id: Number(result[0].insertId) };
}

export async function updateCategory(id: number, input: Partial<typeof categories.$inferInsert>) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  await db.update(categories).set(input).where(eq(categories.id, id));
  return { id };
}

export async function listAdminProducts() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(products).orderBy(desc(products.createdAt));
}

export async function listAdminOrders() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(orders).orderBy(desc(orders.createdAt));
}

export async function updateOrderStatus(id: number, status: "pending" | "processing" | "shipped" | "delivered" | "cancelled") {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  await db.update(orders).set({ status }).where(eq(orders.id, id));
  return { id, status };
}

export async function updateProduct(id: number, input: Partial<typeof products.$inferInsert>) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  await db.update(products).set(input).where(eq(products.id, id));
  return { id };
}

export async function deleteProduct(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  await db.delete(products).where(eq(products.id, id));
  return { id };
}

export async function createProduct(input: typeof products.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  const result = await db.insert(products).values(input);
  return { id: Number(result[0].insertId) };
}

export async function updateHomepageSection(id: number, isVisible: number) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  await db.update(homepageSections).set({ isVisible }).where(eq(homepageSections.id, id));
  return { id, isVisible };
}

export async function listAdminCoupons() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(coupons).orderBy(desc(coupons.createdAt));
}

export async function createCoupon(input: typeof coupons.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  const result = await db.insert(coupons).values({ ...input, code: input.code.toUpperCase() });
  return { id: Number(result[0].insertId) };
}

export async function getActiveShippingRule() {
  const db = await getDb();
  if (!db) return undefined;
  const rows = await db.select().from(shippingRules).where(eq(shippingRules.isActive, 1)).orderBy(asc(shippingRules.freeAbove)).limit(1);
  return rows[0];
}

export async function listAdminShippingRules() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(shippingRules);
}

export async function createShippingRule(input: typeof shippingRules.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  const result = await db.insert(shippingRules).values(input);
  return { id: Number(result[0].insertId) };
}
