export interface VendorAnalytics {
  totalOrders: number;
  totalRevenue: number;
  ordersPerDay: Array<{
    date: string;
    orders: number;
  }>;
  topItems: Array<{
    name: string;
    qty: number;
    revenue: number;
  }>;
  statusBreakdown: Array<{
    status: string;
    count: number;
  }>;
}

export async function getVendorAnalytics(): Promise<VendorAnalytics> {
  const res = await fetch("/api/vendor/analytics");
  if (!res.ok) {
    throw new Error("Failed to fetch vendor analytics");
  }
  return res.json();
}
