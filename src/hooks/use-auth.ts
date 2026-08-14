import { useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type AuthState = {
  session: Session | null;
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
};

/**
 * Single source of truth for the signed-in visitor.
 * Roles come from the `user_roles` table (never from client storage).
 */
export function useAuth(): AuthState {
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      if (!active) return;
      setSession(next);
      setLoading(false);
    });

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setSession(data.session);
      setLoading(false);
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const uid = session?.user.id;
    if (!uid) {
      setIsAdmin(false);
      return;
    }
    let active = true;
    supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", uid)
      .eq("role", "admin")
      .maybeSingle()
      .then(({ data }) => {
        if (active) setIsAdmin(!!data);
      });
    return () => {
      active = false;
    };
  }, [session?.user.id]);

  return { session, user: session?.user ?? null, isAdmin, loading };
}
