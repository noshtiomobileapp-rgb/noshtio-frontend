import axios, { AxiosRequestConfig } from "axios";

/**
 * Base API URL
 * Must be exposed to the browser in Next.js
 * Example: http://localhost:4000/api
 */
const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!baseURL) {
  throw new Error(
    "NEXT_PUBLIC_API_BASE_URL is not defined. " +
      "Create a .env.local file and set NEXT_PUBLIC_API_BASE_URL."
  );
}

/* ============================================================
   Typed HTTP Helper (Authoritative)
   ============================================================ */

/**
 * Typed HTTP request wrapper
 * - Forces baseURL on every request
 * - Always returns response.data
 *
 * Usage:
 *   const res = await http<{ data: Order[] }>({
 *     method: "GET",
 *     url: "/vendor/orders"
 *   });
 */
export async function http<T>(
  config: AxiosRequestConfig
): Promise<T> {
  const response = await axios({
    baseURL,
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
    },
    ...config,
  });

  return response.data as T;
}
