const dotenv = require("dotenv");
const connectDB = require("./config/db");
const Student = require("./Modals/Student");
const fs = require("fs");
const { encrypt, decrypt } = require("./Encryption/Encrypt");
const path = require("path");

dotenv.config();
connectDB();

const insertStudent = async () => {
  const student = new Student({
    email: "rs200198@rguktsklm.ac.in",
    idNumber: "S200198",
    year: "E4",
  });

  let savedUser = await student.save();
  console.log("userId ->", savedUser._id.toString());

  const encrypted = encrypt(savedUser._id.toString());
  console.log("Encrypted ->", encrypted);

  const decrypted = decrypt(encrypted);
  console.log("Decrypted ->", decrypted);

  console.log("Saved successfully ✅");
};

insertStudent();

const createJson = async () => {
  try {
    const students = await Student.find().select("email idNumber").lean();

    let data = [];

    for (let i = 0; i < students.length; i++) {
      const token = encrypt(students[i]._id.toString());
      data = [...data, { email: students[i].email, token: token }];
    }

    const jsonPath = path.join(__dirname, "exportedData.json");

    fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2)); // pretty print with 2-space indent

    console.log("✅ Data exported to JSON file:", jsonPath);
  } catch (error) {
    console.log(error);
  }
};


// createJson();