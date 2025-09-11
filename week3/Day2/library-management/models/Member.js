const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema({
    name: { type: String, required: true, minlength: 3 },
    email: { type: String, required: true, unique: true },
    borrowedBooks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Book" }]
});

const Member = mongoose.model("Member", memberSchema);
module.exports = Member;
