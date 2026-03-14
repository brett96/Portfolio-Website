/**
 * Admin login page. Renders LoginForm (client). Force dynamic so Firebase
 * client is not initialized at build time when env vars are missing.
 */
export const dynamic = "force-dynamic";

import { LoginForm } from "./LoginForm";

export default function LoginPage() {
  return (
    <div className="container mx-auto flex min-h-[60vh] items-center justify-center px-6">
      <LoginForm />
    </div>
  );
}
