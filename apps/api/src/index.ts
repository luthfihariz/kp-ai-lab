import "./instrument";
import { serve } from "@hono/node-server";
import { createDb } from "@kp/db";
import { createApp, resolveToday } from "./app";

const today = resolveToday();
const app = createApp(createDb(), today);

serve({ fetch: app.fetch, port: 8080 }, () => {
  console.info("server started", { addr: "http://localhost:8080", today });
});
