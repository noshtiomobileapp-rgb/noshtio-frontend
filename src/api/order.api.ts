export type OrderStatus =
  | "NEW"
  | "PENDING"
  | "CONFIRMED"
  | "PREPARING"
  | "READY"
  | "COMPLETED"
  | "CANCELLED";

export interface VendorOrderItem {
  id: string;
  name: string;
  qty: number;          // 🔥 UI uses qty
  price?: number;
}

export interface VendorOrder {
  id: string;
  status: OrderStatus;
  items: VendorOrderItem[];

  instructions?: string;
  sessionId?: string;
  tableLabel?: string;

  createdAt?: string;
}

export async function getVendorOrderById(
  orderId: string
): Promise<VendorOrder | null> {
  return null;
}

export async function getCustomerOrder(orderId: string) {
  return { data: null };
}

export async function updateVendorOrderStatus(
  orderId: string,
  status: OrderStatus
): Promise<{ success: boolean }> {
  return { success: true };
}
