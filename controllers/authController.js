const OTP = require("../models/otpModel");

const Student = require("../models/studentModel");
const Faculty = require("../models/facultyModel");
const Admin = require("../models/AdminHOD");
const Maintenance = require("../models/maintenanceStaffModel");
const bcrypt = require("bcryptjs");
const sendMail = require("../utils/sendMail");


// =======================================================
// ✅ FORGOT PASSWORD → SEND OTP
// =======================================================
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // ✅ Check Email Exists in Any Collection
    const user =
      (await Student.findOne({ email })) ||
      (await Faculty.findOne({ email })) ||
      (await Admin.findOne({ email })) ||
      (await Maintenance.findOne({ email }));

    if (!user) {
      return res.status(404).json({
        message: "Email not found in any account ❌",
      });
    }

    // ✅ Delete Old OTP if Exists
    await OTP.deleteMany({ email });

    // ✅ Generate 4 Digit OTP
    const otpCode = Math.floor(1000 + Math.random() * 9000).toString();

    // ✅ Save OTP in MongoDB
    await OTP.create({
      email,
      otp: otpCode,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 Minutes Expiry
    });

    // ✅ Send OTP Mail
    await sendMail(email, otpCode);

    res.status(200).json({
      message: "OTP sent successfully ✅",
    });
  } catch (error) {
    console.log("Forgot Password Error:", error);
    res.status(500).json({
      message: "Server Error ❌",
    });
  }
};



// =======================================================
// ✅ VERIFY OTP
// =======================================================
exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    // Find OTP Record
    const otpRecord = await OTP.findOne({ email, otp });

    if (!otpRecord) {
      return res.status(400).json({
        message: "Invalid OTP ❌",
      });
    }

    // Check OTP Expiry
    if (otpRecord.expiresAt < new Date()) {
      await OTP.deleteOne({ _id: otpRecord._id });

      return res.status(400).json({
        message: "OTP Expired ❌",
      });
    }

    // OTP Verified → Delete OTP
    await OTP.deleteOne({ _id: otpRecord._id });

    res.status(200).json({
      message: "OTP Verified Successfully ✅",
    });
  } catch (error) {
    console.log("Verify OTP Error:", error);
    res.status(500).json({
      message: "Server Error ❌",
    });
  }
};



// =======================================================
// ✅ RESEND OTP
// =======================================================
exports.resendOtp = async (req, res) => {
  const { email } = req.body;

  try {
    // Delete Old OTP
    await OTP.deleteMany({ email });

    // Generate New OTP
    const otpCode = Math.floor(1000 + Math.random() * 9000).toString();

    // Save OTP Again
    await OTP.create({
      email,
      otp: otpCode,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    // Send Mail Again
    await sendMail(email, otpCode);

    res.status(200).json({
      message: "New OTP Sent Successfully ✅",
    });
  } catch (error) {
    console.log("Resend OTP Error:", error);
    res.status(500).json({
      message: "Server Error ❌",
    });
  }
};


// =======================================================
// ✅ CHANGE PASSWORD AFTER OTP VERIFIED
// =======================================================
exports.changePassword = async (req, res) => {
  const { email, newPassword, confirmPassword } = req.body;

  try {
    if (!newPassword || !confirmPassword) {
      return res.status(400).json({ message: "Please fill all fields ❌" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match ❌" });
    }

    // Find user in all collections
    let user =
      (await Student.findOne({ email })) ||
      (await Faculty.findOne({ email })) ||
      (await Admin.findOne({ email })) ||
      (await Maintenance.findOne({ email }));

    if (!user) {
      return res.status(404).json({ message: "User not found ❌" });
    }

    // ✅ HASH NEW PASSWORD BEFORE SAVING
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password changed successfully ✅" });
  } catch (error) {
    console.log("Change Password Error:", error);
    res.status(500).json({ message: "Server Error ❌" });
  }
};


// =======================================================
// ✅ LOGIN
// =======================================================
exports.login = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    if (!email || !password || !role) {
      return res.status(400).json({ message: "All fields are required ❌" });
    }

    let user;

    // Find user based on role
    switch (role) {
      case "Student":
        user = await Student.findOne({ email });
        break;

      case "Faculty":
        user = await Faculty.findOne({ email });
        break;

      case "Admin (HOD)":
        user = await Admin.findOne({ email });
        break;

      case "Maintenance Staff":
        user = await Maintenance.findOne({ email });
        break;

      case "Super Admin":
        user = await Admin.findOne({ email, role: "Super Admin" });
        break;

      default:
        return res.status(400).json({ message: "Invalid role ❌" });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found ❌" });
    }

    // ✅ FIXED PASSWORD CHECK USING BCRYPT
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password ❌" });
    }

    // Optional: check if account is active
    if (user.isActive === false) {
      return res.status(403).json({ message: "Account is inactive ❌" });
    }

    // Success
    res.status(200).json({
      message: "Login successful ✅",
      user: {
        email: user.email,
        fullName: user.fullName,
        department: user.department,
        role
      },
      token: "dummy-token" // Adding a dummy token for frontend consistency
    });
  } catch (error) {
    console.log("Login Error:", error);
    res.status(500).json({ message: "Server Error ❌" });
  }
};
