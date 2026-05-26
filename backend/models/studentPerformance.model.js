const mongoose = require('mongoose');

const studentPerformanceSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
    index: true
  },
  academicYear: {
    type: String,
    required: true
  },
  semester: {
    type: Number,
    required: true
  },
  semesterData: {
    cgpa: Number,
    sgpa: Number,
    attendance: Number,
    assignmentsCompleted: Number,
    totalAssignments: Number,
    examScores: [{
      subject: String,
      score: Number,
      maxScore: Number
    }],
    disciplinaryIssues: { type: Number, default: 0 },
    extracurriculars: { type: Number, default: 0 }
  },
  predictions: {
    dropoutRisk: {
      score: Number, // 0-100
      factors: [String],
      confidence: Number
    },
    expectedCGPA: Number,
    graduationProbability: Number
  },
  recordedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

studentPerformanceSchema.index({ studentId: 1, academicYear: 1, semester: 1 });

module.exports = mongoose.model('StudentPerformance', studentPerformanceSchema);