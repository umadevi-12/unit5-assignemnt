const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const bookRoutes = require("./routes/bookRoutes");
const memberRoutes = require("./routes/memberRoutes");

const app = express();
app.use(bodyParser.json());

mongoose.connect("mongodb://127.0.0.1:27017/library", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("MongoDB Connected"));

app.use("/books", bookRoutes);
app.use("/members", memberRoutes);

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
