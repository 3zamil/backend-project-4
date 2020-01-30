//field =>
//name{string, required}
//model:{string, required}
//color:string
//pasenger: {number, required }
//timestamp

const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    note: {
      type: String,
      required: true
    },
    order: {
      type: Number
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Note",
      required: true
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  {
    timestamps: true
  }
);

const Note = mongoose.model("Note", noteSchema);

module.exports = Note;
