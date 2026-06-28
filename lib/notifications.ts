import { Resend } from "resend";
import { sendMail } from "./mailer";

const resend = new Resend(process.env.RESEND_API_KEY!);

export function formatPrice(cents: number): string {
  return `£${(cents / 100).toFixed(2)}`;
}

type OrderItemDetail = {
  productName: string;
  pricingType: "FIXED" | "PER_KG";
  quantity: number | null;
  weightKg: number | null;
  unitPrice: number;
  subtotal: number;
};

function itemsToHtml(items: OrderItemDetail[]): string {
  const rows = items
    .map((i) => {
      const qty =
        i.pricingType === "PER_KG"
          ? `${i.weightKg! * 1000}g`
          : `x${i.quantity}`;
      return `
        <tr>
          <td style="padding:8px;border-bottom:1px solid #eee">${i.productName}</td>
          <td style="padding:8px;border-bottom:1px solid #eee">${qty}</td>
          <td style="padding:8px;border-bottom:1px solid #eee">${formatPrice(i.subtotal)}</td>
        </tr>`;
    })
    .join("");

  return `
    <table style="width:100%;border-collapse:collapse;margin:16px 0">
      <thead>
        <tr style="background:#f9f9f9">
          <th style="padding:8px;text-align:left">Item</th>
          <th style="padding:8px;text-align:left">Qty</th>
          <th style="padding:8px;text-align:left">Subtotal</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}

// ─── Order placed — payment instructions to customer ──────────

export async function sendPaymentDetails(order: {
  orderNumber: string;
  customerName: string;
  customerEmail: string | null;
  subtotal: number;
  deliveryFee: number;
  total: number;
  expiresAt: Date;
  items: OrderItemDetail[];
}) {
  if (!order.customerEmail) return;

  await sendMail({
    to: order.customerEmail,
    subject: `Payment details for order ${order.orderNumber}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333">

        <h2 style="color: #1a1a1a">Thank you for your order, ${order.customerName}! 🎉</h2>

        <p>We've received your order and it's currently being held for you.
        Please complete your bank transfer within <strong>30 minutes</strong>
        to secure your items.</p>

        <h3 style="border-bottom: 1px solid #eee; padding-bottom: 8px">
          Order Summary — ${order.orderNumber}
        </h3>

        ${itemsToHtml(order.items)}

        <table style="width:100%; margin: 16px 0">
          <tr>
            <td>Subtotal</td>
            <td style="text-align:right">${formatPrice(order.subtotal)}</td>
          </tr>
          <tr>
            <td>Delivery</td>
            <td style="text-align:right">${formatPrice(order.deliveryFee)}</td>
          </tr>
          <tr style="font-weight:bold; font-size:16px">
            <td>Total</td>
            <td style="text-align:right">${formatPrice(order.total)}</td>
          </tr>
        </table>

        <div style="background:#f9f9f9; border-left: 4px solid #c8a96e; padding: 16px; margin: 24px 0">
          <h3 style="margin-top:0">Payment Details</h3>
          <p style="margin:4px 0">Bank: <strong>${process.env.STORE_BANK_NAME}</strong></p>
          <p style="margin:4px 0">Account Number: <strong>${process.env.STORE_ACCOUNT_NUMBER}</strong></p>
          <p style="margin:4px 0">Account Name: <strong>${process.env.STORE_ACCOUNT_NAME}</strong></p>
          <p style="margin:4px 0">Amount: <strong>${formatPrice(order.total)}</strong></p>
          <p style="margin:4px 0">Reference: <strong>${order.orderNumber}</strong></p>
        </div>

        <div style="background:#fff8e1; border: 1px solid #ffe082; padding: 12px 16px; border-radius: 4px">
          ⚠️ <strong>Payment deadline: ${order.expiresAt.toLocaleTimeString()}</strong><br/>
          Your order will be automatically cancelled if payment is not received by this time.
        </div>

        <p style="margin-top: 24px">
          Once you've made the transfer, please reply to this email with:
          <ul>
            <li>Your payment receipt or screenshot</li>
            <li>Your name</li>
            <li>Your order reference: <strong>${order.orderNumber}</strong></li>
          </ul>
        </p>

        <p>Our team will confirm your order as soon as payment is verified.</p>

        <p style="color:#888; font-size:13px; margin-top:32px; border-top:1px solid #eee; padding-top:16px">
          If you have any questions, simply reply to this email.<br/>
          Thank you for choosing Kiki African Taste 🌍
        </p>

      </div>
    `,
  });
}

// ─── New order alert to admin ──────────────────────────────────

export async function sendNewOrderAlert(order: {
  orderNumber: string;
  customerName: string;
  customerEmail: string | null;
  subtotal: number;
  deliveryFee: number;
  total: number;
  items: OrderItemDetail[];
}) {
  await sendMail({
    to: process.env.ADMIN_EMAIL!,
    subject: `New order: ${order.orderNumber} — ${formatPrice(order.total)}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333">

        <h2 style="color: #1a1a1a">🛒 New Order Received — ${order.orderNumber}</h2>

        <div style="background:#f9f9f9; border-left: 4px solid #c8a96e; padding: 16px; margin: 24px 0">
          <h3 style="margin-top:0">Check this account for payment</h3>
          <p style="margin:4px 0">Bank: <strong>${process.env.STORE_BANK_NAME}</strong></p>
          <p style="margin:4px 0">Account Number: <strong>${process.env.STORE_ACCOUNT_NUMBER}</strong></p>
          <p style="margin:4px 0">Account Name: <strong>${process.env.STORE_ACCOUNT_NAME}</strong></p>
          <p style="margin:4px 0">Expected Amount: <strong>${formatPrice(order.total)}</strong></p>
          <p style="margin:4px 0">Reference: <strong>${order.orderNumber}</strong></p>
        </div>

        <h3 style="border-bottom: 1px solid #eee; padding-bottom: 8px">Customer Details</h3>
        <p style="margin:4px 0">Name: <strong>${order.customerName}</strong></p>
        <p style="margin:4px 0">Email: <strong>${order.customerEmail ?? "Not provided"}</strong></p>

        <h3 style="border-bottom: 1px solid #eee; padding-bottom: 8px">Order Items</h3>
        ${itemsToHtml(order.items)}

        <table style="width:100%; margin: 16px 0">
          <tr>
            <td>Subtotal</td>
            <td style="text-align:right">${formatPrice(order.subtotal)}</td>
          </tr>
          <tr>
            <td>Delivery Fee</td>
            <td style="text-align:right">${formatPrice(order.deliveryFee)}</td>
          </tr>
          <tr style="font-weight:bold; font-size:16px; border-top: 1px solid #eee">
            <td>Total</td>
            <td style="text-align:right">${formatPrice(order.total)}</td>
          </tr>
        </table>

        <div style="background:#fff8e1; border: 1px solid #ffe082; padding: 12px 16px; border-radius: 4px">
          ⚠️ This order expires in <strong>30 minutes</strong>.
          Confirm payment in the dashboard before then or it will be auto-cancelled.
        </div>

        <p style="margin-top: 24px">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/orders"
             style="background:#1a1a1a; color:#fff; padding:12px 24px; text-decoration:none; border-radius:4px">
            View Order in Dashboard →
          </a>
        </p>

      </div>
    `,
  });
}

// ─── Order confirmed ───────────────────────────────────────────

export async function sendOrderConfirmed(order: {
  orderNumber: string;
  customerName: string;
  customerEmail: string | null;
  total: number;
  items: OrderItemDetail[];
}) {
  if (!order.customerEmail) return;

  await sendMail({
    to: order.customerEmail,
    subject: `Order ${order.orderNumber} confirmed! 🎉`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333">

        <h2 style="color: #1a1a1a">Your order has been confirmed! 🎉</h2>
        <p>Hi ${order.customerName}, we have received your payment. Thank you!</p>

        <h3 style="border-bottom: 1px solid #eee; padding-bottom: 8px">
          Order: ${order.orderNumber}
        </h3>

        ${itemsToHtml(order.items)}

        <table style="width:100%; margin: 16px 0">
          <tr style="font-weight:bold; font-size:16px">
            <td>Total Paid</td>
            <td style="text-align:right">${formatPrice(order.total)}</td>
          </tr>
        </table>

        <p>We will begin processing your delivery shortly.</p>

        <p style="color:#888; font-size:13px; margin-top:32px; border-top:1px solid #eee; padding-top:16px">
          Thank you for choosing Kiki African Taste 🌍
        </p>

      </div>
    `,
  });
}

