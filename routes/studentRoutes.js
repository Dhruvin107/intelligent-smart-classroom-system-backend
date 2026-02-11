const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const Student = require("../models/studentModel");

// @route   POST /api/students/register
// @desc    Register a new student
// @access  Public
router.post("/register", async (req, res) => {
  const { fullName, email, password, department, rollNumber, phone } = req.body;

  try {
    // Check if student already exists
    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({ message: "Student already registered" });
    }

    // ✅ HASH PASSWORD (IMPORTANT FIX)
    const hashedPassword = await bcrypt.hash(password, 10);

    const student = new Student({
      fullName,
      email,
      password: hashedPassword, // ✅ encrypted password
      department,
      rollNumber,
      phone,
    });

    await student.save();

    res.status(201).json({
      message: "Student Registered Successfully",
      student,
    });
  } catch (error) {
    console.error("Error registering student:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
