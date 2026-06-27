import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);


function formatPounds(amount: number): string {
  return `£${Number(amount).toFixed(2)}`;
}

function formatPence(amount: number): string {
  return `£${(amount / 100).toFixed(2)}`;
}

type OrderItemDetail = {
  productName: string;
  pricingType: "FIXED" | "PER_KG";
  quantity: number | null;
  weightKg: number | null;
  unitPrice: number;
  subtotal: number;
};

function itemsToText(items: OrderItemDetail[]): string {
  return items
    .map((i) => {
      const qty =
        i.pricingType === "PER_KG"
          ? `${i.weightKg! * 1000}g`
          : `x${i.quantity}`;
      return `- ${i.productName} (${qty}) — ${formatPounds(i.subtotal)}`;
    })
    .join("\n");
}

function itemsToHtml(items: OrderItemDetail[]): string {
  const rows = items
    .map((i, idx) => {
      const qty =
        i.pricingType === "PER_KG"
          ? `${i.weightKg! * 1000}g`
          : `x${i.quantity}`;
      const bg = idx % 2 === 0 ? "#ffffff" : "#fafaf9";
      return `
        <tr style="background:${bg}">
          <td style="padding:12px 16px;font-size:14px;color:#1a1a1a;border-bottom:1px solid #f0ede8">${i.productName}</td>
          <td style="padding:12px 16px;font-size:14px;color:#6b6b6b;border-bottom:1px solid #f0ede8;text-align:center">${qty}</td>
          <td style="padding:12px 16px;font-size:14px;color:#1a1a1a;font-weight:600;border-bottom:1px solid #f0ede8;text-align:right">${formatPounds(i.subtotal)}</td>
        </tr>`;
    })
    .join("");

  return `
    <table style="width:100%;border-collapse:collapse;margin:20px 0;border-radius:10px;overflow:hidden;border:1px solid #f0ede8">
      <thead>
        <tr style="background:#1a1a1a">
          <th style="padding:12px 16px;text-align:left;font-size:12px;font-weight:600;color:#c9a96e;letter-spacing:0.5px;text-transform:uppercase">Item</th>
          <th style="padding:12px 16px;text-align:center;font-size:12px;font-weight:600;color:#c9a96e;letter-spacing:0.5px;text-transform:uppercase">Qty</th>
          <th style="padding:12px 16px;text-align:right;font-size:12px;font-weight:600;color:#c9a96e;letter-spacing:0.5px;text-transform:uppercase">Subtotal</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}

const emailBase = (content: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#f5f0ea;font-family:'Segoe UI',Arial,sans-serif">
  <div style="max-width:620px;margin:32px auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08)">

    <!-- Header -->
    <div style="background:#1a1a1a;padding:36px 40px;text-align:center">
      <p style="margin:0 0 6px;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#c9a96e;font-weight:600">Premium African Groceries</p>
      <h1 style="margin:0;font-size:26px;font-weight:700;color:#ffffff;letter-spacing:1px">KIKI AFRICAN TASTE</h1>
      <div style="width:40px;height:2px;background:#c9a96e;margin:14px auto 0"></div>
    </div>

    <!-- Body -->
    <div style="padding:40px">
      ${content}
    </div>

    <!-- Footer -->
    <div style="background:#f5f0ea;padding:24px 40px;text-align:center;border-top:1px solid #ede8e0">
      <p style="margin:0 0 4px;font-size:13px;color:#1a1a1a;font-weight:600">Kiki African Taste</p>
      <p style="margin:0;font-size:12px;color:#888">Brixton Market, London &nbsp;•&nbsp; Questions? Reply to this email</p>
    </div>
  </div>
</body>
</html>
`;

// ─── Order placed — payment instructions ──────────────────────

export async function sendPaymentDetails(order: {
  orderNumber: string;
  customerName: string;
  customerEmail: string | null;
  customerWhatsapp: string;
  total: number;
  expiresAt: Date;
  deliveryFee: number;
  subtotal: number;
  items: OrderItemDetail[];
}) {
  if (order.customerEmail) {
    const content = `
      <!-- Greeting -->
      <h2 style="margin:0 0 8px;font-size:22px;color:#1a1a1a;font-weight:700">Thank you, ${order.customerName}!</h2>
      <p style="margin:0 0 28px;font-size:15px;color:#555;line-height:1.6">
        Your order has been received and your items are reserved. Please complete payment within 
        <strong style="color:#c9a96e">30 minutes</strong> to secure your order.
      </p>

      <!-- Order summary heading -->
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:4px">
        <p style="margin:0;font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#888">Order Summary</p>
        <p style="margin:0;font-size:12px;color:#c9a96e;font-weight:600">#${order.orderNumber}</p>
      </div>

      ${itemsToHtml(order.items)}

      <!-- Totals -->
      <table style="width:100%;margin:0 0 28px;border-collapse:collapse">
        <tr>
          <td style="padding:8px 0;font-size:14px;color:#666">Subtotal</td>
          <td style="padding:8px 0;font-size:14px;color:#666;text-align:right">${formatPounds(order.subtotal)}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;font-size:14px;color:#666;border-bottom:1px solid #f0ede8">Delivery</td>
          <td style="padding:8px 0;font-size:14px;color:#666;text-align:right;border-bottom:1px solid #f0ede8">${formatPence(order.deliveryFee)}</td>
        </tr>
        <tr>
          <td style="padding:14px 0 0;font-size:18px;font-weight:700;color:#1a1a1a">Total to Pay</td>
          <td style="padding:14px 0 0;font-size:18px;font-weight:700;color:#1a1a1a;text-align:right">${formatPounds(order.subtotal + order.deliveryFee / 100)}</td>
        </tr>
      </table>

      <!-- Payment box -->
      <div style="background:#fffdf7;border:1.5px solid #c9a96e;border-radius:12px;padding:24px;margin-bottom:24px">
        <p style="margin:0 0 14px;font-size:13px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#c9a96e">Bank Transfer Details</p>
        <table style="width:100%;border-collapse:collapse">
          <tr><td style="padding:5px 0;font-size:14px;color:#888;width:140px">Bank</td><td style="padding:5px 0;font-size:14px;color:#1a1a1a;font-weight:600">${process.env.STORE_BANK_NAME}</td></tr>
          <tr><td style="padding:5px 0;font-size:14px;color:#888">Account Number</td><td style="padding:5px 0;font-size:14px;color:#1a1a1a;font-weight:600">${process.env.STORE_ACCOUNT_NUMBER}</td></tr>
          <tr><td style="padding:5px 0;font-size:14px;color:#888">Account Name</td><td style="padding:5px 0;font-size:14px;color:#1a1a1a;font-weight:600">${process.env.STORE_ACCOUNT_NAME}</td></tr>
          <tr><td style="padding:5px 0;font-size:14px;color:#888">Sort Code</td><td style="padding:5px 0;font-size:14px;color:#fff;font-weight:600">04-00-03</td></tr>
          <tr><td style="padding:5px 0;font-size:14px;color:#888">Amount</td><td style="padding:5px 0;font-size:16px;color:#1a1a1a;font-weight:700">${formatPounds(order.subtotal + order.deliveryFee / 100)}</td></tr>
          <tr>
            <td style="padding:5px 0;font-size:14px;color:#888">Reference</td>
            <td style="padding:5px 0"><span style="background:#1a1a1a;color:#c9a96e;font-family:monospace;font-size:13px;font-weight:700;padding:4px 10px;border-radius:6px;letter-spacing:0.5px">${order.orderNumber}</span></td>
          </tr>
        </table>
      </div>

      <!-- Deadline warning -->
      <div style="background:#fff5f5;border:1px solid #fcc;border-radius:10px;padding:16px 20px;margin-bottom:28px">
        <p style="margin:0 0 4px;font-size:14px;font-weight:700;color:#c0392b">⏰ Payment Deadline: ${order.expiresAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
        <p style="margin:0;font-size:13px;color:#888">Your order will be automatically cancelled if payment is not received by this time.</p>
      </div>

      <!-- After transfer steps -->
      <p style="margin:0 0 10px;font-size:14px;font-weight:600;color:#1a1a1a">After making the transfer:</p>
      <div style="background:#f5f0ea;border-radius:10px;padding:16px 20px;margin-bottom:0">
        <p style="margin:0 0 8px;font-size:14px;color:#555">📎 Send a reply with your payment receipt or screenshot to our whatsapp:+447742846710</p>
        <p style="margin:0;font-size:14px;color:#555">🔖 Include your order reference: <strong>${order.orderNumber}</strong></p>
      </div>
    `;

    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: order.customerEmail,
      subject: `Payment details for order ${order.orderNumber}`,
      html: emailBase(content),
    });
  }
}

