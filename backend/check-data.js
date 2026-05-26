require('dotenv').config();
const mongoose = require('mongoose');
const Student = require('./models/student.model');
const Institution = require('./models/institution.model');

const checkData = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  
  const institutions = await Institution.find({});
  console.log('\n📊 INSTITUTIONS:');
  console.log(`Total: ${institutions.length}`);
  institutions.forEach(inst => {
    console.log(`  - ${inst.name} (ID: ${inst._id})`);
  });
  
  if (institutions.length > 0) {
    const firstInst = institutions[0];
    const students = await Student.find({ institution: firstInst._id, isActive: true });
    console.log(`\n👨‍🎓 STUDENTS for ${firstInst.name}:`);
    console.log(`Total: ${students.length}`);
    students.slice(0, 3).forEach(s => {
      console.log(`  - ${s.name} | CGPA: ${s.cgpa} | Attendance: ${s.attendance}%`);
    });
  }
  
  process.exit(0);
};
checkData();