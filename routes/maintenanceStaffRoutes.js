const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const MaintenanceStaff = require("../models/maintenanceStaffModel");

// @route   POST /api/maintenance/register
// @desc    Register a new maintenance staff
// @access  Public
router.post("/register", async (req, res) => {
  const { fullName, email, password, phone, expertise } = req.body;

  try {
    // Check if staff already exists
    const existingStaff = await MaintenanceStaff.findOne({ email });
    if (existingStaff) {
      return res
        .status(400)
        .json({ message: "Maintenance staff already registered" });
    }

    // ✅ HASH PASSWORD (IMPORTANT FIX)
    const hashedPassword = await bcrypt.hash(password, 10);

    const staff = new MaintenanceStaff({
      fullName,
      email,
      password: hashedPassword, // ✅ encrypted password
      phone,
      expertise,
    });

    await staff.save();

    res.status(201).json({
      message: "Maintenance Staff Registered Successfully",
      staff,
    });
  } catch (error) {
    console.error("Error registering maintenance staff:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
