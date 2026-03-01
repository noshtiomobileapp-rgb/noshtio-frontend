import { useEffect, useState } from "react";
import { apiGet } from "@/lib/apiClient";

export type AuthUser = {
  id: string;
  role: string;
};

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    apiGet("/api/auth/current")
      .then((data: any) => {
        if (!cancelled) {
          setUser(data?.user ?? null);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setUser(null);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { user, loading };
}