import { create } from "zustand";

type UIState = {
  isCartOpen: boolean;
  activeCategoryId: string | null;
  setCartOpen: (v: boolean) => void;
  setActiveCategory: (id: string) => void;
};

export const useUIStore = create<UIState>((set) => ({
  isCartOpen: false,
  activeCategoryId: null,
  setCartOpen: (v) => set({ isCartOpen: v }),
  setActiveCategory: (id) => set({ activeCategoryId: id }),
}));
