const express = require("express");
const { 
    accessChat, 
    fetchChats, 
    createGroupChat, 
    renameGroup, 
    addToGroup, 
    removeFromGroup,
    removeChatForUser // Import the removeChatForUser function
} = require("../controllers/chatControllers");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/").post(protect, accessChat);
router.route("/").get(protect, fetchChats);
router.route("/group").post(protect, createGroupChat);
router.route("/rename").put(protect, renameGroup);
router.route("/groupadd").put(protect, addToGroup);
router.route("/groupremove").put(protect, removeFromGroup);

// Add the new route for removing a chat for a specific user
router.route("/delete").put(protect, removeChatForUser);

module.exports = router;
