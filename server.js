const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

// Routes
const facultyRoutes = require("./routes/facultyRoutes");
const adminRoutes = require("./routes/adminRoutes");
const studentRoutes = require("./routes/studentRoutes");
const maintenanceRoutes = require("./routes/maintenanceStaffRoutes");
const authRoutes = require("./routes/authRoutes");
const timetableRoutes = require("./routes/timetableRoutes");
const issueRoutes = require("./routes/issueRoutes");
const classroomRoutes = require("./routes/classroomRoutes");
const superadminRoutes = require("./routes/superadminRoutes");

dotenv.config();
connectDB();

const app = express();

// ✅ Middlewares (DEPLOYMENT SAFE)
app.use(cors({
  origin: "*",   // later you can restrict to Vercel URL
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

// ✅ Root route (for Render testing)
app.get("/", (req, res) => {
  res.send("Backend Running Successfully 🚀");
});

// ✅ API Routes
app.use("/api/admin", adminRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/maintenance", maintenanceRoutes);
app.use("/api/faculty", facultyRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/timetable", timetableRoutes);
app.use("/api/issues", issueRoutes);
app.use("/api/classrooms", classroomRoutes);
app.use("/api/superadmin", superadminRoutes);

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