// ─── Order confirmed ────────────────────────────────────────────

export async function sendOrderConfirmed(order: {
  orderNumber: string;
  customerName: string;
  customerEmail: string | null;
  customerWhatsapp: string;
  total: number;
  items: OrderItemDetail[];
}) {
  if (order.customerEmail) {
    const content = `
      <!-- Success banner -->
      <div style="background:#f0faf4;border:1px solid #a8d8b9;border-radius:12px;padding:20px 24px;margin-bottom:28px;text-align:center">
        <p style="margin:0 0 4px;font-size:28px">🎉</p>
        <p style="margin:0;font-size:16px;font-weight:700;color:#1e7e3e">Payment Confirmed!</p>
      </div>

      <h2 style="margin:0 0 8px;font-size:22px;color:#1a1a1a;font-weight:700">Great news, ${order.customerName}!</h2>
      <p style="margin:0 0 28px;font-size:15px;color:#555;line-height:1.6">
        We've received your payment and your order is now confirmed. We'll begin preparing your items shortly.
      </p>

      <div style="display:flex;align-items:center;gap:10px;margin-bottom:4px">
        <p style="margin:0;font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#888">Order Summary</p>
        <p style="margin:0;font-size:12px;color:#c9a96e;font-weight:600">#${order.orderNumber}</p>
      </div>

      ${itemsToHtml(order.items)}

      <div style="background:#f5f0ea;border-radius:10px;padding:16px 24px;text-align:right">
        <p style="margin:0;font-size:18px;font-weight:700;color:#1a1a1a">Total Paid: ${formatPounds(order.total)}</p>
      </div>

      <p style="margin:28px 0 0;font-size:14px;color:#555;line-height:1.6">
        We'll be in touch once your order is out for delivery. Thank you for choosing Kiki African Taste 🌍
      </p>
    `;

    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: order.customerEmail,
      subject: `Order ${order.orderNumber} confirmed!`,
      html: emailBase(content),
    });
  }
}

