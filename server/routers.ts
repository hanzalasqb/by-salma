import { z } from "zod";
import { storagePut } from "./storage";
import { invokeLLM } from "./_core/llm";
import { COOKIE_NAME } from "@shared/const";
import { eq } from "drizzle-orm";
import { getSessionCookieOptions } from "./_core/cookies";
import { adminProcedure, protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { coupons, shippingRules } from "../drizzle/schema";
import {
  getCart,
  addToCart,
  updateCartItem,
  clearCart,
  getActiveShippingRule,
  getCoupon,
  getHomepageSections,
  getFooterSettings,
  updateFooterSettings,
  getStoreSettings,
  updateStoreSettings,
  createContactInquiry,
  listContactInquiries,
  updateContactInquiryStatus,
  getProductBySlug,
  listAdminOrders,
  listAdminProducts,
  listCategories,
  listOrders,
  listProducts,
  createCategory,
  updateCategory,
  createCoupon,
  createOrder,
  createProduct,
  updateProduct,
  deleteProduct,
  createShippingRule,
  updateHomepageSection,
  updateOrderStatus,
} from "./db";

const productInput = z.object({
  categoryId: z.number().int().positive(),
  subcategoryId: z.number().int().positive().nullable().optional(),
  name: z.string().min(2),
  slug: z.string().min(2),
  sku: z.string().min(2),
  description: z.string().optional(),
  careGuide: z.string().optional(),
  price: z.string(),
  discountPrice: z.string().nullable().optional(),
  stock: z.number().int().min(0),
  material: z.string().optional(),
  color: z.string().optional(),
  size: z.string().optional(),
  imageUrl: z.string().url().optional(),
  images: z.array(z.string().url()).optional(),
  isFeatured: z.number().int().min(0).max(1).default(0),
  isNew: z.number().int().min(0).max(1).default(0),
  isBestSeller: z.number().int().min(0).max(1).default(0),
});

export const appRouter = router({
  system: router({}),
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  catalog: router({
    categories: publicProcedure.query(() => listCategories()),
    products: publicProcedure.input(z.object({
      search: z.string().optional(),
      categoryId: z.number().int().optional(),
      material: z.string().optional(),
      color: z.string().optional(),
      minPrice: z.number().optional(),
      maxPrice: z.number().optional(),
      sort: z.enum(["newest", "price-low", "price-high", "featured"]).optional(),
      page: z.number().int().positive().optional(),
      limit: z.number().int().positive().max(48).optional(),
    }).optional()).query(({ input }) => listProducts(input ?? {})),
    product: publicProcedure.input(z.object({ slug: z.string() })).query(async ({ input }) => (await getProductBySlug(input.slug)) ?? null),
    recommendations: publicProcedure.input(z.object({ slug: z.string(), limit: z.number().int().positive().max(6).optional() })).query(async ({ input }) => {
      const dbCurrent = await getProductBySlug(input.slug);
      const dbCatalog = await listProducts({ limit: 48, sort: "featured" });
      const DEMO_LIST = [
        { id: 101, slug: "aurora-heirloom-ring", name: "Aurora Heirloom Ring", category: "Jewelry", price: 12900, discountPrice: 10400, material: "18k gold vermeil", color: "Champagne", imageUrl: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=900&q=85", description: "A sculptural silhouette with an heirloom presence." },
        { id: 102, slug: "celeste-drop-earrings", name: "Celeste Drop Earrings", category: "Jewelry", price: 8600, discountPrice: null, material: "Gold plated", color: "Gold", imageUrl: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=900&q=85", description: "Light-catching drops designed for the evening." },
        { id: 103, slug: "nocturne-mini-bag", name: "Nocturne Mini Bag", category: "Purses", price: 18400, discountPrice: 15900, material: "Vegan leather", color: "Noir", imageUrl: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=85", description: "A compact evening shape with a confident line." },
        { id: 104, slug: "solstice-chain", name: "Solstice Chain", category: "Jewelry", price: 11200, discountPrice: null, material: "Sterling silver", color: "Silver", imageUrl: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=85", description: "An elegant everyday chain with a soft sculptural rhythm." },
        { id: 105, slug: "muse-top-handle", name: "Muse Top Handle", category: "Purses", price: 22100, discountPrice: null, material: "Pebbled leather", color: "Ivory", imageUrl: "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=900&q=85", description: "A polished top-handle designed for day-to-night dressing." },
        { id: 106, slug: "pearl-veil-bracelet", name: "Pearl Veil Bracelet", category: "Accessories", price: 7900, discountPrice: 5900, material: "Freshwater pearl", color: "Ivory", imageUrl: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=900&q=85", description: "A luminous strand with a modern, quiet glow." },
      ];
      const demoMatch = DEMO_LIST.find((item: { slug: string }) => item.slug === input.slug);
      const current = dbCurrent ?? (demoMatch ? { id: demoMatch.id, name: demoMatch.name, slug: demoMatch.slug, categoryId: 1, material: demoMatch.material, color: demoMatch.color, price: String(demoMatch.price), discountPrice: demoMatch.discountPrice ? String(demoMatch.discountPrice) : null, description: demoMatch.description } : null);
      const candidates = dbCatalog.items.length ? dbCatalog.items.filter((item: { slug: string }) => item.slug !== input.slug) : DEMO_LIST.filter(item => item.slug !== input.slug).map((item: { id: number; name: string; slug: string; material?: string; color?: string; price: number; discountPrice: number | null; description?: string; imageUrl?: string }) => ({ id: item.id, name: item.name, slug: item.slug, categoryId: 1, material: item.material, color: item.color, price: String(item.price), discountPrice: item.discountPrice ? String(item.discountPrice) : null, description: item.description, stock: 10, sku: `DEMO-${item.id}`, isVisible: 1, createdAt: new Date(), updatedAt: new Date(), subcategoryId: null, careGuide: null, size: null, imageUrl: item.imageUrl, images: null, isFeatured: 0, isNew: 0, isBestSeller: 0, discountType: null, discountValue: null, saleStartsAt: null, saleEndsAt: null, seoTitle: null, metaDescription: null }));
      if (!current || !candidates.length) return { items: [], message: "Curated pairings will appear as the atelier grows." };
      const candidateContext = candidates.map(item => ({ id: item.id, name: item.name, category: item.categoryId, material: item.material, color: item.color, price: item.price, description: item.description })).slice(0, 48);
      try {
        const response = await invokeLLM({
          messages: [
            { role: "system", content: "You are By Salma's private atelier stylist. Recommend products that complement the current piece. Return only valid JSON matching the requested schema. Prefer material, color, category, price, and occasion harmony over generic popularity." },
            { role: "user", content: JSON.stringify({ currentProduct: { name: current.name, category: current.categoryId, material: current.material, color: current.color, price: current.price, description: current.description }, candidates: candidateContext }) },
          ],
          response_format: { type: "json_schema", json_schema: { name: "product_recommendations", strict: true, schema: { type: "object", properties: { recommendationIds: { type: "array", items: { type: "integer" }, minItems: 1, maxItems: 6 }, reason: { type: "string" } }, required: ["recommendationIds", "reason"], additionalProperties: false } } },
        });
        const content = response.choices[0]?.message?.content;
        const parsed = typeof content === "string" ? JSON.parse(content) as { recommendationIds?: number[]; reason?: string } : {};
        const byId = new Map(candidates.map(item => [item.id, item]));
        const items = (parsed.recommendationIds ?? []).map(id => byId.get(id)).filter(Boolean).slice(0, input.limit ?? 3);
        if (items.length) return { items, message: parsed.reason ?? "Chosen by the By Salma atelier stylist." };
      } catch (error) {
        console.warn("[Recommendations] AI fallback used:", error);
      }
      const fallback = candidates.filter(item => item.categoryId === current.categoryId || item.material === current.material || item.color === current.color).slice(0, input.limit ?? 3);
      return { items: fallback.length ? fallback : candidates.slice(0, input.limit ?? 3), message: "Curated by material, color, and silhouette." };
    }),
    homepageSections: publicProcedure.query(() => getHomepageSections()),
  }),
  cart: router({
    list: protectedProcedure.query(({ ctx }) => getCart(ctx.user.id)),
    add: protectedProcedure.input(z.object({ productId: z.number().int().positive(), quantity: z.number().int().positive().max(99).default(1) })).mutation(({ ctx, input }) => addToCart(ctx.user.id, input.productId, input.quantity)),
    update: protectedProcedure.input(z.object({ id: z.number().int().positive(), quantity: z.number().int().min(0).max(99) })).mutation(({ ctx, input }) => updateCartItem(ctx.user.id, input.id, input.quantity)),
    clear: protectedProcedure.mutation(({ ctx }) => clearCart(ctx.user.id).then(() => ({ success: true }))),
  }),
  checkout: router({
    quote: publicProcedure.input(z.object({ subtotal: z.number().nonnegative(), couponCode: z.string().optional() })).query(async ({ input }) => {
      const rawCode = input.couponCode?.trim();
      let coupon = undefined;
      let invalidReason: string | null = null;
      if (rawCode) {
        const db = await import("./db").then(m => m.getDb());
        const rows = db ? await db.select().from(coupons).where(eq(coupons.code, rawCode.toUpperCase())).limit(1) : [];
        const dbCoupon = rows[0];
        if (!dbCoupon) {
          invalidReason = "This coupon code does not exist.";
        } else if (!dbCoupon.isActive) {
          invalidReason = "This coupon code is currently paused.";
        } else if (dbCoupon.expiresAt && dbCoupon.expiresAt < new Date()) {
          invalidReason = "This coupon code has expired.";
        } else if (dbCoupon.usageLimit > 0 && dbCoupon.usageCount >= dbCoupon.usageLimit) {
          invalidReason = "This coupon code has reached its maximum usage limit.";
        } else if (input.subtotal < Number(dbCoupon.minimumOrder)) {
          invalidReason = `This code requires a minimum order of PKR ${dbCoupon.minimumOrder}.`;
        } else {
          coupon = dbCoupon;
        }
      }
      let discount = 0;
      if (coupon) {
        discount = coupon.discountType === "percentage" ? input.subtotal * (Number(coupon.value) / 100) : Number(coupon.value);
      }
      const shippingRule = await getActiveShippingRule();
      const freeAbove = shippingRule ? Number(shippingRule.freeAbove) : 10000;
      const flatRate = shippingRule ? Number(shippingRule.flatRate) : 250;
      const shipping = input.subtotal - discount >= freeAbove ? 0 : flatRate;
      const tax = 0;
      return { subtotal: input.subtotal, discount: Math.min(discount, input.subtotal), shipping, tax, total: Math.max(input.subtotal - discount + shipping + tax, 0), coupon: coupon?.code ?? null, invalidReason };
    }),
    createOrder: publicProcedure.input(z.object({
      customerName: z.string().min(2), email: z.string().email(), phone: z.string().min(5), address: z.string().min(5), city: z.string().min(2), province: z.string().min(2), postalCode: z.string().min(2), orderNotes: z.string().optional(), subtotal: z.string(), shipping: z.string(), discount: z.string(), tax: z.string(), total: z.string(), couponCode: z.string().optional(), paymentMethod: z.enum(["cod", "stripe"]), items: z.array(z.object({ productId: z.number().int().positive(), productName: z.string(), unitPrice: z.string(), quantity: z.number().int().positive() })).min(1),
    })).mutation(({ ctx, input }) => createOrder({ ...input, userId: ctx.user?.id })),
  }),
  orders: router({
    mine: protectedProcedure.query(({ ctx }) => listOrders(ctx.user.id)),
  }),
  admin: router({
    uploadAsset: adminProcedure.input(z.object({ filename: z.string().min(1), mimeType: z.string().regex(/^image\//), base64: z.string().min(1).max(8_000_000) })).mutation(async ({ ctx, input }) => { const safeName = input.filename.replace(/[^a-zA-Z0-9._-]/g, "-"); const buffer = Buffer.from(input.base64, "base64"); if (buffer.byteLength > 6_000_000) throw new Error("Images must be 6MB or smaller"); return storagePut(`admin/${ctx.user.id}/${Date.now()}-${safeName}`, buffer, input.mimeType); }),
    categories: adminProcedure.query(() => listCategories(true)),
    createCategory: adminProcedure.input(z.object({ name: z.string().min(2), slug: z.string().min(2), parentId: z.number().int().positive().nullable().optional(), description: z.string().optional(), bannerUrl: z.string().url().optional(), iconUrl: z.string().url().optional(), sortOrder: z.number().int().default(0) })).mutation(({ input }) => createCategory({ ...input, parentId: input.parentId ?? null, description: input.description ?? null, bannerUrl: input.bannerUrl ?? null, iconUrl: input.iconUrl ?? null, seoTitle: null, metaDescription: null, isVisible: 1 })),
    updateCategory: adminProcedure.input(z.object({ id: z.number().int().positive(), name: z.string().min(2).optional(), isVisible: z.number().int().min(0).max(1).optional(), sortOrder: z.number().int().optional() })).mutation(({ input }) => updateCategory(input.id, { name: input.name, isVisible: input.isVisible, sortOrder: input.sortOrder })),
    products: adminProcedure.query(() => listAdminProducts()),
    createProduct: adminProcedure.input(productInput).mutation(({ input }) => createProduct({ ...input, discountPrice: input.discountPrice ?? null, material: input.material ?? null, color: input.color ?? null, size: input.size ?? null, description: input.description ?? null, careGuide: input.careGuide ?? null, imageUrl: input.imageUrl ?? null, images: input.images ? JSON.stringify(input.images) : null })),
    updateProduct: adminProcedure.input(z.object({ id: z.number().int().positive(), name: z.string().min(2).optional(), price: z.string().optional(), discountPrice: z.string().nullable().optional(), stock: z.number().int().min(0).optional(), description: z.string().nullable().optional(), careGuide: z.string().nullable().optional(), isVisible: z.number().int().min(0).max(1).optional(), isFeatured: z.number().int().min(0).max(1).optional(), isBestSeller: z.number().int().min(0).max(1).optional() })).mutation(({ input }) => updateProduct(input.id, { name: input.name, price: input.price, discountPrice: input.discountPrice, stock: input.stock, description: input.description, careGuide: input.careGuide, isVisible: input.isVisible, isFeatured: input.isFeatured, isBestSeller: input.isBestSeller })),
    deleteProduct: adminProcedure.input(z.object({ id: z.number().int().positive() })).mutation(({ input }) => deleteProduct(input.id)),
    orders: adminProcedure.query(() => listAdminOrders()),
    updateOrderStatus: adminProcedure.input(z.object({ id: z.number().int().positive(), status: z.enum(["pending", "processing", "shipped", "delivered", "cancelled"]) })).mutation(({ input }) => updateOrderStatus(input.id, input.status)),
    coupons: adminProcedure.query(async () => {
      const db = await import("./db").then(m => m.getDb());
      if (!db) return [];
      return db.select().from(coupons);
    }),
    createCoupon: adminProcedure.input(z.object({ code: z.string().min(2), discountType: z.enum(["percentage", "fixed"]), value: z.string(), minimumOrder: z.string().default("0"), usageLimit: z.number().int().min(0).default(0) })).mutation(({ input }) => createCoupon({ code: input.code.toUpperCase(), discountType: input.discountType, value: input.value, minimumOrder: input.minimumOrder, usageLimit: input.usageLimit, usageCount: 0, isActive: 1 })),
    shippingRules: adminProcedure.query(async () => {
      const db = await import("./db").then(m => m.getDb());
      if (!db) return [];
      return db.select().from(shippingRules);
    }),
    createShippingRule: adminProcedure.input(z.object({ name: z.string().min(2), freeAbove: z.string(), flatRate: z.string() })).mutation(({ input }) => createShippingRule({ name: input.name, freeAbove: input.freeAbove, flatRate: input.flatRate, isActive: 1 })),
    homepageSections: adminProcedure.query(() => getHomepageSections()),
    toggleHomepageSection: adminProcedure.input(z.object({ id: z.number().int().positive(), isVisible: z.number().int().min(0).max(1) })).mutation(({ input }) => updateHomepageSection(input.id, input.isVisible)),
    footerSettings: publicProcedure.query(() => getFooterSettings()),
    updateFooterSettings: adminProcedure.input(z.object({
      tagline: z.string().min(2),
      copyright: z.string().min(2),
      exploreLinks: z.string().min(2),
      careLinks: z.string().min(2),
      socialText: z.string().min(2),
      socialHandle: z.string().min(1),
      socialHref: z.string(),
      facebookHref: z.string(),
      instagramHref: z.string(),
      whatsappNumber: z.string(),
    })).mutation(({ input }) => updateFooterSettings(input)),
    storeSettings: publicProcedure.query(() => getStoreSettings()),
    updateStoreSettings: adminProcedure.input(z.object({
      atelierLocation: z.string().min(2),
      supportEmail: z.string().email(),
      supportPhone: z.string().min(2),
      hoursOfOperation: z.string().min(2),
      contactHeadline: z.string().min(2),
      contactIntro: z.string().min(2),
      shippingHeadline: z.string().min(2),
      shippingIntro: z.string().min(2),
      shippingCards: z.string().min(2),
      shippingSections: z.string().min(2),
      storeDiscountEnabled: z.number().int().min(0).max(1),
      storeDiscountPercentage: z.string().regex(/^\d{1,3}(\.\d{1,2})?$/),
      brandLogoUrl: z.string(),
      brandMonogram: z.string().min(1),
      brandTitle: z.string().min(1),
      themeMode: z.string(),
    })).mutation(({ input }) => updateStoreSettings(input)),
    contactInquiries: adminProcedure.query(() => listContactInquiries()),
    submitContactInquiry: publicProcedure.input(z.object({
      name: z.string().min(2),
      email: z.string().email(),
      subject: z.string().min(2),
      message: z.string().min(5),
    })).mutation(({ input }) => createContactInquiry(input)),
    updateInquiryStatus: adminProcedure.input(z.object({
      id: z.number().int().positive(),
      status: z.string(),
    })).mutation(({ input }) => updateContactInquiryStatus(input.id, input.status)),
  }),
});

export type AppRouter = typeof appRouter;
