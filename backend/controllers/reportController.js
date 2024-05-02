const ReportMod = require("../models/reportModel");
const User = require("../models/userModel");
const Message = require("../models/reportModel");

const createReport = async (req, res) => {
  const report = new ReportMod(req.body);
  try {
    const newreport = await report.save();
      console.log("Logs",report);
    res.status(201).json(newreport);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const allReport = async (req, res) => {
  try {
    const reports = await ReportMod.find()
      .populate({
        path: "user",
        model: User,
      });
    
    
    res.json(reports);
  } catch (error) {
    console.error("Error fetching reports:", error); // Log any errors
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createReport, allReport };
