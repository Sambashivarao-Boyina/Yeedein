const dotenv = require("dotenv");
const connectDB = require("./config/db");
const Student = require("./Modals/Student");
const { encrypt, decrypt } = require("./Encryption/Encrypt");

dotenv.config();
connectDB();

const insertStudent = async () => {
  const student = new Student({
    email: "s190212@gmail.com",
    idNumber: "s190193",
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
