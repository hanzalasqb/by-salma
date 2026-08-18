import { trpc } from "@/lib/trpc";
import { useStore, type StoreProduct } from "@/contexts/StoreContext";
import { Link } from "wouter";
import { ArrowRight, ChevronDown, Facebook, Heart, Instagram, MessageCircle, Menu, Search, ShoppingBag, Sparkles, Star, X } from "lucide-react";
import { useMemo, useState } from "react";

const DEMO_PRODUCTS: StoreProduct[] = [
  { id: 101, slug: "aurora-heirloom-ring", name: "Aurora Heirloom Ring", category: "Jewelry", price: 12900, discountPrice: 10400, material: "18k gold vermeil", color: "Champagne", imageUrl: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=900&q=85", description: "A sculptural silhouette with an heirloom presence." },
  { id: 102, slug: "celeste-drop-earrings", name: "Celeste Drop Earrings", category: "Jewelry", price: 8600, discountPrice: null, material: "Gold plated", color: "Gold", imageUrl: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=900&q=85", description: "Light-catching drops designed for the evening." },
  { id: 103, slug: "nocturne-mini-bag", name: "Nocturne Mini Bag", category: "Purses", price: 18400, discountPrice: 15900, material: "Vegan leather", color: "Noir", imageUrl: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=85", description: "A compact evening shape with a confident line." },
  { id: 104, slug: "solstice-chain", name: "Solstice Chain", category: "Jewelry", price: 11200, discountPrice: null, material: "Sterling silver", color: "Silver", imageUrl: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=85", description: "An elegant everyday chain with a soft sculptural rhythm." },
  { id: 105, slug: "muse-top-handle", name: "Muse Top Handle", category: "Purses", price: 22100, discountPrice: null, material: "Pebbled leather", color: "Ivory", imageUrl: "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=900&q=85", description: "A polished top-handle designed for day-to-night dressing." },
  { id: 106, slug: "pearl-veil-bracelet", name: "Pearl Veil Bracelet", category: "Accessories", price: 7900, discountPrice: 5900, material: "Freshwater pearl", color: "Ivory", imageUrl: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=900&q=85", description: "A luminous strand with a modern, quiet glow." },
];

const money = (value: string | number | null | undefined) => `PKR ${Number(value ?? 0).toLocaleString("en-PK")}`;
const salePrice = (product: StoreProduct) => Number(product.discountPrice ?? product.price);

function ProductCard({ product, index = 0 }: { product: StoreProduct; index?: number }) {
  const { wishlist, compare, addToCart, toggleWishlist, toggleCompare } = useStore();
  const onSale = product.discountPrice !== null && product.discountPrice !== undefined;
  const savings = onSale ? Math.round((1 - salePrice(product) / Number(product.price)) * 100) : 0;
  return (
    <article className="group min-w-0" style={{ animationDelay: `${index * 80}ms` }}>
      <div className="group/image relative aspect-[4/5] cursor-zoom-in overflow-hidden bg-[#f1ede7]">
        {product.imageUrl ? <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover/image:scale-110" /> : <div className="h-full w-full bg-gradient-to-br from-[#ede5da] via-[#fbf8f2] to-[#b9a27e]" />}
        <div className="absolute left-4 top-4 flex flex-col gap-2">
          {onSale && <span className="rounded-full bg-[#b78e58] px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-white">Save {savings}%</span>}
          {product.category === "Jewelry" && <span className="w-fit bg-white/80 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-[#3d352d] backdrop-blur">Signature</span>}
        </div>
        <div className="absolute right-3 top-3 flex flex-col gap-2 opacity-0 transition duration-300 group-hover:opacity-100">
          <button onClick={() => toggleWishlist(product.id)} aria-label="Add to wishlist" className={`flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur ${wishlist.includes(product.id) ? "text-[#a37946]" : "text-[#352f29]"}`}><Heart size={15} fill={wishlist.includes(product.id) ? "currentColor" : "none"} /></button>
          <button onClick={() => toggleCompare(product.id)} aria-label="Compare product" className={`flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur ${compare.includes(product.id) ? "text-[#a37946]" : "text-[#352f29]"}`}><Sparkles size={15} /></button>
        </div>
        <span className="pointer-events-none absolute bottom-3 left-3 z-10 border border-white/50 bg-[#26211e]/65 px-3 py-2 text-[9px] uppercase tracking-[0.18em] text-white opacity-0 backdrop-blur-sm transition duration-300 group-hover/image:opacity-100">Hover to inspect</span><button onClick={() => addToCart(product)} className="absolute bottom-4 left-4 right-4 translate-y-3 bg-[#26211e] py-3 text-[10px] uppercase tracking-[0.25em] text-white opacity-0 transition duration-300 hover:bg-[#a37946] group-hover:translate-y-0 group-hover:opacity-100">Add to bag</button>
      </div>
      <div className="flex items-start justify-between gap-3 pt-4">
        <div><p className="mb-1 text-[10px] uppercase tracking-[0.25em] text-[#a37946]">{product.category ?? "The collection"}</p><Link href={`/product/${product.slug}`} className="font-serif text-lg text-[#2f2a25] transition hover:text-[#a37946]">{product.name}</Link><p className="mt-1 text-xs text-[#8a7d71]">{product.material ?? "Designed in our atelier"}</p></div>
        <div className="whitespace-nowrap text-right text-sm"><span className={onSale ? "text-xs text-[#9f958a] line-through" : "text-[#2f2a25]"}>{money(product.price)}</span>{onSale && <span className="ml-2 text-[#a37946]">{money(product.discountPrice)}</span>}</div>
      </div>
    </article>
  );
}

function RingScene() {
  return <div className="hero-visual hidden [@media(min-width:401px)]:block" aria-label="Cinematic jewelry universe with floating gold and diamond rings"><img src="/manus-storage/by-salma-hero-rings_bf7a7280.png" alt="Floating gold and diamond rings arranged on golden orbital paths" /><span className="hero-visual-orbit orbit-a" /><span className="hero-visual-orbit orbit-b" /><span className="hero-visual-spark spark-a" /><span className="hero-visual-spark spark-b" /></div>;
}

function Header() {
  const { itemCount } = useStore();
  const [open, setOpen] = useState(false);
  return <>
    <div className="bg-[#28221e] px-4 py-2 text-center text-[10px] uppercase tracking-[0.3em] text-[#e5c28f]">Complimentary delivery on orders above PKR 10,000 <span className="mx-2 text-[#66584b]">/</span> Curated for the moments that matter</div>
    <header className="sticky top-0 z-40 border-b border-[#e8dfd4]/80 bg-[#fbf8f2]/95 backdrop-blur-xl"><div className="container flex h-20 items-center justify-between gap-6"><button className="md:hidden" aria-label="Open menu" onClick={() => setOpen(!open)}>{open ? <X size={20} /> : <Menu size={20} />}</button><Link href="/" className="flex items-center gap-3"><span className="logo-mark">BS</span><span className="hidden font-serif text-xl tracking-[0.16em] text-[#2e2823] sm:inline">BY SALMA</span></Link><nav className="hidden items-center gap-8 text-[10px] uppercase tracking-[0.24em] text-[#706358] md:flex"><Link href="/" className="nav-link">Home</Link><Link href="/shop" className="nav-link">Shop</Link><a href="#collections" className="nav-link">Collections</a><a href="#story" className="nav-link">Our story</a><Link href="/journal" className="nav-link">Journal</Link><Link href="/special-offers" className="nav-link text-[#a37946] font-medium">Special Offers</Link></nav><div className="flex items-center gap-4"><button className="hidden text-[#4d453d] sm:block" aria-label="Search"><Search size={18} strokeWidth={1.5} /></button><Link href="/cart" className="relative text-[#4d453d]" aria-label="Shopping bag"><ShoppingBag size={19} strokeWidth={1.5} />{itemCount > 0 && <span className="absolute -right-3 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#a37946] px-1 text-[9px] text-white">{itemCount}</span>}</Link></div></div>{open && <nav className="flex flex-col gap-5 border-t border-[#e8dfd4] px-6 py-6 text-xs uppercase tracking-[0.2em] md:hidden"><Link href="/" onClick={() => setOpen(false)}>Home</Link><Link href="/shop" onClick={() => setOpen(false)}>Shop</Link><a href="#collections" onClick={() => setOpen(false)}>Collections</a><a href="#story" onClick={() => setOpen(false)}>Our story</a><Link href="/journal" onClick={() => setOpen(false)}>Journal</Link><Link href="/special-offers" onClick={() => setOpen(false)} className="text-[#a37946]">Special Offers</Link></nav>}</header>
  </>;
}

export default function Home() {
  const { data } = trpc.catalog.products.useQuery({ limit: 24 });
  const { data: sections } = trpc.catalog.homepageSections.useQuery();
  const { data: footer } = trpc.admin.footerSettings.useQuery();
  const defaultExplore = [
    { label: "Shop all", href: "/shop" },
    { label: "Special Offers", href: "/special-offers" },
    { label: "Jewelry", href: "/shop?category=jewelry" },
    { label: "Purses", href: "/shop?category=purses" },
    { label: "Accessories", href: "/shop?category=accessories" },
  ];
  const defaultCare = [
    { label: "Our story", href: "/about" },
    { label: "Journal", href: "/journal" },
    { label: "Shipping & returns", href: "/shipping" },
    { label: "Contact us", href: "/contact" },
  ];
  const exploreLinks = (() => {
    try {
      const parsed = footer?.exploreLinks ? JSON.parse(footer.exploreLinks) as { label: string; href: string }[] : defaultExplore;
      if (!parsed.some(link => link.href === "/special-offers")) {
        return [{ label: "Special Offers", href: "/special-offers" }, ...parsed];
      }
      return parsed;
    } catch {
      return defaultExplore;
    }
  })();
  const careLinks = footer?.careLinks ? JSON.parse(footer.careLinks) as { label: string; href: string }[] : defaultCare;
  const products = ((data?.items ?? []) as StoreProduct[]).length ? data!.items as StoreProduct[] : DEMO_PRODUCTS;
  const visible = (key: string) => sections?.find(section => section.sectionKey === key)?.isVisible !== 0;
  const featured = useMemo(() => products.filter(p => p.discountPrice).slice(0, 4), [products]);
  const newest = useMemo(() => products.slice(-4).reverse(), [products]);
  return <div className="min-h-screen bg-[#fbf8f2] text-[#302923]"><Header /><main>
    <section className="hero-shell"><div className="hero-glow" /><div className="container relative grid min-h-[600px] items-center gap-6 py-16 md:grid-cols-2 lg:py-20"><div className="relative z-10 max-w-xl"><p className="eyebrow mb-5">The new signature collection</p><h1 className="font-serif text-5xl leading-[0.95] tracking-[-0.04em] text-[#f7efe3] sm:text-7xl">A quiet<br /><em className="text-[#d4ad78]">kind of</em><br />luxury.</h1><p className="mt-6 max-w-sm text-xs leading-6 text-[#d7c8b6] sm:text-sm">Jewelry, purses and objects of desire, composed for the woman who knows the power of a subtle statement.</p><div className="mt-8 flex flex-wrap items-center gap-4"><Link href="/shop" className="gold-button">Explore the collection <ArrowRight size={15} /></Link><a href="#story" className="text-[10px] uppercase tracking-[0.22em] text-[#e9d8c0] transition hover:text-white">Discover our story <span className="ml-2">↓</span></a></div></div><div className="relative flex min-h-[300px] items-center justify-center md:min-h-[420px] lg:min-h-[480px]"><div className="hero-caption absolute right-2 top-2 z-10 hidden max-w-[140px] text-right text-[9px] uppercase leading-4 tracking-[0.2em] text-[#aa9071] sm:block">Born from light<br /><span className="text-[#e4d4c2]">Edition 01 / 2026</span></div><RingScene /><div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-center text-[8px] uppercase tracking-[0.3em] text-[#8d7560]">Move with the light</div></div></div></section>
    <div className="border-b border-t border-[#e6ded4] bg-[#f5f0e7] py-4"><div className="marquee-track text-[10px] uppercase tracking-[0.35em] text-[#857466]"><span>Jewelry / Purses / Objects of desire / Designed in Lahore / Made to be remembered / </span><span>Jewelry / Purses / Objects of desire / Designed in Lahore / Made to be remembered / </span></div></div>
    {visible("categories") && <section id="collections" className="container py-24"><div className="section-heading"><div><p className="eyebrow">Explore the world of By Salma</p><h2 className="section-title">Find your <em>signature.</em></h2></div><Link href="/shop" className="text-[10px] uppercase tracking-[0.22em] text-[#a37946]">View all pieces <ArrowRight size={14} className="ml-2 inline" /></Link></div><div className="mt-12 grid gap-5 md:grid-cols-3"><Link href="/shop?category=jewelry" className="category-card category-jewelry"><div><p className="eyebrow text-[#e3c79d]">01 / The essentials</p><h3 className="font-serif text-4xl text-white">Jewelry</h3><p className="mt-3 text-xs text-[#dfd0bf]">Everyday icons, made luminous.</p></div><span className="category-arrow"><ArrowRight size={18} /></span></Link><Link href="/shop?category=purses" className="category-card category-purses"><div><p className="eyebrow text-[#e3c79d]">02 / The carryalls</p><h3 className="font-serif text-4xl text-white">Purses</h3><p className="mt-3 text-xs text-[#dfd0bf]">The finishing touch to every story.</p></div><span className="category-arrow"><ArrowRight size={18} /></span></Link><Link href="/shop?category=accessories" className="category-card category-accessories"><div><p className="eyebrow text-[#e3c79d]">03 / The details</p><h3 className="font-serif text-4xl text-white">Accessories</h3><p className="mt-3 text-xs text-[#dfd0bf]">Small gestures. Lasting impressions.</p></div><span className="category-arrow"><ArrowRight size={18} /></span></Link></div></section>}
    {visible("featured") && <section className="container pb-24"><div className="section-heading"><div><p className="eyebrow">The edit</p><h2 className="section-title">The pieces <em>everyone notices.</em></h2></div><Link href="/shop" className="text-[10px] uppercase tracking-[0.22em] text-[#a37946]">Shop the edit <ArrowRight size={14} className="ml-2 inline" /></Link></div><div className="mt-12 grid gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">{(featured.length ? featured : products.slice(0, 4)).map((product, index) => <ProductCard key={product.id} product={product} index={index} />)}</div></section>}
    {visible("flash-sale") && <section className="container pb-24"><div className="sale-banner"><div className="relative z-10 max-w-xl"><p className="eyebrow text-[#d8bb91]">A little more to love</p><h2 className="mt-4 font-serif text-5xl leading-[0.95] text-[#f9f2e8] sm:text-6xl">The after-dark<br /><em className="text-[#d7af75]">edit.</em></h2><p className="mt-5 max-w-sm text-sm leading-6 text-[#d0c2b0]">A considered selection of silhouettes, now with a private seasonal saving.</p><Link href="/shop?sort=price-low" className="gold-button mt-8">Explore the edit <ArrowRight size={15} /></Link></div><div className="sale-orbit" /></div></section>}
    {visible("new-arrivals") && <section className="border-y border-[#e6ded4] bg-[#f5f0e7] py-24"><div className="container"><div className="section-heading"><div><p className="eyebrow">Just arrived</p><h2 className="section-title">New <em>perspectives.</em></h2></div><Link href="/shop?sort=newest" className="text-[10px] uppercase tracking-[0.22em] text-[#a37946]">See new arrivals <ArrowRight size={14} className="ml-2 inline" /></Link></div><div className="mt-12 grid gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">{newest.map((product, index) => <ProductCard key={product.id} product={product} index={index} />)}</div></div></section>}
    {visible("story") && <section id="story" className="container grid gap-10 py-24 lg:grid-cols-[0.8fr_1fr] lg:items-center"><div className="story-art"><div className="story-line" /><span className="story-monogram">BS</span><p>ATELIER<br />NOTES / 01</p></div><div className="max-w-xl lg:pl-12"><p className="eyebrow">Our point of view</p><h2 className="section-title">The beauty of <em>restraint.</em></h2><p className="mt-7 text-sm leading-8 text-[#706358]">By Salma began with a simple belief: that the most memorable pieces do not ask for attention, they hold it. Every form is softened, every finish considered, every collection designed to become part of your personal language.</p><p className="mt-5 text-sm leading-8 text-[#706358]">We make luxury feel intimate — the kind you reach for without thinking, then miss the moment it is gone.</p><Link href="/about" className="mt-8 inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.22em] text-[#a37946]">Read our story <ArrowRight size={14} /></Link></div></section>}
    {visible("reviews") && <section className="border-y border-[#e6ded4] bg-[#ebe3d8] py-20"><div className="container text-center"><p className="eyebrow">The review atelier</p><h2 className="mx-auto mt-4 max-w-2xl font-serif text-4xl leading-tight text-[#3c3229] sm:text-5xl">Verified notes from the women who wear <em>By Salma.</em></h2><p className="mx-auto mt-5 max-w-md text-sm leading-7 text-[#786b5d]">Customer reviews will appear here after verified purchases. Your experience is the next chapter.</p><Link href="/shop" className="gold-button dark mt-8">Find your piece <ArrowRight size={15} /></Link></div></section>}
    {visible("newsletter") && <section className="container py-24"><div className="newsletter-card"><div><p className="eyebrow">The Salma letter</p><h2 className="mt-4 font-serif text-4xl text-[#3c3229]">A little luxury,<br /><em>delivered.</em></h2></div><div className="max-w-sm"><p className="text-sm leading-7 text-[#75695c]">Be the first to know about new collections, private edits and stories from our atelier.</p><div className="mt-6 flex border-b border-[#bca88e] pb-3"><input type="email" placeholder="Your email address" className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[#9b8c7d]" /><button className="text-[10px] uppercase tracking-[0.2em] text-[#a37946]">Subscribe</button></div><p className="mt-3 text-[10px] text-[#a69686]">By subscribing, you agree to our privacy policy.</p></div></div></section>}
  </main><footer className="bg-[#28221e] py-16 text-[#d6c7b7]"><div className="container grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]"><div><div className="flex items-center gap-3"><span className="logo-mark light">BS</span><span className="font-serif text-lg tracking-[0.16em] text-[#f3e8da]">BY SALMA</span></div><p className="mt-5 max-w-xs text-xs leading-6 text-[#9d8d7c]" dangerouslySetInnerHTML={{ __html: footer?.tagline ?? "Luxury jewelry and accessories crafted for every woman." }} /><p className="mt-10 text-[10px] uppercase tracking-[0.22em] text-[#a37946]">{footer?.copyright ?? "© 2026 By Salma"}</p></div><div><p className="eyebrow text-[#a37946]">Explore</p><div className="mt-5 flex flex-col gap-3 text-xs">{exploreLinks.map((link, idx) => <Link key={idx} href={link.href}>{link.label}</Link>)}</div></div><div><p className="eyebrow text-[#a37946]">Care</p><div className="mt-5 flex flex-col gap-3 text-xs">{careLinks.map((link, idx) => <Link key={idx} href={link.href}>{link.label}</Link>)}</div></div><div><p className="eyebrow text-[#a37946]">Follow along</p><p className="mt-5 text-xs leading-6 text-[#9d8d7c]">{footer?.socialText ?? "Stories, styling and a closer look at the atelier."}</p>      <div className="mt-5 flex flex-wrap gap-4 text-xs"><a href={footer?.instagramHref ?? "https://instagram.com"} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 hover:text-white"><Instagram size={14} /> Instagram</a><a href={footer?.facebookHref ?? "https://facebook.com"} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 hover:text-white"><Facebook size={14} /> Facebook</a><a href={`https://wa.me/${(footer?.whatsappNumber ?? "+923000000000").replace(/[^0-9]/g, "")}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-[#25D366] hover:underline"><MessageCircle size={14} /> WhatsApp</a></div></div></div></footer></div>;
}

export { DEMO_PRODUCTS, money, salePrice, ProductCard, Header };
