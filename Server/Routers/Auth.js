const express = require("express");
const router = express.Router();
const { signup, signin, refreshToken } = require("../Controllers/Auth");
const WrapAsync = require("../Utils/WrapAsync");
const { verifyToken } = require("../Middlewares/Auth");

router.post("/signup", verifyToken, WrapAsync(signup));
router.post("/signin", WrapAsync(signin));
router.post("/refreshToken", verifyToken, WrapAsync(refreshToken));

module.exports = router;
