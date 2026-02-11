const nodemailer = require("nodemailer");

const sendMail = async (email, data, type) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // ✅ OTP EMAIL
    if (type === "OTP") {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Password Reset OTP",
        html: `
          <h2>Your OTP Code</h2>
          <h3 style="color:blue;">${data}</h3>
          <p>This OTP is valid for 5 minutes.</p>
        `,
      });

      console.log("✅ OTP Email Sent Successfully");
    }

    // ✅ FACULTY ACCOUNT EMAIL
    if (type === "FACULTY_ACCOUNT") {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Faculty Account Created - SmartClass",
        text: data,
      });

      console.log("✅ Faculty Account Email Sent Successfully");
    }
  } catch (error) {
    console.log("❌ Email Error:", error);
  }
};

module.exports = sendMail;
