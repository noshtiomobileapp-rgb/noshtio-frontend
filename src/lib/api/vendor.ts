import { apiGet, apiPost } from '../apiClient';

export async function getVendor(id: string) {
  return apiGet(`/vendors/${id}`);
}

export async function listVendors(q?:string) {
  const qs = q ? `?q=${encodeURIComponent(q)}` : '';
  return apiGet(`/vendors${qs}`);
}

export async function createVendor(payload: any) {
  return apiPost('/vendors', payload);
}
