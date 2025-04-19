const express = require("express");
const { verifyToken } = require("../Middlewares/Auth");
const WrapAsync = require("../Utils/WrapAsync");
const { getStudentsData } = require("../Controllers/Student");
const router = express.Router();


router.get("/", verifyToken, WrapAsync(getStudentsData));

module.exports = router;