import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, requireAdmin } from "@/lib/api";
import { OrderStatus } from "@prisma/client";

export async function GET(req: NextRequest) {
  const { response } = await requireAdmin(req);
  if (response) return response;

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") as OrderStatus | null;
  const search = searchParams.get("search") ?? "";
  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = parseInt(searchParams.get("limit") ?? "20");

  const where: any = {};
  if (status) where.status = status;
  if (search) {
    where.OR = [
      { orderNumber: { contains: search, mode: "insensitive" } },
      { customerName: { contains: search, mode: "insensitive" } },
      { customerWhatsapp: { contains: search } },
    ];
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
