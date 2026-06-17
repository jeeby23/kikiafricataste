import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, err, requireAdmin } from "@/lib/api";
import { uploadImage } from "@/lib/cloudinary";

// Add Product image
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { response } = await requireAdmin(req);
  if (response) return response;

  const { id } = await params;

  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) return err("Product not found", 404);

  const formData = await req.formData();
  const file = formData.get("image") as File | null;
  if (!file) return err("No image provided");

  const allowed = ["image/jpeg", "image/png", "image/webp"];
  if (!allowed.includes(file.type))
    return err("Only JPEG, PNG or WebP allowed");
  if (file.size > 5 * 1024 * 1024) return err("Max file size is 5MB");

  const buffer = Buffer.from(await file.arrayBuffer());
  const { url, publicId } = await uploadImage(buffer, `product/${id}`);

  const existingCount = await prisma.productImage.count({
    where: { productId: id },
  });

  const image = await prisma.productImage.create({
    data: {
      productId: id,
      url,
      publicId,
      altText: (formData.get("altText") as string) ?? product.name,
      position: existingCount,
      isPrimary: existingCount === 0,
    },
  });

  return ok(image, 201);
}

// Update product image
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { response } = await requireAdmin(req);
  if (response) return response;

  const { id } = await params;

  const { orderedIds } = await req.json();
  if (!Array.isArray(orderedIds)) return err("orderedIds must be an array");

  await Promise.all(
    orderedIds.map((id: string, index: number) =>
      prisma.productImage.update({
        where: { id: id },
        data: { position: index, isPrimary: index === 0 },
      }),
    ),
  );

  return ok({ reordered: true });
}
