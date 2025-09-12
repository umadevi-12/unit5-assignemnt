const mongoose = require("mongoose");

const attendanceSubSchema = new mongoose.Schema({
  learnerId: { type: mongoose.Schema.Types.ObjectId, ref: "Learner", required: true },
  status: { type: String, enum: ["attended", "absent", "cancelled"], default: "attended" },
  feedback: { type: String, default: "" }
}, { _id: false });

const sessionSchema = new mongoose.Schema({
  mentorId: { type: mongoose.Schema.Types.ObjectId, ref: "Mentor", required: true },
  topic: { type: String, required: true },
  scheduledAt: { type: Date, required: true },
  notes: { type: String },
  attendance: [attendanceSubSchema], 
  isActive: { type: Boolean, default: true }, 
  isArchived: { type: Boolean, default: false }, 
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Session", sessionSchema);
