import fs from "node:fs";
import path from "node:path";
import type { Plugin, PluginOption } from "vite";
import { WebSocket } from "ws";
import MessageInterpreter from "../interpreter";
import { MESSAGE, LOCAL_RELOAD_SOCKET_URL } from "../constant";
import type { PluginConfig } from "../types";

const injectionsPath = path.resolve(
  __dirname,
  "..",
  "..",
  "..",
  "build",
  "injections"
);

const refreshCode = fs.readFileSync(
  path.resolve(injectionsPath, "refresh.js"),
  "utf-8"
);
const reloadCode = fs.readFileSync(
  path.resolve(injectionsPath, "reload.js"),
  "utf-8"
);

export function watchRebuildPlugin(config: PluginConfig): PluginOption {
  let ws: WebSocket | null = null;

  const id = Math.random().toString(36);
  let reconnectTries = 0;

  const { refresh, reload } = config;
  const hmrCode = (refresh ? refreshCode : "") + (reload ? reloadCode : "");

  function initializeWebsocket() {
    ws = new WebSocket(LOCAL_RELOAD_SOCKET_URL);

    ws.onopen = () => {
      console.log(
        `[HMR] Connected to dev-server at ${LOCAL_RELOAD_SOCKET_URL}`
      );
    };

    ws.onerror = () => {
      console.log(
        `[HMR] Failed to connect server at ${LOCAL_RELOAD_SOCKET_URL}`
      );
      console.warn("Retrying in 3 seconds...");
      ws = null;

      if (reconnectTries <= 2) {
        setTimeout(() => {
          reconnectTries++;
          initializeWebsocket();
        }, 3_000);
      } else {
        console.error(
          `[HMR] Cannot establish connection to server at ${LOCAL_RELOAD_SOCKET_URL}`
        );
      }
    };
  }

  return {
    name: "watch-rebuild",
    writeBundle() {
      config.onStart?.();
      if (!ws) {
        initializeWebsocket();
        return;
      }
      ws.send(MessageInterpreter.send({ type: MESSAGE.BUILD_COMPLETE, id }));
    },
    generateBundle(_options, bundle) {
      for (const module of Object.values(bundle)) {
        if (module.type === "chunk") {
          module.code = `(function() {let __HMR_ID = "${id}";\n${hmrCode}\n})();\n${module.code}`;
        }
      }
    },
  };
}
