import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, err } from "@/lib/api";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const { searchParams } = new URL(req.url);
  const limit = parseInt(searchParams.get("limit") ?? "4");

  const product = await prisma.product.findUnique({
    where: { slug, isActive: true },
    select: { id: true, categoryId: true },
  });
  if (!product) return err("Product not found", 404);

  const related = await prisma.product.findMany({
    where: {
      isActive: true,
      id: { not: product.id },
      categoryId: product.categoryId ?? undefined,
    },
    include: {
      images: { where: { isPrimary: true }, take: 1 },
      category: true,
    },
    take: limit,
    orderBy: { createdAt: "desc" },
  });

  // if not enough in same category, fill with other products
  if (related.length < limit) {
    const extra = await prisma.product.findMany({
      where: {
        isActive: true,
        id: { notIn: [product.id, ...related.map((p: any) => p.id)] },
      },
      include: {
        images: { where: { isPrimary: true }, take: 1 },
        category: true,
      },
      take: limit - related.length,
      orderBy: { createdAt: "desc" },
    });
    related.push(...extra);
  }

  return ok(related);
}
