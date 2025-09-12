const Mentor = require("../models/Mentor");
const Session = require("../models/Session");

exports.createMentor = async (req, res) => {
  try {
    const mentor = await Mentor.create(req.body);
    res.status(201).json(mentor);
  } catch (err) { res.status(400).json({ error: err.message }); }
};

exports.getMentor = async (req, res) => {
  try {
    const mentor = await Mentor.findById(req.params.id);
    if (!mentor || !mentor.isActive) return res.status(404).json({ error: "Not found" });
    res.json(mentor);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.softDeleteMentor = async (req, res) => {
  try {
    const id = req.params.id;
    await Mentor.findByIdAndUpdate(id, { isActive: false });
    await Session.updateMany({ mentorId: id, scheduledAt: { $gte: new Date() } }, { isActive: false });
    res.json({ message: "Mentor deactivated, upcoming sessions disabled" });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.getMentorsWithNoActiveSessions = async (req, res) => {
  try {
    const activeMentorsWithSessions = await Session.distinct("mentorId", { isActive: true, scheduledAt: { $gte: new Date() } });
    const mentors = await Mentor.find({ isActive: true, _id: { $nin: activeMentorsWithSessions } }).select("name expertise");
    res.json(mentors);
  } catch (err) { res.status(500).json({ error: err.message }); }
};
