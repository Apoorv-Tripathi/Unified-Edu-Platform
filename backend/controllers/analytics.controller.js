const Student = require('../models/student.model');
const Institution = require('../models/institution.model');
const Teacher = require('../models/teacher.model');

// @desc    Get analytics overview (for all institutions)
// @route   GET /api/analytics/overview
// @access  Private (Admin)
exports.getOverview = async (req, res) => {
  try {
    const students = await Student.find({ isActive: true }).select('cgpa attendance assignments');
    const institutions = await Institution.find({ isActive: true });

    // Calculate risk levels
    const highRisk = students.filter(s =>
      s.attendance < 75 || s.cgpa < 6.0 || s.assignments < 60
    ).length;

    const mediumRisk = students.filter(s =>
      s.attendance >= 75 && s.attendance < 85 &&
      s.cgpa >= 6.0 && s.cgpa < 7.5 &&
      s.assignments >= 60 && s.assignments < 75
    ).length;

    const lowRisk = students.length - highRisk - mediumRisk;

    const avgCGPA = students.reduce((sum, s) => sum + (s.cgpa || 0), 0) / students.length || 0;

    const riskDistribution = [
      { name: 'High Risk', value: highRisk, color: '#ef4444' },
      { name: 'Medium Risk', value: mediumRisk, color: '#f59e0b' },
      { name: 'Low Risk', value: lowRisk, color: '#10b981' }
    ];

    res.json({
      success: true,
      data: {
        summary: {
          totalStudents: students.length,
          totalInstitutions: institutions.length,
          avgCGPA: avgCGPA,
          highRiskStudents: highRisk,
          mediumRiskStudents: mediumRisk,
          lowRiskStudents: lowRisk
        },
        riskDistribution
      }
    });
  } catch (error) {
    console.error('Analytics overview error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch analytics' });
  }
};

// @desc    Get institution-specific analytics
// @route   GET /api/analytics/institution/:id/overview
// @access  Private (Admin, Institution)
exports.getInstitutionOverview = async (req, res) => {
  try {
    const institutionId = req.params.id;

    const students = await Student.find({
      institution: institutionId,
      isActive: true
    }).select('cgpa attendance assignments name email');

    const teachers = await Teacher.find({
      institutionId: institutionId,
      isActive: true
    });

    const highRisk = students.filter(s =>
      s.attendance < 75 || s.cgpa < 6.0 || s.assignments < 60
    ).length;

    const mediumRisk = students.filter(s =>
      s.attendance >= 75 && s.attendance < 85 &&
      s.cgpa >= 6.0 && s.cgpa < 7.5
    ).length;

    const lowRisk = students.length - highRisk - mediumRisk;

    const avgCGPA = students.reduce((sum, s) => sum + (s.cgpa || 0), 0) / students.length || 0;
    const avgAttendance = students.reduce((sum, s) => sum + (s.attendance || 0), 0) / students.length || 0;

    res.json({
      success: true,
      data: {
        summary: {
          totalStudents: students.length,
          totalFaculty: teachers.length,
          avgCGPA,
          avgAttendance,
          highRiskStudents: highRisk,
          mediumRiskStudents: mediumRisk,
          lowRiskStudents: lowRisk
        },
        riskDistribution: [
          { name: 'High Risk', value: highRisk, color: '#ef4444' },
          { name: 'Medium Risk', value: mediumRisk, color: '#f59e0b' },
          { name: 'Low Risk', value: lowRisk, color: '#10b981' }
        ],
        students: students.slice(0, 10) // Top 10 for quick view
      }
    });
  } catch (error) {
    console.error('Institution analytics error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch institution analytics' });
  }
};

// @desc    Get student-specific analytics
// @route   GET /api/analytics/student/:id
// @access  Private (Admin, Institution, Student)
exports.getStudentAnalytics = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id)
      .populate('institution', 'name location');

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    // Calculate risk score
    let riskScore = 0;
    let riskLevel = 'Low Risk';
    let riskFactors = [];

    if (student.attendance < 75) {
      riskScore += 30;
      riskFactors.push('Low attendance');
    }
    if (student.cgpa < 6.0) {
      riskScore += 40;
      riskFactors.push('Low CGPA');
    }
    if (student.assignments < 60) {
      riskScore += 30;
      riskFactors.push('Incomplete assignments');
    }

    if (riskScore >= 50) riskLevel = 'High Risk';
    else if (riskScore >= 25) riskLevel = 'Medium Risk';

    res.json({
      success: true,
      data: {
        student: {
          name: student.name,
          email: student.email,
          apaarId: student.apaarId,
          course: student.course,
          semester: student.semester
        },
        performance: {
          cgpa: student.cgpa,
          attendance: student.attendance,
          assignments: student.assignments
        },
        riskAssessment: {
          riskScore,
          riskLevel,
          riskFactors
        }
      }
    });
  } catch (error) {
    console.error('Student analytics error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch student analytics' });
  }
};

