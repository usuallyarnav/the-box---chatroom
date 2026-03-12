import express from "express"; //imports the Express framework, which is used to create a web server and handle HTTP requests and responses
import http from "http";
import { Server } from "socket.io";
const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

io.on("connection", (socket) => { //detects when a user connects to the server and sets up event listeners for that user
  console.log("A user connected");

  socket.on("chat message", (msg) => { //listens for "chat message" events 
    io.emit("chat message", msg);
  });
});

server.listen(3000, () => { //starts the server on port 3000
  console.log("Server running on http://localhost:3000");
});