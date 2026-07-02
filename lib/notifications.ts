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
    .map((i, idx) => {
      const qty =
        i.pricingType === "PER_KG"
          ? `${i.weightKg! * 1000}g`
          : `x${i.quantity}`;
      const bg = idx % 2 === 0 ? "#ffffff" : "#fdfbfa";
      return `
        <tr style="background:${bg}">
          <td style="padding:14px 16px;font-size:14px;line-height:1.4;color:#2c2a29;border-bottom:1px solid #f3ece3;font-weight:500;">${i.productName}</td>
          <td style="padding:14px 16px;font-size:14px;color:#7c756e;border-bottom:1px solid #f3ece3;text-align:center;font-weight:500;">${qty}</td>
          <td style="padding:14px 16px;font-size:14px;color:#1a1a1a;font-weight:600;border-bottom:1px solid #f3ece3;text-align:right">${formatPrice(i.subtotal)}</td>
        </tr>`;
    })
    .join("");

  return `
    <table style="width:100%;border-collapse:separate;border-spacing:0;margin:24px 0;border-radius:12px;overflow:hidden;border:1px solid #eaddcd;box-shadow:0 2px 4px rgba(0,0,0,0.02)">
      <thead>
        <tr style="background:#1a1a1a">
          <th style="padding:14px 16px;text-align:left;font-size:12px;font-weight:700;color:#c9a96e;letter-spacing:1px;text-transform:uppercase">Item</th>
          <th style="padding:14px 16px;text-align:center;font-size:12px;font-weight:700;color:#c9a96e;letter-spacing:1px;text-transform:uppercase">Qty</th>
          <th style="padding:14px 16px;text-align:right;font-size:12px;font-weight:700;color:#c9a96e;letter-spacing:1px;text-transform:uppercase">Subtotal</th>
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
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 40px auto; color: #4a4540; background: #ffffff; border-radius: 16px; border: 1px solid #eee8e0; box-shadow: 0 4px 20px rgba(0,0,0,0.05); padding: 32px; line-height: 1.6;">

        <div style="text-align: center; margin-bottom: 24px;">
          <span style="font-size: 40px;">🌍</span>
          <h2 style="color: #1a1a1a; margin: 12px 0 4px 0; font-size: 24px; font-weight: 700;">Thank you for your order!</h2>
          <p style="color: #c9a96e; font-weight: 600; margin: 0; font-size: 16px;">Hi ${order.customerName}</p>
        </div>

        <p style="text-align: center; font-size: 15px; color: #615c57; margin-bottom: 32px;">
          We've received your order and it's currently being reserved. 
          Please complete your bank transfer within <strong style="color: #d9534f;">30 minutes</strong> to secure your delicious items.
        </p>

        <h3 style="border-bottom: 2px solid #f3ece3; padding-bottom: 8px; color: #1a1a1a; font-size: 16px; letter-spacing: -0.3px;">
          Order Summary — <span style="color: #c9a96e;">${order.orderNumber}</span>
        </h3>

        ${itemsToHtml(order.items)}

        <table style="width:100%; margin: 24px 0; font-size: 15px; border-collapse: collapse;">
          <tr>
            <td style="padding: 6px 0; color: #7c756e;">Subtotal</td>
            <td style="text-align:right; padding: 6px 0; font-weight: 500; color: #1a1a1a;">${formatPrice(order.subtotal)}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #7c756e;">Delivery</td>
            <td style="text-align:right; padding: 6px 0; font-weight: 500; color: #1a1a1a;">${formatPrice(order.deliveryFee)}</td>
          </tr>
          <tr style="font-weight:bold; font-size:18px; border-top: 2px solid #f3ece3;">
            <td style="padding: 14px 0 6px 0; color: #1a1a1a;">Total</td>
            <td style="text-align:right; padding: 14px 0 6px 0; color: #c9a96e;">${formatPrice(order.total)}</td>
          </tr>
        </table>

        <div style="background:#fffaf4; border: 1px solid #eaddcd; border-left: 4px solid #c9a96e; padding: 20px; margin: 32px 0; border-radius: 8px;">
          <h4 style="margin: 0 0 12px 0; color: #1a1a1a; font-size: 16px; text-transform: uppercase; letter-spacing: 0.5px;">Bank Payment Details</h4>
          <table style="width: 100%; font-size: 14px;">
            <tr><td style="padding: 4px 0; color: #7c756e;">Bank:</td><td style="padding: 4px 0; font-weight: 600; color: #1a1a1a;">${process.env.STORE_BANK_NAME}</td></tr>
            <tr><td style="padding: 4px 0; color: #7c756e;">Account Number:</td><td style="padding: 4px 0; font-weight: 600; color: #1a1a1a; font-size: 15px; letter-spacing: 0.5px;">${process.env.STORE_ACCOUNT_NUMBER}</td></tr>
            <tr><td style="padding: 4px 0; color: #7c756e;">Account Name:</td><td style="padding: 4px 0; font-weight: 600; color: #1a1a1a;">${process.env.STORE_ACCOUNT_NAME}</td></tr>
            <tr><td style="padding: 4px 0; color: #7c756e;">Amount:</td><td style="padding: 4px 0; font-weight: bold; color: #c9a96e; font-size: 15px;">${formatPrice(order.total)}</td></tr>
            <tr><td style="padding: 4px 0; color: #7c756e;">Reference:</td><td style="padding: 4px 0; font-weight: bold; color: #1a1a1a; background: #f3ece3; padding: 2px 6px; border-radius: 4px; display: inline-block;">${order.orderNumber}</td></tr>
          </table>
        </div>

        <div style="background:#fff5f5; border: 1px solid #fcdede; padding: 16px; border-radius: 8px; color: #c9302c; font-size: 14px; text-align: center; font-weight: 500;">
          ⏳ <strong>Payment deadline: ${order.expiresAt.toLocaleTimeString()}</strong><br/>
          <span style="font-size:13px; opacity: 0.9;">Your order will be automatically cancelled if payment is not received.</span>
        </div>

        <div style="margin-top: 32px; background: #faf9f7; padding: 20px; border-radius: 8px; border: 1px solid #f0ede8; font-size: 14px;">
          <p style="margin: 0 0 10px 0; font-weight: 600; color: #1a1a1a;">Once you've made the transfer, please reply to this email with:</p>
          <ul style="margin: 0; padding-left: 20px; color: #5c5752; line-height: 1.5;">
            <li style="margin-bottom: 4px;">Your payment receipt or screenshot</li>
            <li style="margin-bottom: 4px;">Your name</li>
            <li>Your order reference: <strong>${order.orderNumber}</strong></li>
          </ul>
        </div>

        <p style="text-align: center; font-size: 14px; margin-top: 24px; color: #7c756e;">Our team will confirm your order as soon as payment is verified.</p>

        <div style="text-align: center; color:#a19a93; font-size:13px; margin-top:40px; border-top:1px solid #f3ece3; padding-top:24px">
          <p style="margin: 0 0 4px 0;">If you have any questions, simply reply directly to this email.</p>
          <strong style="color: #1a1a1a; font-weight: 600;">Kiki African Taste 🌍</strong>
        </div>

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
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 40px auto; color: #2c2a29; background: #ffffff; border-radius: 16px; border: 1px solid #eaddcd; padding: 32px; line-height: 1.6;">

        <div style="background: #1a1a1a; padding: 20px; margin: -32px -32px 32px -32px; border-radius: 16px 16px 0 0; text-align: center;">
          <h2 style="color: #c9a96e; margin: 0; font-size: 20px; font-weight: 700; letter-spacing: 0.5px;">🛒 New Order Received</h2>
          <p style="color: #ffffff; margin: 4px 0 0 0; font-size: 14px; opacity: 0.9;">ID: ${order.orderNumber}</p>
        </div>

        <div style="background:#fffaf4; border: 1px solid #eaddcd; border-left: 4px solid #c9a96e; padding: 20px; margin-bottom: 32px; border-radius: 8px;">
          <h4 style="margin: 0 0 12px 0; color: #1a1a1a; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Expected Payment Destination</h4>
          <table style="width: 100%; font-size: 14px;">
            <tr><td style="padding: 3px 0; color: #7c756e;">Bank:</td><td style="padding: 3px 0; font-weight: 600; color: #1a1a1a;">${process.env.STORE_BANK_NAME}</td></tr>
            <tr><td style="padding: 3px 0; color: #7c756e;">Account No:</td><td style="padding: 3px 0; font-weight: 600; color: #1a1a1a;">${process.env.STORE_ACCOUNT_NUMBER}</td></tr>
            <tr><td style="padding: 3px 0; color: #7c756e;">Holder:</td><td style="padding: 3px 0; font-weight: 600; color: #1a1a1a;">${process.env.STORE_ACCOUNT_NAME}</td></tr>
            <tr><td style="padding: 3px 0; color: #7c756e;">Amount:</td><td style="padding: 3px 0; font-weight: 700; color: #c9a96e; font-size: 15px;">${formatPrice(order.total)}</td></tr>
            <tr><td style="padding: 3px 0; color: #7c756e;">Reference:</td><td style="padding: 3px 0; font-weight: 700; color: #1a1a1a;">${order.orderNumber}</td></tr>
          </table>
        </div>

        <h3 style="border-bottom: 2px solid #f3ece3; padding-bottom: 6px; color: #1a1a1a; font-size: 15px; text-transform: uppercase; letter-spacing: 0.5px;">Customer Details</h3>
        <p style="margin: 8px 0; font-size: 14px;">Name: <strong style="color: #1a1a1a;">${order.customerName}</strong></p>
        <p style="margin: 8px 0; font-size: 14px;">Email: <strong style="color: #1a1a1a;">${order.customerEmail ?? "Not provided"}</strong></p>

        <h3 style="border-bottom: 2px solid #f3ece3; padding-bottom: 6px; color: #1a1a1a; font-size: 15px; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 32px;">Order Items</h3>
        ${itemsToHtml(order.items)}

        <table style="width:100%; margin: 24px 0; font-size: 14px;">
          <tr>
            <td style="padding: 4px 0; color: #7c756e;">Subtotal</td>
            <td style="text-align:right; padding: 4px 0; font-weight:600;">${formatPrice(order.subtotal)}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0; color: #7c756e;">Delivery Fee</td>
            <td style="text-align:right; padding: 4px 0; font-weight:600;">${formatPrice(order.deliveryFee)}</td>
          </tr>
          <tr style="font-weight:bold; font-size:16px; border-top: 2px solid #f3ece3;">
            <td style="padding: 12px 0 0 0; color: #1a1a1a;">Total Expected</td>
            <td style="text-align:right; padding: 12px 0 0 0; color: #c9a96e;">${formatPrice(order.total)}</td>
          </tr>
        </table>

        <div style="background:#fff5f5; border: 1px solid #fcdede; padding: 14px 16px; border-radius: 8px; color: #c9302c; font-size: 13px; margin-bottom: 32px; font-weight: 500;">
          ⚠️ This order expires in <strong>30 minutes</strong>. Confirm payment via the dashboard before expiration to prevent auto-cancellation.
        </div>

        <div style="text-align: center; margin-top: 32px;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/orders"
             style="background:#1a1a1a; color:#ffffff; padding:14px 28px; text-decoration:none; border-radius:8px; font-weight: 600; font-size: 14px; display: inline-block; letter-spacing: 0.3px; border: 1px solid #1a1a1a; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
            View Order in Dashboard →
          </a>
        </div>

      </div>
    `,
  });
}

