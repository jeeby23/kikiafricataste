import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, err, requireAdmin } from "@/lib/api";
import { deleteImage } from "@/lib/cloudinary";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; imageId: string }> },
) {
  const { response } = await requireAdmin(req);
  if (response) return response;

  const { id, imageId } = await params;

  const image = await prisma.productImage.findUnique({
    where: { id: imageId },
  });
  if (!image) return err("Image not found", 404);

  await deleteImage(image.publicId);
  await prisma.productImage.delete({ where: { id: imageId } });

  if (image.isPrimary) {
    const next = await prisma.productImage.findFirst({
      where: { productId: id },
      orderBy: { position: "asc" },
    });
    if (next) {
      await prisma.productImage.update({
        where: { id: next.id },
        data: { isPrimary: true },
      });
    }
  }

  return ok({ deleted: true });
}
