import { prisma } from "./prisma";

export async function generateOrderNumber(): Promise<string> {
  const last = await prisma.order.findFirst({
    orderBy: { createdAt: "desc" },
    select: { orderNumber: true },
  });

  const base = last
    ? parseInt(last.orderNumber.replace("ORD-", ""), 10) + 1
    : 1;

  // Random 2-digit suffix breaks ties when two requests read the same base
  const suffix = Math.floor(Math.random() * 90 + 10);
  return `ORD-${String(base).padStart(4, "0")}-${suffix}`;
}