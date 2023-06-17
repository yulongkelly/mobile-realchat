const express = require("express");
const app = express();
const http = require("http").Server(app);
const cors = require("cors");
const PORT = 4000;
const socketIO = require("socket.io")(http, {
  cors: {
    origin: "http://localhost:3000",
  },
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

const generateID = () => Math.random().toString(36).substring(2, 10);
messages = [];

socketIO.on("connection", (socket) => {
  console.log("connected!!");
  socket.on("newMessage", (msg) => {
    messages.push({
      id: generateID(),
      user: socket.id,
      msg: msg,
    });
    console.log(messages);
    // update frontend
    socketIO.emit("sendMessage", messages);
  });
  socket.on("leave", () => {
    msg = "user " + socket.id + " left:(";
    socket.broadcast.emit("user-left", msg);
  });
  socket.on("disconnect", (socket) => {
    console.log("user");
    socket.disconnect();
  });
});

http.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
