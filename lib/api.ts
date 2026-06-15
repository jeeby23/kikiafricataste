import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { verifyToken } from "./auth";

export function ok<T>(data: T, status = 200) {
  return NextResponse.json({ data, error: null }, { status });
}

export function err(message: string, status = 400) {
  return NextResponse.json({ data: null, error: message }, { status });
}

export async function requireAdmin(req: NextRequest) {
  const token = req.cookies.get("admin_token")?.value;
  if (!token) return { admin: null, response: err("Unauthorized", 401) };
  const admin = await verifyToken(token);
  if (!admin) return { admin: null, response: err("Unauthorized", 401) };
  return { admin, response: null };
}
