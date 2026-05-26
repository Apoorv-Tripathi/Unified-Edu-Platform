require('dotenv').config({ path: __dirname + '/.env' });
const mongoose = require('mongoose');
const Student = require('./models/student.model');
const Teacher = require('./models/teacher.model');
const Institution = require('./models/institution.model');
const HistoricalMetrics = require('./models/historicalMetrics.model');

require("dotenv").config({ path: __dirname + "/.env" });

const connectDB = async () => {
  try {
    const uri =
      process.env.MONGODB_URI ||
      process.env.MONGO_URI ||
      process.env.MONGO_URL;

    if (!uri) {
      throw new Error("MongoDB URI NOT FOUND in .env file");
    }

    console.log("Using Mongo URI:", uri);
    await mongoose.connect(uri);

    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    process.exit(1);
  }
};

const seedHistoricalMetrics = async () => {
  try {
    console.log('📈 Seeding Historical Metrics...');

    const institutions = await Institution.find({});
    console.log(`Found ${institutions.length} institutions`);

    if (institutions.length === 0) {
      console.log('⚠️  No institutions found. Please add institutions first.');
      return;
    }

    const years = ['2022-2023', '2023-2024', '2024-2025'];

    for (const institution of institutions) {
      console.log(`Processing institution: ${institution.name}`);

      for (const year of years) {
        for (let sem = 1; sem <= 2; sem++) {
          const students = await Student.find({
            institution: institution._id,
            isActive: true
          });

          const teachers = await Teacher.find({
            institutionId: institution._id,
            isActive: true
          });

          console.log(`  ${year} Sem ${sem}: ${students.length} students, ${teachers.length} teachers`);

          const avgCGPA = students.length > 0
            ? students.reduce((sum, s) => sum + (s.cgpa || 0), 0) / students.length
            : 0;

          const avgAttendance = students.length > 0
            ? students.reduce((sum, s) => sum + (s.attendance || 0), 0) / students.length
            : 0;

          const avgFacultyRating = teachers.length > 0
            ? teachers.reduce((sum, t) => sum + (t.rating || 0), 0) / teachers.length
            : 0;

          const avgPublications = teachers.length > 0
            ? teachers.reduce((sum, t) => sum + (t.publications || 0), 0) / teachers.length
            : 0;

          const avgHIndex = teachers.length > 0
            ? teachers.reduce((sum, t) => sum + (t.hIndex || 0), 0) / teachers.length
            : 0;

          const metrics = {
            institutionId: institution._id,
            academicYear: year,
            semester: sem,
            metrics: {
              totalStudents: students.length,
              avgCGPA: parseFloat(avgCGPA.toFixed(2)),
              avgAttendance: parseFloat(avgAttendance.toFixed(2)),
              dropoutRate: parseFloat((Math.random() * 5).toFixed(2)),
              passPercentage: parseFloat((85 + Math.random() * 10).toFixed(2)),
              placementRate: parseFloat(((institution.placement || 70) + Math.random() * 10).toFixed(2)),

              totalFaculty: teachers.length,
              avgFacultyRating: parseFloat(avgFacultyRating.toFixed(2)),
              facultyStudentRatio: teachers.length > 0
                ? parseFloat((students.length / teachers.length).toFixed(2))
                : 0,
              avgPublications: parseFloat(avgPublications.toFixed(2)),
              avgHIndex: parseFloat(avgHIndex.toFixed(2)),

              nirfScore: institution.nirfScore || parseFloat((70 + Math.random() * 20).toFixed(2)),
              accreditationGrade: institution.accreditation || 'A',
              infrastructureScore: parseFloat((70 + Math.random() * 20).toFixed(2)),
              researchScore: parseFloat((60 + Math.random() * 20).toFixed(2)),

              tlrScore: parseFloat((60 + Math.random() * 20).toFixed(2)),
              rpScore: parseFloat((55 + Math.random() * 20).toFixed(2)),
              goScore: parseFloat((65 + Math.random() * 20).toFixed(2)),
              oiScore: parseFloat((60 + Math.random() * 20).toFixed(2))
            }
          };

          await HistoricalMetrics.findOneAndUpdate(
            {
              institutionId: institution._id,
              academicYear: year,
              semester: sem
            },
            metrics,
            { upsert: true, new: true }
          );

          console.log(`    ✅ Created metrics for ${year} Sem ${sem}`);
        }
      }
    }

    const totalMetrics = await HistoricalMetrics.countDocuments();
    console.log(`✅ Total historical metrics in database: ${totalMetrics}`);

  } catch (error) {
    console.error('❌ Seed error:', error);
  }
};

const runSeed = async () => {
  await connectDB();
  await seedHistoricalMetrics();
  console.log('✅ Analytics data seeded successfully!');
  process.exit(0);
};
runSeed();