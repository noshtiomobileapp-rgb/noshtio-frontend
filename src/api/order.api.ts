import {
  CreateOrderResponse,
  GetOrderResponse,
} from "@/contracts/order.contract";

/* ------------------------------------------------------------
   PLACE CUSTOMER ORDER
   POST /api/customer/order
------------------------------------------------------------- */
export async function placeCustomerOrder(payload: {
  restaurantId: string;
  sessionId: string;
  items: { itemId: string; qty: number }[];
}): Promise<CreateOrderResponse> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/customer/order`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }
  );

  if (!res.ok) {
    throw new Error("Failed to place order");
  }

  return res.json();
}

/* ------------------------------------------------------------
   GET CUSTOMER ORDER (POLLING)
   GET /api/customer/order/:orderId
------------------------------------------------------------- */
export async function getCustomerOrder(
  orderId: string
): Promise<GetOrderResponse> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/customer/order/${orderId}`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch order");
  }

  return res.json();
}
