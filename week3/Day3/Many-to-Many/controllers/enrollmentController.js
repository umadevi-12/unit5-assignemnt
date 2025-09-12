const Enrollment = require("../models/Enrollment");
const Student = require("../models/Student");
const Course = require("../models/Course");

exports.enrollStudent = async (req, res) => {
  try {
    const { studentId, courseId } = req.body;

    const student = await Student.findOne({ _id: studentId, isActive: true });
    const course = await Course.findOne({ _id: courseId, isActive: true });

    if (!student || !course) {
      return res.status(400).json({ error: "Student or course is inactive or not found" });
    }

    const enrollment = await Enrollment.create({ studentId, courseId });
    res.status(201).json(enrollment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
