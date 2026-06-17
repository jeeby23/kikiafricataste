import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, err, requireAdmin } from "@/lib/api";
import { slugify } from "@/lib/slug";
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

export async function GET(req: NextRequest) {
  const { response } = await requireAdmin(req);
  if (response) return response;

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = parseInt(searchParams.get("limit") ?? "20");
  const search = searchParams.get("search") ?? "";

  const where = search
    ? { name: { contains: search, mode: "insensitive" as const } }
    : {};

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        images: { where: { isPrimary: true }, take: 1 },
        category: true,
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.product.count({ where }),
  ]);

  return ok({ products, total, page, limit });
}

// Create a product
export async function POST(req: NextRequest) {
  const { response } = await requireAdmin(req);
  if (response) return response;

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return err(parsed.error.issues[0].message);

  const { pricingType, price, pricePerKg, stockQty, stockKg } = parsed.data;

  if (pricingType === "FIXED" && !price)
    return err("Price is required for fixed products");
  if (pricingType === "PER_KG" && !pricePerKg)
    return err("Price per kg is required for per-kg products");

  let slug = slugify(parsed.data.name);
  const existing = await prisma.product.findUnique({ where: { slug } });
  if (existing) slug = `${slug}-${Date.now()}`;

  const product = await prisma.product.create({
    data: {
      name: parsed.data.name,
      slug,
      description: parsed.data.description,
      pricingType,
      price: pricingType === "FIXED" ? price : null,
      pricePerKg: pricingType === "PER_KG" ? pricePerKg : null,
      stockQty: pricingType === "FIXED" ? (stockQty ?? 0) : null,
      stockKg: pricingType === "PER_KG" ? (stockKg ?? 0) : null,
      minWeightKg:
        pricingType === "PER_KG" ? (parsed.data.minWeightKg ?? 0.25) : 0,
      stepWeightKg:
        pricingType === "PER_KG" ? (parsed.data.stepWeightKg ?? 0.25) : 0,
      categoryId: parsed.data.categoryId,
      isActive: parsed.data.isActive,
    },
    include: { images: true, category: true },
  });

  return ok(product, 201);
}
