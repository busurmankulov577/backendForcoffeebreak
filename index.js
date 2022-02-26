const express = require("express");
const {createServer} = require("http");
const {Server} = require("socket.io");


const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const userInQueue = [];
const users = []

io.on("connection", (socket) => {
  const user_id = socket.handshake.query.user_id
  const user_email = socket.handshake.query.user_email

  users.push({user_id, user_email, socket})
  socket.on('toQueue',() => {
    if(userInQueue.some(elem => elem.user_id === user_id)) {
      return

    }
    userInQueue.push({user_id,user_email})
    io.emit('userInQueue',userInQueue);
  })
  socket.on('userInQueue', () => {
    socket.emit("userInQueue",userInQueue);
  })
});


httpServer.listen(3000, "127.0.0.1");
