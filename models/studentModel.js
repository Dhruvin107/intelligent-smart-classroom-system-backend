const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    department: { type: String, required: true },
    rollNumber: { type: String, required: true },
    phone: { type: String, required: true },
  },
  { timestamps: true }
);

const Student = mongoose.model("Student_Registration", studentSchema);

module.exports = Student;
