/**
 * Send emails via PrivateEmail SMTP (nodemailer).
 * Env: PRIVATEEMAIL_USER, PRIVATEEMAIL_PASSWORD, PRIVATEEMAIL_HOST, PRIVATEEMAIL_PORT,
 * PRIVATEEMAIL_USE_SSL, DEFAULT_FROM_EMAIL.
 */

import nodemailer from "nodemailer";
import {
  newContactToOwnerHtml,
  contactConfirmationToVisitorHtml,
} from "./templates";

const PORT = process.env.PRIVATEEMAIL_PORT ? parseInt(process.env.PRIVATEEMAIL_PORT, 10) : 465;
const USE_SSL = process.env.PRIVATEEMAIL_USE_SSL !== "false";

function getTransporter() {
  const user = process.env.PRIVATEEMAIL_USER;
  const pass = process.env.PRIVATEEMAIL_PASSWORD;
  const host = process.env.PRIVATEEMAIL_HOST || "mail.privateemail.com";
  if (!user || !pass) {
    throw new Error("PRIVATEEMAIL_USER and PRIVATEEMAIL_PASSWORD must be set");
  }
  return nodemailer.createTransport({
    host,
    port: PORT,
    secure: USE_SSL,
    auth: { user, pass },
  });
}

const DEFAULT_FROM = process.env.DEFAULT_FROM_EMAIL || process.env.PRIVATEEMAIL_USER || "brett@bretttomita.com";
const OWNER_EMAIL = "bretttomita@gmail.com";

/** Send new-contact notification to owner and confirmation to visitor. */
export async function sendContactEmails(params: {
  fromName: string;
  replyTo: string;
  subject: string;
  message: string;
  domainUrl: string;
  ip?: string;
  geo?: string;
}): Promise<void> {
  const transporter = getTransporter();
  const { fromName, replyTo, subject, message, domainUrl, ip, geo } = params;

  const toOwnerHtml = newContactToOwnerHtml({
    fromName,
    replyTo,
    subject,
    message,
    domainUrl,
    ip,
    geo,
  });

  const toVisitorHtml = contactConfirmationToVisitorHtml({
    fromName,
    domainUrl,
    recipientEmail: replyTo,
  });

  await transporter.sendMail({
    from: `"Brett Tomita" <${DEFAULT_FROM}>`,
    to: OWNER_EMAIL,
    replyTo,
    subject: `[Portfolio Contact] ${subject}`,
    html: toOwnerHtml,
  });

  await transporter.sendMail({
    from: `"Brett Tomita" <${DEFAULT_FROM}>`,
    to: replyTo,
    subject: "Message received – Brett Tomita",
    html: toVisitorHtml,
  });
}
