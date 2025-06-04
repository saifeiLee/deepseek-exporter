import { MESSAGE, LOCAL_RELOAD_SOCKET_URL } from "../constant";
import MessageInterpreter from "../interpreter";

interface InitClientOptions {
  id: string;
  onUpdate: () => void;
}

export default function initClient({ id, onUpdate }: InitClientOptions) {
  const ws = new WebSocket(LOCAL_RELOAD_SOCKET_URL);

  ws.onopen = () => {
    ws.addEventListener("message", (event) => {
      const message = MessageInterpreter.receive(event.data);

      if (message.type === MESSAGE.DO_UPDATE && message.id === id) {
        onUpdate();
        ws.send(MessageInterpreter.send({ type: MESSAGE.DONE_UPDATE, id }));
        return;
      }
    });
  };
}
