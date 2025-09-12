const express = require("express");
const mongoose = require("mongoose");
const mentorRoutes = require("./routes/mentors");

const app = express();

app.use(express.json()); // 🔑 must come BEFORE routes
app.use("/mentors", mentorRoutes); // mounts POST /mentors

mongoose.connect("mongodb://127.0.0.1:27017/mentorhub", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.log(err));

app.listen(3000, () => console.log("Server running on port 3000"));