// @desc    Get predictive analytics (dropout risk)
// @route   GET /api/analytics/predictive/dropout-risk/:institutionId
// @access  Private
exports.getDropoutRisk = async (req, res) => {
  try {
    const { institutionId } = req.params;

    let query = { isActive: true };
    if (institutionId && institutionId !== 'all') {
      query.institution = institutionId;
    }

    const students = await Student.find(query)
      .select('name email apaarId course semester cgpa attendance assignments')
      .populate('institution', 'name');

    const riskAssessments = students.map(student => {
      let riskScore = 0;
      let riskFactors = [];

      if (student.attendance < 75) {
        riskScore += 30;
        riskFactors.push('Attendance below 75%');
      }
      if (student.cgpa < 6.0) {
        riskScore += 40;
        riskFactors.push('CGPA below 6.0');
      }
      if (student.assignments < 60) {
        riskScore += 30;
        riskFactors.push('Assignment completion below 60%');
      }

      let riskLevel = 'Low';
      if (riskScore >= 50) riskLevel = 'High';
      else if (riskScore >= 25) riskLevel = 'Medium';

      return {
        studentId: student._id,
        name: student.name,
        email: student.email,
        apaarId: student.apaarId,
        course: student.course,
        semester: student.semester,
        cgpa: student.cgpa,
        attendance: student.attendance,
        assignments: student.assignments,
        institution: student.institution?.name,
        riskScore,
        riskLevel,
        riskFactors
      };
    });

    const highRisk = riskAssessments.filter(r => r.riskLevel === 'High');
    const mediumRisk = riskAssessments.filter(r => r.riskLevel === 'Medium');
    const lowRisk = riskAssessments.filter(r => r.riskLevel === 'Low');

    res.json({
      success: true,
      data: {
        summary: {
          total: students.length,
          highRisk: highRisk.length,
          mediumRisk: mediumRisk.length,
          lowRisk: lowRisk.length
        },
        students: riskAssessments
      }
    });
  } catch (error) {
    console.error('Dropout risk error:', error);
    res.status(500).json({ success: false, message: 'Failed to calculate dropout risk' });
  }
};

