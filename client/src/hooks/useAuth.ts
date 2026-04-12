import { useState, useEffect } from "react";
import { api } from "../api/client";
import type { User } from "../api/types";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<User>("/auth/me")
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const logout = async () => {
    await api.post("/auth/logout", {});
    setUser(null);
  };

  return { user, loading, setUser, logout };
}
