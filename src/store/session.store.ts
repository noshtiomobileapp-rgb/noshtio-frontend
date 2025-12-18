// src/store/session.store.ts
import { create } from "zustand";

type SessionState = {
  restaurantId: string | null;
  tableId: string | null;

  // Stable identifiers
  guestId: string | null;
  sessionId: string | null;

  // Actions
  initSession: () => void;
  setRestaurant: (restaurantId: string, tableId?: string) => void;
};

export const useSessionStore = create<SessionState>((set) => ({
  restaurantId: null,
  tableId: null,
  guestId: null,
  sessionId: null,

  /**
   * Initializes guestId + sessionId once per browser
   * Safe for Next.js (runs only on client)
   */
  initSession: () => {
    if (typeof window === "undefined") return;

    // ---- guestId (who is ordering)
    let guestId = localStorage.getItem("guestId");
    if (!guestId) {
      guestId = crypto.randomUUID();
      localStorage.setItem("guestId", guestId);
    }

    // ---- sessionId (this dining session)
    let sessionId = localStorage.getItem("sessionId");
    if (!sessionId) {
      sessionId = `SESSION_${Date.now()}`;
      localStorage.setItem("sessionId", sessionId);
    }

    set({ guestId, sessionId });
  },

  /**
   * Called from QR page
   */
  setRestaurant: (restaurantId, tableId) =>
    set({
      restaurantId,
      tableId: tableId ?? null,
    }),
}));
