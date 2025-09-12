const express = require("express");
const Consultation = require("../models/Consultation");
const Doctor = require("../models/Doctor");
const Patient = require("../models/Patient");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { doctorId, patientId, notes } = req.body;

    const doctor = await Doctor.findById(doctorId);
    const patient = await Patient.findById(patientId);

    if (!doctor || !doctor.isActive) return res.status(400).json({ error: "Doctor not active" });
    if (!patient || !patient.isActive) return res.status(400).json({ error: "Patient not active" });

    const consultation = await Consultation.create({ doctorId, patientId, notes });
    res.status(201).json(consultation);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
