import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const defaultUrl = "postgres://lab:lab@127.0.0.1:5499/lab";

export function createDb(url = process.env.DATABASE_URL ?? defaultUrl) {
  const client = postgres(url);
  return drizzle(client, { schema });
}

export type Database = PostgresJsDatabase<typeof schema>;

export function databaseUrl() {
  return process.env.DATABASE_URL ?? defaultUrl;
}
