/**
 * Firestore client-side CRUD helpers for the admin dashboard.
 * Used only in client components. Public portfolio reads use the Admin SDK
 * in src/lib/firebase/admin.ts (server-side).
 */

import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  setDoc,
  query,
  orderBy,
  type DocumentData,
} from "firebase/firestore";
import { db } from "./config";
import type { Project, Experience, Education, About, HeroContent, Resume } from "@/types";

const PROJECTS = "projects";
const EXPERIENCE = "experience";
const EDUCATION = "education";
const ABOUT_COLLECTION = "about";
const ABOUT_DOC_ID = "main";
const HERO_COLLECTION = "hero";
const HERO_DOC_ID = "main";
const RESUME_COLLECTION = "resume";
const RESUME_DOC_ID = "main";

/** Firestore does not accept undefined; strip undefined keys before write. */
function stripUndefined<T extends Record<string, unknown>>(obj: T): DocumentData {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined)
  ) as DocumentData;
}

/** Create a project. Returns the new document id. Throws if Firebase not configured. */
export async function createProject(data: Omit<Project, "id">): Promise<string> {
  if (!db) throw new Error("Firebase not configured");
  const ref = await addDoc(collection(db, PROJECTS), stripUndefined(data as Record<string, unknown>));
  return ref.id;
}

/** Update a project by id. */
export async function updateProject(id: string, data: Partial<Omit<Project, "id">>): Promise<void> {
  if (!db) throw new Error("Firebase not configured");
  await updateDoc(doc(db, PROJECTS, id), stripUndefined(data as Record<string, unknown>));
}

/** Delete a project by id. */
export async function deleteProject(id: string): Promise<void> {
  if (!db) throw new Error("Firebase not configured");
  await deleteDoc(doc(db, PROJECTS, id));
}

/** Fetch all projects (client-side, for admin list). */
export async function fetchProjectsClient(): Promise<Project[]> {
  if (!db) return [];
  const snapshot = await getDocs(
    query(collection(db, PROJECTS), orderBy("order", "asc"))
  );
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Project));
}

/** Create an experience entry. Returns the new document id. */
export async function createExperience(
  data: Omit<Experience, "id">
): Promise<string> {
  if (!db) throw new Error("Firebase not configured");
  const ref = await addDoc(collection(db, EXPERIENCE), stripUndefined(data as Record<string, unknown>));
  return ref.id;
}

/** Update an experience entry by id. */
export async function updateExperience(
  id: string,
  data: Partial<Omit<Experience, "id">>
): Promise<void> {
  if (!db) throw new Error("Firebase not configured");
  await updateDoc(doc(db, EXPERIENCE, id), stripUndefined(data as Record<string, unknown>));
}

/** Delete an experience entry by id. */
export async function deleteExperience(id: string): Promise<void> {
  if (!db) throw new Error("Firebase not configured");
  await deleteDoc(doc(db, EXPERIENCE, id));
}

/** Fetch all experience entries (client-side, for admin list). */
export async function fetchExperienceClient(): Promise<Experience[]> {
  if (!db) return [];
  const snapshot = await getDocs(
    query(collection(db, EXPERIENCE), orderBy("order", "asc"))
  );
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Experience));
}

/** Create an education entry. Returns the new document id. */
export async function createEducation(
  data: Omit<Education, "id">
): Promise<string> {
  if (!db) throw new Error("Firebase not configured");
  const ref = await addDoc(collection(db, EDUCATION), stripUndefined(data as Record<string, unknown>));
  return ref.id;
}

/** Update an education entry by id. */
export async function updateEducation(
  id: string,
  data: Partial<Omit<Education, "id">>
): Promise<void> {
  if (!db) throw new Error("Firebase not configured");
  await updateDoc(doc(db, EDUCATION, id), stripUndefined(data as Record<string, unknown>));
}

/** Delete an education entry by id. */
export async function deleteEducation(id: string): Promise<void> {
  if (!db) throw new Error("Firebase not configured");
  await deleteDoc(doc(db, EDUCATION, id));
}

/** Fetch all education entries (client-side, for admin list). */
export async function fetchEducationClient(): Promise<Education[]> {
  if (!db) return [];
  const snapshot = await getDocs(
    query(collection(db, EDUCATION), orderBy("order", "asc"))
  );
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Education));
}

/** Fetch About content (client-side, for admin). */
export async function fetchAboutClient(): Promise<About | null> {
  if (!db) return null;
  const snap = await getDoc(doc(db, ABOUT_COLLECTION, ABOUT_DOC_ID));
  if (!snap.exists()) return null;
  return snap.data() as About;
}

/** Set About content (create or overwrite). */
export async function setAbout(data: About): Promise<void> {
  if (!db) throw new Error("Firebase not configured");
  await setDoc(doc(db, ABOUT_COLLECTION, ABOUT_DOC_ID), stripUndefined(data as Record<string, unknown>));
}

/** Fetch Hero/site header content (client-side, for admin). */
export async function fetchHeroClient(): Promise<HeroContent | null> {
  if (!db) return null;
  const snap = await getDoc(doc(db, HERO_COLLECTION, HERO_DOC_ID));
  if (!snap.exists()) return null;
  return snap.data() as HeroContent;
}

/** Set Hero/site header content (create or overwrite). */
export async function setHero(data: HeroContent): Promise<void> {
  if (!db) throw new Error("Firebase not configured");
  await setDoc(doc(db, HERO_COLLECTION, HERO_DOC_ID), stripUndefined(data as Record<string, unknown>));
}

/** Fetch Resume URL (client-side, for admin). */
export async function fetchResumeClient(): Promise<Resume | null> {
  if (!db) return null;
  const snap = await getDoc(doc(db, RESUME_COLLECTION, RESUME_DOC_ID));
  if (!snap.exists()) return null;
  return snap.data() as Resume;
}

/** Set Resume URL (create or overwrite). Use empty string to clear. */
export async function setResume(data: Resume): Promise<void> {
  if (!db) throw new Error("Firebase not configured");
  await setDoc(doc(db, RESUME_COLLECTION, RESUME_DOC_ID), stripUndefined(data as Record<string, unknown>));
}
