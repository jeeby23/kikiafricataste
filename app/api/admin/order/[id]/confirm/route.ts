import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, err, requireAdmin } from "@/lib/api";
import { sendOrderConfirmed } from "@/lib/notifications";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { response } = await requireAdmin(req);
  if (response) return response;

  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: { include: { product: true } } },
  });
  if (!order) return err("Order not found", 404);
  if (order.status !== "PENDING_PAYMENT")
    return err("Order is not pending payment");

  const updated = await prisma.order.update({
    where: { id },
    data: { status: "CONFIRMED", confirmedAt: new Date() },
  });

  sendOrderConfirmed({
    orderNumber: order.orderNumber,
    customerName: order.customerName,
    customerEmail: order.customerEmail,
    customerWhatsapp: order.customerWhatsapp,
    total: order.total,
    items: order.items.map((i) => ({
      productName: i.product.name,
      pricingType: i.pricingType,
      quantity: i.quantity,
      weightKg: i.weightKg,
      unitPrice: i.unitPrice,
      subtotal: i.subtotal,
    })),
  }).catch(console.error);

  return ok(updated);
}
