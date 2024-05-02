const express = require("express");
const { sendMessage, allMessages, deleteMessage, markAsDeleted } = require("../controllers/messageController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/").post(protect, sendMessage);
router.route("/:chatId").get(protect, allMessages);
router.route("/:messageId").delete(protect, deleteMessage); // Endpoint for deleting a message
router.put("/:messageId/mark-as-deleted", markAsDeleted);
router.route("/delete/:messageId").delete(protect, deleteMessage);

module.exports = router;
