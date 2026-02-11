const express = require("express");
const router = express.Router();
const {
    // Dashboard
    getDashboardStats,

    // Departments
    getAllDepartments,
    getDepartmentById,
    createDepartment,
    updateDepartment,
    deleteDepartment,

    // Admins
    getAllAdmins,
    getAdminById,
    createAdmin,
    updateAdmin,
    deleteAdmin,

    // Classrooms
    getAllClassrooms,
    getClassroomById,
    createClassroom,
    updateClassroom,
    deleteClassroom,
} = require("../controllers/superadminController");

// ==========================================
// 📊 DASHBOARD ROUTES
// ==========================================
router.get("/dashboard/stats", getDashboardStats);

// ==========================================
// 🏫 DEPARTMENT ROUTES
// ==========================================
router.get("/departments", getAllDepartments);
router.get("/departments/:id", getDepartmentById);
router.post("/departments", createDepartment);
router.put("/departments/:id", updateDepartment);
router.delete("/departments/:id", deleteDepartment);

// ==========================================
// 👨‍🏫 ADMIN ROUTES
// ==========================================
router.get("/admins", getAllAdmins);
router.get("/admins/:id", getAdminById);
router.post("/admins", createAdmin);
router.put("/admins/:id", updateAdmin);
router.delete("/admins/:id", deleteAdmin);

// ==========================================
// 🏫 CLASSROOM ROUTES
// ==========================================
router.get("/classrooms", getAllClassrooms);
router.get("/classrooms/:id", getClassroomById);
router.post("/classrooms", createClassroom);
router.put("/classrooms/:id", updateClassroom);
router.delete("/classrooms/:id", deleteClassroom);

module.exports = router;
