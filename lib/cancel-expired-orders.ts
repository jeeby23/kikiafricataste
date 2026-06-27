import { prisma } from "./prisma";
import { sendOrderCancelled } from "./notifications";

type TX = Parameters<Parameters<typeof prisma.$transaction>[0]>[0];

export async function cancelExpiredOrders() {
  const expired = await prisma.order.findMany({
    where: {
      status: "PENDING_PAYMENT",
      expiresAt: { lt: new Date() },
    },
    include: { items: true },
  });

  for (const order of expired) {
    await prisma.$transaction(async (tx: TX) => {
      await tx.order.update({
        where: { id: order.id },
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
      customerWhatsapp: order.customerWhatsapp || "",
    }).catch(console.error);
  }

  return expired.length;
}
