const express = require("express");
const router = express.Router();
const { changePassword } = require("../controllers/authController");
const { login } = require("../controllers/authController");

const {
  forgotPassword,
  verifyOtp,
  resendOtp,
} = require("../controllers/authController");


// ✅ Send OTP
router.post("/forgot-password", forgotPassword);

// ✅ Verify OTP
router.post("/verify-otp", verifyOtp);

// ✅ Resend OTP
router.post("/resend-otp", resendOtp);

router.post("/change-password", changePassword);

router.post("/login", login);


module.exports = router;
