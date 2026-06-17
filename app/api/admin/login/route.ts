import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signToken, setAuthCookie } from "@/lib/auth";
import { ok, err } from "@/lib/api";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return err("Invalid input");

  const { email, password } = parsed.data;

  const admin = await prisma.admin.findUnique({ where: { email } });
  if (!admin) return err("Invalid credentials", 401);

  const valid = await bcrypt.compare(password, admin.passwordHash);
  if (!valid) return err("Invalid credentials", 401);

  const token = await signToken({ adminId: admin.id, email: admin.email });
  await setAuthCookie(token);

  return ok({ email: admin.email });
}
