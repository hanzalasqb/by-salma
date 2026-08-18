import { useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, ArrowRight, BookOpen, Sparkles } from "lucide-react";
import { Header } from "./Home";

const articles = [
  {
    id: 1,
    slug: "quiet-luxury-art-of-subtle-statement",
    title: "The Art of the Subtle Statement",
    eyebrow: "Editorial / 01",
    excerpt: "In a world driven by loud insignias and fleeting trends, true elegance whispers. We explore how heirloom-grade 18k gold vermeil and handset cubic zirconia compose a timeless narrative.",
    readTime: "4 min read",
    date: "August 2026",
    imageUrl: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1200&q=80",
    content: `True luxury is never loud. It does not demand attention across a crowded room; rather, it commands quiet reverence when light catches a meticulously faceted stone or the warm curvature of handcrafted gold vermeil against skin. 

At By Salma, every piece is conceived as an intimate talisman. Whether it is the Aurora Heirloom Ring or the Solstice Chain, our creations are designed for the woman who understands that her presence alone is enough, and that her adornments should merely punctuate her natural grace. We select only conflict-free stones and sustainable precious metals, ensuring that your most cherished moments are accompanied by uncompromising ethics and peerless craftsmanship.`
  },
  {
    id: 2,
    slug: "anatomy-of-a-handbag",
    title: "Anatomy of an Atelier Handbag",
    eyebrow: "Craftsmanship / 02",
    excerpt: "From the selection of supple pebbled leather to the hand-polished brass clasp, discover the forty-two separate steps required to bring the Muse Top Handle to life.",
    readTime: "6 min read",
    date: "July 2026",
    imageUrl: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1200&q=80",
    content: `The creation of a By Salma purse begins months before assembly, in artisanal tanneries where hides are selected for their supple handfeel and enduring resilience. Each panel is hand-cut by master craftspeople in Lahore, guided by decades of generational leatherworking heritage.

The signature structured silhouette is reinforced with internal saddle-stitched framing that maintains its pristine geometric purity over years of daily wear. Finished with custom-molded golden hardware and lined in tactile bonded suede, our bags bridge the delicate intersection of sculptural art and functional daily luxury.`
  },
  {
    id: 3,
    slug: "preserving-the-luster",
    title: "Preserving the Luster: A Care Guide",
    eyebrow: "Atelier Advice / 03",
    excerpt: "Fine jewelry and luxury accessories require gentle devotion to retain their morning-fresh brilliance across decades of wear.",
    readTime: "3 min read",
    date: "June 2026",
    imageUrl: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=80",
    content: `Your By Salma pieces are designed to accompany you through every milestone, from morning espressos to midnight galas. To maintain their pristine luster, we recommend storing each piece in its individual velvet pouch when not worn. 

Avoid direct contact with botanical perfumes, chlorinated water, and abrasive cosmetic lotions. A gentle wipe with a dry lint-free microfiber cloth after wear will effortlessly restore their brilliant morning shine.`
  }
];

export default function Journal() {
  const [selectedArticleId, setSelectedArticleId] = useState<number | null>(null);
  const activeArticle = articles.find(article => article.id === selectedArticleId);

  return (
    <div className="min-h-screen bg-[#fbf8f2] text-[#302923]">
      <Header />
      <main className="container py-16">
        <Link href="/" className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[#8d7e70]">
          <ArrowLeft size={14} /> Return home
        </Link>

        {activeArticle ? (
          <article className="mt-12 max-w-4xl mx-auto">
            <button 
              onClick={() => setSelectedArticleId(null)} 
              className="mb-8 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[#a37946]"
            >
              <ArrowLeft size={14} /> Back to journal
            </button>
            <p className="eyebrow">{activeArticle.eyebrow} · {activeArticle.readTime}</p>
            <h1 className="mt-4 font-serif text-5xl leading-tight sm:text-6xl">{activeArticle.title}</h1>
            <p className="mt-4 text-xs text-[#908172]">{activeArticle.date}</p>
            
            <div className="mt-10 overflow-hidden rounded-sm border border-[#e1d8cd]">
              <img src={activeArticle.imageUrl} alt={activeArticle.title} className="h-[460px] w-full object-cover" />
            </div>

            <div className="mt-12 space-y-6 text-base leading-8 text-[#5c5044] font-light">
              <p className="text-xl font-serif text-[#302923] italic leading-relaxed">{activeArticle.excerpt}</p>
              {activeArticle.content.split("\n\n").map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            <div className="mt-16 border-t border-[#e2d8cd] pt-8 flex items-center justify-between">
              <span className="text-xs uppercase tracking-[0.16em] text-[#8d7e70]">Published by By Salma Atelier</span>
              <Link href="/shop" className="gold-button">Explore the collection <ArrowRight size={15} /></Link>
            </div>
          </article>
        ) : (
          <div>
            <div className="mt-8 border-b border-[#e2d9ce] pb-8">
              <p className="eyebrow">Editorial & Brand Stories</p>
              <h1 className="mt-3 font-serif text-5xl sm:text-6xl">The By Salma <em>Journal.</em></h1>
              <p className="mt-4 max-w-xl text-sm leading-7 text-[#7c6f61]">
                Reflections on quiet luxury, meticulous craftsmanship, and the philosophy of dressing for yourself.
              </p>
            </div>

            <div className="mt-12 grid gap-12 lg:grid-cols-3">
              {articles.map(article => (
                <div 
                  key={article.id} 
                  onClick={() => setSelectedArticleId(article.id)}
                  className="group cursor-pointer border border-[#e2d9ce] bg-[#fdfaf5] p-6 transition hover:border-[#a37946]"
                >
                  <div className="overflow-hidden rounded-sm">
                    <img 
                      src={article.imageUrl} 
                      alt={article.title} 
                      className="h-64 w-full object-cover transition duration-500 group-hover:scale-105" 
                    />
                  </div>
                  <div className="mt-6">
                    <p className="eyebrow">{article.eyebrow} · {article.readTime}</p>
                    <h2 className="mt-3 font-serif text-2xl group-hover:text-[#a37946] transition">{article.title}</h2>
                    <p className="mt-3 text-sm leading-6 text-[#7c6f61] line-clamp-3">{article.excerpt}</p>
                    <span className="mt-6 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[#a37946]">
                      Read article <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
