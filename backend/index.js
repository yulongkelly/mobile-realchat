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
function getRandomColor() {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// roomid: messages
room_to_messages = {};

user_to_room = {};

rooms_less_than_two_people = [];

user_to_color = {};

user_side = {};

socketIO.on("connection", (socket) => {
  console.log("connected!!");
  user_to_color[socket.id] = getRandomColor();
  socket.on("newMessage", (msg) => {
    roomid = user_to_room[socket.id];
    if (!(roomid in room_to_messages)) {
      room_to_messages[roomid] = [];
    }
    room_to_messages[roomid].push({
      id: generateID(),
      user: socket.id,
      msg: msg,
      color: user_to_color[socket.id],
      side: user_side[socket.id],
    });

    // update frontend
    socketIO.emit("sendMessage", [roomid, room_to_messages[roomid]]);
  });
  socket.on("createRoom", () => {
    if (rooms_less_than_two_people.length > 0) {
      user_side[socket.id] = "right";
      roomid = rooms_less_than_two_people.shift();
      user_to_room[socket.id] = roomid;
      socket.emit("roomid", user_to_room[socket.id]);
      console.log("emit roomcreated");
      socketIO.emit("roomCreated", user_to_room[socket.id]);
    } else {
      user_side[socket.id] = "left";
      roomid = generateID();
      rooms_less_than_two_people.push(roomid);
      user_to_room[socket.id] = roomid;
      socket.emit("roomid", user_to_room[socket.id]);
    }
  });
  socket.on("leave", (roomid) => {
    delete room_to_messages[roomid];
    msg = "user " + socket.id + " left:(";
    socket.broadcast.emit("user-left", [roomid, msg]);
  });
  socket.on("disconnect", () => {
    console.log("user");
  });
});

http.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
