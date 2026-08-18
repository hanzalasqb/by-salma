import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type StoreProduct = {
  id: number;
  name: string;
  slug: string;
  sku?: string;
  price: string | number;
  discountPrice?: string | number | null;
  description?: string | null;
  careGuide?: string | null;
  material?: string | null;
  color?: string | null;
  size?: string | null;
  imageUrl?: string | null;
  images?: string | null;
  category?: string;
};

type CartLine = { product: StoreProduct; quantity: number };

type StoreContextValue = {
  items: CartLine[];
  wishlist: number[];
  compare: number[];
  addToCart: (product: StoreProduct, quantity?: number) => void;
  setQuantity: (productId: number, quantity: number) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
  toggleWishlist: (productId: number) => void;
  toggleCompare: (productId: number) => void;
  itemCount: number;
  subtotal: number;
};

const StoreContext = createContext<StoreContextValue | null>(null);

function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) as T : fallback;
  } catch {
    return fallback;
  }
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartLine[]>(() => readStorage<CartLine[]>("by-salma-cart", []));
  const [wishlist, setWishlist] = useState<number[]>(() => readStorage<number[]>("by-salma-wishlist", []));
  const [compare, setCompare] = useState<number[]>(() => readStorage<number[]>("by-salma-compare", []));

  useEffect(() => localStorage.setItem("by-salma-cart", JSON.stringify(items)), [items]);
  useEffect(() => localStorage.setItem("by-salma-wishlist", JSON.stringify(wishlist)), [wishlist]);
  useEffect(() => localStorage.setItem("by-salma-compare", JSON.stringify(compare)), [compare]);

  const value = useMemo<StoreContextValue>(() => {
    const addToCart = (product: StoreProduct, quantity = 1) => {
      setItems(current => {
        const existing = current.find(line => line.product.id === product.id);
        if (existing) return current.map(line => line.product.id === product.id ? { ...line, quantity: line.quantity + quantity } : line);
        return [...current, { product, quantity }];
      });
    };
    const setQuantity = (productId: number, quantity: number) => setItems(current => quantity <= 0 ? current.filter(line => line.product.id !== productId) : current.map(line => line.product.id === productId ? { ...line, quantity } : line));
    const removeFromCart = (productId: number) => setItems(current => current.filter(line => line.product.id !== productId));
    const clearCart = () => setItems([]);
    const toggleWishlist = (productId: number) => setWishlist(current => current.includes(productId) ? current.filter(id => id !== productId) : [...current, productId]);
    const toggleCompare = (productId: number) => setCompare(current => current.includes(productId) ? current.filter(id => id !== productId) : current.length >= 3 ? current : [...current, productId]);
    const price = (product: StoreProduct) => Number(product.discountPrice ?? product.price);
    return {
      items,
      wishlist,
      compare,
      addToCart,
      setQuantity,
      removeFromCart,
      clearCart,
      toggleWishlist,
      toggleCompare,
      itemCount: items.reduce((sum, line) => sum + line.quantity, 0),
      subtotal: items.reduce((sum, line) => sum + price(line.product) * line.quantity, 0),
    };
  }, [items, wishlist, compare]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const value = useContext(StoreContext);
  if (!value) throw new Error("useStore must be used within StoreProvider");
  return value;
}
