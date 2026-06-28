import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: "smtppro.zoho.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.ZOHO_EMAIL!,
    pass: process.env.ZOHO_APP_PASSWORD!,
  },
});

export async function sendMail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  await transporter.sendMail({
    from: `Kiki African Taste <${process.env.ZOHO_EMAIL}>`,
    to,
    subject,
    html,
  });
}
