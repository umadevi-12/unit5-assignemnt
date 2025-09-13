const express = require("express");
const mongoose = require("mongoose");
const Movie = require("./models/movie");
const User = require("./models/user");
const Booking = require("./models/booking");
const analyticsRoutes = require("./routes/analytics");

const app = express();
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/movieDB")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error(err));

app.post("/movies", async (req, res) => {
  try {
    const movie = new Movie(req.body);
    await movie.save();
    res.status(200).json(movie);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post("/users", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post("/bookings", async (req, res) => {
  try {
    const { userId, movieId } = req.body;
    const user = await User.findById(userId);
    const movie = await Movie.findById(movieId);

    if (!user || !movie) {
      return res.status(400).json({ error: "Invalid userId or movieId" });
    }

    const booking = new Booking(req.body);
    await booking.save();
    res.status(200).json(booking);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


app.use("/analytics", analyticsRoutes);

app.listen(3000, () => console.log("Server running on port 3000"));
