import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

const context = { user: null, req: {} as TrpcContext["req"], res: {} as TrpcContext["res"] } satisfies TrpcContext;
const adminContext = {
  user: { id: 1, openId: "admin-test", name: "Admin Test", email: "admin@example.com", loginMethod: "email", role: "admin", createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date() },
  req: {} as TrpcContext["req"],
  res: {} as TrpcContext["res"],
} satisfies TrpcContext;

describe("checkout.quote", () => {
  it("adds the standard delivery charge below the free-shipping threshold", async () => {
    const quote = await appRouter.createCaller(context).checkout.quote({ subtotal: 5000 });
    expect(quote.shipping).toBe(250);
    expect(quote.discount).toBe(0);
    expect(quote.total).toBe(5250);
  });

  it("makes delivery complimentary once the threshold is met", async () => {
    const quote = await appRouter.createCaller(context).checkout.quote({ subtotal: 12000 });
    expect(quote.shipping).toBe(0);
    expect(quote.total).toBe(12000);
  });

  it("exposes a graceful recommendation response for an unavailable product", async () => {
    const result = await appRouter.createCaller(context).catalog.recommendations({ slug: "missing-product", limit: 3 });
    expect(result.items).toEqual([]);
    expect(result.message).toContain("Curated");
  });

  it("loads admin promotion queries without passing a Promise as a table", async () => {
    const caller = appRouter.createCaller(adminContext);
    const [coupons, shippingRules] = await Promise.all([caller.admin.coupons(), caller.admin.shippingRules()]);
    expect(Array.isArray(coupons)).toBe(true);
    expect(Array.isArray(shippingRules)).toBe(true);
  });
});
