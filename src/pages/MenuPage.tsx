"use client";

import { useEffect, useState } from "react";
import { fetchPublicMenu } from "@/api/menu.api";
import { PublicMenuDTO } from "@/contracts/menu.contract";
import { useSessionStore } from "@/store/session.store";
import ItemCard from "@/components/ItemCard";
import CartBar from "@/components/customer/CartBar";

export default function MenuPage() {
  const restaurantId = useSessionStore((s) => s.restaurantId);
  const [menu, setMenu] = useState<PublicMenuDTO | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!restaurantId) return;

    fetchPublicMenu(restaurantId)
      .then(setMenu)
      .finally(() => setLoading(false));
  }, [restaurantId]);

  if (loading) return <div className="p-4">Loading menu...</div>;
  if (!menu) return <div className="p-4">No menu available</div>;

  return (
    <>
      <div className="p-4 space-y-6">
        {menu.categories.map((cat) => (
          <section key={cat._id}>
            <h2 className="text-lg font-semibold mb-3">{cat.name}</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {cat.items.map((item) => (
                <ItemCard
                  key={item._id}
                  item={{
                    _id: item._id,      // DTO → internal model mapping
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
