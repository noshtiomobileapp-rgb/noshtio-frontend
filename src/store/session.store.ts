// src/store/session.store.ts
import { create } from "zustand";

type SessionState = {
  restaurantId: string | null;
  tableId: string | null;
  guestId: string;
  setSession: (r: string, t?: string) => void;
};

export const useSessionStore = create<SessionState>((set) => ({
  restaurantId: null,
  tableId: null,
  guestId: crypto.randomUUID(),

  setSession: (restaurantId, tableId) =>
    set({ restaurantId, tableId: tableId ?? null }),
}));