// ─── Order cancelled ────────────────────────────────────────────

export async function sendOrderCancelled(order: {
  orderNumber: string;
  customerName: string;
  customerEmail: string | null;
  customerWhatsapp: string;
}) {
  if (order.customerEmail) {
    const content = `
      <h2 style="margin:0 0 8px;font-size:22px;color:#1a1a1a;font-weight:700">Order Cancelled</h2>
      <p style="margin:0 0 24px;font-size:15px;color:#555;line-height:1.6">
        Hi <strong>${order.customerName}</strong>, your order <strong>#${order.orderNumber}</strong> has been 
        automatically cancelled because payment was not received within the 45-minute window.
      </p>

      <div style="background:#f5f0ea;border-radius:12px;padding:20px 24px;margin-bottom:28px">
        <p style="margin:0 0 6px;font-size:14px;font-weight:600;color:#1a1a1a">No worries — it happens!</p>
        <p style="margin:0;font-size:14px;color:#555;line-height:1.6">
          Your items will be back in stock and you're welcome to place a new order anytime.
        </p>
      </div>

      <div style="text-align:center;margin:32px 0">
        <a href="https://kikiafricataste.co.uk/products"
           style="display:inline-block;background:#1a1a1a;color:#c9a96e;text-decoration:none;font-size:14px;font-weight:700;padding:14px 32px;border-radius:8px;letter-spacing:0.5px">
          Shop Again →
        </a>
      </div>

      <p style="margin:0;font-size:13px;color:#888;text-align:center">
        Need help? Just reply to this email and we'll sort it out.
      </p>
    `;

    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: order.customerEmail,
      subject: `Order ${order.orderNumber} cancelled`,
      html: emailBase(content),
    });
  }
}

// ─── New order alert to admin ───────────────────────────────────

