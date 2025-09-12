const express = require("express");
const mongoose = require("mongoose");

const doctorRoutes = require("./routes/doctors");
const patientRoutes = require("./routes/patients");
const consultationRoutes = require("./routes/consultations");

const app = express();
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/hospital");

app.use("/doctors", doctorRoutes);
app.use("/patients", patientRoutes);
app.use("/consultations", consultationRoutes);

app.listen(3000, () => console.log("Server running on port 3000"));
