import nodemailer from "nodemailer";

export interface EnquiryEmailData {
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  product?: string;
  interestedIn?: string;
  budget?: string;
  message?: string;
}

export interface DistributorLeadEmailData {
  name: string;
  firmName: string;
  email: string;
  phone: string;
  city?: string;
  state?: string;
  existingBusiness?: string;
  annualTurnover?: string;
  experienceYears?: string;
  message?: string;
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
    const name = process.env.SMTP_FROM_NAME || "Mahalaxmi Enterprises";
    return `"${name}" <${process.env.SMTP_FROM_EMAIL}>`;
  }
  if (process.env.SMTP_USER) {
    const name = process.env.SMTP_FROM_NAME || "Mahalaxmi Enterprises";
    return `"${name}" <${process.env.SMTP_USER}>`;
  }
  return '"Mahalaxmi Enterprises" <jwel.inventory@tgtpartner.com>';
}

/**
 * Send an email notification when a new customer enquiry is received.
 */
export async function sendEnquiryNotificationEmail(data: EnquiryEmailData) {
  try {
    const transporter = getMailTransporter();
    const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || "sude8920esh@gmail.com";
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
  <title>New Customer Enquiry</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F1F5F9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1E293B;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #F1F5F9; padding: 30px 10px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" max-width="600" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #FFFFFF; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06); border: 1px solid #E2E8F0;">
          
          <!-- Header Banner with Brand Accent -->
          <tr>
            <td style="background: linear-gradient(135deg, #002B5C 0%, #001A38 100%); padding: 32px 30px; text-align: center; border-top: 4px solid #D8232A;">
              <p style="margin: 0 0 6px 0; color: #94A3B8; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px;">
                HPCL Authorized Industrial Lube Distributor
              </p>
              <h1 style="margin: 0; color: #FFFFFF; font-size: 24px; font-weight: 800; letter-spacing: 0.5px;">
                MAHALAXMI ENTERPRISES
              </h1>
              <div style="margin-top: 16px; display: inline-block; background-color: rgba(216, 35, 42, 0.2); border: 1px solid rgba(216, 35, 42, 0.4); color: #FF6B72; font-size: 11px; font-weight: 800; padding: 6px 14px; border-radius: 30px; text-transform: uppercase; letter-spacing: 1.5px;">
                🔔 New Customer Inquiry
              </div>
            </td>
          </tr>

          <!-- Main Body Content -->
          <tr>
            <td style="padding: 32px 30px;">
              
              <!-- Customer Profile Card -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 16px; padding: 20px; margin-bottom: 24px;">
                <tr>
                  <td width="52" valign="middle" style="padding-right: 14px;">
                    <div style="width: 50px; height: 50px; border-radius: 14px; background: linear-gradient(135deg, #002B5C 0%, #D8232A 100%); color: #FFFFFF; font-size: 18px; font-weight: 800; line-height: 50px; text-align: center;">
                      ${initials || "ME"}
                    </div>
                  </td>
                  <td valign="middle">
                    <h2 style="margin: 0; font-size: 18px; font-weight: 800; color: #0F172A;">
                      ${data.name}
                    </h2>
                    <p style="margin: 3px 0 0 0; font-size: 12px; color: #64748B;">
                      Submitted via Website Enquiry Form
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Quick Action Call/Email Buttons -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom: 28px;">
                <tr>
                  ${
                    cleanPhone
                      ? `<td width="48%" align="center">
                          <a href="tel:${cleanPhone}" style="display: block; background-color: #002B5C; color: #FFFFFF; text-decoration: none; padding: 12px 16px; border-radius: 12px; font-size: 13px; font-weight: 700; text-align: center;">
                            📞 Call Customer
                          </a>
                        </td>
                        <td width="4%"></td>`
                      : ""
                  }
                  ${
                    data.email && !data.email.includes("noemail@")
                      ? `<td width="${cleanPhone ? "48%" : "100%"}" align="center">
                          <a href="mailto:${data.email}" style="display: block; background-color: #D8232A; color: #FFFFFF; text-decoration: none; padding: 12px 16px; border-radius: 12px; font-size: 13px; font-weight: 700; text-align: center;">
                            ✉️ Reply via Email
                          </a>
                        </td>`
                      : ""
                  }
                </tr>
              </table>

              <!-- Detailed Inquiry Grid Table -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse: collapse; margin-bottom: 24px;">
                <tr>
                  <td colspan="2" style="padding-bottom: 12px; font-size: 12px; font-weight: 800; color: #002B5C; text-transform: uppercase; letter-spacing: 1px; border-bottom: 2px solid #002B5C;">
                    Inquiry Details
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; font-size: 13px; color: #64748B; font-weight: 600; width: 40%; border-bottom: 1px solid #F1F5F9;">
                    Customer Name:
                  </td>
                  <td style="padding: 12px 0; font-size: 14px; color: #0F172A; font-weight: 700; border-bottom: 1px solid #F1F5F9;">
                    ${data.name}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; font-size: 13px; color: #64748B; font-weight: 600; border-bottom: 1px solid #F1F5F9;">
                    Phone Number:
                  </td>
                  <td style="padding: 12px 0; font-size: 14px; font-weight: 700; border-bottom: 1px solid #F1F5F9;">
                    ${
                      cleanPhone
                        ? `<a href="tel:${cleanPhone}" style="color: #002B5C; text-decoration: none; font-weight: 800;">${data.phone}</a>`
                        : '<span style="color: #94A3B8;">Not Provided</span>'
                    }
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; font-size: 13px; color: #64748B; font-weight: 600; border-bottom: 1px solid #F1F5F9;">
                    Email Address:
                  </td>
                  <td style="padding: 12px 0; font-size: 14px; border-bottom: 1px solid #F1F5F9;">
                    ${
                      data.email && !data.email.includes("noemail@")
                        ? `<a href="mailto:${data.email}" style="color: #002B5C; text-decoration: underline; font-weight: 600;">${data.email}</a>`
                        : '<span style="color: #94A3B8;">Not Provided</span>'
                    }
                  </td>
                </tr>
                ${
                  data.company
                    ? `<tr>
                        <td style="padding: 12px 0; font-size: 13px; color: #64748B; font-weight: 600; border-bottom: 1px solid #F1F5F9;">
                          Company / Firm:
                        </td>
                        <td style="padding: 12px 0; font-size: 14px; color: #0F172A; font-weight: 700; border-bottom: 1px solid #F1F5F9;">
                          ${data.company}
                        </td>
                      </tr>`
                    : ""
                }
                <tr>
                  <td style="padding: 12px 0; font-size: 13px; color: #64748B; font-weight: 600; border-bottom: 1px solid #F1F5F9;">
                    Product / Requirement:
                  </td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #F1F5F9;">
                    <span style="display: inline-block; background-color: #FFF1F2; color: #D8232A; font-size: 13px; font-weight: 800; padding: 4px 10px; border-radius: 6px; border: 1px solid #FFE4E6;">
                      ${data.product || data.interestedIn || "General Lubricant Requirement"}
                    </span>
                  </td>
                </tr>
                ${
                  data.budget
                    ? `<tr>
                        <td style="padding: 12px 0; font-size: 13px; color: #64748B; font-weight: 600; border-bottom: 1px solid #F1F5F9;">
                          Estimated Budget:
                        </td>
                        <td style="padding: 12px 0; font-size: 14px; color: #0F172A; font-weight: 700; border-bottom: 1px solid #F1F5F9;">
                          ${data.budget}
                        </td>
                      </tr>`
                    : ""
                }
              </table>

              <!-- Customer Message / Notes Block -->
              ${
                data.message
                  ? `<div style="background-color: #F8FAFC; border-left: 4px solid #002B5C; padding: 18px 20px; border-radius: 0 12px 12px 0; margin-bottom: 24px;">
                      <p style="margin: 0 0 6px 0; font-size: 11px; font-weight: 800; text-transform: uppercase; color: #002B5C; letter-spacing: 1px;">
                        Customer Message / Special Note:
                      </p>
                      <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #334155;">
                        &ldquo;${data.message}&rdquo;
                      </p>
                    </div>`
                  : ""
              }

            </td>
          </tr>

          <!-- Corporate Footer -->
          <tr>
            <td style="background-color: #F8FAFC; padding: 24px 30px; border-top: 1px solid #E2E8F0; text-align: center;">
              <p style="margin: 0 0 4px 0; font-size: 12px; font-weight: 700; color: #475569;">
                Mahalaxmi Enterprises CMS &bull; Real-time Lead Dispatch
              </p>
              <p style="margin: 0; font-size: 11px; color: #94A3B8;">
                Baghpat Region & Surrounding Industrial Belts, Uttar Pradesh, India
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    // 1. Admin Alert
    await transporter.sendMail({
      from: fromAddress,
      to: adminEmail,
      subject: `🔔 New Enquiry: ${data.name} — ${data.product || data.interestedIn || "Product Quote"}`,
      html: htmlContent,
    });

    // 2. Customer Confirmation (if valid customer email provided)
    if (data.email && !data.email.includes("noemail@")) {
      const customerAckHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Thank You for Contacting Us</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F1F5F9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1E293B;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #F1F5F9; padding: 30px 10px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" max-width="600" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #FFFFFF; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06); border: 1px solid #E2E8F0;">
          
          <tr>
            <td style="background: linear-gradient(135deg, #002B5C 0%, #001A38 100%); padding: 32px 30px; text-align: center; border-top: 4px solid #D8232A;">
              <h1 style="margin: 0; color: #FFFFFF; font-size: 22px; font-weight: 800;">
                MAHALAXMI ENTERPRISES
              </h1>
              <p style="margin: 6px 0 0 0; color: #94A3B8; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px;">
                Authorized HPCL Industrial Lube Distributor
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding: 36px 30px; line-height: 1.6;">
              <h2 style="margin: 0 0 16px 0; font-size: 20px; font-weight: 800; color: #002B5C;">
                Thank You for Reaching Out, ${data.name}!
              </h2>
              <p style="margin: 0 0 16px 0; font-size: 14px; color: #475569;">
                We have successfully received your enquiry regarding <strong>${data.product || data.interestedIn || "our industrial lubricants"}</strong>.
              </p>
              <p style="margin: 0 0 24px 0; font-size: 14px; color: #475569;">
                Our technical sales engineering team is reviewing your requirements and will contact you promptly with product specifications and commercial pricing.
              </p>

              <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 18px; margin-bottom: 24px;">
                <p style="margin: 0 0 8px 0; font-size: 12px; font-weight: 800; text-transform: uppercase; color: #002B5C; letter-spacing: 0.5px;">
                  Our Product Divisions:
                </p>
                <p style="margin: 0; font-size: 13px; color: #64748B; line-height: 1.5;">
                  &bull; Industrial Lubricants (Hydraulic, Turbine, Gear Oils)<br>
                  &bull; Industrial & Wheel Bearing Greases<br>
                  &bull; Automotive & Fleet Engine Lubricants<br>
                  &bull; 4T Bike Engine Oils & Speciality Fluids
                </p>
              </div>

              <p style="margin: 0; font-size: 13px; color: #64748B;">
                Warm regards,<br>
                <strong style="color: #002B5C; font-size: 14px;">Mahalaxmi Enterprises Team</strong><br>
                Authorized HPCL Lubricants & Greases Distributor
              </p>
            </td>
          </tr>

          <tr>
            <td style="background-color: #F8FAFC; padding: 20px 30px; border-top: 1px solid #E2E8F0; text-align: center; font-size: 11px; color: #94A3B8;">
              &copy; 2026 Mahalaxmi Enterprises. All rights reserved.
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `;

      await transporter
        .sendMail({
          from: fromAddress,
          to: data.email,
          subject: `Thank you for contacting Mahalaxmi Enterprises (HPCL Distributor)`,
          html: customerAckHtml,
        })
        .catch((e) => console.error("Error sending customer acknowledgement email:", e));
    }

    return { sent: true };
  } catch (error) {
    console.error("Error in sendEnquiryNotificationEmail:", error);
    return { sent: false, error };
  }
}

/**
 * Send an email notification when a new Distribution Leaders / Dealership application is received.
 */
export async function sendDistributorLeadNotificationEmail(data: DistributorLeadEmailData) {
  try {
    const transporter = getMailTransporter();
    const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || "sude8920esh@gmail.com";
    const fromAddress = getFromAddress();

    if (!transporter) {
      console.log(
        "📧 [SMTP Notice] SMTP is not configured or using placeholders. Skipping email dispatch for Distributor Lead:",
        data.firmName,
      );
      return { sent: false, reason: "SMTP not configured" };
    }

    const cleanPhone = (data.phone || "").replace(/\s+/g, "");
    const initials = data.firmName
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
  <title>New Dealership Application</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F1F5F9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1E293B;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #F1F5F9; padding: 30px 10px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" max-width="600" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #FFFFFF; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06); border: 1px solid #E2E8F0;">
          
          <!-- Header Banner with Red Accent -->
          <tr>
            <td style="background: linear-gradient(135deg, #002B5C 0%, #D8232A 100%); padding: 32px 30px; text-align: center;">
              <p style="margin: 0 0 6px 0; color: #E2E8F0; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px;">
                Distribution Network Expansion
              </p>
              <h1 style="margin: 0; color: #FFFFFF; font-size: 24px; font-weight: 800; letter-spacing: 0.5px;">
                DEALERSHIP APPLICATION
              </h1>
              <div style="margin-top: 16px; display: inline-block; background-color: rgba(255, 255, 255, 0.2); border: 1px solid rgba(255, 255, 255, 0.4); color: #FFFFFF; font-size: 11px; font-weight: 800; padding: 6px 14px; border-radius: 30px; text-transform: uppercase; letter-spacing: 1.5px;">
                🚀 New Distributor Lead
              </div>
            </td>
          </tr>

          <!-- Main Body Content -->
          <tr>
            <td style="padding: 32px 30px;">
              
              <!-- Firm Profile Card -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 16px; padding: 20px; margin-bottom: 24px;">
                <tr>
                  <td width="52" valign="middle" style="padding-right: 14px;">
                    <div style="width: 50px; height: 50px; border-radius: 14px; background: linear-gradient(135deg, #D8232A 0%, #002B5C 100%); color: #FFFFFF; font-size: 18px; font-weight: 800; line-height: 50px; text-align: center;">
                      ${initials || "DL"}
                    </div>
                  </td>
                  <td valign="middle">
                    <h2 style="margin: 0; font-size: 19px; font-weight: 800; color: #0F172A;">
                      ${data.firmName}
                    </h2>
                    <p style="margin: 3px 0 0 0; font-size: 13px; color: #D8232A; font-weight: 700;">
                      Applicant: ${data.name}
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Quick Action Call/Email Buttons -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom: 28px;">
                <tr>
                  ${
                    cleanPhone
                      ? `<td width="48%" align="center">
                          <a href="tel:${cleanPhone}" style="display: block; background-color: #002B5C; color: #FFFFFF; text-decoration: none; padding: 12px 16px; border-radius: 12px; font-size: 13px; font-weight: 700; text-align: center;">
                            📞 Call Applicant
                          </a>
                        </td>
                        <td width="4%"></td>`
                      : ""
                  }
                  ${
                    data.email
                      ? `<td width="${cleanPhone ? "48%" : "100%"}" align="center">
                          <a href="mailto:${data.email}" style="display: block; background-color: #D8232A; color: #FFFFFF; text-decoration: none; padding: 12px 16px; border-radius: 12px; font-size: 13px; font-weight: 700; text-align: center;">
                            ✉️ Reply via Email
                          </a>
                        </td>`
                      : ""
                  }
                </tr>
              </table>

              <!-- Application Details Grid -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse: collapse; margin-bottom: 24px;">
                <tr>
                  <td colspan="2" style="padding-bottom: 12px; font-size: 12px; font-weight: 800; color: #D8232A; text-transform: uppercase; letter-spacing: 1px; border-bottom: 2px solid #D8232A;">
                    Applicant & Business Credentials
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; font-size: 13px; color: #64748B; font-weight: 600; width: 42%; border-bottom: 1px solid #F1F5F9;">
                    Firm / Company:
                  </td>
                  <td style="padding: 12px 0; font-size: 14px; color: #0F172A; font-weight: 800; border-bottom: 1px solid #F1F5F9;">
                    ${data.firmName}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; font-size: 13px; color: #64748B; font-weight: 600; border-bottom: 1px solid #F1F5F9;">
                    Contact Person:
                  </td>
                  <td style="padding: 12px 0; font-size: 14px; color: #0F172A; font-weight: 700; border-bottom: 1px solid #F1F5F9;">
                    ${data.name}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; font-size: 13px; color: #64748B; font-weight: 600; border-bottom: 1px solid #F1F5F9;">
                    Phone Number:
                  </td>
                  <td style="padding: 12px 0; font-size: 14px; font-weight: 700; border-bottom: 1px solid #F1F5F9;">
                    <a href="tel:${cleanPhone}" style="color: #002B5C; text-decoration: none; font-weight: 800;">${data.phone}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; font-size: 13px; color: #64748B; font-weight: 600; border-bottom: 1px solid #F1F5F9;">
                    Email Address:
                  </td>
                  <td style="padding: 12px 0; font-size: 14px; border-bottom: 1px solid #F1F5F9;">
                    <a href="mailto:${data.email}" style="color: #002B5C; text-decoration: underline; font-weight: 600;">${data.email}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; font-size: 13px; color: #64748B; font-weight: 600; border-bottom: 1px solid #F1F5F9;">
                    Target Territory / City:
                  </td>
                  <td style="padding: 12px 0; font-size: 14px; color: #0F172A; font-weight: 700; border-bottom: 1px solid #F1F5F9;">
                    ${data.city || "Not Specified"}${data.state ? `, ${data.state}` : ""}
                  </td>
                </tr>
                ${
                  data.existingBusiness
                    ? `<tr>
                        <td style="padding: 12px 0; font-size: 13px; color: #64748B; font-weight: 600; border-bottom: 1px solid #F1F5F9;">
                          Existing Business:
                        </td>
                        <td style="padding: 12px 0; font-size: 14px; color: #0F172A; font-weight: 700; border-bottom: 1px solid #F1F5F9;">
                          ${data.existingBusiness}
                        </td>
                      </tr>`
                    : ""
                }
                ${
                  data.annualTurnover
                    ? `<tr>
                        <td style="padding: 12px 0; font-size: 13px; color: #64748B; font-weight: 600; border-bottom: 1px solid #F1F5F9;">
                          Annual Turnover:
                        </td>
                        <td style="padding: 12px 0; font-size: 14px; color: #0F172A; font-weight: 700; border-bottom: 1px solid #F1F5F9;">
                          ${data.annualTurnover}
                        </td>
                      </tr>`
                    : ""
                }
                ${
                  data.experienceYears
                    ? `<tr>
                        <td style="padding: 12px 0; font-size: 13px; color: #64748B; font-weight: 600; border-bottom: 1px solid #F1F5F9;">
                          Industry Experience:
                        </td>
                        <td style="padding: 12px 0; font-size: 14px; color: #0F172A; font-weight: 700; border-bottom: 1px solid #F1F5F9;">
                          ${data.experienceYears} Years
                        </td>
                      </tr>`
                    : ""
                }
              </table>

              <!-- Applicant Note / Message -->
              ${
                data.message
                  ? `<div style="background-color: #F8FAFC; border-left: 4px solid #D8232A; padding: 18px 20px; border-radius: 0 12px 12px 0; margin-bottom: 24px;">
                      <p style="margin: 0 0 6px 0; font-size: 11px; font-weight: 800; text-transform: uppercase; color: #D8232A; letter-spacing: 1px;">
                        Application Remarks / Cover Note:
                      </p>
                      <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #334155;">
                        &ldquo;${data.message}&rdquo;
                      </p>
                    </div>`
                  : ""
              }

            </td>
          </tr>

          <!-- Corporate Footer -->
          <tr>
            <td style="background-color: #F8FAFC; padding: 24px 30px; border-top: 1px solid #E2E8F0; text-align: center;">
              <p style="margin: 0 0 4px 0; font-size: 12px; font-weight: 700; color: #475569;">
                Mahalaxmi Enterprises CMS &bull; Distribution Lead Management
              </p>
              <p style="margin: 0; font-size: 11px; color: #94A3B8;">
                Baghpat Region & Surrounding Industrial Belts, Uttar Pradesh, India
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    // 1. Admin Alert
    await transporter.sendMail({
      from: fromAddress,
      to: adminEmail,
      subject: `🚀 Dealership Application: ${data.firmName} (${data.city || data.state || "UP"})`,
      html: htmlContent,
    });

    // 2. Applicant Confirmation Email
    if (data.email) {
      const applicantAckHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Application Received</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F1F5F9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1E293B;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #F1F5F9; padding: 30px 10px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" max-width="600" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #FFFFFF; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06); border: 1px solid #E2E8F0;">
          
          <tr>
            <td style="background: linear-gradient(135deg, #002B5C 0%, #001A38 100%); padding: 32px 30px; text-align: center; border-top: 4px solid #D8232A;">
              <h1 style="margin: 0; color: #FFFFFF; font-size: 22px; font-weight: 800;">
                MAHALAXMI ENTERPRISES
              </h1>
              <p style="margin: 6px 0 0 0; color: #94A3B8; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px;">
                HPCL Dealership & Distributorship Network
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding: 36px 30px; line-height: 1.6;">
              <h2 style="margin: 0 0 16px 0; font-size: 20px; font-weight: 800; color: #002B5C;">
                Application Received for ${data.firmName}!
              </h2>
              <p style="margin: 0 0 16px 0; font-size: 14px; color: #475569;">
                Dear <strong>${data.name}</strong>,
              </p>
              <p style="margin: 0 0 20px 0; font-size: 14px; color: #475569;">
                Thank you for applying to become an authorized Distribution Partner / Dealership with Mahalaxmi Enterprises (HPCL Industrial Lube Distributor).
              </p>
              <p style="margin: 0 0 24px 0; font-size: 14px; color: #475569;">
                Our network expansion team will review your business profile and contact you at <strong>${data.phone}</strong> regarding commercial onboarding terms, margin structures, and stockist agreements.
              </p>

              <p style="margin: 0; font-size: 13px; color: #64748B;">
                Warm regards,<br>
                <strong style="color: #002B5C; font-size: 14px;">Distribution Onboarding Team</strong><br>
                Mahalaxmi Enterprises &bull; HPCL Lubricants Division
              </p>
            </td>
          </tr>

          <tr>
            <td style="background-color: #F8FAFC; padding: 20px 30px; border-top: 1px solid #E2E8F0; text-align: center; font-size: 11px; color: #94A3B8;">
              &copy; 2026 Mahalaxmi Enterprises. All rights reserved.
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `;

      await transporter
        .sendMail({
          from: fromAddress,
          to: data.email,
          subject: `Dealership Application Received: ${data.firmName} (Mahalaxmi Enterprises)`,
          html: applicantAckHtml,
        })
        .catch((e) => console.error("Error sending applicant acknowledgement email:", e));
    }

    return { sent: true };
  } catch (error) {
    console.error("Error in sendDistributorLeadNotificationEmail:", error);
    return { sent: false, error };
  }
}
