const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ["Pending", "Resolved"],
    default: "Pending",
  },
});

module.exports =
  mongoose.models.Issue ||
  mongoose.model("Issue", issueSchema);
