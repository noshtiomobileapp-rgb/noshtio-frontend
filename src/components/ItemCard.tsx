import { PublicMenuItemDTO } from "@/contracts/menu.contract";
import { useCartStore } from "@/store";

type Props = {
  item: PublicMenuItemDTO;
};

export function ItemCard({ item }: Props) {
  const addItem = useCartStore((s) => s.addItem);
  const increase = useCartStore((s) => s.increase);
  const decrease = useCartStore((s) => s.decrease);
  const quantity = useCartStore((s) => s.getQuantity(item.id));

  return (
    <div>
      <div>{item.name}</div>
      <div>₹{item.price}</div>

      {quantity === 0 ? (
        <button
          disabled={!item.isAvailable}
          onClick={() =>
            addItem({
              id: item.id,
              name: item.name,
              price: item.price,
            })
          }
        >
          Add
        </button>
      ) : (
        <div>
          <button onClick={() => decrease(item.id)}>-</button>
          <span>{quantity}</span>
          <button onClick={() => increase(item.id)}>+</button>
        </div>
      )}
    </div>
  );
}
