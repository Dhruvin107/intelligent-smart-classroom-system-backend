const mongoose = require("mongoose");

const adminHODSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    department: { type: String, required: true },
    phone: { type: String, required: true },
    experience: { type: Number, required: true, min: 0 },
    role: { type: String, default: "Admin(HOD)_Registration" },
  },
  { timestamps: true }
);

// ✅ Collection Name = Admin(HOD)
module.exports = mongoose.model("Registration", adminHODSchema, "Admin(HOD)_Registration");
