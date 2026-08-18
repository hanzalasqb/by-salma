import { ArrowRight } from "lucide-react";
import { Link } from "wouter";

export default function About() {
  return (
    <div className="min-h-screen bg-[#fbf8f2] text-[#302923]">
      <div className="border-b border-[#e8dfd4] bg-[#f5f0e7] py-16 text-center">
        <p className="eyebrow">Atelier Heritage</p>
        <h1 className="mt-3 font-serif text-5xl sm:text-6xl text-[#2f2a25]">The Art of <em>Subtle Luxury.</em></h1>
        <p className="mx-auto mt-4 max-w-lg text-sm text-[#706358] leading-7">Designed in Lahore and crafted for the woman who knows the power of an understated statement.</p>
      </div>
      <main className="container py-20">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          <div className="story-art large">
            <div className="story-line" />
            <span className="story-monogram">BS</span>
            <p>ATELIER NOTES / HERITAGE</p>
          </div>
          <div>
            <p className="eyebrow">Our Philosophy</p>
            <h2 className="section-title mt-3">Designed to be <em>remembered.</em></h2>
            <p className="mt-6 text-sm text-[#706358] leading-8">By Salma was founded on the belief that true luxury requires neither noise nor excess. Every gold vermeil silhouette, sculptural ring, and structured leather purse is composed with meticulous restraint.</p>
            <p className="mt-4 text-sm text-[#706358] leading-8">We work with master artisans who honor traditional hand-finishing techniques while embracing contemporary geometry. The result is a collection of intimate companions meant to live with you through every milestone.</p>
            <div className="mt-8 flex items-center gap-6">
              <Link href="/shop" className="gold-button">Explore the Collection <ArrowRight size={15} /></Link>
              <Link href="/contact" className="text-[10px] uppercase tracking-[0.22em] text-[#a37946] hover:underline">Contact our atelier →</Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
