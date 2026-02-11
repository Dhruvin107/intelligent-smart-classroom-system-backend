const express = require("express");
const router = express.Router();
const Timetable = require("../models/timetableModel");
const Classroom = require("../models/classroomModel");
const { getCurrentSlot, convertTimeToSlot } = require("../utils/getCurrentSlot");

// =================================================
// 🔍 Search Classroom (CURRENT TIME OR SPECIFIED TIME)
// =================================================
// =================================================
// 🔍 Search Classroom (CURRENT TIME OR SPECIFIED TIME)
// =================================================
router.get("/search", async (req, res) => {
  try {
    const { room, day: queryDay, time: queryTime } = req.query;

    if (!room) {
      return res.status(400).json({ message: "Room name required" });
    }

    // 1. Get Day and Time in Minutes
    const day = queryDay || new Date().toLocaleString("en-US", { weekday: "long" });
    let currentMinutes;

    if (queryTime) {
      const [h, m] = queryTime.split(":").map(Number);
      currentMinutes = h * 60 + m;
    } else {
      const now = new Date();
      currentMinutes = now.getHours() * 60 + now.getMinutes();
    }

    // 2. Fetch Timetables
    const timetables = await Timetable.find({});

    let foundLecture = null;
    let isOutsideHours = true; // Assumption, validated below

    // Helper: Parse time string to minutes with heuristic (01:00 -> 13:00)
    const parseToMinutes = (timeStr) => {
      const parts = timeStr.split ? timeStr.split(":") : [];
      let h = parseInt(parts[0]);
      let m = parseInt(parts[1]);
      if (isNaN(h)) return null;

      // Heuristic: If hour is small (e.g. 1, 2, 3), assume PM (13, 14, 15)
      // because lectures usually don't happen at 1 AM - 6 AM.
      // Exception: 12 is 12 PM.
      if (h < 7) h += 12;

      return h * 60 + m;
    };

    // 3. Search for overlapping lecture
    for (const deptTimetable of timetables) {
      if (deptTimetable.timetable && deptTimetable.timetable.get(day)) {
        const daySchedule = deptTimetable.timetable.get(day);

        // Iterate over all slots (keys are strings like "09:00-10:00")
        daySchedule.forEach((lecture, slotKey) => {
          // Parse slotKey "start-end"
          const [startStr, endStr] = slotKey.split("-");
          const startMin = parseToMinutes(startStr);
          const endMin = parseToMinutes(endStr);

          if (startMin !== null && endMin !== null) {
            // Check specific timeline for "Outside Hours" calculation
            // If current time is NOT within this slot, we continue
            // But we track if we are roughly in working hours? 
            // Actually, "Outside Hours" usually means before first lecture or after last.
            // For checking "Occupied", we just need exact overlap.

            // Check Overlap: inclusive start, exclusive end
            if (currentMinutes >= startMin && currentMinutes < endMin) {
              isOutsideHours = false; // We found a valid slot time (even if room mismatch)

              // Check Room
              if (lecture.location === room) {
                foundLecture = {
                  subject: lecture.subject,
                  faculty: lecture.faculty,
                  location: lecture.location,
                  department: deptTimetable.department,
                  time: slotKey
                };
              }
            }
          }
        });
      }
    }

    // Also check if current time is generally valid (e.g. 9am to 5pm) to support "Outside Hours" flag
    // consistently if no slots matched.
    if (!foundLecture) {
      // Simple check: Is it night time?
      if (currentMinutes < 540 || currentMinutes > 1080) { // Before 9 AM or After 6 PM
        isOutsideHours = true;
      } else {
        isOutsideHours = false;
      }
    }

    if (foundLecture) {
      return res.json({
        room,
        status: "Occupied",
        ...foundLecture,
      });
    }

    // 4. Return Result
    res.json({
      room,
      status: "Available",
      isOutsideHours: isOutsideHours
    });

  } catch (error) {
    console.error("Search Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// =================================================
// 📊 Get Classroom Count
// =================================================
router.get("/count", async (req, res) => {
  try {
    const count = await Classroom.countDocuments();
    res.json({ count });
  } catch (error) {
    console.error("Count Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// =================================================
// 🏫 Get All Classrooms
// =================================================
router.get("/all", async (req, res) => {
  try {
    let classrooms = await Classroom.find();

    // Fallback: If no classrooms are defined in the Classrooms collection, 
    // extract unique locations from the Timetables to ensure the system works.
    if (classrooms.length === 0) {
      const timetables = await Timetable.find();
      const distinctRooms = new Set();

      timetables.forEach((tt) => {
        if (tt.timetable) {
          tt.timetable.forEach((dayMap) => {
            dayMap.forEach((lecture) => {
              // Ensure we capture the location if it exists
              if (lecture.location) {
                distinctRooms.add(lecture.location);
              }
            });
          });
        }
      });

      // Convert Set to array of classroom objects
      classrooms = Array.from(distinctRooms).map((room) => ({
        room,
        type: "Classroom", // Default type since we don't have specifics
        capacity: 0,       // Default capacity
        block: "General"   // Default block
      })).sort((a, b) => a.room.localeCompare(b.room, undefined, { numeric: true }));
    }

    res.json(classrooms);
  } catch (error) {
    console.error("Fetch All Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
