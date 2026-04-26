import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  earlyAccess: true,
  schema: "prisma/schema.prisma",
  datasource: {
    url: env("DATABASE_URL"),
  },
  migrate: {
    async adapter() {
      const url = process.env.DATABASE_URL;
      if (!url) {
        throw new Error("DATABASE_URL is required for migrations.");
      }
      const { default: pg } = await import("pg");
      const { PrismaPg } = await import("@prisma/adapter-pg");
      const pool = new pg.Pool({ connectionString: url });
      return new PrismaPg(pool);
    },
  },
});
