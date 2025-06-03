import { WebSocketMessage } from "lib/types";

export default class MessageInterpreter {
  private constructor() {}

  static send(message: WebSocketMessage): string {
    return JSON.stringify(message);
  }

  static receive(message: string): WebSocketMessage {
    return JSON.parse(message);
  }
}
