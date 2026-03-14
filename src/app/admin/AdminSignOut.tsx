"use client";

/**
 * Sign-out button for the admin sidebar. Clears session cookie and Firebase auth,
 * then redirects to /login.
 */

import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

export function AdminSignOut() {
  const router = useRouter();
  const { signOut } = useAuth();

  async function handleSignOut() {
    await signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <Button
      variant="outline"
      size="sm"
      className="w-full justify-start"
      onClick={handleSignOut}
    >
      Sign out
    </Button>
  );
}
