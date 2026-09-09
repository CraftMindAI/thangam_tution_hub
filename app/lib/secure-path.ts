import "server-only";
import {
  createCipheriv,
  createDecipheriv,
  createHash,
  createHmac,
  randomBytes,
} from "node:crypto";

// A single secret drives both the URL encryption and the derived student
// number. Hashing to 32 bytes lets the env value be any length.
function key() {
  const secret = process.env.STUDENT_URL_SECRET;
  if (!secret) {
    throw new Error("STUDENT_URL_SECRET is not set");
  }
  return createHash("sha256").update(secret).digest();
}

const IV_LEN = 12;
const TAG_LEN = 16;

/** AES-256-GCM encrypt a string into one URL-safe (base64url) path segment. */
export function encryptSegment(plain: string): string {
  const iv = randomBytes(IV_LEN);
  const cipher = createCipheriv("aes-256-gcm", key(), iv);
  const enc = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, enc]).toString("base64url");
}

/** Reverse of {@link encryptSegment}; returns null for anything malformed. */
export function decryptSegment(token: string): string | null {
  try {
    const raw = Buffer.from(token, "base64url");
    if (raw.length < IV_LEN + TAG_LEN + 1) return null;
    const iv = raw.subarray(0, IV_LEN);
    const tag = raw.subarray(IV_LEN, IV_LEN + TAG_LEN);
    const enc = raw.subarray(IV_LEN + TAG_LEN);
    const decipher = createDecipheriv("aes-256-gcm", key(), iv);
    decipher.setAuthTag(tag);
    return Buffer.concat([decipher.update(enc), decipher.final()]).toString(
      "utf8"
    );
  } catch {
    return null;
  }
}

/** Deterministic, stable 12-digit number derived from the auth user id. */
export function userNumber(userId: string): string {
  const n = createHmac("sha256", key()).update(userId).digest().readUIntBE(0, 6);
  return String(n % 1_000_000_000_000).padStart(12, "0");
}

/** `/{root}/{enc(number)}/{enc(userId)}` — the encrypted base for a user. */
function buildBase(root: "student" | "admin", userId: string): string {
  return `/${root}/${encryptSegment(userNumber(userId))}/${encryptSegment(userId)}`;
}

/** The canonical dashboard URL for a student. */
export function buildStudentDashboardPath(userId: string): string {
  return `${buildBase("student", userId)}/dashboard`;
}

/**
 * An admin panel URL, e.g. buildAdminPath(id, "/students").
 * Defaults to the admin dashboard.
 */
export function buildAdminPath(userId: string, subpath = "/dashboard"): string {
  return `${buildBase("admin", userId)}${subpath}`;
}

/**
 * Decrypt the two path segments and confirm they belong together. Returns the
 * plain user id, or null if either segment is tampered with / mismatched.
 */
export function resolveSecurePath(
  sid: string,
  uid: string
): { userId: string } | null {
  const userId = decryptSegment(uid);
  if (!userId) return null;
  const number = decryptSegment(sid);
  if (!number || number !== userNumber(userId)) return null;
  return { userId };
}
