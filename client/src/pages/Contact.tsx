import { FormEvent, useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, Clock, Mail, MapPin, Phone, Send } from "lucide-react";
import { Header } from "./Home";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function Contact() {
  const { data: store } = trpc.admin.storeSettings.useQuery(undefined, { retry: false });
  const { data: footer } = trpc.admin.footerSettings.useQuery(undefined, { retry: false });
  const [form, setForm] = useState({ name: "", email: "", subject: "Client Styling Inquiry", message: "" });
  const submitInquiry = trpc.admin.submitContactInquiry.useMutation({
    onSuccess: () => {
      toast.success("Inquiry received. Our concierge will be in touch shortly.");
      setForm({ name: "", email: "", subject: "Client Styling Inquiry", message: "" });
    },
    onError: err => toast.error(err.message || "Please check your details and try again."),
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    submitInquiry.mutate(form);
  };

  const whatsappLink = `https://wa.me/${(footer?.whatsappNumber ?? "+923000000000").replace(/[^0-9]/g, "")}`;

  return (
    <div className="min-h-screen bg-[#fbf8f2] text-[#302923]">
      <Header />
      <div className="border-b border-[#e8dfd4] bg-[#f5f0e7] py-16 text-center">
        <p className="eyebrow">Client Concierge</p>
        <h1 className="mt-3 font-serif text-5xl sm:text-6xl text-[#2f2a25]" dangerouslySetInnerHTML={{ __html: store?.contactHeadline ?? "Get in <em>touch.</em>" }} />
        <p className="mx-auto mt-4 max-w-lg text-sm text-[#706358] leading-7">{store?.contactIntro ?? "We are at your disposal for styling inquiries, order tracking, and bespoke requests."}</p>
      </div>
      <main className="container py-20 max-w-5xl">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr]">
          <div className="space-y-8 bg-[#f5f0e7] p-8 border border-[#e5dcd1]">
            <div>
              <p className="eyebrow">Atelier details</p>
              <h2 className="mt-2 font-serif text-3xl text-[#2f2a25]">Direct <em>contact.</em></h2>
            </div>
            <div className="space-y-6 text-xs text-[#706358]">
              <div className="flex items-start gap-4">
                <MapPin size={18} className="text-[#a37946] shrink-0 mt-0.5" />
                <div><p className="font-medium text-[#2f2a25]">Location</p><p className="mt-1">{store?.atelierLocation ?? "Gulberg III, Lahore, Pakistan"}</p></div>
              </div>
              <div className="flex items-start gap-4">
                <Mail size={18} className="text-[#a37946] shrink-0 mt-0.5" />
                <div><p className="font-medium text-[#2f2a25]">Email Concierge</p><p className="mt-1">{store?.supportEmail ?? "concierge@bysalma.com"}</p></div>
              </div>
              <div className="flex items-start gap-4">
                <Phone size={18} className="text-[#a37946] shrink-0 mt-0.5" />
                <div><p className="font-medium text-[#2f2a25]">Phone & WhatsApp</p><p className="mt-1">{store?.supportPhone ?? "+92 (42) 3500 SALMA"}</p><a href={whatsappLink} target="_blank" rel="noreferrer" className="mt-2 inline-block font-medium text-[#25D366] hover:underline">Open WhatsApp Chat →</a></div>
              </div>
              <div className="flex items-start gap-4">
                <Clock size={18} className="text-[#a37946] shrink-0 mt-0.5" />
                <div><p className="font-medium text-[#2f2a25]">Hours</p><p className="mt-1">{store?.hoursOfOperation ?? "Monday — Saturday: 10:00 AM – 7:00 PM PKT"}</p></div>
              </div>
            </div>
          </div>
          <div className="bg-[#fffdf9] p-8 border border-[#e7ded3]">
            <p className="eyebrow">Send a message</p>
            <h2 className="mt-2 font-serif text-3xl text-[#2f2a25]">Write to the <em>atelier.</em></h2>
            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <label className="field-label">Your Name<input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Salma Khan" /></label>
              <label className="field-label">Email Address<input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="salma@example.com" /></label>
              <label className="field-label">Subject<input required value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} placeholder="Styling consultation" /></label>
              <label className="field-label">Message<textarea required rows={5} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder="How may we assist your curation?" /></label>
              <button disabled={submitInquiry.isPending} type="submit" className="gold-button w-full justify-center">{submitInquiry.isPending ? "Sending..." : "Send Inquiry"} <Send size={15} /></button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