// ─── Order confirmed ───────────────────────────────────────────

export async function sendOrderConfirmed(order: {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  total: number;
  items: OrderItemDetail[];
}) {
  if (!order.customerEmail) return;

  await sendMail({
    to: order.customerEmail,
    subject: `Order ${order.orderNumber} confirmed 🎉`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 40px auto; color: #4a4540; background: #ffffff; border-radius: 16px; border: 1px solid #eee8e0; box-shadow: 0 4px 20px rgba(0,0,0,0.05); padding: 32px; line-height: 1.6;">

        <div style="text-align: center; margin-bottom: 32px;">
          <div style="background: #f4ebe1; width: 64px; height: 64px; line-height: 64px; border-radius: 50%; display: inline-block; font-size: 32px; margin-bottom: 16px;">🎉</div>
          <h2 style="color: #1a1a1a; margin: 0 0 4px 0; font-size: 24px; font-weight: 700;">Payment Confirmed!</h2>
          <p style="color: #7c756e; margin: 0; font-size: 15px;">Hi ${order.customerName}, we have successfully received your payment.</p>
        </div>

        <h3 style="border-bottom: 2px solid #f3ece3; padding-bottom: 8px; color: #1a1a1a; font-size: 16px;">
          Order Details — <span style="color: #c9a96e;">${order.orderNumber}</span>
        </h3>

        ${itemsToHtml(order.items)}

        <table style="width:100%; margin: 24px 0;">
          <tr style="font-weight:bold; font-size:18px; border-top: 2px solid #f3ece3;">
            <td style="padding: 14px 0 0 0; color: #1a1a1a;">Total Paid</td>
            <td style="text-align:right; padding: 14px 0 0 0; color: #c9a96e;">${formatPrice(order.total)}</td>
          </tr>
        </table>

        <div style="background: #fbfbfb; border: 1px dashed #eaddcd; padding: 16px; border-radius: 8px; text-align: center; color: #5c5752; font-size: 15px; font-weight: 500;">
          🍳 We are preparing your order and will begin processing your delivery shortly.
        </div>

        <div style="text-align: center; color:#a19a93; font-size:13px; margin-top:40px; border-top:1px solid #f3ece3; padding-top:24px">
          <p style="margin: 0 0 4px 0;">Thank you for your patronage!</p>
          <strong style="color: #1a1a1a; font-weight: 600;">Kiki African Taste 🌍</strong>
        </div>

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
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 40px auto; color: #4a4540; background: #ffffff; border-radius: 16px; border: 1px solid #eee8e0; box-shadow: 0 4px 20px rgba(0,0,0,0.05); padding: 32px; line-height: 1.6;">

        <div style="text-align: center; margin-bottom: 24px;">
          <div style="background: #fff5f5; width: 64px; height: 64px; line-height: 64px; border-radius: 50%; display: inline-block; font-size: 32px; margin-bottom: 16px;">📋</div>
          <h2 style="color: #1a1a1a; margin: 0 0 4px 0; font-size: 22px; font-weight: 700;">Your order has been cancelled</h2>
          <p style="color: #7c756e; margin: 0; font-size: 15px;">Hi ${order.customerName}</p>
        </div>

        <p style="text-align: center; color: #5c5752; font-size: 15px;">
          Your order <strong style="color: #1a1a1a;">${order.orderNumber}</strong> was automatically cancelled because the payment window expired before transaction confirmation.
        </p>
        
        <p style="text-align: center; color: #5c5752; font-size: 15px; margin-bottom: 32px;">
          Don't worry, your cart items are waiting! You are welcome to place a brand new order at any time.
        </p>

        <div style="text-align: center; color:#a19a93; font-size:13px; margin-top:40px; border-top:1px solid #f3ece3; padding-top:24px">
          <strong style="color: #1a1a1a; font-weight: 600;">Kiki African Taste 🌍</strong>
        </div>

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
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 500px; margin: 40px auto; color: #2c2a29; background: #ffffff; border-radius: 16px; border: 1px solid #eaddcd; padding: 32px; line-height: 1.6; text-align: center;">
        
        <div style="font-size: 40px; margin-bottom: 16px;">🔑</div>
        <h2 style="color: #1a1a1a; margin-top: 0; font-size: 22px; font-weight: 700;">Admin Password Reset</h2>
        <p style="color: #615c57; font-size: 15px; margin-bottom: 28px;">You requested a password reset link for your dashboard access. Click below to secure a new password.</p>
            
        <p style="margin: 32px 0;">
          <a href="${resetUrl}"
             style="background:#1a1a1a; color:#ffffff; padding:14px 32px; text-decoration:none; border-radius:8px; font-weight: 600; font-size: 14px; letter-spacing: 0.3px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); display: inline-block;">
            Reset Password
          </a>
        </p>
        
        <hr style="border: 0; border-top: 1px solid #f3ece3; margin: 28px 0;" />
        <p style="color:#d9534f; font-size:13px; font-weight: 500; margin: 4px 0;">⚠️ This link safely expires in 15 minutes.</p>
        <p style="color:#a19a93; font-size:13px; margin: 4px 0;">If you did not make this request, please safely disregard this email.</p>
      </div>
    `,
  });
}