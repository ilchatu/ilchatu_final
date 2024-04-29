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
const concernRoutes = require('./routes/concernsRoutes'); //concernsRoute
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
app.use('/api/concern', concernRoutes); //concerns Route

// for collection count using mongoose //
app.get("/api/count/:collectionName", async (req, res) => {
  const { collectionName } = req.params;
  let filter = {};

  // Add a filter to exclude documents with empty or null alumniID fields for the 'users' collection
  if (collectionName === 'users') {
    filter = { 
      $or: [
        { alumniID: { $ne: "" } }, // Exclude documents where alumniID is an empty string
        { alumniID: { $exists: false } } // Exclude documents where alumniID does not exist
      ]
    };
  }

  try {
    const count = await mongoose.connection.db.collection(collectionName).countDocuments(filter);
    res.json({ count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


//for fetching users//
app.get("/api/users", async (req, res) => {
  try {
    // Fetch users from your database excluding those with the name "Deleted user"
    const users = await User.find({ name: { $ne: "Deleted User" } }); // Exclude users with name "Deleted user"

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route to delete a user
app.delete("/api/users/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// Route to set admin status for a user
app.put("/api/users/:userId/set-admin", async (req, res) => {
  const { userId } = req.params;

  try {
    // Find the user by ID
    const user = await User.findById(userId);

    // If user not found, return error
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Set isAdmin field to true
    user.isAdmin = true;

    // Save the updated user
    await user.save();

    // Return success message
    res.json({ message: "Admin status set successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route to remove admin status for a user
app.put("/api/users/:userId/remove-admin", async (req, res) => {
  const { userId } = req.params;

  try {
    // Find the user by ID
    const user = await User.findById(userId);

    // If user not found, return error
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Set isAdmin field to false
    user.isAdmin = false;

    // Save the updated user
    await user.save();

    // Return success message
    res.json({ message: "Admin status removed successfully" });
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
    origin: "https://ilchatu.com",
  },
});

let onlineUsers = [];

io.on("connection", (socket) => {
  console.log("Connected to socket.io" + socket.id);

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("addNewUser", (userId) => {
    !onlineUsers.some((user) => user.userId === userId) &&
    onlineUsers.push ({
      userId: userId,
      socketId: socket.id,
    });
    console.log ("onlineUsers", onlineUsers);

    io.emit("getOnlineUsers", onlineUsers);
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

  socket.on("disconnect", () => {
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
    io.emit("getOnlineUsers", onlineUsers);
    
    console.log("USER DISCONNECTED" + socket.id);
  });
});
