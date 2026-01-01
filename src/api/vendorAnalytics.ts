import { vendorFetch } from "@/lib/vendorApi";

/* ============================================================
   TYPES
============================================================ */

export type AnalyticsSummary = {
  totalOrders: number;
  totalRevenue: number;
  menuCount: number;
};

export type OrdersPerDay = {
  date: string;
  orders: number;
};

export type StatusWise = {
  status: string;
  count: number;
};

/* ============================================================
   API FUNCTIONS (PURE, NO SIDE EFFECTS)
============================================================ */

export function getSummary(range: 7 | 30) {
  return vendorFetch<AnalyticsSummary>(
    `/api/vendor/analytics/summary?range=${range}`
  );
}

export function getOrdersPerDay(range: 7 | 30) {
  return vendorFetch<OrdersPerDay[]>(
    `/api/vendor/analytics/orders-per-day?range=${range}`
  );
}

export function getStatusWise() {
  return vendorFetch<StatusWise[]>(
    `/api/vendor/analytics/status-wise`
  );
}
