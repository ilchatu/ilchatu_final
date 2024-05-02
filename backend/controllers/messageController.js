const asyncHandler = require("express-async-handler");
const Message = require("../models/messageModel");
const User = require("../models/userModel");
const Chat = require("../models/chatModel");

//@description     Get all Messages
//@route           GET /api/Message/:chatId
//@access          Protected
const allMessages = asyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId }).populate("sender", "name pic email").populate("chat");
    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

//@description     Create New Message
//@route           POST /api/Message/
//@access          Protected
const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }

  var newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };

  try {
    var message = await Message.create(newMessage);

    message = await message.populate("sender", "name pic");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });

    await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message, });

    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const deleteMessage = asyncHandler(async (req, res) => {
  const messageId = req.params.messageId;

  try {
    // Check if the user has permission to delete the message
    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    if (message.sender.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Permission denied" });
    }

    // Delete the message
    await Message.findByIdAndDelete(messageId);

    res.json({ message: "Message deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

const markAsDeleted = asyncHandler(async (req, res) => {
  const messageId = req.params.messageId;
  console.log("Received request to mark message as deleted with ID:", messageId);

  try {
    // Find the message by its ID
    const message = await Message.findById(messageId);
    if (!message) {
      console.log("Message not found with ID:", messageId);
      return res.status(404).json({ message: "Message not found" });
    }


    // Update the message document to mark it as deleted
    message.deleted = true;
    await message.save();

    res.json({ message: "Message marked as deleted successfully" });
  } catch (error) {
    console.error("Error marking message as deleted:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = { allMessages, sendMessage, deleteMessage, markAsDeleted };
