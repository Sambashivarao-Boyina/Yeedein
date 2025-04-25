const express = require("express");
const { verifyToken } = require("../Middlewares/Auth");
const WrapAsync = require("../Utils/WrapAsync");
const { getStudentsData, getStudentDetails } = require("../Controllers/Student");
const router = express.Router();


router.get("/", verifyToken, WrapAsync(getStudentsData));
router.get("/:studentId", verifyToken, WrapAsync(getStudentDetails));

module.exports = router;