// @desc    Get trend analysis
// @route   GET /api/analytics/trends/:institutionId
// @access  Private
exports.getTrendAnalysis = async (req, res) => {
  try {
    const { institutionId } = req.params;
    const { period = '1year' } = req.query;

    // Mock trend data (in real app, aggregate historical data)
    const trends = {
      cgpa: [
        { period: 'Jan-2025', value: 7.8 },
        { period: 'Feb-2025', value: 7.9 },
        { period: 'Mar-2025', value: 8.0 },
        { period: 'Apr-2025', value: 8.1 },
        { period: 'May-2025', value: 8.2 }
      ],
      attendance: [
        { period: 'Jan-2025', value: 85 },
        { period: 'Feb-2025', value: 87 },
        { period: 'Mar-2025', value: 86 },
        { period: 'Apr-2025', value: 88 },
        { period: 'May-2025', value: 89 }
      ],
      placement: [
        { period: '2024-2025', value: 103.0 }
      ],
      nirfScore: [
        { period: '2024-2025', value: 97.0 }
      ]
    };

    res.json({
      success: true,
      data: {
        period,
        trends,
        insights: [
          'CGPA showing upward trend (+0.4 points)',
          'Attendance improved by 4%',
          'Placement rate above 100%'
        ]
      }
    });
  } catch (error) {
    console.error('Trend analysis error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch trends' });
  }
};
// @desc    Get compliance metrics (NAAC/NIRF)
// @route   GET /api/analytics/compliance/:institutionId
// @access  Private (Admin, Institution)
exports.getComplianceMetrics = async (req, res) => {
  try {
    const { institutionId } = req.params;

    let institution = null;
    if (institutionId !== 'all') {
      institution = await Institution.findById(institutionId);
      if (!institution) {
        return res.status(404).json({ success: false, message: 'Institution not found' });
      }
    }

    // For single institution
    if (institution) {
      const students = await Student.find({
        institution: institutionId,
        isActive: true
      });

      const teachers = await Teacher.find({
        institutionId: institutionId,
        isActive: true
      });

      // Calculate NAAC parameters
      const avgCGPA = students.reduce((sum, s) => sum + (s.cgpa || 0), 0) / students.length || 0;
      const avgAttendance = students.reduce((sum, s) => sum + (s.attendance || 0), 0) / students.length || 0;
      const facultyStudentRatio = students.length / teachers.length || 0;

      // NAAC Criteria (out of 100 each)
      const teachingLearning = Math.min(100, (avgCGPA / 10) * 100);
      const researchInnovation = Math.min(100, teachers.reduce((sum, t) => sum + t.publications, 0) / teachers.length * 2);
      const infrastructure = institution.compliance || 85;
      const studentSupport = avgAttendance;
      const governance = institution.compliance || 85;

      const naacScore = (teachingLearning + researchInnovation + infrastructure + studentSupport + governance) / 5;
      const naacGrade = naacScore >= 90 ? 'A++' : naacScore >= 80 ? 'A+' : naacScore >= 70 ? 'A' : naacScore >= 60 ? 'B++' : 'B+';

      // NIRF Parameters
      const tlrScore = (teachingLearning + (100 - facultyStudentRatio)) / 2; // Teaching Learning Resources
      const rpScore = researchInnovation; // Research & Professional Practice
      const goScore = institution.placement || 75; // Graduation Outcomes
      const oiScore = 80; // Outreach & Inclusivity
      const perceptionScore = institution.nirfScore || 70; // Perception

      const nirfOverallScore = (
        tlrScore * 0.30 +
        rpScore * 0.30 +
        goScore * 0.20 +
        oiScore * 0.10 +
        perceptionScore * 0.10
      );

      // Compliance status for various parameters
      const complianceChecks = [
        {
          parameter: 'Faculty Qualifications',
          status: teachers.filter(t => t.designation === 'Professor' || t.designation === 'Associate Professor').length / teachers.length >= 0.6 ? 'Compliant' : 'Non-Compliant',
          score: teachers.filter(t => t.designation === 'Professor' || t.designation === 'Associate Professor').length / teachers.length * 100,
          threshold: 60,
          description: 'Percentage of faculty with advanced qualifications'
        },
        {
          parameter: 'Student-Faculty Ratio',
          status: facultyStudentRatio <= 20 ? 'Compliant' : 'Non-Compliant',
          score: Math.max(0, 100 - (facultyStudentRatio - 10) * 5),
          threshold: 20,
          description: 'Ideal ratio: 1:15 to 1:20'
        },
        {
          parameter: 'Infrastructure Standards',
          status: institution.compliance >= 80 ? 'Compliant' : 'Needs Improvement',
          score: institution.compliance || 85,
          threshold: 80,
          description: 'Labs, library, classrooms, and facilities'
        },
        {
          parameter: 'Research Output',
          status: researchInnovation >= 70 ? 'Compliant' : 'Needs Improvement',
          score: researchInnovation,
          threshold: 70,
          description: 'Publications, patents, and research projects'
        },
        {
          parameter: 'Student Attendance',
          status: avgAttendance >= 75 ? 'Compliant' : 'Non-Compliant',
          score: avgAttendance,
          threshold: 75,
          description: 'Minimum 75% attendance required'
        },
        {
          parameter: 'Placement Rate',
          status: institution.placement >= 70 ? 'Compliant' : 'Needs Improvement',
          score: institution.placement || 75,
          threshold: 70,
          description: 'Percentage of students placed or pursuing higher studies'
        }
      ];

      const overallCompliance = complianceChecks.filter(c => c.status === 'Compliant').length / complianceChecks.length * 100;

      res.json({
        success: true,
        data: {
          institution: {
            id: institution._id,
            name: institution.name,
            location: institution.location
          },
          naac: {
            score: naacScore.toFixed(2),
            grade: naacGrade,
            criteria: {
              teachingLearning: teachingLearning.toFixed(2),
              researchInnovation: researchInnovation.toFixed(2),
              infrastructure: infrastructure.toFixed(2),
              studentSupport: studentSupport.toFixed(2),
              governance: governance.toFixed(2)
            }
          },
          nirf: {
            overallScore: nirfOverallScore.toFixed(2),
            ranking: institution.ranking || 'Not Ranked',
            parameters: {
              tlr: tlrScore.toFixed(2),
              rp: rpScore.toFixed(2),
              go: goScore.toFixed(2),
              oi: oiScore.toFixed(2),
              perception: perceptionScore.toFixed(2)
            }
          },
          compliance: {
            overallCompliance: overallCompliance.toFixed(2),
            checks: complianceChecks,
            lastAuditDate: new Date().toISOString(),
            nextAuditDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString() // 6 months from now
          }
        }
      });
    } else {
      // For all institutions (admin view)
      const institutions = await Institution.find({ isActive: true });

      const complianceData = await Promise.all(
        institutions.slice(0, 10).map(async (inst) => {
          const students = await Student.countDocuments({ institution: inst._id, isActive: true });
          const teachers = await Teacher.countDocuments({ institutionId: inst._id, isActive: true });

          return {
            id: inst._id,
            name: inst.name,
            location: inst.location,
            naacGrade: inst.accreditation || 'A',
            nirfScore: inst.nirfScore || 70,
            nirfRanking: inst.ranking || 'Not Ranked',
            compliance: inst.compliance || 85,
            students,
            faculty: teachers
          };
        })
      );

      res.json({
        success: true,
        data: {
          summary: {
            totalInstitutions: institutions.length,
            naacAccredited: institutions.filter(i => i.accreditation).length,
            nirfRanked: institutions.filter(i => i.ranking && i.ranking <= 200).length
          },
          institutions: complianceData
        }
      });
    }
  } catch (error) {
    console.error('Compliance metrics error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch compliance metrics' });
  }
};

