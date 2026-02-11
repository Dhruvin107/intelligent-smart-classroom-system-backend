const express = require("express");
const router = express.Router();
const Faculty = require("../models/facultyModel");
const bcrypt = require("bcryptjs");
const sendMail = require("../utils/sendMail");


// =======================================================
// ✅ FACULTY REGISTER API + EMAIL PASSWORD
// =======================================================
router.post("/register", async (req, res) => {
  try {
    const {
      fullName,
      email,
      password,
      department,
      phone,
      specialization,
      employeeId,
      designation,
      experience,
      qualification,
      gender,
      status,
    } = req.body;

    // ✅ Check Faculty Already Exists
    const existingFaculty = await Faculty.findOne({ email });

    if (existingFaculty) {
      return res.status(400).json({
        message: "Faculty Already Registered ❌",
      });
    }

    // ✅ Hash Password Before Save
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Save Faculty
    const newFaculty = new Faculty({
      fullName,
      email,
      password: hashedPassword,
      department,
      phone,
      specialization,
      employeeId,
      designation,
      experience,
      qualification,
      gender,
      status,
    });

    await newFaculty.save();

    // ✅ Send Email Credentials
    const message = `
Hello ${fullName},

🎉 Your Faculty Account is Created Successfully!

Login Details:
----------------------------
Employee ID: ${employeeId}
Email: ${email}
Password: ${password}

⚠ Please change password after login.

Regards,
SmartClass Admin Team
`;

    await sendMail(email, message, "FACULTY_ACCOUNT");

    res.status(201).json({
      message: "Faculty Registered Successfully ✅ Password Sent to Email 📩",
      faculty: newFaculty,
    });
  } catch (error) {
    console.error("Faculty Register Error:", error);

    res.status(500).json({
      message: "Server Error ❌",
    });
  }
});


// =======================================================
// ✅ GET ALL FACULTY
// =======================================================
router.get("/all", async (req, res) => {
  try {
    const facultyList = await Faculty.find().sort({ createdAt: -1 });

    res.status(200).json({
      message: "Faculty fetched successfully ✅",
      faculty: facultyList,
    });
  } catch (error) {
    console.log("Faculty Fetch Error:", error);

    res.status(500).json({
      message: "Server Error ❌",
    });
  }
});


// =======================================================
// ✅ GET FACULTY BY ID
// =======================================================
router.get("/get/:id", async (req, res) => {
  try {
    const faculty = await Faculty.findById(req.params.id);

    if (!faculty) {
      return res.status(404).json({
        message: "Faculty Not Found ❌",
      });
    }

    res.status(200).json({ faculty });
  } catch (error) {
    console.log("Get Faculty Error:", error);

    res.status(500).json({
      message: "Server Error ❌",
    });
  }
});


// =======================================================
// ✅ UPDATE FACULTY
// =======================================================
router.put("/update/:id", async (req, res) => {
  try {
    const updatedFaculty = await Faculty.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json({
      message: "Faculty Updated Successfully ✅",
      updatedFaculty,
    });
  } catch (error) {
    console.log("Faculty Update Error:", error);

    res.status(500).json({
      message: "Server Error ❌",
    });
  }
});


// =======================================================
// ✅ DELETE FACULTY
// =======================================================
router.delete("/delete/:id", async (req, res) => {
  try {
    const deletedFaculty = await Faculty.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Faculty Deleted Successfully ✅",
    });
  } catch (error) {
    console.log("Faculty Delete Error:", error);

    res.status(500).json({
      message: "Server Error ❌",
    });
  }
});

module.exports = router;
