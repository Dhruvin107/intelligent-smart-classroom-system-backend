const express = require("express");
const router = express.Router();
const Issue = require("../models/issueModel");

// ======================================
// 📌 Report Issue (Faculty) – already yours
// ======================================
router.post("/report", async (req, res) => {
  try {
    const { room, issueType, priority, description } = req.body;

    if (!room || !issueType || !priority || !description) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newIssue = new Issue({
      room,
      issueType,
      priority,
      description,
    });

    await newIssue.save();

    res.status(201).json({
      message: "Issue reported successfully",
      issue: newIssue,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// ======================================
// 📌 Get All Pending Issues (Maintenance)
// ======================================
router.get("/pending", async (req, res) => {
  try {
    const issues = await Issue.find({ status: "Pending" }).sort({ createdAt: -1 });
    res.status(200).json(issues);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// ======================================
// 📌 Update Issue Status (Resolved)
// ======================================
router.put("/resolve/:id", async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    issue.status = "Resolved";
    await issue.save();

    res.status(200).json({
      message: "Issue marked as resolved",
      issue,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// ======================================
// 📌 Get All Resolved Issues (Maintenance)
// ======================================
router.get("/resolved", async (req, res) => {
  try {
    const issues = await Issue.find({ status: "Resolved" }).sort({ updatedAt: -1 });
    res.status(200).json(issues);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// ======================================
// 📌 Get Dashboard Stats (Maintenance)
// ======================================
router.get("/stats", async (req, res) => {
  try {
    const pendingCount = await Issue.countDocuments({ status: "Pending" });
    const resolvedCount = await Issue.countDocuments({ status: "Resolved" });

    res.status(200).json({
      pendingCount,
      resolvedCount,
      totalRequests: pendingCount + resolvedCount,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// ======================================
// 📌 Get Recent Issues (Maintenance)
// ======================================
router.get("/recent", async (req, res) => {
  try {
    const issues = await Issue.find()
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json(issues);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});


module.exports = router;
