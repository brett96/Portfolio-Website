/**
 * HTML email templates for contact form notifications.
 * Styled for Brett Tomita portfolio; domain_url and recipient_email are filled per-email.
 */

const BASE_STYLES = `
body, table, td, p, a { margin: 0; padding: 0; border: 0; font-size: 100%; font: inherit; vertical-align: baseline; }
body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333333; background-color: #f4f4f4; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
.email-wrapper { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
.email-header { background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); padding: 40px 20px; text-align: center; }
.email-header h1 { color: #ffffff; font-size: 28px; font-weight: 700; margin: 0; letter-spacing: -0.5px; }
.email-content { padding: 40px 30px; }
.email-content h2 { color: #1a1a1a; font-size: 24px; font-weight: 600; margin: 0 0 20px 0; line-height: 1.3; }
.email-content p { color: #555555; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0; }
.email-content a { color: #2563eb; text-decoration: none; }
.email-content a:hover { text-decoration: underline; }
.email-footer { background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e9ecef; }
.email-footer p { color: #6c757d; font-size: 14px; margin: 0 0 10px 0; }
.email-footer a { color: #2563eb; text-decoration: none; }
.divider { height: 1px; background-color: #e9ecef; margin: 30px 0; }
@media only screen and (max-width: 600px) { .email-content { padding: 30px 20px; } .email-header { padding: 30px 20px; } .email-header h1 { font-size: 24px; } .email-content h2 { font-size: 20px; } }
`;

function wrapTemplate(content: string, subject: string, domainUrl: string, recipientEmail: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(subject)}</title>
  <style>${BASE_STYLES}</style>
</head>
<body>
  <div class="email-wrapper">
    <div class="email-header">
      <h1>Brett Tomita</h1>
    </div>
    <div class="email-content">
      ${content}
    </div>
    <div class="email-footer">
      <p><strong>Brett Tomita</strong></p>
      <p>Over 10 years of experience building clean, maintainable enterprise software</p>
      <div class="divider"></div>
      <p>
        <a href="${domainUrl}/projects">Projects</a> | 
        <a href="${domainUrl}/experience">Experience</a> | 
        <a href="${domainUrl}/education">Education</a> | 
        Contact Me
      </p>
      <p style="font-size: 12px; color: #999999; margin-top: 15px;">
        This email was sent to ${escapeHtml(recipientEmail)}. If you didn't request this email, you can safely ignore it.
      </p>
    </div>
  </div>
</body>
</html>`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** New contact submission (to bretttomita@gmail.com). Includes IP and geo. */
export function newContactToOwnerHtml(params: {
  fromName: string;
  replyTo: string;
  subject: string;
  message: string;
  domainUrl: string;
  ip?: string;
  geo?: string;
}): string {
  const { fromName, replyTo, subject, message, domainUrl, ip, geo } = params;
  const content = `
    <h2>New contact form submission</h2>
    <p><strong>From:</strong> ${escapeHtml(fromName)}</p>
    <p><strong>Reply-to:</strong> ${escapeHtml(replyTo)}</p>
    <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
    <div class="divider"></div>
    <p><strong>Message:</strong></p>
    <p style="white-space: pre-wrap;">${escapeHtml(message)}</p>
    ${ip || geo ? `
    <div class="divider"></div>
    <p><strong>Sender information</strong></p>
    ${ip ? `<p><strong>IP:</strong> ${escapeHtml(ip)}</p>` : ""}
    ${geo ? `<p><strong>Approximate location:</strong> ${escapeHtml(geo)}</p>` : ""}
    ` : ""}
  `;
  return wrapTemplate(content, `Contact: ${subject}`, domainUrl, "bretttomita@gmail.com");
}

/** Confirmation to the visitor (reply-to address). */
export function contactConfirmationToVisitorHtml(params: {
  fromName: string;
  domainUrl: string;
  recipientEmail: string;
}): string {
  const { fromName, domainUrl, recipientEmail } = params;
  const content = `
    <h2>Thank you for reaching out</h2>
    <p>Hi ${escapeHtml(fromName)},</p>
    <p>I've received your message and will respond as soon as possible.</p>
    <p>If your matter is urgent, you can also email me directly at <a href="mailto:bretttomita@gmail.com">bretttomita@gmail.com</a>.</p>
    <p>Best,<br><strong>Brett Tomita</strong></p>
  `;
  return wrapTemplate(content, "Message received", domainUrl, recipientEmail);
}