export async function sendNewOrderAlert(order: {
  orderNumber: string;
  customerName: string;
  customerWhatsapp: string;
  total: number;
  deliveryFee: number;
  subtotal: number;
  customerEmail: string;
  items: OrderItemDetail[];
}) {
  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to: process.env.ADMIN_EMAIL!,
    subject: `New order: ${order.orderNumber} — ${formatPounds(order.subtotal + order.deliveryFee / 100)}`,
    html: emailBase(`
      <!-- Alert badge -->
      <div style="background:#fffdf7;border:1.5px solid #c9a96e;border-radius:10px;padding:14px 20px;margin-bottom:28px;display:flex;align-items:center;gap:12px">
        <span style="font-size:22px">🛒</span>
        <div>
          <p style="margin:0;font-size:15px;font-weight:700;color:#1a1a1a">New Order Received</p>
          <p style="margin:0;font-size:13px;color:#888">Ref: <strong style="color:#c9a96e">${order.orderNumber}</strong></p>
        </div>
      </div>

      <!-- Payment to collect -->
      <div style="background:#1a1a1a;border-radius:12px;padding:24px;margin-bottom:28px">
        <p style="margin:0 0 14px;font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#c9a96e">Check Your Account For This Payment</p>
        <table style="width:100%;border-collapse:collapse">
          <tr><td style="padding:5px 0;font-size:14px;color:#888;width:150px">Bank</td><td style="padding:5px 0;font-size:14px;color:#fff;font-weight:600">${process.env.STORE_BANK_NAME}</td></tr>
          <tr><td style="padding:5px 0;font-size:14px;color:#888">Account Number</td><td style="padding:5px 0;font-size:14px;color:#fff;font-weight:600">${process.env.STORE_ACCOUNT_NUMBER}</td></tr>
          <tr><td style="padding:5px 0;font-size:14px;color:#888">Account Name</td><td style="padding:5px 0;font-size:14px;color:#fff;font-weight:600">${process.env.STORE_ACCOUNT_NAME}</td></tr>
          <tr><td style="padding:5px 0;font-size:14px;color:#888">Sort Code</td><td style="padding:5px 0;font-size:14px;color:#fff;font-weight:600">04-00-03</td></tr>
          <tr><td style="padding:5px 0;font-size:14px;color:#888">Expected Amount</td><td style="padding:5px 0;font-size:18px;color:#c9a96e;font-weight:700">${formatPounds(order.subtotal + order.deliveryFee / 100)}</td></tr>
          <tr>
            <td style="padding:5px 0;font-size:14px;color:#888">Reference</td>
            <td style="padding:5px 0"><span style="background:#c9a96e;color:#1a1a1a;font-family:monospace;font-size:13px;font-weight:700;padding:4px 10px;border-radius:6px">${order.orderNumber}</span></td>
          </tr>
        </table>
      </div>

      <!-- Customer -->
      <p style="margin:0 0 12px;font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#888">Customer</p>
      <div style="background:#f5f0ea;border-radius:10px;padding:16px 20px;margin-bottom:28px">
        <p style="margin:0 0 6px;font-size:14px;color:#1a1a1a"><strong>Name:</strong> ${order.customerName}</p>
        <p style="margin:0;font-size:14px;color:#1a1a1a"><strong>Email:</strong> ${order.customerEmail}</p>
      </div>

      <!-- Items -->
      <p style="margin:0 0 4px;font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#888">Order Items</p>
      ${itemsToHtml(order.items)}

      <!-- Totals -->
      <table style="width:100%;margin:0 0 28px;border-collapse:collapse">
        <tr>
          <td style="padding:8px 0;font-size:14px;color:#666;border-bottom:1px solid #f0ede8">Subtotal</td>
          <td style="padding:8px 0;font-size:14px;color:#666;text-align:right;border-bottom:1px solid #f0ede8">${formatPounds(order.subtotal)}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;font-size:14px;color:#666;border-bottom:1px solid #f0ede8">Delivery Fee</td>
          <td style="padding:8px 0;font-size:14px;color:#666;text-align:right;border-bottom:1px solid #f0ede8">${formatPence(order.deliveryFee)}</td>
        </tr>
        <tr>
          <td style="padding:14px 0 0;font-size:18px;font-weight:700;color:#1a1a1a">Total</td>
          <td style="padding:14px 0 0;font-size:18px;font-weight:700;color:#1a1a1a;text-align:right">${formatPounds(order.subtotal + order.deliveryFee / 100)}</td>
        </tr>
      </table>

      <!-- Expiry warning -->
      <div style="background:#fff5f5;border:1px solid #fcc;border-radius:10px;padding:14px 20px;margin-bottom:24px">
        <p style="margin:0;font-size:14px;font-weight:600;color:#c0392b">⚠️ This order expires in 30 minutes — confirm payment before then or it will be auto-cancelled.</p>
      </div>

      <!-- CTA -->
      <div style="text-align:center">
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/orders"
           style="display:inline-block;background:#1a1a1a;color:#c9a96e;text-decoration:none;font-size:14px;font-weight:700;padding:14px 32px;border-radius:8px;letter-spacing:0.5px">
          View Order in Dashboard →
        </a>
      </div>
    `),
  });
}

// ─── Forgot password ─────────────────────────────────────────────

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/admin/reset-password?token=${token}`;

  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to: email,
    subject: "Reset your password — Kiki African Taste",
    html: emailBase(`
      <h2 style="margin:0 0 8px;font-size:22px;color:#1a1a1a;font-weight:700">Reset Your Password</h2>
      <p style="margin:0 0 28px;font-size:15px;color:#555;line-height:1.6">
        Click the button below to set a new password. This link expires in <strong>15 minutes</strong>.
      </p>

      <div style="text-align:center;margin:32px 0">
        <a href="${resetUrl}"
           style="display:inline-block;background:#1a1a1a;color:#c9a96e;text-decoration:none;font-size:14px;font-weight:700;padding:14px 32px;border-radius:8px;letter-spacing:0.5px">
          Reset Password →
        </a>
      </div>

      <p style="margin:0;font-size:13px;color:#888;text-align:center">
        If you didn't request this, you can safely ignore this email.
      </p>
    `),
  });
}