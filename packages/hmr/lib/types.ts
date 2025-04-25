import { MESSAGE } from "./constant";

export type MessageType = (typeof MESSAGE)[keyof typeof MESSAGE];

export type WebSocketMessage = {
  type: MessageType;
  id: string;
};

export type PluginConfig = {
  onStart?: () => void;
  reload?: boolean;
  refresh?: boolean;
};
