// src/entry-server.tsx
import { createMemoryHistory } from "@tanstack/react-router";
import { StartServer } from "@tanstack/start/server";
import ReactDOMServer from "react-dom/server";
import { createRouter } from "../client/router";
import "@client/index.css";
import { eventHandler, getRequestURL } from "vinxi/http";
import { getManifest } from "vinxi/manifest";

export default eventHandler(async (event) => {
  const router = createRouter();

  const clientManifest = getManifest("client");

  const clientHandler = clientManifest.inputs[clientManifest.handler];
  const scriptSrc = clientHandler.output.path;

  const url = getRequestURL(event);

  const memoryHistory = createMemoryHistory({
    initialEntries: [url.pathname],
  });

  router.update({
    history: memoryHistory,
  });

  await router.load();

  const stream = await new Promise<ReactDOMServer.PipeableStream>((resolve) => {
    const stream = ReactDOMServer.renderToPipeableStream(
      <StartServer router={router} />,
      {
        onShellReady() {
          resolve(stream);
        },
        bootstrapModules: [scriptSrc],
        bootstrapScriptContent: `window.manifest = ${JSON.stringify(
          clientManifest.json(),
        )}`,
      },
    );
  });

  event.node.res.setHeader("Content-Type", "text/html");
  event.node.res.statusCode = router.hasNotFoundMatch() ? 404 : 200;
  return stream;
});
