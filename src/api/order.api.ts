import { http } from "./http";
import {
  CreateOrderResponse,
  GetOrderResponse,
} from "@/contracts/order.contract";

/* ============================================================
   Shared Types
============================================================ */

export type OrderStatus =
  | "NEW"
  | "PREPARING"
  | "READY"
  | "COMPLETED";

export type VendorOrderItem = {
  name: string;
  qty: number;
};

export type VendorOrder = {
  id: string;
  tableLabel?: string;
  sessionId?: string;
  createdAt: string;
  status: OrderStatus;
  items?: VendorOrderItem[];
  instructions?: string;
};

/* ============================================================
   CUSTOMER APIs
============================================================ */

/* ------------------------------------------------------------
   PLACE CUSTOMER ORDER
------------------------------------------------------------- */
export async function placeCustomerOrder(payload: {
  restaurantId: string;
  sessionId: string;
  items: { itemId: string; qty: number }[];
}): Promise<CreateOrderResponse> {
  return http<CreateOrderResponse>({
    method: "POST",
    url: "/customer/order",
    data: payload,
  });
}

/* ------------------------------------------------------------
   GET CUSTOMER ORDER (POLLING)
------------------------------------------------------------- */
export async function getCustomerOrder(
  orderId: string
): Promise<GetOrderResponse> {
  return http<GetOrderResponse>({
    method: "GET",
    url: `/customer/order/${orderId}`,
    headers: { "Cache-Control": "no-store" },
  });
}

/* ============================================================
   VENDOR APIs
============================================================ */

/* ------------------------------------------------------------
   GET VENDOR ORDERS (POLLING)
------------------------------------------------------------- */
export function getVendorOrders(status: OrderStatus) {
  return http<{ data: VendorOrder[] }>({
    method: "GET",
    url: `/vendor/orders?status=${status}`,
    headers: { "Cache-Control": "no-store" },
  });
}

/* ------------------------------------------------------------
   GET SINGLE VENDOR ORDER (DETAIL DRAWER)
------------------------------------------------------------- */
export function getVendorOrderById(orderId: string) {
  return http<VendorOrder>({
    method: "GET",
    url: `/vendor/orders/${orderId}`,
  });
}

/* ------------------------------------------------------------
   UPDATE VENDOR ORDER STATUS
------------------------------------------------------------- */
export function updateVendorOrderStatus(
  orderId: string,
  status: OrderStatus
) {
  return http<{ success: boolean }>({
    method: "PATCH",
    url: `/vendor/orders/${orderId}/status`,
    data: { status },
  });
}
