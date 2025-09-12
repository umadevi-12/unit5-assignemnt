const express = require('express');
const Doctor = require('../models/Doctor');
const Consultation = require('../models/Consultation');

const router = express.Router();

router.post('/' , async(req,res) =>{
    try{
        const doctor = await Doctor.create(req.body);
        res.status(201).json(doctor)
    }
    catch(err){
        res.status(400).json({error:err.message});
    }
});

router.get("/:id", async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor || !doctor.isActive) {
      return res.status(404).json({ error: "Doctor not found" });
    }
    res.json(doctor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id/patients", async (req, res) => {
  try {
    const patients = await Consultation.find({ doctorId: req.params.id, isActive: true })
      .populate("patientId", "name age gender")
      .sort({ consultedAt: -1 })
      .limit(5);
    res.json(patients);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id/consultations/count", async (req, res) => {
  try {
    const count = await Consultation.countDocuments({ doctorId: req.params.id, isActive: true });
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Doctor.findByIdAndUpdate(req.params.id, { isActive: false });
    await Consultation.updateMany({ doctorId: req.params.id }, { isActive: false });
    res.json({ message: "Doctor and related consultations deactivated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;