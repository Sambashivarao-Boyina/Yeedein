const { decrypt } = require("../Encryption/Encrypt");
const Student = require("../Modals/Student");
const ExpressError = require("../Utils/ExpessError");

module.exports.validateQRCode = async (req, res) => {
    const token = req.body.token;

    if (!token) {
        throw new ExpressError(404, "Token not found");
    }

    const decryptedData = decrypt(token);

    const student = await Student.findById(decryptedData);

    if (!student) {
        throw new ExpressError(404, "Student Not found")
    }

    if (student.isScanned) {
        throw new ExpressError(409, "Already Scanned");
    }

    student.isScanned = true;
    student.scannedTime = Date.now();
    await student.save();

    res.status(200).json({ message: "Verified" });
}