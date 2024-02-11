const Announcement = require("../models/announcementModel");

const createAnnouncement = async (req, res) => {
  const announcement = new Announcement(req.body);
  try {
    const newannouncement = await announcement.save();
    res.status(201).json(newannouncement);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const allAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.find();
    res.json(announcement);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteAnnouncement = async (req, res) => {
  try {
    const announcementId = req.params.id;
    const deletedAnnouncement = await Announcement.findByIdAndRemove(
      announcementId
    );

    if (!deletedAnnouncement) {
      return res.status(404).send("Announcement not found");
    }

    res.json({ status: true, message: "Announcement successfully deleted" });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

const updateAnnouncement = async (req, res) => {
  try {
    const announcementId = req.params.id;
    const { title } = req.body;

    const updatedAnnouncement = await Announcement.findByIdAndUpdate(
      announcementId,
      { title },
      { new: true }
    );

    if (!updatedAnnouncement) {
      return res.status(404).send("Announcement not found");
    }

    res.json({ status: true, message: "Announcement successfully updated", updatedAnnouncement });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

module.exports = { createAnnouncement, allAnnouncement, deleteAnnouncement, updateAnnouncement };
