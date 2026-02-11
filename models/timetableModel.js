const mongoose = require("mongoose");

const lectureSchema = new mongoose.Schema(
  {
    subject: {
      type: String,
      required: true,
    },
    faculty: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const timetableSchema = new mongoose.Schema(
  {
    department: {
      type: String,
      required: true,
      unique: true, // Each department has one timetable document
    },

    // Timetable is a Map of Days -> Map of Slots -> Lecture
    // Example: "Monday" -> "09:00-10:00" -> { subject: "Math", ... }
    timetable: {
      type: Map,
      of: {
        type: Map,
        of: lectureSchema,
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Timetable", timetableSchema);
