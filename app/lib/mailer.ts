import "server-only";
import nodemailer from "nodemailer";

/**
 * Gmail transport built from EMAIL_USER / EMAIL_PASSWORD (an app password).
 * Returns null when the credentials aren't configured.
 */
export function getMailTransport() {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASSWORD?.replace(/\s+/g, "");
  if (!user || !pass) return null;

  return nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });
}

export const MAIL_FROM = process.env.EMAIL_USER;
