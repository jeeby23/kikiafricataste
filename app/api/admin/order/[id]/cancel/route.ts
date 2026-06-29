import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, err, requireAdmin } from "@/lib/api";
import { sendOrderCancelled } from "@/lib/notifications";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { response } = await requireAdmin(req);
  if (response) return response;

  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });
  if (!order) return err("Order not found", 404);
  if (order.status === "CONFIRMED")
    return err("Cannot cancel a confirmed order");

  await prisma.$transaction(async (tx: any) => {
    await tx.order.update({
      where: { id },
      data: { status: "CANCELLED", cancelledAt: new Date() },
    });

    for (const item of order.items) {
      if (item.pricingType === "FIXED") {
        await tx.product.update({
          where: { id: item.productId },
          data: { stockQty: { increment: item.quantity! } },
        });
      } else {
        await tx.product.update({
          where: { id: item.productId },
          data: { stockKg: { increment: item.weightKg! } },
        });
      }
    }
  });

  sendOrderCancelled({
    orderNumber: order.orderNumber,
    customerName: order.customerName,
    customerEmail: order.customerEmail,
  });

  return ok({ cancelled: true });
}
