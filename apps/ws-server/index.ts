import { WebSocket, WebSocketServer } from "ws";

const rooms: { [roomId: string]: WebSocket[] } = {};

const wss = new WebSocketServer({ port: 8080 });
//for now anyone can join server
wss.on("connection", (ws, requset) => {
  const url = requset.url;
  const roomId = url?.split('/')[1]?.trim();

  console.log(url);
  //store every user that comes
  if(!roomId) return;
  if (!rooms[roomId]) {
    rooms[roomId] = []; // create new room array
  }
  rooms[roomId].push(ws); // push

  console.log(rooms);
  ws.on("message", (data) => {
    const stringData = data.toString();
    // Don't send back to sender
    rooms[roomId]?.forEach((user) => {
      if (user !== ws) {
        user.send(stringData);
      }
    });
  });
});
