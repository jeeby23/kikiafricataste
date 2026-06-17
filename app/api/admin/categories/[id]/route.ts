import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, err, requireAdmin } from "@/lib/api";
import { z } from "zod";

const schema = z.object({ name: z.string().min(1) });

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { response } = await requireAdmin(req);
  if (response) return response;

  const { id } = await params;

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return err("Name is required");

  const category = await prisma.category.update({
    where: { id },
    data: { name: parsed.data.name },
  });
  return ok(category);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { response } = await requireAdmin(req);
  if (response) return response;

  const { id } = await params;

  const productCount = await prisma.product.count({
    where: { categoryId: id },
  });
  if (productCount > 0)
    return err("Cannot delete category with existing products", 400);

  await prisma.category.delete({ where: { id } });
  return ok({ deleted: true });
}
