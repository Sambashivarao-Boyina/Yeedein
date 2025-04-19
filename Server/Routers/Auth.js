const express = require("express");
const router = express.Router();
const { signup, signin } = require("../Controllers/Auth");
const WrapAsync = require("../Utils/WrapAsync");

router.post("/signup", WrapAsync(signup));
router.post("/signin", WrapAsync(signin));

module.exports = router;
