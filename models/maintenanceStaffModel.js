const mongoose = require("mongoose");

const maintenanceStaffSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  expertise: { type: String, required: true },
}, { timestamps: true });

const MaintenanceStaff = mongoose.model("MaintenanceStaff_Registration", maintenanceStaffSchema);

module.exports = MaintenanceStaff;
