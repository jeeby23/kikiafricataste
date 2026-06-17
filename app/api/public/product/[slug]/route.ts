import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, err } from "@/lib/api";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const product = await prisma.product.findUnique({
    where: { slug: (await params).slug, isActive: true },
    include: {
      images: { orderBy: { position: "asc" } },
      category: true,
    },
  });

  if (!product) return err("Product not found", 404);
  return ok(product);
}
