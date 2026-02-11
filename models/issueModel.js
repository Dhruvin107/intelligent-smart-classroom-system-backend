const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema(
  {
    room: {
      type: String,
      required: true,
    },
    issueType: {
      type: String,
      required: true,
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Critical"],
      default: "Medium",
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "Pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Issue", issueSchema);