// ─── Order cancelled ───────────────────────────────────────────

export async function sendOrderCancelled(order: {
  orderNumber: string;
  customerName: string;
  customerEmail: string | null;
}) {
  if (!order.customerEmail) return;

  await sendMail({
    to: order.customerEmail,
    subject: `Order ${order.orderNumber} cancelled`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333">

        <h2 style="color: #1a1a1a">Your order has been cancelled</h2>
        <p>Hi ${order.customerName}, your order <strong>${order.orderNumber}</strong>
        was cancelled because no payment was received within 30 minutes.</p>
        <p>You're welcome to place a new order anytime.</p>

        <p style="color:#888; font-size:13px; margin-top:32px; border-top:1px solid #eee; padding-top:16px">
          Thank you for choosing Kiki African Taste 🌍
        </p>

      </div>
    `,
  });
}

// ─── Forgot password — Resend only ────────────────────────────

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/admin/reset-password?token=${token}`;

  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to: email,
    subject: "Reset your admin password",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333">
        <h2>Password Reset</h2>
        <p>Click the link below to set a new password.</p>
        <p>
          <a href="${resetUrl}"
             style="background:#1a1a1a; color:#fff; padding:12px 24px; text-decoration:none; border-radius:4px">
            Reset Password
          </a>
        </p>
        <p style="color:#888; font-size:13px">This link expires in <strong>15 minutes</strong>.</p>
        <p style="color:#888; font-size:13px">If you did not request this, ignore this email.</p>
      </div>
    `,
  });
}
