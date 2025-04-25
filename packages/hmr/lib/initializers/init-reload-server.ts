import type { WebSocket } from "ws";
import { WebSocketServer } from "ws";
import {
  MESSAGE,
  LOCAL_RELOAD_SOCKET_PORT,
  LOCAL_RELOAD_SOCKET_URL,
} from "lib/constant";
import MessageInterpreter from "lib/interpreter";

const clientsThatNeedToUpdate: Set<WebSocket> = new Set();

function initReloadServer() {
  const wss = new WebSocketServer({ port: LOCAL_RELOAD_SOCKET_PORT });

  wss.on("listening", () => {
    console.log(`[HMR] Server listening at ${LOCAL_RELOAD_SOCKET_URL}`);
  });

  wss.on("connection", (ws) => {
    clientsThatNeedToUpdate.add(ws);
    ws.addEventListener("close", () => {
      clientsThatNeedToUpdate.delete(ws);
    });

    ws.addEventListener("message", (event) => {
      if (typeof event.data !== "string") return;

      const message = MessageInterpreter.receive(event.data);

      if (message.type === MESSAGE.DO_UPDATE) {
        // 客户端会执行页面刷新，所以需要关闭连接
        ws.close();
      }

      if (message.type === MESSAGE.BUILD_COMPLETE) {
        clientsThatNeedToUpdate.forEach((ws: WebSocket) => {
          ws.send(
            MessageInterpreter.send({
              type: MESSAGE.DONE_UPDATE,
              id: message.id,
            })
          );
        });
      }
    });
  });
}
