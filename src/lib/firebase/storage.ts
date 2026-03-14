/**
 * Firebase Storage client helper for uploading project images.
 * Uploads a file to Storage, returns the public download URL to store in
 * Firestore as project.imageUrl.
 */

import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./config";

/**
 * Upload a file to Firebase Storage under the projects/ path and return
 * its download URL. Use this URL as project.imageUrl in Firestore.
 *
 * @param file - The file to upload (e.g. from an input[type="file"]).
 * @param pathSegment - Optional path segment (e.g. doc id or timestamp) to avoid overwrites.
 */
export async function uploadProjectImage(
  file: File,
  pathSegment?: string
): Promise<string> {
  if (!storage) throw new Error("Firebase Storage not configured");
  const segment = pathSegment ?? `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
  const storageRef = ref(storage, `projects/${segment}`);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}

/** Upload resume file to Storage (resume/ path). Overwrites existing. Returns download URL. */
export async function uploadResume(file: File): Promise<string> {
  if (!storage) throw new Error("Firebase Storage not configured");
  const ext = file.name.replace(/^.*\./, "") || "pdf";
  const storageRef = ref(storage, `resume/resume.${ext}`);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}
