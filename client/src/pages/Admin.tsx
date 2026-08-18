import React, { useState } from "react";
import { Link } from "wouter";
import { BarChart3, Check, Download, Eye, EyeOff, FolderTree, GripVertical, LayoutGrid, Package, Plus, ReceiptText, Settings2, ShoppingBag, Tag, Truck, X } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { money } from "./Home";

const defaultSections = [
  { id: 1, sectionKey: "categories", label: "Collection categories", isVisible: 1 },
  { id: 2, sectionKey: "featured", label: "Featured collection", isVisible: 1 },
  { id: 3, sectionKey: "flash-sale", label: "Flash sale banner", isVisible: 1 },
  { id: 4, sectionKey: "new-arrivals", label: "New arrivals", isVisible: 1 },
  { id: 5, sectionKey: "story", label: "Brand story", isVisible: 1 },
  { id: 6, sectionKey: "reviews", label: "Verified review module", isVisible: 1 },
  { id: 7, sectionKey: "newsletter", label: "Newsletter signup", isVisible: 1 },
];

function AdminContent() {
  const [tab, setTab] = useState("Overview");
  const [showProductForm, setShowProductForm] = useState(false);
  const [sections, setSections] = useState(defaultSections);
  const [product, setProduct] = useState({ name: "", slug: "", sku: "", price: "", discountPrice: "", categoryId: "1", stock: "0", material: "", color: "", size: "", description: "", careGuide: "", imageUrl: "", imageUrls: [] as string[] });
  const [coupon, setCoupon] = useState({ code: "", discountType: "percentage" as "percentage" | "fixed", value: "", minimumOrder: "0", usageLimit: "0" });
  const [shipping, setShipping] = useState({ name: "Standard delivery", freeAbove: "10000", flatRate: "250" });
  const [newCategory, setNewCategory] = useState({ name: "", slug: "", parentId: "", bannerUrl: "", iconUrl: "" });
  
  const utils = trpc.useUtils();
  const uploadAsset = trpc.admin.uploadAsset.useMutation();
  const categories = trpc.admin.categories.useQuery(undefined, { retry: false });
  const products = trpc.admin.products.useQuery(undefined, { retry: false });
  const orders = trpc.admin.orders.useQuery(undefined, { retry: false });
  const coupons = trpc.admin.coupons.useQuery(undefined, { retry: false });
  const shippingRules = trpc.admin.shippingRules.useQuery(undefined, { retry: false });
  const liveSections = trpc.admin.homepageSections.useQuery(undefined, { retry: false });
  const footerSettingsQuery = trpc.admin.footerSettings.useQuery(undefined, { retry: false });
  const storeSettingsQuery = trpc.admin.storeSettings.useQuery(undefined, { retry: false });
  const inquiriesQuery = trpc.admin.contactInquiries.useQuery(undefined, { retry: false });

  const updateFooterMutation = trpc.admin.updateFooterSettings.useMutation({
    onSuccess: () => {
      utils.admin.footerSettings.invalidate();
      toast.success("Footer content and links updated successfully.");
    },
    onError: (err: any) => toast.error(`Failed to update footer: ${err.message}`),
  });

  const updateStoreMutation = trpc.admin.updateStoreSettings.useMutation({
    onSuccess: () => {
      utils.admin.storeSettings.invalidate();
      toast.success("Store and contact details updated successfully.");
    },
    onError: (err: any) => toast.error(`Failed to update store: ${err.message}`),
  });

  const updateInquiryStatus = trpc.admin.updateInquiryStatus.useMutation({
    onSuccess: () => {
      utils.admin.contactInquiries.invalidate();
      toast.success("Inquiry status updated.");
    },
  });

  const [footerForm, setFooterForm] = useState({
    tagline: "Luxury jewelry and accessories crafted for every woman.",
    copyright: "© 2026 By Salma",
    exploreLinks: JSON.stringify([
      { label: "Shop all", href: "/shop" },
      { label: "Jewelry", href: "/shop?category=jewelry" },
      { label: "Purses", href: "/shop?category=purses" },
      { label: "Accessories", href: "/shop?category=accessories" },
    ], null, 2),
    careLinks: JSON.stringify([
      { label: "Our story", href: "/about" },
      { label: "Journal", href: "/journal" },
      { label: "Shipping & returns", href: "/shipping" },
      { label: "Contact us", href: "/contact" },
    ], null, 2),
    socialText: "Stories, styling and a closer look at the atelier.",
    socialHandle: "@bysalma",
    socialHref: "https://instagram.com",
    facebookHref: "https://facebook.com",
    instagramHref: "https://instagram.com",
    whatsappNumber: "+923000000000",
  });

  const [storeForm, setStoreForm] = useState({
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
    ], null, 2),
    shippingSections: JSON.stringify([
      { title: "1. Delivery Timelines", body: "Orders are dispatched from our Lahore atelier within 24 to 48 hours. Standard delivery across major cities takes 2-4 business days. Express dispatch options are available upon request during checkout." },
      { title: "2. Returns & Care Guarantees", body: "We take immense pride in our craftsmanship. If you receive an item with a manufacturing defect or wish to exchange for a different size, our client concierge will arrange a complimentary return pickup." },
    ], null, 2),
    storeDiscountEnabled: 0,
    storeDiscountPercentage: "0",
    brandLogoUrl: "",
    brandMonogram: "BS",
    brandTitle: "BY SALMA",
    themeMode: "light",
  });

  React.useEffect(() => {
    if (footerSettingsQuery.data) {
      setFooterForm({
        tagline: footerSettingsQuery.data.tagline,
        copyright: footerSettingsQuery.data.copyright,
        exploreLinks: footerSettingsQuery.data.exploreLinks,
        careLinks: footerSettingsQuery.data.careLinks,
        socialText: footerSettingsQuery.data.socialText,
        socialHandle: footerSettingsQuery.data.socialHandle,
        socialHref: footerSettingsQuery.data.socialHref,
        facebookHref: footerSettingsQuery.data.facebookHref ?? "https://facebook.com",
        instagramHref: footerSettingsQuery.data.instagramHref ?? "https://instagram.com",
        whatsappNumber: footerSettingsQuery.data.whatsappNumber ?? "+923000000000",
      });
    }
  }, [footerSettingsQuery.data]);

  React.useEffect(() => {
    if (storeSettingsQuery.data) {
      setStoreForm({
        atelierLocation: storeSettingsQuery.data.atelierLocation,
        supportEmail: storeSettingsQuery.data.supportEmail,
        supportPhone: storeSettingsQuery.data.supportPhone,
        hoursOfOperation: storeSettingsQuery.data.hoursOfOperation,
        contactHeadline: storeSettingsQuery.data.contactHeadline,
        contactIntro: storeSettingsQuery.data.contactIntro,
        shippingHeadline: storeSettingsQuery.data.shippingHeadline,
        shippingIntro: storeSettingsQuery.data.shippingIntro,
        shippingCards: storeSettingsQuery.data.shippingCards,
        shippingSections: storeSettingsQuery.data.shippingSections,
        storeDiscountEnabled: storeSettingsQuery.data.storeDiscountEnabled ?? 0,
        storeDiscountPercentage: String(storeSettingsQuery.data.storeDiscountPercentage ?? "0"),
        brandLogoUrl: storeSettingsQuery.data.brandLogoUrl ?? "",
        brandMonogram: storeSettingsQuery.data.brandMonogram ?? "BS",
        brandTitle: storeSettingsQuery.data.brandTitle ?? "BY SALMA",
        themeMode: storeSettingsQuery.data.themeMode ?? "light",
      });
    }
  }, [storeSettingsQuery.data]);

  const createCategory = trpc.admin.createCategory.useMutation({ onSuccess: () => { setNewCategory({ name: "", slug: "", parentId: "", bannerUrl: "", iconUrl: "" }); utils.admin.categories.invalidate(); } });
  const updateCategory = trpc.admin.updateCategory.useMutation({ onSuccess: () => utils.admin.categories.invalidate() });
  const createProduct = trpc.admin.createProduct.useMutation({ onSuccess: () => { setShowProductForm(false); utils.admin.products.invalidate(); } });
  const deleteProduct = trpc.admin.deleteProduct.useMutation({ onSuccess: () => utils.admin.products.invalidate() });
  const updateOrderStatus = trpc.admin.updateOrderStatus.useMutation({ onSuccess: () => utils.admin.orders.invalidate() });
  const toggleSection = trpc.admin.toggleHomepageSection.useMutation();
  const createCoupon = trpc.admin.createCoupon.useMutation({ onSuccess: () => { setCoupon({ code: "", discountType: "percentage", value: "", minimumOrder: "0", usageLimit: "0" }); utils.admin.coupons.invalidate(); toast.success("Coupon created. Customers can enter its code in the cart."); } });
  const createShipping = trpc.admin.createShippingRule.useMutation({ onSuccess: () => utils.admin.shippingRules.invalidate() });

  const categoryItems = categories.data ?? [];
  const items = products.data ?? [];
  const orderItems = orders.data ?? [];
  const sectionItems = liveSections.data?.length ? liveSections.data : sections;

  const tabs = [
    { label: "Overview", icon: BarChart3 },
    { label: "Categories", icon: FolderTree },
    { label: "Products", icon: Package },
    { label: "Orders", icon: ReceiptText },
    { label: "Inquiries", icon: ReceiptText },
    { label: "Promotions", icon: Tag },
    { label: "Brand & Logo", icon: Package },
    { label: "Settings", icon: LayoutGrid },
    { label: "Settings", icon: Settings2 },
  ];

  const handleAssetUpload = (file: File | undefined, onUrl: (url: string) => void) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const encoded = String(reader.result).split(",")[1];
      uploadAsset.mutate({ filename: file.name, mimeType: file.type, base64: encoded }, {
        onSuccess: result => { onUrl(result.url); toast.success("Asset uploaded securely to S3"); },
        onError: () => toast.error("Upload failed. Please try a smaller image."),
      });
    };
    reader.readAsDataURL(file);
  };

  const handleAssetUploads = (files: FileList | null, onUrls: (urls: string[]) => void) => {
    if (!files?.length) return;
    const pending = Array.from(files);
    Promise.all(pending.map(file => new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const encoded = String(reader.result).split(",")[1];
        uploadAsset.mutate({ filename: file.name, mimeType: file.type, base64: encoded }, {
          onSuccess: result => resolve(result.url),
          onError: reject,
        });
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    }))).then(urls => {
      onUrls(urls);
      toast.success(`${urls.length} gallery assets uploaded securely`);
    }).catch(() => toast.error("One or more uploads failed."));
  };

  const submitProduct = (event: React.FormEvent) => {
    event.preventDefault();
    const imageUrls = product.imageUrls.length ? product.imageUrls : product.imageUrl ? [product.imageUrl] : [];
    createProduct.mutate({
      categoryId: Number(product.categoryId),
      name: product.name,
      slug: product.slug || product.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      sku: product.sku,
      price: product.price,
      discountPrice: product.discountPrice || null,
      stock: Number(product.stock),
      material: product.material,
      color: product.color,
      size: product.size,
      description: product.description || undefined,
      careGuide: product.careGuide || undefined,
      imageUrl: imageUrls[0],
      images: imageUrls,
      isFeatured: 0,
      isNew: 1,
      isBestSeller: 0,
    });
  };

  const exportOrders = () => {
    const header = ["order", "customer", "email", "total", "payment", "status"];
    const rows = orderItems.map(order => [order.id, order.customerName, order.email, order.total, order.paymentMethod, order.status]);
    const csv = [header, ...rows].map(row => row.map(value => `"${String(value).replaceAll('"', '""')}"`).join(",")).join("\n");
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    link.download = "by-salma-orders.csv";
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const restricted = products.isError && (products.error?.data?.code === "FORBIDDEN" || products.error?.data?.code === "UNAUTHORIZED");

  return (
    <div className="w-full min-h-screen bg-[#fbf8f2] px-4 py-8 text-[#302923] sm:px-8 lg:px-12">
      <div className="flex flex-col gap-6 border-b border-[#e2d9ce] pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">By Salma / atelier console</p>
          <h1 className="mt-2 font-serif text-4xl">Good morning, <em>Salma.</em></h1>
          <p className="mt-2 text-sm text-[#85776a]">A quiet view of everything behind the collection.</p>
        </div>
        <Link href="/" className="text-[10px] uppercase tracking-[0.2em] text-[#a37946]">View storefront ↗</Link>
      </div>

      {restricted ? (
        <div className="mt-12 border border-dashed border-[#c7b6a0] p-12 text-center">
          <p className="font-serif text-3xl">Private atelier access.</p>
          <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-[#7c6f61]">This dashboard is reserved for an admin account. Sign in with the account assigned to By Salma, then return here.</p>
        </div>
      ) : (
        <>
          <div className="mt-7 flex flex-wrap gap-2 border-b border-[#e2d9ce] pb-2">
            {tabs.map(({ label, icon: Icon }) => (
              <button
                key={label}
                onClick={() => setTab(label)}
                className={`flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-[10px] uppercase tracking-[0.16em] transition ${tab === label ? "border-[#a37946] text-[#a37946] font-medium" : "border-transparent text-[#948578] hover:text-[#504439]"}`}
              >
                <Icon size={14} /> {label}
              </button>
            ))}
          </div>

          {tab === "Overview" && (
            <section className="mt-8">
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <div className="stat-card"><p>Catalog pieces</p><strong>{items.length}</strong><span><Package size={14} /> Manage your edit</span></div>
                <div className="stat-card"><p>Orders to tend</p><strong>{orderItems.filter(order => order.status !== "delivered" && order.status !== "cancelled").length}</strong><span><ReceiptText size={14} /> Keep things moving</span></div>
                <div className="stat-card"><p>Homepage modules</p><strong>{sectionItems.filter(section => section.isVisible).length}/{sectionItems.length}</strong><span><Eye size={14} /> Currently visible</span></div>
                <div className="stat-card"><p>Active promotions</p><strong>{coupons.data?.length ?? 0}</strong><span><Tag size={14} /> Coupon engine</span></div>
              </div>

              <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                <div className="admin-panel">
                  <div className="flex items-start justify-between">
                    <div><p className="eyebrow">Latest orders</p><h2 className="mt-2 font-serif text-2xl">The order <em>atelier.</em></h2></div>
                    <button onClick={() => setTab("Orders")} className="text-[10px] uppercase tracking-[0.16em] text-[#a37946]">View all</button>
                  </div>
                  <div className="mt-6 space-y-3">
                    {orderItems.slice(0, 4).map(order => (
                      <div key={order.id} className="flex items-center justify-between border-b border-[#eee6dc] py-3 text-sm">
                        <div><span className="font-medium">#{String(order.id).padStart(4, "0")}</span><span className="ml-3 text-[#8a7c6e]">{order.customerName}</span></div>
                        <div className="text-right"><span className="mr-4 text-[#a37946]">{money(order.total)}</span><span className="text-[10px] uppercase tracking-[0.14em] text-[#9b8d80]">{order.status}</span></div>
                      </div>
                    ))}
                    {!orderItems.length && <p className="py-8 text-sm text-[#8a7c6e]">No orders yet. They will appear here as customers check out.</p>}
                  </div>
                </div>

                <div className="admin-panel">
                  <p className="eyebrow">Homepage control</p>
                  <h2 className="mt-2 font-serif text-2xl">Set the <em>mood.</em></h2>
                  <div className="mt-6 space-y-4">
                    {sectionItems.slice(0, 4).map(section => (
                      <div key={section.id} className="flex items-center justify-between text-sm">
                        <span>{section.label}</span>
                        <button
                          onClick={() => {
                            setSections(current => current.map(item => item.id === section.id ? { ...item, isVisible: item.isVisible ? 0 : 1 } : item));
                            if (liveSections.data?.length) toggleSection.mutate({ id: section.id, isVisible: section.isVisible ? 0 : 1 });
                          }}
                          className={section.isVisible ? "text-[#a37946]" : "text-[#a09387]"}
                        >
                          {section.isVisible ? <Eye size={17} /> : <EyeOff size={17} />}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}

          {tab === "Categories" && (
            <section className="mt-8">
              <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                <div><p className="eyebrow">Catalog structure / {categoryItems.length} categories</p><h2 className="mt-2 font-serif text-3xl">Shape the <em>collection.</em></h2></div>
                <span className="text-xs text-[#8b7c6e]">Drag-ready ordering controls</span>
              </div>
              <div className="mt-7 grid gap-7 lg:grid-cols-[1fr_340px]">
                <div className="admin-panel">
                  {categoryItems.length ? (
                    <div className="space-y-2">
                      {categoryItems.map((category, index) => (
                        <div key={category.id} className="flex items-center gap-3 border border-[#e5ddd2] bg-[#fdfaf5] p-4">
                          <GripVertical size={16} className="text-[#b9a38a]" />
                          <div className="min-w-0 flex-1">
                            <p className="font-medium">{category.name}</p>
                            <p className="mt-1 text-xs text-[#948578]">/{category.slug} · {category.parentId ? "Subcategory" : "Top-level collection"}</p>
                          </div>
                          <button onClick={() => updateCategory.mutate({ id: category.id, isVisible: category.isVisible ? 0 : 1 })} className="text-[#a37946]">
                            {category.isVisible ? <Eye size={16} /> : <EyeOff size={16} />}
                          </button>
                          <button disabled={index === 0} onClick={() => updateCategory.mutate({ id: category.id, sortOrder: Math.max(0, index - 1) })} className="text-[10px] text-[#8c7c6e] disabled:opacity-30">↑</button>
                          <button disabled={index === categoryItems.length - 1} onClick={() => updateCategory.mutate({ id: category.id, sortOrder: index + 1 })} className="text-[10px] text-[#8c7c6e] disabled:opacity-30">↓</button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="py-12 text-center text-sm text-[#8b7d70]">Create your first top-level category to begin.</p>
                  )}
                </div>

                <form
                  onSubmit={event => {
                    event.preventDefault();
                    createCategory.mutate({
                      name: newCategory.name,
                      slug: newCategory.slug || newCategory.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
                      parentId: newCategory.parentId ? Number(newCategory.parentId) : null,
                      bannerUrl: newCategory.bannerUrl || undefined,
                      iconUrl: newCategory.iconUrl || undefined,
                      sortOrder: categoryItems.length,
                    });
                  }}
                  className="admin-panel h-fit space-y-4"
                >
                  <p className="eyebrow">New branch</p>
                  <h3 className="font-serif text-2xl">Add a <em>category.</em></h3>
                  <label className="field-label">Name<input required value={newCategory.name} onChange={event => setNewCategory({ ...newCategory, name: event.target.value })} placeholder="Jewelry" /></label>
                  <label className="field-label">SEO slug<input required value={newCategory.slug} onChange={event => setNewCategory({ ...newCategory, slug: event.target.value })} placeholder="jewelry" /></label>
                  <label className="field-label">Parent
                    <select value={newCategory.parentId} onChange={event => setNewCategory({ ...newCategory, parentId: event.target.value })}>
                      <option value="">Top-level category</option>
                      {categoryItems.filter(category => !category.parentId).map(category => <option key={category.id} value={category.id}>{category.name}</option>)}
                    </select>
                  </label>
                  <label className="field-label">Banner image <span className="text-[10px] normal-case tracking-normal text-[#a37946]">(upload only)</span>
                    <input type="file" accept="image/*" onChange={event => handleAssetUpload(event.target.files?.[0], url => setNewCategory(current => ({ ...current, bannerUrl: url })))} className="mt-2 text-xs" />
                    {newCategory.bannerUrl && <span className="mt-1 block text-[10px] text-[#a37946]">Banner uploaded and ready</span>}
                  </label>
                  <label className="field-label">Icon image <span className="text-[10px] normal-case tracking-normal text-[#a37946]">(upload only)</span>
                    <input type="file" accept="image/*" onChange={event => handleAssetUpload(event.target.files?.[0], url => setNewCategory(current => ({ ...current, iconUrl: url })))} className="mt-2 text-xs" />
                    {newCategory.iconUrl && <span className="mt-1 block text-[10px] text-[#a37946]">Icon uploaded and ready</span>}
                  </label>
                  <button className="gold-button" type="submit"><Plus size={15} /> Add category</button>
                </form>
              </div>
            </section>
          )}

          {tab === "Products" && (
            <section className="mt-8">
              <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                <div><p className="eyebrow">Catalog / {items.length} pieces</p><h2 className="mt-2 font-serif text-3xl">Product <em>management.</em></h2></div>
                <button onClick={() => setShowProductForm(true)} className="gold-button"><Plus size={15} /> Add product</button>
              </div>

              <div className="admin-panel mt-7 overflow-x-auto">
                <table className="w-full min-w-[680px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-[#e1d8cd] text-[10px] uppercase tracking-[0.16em] text-[#998a7b]">
                      <th className="pb-4">Product</th>
                      <th className="pb-4">SKU</th>
                      <th className="pb-4">Price</th>
                      <th className="pb-4">Stock</th>
                      <th className="pb-4">Visibility</th>
                      <th className="pb-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map(item => (
                      <tr key={item.id} className="border-b border-[#eee6dc]">
                        <td className="py-4 font-medium">{item.name}</td>
                        <td className="py-4 text-[#8b7d70]">{item.sku}</td>
                        <td className="py-4 text-[#a37946]">{money(item.discountPrice ?? item.price)}</td>
                        <td className="py-4">{item.stock}</td>
                        <td className="py-4 text-[#8b7d70]">{item.isVisible ? "Visible" : "Hidden"}</td>
                        <td className="py-4 text-right">
                          <button onClick={() => { if (window.confirm("Remove this product from the catalog?")) deleteProduct.mutate({ id: item.id }); }} className="text-[10px] uppercase tracking-[0.12em] text-[#9b6e59]">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {!items.length && <p className="py-10 text-center text-sm text-[#8b7d70]">Your catalog is ready for its first piece.</p>}
              </div>

              {showProductForm && (
                <form onSubmit={submitProduct} className="admin-panel mt-7 grid gap-4 sm:grid-cols-2">
                  <div className="flex items-center justify-between sm:col-span-2">
                    <div><p className="eyebrow">New piece</p><h3 className="mt-2 font-serif text-2xl">Add to the <em>collection.</em></h3></div>
                    <button type="button" onClick={() => setShowProductForm(false)} className="text-[#8b7c6e]"><X size={18} /></button>
                  </div>
                  <label className="field-label">Product name<input required value={product.name} onChange={event => setProduct({ ...product, name: event.target.value })} placeholder="Aurora Heirloom Ring" /></label>
                  <label className="field-label">SKU<input required value={product.sku} onChange={event => setProduct({ ...product, sku: event.target.value })} placeholder="BS-RING-001" /></label>
                  <label className="field-label">Price<input required value={product.price} onChange={event => setProduct({ ...product, price: event.target.value })} placeholder="12900.00" /></label>
                  <label className="field-label">Sale price<input value={product.discountPrice} onChange={event => setProduct({ ...product, discountPrice: event.target.value })} placeholder="10400.00" /></label>
                  <label className="field-label">Stock<input required type="number" value={product.stock} onChange={event => setProduct({ ...product, stock: event.target.value })} /></label>
                  <label className="field-label">Category ID<input required type="number" value={product.categoryId} onChange={event => setProduct({ ...product, categoryId: event.target.value })} /></label>
                  <label className="field-label">Product gallery <span className="text-[10px] normal-case tracking-normal text-[#a37946]">(upload one or multiple images)</span>
                    <input type="file" accept="image/*" multiple onChange={event => handleAssetUploads(event.target.files, urls => setProduct(current => ({ ...current, imageUrl: urls[0] ?? current.imageUrl, imageUrls: urls })))} className="mt-2 text-xs" />
                    {product.imageUrls.length > 0 && <span className="mt-1 block text-[10px] uppercase tracking-[0.12em] text-[#a37946]">{product.imageUrls.length} gallery images uploaded</span>}
                  </label>
                  <label className="field-label">Material<input value={product.material} onChange={event => setProduct({ ...product, material: event.target.value })} placeholder="18k gold vermeil" /></label>
                  <label className="field-label">Color<input value={product.color} onChange={event => setProduct({ ...product, color: event.target.value })} placeholder="Champagne" /></label>
                  <label className="field-label sm:col-span-2">Size / finish<input value={product.size} onChange={event => setProduct({ ...product, size: event.target.value })} placeholder="One size" /></label>
                  <label className="field-label sm:col-span-2">Description<textarea value={product.description} onChange={event => setProduct({ ...product, description: event.target.value })} placeholder="A considered description of the piece." /></label>
                  <label className="field-label sm:col-span-2">Care guide<textarea value={product.careGuide} onChange={event => setProduct({ ...product, careGuide: event.target.value })} placeholder="Keep away from moisture and store in its pouch." /></label>
                  <button className="gold-button sm:col-span-2" type="submit"><Plus size={15} /> {createProduct.isPending ? "Saving…" : "Save product"}</button>
                </form>
              )}
            </section>
          )}

          {tab === "Orders" && (
            <section className="mt-8">
              <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                <div><p className="eyebrow">Fulfillment / {orderItems.length} orders</p><h2 className="mt-2 font-serif text-3xl">Order <em>dashboard.</em></h2></div>
                <button onClick={exportOrders} className="gold-button"><Download size={15} /> Export CSV</button>
              </div>

              <div className="admin-panel mt-7 overflow-x-auto">
                <table className="w-full min-w-[760px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-[#e1d8cd] text-[10px] uppercase tracking-[0.16em] text-[#998a7b]">
                      <th className="pb-4">Order</th>
                      <th className="pb-4">Customer</th>
                      <th className="pb-4">Total</th>
                      <th className="pb-4">Payment</th>
                      <th className="pb-4">Status</th>
                      <th className="pb-4 text-right">Update Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderItems.map(order => (
                      <tr key={order.id} className="border-b border-[#eee6dc]">
                        <td className="py-4 font-medium">#{String(order.id).padStart(4, "0")}</td>
                        <td className="py-4">
                          <p>{order.customerName}</p>
                          <p className="text-xs text-[#8b7d70]">{order.city} · {order.phone}</p>
                        </td>
                        <td className="py-4 text-[#a37946]">{money(order.total)}</td>
                        <td className="py-4 text-xs uppercase tracking-[0.12em] text-[#8b7d70]">{order.paymentMethod}</td>
                        <td className="py-4 text-xs font-medium uppercase tracking-[0.14em] text-[#8b7d70]">{order.status}</td>
                        <td className="py-4 text-right flex items-center justify-end gap-2">
                          <button onClick={() => {
                            const btn = document.activeElement as HTMLButtonElement;
                            if (btn) btn.textContent = "Generating...";
                            setTimeout(() => {
                              const printWindow = window.open('', '_blank');
                              if (btn) btn.textContent = "Print PDF";
                              if (!printWindow) {
                                toast.error("Pop-up blocked. Please allow pop-ups to print invoices.");
                                return;
                              }
                              toast.success(`Invoice #${String(order.id).padStart(4, "0")} generated successfully`);
                              printWindow.document.write(`
                                <html>
                                  <head>
                                    <title>Invoice #${String(order.id).padStart(4, "0")} - By Salma</title>
                                    <style>
                                      body { font-family: 'Cinzel', serif; padding: 40px; color: #2c241d; background: #fff; }
                                      .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #d8ccbe; padding-bottom: 20px; }
                                      .logo { font-size: 24px; font-weight: bold; letter-spacing: 2px; }
                                      .meta { text-align: right; font-size: 12px; color: #706358; }
                                      table { width: 100%; border-collapse: collapse; margin-top: 30px; font-size: 14px; }
                                      th, td { border-bottom: 1px solid #e2d9ce; padding: 12px; text-align: left; }
                                      th { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #706358; }
                                      .totals { margin-top: 30px; float: right; width: 300px; font-size: 14px; }
                                      .totals div { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid #eee6dc; }
                                      .total-bold { font-weight: bold; font-size: 16px; border-bottom: 2px solid #2c241d !important; }
                                    </style>
                                  </head>
                                  <body>
                                    <div class="header">
                                      <div>
                                        <div class="logo">BY SALMA</div>
                                        <div style="font-size: 11px; color: #706358; margin-top: 4px; font-family: sans-serif;">High Jewelry & Luxury Atelier · Lahore</div>
                                      </div>
                                      <div class="meta">
                                        <div><strong>Invoice #${String(order.id).padStart(4, "0")}</strong></div>
                                        <div>Date: ${new Date(order.createdAt).toLocaleDateString()}</div>
                                        <div>Payment: ${order.paymentMethod.toUpperCase()}</div>
                                      </div>
                                    </div>
                                    <div style="margin-top: 30px; font-family: sans-serif; font-size: 13px;">
                                      <strong>Shipped To:</strong><br/>
                                      ${order.customerName}<br/>
                                      ${order.address}, ${order.city}<br/>
                                      Phone: ${order.phone} | Email: ${order.email}
                                    </div>
                                    <table>
                                      <thead>
                                        <tr><th>Item</th><th>Qty</th><th>Price</th><th>Total</th></tr>
                                      </thead>
                                      <tbody>
                                        <tr>
                                          <td>Curated Atelier Order</td>
                                          <td>1</td>
                                          <td>${money(order.total)}</td>
                                          <td>${money(order.total)}</td>
                                        </tr>
                                      </tbody>
                                    </table>
                                    <div class="totals">
                                      <div><span>Subtotal</span><span>${money(order.total)}</span></div>
                                      <div><span>Shipping</span><span>Free</span></div>
                                      <div class="total-bold"><span>Total Paid</span><span>${money(order.total)}</span></div>
                                    </div>
                                    <div style="margin-top: 80px; text-align: center; font-family: sans-serif; font-size: 11px; color: #998a7b;">
                                      Thank you for choosing By Salma. For inquiries, contact concierge@bysalma.com
                                    </div>
                                    <script>window.print();</script>
                                  </body>
                                </html>
                              `);
                              printWindow.document.close();
                            }, 400);
                          }} className="rounded border border-[#d8ccbe] bg-[#fcf9f4] px-2.5 py-1 text-[10px] uppercase tracking-[0.12em] text-[#2c241d] transition hover:bg-[#a37946] hover:text-white">Print PDF</button>
                          <select
                            defaultValue={order.status}
                            onChange={event => updateOrderStatus.mutate({ id: order.id, status: event.target.value as "pending" | "processing" | "shipped" | "delivered" | "cancelled" })}
                            className="rounded border border-[#d8ccbe] bg-[#fcf9f4] px-2 py-1 text-xs"
                          >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {!orderItems.length && <p className="py-12 text-center text-sm text-[#8b7d70]">No customer orders received yet.</p>}
              </div>
            </section>
          )}

          {tab === "Promotions" && (
            <section className="mt-8">
              <div><p className="eyebrow">Discount Engine</p><h2 className="mt-2 font-serif text-3xl">Coupon & <em>discount rules.</em></h2><p className="mt-2 max-w-2xl text-xs leading-6 text-[#8b7d70]">Create a code customers enter in the cart. Set usage limit to 0 for unlimited uses, or enter the maximum number of completed orders that may redeem it.</p></div>
              <form onSubmit={event => { event.preventDefault(); createCoupon.mutate({ code: coupon.code, discountType: coupon.discountType, value: coupon.value, minimumOrder: coupon.minimumOrder, usageLimit: Number(coupon.usageLimit) }); }} className="admin-panel mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-5 items-end">
                <label className="field-label">Coupon Code<input required value={coupon.code} onChange={event => setCoupon({ ...coupon, code: event.target.value })} placeholder="SALMA15" /></label>
                <label className="field-label">Type
                  <select value={coupon.discountType} onChange={event => setCoupon({ ...coupon, discountType: event.target.value as "percentage" | "fixed" })}>
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (PKR)</option>
                  </select>
                </label>
                <label className="field-label">Value<input required type="number" min="0" step="0.01" value={coupon.value} onChange={event => setCoupon({ ...coupon, value: event.target.value })} placeholder="15" /></label>
                <label className="field-label">Minimum order<input type="number" min="0" step="0.01" value={coupon.minimumOrder} onChange={event => setCoupon({ ...coupon, minimumOrder: event.target.value })} placeholder="0" /></label>
                <label className="field-label">Usage limit<input type="number" min="0" value={coupon.usageLimit} onChange={event => setCoupon({ ...coupon, usageLimit: event.target.value })} placeholder="0 = unlimited" /></label>
                <button type="submit" className="gold-button h-10 sm:col-span-2 lg:col-span-5"><Plus size={15} /> Create Coupon</button>
              </form>
              <div className="mt-7 grid gap-4 md:grid-cols-2">
                {(coupons.data ?? []).map(item => <div key={item.id} className="admin-panel"><div className="flex items-start justify-between gap-3"><div><p className="font-serif text-xl">{item.code}</p><p className="mt-1 text-xs text-[#8b7d70]">{item.discountType === "percentage" ? `${item.value}% off` : `${money(item.value)} off`} · Minimum {money(item.minimumOrder)}</p></div><span className="rounded-full bg-[#f4eee6] px-3 py-1 text-[10px] uppercase tracking-[0.14em] text-[#a37946]">{item.isActive ? "Active" : "Paused"}</span></div><div className="mt-4 flex items-center justify-between text-xs text-[#706358]"><span>{item.usageCount} used</span><span>{item.usageLimit > 0 ? `${item.usageLimit - item.usageCount} remaining of ${item.usageLimit}` : "Unlimited uses"}</span></div><div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#eee6dc]"><div className="h-full bg-[#a37946]" style={{ width: item.usageLimit > 0 ? `${Math.min(100, (item.usageCount / item.usageLimit) * 100)}%` : "0%" }} /></div></div>)}
              </div>
            </section>
          )}

          {tab === "Homepage" && (
            <section className="mt-8">
              <div><p className="eyebrow">Merchandising</p><h2 className="mt-2 font-serif text-3xl">Homepage section <em>visibility.</em></h2></div>
              <div className="admin-panel mt-7 space-y-4 max-w-2xl">
                {sectionItems.map(section => (
                  <div key={section.id} className="flex items-center justify-between border-b border-[#eee6dc] py-3">
                    <div>
                      <p className="font-medium">{section.label}</p>
                      <p className="text-xs text-[#8b7d70]">Key: {section.sectionKey}</p>
                    </div>
                    <button
                      onClick={() => {
                        setSections(current => current.map(item => item.id === section.id ? { ...item, isVisible: item.isVisible ? 0 : 1 } : item));
                        if (liveSections.data?.length) toggleSection.mutate({ id: section.id, isVisible: section.isVisible ? 0 : 1 });
                      }}
                      className={section.isVisible ? "text-[#a37946]" : "text-[#a09387]"}
                    >
                      {section.isVisible ? <Eye size={20} /> : <EyeOff size={20} />}
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}

          {tab === "Inquiries" && (
            <section className="mt-8">
              <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                <div><p className="eyebrow">Client Support</p><h2 className="mt-2 font-serif text-3xl">Customer <em>Inquiries.</em></h2></div>
              </div>
              <div className="admin-panel mt-7 overflow-x-auto">
                <table className="w-full min-w-[760px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-[#e1d8cd] text-[10px] uppercase tracking-[0.16em] text-[#998a7b]">
                      <th className="pb-4">Date</th>
                      <th className="pb-4">Sender</th>
                      <th className="pb-4">Subject & Message</th>
                      <th className="pb-4">Status</th>
                      <th className="pb-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(inquiriesQuery.data ?? []).map(inquiry => (
                      <tr key={inquiry.id} className="border-b border-[#eee6dc] align-top">
                        <td className="py-4 text-xs text-[#8b7d70]">{new Date(inquiry.createdAt).toLocaleDateString()}</td>
                        <td className="py-4"><p className="font-medium">{inquiry.name}</p><p className="text-xs text-[#8b7d70]">{inquiry.email}</p></td>
                        <td className="py-4 max-w-md"><p className="font-medium text-xs text-[#a37946]">{inquiry.subject}</p><p className="mt-1 text-xs text-[#706358]">{inquiry.message}</p></td>
                        <td className="py-4 text-xs uppercase tracking-[0.14em] text-[#8b7d70]">{inquiry.status}</td>
                        <td className="py-4 text-right">
                          <select
                            defaultValue={inquiry.status}
                            onChange={e => updateInquiryStatus.mutate({ id: inquiry.id, status: e.target.value })}
                            className="rounded border border-[#d8ccbe] bg-[#fcf9f4] px-2 py-1 text-xs"
                          >
                            <option value="unread">Unread</option>
                            <option value="replied">Replied</option>
                            <option value="archived">Archived</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {!(inquiriesQuery.data ?? []).length && <p className="py-12 text-center text-sm text-[#8b7d70]">No customer inquiries received yet.</p>}
              </div>
            </section>
          )}

          {tab === "Brand & Logo" && (
            <section className="mt-8 grid gap-8 lg:grid-cols-2">
              <form onSubmit={e => { e.preventDefault(); updateStoreMutation.mutate(storeForm); }} className="admin-panel space-y-4 h-fit">
                <p className="eyebrow">Brand Identity & Logo</p>
                <h3 className="font-serif text-2xl">Atelier <em>Branding.</em></h3>
                <p className="text-xs text-[#8b7d70]">Configure your brand logo, monogram symbol, store title, theme preferences, and footer branding.</p>
                <label className="field-label">Brand Title<input required value={storeForm.brandTitle} onChange={e => setStoreForm({ ...storeForm, brandTitle: e.target.value })} className="mt-1" /></label>
                <label className="field-label">Brand Monogram (e.g. BS)<input required value={storeForm.brandMonogram} onChange={e => setStoreForm({ ...storeForm, brandMonogram: e.target.value })} className="mt-1" /></label>
                <label className="field-label">Logo Image Upload (Upload from local disk)</label>
                <div className="flex items-center gap-3">
                  <input type="file" accept="image/*" onChange={async e => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const formData = new FormData();
                    formData.append("file", file);
                    const res = await fetch("/api/upload", { method: "POST", body: formData });
                    const data = await res.json();
                    if (data.url) setStoreForm(prev => ({ ...prev, brandLogoUrl: data.url }));
                  }} className="text-xs" />
                </div>
                {storeForm.brandLogoUrl && (
                  <div className="mt-2 flex items-center gap-4 rounded border border-[#e2d9ce] bg-[#fdfbf7] p-3">
                    <img src={storeForm.brandLogoUrl} alt="Logo Preview" className="h-10 w-10 object-contain rounded" />
                    <span className="text-xs font-mono text-[#5a4e42] truncate">{storeForm.brandLogoUrl}</span>
                  </div>
                )}
                <label className="field-label">Theme Mode Preference</label>
                <select value={storeForm.themeMode} onChange={e => setStoreForm({ ...storeForm, themeMode: e.target.value })} className="w-full rounded border border-[#e2d9ce] p-2 text-xs bg-white text-[#2c241d]">
                  <option value="light">Classic Warm Light Atelier</option>
                  <option value="dark">Cinematic Midnight Dark</option>
                </select>
                <hr className="border-[#e2d9ce] my-3" />
                <p className="eyebrow">Footer & Social Customization</p>
                <label className="field-label">Footer Tagline<input required value={footerForm.tagline} onChange={e => setFooterForm({ ...footerForm, tagline: e.target.value })} className="mt-1" /></label>
                <label className="field-label">Instagram URL<input required type="url" value={footerForm.instagramHref} onChange={e => setFooterForm({ ...footerForm, instagramHref: e.target.value })} className="mt-1" /></label>
                <label className="field-label">Facebook URL<input required type="url" value={footerForm.facebookHref} onChange={e => setFooterForm({ ...footerForm, facebookHref: e.target.value })} className="mt-1" /></label>
                <label className="field-label">WhatsApp Number<input required value={footerForm.whatsappNumber} onChange={e => setFooterForm({ ...footerForm, whatsappNumber: e.target.value })} className="mt-1" /></label>
                <div className="flex gap-3 pt-2">
                  <button type="submit" onClick={() => updateFooterMutation.mutate(footerForm)} className="gold-button flex-1 text-xs">{updateFooterMutation.isPending ? "Saving Footer..." : "Save Footer & Social"}</button>
                  <button type="submit" className="gold-button flex-1 text-xs">{updateStoreMutation.isPending ? "Saving Brand..." : "Save Brand & Theme"}</button>
                </div>
              </form>
              <div className="admin-panel space-y-6 h-fit">
                <div>
                  <p className="eyebrow">Branding Preview</p>
                  <h3 className="font-serif text-2xl">Live Header & <em>Invoice View.</em></h3>
                </div>
                <div className="rounded border border-[#e2d9ce] p-6 bg-[#fdfbf7] text-center space-y-4">
                  <div className="inline-flex h-16 w-16 items-center justify-center rounded-full border border-[#d8ccbe] bg-white shadow-sm">
                    {storeForm.brandLogoUrl ? (
                      <img src={storeForm.brandLogoUrl} alt="Logo" className="h-12 w-12 object-contain" />
                    ) : (
                      <span className="font-serif text-lg tracking-widest text-[#2c241d]">{storeForm.brandMonogram}</span>
                    )}
                  </div>
                  <h4 className="font-serif text-xl tracking-[0.2em]">{storeForm.brandTitle}</h4>
                  <p className="text-xs text-[#8b7d70]">Your brand monogram, title, logo, and social channels automatically populate all storefront headers, footers, and invoices.</p>
                </div>

                <div>
                  <p className="eyebrow">Live Footer Preview</p>
                  <h3 className="font-serif text-xl">Footer & <em>Social Output.</em></h3>
                </div>
                <div className="rounded border border-[#28221e] bg-[#28221e] p-6 text-[#d6c7b7] space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#e5c28f] text-[10px] text-[#e5c28f]">BS</span>
                    <span className="font-serif text-sm tracking-[0.16em] text-[#f3e8da]">{storeForm.brandTitle}</span>
                  </div>
                  <p className="text-xs leading-5 text-[#9d8d7c]" dangerouslySetInnerHTML={{ __html: footerForm.tagline }} />
                  <div className="flex flex-wrap gap-3 text-[11px] pt-2 border-t border-[#3e342d]">
                    <span className="text-[#a37946]">Instagram</span>
                    <span className="text-[#a37946]">Facebook</span>
                    <span className="text-[#25D366]">WhatsApp ({footerForm.whatsappNumber})</span>
                  </div>
                </div>
              </div>
            </section>
          )}

          {tab === "Settings" && (
            <section className="mt-8 grid gap-8 lg:grid-cols-2">
              <form onSubmit={e => { e.preventDefault(); updateStoreMutation.mutate(storeForm); }} className="admin-panel space-y-4 h-fit">
                <p className="eyebrow">Atelier Contact & Location</p>
                <h3 className="font-serif text-2xl">Store <em>details.</em></h3>
                <p className="text-xs text-[#8b7d70]">Manage atelier address, support contact info, and business hours.</p>
                <label className="field-label">Atelier Location<input required value={storeForm.atelierLocation} onChange={e => setStoreForm({ ...storeForm, atelierLocation: e.target.value })} className="mt-1" /></label>
                <label className="field-label">Support Email<input required type="email" value={storeForm.supportEmail} onChange={e => setStoreForm({ ...storeForm, supportEmail: e.target.value })} className="mt-1" /></label>
                <label className="field-label">Support Phone<input required value={storeForm.supportPhone} onChange={e => setStoreForm({ ...storeForm, supportPhone: e.target.value })} className="mt-1" /></label>
                <label className="field-label">Hours of Operation<input required value={storeForm.hoursOfOperation} onChange={e => setStoreForm({ ...storeForm, hoursOfOperation: e.target.value })} className="mt-1" /></label>
                <label className="field-label">Contact Page Headline<input required value={storeForm.contactHeadline} onChange={e => setStoreForm({ ...storeForm, contactHeadline: e.target.value })} className="mt-1" /></label>
                <label className="field-label">Contact Page Intro<textarea required rows={3} value={storeForm.contactIntro} onChange={e => setStoreForm({ ...storeForm, contactIntro: e.target.value })} className="mt-1" /></label>
                <label className="field-label">Shipping Page Headline<input required value={storeForm.shippingHeadline} onChange={e => setStoreForm({ ...storeForm, shippingHeadline: e.target.value })} className="mt-1" /></label>
                <label className="field-label">Shipping Page Intro<textarea required rows={3} value={storeForm.shippingIntro} onChange={e => setStoreForm({ ...storeForm, shippingIntro: e.target.value })} className="mt-1" /></label>
                <label className="field-label">Shipping Feature Cards (JSON)<textarea required rows={7} value={storeForm.shippingCards} onChange={e => setStoreForm({ ...storeForm, shippingCards: e.target.value })} className="mt-1 font-mono text-xs" /></label>
                <label className="field-label">Shipping Policy Sections (JSON)<textarea required rows={7} value={storeForm.shippingSections} onChange={e => setStoreForm({ ...storeForm, shippingSections: e.target.value })} className="mt-1 font-mono text-xs" /></label>
                <div className="rounded border border-[#e2d9ce] bg-[#f8f2e9] p-4">
                  <label className="flex items-center gap-3 text-xs font-medium"><input type="checkbox" checked={storeForm.storeDiscountEnabled === 1} onChange={e => setStoreForm({ ...storeForm, storeDiscountEnabled: e.target.checked ? 1 : 0 })} /> Apply this percentage automatically to all products without a product/category sale</label>
                  <label className="field-label mt-3">Store-wide discount percentage<input type="number" min="0" max="100" step="0.01" value={storeForm.storeDiscountPercentage} onChange={e => setStoreForm({ ...storeForm, storeDiscountPercentage: e.target.value })} placeholder="10" /></label>
                </div>
                <button type="submit" className="gold-button">{updateStoreMutation.isPending ? "Saving..." : "Save Store, Pages & Discount"}</button>
              </form>

              <form onSubmit={e => { e.preventDefault(); updateFooterMutation.mutate(footerForm); }} className="admin-panel space-y-4">
                <p className="eyebrow">Footer & Social Channels</p>
                <h3 className="font-serif text-2xl">Footer content & <em>links.</em></h3>
                <p className="text-xs text-[#8b7d70]">Edit tagline, copyright, social handles, Instagram/Facebook URLs, and WhatsApp support number.</p>
                <label className="field-label">Tagline<input required value={footerForm.tagline} onChange={e => setFooterForm({ ...footerForm, tagline: e.target.value })} className="mt-1" /></label>
                <label className="field-label">Copyright Notice<input required value={footerForm.copyright} onChange={e => setFooterForm({ ...footerForm, copyright: e.target.value })} className="mt-1" /></label>
                <label className="field-label">Explore Links (JSON)<textarea required rows={3} value={footerForm.exploreLinks} onChange={e => setFooterForm({ ...footerForm, exploreLinks: e.target.value })} className="mt-1 font-mono text-xs" /></label>
                <label className="field-label">Care Links (JSON)<textarea required rows={3} value={footerForm.careLinks} onChange={e => setFooterForm({ ...footerForm, careLinks: e.target.value })} className="mt-1 font-mono text-xs" /></label>
                <label className="field-label">Social Description<input required value={footerForm.socialText} onChange={e => setFooterForm({ ...footerForm, socialText: e.target.value })} className="mt-1" /></label>
                <label className="field-label">Instagram Handle<input required value={footerForm.socialHandle} onChange={e => setFooterForm({ ...footerForm, socialHandle: e.target.value })} className="mt-1" /></label>
                <label className="field-label">Instagram URL<input required type="url" value={footerForm.instagramHref} onChange={e => setFooterForm({ ...footerForm, instagramHref: e.target.value })} className="mt-1" /></label>
                <label className="field-label">Facebook URL<input required type="url" value={footerForm.facebookHref} onChange={e => setFooterForm({ ...footerForm, facebookHref: e.target.value })} className="mt-1" /></label>
                <label className="field-label">WhatsApp Number (with country code)<input required value={footerForm.whatsappNumber} onChange={e => setFooterForm({ ...footerForm, whatsappNumber: e.target.value })} placeholder="+923000000000" className="mt-1" /></label>
                <div className="flex items-center gap-2 pt-2">
                  <button type="button" onClick={() => setFooterForm({ ...footerForm, tagline: `<strong>${footerForm.tagline}</strong>` })} className="rounded border border-[#d8ccbe] px-2 py-1 text-[10px] uppercase"><b>B</b> Tagline</button>
                  <button type="button" onClick={() => setFooterForm({ ...footerForm, tagline: `<em>${footerForm.tagline}</em>` })} className="rounded border border-[#d8ccbe] px-2 py-1 text-[10px] uppercase"><i>I</i> Tagline</button>
                </div>
                <button type="submit" className="gold-button w-full">{updateFooterMutation.isPending ? "Saving..." : "Save Footer & Social Settings"}</button>
              </form>
            </section>
          )}
        </>
      )}
    </div>
  );
}

export default function Admin() {
  return (
    <DashboardLayout>
      <AdminContent />
    </DashboardLayout>
  );
}
