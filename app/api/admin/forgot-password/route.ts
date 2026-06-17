import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, err } from "@/lib/api";
import { sendPasswordResetEmail } from "@/lib/notifications";
import { z } from "zod";
import crypto from "crypto";

const schema = z.object({
  email: z.string().email(),
});

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return err("Valid email is required");

  const admin = await prisma.admin.findUnique({
    where: { email: parsed.data.email },
  });

  // always return ok even if email not found
  // prevents exposing whether an email exists
  if (!admin)
    return ok({
      message: "If that email exists you will receive a reset link",
    });

  // delete any existing tokens for this admin
  await prisma.passwordResetToken.deleteMany({
    where: { adminId: admin.id },
  });

  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

  await prisma.passwordResetToken.create({
    data: {
      adminId: admin.id,
      token,
      expiresAt,
    },
  });

  try {
    await sendPasswordResetEmail(admin.email, token);
  } catch (e) {
    console.error("Resend error:", e);
  }

  return ok({ message: "If that email exists you will receive a reset link" });
}
