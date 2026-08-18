import { ArrowRight, PackageCheck, RefreshCw, ShieldCheck } from "lucide-react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";

const iconMap = { package: PackageCheck, refresh: RefreshCw, shield: ShieldCheck };

export default function Shipping() {
  const { data: store } = trpc.admin.storeSettings.useQuery(undefined, { retry: false });
  const cards = (() => {
    try {
      return JSON.parse(store?.shippingCards ?? "[]") as Array<{ title: string; description: string; icon: keyof typeof iconMap }>;
    } catch { return []; }
  })();
  const sections = (() => {
    try {
      return JSON.parse(store?.shippingSections ?? "[]") as Array<{ title: string; body: string }>;
    } catch { return []; }
  })();
  const fallbackCards = [
    { title: "Complimentary Delivery", description: "Enjoy free insured delivery across Pakistan on all orders exceeding PKR 10,000.", icon: "package" as const },
    { title: "14-Day Exchanges", description: "Unworn pieces in original atelier packaging may be exchanged within 14 days.", icon: "refresh" as const },
    { title: "Secure Packaging", description: "Every order arrives in our signature branded keepsake box with care instructions.", icon: "shield" as const },
  ];
  const fallbackSections = [
    { title: "1. Delivery Timelines", body: "Orders are dispatched from our Lahore atelier within 24 to 48 hours. Standard delivery across major cities takes 2-4 business days. Express dispatch options are available upon request during checkout." },
    { title: "2. Returns & Care Guarantees", body: "We take immense pride in our craftsmanship. If you receive an item with a manufacturing defect or wish to exchange for a different size, our client concierge will arrange a complimentary return pickup." },
  ];

  return (
    <div className="min-h-screen bg-[#fbf8f2] text-[#302923]">
      <div className="border-b border-[#e8dfd4] bg-[#f5f0e7] py-16 text-center">
        <p className="eyebrow">Client Services</p>
        <h1 className="mt-3 font-serif text-5xl sm:text-6xl text-[#2f2a25]" dangerouslySetInnerHTML={{ __html: store?.shippingHeadline ?? "Shipping & <em>Returns.</em>" }} />
        <p className="mx-auto mt-4 max-w-lg text-sm text-[#706358] leading-7">{store?.shippingIntro ?? "Committed to immaculate presentation and secure doorstep delivery."}</p>
      </div>
      <main className="container py-20 max-w-4xl">
        <div className="grid gap-8 sm:grid-cols-3 mb-16">
          {(cards.length ? cards : fallbackCards).map((card, index) => {
            const Icon = iconMap[card.icon] ?? [PackageCheck, RefreshCw, ShieldCheck][index % 3];
            return <div key={`${card.title}-${index}`} className="bg-[#f5f0e7] p-6 border border-[#e5dcd1]"><Icon className="text-[#a37946] mb-3" size={24} /><h3 className="font-serif text-xl text-[#2f2a25]">{card.title}</h3><p className="mt-2 text-xs text-[#706358] leading-6">{card.description}</p></div>;
          })}
        </div>
        <div className="space-y-8 text-sm text-[#706358] leading-8">
          {(sections.length ? sections : fallbackSections).map((section, index) => <section key={`${section.title}-${index}`} className="bg-[#fffdf9] p-8 border border-[#e7ded3]"><h2 className="font-serif text-2xl text-[#2f2a25] mb-3">{section.title}</h2><p>{section.body}</p></section>)}
        </div>
        <div className="mt-12 text-center"><Link href="/contact" className="gold-button">Contact Concierge <ArrowRight size={15} /></Link></div>
      </main>
    </div>
  );
}
