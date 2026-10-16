import nodemailer from "nodemailer";

export interface EnquiryEmailData {
  name: string;
  email?: string;
  phone?: string;
  journey?: string | null;
  travelDate?: string | null;
  groupSize?: string | null;
  hearAboutUs?: string | null;
  message?: string | null;
}

/**
 * Creates and returns a configured Nodemailer transporter.
 * Returns null if SMTP host/user is missing or not configured.
 */
function getMailTransporter() {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || "465", 10);
  const secure = process.env.SMTP_SECURE === "true" || port === 465;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || user === "smtp_username_placeholder") {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
  });
}

function getFromAddress(): string {
  if (process.env.SMTP_FROM) {
    return process.env.SMTP_FROM;
  }
  if (process.env.SMTP_FROM_EMAIL) {
    const name = process.env.SMTP_FROM_NAME || "Kokalachi";
    return `"${name}" <${process.env.SMTP_FROM_EMAIL}>`;
  }
  if (process.env.SMTP_USER) {
    const name = process.env.SMTP_FROM_NAME || "Kokalachi";
    return `"${name}" <${process.env.SMTP_USER}>`;
  }
  return '"Kokalachi" <hello@kokalachi.com>';
}

/**
 * Send an email notification when a new traveller enquiry is received.
 */
export async function sendEnquiryNotificationEmail(data: EnquiryEmailData) {
  try {
    const transporter = getMailTransporter();
    const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || "hello@kokalachi.com";
    const fromAddress = getFromAddress();

    if (!transporter) {
      console.log(
        "📧 [SMTP Notice] SMTP is not configured or using placeholders. Skipping email dispatch for Enquiry:",
        data.name,
      );
      return { sent: false, reason: "SMTP not configured" };
    }

    const cleanPhone = (data.phone || "").replace(/\s+/g, "");
    const initials = data.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Travel Enquiry</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F8FAFC; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1E293B;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #F8FAFC; padding: 30px 10px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #FFFFFF; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06); border: 1px solid #E2E8F0;">
          
          <!-- Header Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #0B2A3D 0%, #0E5A60 100%); padding: 32px 30px; text-align: center; border-top: 4px solid #D96C2C;">
              <p style="margin: 0 0 6px 0; color: #CBD5E1; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px;">
                Kokalachi • Curated Group Journeys
              </p>
              <h1 style="margin: 0; color: #FFFFFF; font-size: 24px; font-weight: 800; letter-spacing: 0.5px;">
                KOKALACHI
              </h1>
              <div style="margin-top: 16px; display: inline-block; background-color: rgba(217, 108, 44, 0.2); border: 1px solid rgba(217, 108, 44, 0.4); color: #FF9B60; font-size: 11px; font-weight: 800; padding: 6px 14px; border-radius: 30px; text-transform: uppercase; letter-spacing: 1.5px;">
                ✈️ New Journey Enquiry
              </div>
            </td>
          </tr>

          <!-- Main Body Content -->
          <tr>
            <td style="padding: 32px 30px;">
              
              <!-- Traveller Profile Card -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 16px; padding: 20px; margin-bottom: 24px;">
                <tr>
                  <td width="52" valign="middle" style="padding-right: 14px;">
                    <div style="width: 50px; height: 50px; border-radius: 14px; background: linear-gradient(135deg, #0E5A60 0%, #D96C2C 100%); color: #FFFFFF; font-size: 18px; font-weight: 800; line-height: 50px; text-align: center;">
                      ${initials || "TR"}
                    </div>
                  </td>
                  <td valign="middle">
                    <h2 style="margin: 0; font-size: 18px; font-weight: 800; color: #0F172A;">
                      ${data.name}
                    </h2>
                    <p style="margin: 3px 0 0 0; font-size: 12px; color: #64748B;">
                      Submitted via Website Contact Form
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Journey Details Card -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom: 24px; border-collapse: separate; border-spacing: 0;">
                <tr>
                  <td style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 14px 18px; font-size: 13px;">
                    <div style="color: #64748B; font-size: 11px; text-transform: uppercase; font-weight: 700; margin-bottom: 4px;">Interested Journey</div>
                    <div style="color: #0E5A60; font-weight: 700; font-size: 15px;">${data.journey || "General Enquiry"}</div>
                  </td>
                </tr>
                <tr><td height="10"></td></tr>
                <tr>
                  <td style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 14px 18px; font-size: 13px;">
                    <div style="color: #64748B; font-size: 11px; text-transform: uppercase; font-weight: 700; margin-bottom: 4px;">Group Size & Preferred Date</div>
                    <div style="color: #0F172A; font-weight: 600;">Group Size: ${data.groupSize || "1 traveller"} • Travel Date: ${data.travelDate || "Flexible"}</div>
                  </td>
                </tr>
                <tr><td height="10"></td></tr>
                <tr>
                  <td style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 14px 18px; font-size: 13px;">
                    <div style="color: #64748B; font-size: 11px; text-transform: uppercase; font-weight: 700; margin-bottom: 4px;">Discovery Source</div>
                    <div style="color: #0F172A; font-weight: 600;">${data.hearAboutUs || "Not specified"}</div>
                  </td>
                </tr>
              </table>

              <!-- Message Body -->
              ${
                data.message
                  ? `
              <div style="margin-bottom: 28px;">
                <h3 style="margin: 0 0 10px 0; font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #475569;">
                  Traveller Message
                </h3>
                <div style="background-color: #F8FAFC; border-left: 4px solid #0E5A60; padding: 16px 20px; border-radius: 0 12px 12px 0; color: #334155; font-size: 14px; line-height: 1.6;">
                  ${data.message.replace(/\n/g, "<br/>")}
                </div>
              </div>`
                  : ""
              }

              <!-- Direct Action Buttons -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top: 24px;">
                <tr>
                  ${
                    cleanPhone
                      ? `<td width="48%" align="center">
                    <a href="tel:${cleanPhone}" style="display: block; background: #0E5A60; color: #FFFFFF; font-weight: 700; font-size: 14px; text-decoration: none; padding: 14px 0; border-radius: 12px; text-align: center;">
                      📞 Call Traveller
                    </a>
                  </td>
                  <td width="4%"></td>`
                      : ""
                  }
                  <td width="${cleanPhone ? "48%" : "100%"}" align="center">
                    <a href="mailto:${data.email || ""}?subject=Re: Your Kokalachi Enquiry - ${encodeURIComponent(data.journey || "Curated Journeys")}" style="display: block; background: #D96C2C; color: #FFFFFF; font-weight: 700; font-size: 14px; text-decoration: none; padding: 14px 0; border-radius: 12px; text-align: center;">
                      ✉️ Reply by Email
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #F8FAFC; border-top: 1px solid #E2E8F0; padding: 20px 30px; text-align: center; font-size: 12px; color: #64748B;">
              Kokalachi Travel Admin Notifications • <a href="https://kokalachi.com" style="color: #0E5A60; text-decoration: none; font-weight: 600;">kokalachi.com</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    const info = await transporter.sendMail({
      from: fromAddress,
      to: adminEmail,
      replyTo: data.email || undefined,
      subject: `✈️ [New Enquiry] ${data.name} — ${data.journey || "Curated Group Trip"}`,
      html: htmlContent,
    });

    console.log("✓ Travel enquiry notification email sent:", info.messageId);
    return { sent: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error in sendEnquiryNotificationEmail:", error);
    return { sent: false, error };
  }
}
