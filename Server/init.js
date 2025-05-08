const dotenv = require("dotenv");
const connectDB = require("./config/db");
const Student = require("./Modals/Student");
const fs = require("fs");
const { encrypt, decrypt } = require("./Encryption/Encrypt");
const path = require("path");
const XLSX = require("xlsx");

dotenv.config();
connectDB();

const insertStudent = async (email, idNumber, year) => {
  const student = new Student({
    email: email,
    idNumber: idNumber,
    year: year,
  });

  let savedUser = await student.save();
  console.log(`${savedUser.idNumber} is added into Database`);

};

const insertStudentData = async (req, res) => {
  const workbook = XLSX.readFile("book2.xlsx");
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json(sheet); // remove await here — it's not needed

  for (let row of rows) {
    try {
      await insertStudent(row.email, row.idNumber, "E3");
    } catch (error) {
      console.log("Error inserting:", row);
      console.error(error);
    }
  }

  console.log("All data processed.");
};

// insertStudentData();

const createJson = async () => {
  try {
    const students = await Student.find({year:"E3"}).select("email idNumber").lean();

    let data = [];

    for (let i = 0; i < students.length; i++) {
      const token = encrypt(students[i]._id.toString());
      data = [...data, { email: students[i].email, token: token }];
    }

    const jsonPath = path.join(__dirname, "E3TokenData.json");

    fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));

    console.log("✅ Data exported to JSON file:", jsonPath);
  } catch (error) {
    console.log(error);
  }
};


createJson();