import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, err, requireAdmin } from "@/lib/api";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  pricingType: z.enum(["FIXED", "PER_KG"]),
  price: z.number().int().positive().optional(),
  pricePerKg: z.number().int().positive().optional(),
  stockQty: z.number().int().min(0).optional(),
  stockKg: z.number().min(0).optional(),
  minWeightKg: z.number().positive().optional(),
  stepWeightKg: z.number().positive().optional(),
  categoryId: z.string().optional(),
  isActive: z.boolean().default(false),
});

// Get Using ID
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { response } = await requireAdmin(req);
  if (response) return response;

  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
    include: { images: { orderBy: { position: "asc" } }, category: true },
  });
  if (!product) return err("Product not found", 404);
  return ok(product);
}

// Update Product by ID
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { response } = await requireAdmin(req);
  if (response) return response;

  const { id } = await params;

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return err(parsed.error.issues[0].message);

  const product = await prisma.product.update({
    where: { id },
    data: parsed.data,
    include: { images: { orderBy: { position: "asc" } }, category: true },
  });
  return ok(product);
}

// Delete Product by ID
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { response } = await requireAdmin(req);
  if (response) return response;

  const { id } = await params;

  await prisma.product.delete({
    where: { id },
  });

  return ok({ deleted: true });
}
