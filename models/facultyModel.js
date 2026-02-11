const mongoose = require("mongoose");

const facultySchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    department: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },

    specialization: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "Faculty",
  facultySchema,
  "faculty_Registration"
);


module.exports = mongoose.model("Faculty_Registration", facultySchema);
