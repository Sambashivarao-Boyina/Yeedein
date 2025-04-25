const { decrypt } = require("../Encryption/Encrypt");
const Student = require("../Modals/Student");
const ExpressError = require("../Utils/ExpessError");

module.exports.checkInStudent = async (req, res) => {
  const token = req.body.token;

  if (!token) {
    throw new ExpressError(404, "Token not found");
  }

  const decryptedData = decrypt(token);

  const student = await Student.findById(decryptedData);

  if (!student) {
    throw new ExpressError(404, "Student Not found");
  }

  if (student.isCheckIn) {
    throw new ExpressError(409, "Already Scanned");
  }

  student.isCheckIn = true;
  student.checkInTime = Date.now();
  student.checkInScannedBy = req.adminId;
  await student.save();

  res.status(200).json({ message: "Student CheckedIn" });
};

module.exports.scanFood = async (req, res) => {
  const token = req.body.token;

  if (!token) {
    throw new ExpressError(404, "Token not found");
  }

  const decryptedData = decrypt(token);

  const student = await Student.findById(decryptedData);

  if (!student) {
    throw new ExpressError(404, "Student Not found");
  }

  if (!student.isCheckIn) {
    throw new ExpressError(409, "Student Not CheckedIn");
  }
  if (student.isTakenFood) {
    throw new ExpressError(409, "Student Alreadt taken Food");
  }

  student.isTakenFood = true;
  student.foodTakenAt = Date.now();
  student.foodScannedBy = req.adminId;
  await student.save();

  res.status(200).json({ message: "Food Scanned" });
};


module.exports.scanIceCream = async (req, res) => {
  const token = req.body.token;

  if (!token) {
    throw new ExpressError(404, "Token not found");
  }

  const decryptedData = decrypt(token);

  const student = await Student.findById(decryptedData);

  if (!student) {
    throw new ExpressError(404, "Student Not found");
  }

  if (!student.isCheckIn) {
    throw new ExpressError(409, "Student Not CheckedIn");
  }
  if (student.isTakenIcecream) {
    throw new ExpressError(409, "Student Alreadt taken Food");
  }

  student.isTakenIcecream = true;
  student.iceCreamTakenAt = Date.now();
  student.iceCreamScannedBy = req.adminId;
  await student.save();

  res.status(200).json({ message: "IceCream Scanned" });
};
