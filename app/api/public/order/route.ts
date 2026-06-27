import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, err } from "@/lib/api";
import { sendPaymentDetails, sendNewOrderAlert } from "@/lib/notifications";
import { z } from "zod";
import { calculateDeliveryFee } from "@/lib/format";
import { generateOrderNumber } from "@/lib/generator";

type TX = Parameters<Parameters<typeof prisma.$transaction>[0]>[0];

const itemSchema = z.discriminatedUnion("pricingType", [
  z.object({
    productId: z.string(),
    pricingType: z.literal("FIXED"),
    quantity: z.number().int().positive(),
  }),
  z.object({
    productId: z.string(),
    pricingType: z.literal("PER_KG"),
    weightKg: z.number().positive(),
  }),
]);

const schema = z.object({
  customerName: z.string().min(1),
  customerEmail: z.string().email().or(z.literal("")),
  customerWhatsapp: z.string().min(10).optional(),
  deliveryAddress: z.string().min(1),
  deliveryPostCode: z.string().min(1),
  deliveryState: z.string().min(1),
  notes: z.string().optional(),
  items: z.array(itemSchema).min(1),
  // no deliveryFee field — backend calculates this, never trusts the client
});

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return err(parsed.error.issues[0].message);

  const { items, customerEmail, ...customerData } = parsed.data;

  // Fetch and validate real products
  const productIds = items.map((i) => i.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds }, isActive: true },
  });

  if (products.length !== productIds.length)
    return err("One or more products are unavailable");

  // Validate stock and weight rules per item
  for (const item of items) {
    const product = products.find((p) => p.id === item.productId)!;

    if (item.pricingType === "FIXED") {
      if ((product.stockQty ?? 0) < item.quantity)
        return err(`Not enough stock for ${product.name}`);
    }

    if (item.pricingType === "PER_KG") {
      if (item.weightKg < product.minWeightKg!)
        return err(
          `Minimum order for ${product.name} is ${product.minWeightKg! * 1000}g`,
        );

      const steps = item.weightKg / product.stepWeightKg!;
      if (Math.abs(steps - Math.round(steps)) > 0.001)
        return err(`Invalid weight for ${product.name}`);

      if ((product.stockKg ?? 0) < item.weightKg)
        return err(`Not enough stock for ${product.name}`);
    }
  }

  // Calculate prices from the database, never from the client
  const orderItems = items.map((item) => {
    const product = products.find((p) => p.id === item.productId)!;

    if (item.pricingType === "FIXED") {
      const unitPrice = product.price!;
      return {
        productId: item.productId,
        pricingType: "FIXED" as const,
        quantity: item.quantity,
        weightKg: null,
        unitPrice,
        subtotal: unitPrice * item.quantity,
      };
    }

    const unitPrice = product.pricePerKg!;
    return {
      productId: item.productId,
      pricingType: "PER_KG" as const,
      quantity: null,
      weightKg: item.weightKg,
      unitPrice,
      subtotal: Math.round(unitPrice * item.weightKg),
    };
  });

  const subtotal = orderItems.reduce((sum, i) => sum + i.subtotal, 0);

  // Delivery fee — calculated server-side, based on total PER_KG weight
  const totalWeightKg = items
    .filter((i) => i.pricingType === "PER_KG")
    .reduce((sum, i) => sum + i.weightKg, 0);

  const deliveryFee = calculateDeliveryFee(totalWeightKg);
  const total = subtotal + deliveryFee;

  const orderNumber = await generateOrderNumber();
  const expiresAt = new Date(Date.now() + 45 * 60 * 1000);

  // Save everything in one transaction
  const order = await prisma.$transaction(async (tx: TX) => {
    const created = await tx.order.create({
      data: {
        orderNumber,
        customerName: customerData.customerName,
        customerEmail: customerEmail,
        customerWhatsapp: customerData.customerWhatsapp || "",
        deliveryAddress: customerData.deliveryAddress,
        deliveryCity: customerData.deliveryPostCode,
        deliveryState: customerData.deliveryState,
        notes: customerData.notes,
        subtotal,
        deliveryFee,
        total,
        expiresAt,
        items: { create: orderItems },
      },
      include: {
        items: { include: { product: true } },
      },
    });

    for (const item of items) {
      if (item.pricingType === "FIXED") {
        await tx.product.update({
          where: { id: item.productId },
          data: { stockQty: { decrement: item.quantity } },
        });
      } else {
        await tx.product.update({
          where: { id: item.productId },
          data: { stockKg: { decrement: item.weightKg } },
        });
      }
    }

    return created;
  });

  // Notify — non-blocking
  sendPaymentDetails({
    orderNumber: order.orderNumber,
    customerName: order.customerName,
    customerEmail: order.customerEmail,
    customerWhatsapp: order.customerWhatsapp || "",
    subtotal: order.subtotal,
    deliveryFee: order.deliveryFee,
    total: order.total,
    expiresAt: order.expiresAt,
    items: order.items.map((i: any) => ({
      productName: i.product.name,
      pricingType: i.pricingType,
      quantity: i.quantity,
      weightKg: i.weightKg,
      unitPrice: i.unitPrice,
      subtotal: i.subtotal,
    })),
  }).catch(console.error);

  // call in orders route
  sendNewOrderAlert({
    orderNumber: order.orderNumber,
    customerName: order.customerName,
    customerWhatsapp: order.customerWhatsapp || "",
    customerEmail: order.customerEmail,
    subtotal: order.subtotal,
    deliveryFee: order.deliveryFee,
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

  return ok(
    {
      orderNumber: order.orderNumber,
      subtotal: order.subtotal,
      deliveryFee: order.deliveryFee,
      total: order.total,
      expiresAt: order.expiresAt,
    },
    201,
  );
}
