import { useEffect, useState } from "react";
import { fetchPublicMenu } from "@/api/menu.api";
import { PublicMenuDTO } from "@/contracts/menu.contract";
import { useSessionStore } from "@/store";
import { ItemCard } from "@/components/ItemCard";

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

  if (loading) return <div>Loading menu...</div>;
  if (!menu) return <div>No menu available</div>;

  return (
    <div>
      {menu.categories.map((cat) => (
        <section key={cat.id}>
          <h2>{cat.name}</h2>
          {cat.items.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </section>
      ))}
    </div>
  );
}
