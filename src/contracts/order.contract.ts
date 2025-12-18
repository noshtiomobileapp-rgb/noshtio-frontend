/* ============================================================
   ORDER — FRONTEND API CONTRACT (MVP)
   Backend-aligned, runtime-safe
   ============================================================ */

export type ObjectId = string;

/* -----------------------------
   Order Status (MATCH BACKEND)
------------------------------ */
export enum OrderStatus {
  PLACED = "PLACED",
  PREPARING = "PREPARING",
  READY = "READY",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

/* -----------------------------
   Order Item (Response)
------------------------------ */
export interface OrderItem {
  itemId: ObjectId;
  name: string;
  price: number;
  qty: number;
}

/* -----------------------------
   Order (Polling)
------------------------------ */
export interface Order {
  _id: ObjectId;
  status: OrderStatus;
  totalAmount: number;
  items: OrderItem[];
  createdAt: string;
}

/* -----------------------------
   Create Order Response
------------------------------ */
export interface CreateOrderResponse {
  success: true;
  orderId: ObjectId;
  totalAmount: number;
}

/* -----------------------------
   Get Order Response
------------------------------ */
export interface GetOrderResponse {
  success: true;
  data: Order;
}

/* -----------------------------
   Standard API Error
------------------------------ */
export interface ApiErrorResponse {
  success: false;
  message: string;
  code?: string;
}
