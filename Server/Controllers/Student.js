const Student = require("../Modals/Student");
const ExpressError = require("../Utils/ExpessError");

module.exports.getStudentsData = async (req, res) => {

  const allStudents = await Student.find();

  const generateStats = (students) => {
    const total = students.length;
    const checkIn = students.filter((s) => s.isCheckIn).length;
    const notCheckIn = total - checkIn;

    const takenFood = students.filter((s) => s.isTakenFood).length;
    const notTakenFood = total - takenFood;

    const takenIcecream = students.filter((s) => s.isTakenIcecream).length;
    const notTakenIcecream = total - takenIcecream;

    const completedAll = students.filter(
      (s) => s.isCheckIn && s.isTakenFood && s.isTakenIcecream
    ).length;

    const missingAny = total - completedAll;

    return {
      total,
      checkIn,
      notCheckIn,
      takenFood,
      notTakenFood,
      takenIcecream,
      notTakenIcecream,
      completedAll,
      missingAny,
    };
  };

  const e3Stats = generateStats(allStudents.filter((s) => s.year === "E3"));
  const e4Stats = generateStats(allStudents.filter((s) => s.year === "E4"));
  const overallStats = generateStats(allStudents);

  res.status(200).json({
    E3: e3Stats,
    E4: e4Stats,
    overall: overallStats,
  });
};

module.exports.getStudentDetails = async (req, res) => {
  const studentId = req.params.studentId;
  if (!studentId) {
    throw new ExpressError(404, "Student Id is missing");
  }

  const student = await Student.findOne({ idNumber: studentId })
    .populate({
      path: "checkInScannedBy",
      select: "email", // Only select the 'email' field from this populated document
    })
    .populate({
      path: "foodScannedBy",
      select: "email", // Only select the 'email' field from this populated document
    })
    .populate({
      path: "iceCreamScannedBy",
      select: "email", // Only select the 'email' field from this populated document
    });
  
  if (!student) {
    throw new ExpressError(404, "ID not found");
  }

 

  res.status(200).json(student);
};
