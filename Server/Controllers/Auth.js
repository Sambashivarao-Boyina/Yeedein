const Admin = require("../Modals/Admin");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const ExpressError = require("../Utils/ExpessError");

module.exports.signup = async (req, res) => {
  const { email, password } = req.body;
  const exists = await Admin.findOne({ email });
  if (exists) {
    throw new ExpressError(404, "Admin Already Exist");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newAdmin = new Admin({ email, password: hashedPassword });
  const savedAdmin = await newAdmin.save();
  const admin = await Admin.findById(savedAdmin._id).select("-password");
  const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  res.status(200).json({ token: token, admin: admin });
  
};

module.exports.signin = async (req, res) => {
  const { email, password } = req.body;
  let admin = await Admin.findOne({ email });
  if (!admin) {
    throw new ExpressError(401, "Invalid Email");
  }

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) {
    throw new ExpressError(401, "Password Missmatch");
  }

  const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
  admin = await Admin.findById(admin._id).select("-password");

  res.status(200).json({user:admin, token:token });
};
