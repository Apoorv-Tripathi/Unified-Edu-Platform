const mongoose = require('mongoose');

const historicalMetricsSchema = new mongoose.Schema({
  institutionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Institution',
    required: true,
    index: true
  },
  academicYear: {
    type: String,
    required: true,
    index: true
  },
  semester: {
    type: Number,
    min: 1,
    max: 8
  },
  metrics: {
    // Student Metrics
    totalStudents: { type: Number, default: 0 },
    avgCGPA: { type: Number, default: 0 },
    avgAttendance: { type: Number, default: 0 },
    dropoutRate: { type: Number, default: 0 },
    passPercentage: { type: Number, default: 0 },
    placementRate: { type: Number, default: 0 },
    
    // Faculty Metrics
    totalFaculty: { type: Number, default: 0 },
    avgFacultyRating: { type: Number, default: 0 },
    facultyStudentRatio: { type: Number, default: 0 },
    avgPublications: { type: Number, default: 0 },
    avgHIndex: { type: Number, default: 0 },
    
    // Compliance Metrics
    nirfScore: { type: Number, default: 0 },
    accreditationGrade: { type: String, default: 'A' },
    infrastructureScore: { type: Number, default: 0 },
    researchScore: { type: Number, default: 0 },
    
    // Computed Scores
    tlrScore: { type: Number, default: 0 },
    rpScore: { type: Number, default: 0 },
    goScore: { type: Number, default: 0 },
    oiScore: { type: Number, default: 0 }
  },
  computedAt: {
    type: Date,
    default: Date.now
  }
}, { 
  timestamps: true 
});

// Compound index for efficient querying
historicalMetricsSchema.index({ institutionId: 1, academicYear: 1, semester: 1 });

module.exports = mongoose.model('HistoricalMetrics', historicalMetricsSchema);