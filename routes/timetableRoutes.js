const express = require("express");
const router = express.Router();
const Timetable = require("../models/timetableModel");


// =======================================================
// ➕ Add / Update Lecture Slot
// =======================================================
router.post("/add", async (req, res) => {
  try {
    const {
      department,
      day,
      startTime,
      endTime,
      subject,
      faculty,
      location,
    } = req.body;

    if (
      !department ||
      !day ||
      !startTime ||
      !endTime ||
      !subject ||
      !faculty ||
      !location
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const timeSlot = `${startTime}-${endTime}`;

    let timetable = await Timetable.findOne({ department });

    // If department timetable not exists
    if (!timetable) {
      timetable = new Timetable({
        department,
        timetable: {},
      });
    }

    // If day not exists
    if (!timetable.timetable.get(day)) {
      timetable.timetable.set(day, new Map());
    }

    // Set lecture slot
    timetable.timetable.get(day).set(timeSlot, {
      subject,
      faculty,
      location,
    });

    await timetable.save();

    res.status(200).json({
      message: "Lecture added successfully",
      timetable,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});


// =======================================================
// ❌ Delete Lecture Slot
// =======================================================
router.delete("/delete", async (req, res) => {
  try {
    const { department, day, timeSlot } = req.body;

    const timetable = await Timetable.findOne({ department });

    if (!timetable || !timetable.timetable.get(day)) {
      return res.status(404).json({ message: "Lecture not found" });
    }

    timetable.timetable.get(day).delete(timeSlot);

    await timetable.save();

    res.status(200).json({
      message: "Lecture deleted successfully",
      timetable,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// =======================================================
// 📥 Get Timetable by Department
// =======================================================
router.get("/:department", async (req, res) => {
  try {
    const { department } = req.params;

    const timetableDoc = await Timetable.findOne({ department });

    if (!timetableDoc) {
      return res.status(404).json({ message: "Timetable not found" });
    }

    // 🔥 Convert Map → Plain Object for frontend consumption
    const timetable = {};

    timetableDoc.timetable.forEach((dayMap, day) => {
      timetable[day] = {};
      dayMap.forEach((lecture, slot) => {
        timetable[day][slot] = lecture;
      });
    });

    res.status(200).json({
      department,
      timetable,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});


module.exports = router;
