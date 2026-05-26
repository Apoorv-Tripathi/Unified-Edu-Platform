const Scheme = require('../models/scheme.model');
const Student = require('../models/student.model');
const Institution = require('../models/institution.model');

// Get all schemes with filters
exports.getSchemes = async (req, res) => {
  try {
    const { category, type, isActive, search } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (type) filter.type = type;
    if (isActive !== undefined) filter.isActive = isActive === 'true';
    if (search) filter.$text = { $search: search };

    const schemes = await Scheme.find(filter).sort({ createdAt: -1 });
    
    res.json({ success: true, schemes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get scheme analytics (Admin)
exports.getSchemeAnalytics = async (req, res) => {
  try {
    const schemes = await Scheme.find({ isActive: true });
    
    const analytics = {
      totalSchemes: schemes.length,
      byCategory: {},
      byType: {},
      totalBudget: 0,
      totalAllocated: 0,
      totalUtilized: 0,
      utilizationRate: 0,
      totalBeneficiaries: 0,
      totalApplications: 0,
      approvalRate: 0,
      topSchemes: [],
    };

    schemes.forEach(scheme => {
      // By category
      analytics.byCategory[scheme.category] = (analytics.byCategory[scheme.category] || 0) + 1;
      
      // By type
      analytics.byType[scheme.type] = (analytics.byType[scheme.type] || 0) + 1;
      
      // Budget
      analytics.totalBudget += scheme.currentYearBudget || 0;
      
      // Statistics
      analytics.totalBeneficiaries += scheme.totalBeneficiaries || 0;
      analytics.totalApplications += scheme.totalApplicants || 0;
    });

    analytics.approvalRate = analytics.totalApplications > 0
      ? ((analytics.totalBeneficiaries / analytics.totalApplications) * 100).toFixed(2)
      : 0;

    analytics.topSchemes = schemes
      .sort((a, b) => (b.totalBeneficiaries || 0) - (a.totalBeneficiaries || 0))
      .slice(0, 5)
      .map(s => ({
        name: s.name,
        code: s.shortName || s.name,
        beneficiaries: s.totalBeneficiaries || 0,
        amount: s.amount?.max || s.amount?.min || 0,
      }));

    res.json({ success: true, analytics });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get institution scheme stats
exports.getInstitutionSchemeStats = async (req, res) => {
  try {
    const { institutionId } = req.params;

    const students = await Student.find({ institution: institutionId, isActive: true })
      .select('enrolledSchemes name apaarId course');

    const stats = {
      totalStudents: students.length,
      studentsEnrolled: 0,
      totalApplications: 0,
      approved: 0,
      pending: 0,
      rejected: 0,
      totalBenefit: 0,
      byScheme: {},
      byStatus: {},
      recentApplications: [],
    };

    students.forEach(student => {
      if (student.enrolledSchemes && student.enrolledSchemes.length > 0) {
        stats.studentsEnrolled++;
        
        student.enrolledSchemes.forEach(enrollment => {
          stats.totalApplications++;
          
          // By status
          stats.byStatus[enrollment.status] = (stats.byStatus[enrollment.status] || 0) + 1;
          
          if (enrollment.status === 'Approved' || enrollment.status === 'Benefited') {
            stats.approved++;
            stats.totalBenefit += enrollment.amount || 0;
          } else if (enrollment.status === 'Rejected') {
            stats.rejected++;
          } else {
            stats.pending++;
          }
          
          // By scheme
          const schemeName = enrollment.schemeName || 'Unknown';
          if (!stats.byScheme[schemeName]) {
            stats.byScheme[schemeName] = {
              count: 0,
              approved: 0,
              amount: 0,
            };
          }
          stats.byScheme[schemeName].count++;
          if (enrollment.status === 'Approved' || enrollment.status === 'Benefited') {
            stats.byScheme[schemeName].approved++;
            stats.byScheme[schemeName].amount += enrollment.amount || 0;
          }
          
          // Recent applications
          if (stats.recentApplications.length < 10) {
            stats.recentApplications.push({
              studentName: student.name,
              apaarId: student.apaarId,
              scheme: schemeName,
              status: enrollment.status,
              date: enrollment.applicationDate,
            });
          }
        });
      }
    });

    stats.enrollmentRate = stats.totalStudents > 0 
      ? ((stats.studentsEnrolled / stats.totalStudents) * 100).toFixed(2)
      : 0;

    res.json({ success: true, stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create scheme (Admin)
exports.createScheme = async (req, res) => {
  try {
    const scheme = new Scheme(req.body);
    await scheme.save();
    res.status(201).json({ success: true, scheme });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update scheme (Admin)
exports.updateScheme = async (req, res) => {
  try {
    const scheme = await Scheme.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, scheme });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Enroll student in scheme
exports.enrollStudent = async (req, res) => {
  try {
    const { studentId, schemeId, documents } = req.body;
    
    const student = await Student.findById(studentId);
    const scheme = await Scheme.findById(schemeId);
    
    if (!student || !scheme) {
      return res.status(404).json({ success: false, message: 'Student or Scheme not found' });
    }

    student.enrolledSchemes.push({
      schemeId: scheme._id,
      schemeName: scheme.name,
      applicationDate: new Date(),
      status: 'Applied',
      amount: scheme.amount?.max || scheme.amount?.min || 0,
      documents: documents || [],
    });

    await student.save();

    // Update scheme statistics
    scheme.totalApplicants = (scheme.totalApplicants || 0) + 1;
    await scheme.save();

    res.json({ success: true, message: 'Student enrolled successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update enrollment status
exports.updateEnrollmentStatus = async (req, res) => {
  try {
    const { studentId, enrollmentId, status } = req.body;
    
    const student = await Student.findById(studentId);
    const enrollment = student.enrolledSchemes.id(enrollmentId);
    
    if (!enrollment) {
      return res.status(404).json({ success: false, message: 'Enrollment not found' });
    }

    const oldStatus = enrollment.status;
    enrollment.status = status;
    
    if (status === 'Approved') {
      enrollment.approvalDate = new Date();
    }

    await student.save();

    // Update scheme statistics
    const scheme = await Scheme.findById(enrollment.schemeId);
    if (scheme) {
      if (status === 'Approved' && oldStatus !== 'Approved') {
        scheme.totalBeneficiaries = (scheme.totalBeneficiaries || 0) + 1;
      }
      await scheme.save();
    }

    res.json({ success: true, message: 'Status updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};