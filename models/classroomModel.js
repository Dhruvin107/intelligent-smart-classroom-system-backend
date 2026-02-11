const mongoose = require("mongoose");

const classroomSchema = new mongoose.Schema({
  room: {
    type: String,
    required: true,
    unique: true,
  },
  type: {
    type: String,
    required: true, // Classroom | Lab | Hall
  },
  capacity: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Classroom", classroomSchema);
