import { readFileSync } from "node:fs";
import postgres from "postgres";
import { databaseUrl } from "./client";

const client = postgres(databaseUrl(), { max: 1 });
const seed = readFileSync(new URL("../../../db/seed.sql", import.meta.url), "utf8");

await client`
  TRUNCATE analytics.payoff_events, installments, loans, borrowers RESTART IDENTITY CASCADE
`;
await client.unsafe(seed);
await client.end();