// @desc    Get comparative analysis (benchmark institutions)
// @route   GET /api/analytics/comparative
// @access  Private (Admin, Institution)
exports.getComparativeAnalysis = async (req, res) => {
  try {
    const { institutionId } = req.query;

    const institutions = await Institution.find({ isActive: true }).limit(10);

    const comparativeData = await Promise.all(
      institutions.map(async (inst) => {
        const students = await Student.find({ institution: inst._id, isActive: true });
        const teachers = await Teacher.find({ institutionId: inst._id, isActive: true });

        const avgCGPA = students.reduce((sum, s) => sum + (s.cgpa || 0), 0) / students.length || 0;
        const avgAttendance = students.reduce((sum, s) => sum + (s.attendance || 0), 0) / students.length || 0;
        const avgPublications = teachers.reduce((sum, t) => sum + (t.publications || 0), 0) / teachers.length || 0;

        return {
          id: inst._id,
          name: inst.name,
          shortName: inst.shortName || inst.name.substring(0, 15),
          location: inst.location,
          type: inst.type,
          students: students.length,
          faculty: teachers.length,
          avgCGPA: avgCGPA.toFixed(2),
          avgAttendance: avgAttendance.toFixed(2),
          nirfScore: inst.nirfScore || 70,
          ranking: inst.ranking || 999,
          placement: inst.placement || 75,
          avgPublications: avgPublications.toFixed(2),
          compliance: inst.compliance || 85,
          isTarget: inst._id.toString() === institutionId
        };
      })
    );

    // Sort by NIRF Score
    const sortedByNIRF = [...comparativeData].sort((a, b) => b.nirfScore - a.nirfScore);

    // Calculate averages for benchmarking
    const avgMetrics = {
      avgCGPA: (comparativeData.reduce((sum, i) => sum + parseFloat(i.avgCGPA), 0) / comparativeData.length).toFixed(2),
      avgAttendance: (comparativeData.reduce((sum, i) => sum + parseFloat(i.avgAttendance), 0) / comparativeData.length).toFixed(2),
      avgNIRF: (comparativeData.reduce((sum, i) => sum + i.nirfScore, 0) / comparativeData.length).toFixed(2),
      avgPlacement: (comparativeData.reduce((sum, i) => sum + i.placement, 0) / comparativeData.length).toFixed(2)
    };

    // Identify top performers
    const topPerformers = {
      highestCGPA: sortedByNIRF.reduce((max, inst) => parseFloat(inst.avgCGPA) > parseFloat(max.avgCGPA) ? inst : max),
      highestAttendance: sortedByNIRF.reduce((max, inst) => parseFloat(inst.avgAttendance) > parseFloat(max.avgAttendance) ? inst : max),
      highestNIRF: sortedByNIRF[0],
      highestPlacement: sortedByNIRF.reduce((max, inst) => inst.placement > max.placement ? inst : max)
    };

    // Category-wise comparison
    const categoryComparison = {
      government: comparativeData.filter(i => i.type === 'Government'),
      private: comparativeData.filter(i => i.type === 'Private'),
      deemed: comparativeData.filter(i => i.type === 'Deemed'),
      autonomous: comparativeData.filter(i => i.type === 'Autonomous')
    };

    res.json({
      success: true,
      data: {
        institutions: sortedByNIRF,
        benchmarks: avgMetrics,
        topPerformers,
        categoryComparison: {
          government: categoryComparison.government.length,
          private: categoryComparison.private.length,
          deemed: categoryComparison.deemed.length,
          autonomous: categoryComparison.autonomous.length
        },
        insights: [
          `Top institution: ${topPerformers.highestNIRF.name} (NIRF: ${topPerformers.highestNIRF.nirfScore})`,
          `Average CGPA across institutions: ${avgMetrics.avgCGPA}`,
          `Best placement rate: ${topPerformers.highestPlacement.name} (${topPerformers.highestPlacement.placement}%)`
        ]
      }
    });
  } catch (error) {
    console.error('Comparative analysis error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch comparative analysis' });
  }
};