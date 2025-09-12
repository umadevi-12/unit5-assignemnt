const Learner = require("../models/Learner");
const Session = require("../models/Session");

exports.createLearner = async (req, res) => {
  try {
    const learner = await Learner.create(req.body);
    res.status(201).json(learner);
  } catch (err) { res.status(400).json({ error: err.message }); }
};

exports.softDeleteLearner = async (req, res) => {
  try {
    const id = req.params.id;
    await Learner.findByIdAndUpdate(id, { isActive: false });
    await Session.updateMany(
      { "attendance.learnerId": id, scheduledAt: { $gte: new Date() } },
      { $set: { "attendance.$[elem].status": "cancelled" } },
      { arrayFilters: [{ "elem.learnerId": id }], multi: true }
    );
    res.json({ message: "Learner deactivated, attendance cancelled in upcoming sessions" });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.listMentorsForLearner = async (req, res) => {
  try {
    const learnerId = req.params.id;
    const mentorIds = await Session.distinct("mentorId", { "attendance.learnerId": learnerId });
    const Mentor = require("../models/Mentor");
    const mentors = await Mentor.find({ _id: { $in: mentorIds } }).select("name expertise");
    res.json(mentors);
  } catch (err) { res.status(500).json({ error: err.message }); }
};
