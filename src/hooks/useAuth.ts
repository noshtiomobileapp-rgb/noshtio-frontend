import { useEffect, useState } from "react";
import { apiGet } from "@/lib/apiClient";

export type AuthUser = {
  id: string;
  role: string;
};

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    apiGet<{ user: AuthUser }>(
      "/api/auth/current"
    )
      .then((data) => {
        if (!cancelled) {
          setUser(data.user);
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
