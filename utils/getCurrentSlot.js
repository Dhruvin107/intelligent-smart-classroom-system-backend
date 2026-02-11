const slots = [
  { start: 540, end: 600, label: "09:00-10:00" }, // 9 AM - 10 AM
  { start: 600, end: 660, label: "10:00-11:00" }, // 10 AM - 11 AM
  { start: 660, end: 720, label: "11:00-12:00" }, // 11 AM - 12 PM
  { start: 720, end: 780, label: "12:00-01:00" }, // 12 PM - 1 PM
  { start: 840, end: 900, label: "02:00-03:00" }, // 2 PM - 3 PM
];

function getCurrentSlot() {
  const now = new Date();
  const hour = now.getHours();
  const minute = now.getMinutes();
  const currentMinutes = hour * 60 + minute;

  // Inclusive start, exclusive end
  const slot = slots.find(s => currentMinutes >= s.start && currentMinutes < s.end);
  return slot ? slot.label : null;
}

function convertTimeToSlot(timeStr) {
  // Expected format: "14:30" or "09:00"
  if (!timeStr) return null;
  const [hour, minute] = timeStr.split(":").map(Number);
  const currentMinutes = hour * 60 + minute;

  // Inclusive start, exclusive end
  const slot = slots.find(s => currentMinutes >= s.start && currentMinutes < s.end);
  return slot ? slot.label : null;
}

module.exports = { getCurrentSlot, convertTimeToSlot };
