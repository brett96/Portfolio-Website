"use client";

/**
 * Auth context: provides Firebase user state and signIn/signOut.
 * On successful login, gets the ID token and calls the Server Action
 * createSessionCookie() so middleware and admin layout can use the session.
 */

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import { signIn as firebaseSignIn, signOut as firebaseSignOut } from "@/lib/firebase/auth";
import { createSessionCookie, clearSessionCookie } from "@/app/actions/auth";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u ?? null);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signIn = useCallback(
    async (
      email: string,
      password: string
    ): Promise<{ success: boolean; error?: string }> => {
      if (!auth) {
        return { success: false, error: "Firebase not configured." };
      }
      try {
        const credential = await firebaseSignIn(email, password);
        const idToken = await credential.user.getIdToken();
        const result = await createSessionCookie(idToken);
        if (!result.success) {
          await firebaseSignOut();
          return { success: false, error: result.error };
        }
        return { success: true };
      } catch (e) {
        const message =
          e instanceof Error ? e.message : "Invalid email or password";
        return { success: false, error: message };
      }
    },
    []
  );

  const signOut = useCallback(async () => {
    setLoading(true);
    try {
      await clearSessionCookie();
      if (auth) await firebaseSignOut();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
