import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, err, requireAdmin } from "@/lib/api";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const { response } = await requireAdmin(req);
  if (response) return response;

  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: {
      items: {
        include: {
          product: {
            include: { images: { where: { isPrimary: true }, take: 1 } },
          },
        },
      },
    },
  });

  if (!order) return err("Order not found", 404);
  return ok(order);
}
