// migrate.ts
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import { env } from "@/env.mjs";

const sql = postgres(env.DATABASE_URL, { max: 1 });
const db = drizzle(sql);

async function main() {
  console.log("Migration started");
  await migrate(db, { migrationsFolder: "./drizzle" });
  console.log("Migration completed");
  process.exit(0);
}

main().catch((err) => {
  console.error("Migration failed");
  console.error(err);
  process.exit(1);
});
