const express = require("express");
const router = express.Router();
const { registerAdmin } = require("../controllers/adminController");


// POST: /api/admin/register
router.post("/register", registerAdmin);

module.exports = router;
