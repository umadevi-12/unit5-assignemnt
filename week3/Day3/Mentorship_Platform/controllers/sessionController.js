const Session = require("../models/Session");
const Mentor = require("../models/Mentor");
const Learner = require("../models/Learner");

exports.createSession = async (req, res) => {
  try {
    const { mentorId, topic, scheduledAt, attendance = [], notes } = req.body;
    const mentor = await Mentor.findById(mentorId);
    if (!mentor || !mentor.isActive) return res.status(400).json({ error: "Mentor not active" });

    for (const a of attendance) {
      const learner = await Learner.findById(a.learnerId);
      if (!learner || !learner.isActive) return res.status(400).json({ error: `Learner ${a.learnerId} not active` });
    }

    const session = await Session.create({ mentorId, topic, scheduledAt, attendance, notes });
    res.status(201).json(session);
  } catch (err) { res.status(400).json({ error: err.message }); }
};

exports.getActiveSessionsForMentor = async (req, res) => {
  try {
    const sessions = await Session.find({ mentorId: req.params.id, isActive: true, isArchived: false })
      .sort({ scheduledAt: -1 })
      .populate("attendance.learnerId", "name email");
    res.json(sessions);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.getActiveSessionsForLearner = async (req, res) => {
  try {
    const sessions = await Session.find({ "attendance.learnerId": req.params.id, isActive: true, isArchived: false })
      .sort({ scheduledAt: -1 })
      .populate("mentorId", "name expertise");
    res.json(sessions);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.recentSessions = async (req, res) => {
  try {
    const sessions = await Session.find({ isActive: true, isArchived: false })
      .sort({ scheduledAt: -1 })
      .limit(5)
      .populate("mentorId", "name expertise")
      .populate("attendance.learnerId", "name email");
    res.json(sessions);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.countLearnersForMentor = async (req, res) => {
  try {
    const learnerIds = await Session.distinct("attendance.learnerId", { mentorId: req.params.id, isActive: true, isArchived: false });
    res.json({ count: learnerIds.length });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.listLearnersForSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id).populate("attendance.learnerId", "name email");
    if (!session || !session.isActive || session.isArchived) return res.status(404).json({ error: "Session not found" });
    res.json(session.attendance);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.findLearnersWithMoreThanNSessions = async (req, res) => {
  try {
    const N = parseInt(req.query.n || 3, 10);
    const sessions = await Session.find({ isActive: true, isArchived: false }).select("attendance.learnerId");
    const counts = {};
    sessions.forEach(s => s.attendance.forEach(a => counts[a.learnerId] = (counts[a.learnerId] || 0) + 1));
    const learnerIds = Object.keys(counts).filter(id => counts[id] > N);
    const learners = await Learner.find({ _id: { $in: learnerIds } }).select("name email");
    res.json(learners);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.archiveSession = async (req, res) => {
  try {
    await Session.findByIdAndUpdate(req.params.id, { isArchived: true, isActive: false });
    res.json({ message: "Session archived" });
  } catch (err) { res.status(500).json({ error: err.message }); }
};
