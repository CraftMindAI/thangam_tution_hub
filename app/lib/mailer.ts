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

/**
 * Email a student the link that lets them set their password.
 *
 * Sent through our own Gmail transport rather than Supabase Auth: the built-in
 * Supabase mailer is capped at a couple of messages an hour, which fails as
 * soon as an admin adds a handful of students or imports a spreadsheet.
 *
 * Returns false when mail is not configured or delivery failed — the caller
 * keeps the account either way and reports it.
 */
export async function sendPasswordSetupEmail(
  to: string,
  name: string,
  link: string
): Promise<boolean> {
  const transport = getMailTransport();
  if (!transport || !to) return false;

  const text = [
    `Hi ${name},`,
    "",
    "An account has been created for you at Thangam Varahi Tuition Hub.",
    "Use the link below to set your password and sign in:",
    "",
    link,
    "",
    "If you weren't expecting this, you can ignore this email.",
  ].join("\n");

  const html = `<div style="font-family:system-ui,sans-serif;font-size:14px;line-height:1.6">
      <p style="margin:0 0 12px">Hi ${name},</p>
      <p style="margin:0 0 12px">An account has been created for you at <strong>Thangam Varahi Tuition Hub</strong>.</p>
      <p style="margin:16px 0"><a href="${link}" style="background:#eab308;color:#111827;padding:10px 18px;border-radius:999px;text-decoration:none;font-weight:600">Set your password</a></p>
      <p style="margin:12px 0 0;color:#78716c;font-size:12px">If the button doesn't work, copy this link into your browser:<br>${link}</p>
    </div>`;

  try {
    await transport.sendMail({
      from: MAIL_FROM,
      to,
      subject: "Set your password — Thangam Varahi Tuition Hub",
      text,
      html,
    });
    return true;
  } catch (err) {
    console.error(`Failed to send password setup email to ${to}`, err);
    return false;
  }
}
