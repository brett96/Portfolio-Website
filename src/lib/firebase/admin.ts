/**
 * Firebase Admin SDK – server-side only.
 * Use only in Server Components, Server Actions, or API routes.
 * Do not import in client components or middleware (Edge runtime).
 *
 * - Vercel: private key from env is stringified; restore newlines with .replace(/\\n/g, '\n').
 * - Firestore Timestamp serialization: convert Timestamp fields to ISO strings before returning
 *   so that data passed from Server Components to Client Components does not cause
 *   Next.js serialization errors.
 */

import * as admin from "firebase-admin";
import type { Project, Experience, Education, About, HeroContent, Resume } from "@/types";
import { slugify } from "@/lib/slug";

/** Returns null when env vars are missing (e.g. during build). Avoids build failure. */
function getAdminApp(): admin.app.App | null {
  if (admin.apps.length > 0) {
    return admin.app() as admin.app.App;
  }
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n");
  const projectId =
    process.env.FIREBASE_ADMIN_PROJECT_ID ?? process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  if (!projectId || !clientEmail || !privateKey) {
    return null;
  }
  return admin.initializeApp({
    credential: admin.credential.cert({
      projectId,
      clientEmail,
      privateKey,
    }),
  });
}

/** Use for auth (session cookie, verify). Throws if Firebase Admin is not configured. */
export function getAdminAuth(): admin.auth.Auth {
  const app = getAdminApp();
  if (!app) {
    throw new Error(
      "Missing Firebase Admin env: FIREBASE_ADMIN_PROJECT_ID, FIREBASE_ADMIN_CLIENT_EMAIL, FIREBASE_ADMIN_PRIVATE_KEY"
    );
  }
  return admin.auth(app);
}

/** Use for Firestore reads. Returns null when not configured (e.g. build); callers return []. */
function getAdminDb(): admin.firestore.Firestore | null {
  const app = getAdminApp();
  return app ? admin.firestore(app) : null;
}

/**
 * Recursively convert Firestore Timestamp fields to ISO strings so that
 * data is serializable when passed from Server Components to Client Components.
 */
function serializeTimestamps<T>(obj: T): T {
  if (obj === null || obj === undefined) {
    return obj;
  }
  // Firestore Timestamp has toDate() method
  if (
    typeof obj === "object" &&
    "toDate" in obj &&
    typeof (obj as { toDate: () => Date }).toDate === "function"
  ) {
    return (obj as unknown as { toDate(): Date }).toDate().toISOString() as T;
  }
  if (Array.isArray(obj)) {
    return obj.map((item) => serializeTimestamps(item)) as T;
  }
  if (typeof obj === "object" && obj.constructor === Object) {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(obj)) {
      out[k] = serializeTimestamps(v);
    }
    return out as T;
  }
  return obj;
}

const PROJECTS = "projects";
const EXPERIENCE = "experience";
const EDUCATION = "education";
const ABOUT_COLLECTION = "about";
const ABOUT_DOC_ID = "main";
const HERO_COLLECTION = "hero";
const HERO_DOC_ID = "main";
const RESUME_COLLECTION = "resume";
const RESUME_DOC_ID = "main";

/**
 * Fetch all projects from Firestore (server-side). Returns data with Timestamps
 * converted to ISO strings for safe serialization to client.
 */
export async function getProjects(): Promise<Project[]> {
  const db = getAdminDb();
  if (!db) return [];
  try {
    const snapshot = await db.collection(PROJECTS).orderBy("order", "asc").get();
    return snapshot.docs.map((doc) => {
      const data = doc.data();
      const serialized = serializeTimestamps({ id: doc.id, ...data });
      return serialized as Project;
    });
  } catch {
    // Firestore API disabled or permission denied: enable at
    // https://console.cloud.google.com/apis/library/firestore.googleapis.com
    return [];
  }
}

/** Find a project by slug (from title). Returns null if not found. */
export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const projects = await getProjects();
  const normalized = slug.toLowerCase();
  return projects.find((p) => slugify(p.title) === normalized) ?? null;
}

/**
 * Fetch all experience entries from Firestore (server-side). Returns data with
 * Timestamps converted to ISO strings for safe serialization to client.
 */
export async function getExperience(): Promise<Experience[]> {
  const db = getAdminDb();
  if (!db) return [];
  try {
    const snapshot = await db.collection(EXPERIENCE).orderBy("order", "asc").get();
    return snapshot.docs.map((doc) => {
      const data = doc.data();
      const serialized = serializeTimestamps({ id: doc.id, ...data });
      return serialized as Experience;
    });
  } catch {
    return [];
  }
}

