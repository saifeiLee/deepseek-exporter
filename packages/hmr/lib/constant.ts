export const LOCAL_RELOAD_SOCKET_PORT = 8081;
export const LOCAL_RELOAD_SOCKET_URL = `ws://localhost:${LOCAL_RELOAD_SOCKET_PORT}`;

export const MESSAGE = {
  DO_UPDATE: "do_update",
  DONE_UPDATE: "done_update",
  BUILD_COMPLETE: "build_complete",
} as const;

