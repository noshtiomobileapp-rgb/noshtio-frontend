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
   API FUNCTIONS
============================================================ */

export function getSummary(range: 7 | 30) {
  return vendorFetch<AnalyticsSummary>(
    `/api/analytics/summary?range=${range}`
  );
}

export function getOrdersPerDay(range: 7 | 30) {
  return vendorFetch<OrdersPerDay[]>(
    `/api/analytics/orders-per-day?range=${range}`
  );
}

export function getStatusWise() {
  return vendorFetch<StatusWise[]>(
    `/api/analytics/status-wise`
  );
}