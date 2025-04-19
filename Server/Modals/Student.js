const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const studentSchema = new Schema({
  email: {
    type: String,
    reqired: true,
    unique: true,
  },
  idNumber: {
    type: String,
    reqired: true,
    unique: true,
  },
  year: {
    type: String,
    reqired: true,
    enum: ["E3", "E4"],
  },
  isScanned: {
    type: Boolean,
    reqired: true,
    default: false,
  },
  scannedTime: {
    type: Date,
    default: null,
  },
});

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;
