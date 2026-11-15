import { useCallback, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { adminApi } from "../lib/api";
import type { AdminUser } from "../lib/types";
import { AuthContext } from "./auth";

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Ask Laravel whether the browser already has a valid administrator session.
  useEffect(() => {
    let cancelled = false;
    adminApi
      .me()
      .then((u) => !cancelled && setUser(u))
      .catch(() => !cancelled && setUser(null))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setUser(await adminApi.login(email, password));
  }, []);

  const logout = useCallback(async () => {
    try {
      await adminApi.logout();
    } finally {
      setUser(null);
    }
  }, []);

  const value = useMemo(() => ({ user, loading, login, logout }), [user, loading, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
