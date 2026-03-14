/**
 * Shared TypeScript types for portfolio data.
 * Used by Firestore documents, admin forms, and public pages.
 */

export interface Project {
  id: string;
  title: string;
  description: string;
  url?: string;
  tags?: string[];
  order?: number;
  createdAt?: string; // ISO string after serialization from Firestore Timestamp
  imageUrl?: string;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
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
