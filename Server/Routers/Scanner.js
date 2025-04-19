const express = require("express");
const { verifyToken } = require("../Middlewares/Auth");
const WrapAsync = require("../Utils/WrapAsync");
const { validateQRCode } = require("../Controllers/Scanner");
const router = express.Router();


router.post("/", verifyToken, WrapAsync(validateQRCode));

module.exports = router;