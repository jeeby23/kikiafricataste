import { prisma } from "@/lib/prisma";
import { ok } from "@/lib/api";

// Get all categories
export async function GET() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: { select: { products: { where: { isActive: true } } } },
    },
  });
  return ok(categories);
}
