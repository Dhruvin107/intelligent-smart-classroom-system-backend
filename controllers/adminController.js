const AdminHOD = require("../models/AdminHOD");
const bcrypt = require("bcryptjs");

const registerAdmin = async (req, res) => {
  try {
    const { fullName, email, password, department, phone, experience } = req.body;

    const adminExists = await AdminHOD.findOne({ email });
    if (adminExists) {
      return res.status(400).json({ message: "Admin already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = await AdminHOD.create({
      fullName,
      email,
      password: hashedPassword,
      department,
      phone,
      experience,
    });

    res.status(201).json({ message: "Admin Registered Successfully", admin: newAdmin });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerAdmin };
