// src/entry-server.tsx
import { createMemoryHistory } from "@tanstack/react-router";
import { StartServer } from "@tanstack/start/server";
import ReactDOMServer from "react-dom/server";
import { eventHandler, getRequestURL } from "vinxi/http";
import { createRouter } from "./router";

export default eventHandler(async (event) => {
  const router = createRouter();

  const url = getRequestURL(event).toString();

  const memoryHistory = createMemoryHistory({
    initialEntries: [url],
  });

  router.update({
    history: memoryHistory,
  });

  await router.load();

  const appHtml = ReactDOMServer.renderToString(
    <StartServer router={router} />,
  );

  return new Response(`<!DOCTYPE html>${appHtml}`, {
    headers: {
      "Content-Type": "text/html",
    },
    status: router.hasNotFoundMatch() ? 404 : 200,
  });
});
