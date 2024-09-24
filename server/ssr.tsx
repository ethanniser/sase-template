// src/entry-server.tsx
import { createMemoryHistory } from "@tanstack/react-router";
import { StartServer } from "@tanstack/start/server";
import ReactDOMServer from "react-dom/server";
import { createRouter } from "../client/router";

export async function renderSsr(url: URL) {
  const router = createRouter();

  const memoryHistory = createMemoryHistory({
    initialEntries: [url.pathname],
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
};
