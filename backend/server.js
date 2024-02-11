const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const colors = require("colors");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const authRoutes = require("./routes/authRoutes");
const forgetRouthes = require("./routes/ForgetRothes");
const announcementRoute = require("./routes/announcementRoutes");
const reportRoute = require("./routes/reportRoute");
const User = require("./models/userModel"); // Adjust the path based on your project structure
const path = require("path");

dotenv.config();
connectDB();
const app = express();

app.use(cors());
app.use(express.json());

// app.get("/", (req, res) => {
//   res.send("API is running successfully");
// });
app.use("/api/auth", forgetRouthes);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/announcement", announcementRoute);
app.use("/api/report", reportRoute);

// for collection count using mongoose //
app.get("/api/count/:collectionName", async (req, res) => {
  const { collectionName } = req.params;

  try {
    const count = await mongoose.connection.db.collection(collectionName).countDocuments();
    res.json({ count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//for fetching users//
app.get("/api/users", async (req, res) => {
  try {
    // Fetch users from your database
    const users = await User.find(); // Assuming you have a User model with a `find` method

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// --------------------------deployment------------------------------

const __dirname2= path.resolve(__dirname, '..');

if (process.env.NODE_ENV === "production") {
  console.log(__dirname2);
  console.log("asdfgh");
  
  app.use(express.static(path.join(__dirname2, "/frontend/build")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname2,"frontend", "build", "index.html"))
  );
} else {
  app.get("/", (req, res) => {

    res.send("API is running..");
  });
}

// --------------------------deployment------------------------------

// Error Handling middlewares

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(`Server Started on PORT ${PORT}`.yellow.bold)
);

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "https://ilcha.onrender.com",
  },
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io");

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });
  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;

      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});
