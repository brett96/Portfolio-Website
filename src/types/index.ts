/**
 * Shared TypeScript types for portfolio data.
 * Used by Firestore documents, admin forms, and public pages.
 */

export interface Project {
  id: string;
  title: string;
  /** Markdown (GFM): bold, lists, links, tables, etc. */
  description: string;
  url?: string;
  /** Multiple tags; in admin, separate with commas, semicolons, or new lines. */
  tags?: string[];
  order?: number;
  createdAt?: string; // ISO string after serialization from Firestore Timestamp
  imageUrl?: string;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  /** Markdown (GFM): bold, lists, links, tables, etc. */
  description: string;
  startDate: string; // ISO string
  endDate?: string;   // ISO string
  order?: number;
  createdAt?: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  honors?: string;
  startYear: number;
  endYear: number;
  order?: number;
  createdAt?: string;
}

/** Single editable About section (one document in Firestore). */
export interface About {
  title: string;
  content: string;
}

/** Main site hero/header (name, tagline, short description). */
export interface HeroContent {
  name: string;
  tagline: string;
  description: string;
}

/** Resume download URL (stored in Firestore; file in Storage). */
export interface Resume {
  url: string;
}
