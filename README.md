<div align="center">

# 💎 By Salma — Full-Stack E-Commerce Platform

**A cinematic jewellery storefront with a complete admin back-office: catalog, cart, checkout, coupons, shipping rules and order management.**

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white)
![tRPC](https://img.shields.io/badge/tRPC-2596BE?logo=trpc&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?logo=mysql&logoColor=white)
![Drizzle](https://img.shields.io/badge/Drizzle_ORM-C5F74F?logo=drizzle&logoColor=black)
![AWS S3](https://img.shields.io/badge/AWS_S3-569A31?logo=amazons3&logoColor=white)

</div>

---

## ✨ Features

### 🛍️ Storefront
- Cinematic hero with a CSS 3D diamond-ring animation and editorial collections
- Product grid with filters, quick view, wishlist and compare
- Product detail pages with multi-image galleries
- Cart, discount-code quotes and **Cash-on-Delivery checkout**
- Customer order history with printable invoices and order confirmation

### 🧑‍💼 Admin panel (role-based)
- Products, categories and multi-image media (S3 uploads)
- Orders and fulfilment status
- Coupons and discount rules
- Shipping rules
- Homepage section visibility toggles and store settings

### ⚙️ Engineering
- End-to-end type-safe API with **tRPC + Zod**
- Relational schema for categories, products, carts, orders, order items, coupons and shipping (Drizzle + MySQL)
- Server-side price & discount calculation (never trusted from the client)
- Stripe integration architected and ready to enable for online payments
- Vitest unit tests for auth and checkout quote calculations

## 🛠️ Tech stack

React 19 · TypeScript · Vite · Tailwind CSS · shadcn/ui · tRPC · Express · Drizzle ORM · MySQL · AWS S3 · Vitest

## 🚀 Getting started

```bash
git clone https://github.com/hanzalasqb/by-salma.git
cd by-salma
pnpm install
# create a .env file with: DATABASE_URL, JWT secret, S3 credentials
pnpm db:push
pnpm dev
```

## 📁 Structure

```
client/    Storefront + admin UI
server/    tRPC routers: catalog, cart, checkout, orders, admin
shared/    Shared types and validation
drizzle/   Schema and migrations
```

## 👤 Author

**Hanzala Saqib** — Full Stack AI Developer · [GitHub](https://github.com/hanzalasqb)
