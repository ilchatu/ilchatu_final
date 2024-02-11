const express = require("express");
const { sendMessage, allMessages } = require("../controllers/messageController");
const { protect } = require("../middleware/authMiddleware");
const { deleteMessage } = require("../controllers/messageController");

const router = express.Router();

router.route("/").post(protect, sendMessage);       
router.route("/:chatId").get(protect, allMessages);
router.route("/delete/:messageId").delete(protect, deleteMessage);

module.exports = router;
