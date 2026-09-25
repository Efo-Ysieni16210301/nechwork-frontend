/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react-hooks/set-state-in-effect */
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { Product } from "../data/products";
import { useAuth } from "./AuthContext";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  addToCart: (product: Product) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);
const storageKey = "shop-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const userStorageKey = user ? `${storageKey}:${user.uid}` : `${storageKey}:guest`;

  useEffect(() => {
    if (authLoading) return;

    const saved = localStorage.getItem(userStorageKey);
    try {
      setItems(saved ? (JSON.parse(saved) as CartItem[]) : []);
    } catch {
      localStorage.removeItem(userStorageKey);
      setItems([]);
    }
  }, [authLoading, userStorageKey]);

  useEffect(() => {
    if (authLoading) return;
    localStorage.setItem(userStorageKey, JSON.stringify(items));
  }, [authLoading, items, userStorageKey]);

  const value = useMemo<CartContextValue>(() => ({
    items,
    itemCount: items.reduce((total, item) => total + item.quantity, 0),
    subtotal: items.reduce((total, item) => total + item.product.price * item.quantity, 0),
    addToCart: (product) => setItems((current) => {
      const existing = current.find((item) => item.product.id === product.id);
      if (existing) {
        return current.map((item) => item.product.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item);
      }
      return [...current, { product, quantity: 1 }];
    }),
    updateQuantity: (productId, quantity) => setItems((current) =>
      quantity > 0
        ? current.map((item) => item.product.id === productId ? { ...item, quantity } : item)
        : current.filter((item) => item.product.id !== productId)),
    removeFromCart: (productId) => setItems((current) =>
      current.filter((item) => item.product.id !== productId)),
    clearCart: () => setItems([]),
  }), [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
