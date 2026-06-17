import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, err, requireAdmin } from "@/lib/api";
import { slugify } from "@/lib/slug";
import { z } from "zod";

const schema = z.object({ name: z.string().min(1) });

// Get all category
export async function GET(req: NextRequest) {
  const { response } = await requireAdmin(req);
  if (response) return response;

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: { select: { products: true } },
    },
  });
  return ok(categories);
}

// Create a new category
export async function POST(req: NextRequest) {
  const { response } = await requireAdmin(req);
  if (response) return response;

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return err("Name is required");

  const slug = slugify(parsed.data.name);
  const existing = await prisma.category.findUnique({ where: { slug } });
  if (existing) return err("Category already exists");

  const category = await prisma.category.create({
    data: { name: parsed.data.name, slug },
  });
  return ok(category, 201);
}
