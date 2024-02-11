const ReportMod = require("../models/reportModel");
const User = require("../models/userModel");

const createReport = async (req, res) => {
  const report = new ReportMod(req.body);
  try {
    const newreport = await report.save();
    res.status(201).json(newreport);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const allReport = async (req, res) => {
  try {
    const report = await ReportMod.find().populate({
      path: "user",
      model: User,
    });
    res.json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createReport, allReport };
