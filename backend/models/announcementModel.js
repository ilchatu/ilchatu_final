const mongoose = require("mongoose");

const AnnouncementModal = mongoose.Schema(
  {
    title: {
      type: "String",
      required: true,
    },
    // required: true,
  },
  {
    timestamps: true,
  }
);

const Announcement = mongoose.model("Announcement", AnnouncementModal);

module.exports = Announcement;
