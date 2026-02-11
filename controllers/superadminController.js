const AdminHOD = require("../models/AdminHOD");
const Department = require("../models/departmentModel");
const Classroom = require("../models/classroomModel");
const bcrypt = require("bcryptjs");

// ==========================================
// 📊 DASHBOARD STATS
// ==========================================
const getDashboardStats = async (req, res) => {
    try {
        const totalDepartments = await Department.countDocuments();
        const totalAdmins = await AdminHOD.countDocuments();
        const totalClassrooms = await Classroom.countDocuments();

        // Get recent admins with their departments
        const recentAdmins = await AdminHOD.find()
            .select("fullName department email createdAt")
            .sort({ createdAt: -1 })
            .limit(5);

        res.json({
            stats: {
                totalDepartments,
                totalAdmins,
                totalClassrooms,
                pendingRequests: 0, // Can be implemented later
            },
            recentActivity: recentAdmins,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ==========================================
// 🏫 DEPARTMENT MANAGEMENT
// ==========================================

// Get all departments
const getAllDepartments = async (req, res) => {
    try {
        const departments = await Department.find().sort({ createdAt: -1 });
        res.json(departments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get single department
const getDepartmentById = async (req, res) => {
    try {
        const department = await Department.findById(req.params.id);
        if (!department) {
            return res.status(404).json({ message: "Department not found" });
        }
        res.json(department);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create department
const createDepartment = async (req, res) => {
    try {
        const { name, code } = req.body;

        // Check if department code already exists
        const existingDept = await Department.findOne({ code: code.toUpperCase() });
        if (existingDept) {
            return res.status(400).json({ message: "Department code already exists" });
        }

        const department = await Department.create({
            name,
            code: code.toUpperCase(),
        });

        res.status(201).json({
            message: "Department created successfully",
            department,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update department
const updateDepartment = async (req, res) => {
    try {
        const { name, code } = req.body;

        // Check if new code conflicts with existing department
        if (code) {
            const existingDept = await Department.findOne({
                code: code.toUpperCase(),
                _id: { $ne: req.params.id },
            });
            if (existingDept) {
                return res.status(400).json({ message: "Department code already exists" });
            }
        }

        const department = await Department.findByIdAndUpdate(
            req.params.id,
            { name, code: code?.toUpperCase() },
            { new: true, runValidators: true }
        );

        if (!department) {
            return res.status(404).json({ message: "Department not found" });
        }

        res.json({
            message: "Department updated successfully",
            department,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete department
const deleteDepartment = async (req, res) => {
    try {
        const department = await Department.findByIdAndDelete(req.params.id);

        if (!department) {
            return res.status(404).json({ message: "Department not found" });
        }

        res.json({ message: "Department deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ==========================================
// 👨‍🏫 ADMIN (HOD) MANAGEMENT
// ==========================================

// Get all admins
const getAllAdmins = async (req, res) => {
    try {
        const admins = await AdminHOD.find()
            .select("-password")
            .sort({ createdAt: -1 });
        res.json(admins);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get single admin
const getAdminById = async (req, res) => {
    try {
        const admin = await AdminHOD.findById(req.params.id).select("-password");
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }
        res.json(admin);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create admin
const createAdmin = async (req, res) => {
    try {
        const { fullName, email, password, department, phone, experience } = req.body;

        // Check if admin already exists
        const existingAdmin = await AdminHOD.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ message: "Admin with this email already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const admin = await AdminHOD.create({
            fullName,
            email,
            password: hashedPassword,
            department,
            phone,
            experience,
        });

        // Remove password from response
        const adminResponse = admin.toObject();
        delete adminResponse.password;

        res.status(201).json({
            message: "Admin created successfully",
            admin: adminResponse,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update admin
const updateAdmin = async (req, res) => {
    try {
        const { fullName, email, password, department, phone, experience } = req.body;

        // Check if email conflicts with existing admin
        if (email) {
            const existingAdmin = await AdminHOD.findOne({
                email,
                _id: { $ne: req.params.id },
            });
            if (existingAdmin) {
                return res.status(400).json({ message: "Email already in use" });
            }
        }

        const updateData = {
            fullName,
            email,
            department,
            phone,
            experience,
        };

        // Only update password if provided
        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }

        const admin = await AdminHOD.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        ).select("-password");

        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        res.json({
            message: "Admin updated successfully",
            admin,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete admin
const deleteAdmin = async (req, res) => {
    try {
        const admin = await AdminHOD.findByIdAndDelete(req.params.id);

        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        res.json({ message: "Admin deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ==========================================
// 🏫 CLASSROOM MANAGEMENT
// ==========================================

// Get all classrooms
const getAllClassrooms = async (req, res) => {
    try {
        const classrooms = await Classroom.find().sort({ room: 1 });
        res.json(classrooms);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get single classroom
const getClassroomById = async (req, res) => {
    try {
        const classroom = await Classroom.findById(req.params.id);
        if (!classroom) {
            return res.status(404).json({ message: "Classroom not found" });
        }
        res.json(classroom);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create classroom
const createClassroom = async (req, res) => {
    try {
        const { room, type, capacity } = req.body;

        // Check if classroom already exists
        const existingClassroom = await Classroom.findOne({ room });
        if (existingClassroom) {
            return res.status(400).json({ message: "Classroom with this room number already exists" });
        }

        const classroom = await Classroom.create({
            room,
            type,
            capacity,
        });

        res.status(201).json({
            message: "Classroom created successfully",
            classroom,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update classroom
const updateClassroom = async (req, res) => {
    try {
        const { room, type, capacity } = req.body;

        // Check if room number conflicts with existing classroom
        if (room) {
            const existingClassroom = await Classroom.findOne({
                room,
                _id: { $ne: req.params.id },
            });
            if (existingClassroom) {
                return res.status(400).json({ message: "Room number already exists" });
            }
        }

        const classroom = await Classroom.findByIdAndUpdate(
            req.params.id,
            { room, type, capacity },
            { new: true, runValidators: true }
        );

        if (!classroom) {
            return res.status(404).json({ message: "Classroom not found" });
        }

        res.json({
            message: "Classroom updated successfully",
            classroom,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete classroom
const deleteClassroom = async (req, res) => {
    try {
        const classroom = await Classroom.findByIdAndDelete(req.params.id);

        if (!classroom) {
            return res.status(404).json({ message: "Classroom not found" });
        }

        res.json({ message: "Classroom deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
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
};
