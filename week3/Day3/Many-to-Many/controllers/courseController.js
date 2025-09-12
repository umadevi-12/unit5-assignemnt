const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");

exports.createCourse = async (req, res) => {
  try {
    const course = await Course.create(req.body);
    res.status(201).json(course);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    await Course.findByIdAndUpdate(id, { isActive: false });
    await Enrollment.updateMany({ courseId: id }, { isActive: false });
    res.json({ message: "Course and enrollments deactivated" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getCourseStudents = async (req, res) => {
  try {
    const { id } = req.params;
    const students = await Enrollment.find({ courseId: id, isActive: true })
      .populate({ path: "studentId", match: { isActive: true } });
    res.json(students.map(e => e.studentId));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};