import express from "express";
import dotenv from "dotenv";
dotenv.config();
import path from "path";
import connectDb from "./config/db.js";
import colors from "colors";
import router from "./routes/userRoute.js";
import { notFound, otherErrorHandler } from "./middleware/errorHandling.js";
import cors from "cors";
import chatrouter from "./routes/chatRoute.js";
import messageRoute from "./routes/messageRoute.js";
const PORT = process.env.PORT || 8000;
import { Server } from "socket.io";

connectDb();
const app = express();

app.use(express.json());
app.use(express.static(path.resolve("./public")));
app.use(express.urlencoded({ extended: false }));

app.use(cors());
app.use("/api/user", router);
app.use("/api/chat", chatrouter);
app.use("/api/message", messageRoute);

app.use(notFound);
app.use(otherErrorHandler);

const server = app.listen(PORT, () => {
  console.log(`server started at port ${PORT}`.yellow.bold);
});

const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT"],
  },
});

io.on("connection", (socket) => {
  console.log(`connected to socket.io`);
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log(`joind the room : ${room}`);
  });
  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageReceived) => {
    let chat = newMessageReceived.chat;

    if (!chat.users) return console.log(`chat.users are not defined`);
    chat.users.forEach((user) => {
      if (user._id === newMessageReceived.sender._id) return;

      socket.in(user._id).emit("message received", newMessageReceived);
    });
  });

  socket.off("setup", () => {
    console.log("user disconnected");
    console.log(userData.name);
    socket.leave(userData._id);
  });
});
