const mongoose = require("mongoose");

const reportModel = mongoose.Schema(
    {
    message: {
      type: "String",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    messageId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    },
  {
    timestamps: true,
  }
);

const ReportMod = mongoose.model("Report", reportModel);

module.exports = ReportMod;
