import { fileURLToPath } from "node:url";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import { databaseUrl } from "./client";

const client = postgres(databaseUrl(), { max: 1 });
const db = drizzle(client);

await migrate(db, { migrationsFolder: fileURLToPath(new URL("../drizzle", import.meta.url)) });
await client.end();
