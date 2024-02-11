const express = require("express");
const {
  createAnnouncement,
  allAnnouncement,
  deleteAnnouncement,
  updateAnnouncement // Import the updateAnnouncement controller function
} = require("../controllers/announcementController");
const router = express.Router();

router.post("/create", createAnnouncement);
router.get("/", allAnnouncement);
router.delete("/:id", deleteAnnouncement);
router.put("/:id", updateAnnouncement); // Add route for updating an announcement

module.exports = router;
