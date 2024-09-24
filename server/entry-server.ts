import { Hono } from "hono";
import { logger } from "hono/logger";
import { eventHandler, toWebRequest } from "vinxi/http";
import { api } from "./api";
import { renderSsr } from "./ssr";

// https://h3.unjs.io/guide/event-handler
// This is the (actual) entry point, which we just redirect to the Hono server
export default eventHandler(async (event) => {
  return app.fetch(toWebRequest(event));
});

// Hono! https://hono.dev/
// This is the entry point for our server which lives on the /api path
const app = new Hono()
  .use(logger())
  .route("/api", api)
  .get("*", async (c) => {
      const url = new URL(c.req.url);
      return renderSsr(url);
  })


