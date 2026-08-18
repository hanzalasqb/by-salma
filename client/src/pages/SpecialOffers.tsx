import { Link } from "wouter";
import { ArrowRight, Sparkles } from "lucide-react";
import { Header, ProductCard, money } from "./Home";
import { trpc } from "@/lib/trpc";

export default function SpecialOffers() {
  const { data: store } = trpc.admin.storeSettings.useQuery(undefined, { retry: false });
  const { data: catalog } = trpc.catalog.products.useQuery({ limit: 48 });
  const storeDiscountActive = Boolean(store?.storeDiscountEnabled && Number(store?.storeDiscountPercentage) > 0);
  const storeDiscountPercentage = store?.storeDiscountPercentage ?? "0";

  const allProducts = catalog?.items ?? [];
  const discountedProducts = allProducts.filter(item => {
    if (item.discountPrice && Number(item.discountPrice) < Number(item.price)) return true;
    return storeDiscountActive;
  });

  return (
    <div className="min-h-screen bg-[#fbf8f2] text-[#302923]">
      <Header />
      <div className="border-b border-[#e8dfd4] bg-[#f5f0e7] py-16 text-center">
        <p className="eyebrow flex items-center justify-center gap-2"><Sparkles size={14} className="text-[#a37946]" /> Curated Reductions</p>
        <h1 className="mt-3 font-serif text-5xl sm:text-6xl text-[#2f2a25]">Special <em>Offers.</em></h1>
        <p className="mx-auto mt-4 max-w-lg text-sm text-[#706358] leading-7">
          {storeDiscountActive ? `Store-wide ${storeDiscountPercentage}% privilege is currently active across the atelier collection.` : "Exceptional pieces featured with seasonal reductions and atelier privileges."}
        </p>
      </div>
      <main className="container py-16 max-w-7xl">
        {discountedProducts.length ? (
          <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {discountedProducts.map(product => <ProductCard key={product.id} product={product} />)}
          </div>
        ) : (
          <div className="border border-dashed border-[#d7cbbd] py-28 text-center bg-[#fffdf9]">
            <p className="font-serif text-3xl">No active reductions at this moment.</p>
            <p className="mt-3 text-sm text-[#8e8071]">Explore the complete signature collection or check back during atelier release windows.</p>
            <Link href="/shop" className="gold-button mt-7">Explore collection <ArrowRight size={15} /></Link>
          </div>
        )}
      </main>
    </div>
  );
}
