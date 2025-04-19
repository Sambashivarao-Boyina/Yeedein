const Student = require("../Modals/Student");

module.exports.getStudentsData = async (req, res) => {
    const allStudents = await Student.find();
   const total = allStudents.length;

   const completed = allStudents.filter((s) => s.isScanned).length;
   const pending = total - completed;

   const e3Students = allStudents.filter((s) => s.year === "E3");
   const e4Students = allStudents.filter((s) => s.year === "E4");

   const e3Count = e3Students.length;
   const e4Count = e4Students.length;

   const e3Scanned = e3Students.filter((s) => s.isScanned).length;
   const e3Pending = e3Count - e3Scanned;

   const e4Scanned = e4Students.filter((s) => s.isScanned).length;
   const e4Pending = e4Count - e4Scanned;

   const recentScans = await Student.find({ isScanned: true })
     .sort({ scannedTime: -1 })
     .limit(5)
    .select("name email idNumber year isScanned scannedTime");
  

   res.status(200).json({
     total,
     completed,
     pending,
     e3Count,
     e4Count,
     e3Scanned,
     e3Pending,
     e4Scanned,
     e4Pending,
     recentScans: recentScans.map((s) => ({
       name: s.name, // include name field in schema if needed
       email: s.email,
       idNumber: s.idNumber,
       year: s.year,
       scannedAt: s.scannedTime,
     })),
   });
}