/**
 * One-time script to set custom claim admin: true on a Firebase Auth user.
 * Firestore rules allow write only when request.auth.token.admin == true.
 *
 * Usage (from project root):
 *   node scripts/set-admin-claim.js <user-email>
 *
 * Requires Firebase Admin credentials:
 *   - Either set env: FIREBASE_ADMIN_PROJECT_ID, FIREBASE_ADMIN_CLIENT_EMAIL, FIREBASE_ADMIN_PRIVATE_KEY
 *   - Or have a service account JSON at path in GOOGLE_APPLICATION_CREDENTIALS
 */

const admin = require("firebase-admin");

function loadEnvLocal() {
  try {
    const fs = require("fs");
    const path = require("path");
    const envPath = path.join(process.cwd(), ".env.local");
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, "utf8");
      content.split("\n").forEach((line) => {
        const m = line.match(/^([^#=]+)=(.*)$/);
        if (m) {
          const key = m[1].trim();
          let val = m[2].trim();
          if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'")))
            val = val.slice(1, -1);
          if (!(key in process.env)) process.env[key] = val;
        }
      });
    }
  } catch (_) {}
}

loadEnvLocal();

const email = process.argv[2];
if (!email) {
  console.error("Usage: node scripts/set-admin-claim.js <user-email>");
  process.exit(1);
}

function getApp() {
  if (admin.apps.length > 0) return admin.app();
  const key = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n");
  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  if (projectId && clientEmail && key) {
    return admin.initializeApp({
      credential: admin.credential.cert({ projectId, clientEmail, privateKey: key }),
    });
  }
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    return admin.initializeApp({ credential: admin.credential.applicationDefault() });
  }
  return null;
}

const app = getApp();
if (!app) {
  console.error("Firebase Admin not configured. Set FIREBASE_ADMIN_* env vars or GOOGLE_APPLICATION_CREDENTIALS.");
  process.exit(1);
}

async function main() {
  const user = await admin.auth().getUserByEmail(email);
  await admin.auth().setCustomUserClaims(user.uid, { admin: true });
  console.log("Set admin claim for:", user.email, "(uid:", user.uid + ")");
  console.log("User must sign out and sign in again for the new token to take effect.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
