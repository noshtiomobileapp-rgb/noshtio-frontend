// src/store/cart-store.ts
import { create } from "zustand";

/**
 * Cart item aligned with backend order API
 */
export type CartItem = {
  itemId: string;     // backend Item _id
  name: string;
  price: number;
  img?: string;
  qty: number;
};

type CartState = {
  items: CartItem[];

  // selectors
  getQuantity: (itemId: string) => number;
  totalQty: () => number;
  totalAmount: () => number;

  // actions
  addItem: (item: Omit<CartItem, "qty">) => void;
  increase: (itemId: string) => void;
  decrease: (itemId: string) => void;
  clearCart: () => void;
};

export const useCartStore = create<CartState>((set, get) => ({
  items: [],

  /* -------------------- selectors -------------------- */

  getQuantity: (itemId) => {
    const item = get().items.find((i) => i.itemId === itemId);
    return item ? item.qty : 0;
  },

  totalQty: () =>
    get().items.reduce((sum, item) => sum + item.qty, 0),

  totalAmount: () =>
    get().items.reduce(
      (sum, item) => sum + item.qty * item.price,
      0
    ),

  /* -------------------- actions -------------------- */

  addItem: (item) =>
    set((state) => {
      const existing = state.items.find(
        (i) => i.itemId === item.itemId
      );

      if (existing) {
        return {
          items: state.items.map((i) =>
            i.itemId === item.itemId
              ? { ...i, qty: i.qty + 1 }
              : i
          ),
        };
      }

      return {
        items: [...state.items, { ...item, qty: 1 }],
      };
    }),

  increase: (itemId) =>
    set((state) => ({
      items: state.items.map((i) =>
        i.itemId === itemId
          ? { ...i, qty: i.qty + 1 }
          : i
      ),
    })),

  decrease: (itemId) =>
    set((state) => ({
      items: state.items
        .map((i) =>
          i.itemId === itemId
            ? { ...i, qty: i.qty - 1 }
            : i
        )
        .filter((i) => i.qty > 0),
    })),

  clearCart: () => set({ items: [] }),
}));
