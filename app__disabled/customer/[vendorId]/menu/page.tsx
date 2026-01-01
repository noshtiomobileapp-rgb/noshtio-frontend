import React from "react";

export default async function VendorMenuPage({ params }: { params: { vendorId: string } }) {
  const vendorId = params.vendorId;

  // Fetch restaurant details
  const restaurantRes = await fetch(`http://localhost:4000/api/vendors/${vendorId}/restaurant`, {
    cache: "no-store",
  });
  const restaurant = restaurantRes.ok ? await restaurantRes.json() : null;

  // Fetch vendor menu
  const menuRes = await fetch(`http://localhost:4000/api/vendors/${vendorId}/menu`, {
    cache: "no-store",
  });
  const menuData = menuRes.ok ? await menuRes.json() : null;

  if (!restaurant) {
    return <main className="p-6 text-red-600">Restaurant not found</main>;
  }

  const items = Array.isArray(menuData?.categories)
    ? menuData.categories
    : [];

  return (
    <main className="p-6">
      <header className="flex items-center gap-4">
        {restaurant.logo_url ? (
          <img
            src={restaurant.logo_url}
            alt={restaurant.name}
            className="w-20 h-20 rounded object-cover"
          />
        ) : (
          <div className="w-20 h-20 bg-gray-200 rounded" />
        )}

        <div>
          <h1 className="text-2xl font-bold">{restaurant.restaurantName}</h1>
          <p className="text-sm text-gray-600">{restaurant.description || "No details available"}</p>
        </div>
      </header>

      <section className="mt-6 space-y-6">
        {items.length === 0 ? (
          <div>No menu available</div>
        ) : (
          items.map((cat: any) => (
            <div key={cat._id}>
              <h2 className="text-xl font-semibold">{cat.name}</h2>
              <div className="grid gap-3 mt-2">
                {cat.items?.map((item: any) => (
                  <div key={item._id} className="p-3 border rounded flex justify-between">
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-gray-600">{item.description}</div>
                    </div>
                    <div className="font-medium">₹{item.price}</div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </section>
    </main>
  );
}
