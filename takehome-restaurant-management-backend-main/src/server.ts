import WebSocket from "ws";
import { OrderEvent, Restaurant } from "./types";
import { createServer } from "http";
import { readFileSync } from "fs";
import { resolve } from "path";

const allRestaurants: Restaurant[] = JSON.parse(
  readFileSync(resolve(__dirname, "..", "data", "restaurants.json"), "utf8")
);
const allEvents: OrderEvent[] = JSON.parse(
  readFileSync(resolve(__dirname, "..", "data", "events.json"), "utf8")
);

const server = createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");

  if (req.method == "GET" && req.url == "/restaurants") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(allRestaurants));
  } else {
    res.writeHead(404);
    res.end("Not found");
  }
});

const wss = new WebSocket.Server({ noServer: true });

wss.on("connection", (ws: WebSocket) => {
  console.log("New connection");

  const sendEvent = (event: OrderEvent) => {
    ws.send(JSON.stringify(event));
  };

  const eventsToSendBySecond = 600;
  const initialEvents = allEvents.length - eventsToSendBySecond;

  allEvents.slice(0, initialEvents).forEach((e) => sendEvent(e));

  const remainingEvents = allEvents.slice(initialEvents);

  const interval = setInterval(() => {
    if (ws.readyState == WebSocket.OPEN && remainingEvents.length > 0) {
      sendEvent(remainingEvents.shift());
    } else {
      console.log("Stop sending events");
      clearInterval(interval);
    }
  }, 1000);

  ws.on("close", () => {
    console.log("Connection closed");
    clearInterval(interval);
  });
});

server.on("upgrade", (request, socket, head) => {
  if (request.url === "/ws") {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit("connection", ws, request);
    });
  } else {
    socket.destroy();
  }
});

server.listen(8014, () => {
  console.log("Server is listening on port 8014");
});
