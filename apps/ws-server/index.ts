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
    Users.forEach((user) => {
      user.ws.send(stringData);
    });
  });
});
