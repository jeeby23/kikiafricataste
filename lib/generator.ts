import { prisma } from "./prisma";

export async function generateOrderNumber(): Promise<string> {
  // keep trying until we find a number that doesn't exist
  let attempts = 0;

  while (attempts < 10) {
    const last = await prisma.order.findFirst({
      orderBy: { orderNumber: "desc" },
      select: { orderNumber: true },
    });

    if (!last) return "ORD-0001";

    const num = parseInt(last.orderNumber.replace("ORD-", ""), 10);

    if (isNaN(num)) {
      attempts++;
      continue;
    }

    const next = `ORD-${String(num + 1).padStart(4, "0")}`;

    const existing = await prisma.order.findUnique({
      where: { orderNumber: next },
    });

    if (!existing) return next;

    attempts++;
  }

  // fallback
  return `ORD-${Date.now().toString().slice(-6)}`;
}
