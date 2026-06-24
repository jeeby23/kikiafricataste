import { NextRequest } from "next/server";
import { ok, err } from "@/lib/api";
import { cancelExpiredOrders } from "@/lib/cancel-expired-orders";

export async function GET(req: NextRequest) {
  const secret = req.headers.get("x-cron-secret");
  if (secret !== process.env.CRON_SECRET) return err("Forbidden", 403);

  const cancelled = await cancelExpiredOrders();
  return ok({ cancelled });
}
