const express = require("express");
const Patient = require("../models/Patient");
const Consultation = require("../models/Consultation");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const patient = await Patient.create(req.body);
    res.status(201).json(patient);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/:id/doctors", async (req, res) => {
  try {
    const doctors = await Consultation.find({ patientId: req.params.id, isActive: true })
      .populate("doctorId", "name specialization");
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const filter = {};
    if (req.query.gender) {
      filter.gender = req.query.gender;
      filter.isActive = true;
    }
    const patients = await Patient.find(filter);
    res.json(patients);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Patient.findByIdAndUpdate(req.params.id, { isActive: false });
    await Consultation.updateMany({ patientId: req.params.id }, { isActive: false });
    res.json({ message: "Patient and related consultations deactivated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;