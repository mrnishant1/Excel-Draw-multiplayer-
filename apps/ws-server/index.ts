import { WebSocket, WebSocketServer } from "ws";

interface Users {
  ws: WebSocket;
}

let Users: Users[] = [];

const wss = new WebSocketServer({ port: 8080 });
//for now anyone can join server
wss.on("connection", function connection(ws) {
  //store every user that comes
  Users.push({ ws });
  ws.on("message", (data) => {
    const stringData = data.toString();

    Users = Users.filter((user) => {
      // Remove if socket is closed
      if (user.ws.readyState !== WebSocket.OPEN) return false;

      // Don't send back to sender
      if (user.ws !== ws) {
        user.ws.send(stringData);
      }

      return true; // Keep the user
    });
  });
}
);
