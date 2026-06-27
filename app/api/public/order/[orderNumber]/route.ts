import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, err } from "@/lib/api";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ orderNumber: string }> },
) {
  const { orderNumber } = await params;

  const order = await prisma.order.findUnique({
    where: { orderNumber },
    include: {
      items: {
        include: {
          product: {
            include: {
              images: { where: { isPrimary: true }, take: 1 },
            },
          },
        },
      },
    },
  });

  if (!order) return err("Order not found", 404);

  // calculate time remaining for pending orders
  const now = new Date();
  const isExpired = order.expiresAt < now;
  const minutesRemaining = isExpired
    ? 0
    : Math.floor((order.expiresAt.getTime() - now.getTime()) / 1000 / 60);
  const secondsRemaining = isExpired
    ? 0
    : Math.floor((order.expiresAt.getTime() - now.getTime()) / 1000) % 60;

  return ok({
    orderNumber: order.orderNumber,
    status: order.status,
    customerName: order.customerName,
    customerEmail: order.customerEmail,
    deliveryAddress: order.deliveryAddress,
    deliveryCity: order.deliveryCity,
    deliveryState: order.deliveryState,
    notes: order.notes,
    subtotal: order.subtotal,
    deliveryFee: order.deliveryFee,
    total: order.total,
    expiresAt: order.expiresAt,
    confirmedAt: order.confirmedAt,
    cancelledAt: order.cancelledAt,
    createdAt: order.createdAt,
    minutesRemaining,
    secondsRemaining,
    items: order.items.map((i: any) => ({
      productName: i.product.name,
      imageUrl: i.product.images[0]?.url ?? null,
      pricingType: i.pricingType,
      quantity: i.quantity,
      weightKg: i.weightKg,
      unitPrice: i.unitPrice,
      subtotal: i.subtotal,
    })),
  });
}
