/**
 * Firebase Auth helpers (client SDK only).
 * Used by the login page and AuthContext. After sign-in, the client should
 * call the Server Action that exchanges the ID token for a long-lived session
 * cookie via admin.auth().createSessionCookie().
 */

import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  type UserCredential,
} from "firebase/auth";
import { auth } from "./config";

/**
 * Sign in with email and password. Returns the credential; the caller must
 * then get the ID token (user.getIdToken()) and pass it to the session-cookie
 * Server Action. Throws if auth is not configured.
 */
export async function signIn(email: string, password: string): Promise<UserCredential> {
  if (!auth) throw new Error("Firebase Auth not configured");
  return signInWithEmailAndPassword(auth, email, password);
}

/**
 * Sign out from Firebase Auth and clear client state.
 * The session cookie should be cleared by the Server Action or API route.
 */
export async function signOut(): Promise<void> {
  if (auth) return firebaseSignOut(auth);
}
