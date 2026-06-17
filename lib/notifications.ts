import { Resend } from "resend";

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

function itemsToText(items: OrderItemDetail[]): string {
  return items
    .map((i) => {
      const qty =
        i.pricingType === "PER_KG"
          ? `${i.weightKg! * 1000}g`
          : `x${i.quantity}`;
      return `- ${i.productName} (${qty}) — ${formatPrice(i.subtotal)}`;
    })
    .join("\n");
}

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

// ─── Order placed — payment instructions ──────────────────────

export async function sendPaymentDetails(order: {
  orderNumber: string;
  customerName: string;
  customerEmail: string | null;
  customerWhatsapp: string;
  total: number;
  expiresAt: Date;
  items: OrderItemDetail[];
}) {
  const itemsText = itemsToText(order.items);

  const whatsappText = `
Hi ${order.customerName}, thanks for your order!

ORDER #${order.orderNumber}

${itemsText}

Total: ${formatPrice(order.total)}
Deadline: Pay before ${order.expiresAt.toLocaleTimeString()} or this order will be cancelled.

Bank: ${process.env.STORE_BANK_NAME}
Account Number: ${process.env.STORE_ACCOUNT_NUMBER}
Account Name: ${process.env.STORE_ACCOUNT_NAME}

Use "${order.orderNumber}" as your transfer reference.
  `.trim();

  if (order.customerWhatsapp) {
    await sendWhatsApp(order.customerWhatsapp, whatsappText);
  }

  if (order.customerEmail) {
    const html = `
      <h2>Hi ${order.customerName}, thanks for your order!</h2>
      <h3>Order: ${order.orderNumber}</h3>
      ${itemsToHtml(order.items)}
      <h3>Total: ${formatPrice(order.total)}</h3>

      <h3>Bank Transfer Details</h3>
      <p>Bank: <strong>${process.env.STORE_BANK_NAME}</strong></p>
      <p>Account Number: <strong>${process.env.STORE_ACCOUNT_NUMBER}</strong></p>
      <p>Account Name: <strong>${process.env.STORE_ACCOUNT_NAME}</strong></p>
      <p>Reference: <strong>${order.orderNumber}</strong></p>

      <p>⚠️ Pay before <strong>${order.expiresAt.toLocaleTimeString()}</strong> or your order will be cancelled.</p>
    `;

    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: order.customerEmail,
      subject: `Payment details for order ${order.orderNumber}`,
      html,
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
  const itemsText = itemsToText(order.items);

  const whatsappText = `
Hi ${order.customerName}, your order has been confirmed! 🎉

ORDER #${order.orderNumber}

${itemsText}

Total paid: ${formatPrice(order.total)}

We'll begin processing your delivery shortly.
  `.trim();

  if (order.customerWhatsapp) {
    await sendWhatsApp(order.customerWhatsapp, whatsappText);
  }

  if (order.customerEmail) {
    const html = `
      <h2>Your order has been confirmed! 🎉</h2>
      <p>Hi ${order.customerName}, we have received your payment.</p>
      <h3>Order: ${order.orderNumber}</h3>
      ${itemsToHtml(order.items)}
      <h3>Total: ${formatPrice(order.total)}</h3>
      <p>We will begin processing your delivery shortly.</p>
    `;

    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: order.customerEmail,
      subject: `Order ${order.orderNumber} confirmed!`,
      html,
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
  const text = `Hi ${order.customerName}, your order ${order.orderNumber} has been cancelled because no payment was received within 45 minutes. You're welcome to place a new order anytime.`;

  if (order.customerWhatsapp) {
    await sendWhatsApp(order.customerWhatsapp, text);
  }

  if (order.customerEmail) {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: order.customerEmail,
      subject: `Order ${order.orderNumber} cancelled`,
      html: `<p>${text}</p>`,
    });
  }
}

// ─── New order alert to admin ───────────────────────────────────

export async function sendNewOrderAlert(order: {
  orderNumber: string;
  customerName: string;
  customerWhatsapp: string;
  total: number;
  items: OrderItemDetail[];
}) {
  const itemsText = itemsToText(order.items);

  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to: process.env.ADMIN_EMAIL!,
    subject: `New order: ${order.orderNumber} — ${formatPrice(order.total)}`,
    html: `
      <h2>New order received</h2>
      <p>Order: <strong>${order.orderNumber}</strong></p>
      <p>Customer: <strong>${order.customerName}</strong></p>
      <p>WhatsApp: <strong>${order.customerWhatsapp}</strong></p>
      ${itemsToHtml(order.items)}
      <p>Total: <strong>${formatPrice(order.total)}</strong></p>
    `,
  });
}

// ─── Forgot password ─────────────────────────────────────────────

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/admin/reset-password?token=${token}`;

  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to: email,
    subject: "Reset your password",
    html: `
      <h2>Password Reset</h2>
      <p>Click the link below to set a new password.</p>
      <p><a href="${resetUrl}">Reset Password</a></p>
      <p>This link expires in <strong>15 minutes</strong>.</p>
    `,
  });
}

// ─── WhatsApp sender (shared) ─────────────────────────────────────

async function sendWhatsApp(to: string, message: string) {
  const phone = to.replace(/\D/g, "");
  const url = `https://graph.facebook.com/v19.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to: phone,
      type: "text",
      text: { body: message },
    }),
  });

  if (!res.ok) {
    const errorBody = await res.text();
    console.error("WhatsApp send failed:", res.status, errorBody);
  }
}
