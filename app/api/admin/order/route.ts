import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, requireAdmin } from "@/lib/api";
import { cancelExpiredOrders } from "@/lib/cancel-expired-orders";

export async function GET(req: NextRequest) {
  const { response } = await requireAdmin(req);
  if (response) return response;

  // safety net — catches anything cron-job.org missed
  await cancelExpiredOrders();

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") as
    | "PENDING_PAYMENT"
    | "CONFIRMED"
    | "CANCELLED"
    | null;
  const search = searchParams.get("search") ?? "";
  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = parseInt(searchParams.get("limit") ?? "20");
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const where: any = {};
  if (status) where.status = status;
  if (search) {
    where.OR = [
      { orderNumber: { contains: search, mode: "insensitive" } },
      { customerName: { contains: search, mode: "insensitive" } },
    ];
  }
  if (from || to) {
    where.createdAt = {};
    if (from) where.createdAt.gte = new Date(from);
    if (to) {
      const toDate = new Date(to);
      toDate.setHours(23, 59, 59, 999);
      where.createdAt.lte = toDate;
    }
  }

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.order.count({ where }),
  ]);

  return ok({ orders, total, page, limit });
}
