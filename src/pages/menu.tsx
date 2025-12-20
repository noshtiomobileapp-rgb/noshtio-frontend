"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import { fetchPublicMenu } from "@/api/menu.api";
import { PublicMenuDTO } from "@/contracts/menu.contract";
import { useSessionStore } from "@/store/session.store";

import ItemCard from "@/components/customer/ItemCard";
import CartBar from "@/components/customer/CartBar";

/* -------------------------------------------------------
   Backend public menu response (actual runtime shape)
------------------------------------------------------- */
type PublicMenuApiResponse =
  | PublicMenuDTO
  | { success: boolean; menu: PublicMenuDTO };

export default function MenuPage() {
  const router = useRouter();

  const restaurantId = useSessionStore((s) => s.restaurantId);
  const setRestaurant = useSessionStore((s) => s.setRestaurant);
  const initSession = useSessionStore((s) => s.initSession);

  const [menu, setMenu] = useState<PublicMenuDTO | null>(null);
  const [loading, setLoading] = useState(true);

  /* -------------------------------------------------------
     STEP 0: Initialize session (guestId + sessionId)
     ----------------------------------------------------- */
  useEffect(() => {
    initSession();
  }, [initSession]);

  /* -------------------------------------------------------
     STEP 1: Initialize restaurant from URL (QR entry)
     ----------------------------------------------------- */
  useEffect(() => {
    if (!router.isReady) return;

    const { restaurantId: rid, tableId: tid } = router.query;

    if (typeof rid === "string" && !restaurantId) {
      setRestaurant(rid, typeof tid === "string" ? tid : undefined);
    }
  }, [router.isReady, restaurantId, setRestaurant]);

  /* -------------------------------------------------------
     STEP 2: Fetch menu once restaurantId is available
     ----------------------------------------------------- */
  useEffect(() => {
    if (!restaurantId) {
      setLoading(false);
      return;
    }

    setLoading(true);

    fetchPublicMenu(restaurantId)
      .then((res: PublicMenuApiResponse) => {
        // ✅ Correct runtime shape handling
        if (
          typeof res === "object" &&
          res !== null &&
          "menu" in res &&
          res.menu
        ) {
          setMenu(res.menu);
        } else {
          setMenu(res as PublicMenuDTO);
        }
      })
      .catch(() => setMenu(null))
      .finally(() => setLoading(false));
  }, [restaurantId]);

  /* -------------------------------------------------------
     UI STATES
     ----------------------------------------------------- */
  if (loading) {
    return <div className="p-4">Loading menu...</div>;
  }

  if (!restaurantId) {
    return (
      <div className="p-4 text-red-600">
        Invalid access. Restaurant not specified.
      </div>
    );
  }

  if (
    !menu ||
    !Array.isArray(menu.categories) ||
    menu.categories.length === 0
  ) {
    return <div className="p-4">No menu available</div>;
  }

  /* -------------------------------------------------------
     RENDER
     ----------------------------------------------------- */
  return (
    <>
      <div className="p-4 space-y-10">
        {menu.categories.map((cat) => (
          <section key={cat._id ?? cat.name} className="space-y-4">
            <h2 className="text-lg font-semibold">{cat.name}</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Array.isArray(cat.items) &&
                cat.items.map((item) => (
                  <ItemCard
                    key={item._id}
                    item={{
                      _id: item._id,
                      name: item.name,
                      price: item.price,
                    }}
                  />
                ))}
            </div>
          </section>
        ))}
      </div>

      {/* Floating cart CTA */}
      <CartBar />
    </>
  );
}
