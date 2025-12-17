import { useCartStore } from "@/store";

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const clear = useCartStore((s) => s.clearCart);

  const total = items.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0
  );

  if (items.length === 0) {
    return <div>Your cart is empty</div>;
  }

  return (
    <div>
      {items.map((i) => (
        <div key={i.id}>
          {i.name} × {i.quantity}
        </div>
      ))}
      <div>Total: ₹{total}</div>
      <button>Checkout</button>
      <button onClick={clear}>Clear</button>
    </div>
  );
}
