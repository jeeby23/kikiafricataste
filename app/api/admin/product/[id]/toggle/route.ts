import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, err, requireAdmin } from "@/lib/api";

// Toggle product availability
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const { response } = await requireAdmin(req);
  if (response) return response;

  const product = await prisma.product.findUnique({ where: { id: params.id } });
  if (!product) return err("Product not found", 404);

  const updated = await prisma.product.update({
    where: { id: params.id },
    data: { isActive: !product.isActive },
  });
  return ok({ isActive: updated.isActive });
}
