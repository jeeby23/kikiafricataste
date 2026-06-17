import { prisma } from "./prisma";

export async function generateOrderNumber(): Promise<string> {
  const last = await prisma.order.findFirst({
    orderBy: { createdAt: "desc" },
    select: { orderNumber: true },
  });

  if (!last) return "ORD-0001";

  const num = parseInt(last.orderNumber.replace("ORD-", ""), 10);
  return `ORD-${String(num + 1).padStart(4, "0")}`;
}