/** Find an experience entry by company slug. Returns null if not found. */
export async function getExperienceBySlug(slug: string): Promise<Experience | null> {
  const experience = await getExperience();
  const normalized = slug.toLowerCase();
  return experience.find((e) => slugify(e.company) === normalized) ?? null;
}

/**
 * Fetch all education entries from Firestore (server-side). Returns data with
 * Timestamps converted to ISO strings for safe serialization to client.
 */
export async function getEducation(): Promise<Education[]> {
  const db = getAdminDb();
  if (!db) return [];
  try {
    const snapshot = await db.collection(EDUCATION).orderBy("order", "asc").get();
    return snapshot.docs.map((doc) => {
      const data = doc.data();
      const serialized = serializeTimestamps({ id: doc.id, ...data });
      return serialized as Education;
    });
  } catch {
    return [];
  }
}

/** Find an education entry by institution slug. Returns null if not found. */
export async function getEducationBySlug(slug: string): Promise<Education | null> {
  const education = await getEducation();
  const normalized = slug.toLowerCase();
  return education.find((e) => slugify(e.institution) === normalized) ?? null;
}

/**
 * Fetch the About section content (server-side). Single document at about/main.
 */
export async function getAbout(): Promise<About | null> {
  const db = getAdminDb();
  if (!db) return null;
  try {
    const snap = await db.collection(ABOUT_COLLECTION).doc(ABOUT_DOC_ID).get();
    if (!snap.exists) return null;
    const data = snap.data();
    return data ? (serializeTimestamps(data) as About) : null;
  } catch {
    return null;
  }
}

/**
 * Fetch the site hero/header content (server-side). Single document at hero/main.
 */
export async function getHero(): Promise<HeroContent | null> {
  const db = getAdminDb();
  if (!db) return null;
  try {
    const snap = await db.collection(HERO_COLLECTION).doc(HERO_DOC_ID).get();
    if (!snap.exists) return null;
    const data = snap.data();
    return data ? (serializeTimestamps(data) as HeroContent) : null;
  } catch {
    return null;
  }
}

/**
 * Fetch resume download URL (server-side). Single document at resume/main.
 */
export async function getResume(): Promise<Resume | null> {
  const db = getAdminDb();
  if (!db) return null;
  try {
    const snap = await db.collection(RESUME_COLLECTION).doc(RESUME_DOC_ID).get();
    if (!snap.exists) return null;
    const data = snap.data();
    return data ? (serializeTimestamps(data) as Resume) : null;
  } catch {
    return null;
  }
}

/** UTC yyyy-mm-dd document ids under `edcAnalyticsDaily`. */
const EDC_ANALYTICS_DAILY = "edcAnalyticsDaily";

export type EdcDailyAnalyticsRow = {
  date: string;
  pageViews: number;
};

function utcDayKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function lastNDaysUtcKeys(n: number): string[] {
  const keys: string[] = [];
  const base = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(
      Date.UTC(base.getUTCFullYear(), base.getUTCMonth(), base.getUTCDate() - i)
    );
    keys.push(utcDayKey(d));
  }
  return keys;
}

/**
 * Increment EDC daily page-view counter (Firestore). Writes only from the
 * ingest API route (Bearer EDC_ANALYTICS_INGEST_SECRET).
 */
export async function recordEdcPageView(): Promise<boolean> {
  const db = getAdminDb();
  if (!db) return false;
  const dayKey = utcDayKey(new Date());
  const ref = db.collection(EDC_ANALYTICS_DAILY).doc(dayKey);
  try {
    await ref.set(
      {
        pageViews: admin.firestore.FieldValue.increment(1),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
    return true;
  } catch {
    return false;
  }
}

/** Last `dayCount` UTC days (oldest → newest) for charts. */
export async function getEdcAnalyticsDaily(
  dayCount: number
): Promise<EdcDailyAnalyticsRow[]> {
  const db = getAdminDb();
  const keys = lastNDaysUtcKeys(dayCount);
  if (!db) {
    return keys.map((date) => ({ date, pageViews: 0 }));
  }
  try {
    const refs = keys.map((k) => db.collection(EDC_ANALYTICS_DAILY).doc(k));
    const snaps = await db.getAll(...refs);
    return keys.map((date, i) => {
      const data = snaps[i].exists ? snaps[i].data() : undefined;
      return {
        date,
        pageViews: typeof data?.pageViews === "number" ? data.pageViews : 0,
      };
    });
  } catch {
    return keys.map((date) => ({ date, pageViews: 0 }));
  }
}
