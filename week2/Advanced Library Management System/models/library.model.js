const mongoose = require('mongoose');

const LibraryShema = new mongoose.Schema({
    title : {type : String},
    author:{type:String},

    status:{type:String, default:'available'},

  borrowerName: { type: String, default: null },
  borrowDate: { type: Date, default: null },
  dueDate: { type: Date, default: null },
  returnDate: { type: Date, default: null },
  overdueFees: { type: Number, default: 0 }
} , {
    timestamps:true
})

module.exports = mongoose.model("Library" , LibraryShema)