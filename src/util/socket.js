import io from "socket.io-client";
import { DOMAIN } from "./service";

var socket = io(DOMAIN, {
  transports: ["websocket", "polling", "flashsocket"],
});

export default socket;
