import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, err } from "@/lib/api";
import bcrypt from "bcryptjs";
import { z } from "zod";

const schema = z.object({
  token: z.string().min(1),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return err(parsed.error.issues[0].message);

  const { token, password } = parsed.data;

  const resetToken = await prisma.passwordResetToken.findUnique({
    where: { token },
    include: { admin: true },
  });

  if (!resetToken) return err("Invalid or expired reset link", 400);

  if (resetToken.expiresAt < new Date())
    return err("Reset link has expired, please request a new one", 400);

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.$transaction([
    prisma.admin.update({
      where: { id: resetToken.adminId },
      data: { passwordHash },
    }),
    prisma.passwordResetToken.delete({
      where: { token },
    }),
  ]);

  return ok({ message: "Password updated successfully" });
}
