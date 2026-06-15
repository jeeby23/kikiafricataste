import path from "path";
import { defineConfig } from "prisma/config";
import * as dotenv from "dotenv";

dotenv.config();

export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),
  datasource: {
    url: process.env.DATABASE_URL!,
  },
  // @ts-expect-error <"">
  migrate: {
    async adapter() {
      const { PrismaNeon } = await import("@prisma/adapter-neon");
      return new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
    },
  },
});
