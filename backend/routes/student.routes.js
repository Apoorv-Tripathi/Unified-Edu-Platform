const express = require('express');
const router = express.Router();
const Student = require('../models/student.model');
const User = require('../models/user.model');
const { protect, authorize } = require('../middleware/auth.middleware');

// ==================== SPECIAL ROUTES - MUST BE FIRST ====================

// @route   GET /api/students/my-profile
// @desc    Get logged-in student's own profile
// @access  Student
router.get('/my-profile', protect, authorize('student'), async (req, res) => {
  try {
    const student = await Student.findOne({ email: req.user.email })
      .populate('institution', 'name location');

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found. Please contact your institution.'
      });
    }

    res.json({ success: true, data: student });
  } catch (error) {
    console.error('Get my profile error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/students/stats
// @desc    Get student statistics
// @access  Admin, Institution
router.get('/stats', protect, authorize('admin', 'institution'), async (req, res) => {
  try {
    const total = await Student.countDocuments({ isActive: true });
    const avgCGPA = await Student.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: null, avg: { $avg: '$cgpa' } } }
    ]);
    const byCourse = await Student.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$course', count: { $sum: 1 } } }
    ]);

    res.json({
      success: true,
      data: {
        total,
        active: total,
        avgCGPA: avgCGPA[0]?.avg?.toFixed(2) || '0.00',
        byCourse: byCourse.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
      },
    });
  } catch (error) {
    console.error('Get student stats error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ==================== AADHAAR VERIFICATION ROUTES ====================

// @route   POST /api/students/aadhaar/send-otp
// @desc    Send mock OTP for Aadhaar verification
// @access  Private
router.post('/aadhaar/send-otp', protect, async (req, res) => {
  try {
    const { studentId, aadhaarNumber } = req.body;

    if (!aadhaarNumber || aadhaarNumber.length !== 12) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Aadhaar number. Must be 12 digits.'
      });
    }

    const mockOtp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(`[MOCK OTP] Student ${studentId}: ${mockOtp} (Valid for 2 minutes)`);

    res.json({
      success: true,
      message: 'OTP sent successfully',
      mockOtp: mockOtp,
      expiresAt: new Date(Date.now() + 2 * 60 * 1000)
    });
  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send OTP'
    });
  }
});

// @route   POST /api/students/aadhaar/verify-otp
// @desc    Verify mock OTP and update student
// @access  Private
router.post('/aadhaar/verify-otp', protect, async (req, res) => {
  try {
    const { studentId, aadhaarNumber, otp } = req.body;

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    if (!otp || otp.length !== 6) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP format'
      });
    }

    student.aadhaarVerified = true;
    student.aadhaarVerificationDate = new Date();
    await student.save();

    res.json({
      success: true,
      message: 'Aadhaar verified successfully',
      data: {
        aadhaarVerified: true,
        verificationDate: student.aadhaarVerificationDate
      }
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify OTP'
    });
  }
});

// ==================== BULK OPERATIONS ====================

// @route   POST /api/students/bulk-add
// @desc    Bulk add students from CSV
// @access  Private (Admin/Institution)
router.post('/bulk-add', protect, authorize('admin', 'institution'), async (req, res) => {
  try {
    const studentsData = req.body;

    if (!Array.isArray(studentsData) || studentsData.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid data format. Expected an array of student records.'
      });
    }

    const results = { successful: [], failed: [], total: studentsData.length };

    for (let i = 0; i < studentsData.length; i++) {
      const studentData = studentsData[i];

      try {
        if (!studentData.name || !studentData.email || !studentData.course) {
          results.failed.push({
            row: i + 1,
            data: studentData,
            error: 'Missing required fields (name, email, or course)'
          });
          continue;
        }

        const existingStudent = await Student.findOne({ email: studentData.email });
        if (existingStudent) {
          results.failed.push({
            row: i + 1,
            data: studentData,
            error: `Student with email ${studentData.email} already exists`
          });
          continue;
        }

        let user = await User.findOne({ email: studentData.email });

        if (!user) {
          user = await User.create({
            name: studentData.name,
            email: studentData.email,
            password: 'TempPassword@123',
            role: 'student'
          });
        } else if (user.role !== 'student') {
          results.failed.push({
            row: i + 1,
            data: studentData,
            error: `Email exists with role: ${user.role}. Cannot register as student.`
          });
          continue;
        }

        const parsedData = {
          name: studentData.name.trim(),
          email: studentData.email.trim().toLowerCase(),
          course: studentData.course.trim(),
          userId: user._id,
          apaarId: studentData.apaarId && studentData.apaarId.trim() !== ""
            ? studentData.apaarId.trim()
            : `APAAR-${Date.now()}-${i}`,
          semester: studentData.semester ? parseInt(studentData.semester) : undefined,
          cgpa: studentData.cgpa ? parseFloat(studentData.cgpa) : 0,
          attendance: studentData.attendance ? parseFloat(studentData.attendance) : 0,
          assignments: studentData.assignments ? parseFloat(studentData.assignments) : 0,
          phone: studentData.phone ? studentData.phone.trim() : undefined,
          gender: studentData.gender ? studentData.gender.trim() : undefined,
          dateOfBirth: studentData.dateOfBirth ? new Date(studentData.dateOfBirth) : undefined,
          batch: studentData.batch ? studentData.batch.trim() : undefined,
          enrollmentNumber: studentData.enrollmentNumber ? studentData.enrollmentNumber.trim() : undefined
        };

        if (studentData.achievements) {
          parsedData.achievements = studentData.achievements.split(';').map(a => a.trim()).filter(Boolean);
        }

        if (studentData.schemes) {
          parsedData.schemes = studentData.schemes.split(';').map(s => s.trim()).filter(Boolean);
        }

        if (req.user.role === 'institution') {
          parsedData.institution = req.user._id;
        }

        const newStudent = await Student.create(parsedData);

        results.successful.push({
          row: i + 1,
          studentId: newStudent._id,
          name: newStudent.name,
          email: newStudent.email,
          apaarId: newStudent.apaarId
        });

      } catch (error) {
        results.failed.push({
          row: i + 1,
          data: studentData,
          error: error.message
        });
      }
    }

    res.status(results.failed.length === studentsData.length ? 400 : 200).json({
      success: results.successful.length > 0,
      message: `Bulk add completed: ${results.successful.length} successful, ${results.failed.length} failed`,
      data: results
    });

  } catch (error) {
    console.error('Bulk add error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process bulk add',
      error: error.message
    });
  }
});

// @route   POST /api/students/bulk-delete
// @desc    Bulk delete students
// @access  Private (Admin only)
router.post('/bulk-delete', protect, authorize('admin'), async (req, res) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid data format. Expected an array of student IDs.'
      });
    }

    const results = { successful: [], failed: [], total: ids.length };

    for (const id of ids) {
      try {
        const student = await Student.findById(id);

        if (!student) {
          results.failed.push({ id, error: 'Student not found' });
          continue;
        }

        await Student.findByIdAndDelete(id);

        results.successful.push({
          id,
          name: student.name,
          email: student.email
        });

      } catch (error) {
        results.failed.push({ id, error: error.message });
      }
    }

    res.json({
      success: results.successful.length > 0,
      message: `Bulk delete completed: ${results.successful.length} deleted, ${results.failed.length} failed`,
      data: results
    });

  } catch (error) {
    console.error('Bulk delete error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process bulk delete',
      error: error.message
    });
  }
});

// ==================== ANALYTICS ROUTE - BEFORE /:id ====================

// @route   GET /api/students/:id/analytics
// @desc    Get student analytics
// @access  Private (Admin, Institution, Student)
router.get('/:id/analytics', protect, authorize('admin', 'institution', 'student'), async (req, res) => {
  try {
    console.log('📊 Analytics request for ID:', req.params.id);
    console.log('👤 Requested by:', req.user.email, 'Role:', req.user.role);

    const student = await Student.findById(req.params.id).populate('institution', 'name');

    if (!student) {
      console.log('❌ Student not found');
      return res.status(404).json({ success: false, error: 'Student not found' });
    }

    console.log('✅ Found student:', student.name);
    console.log('📈 Data - CGPA:', student.cgpa, 'Attendance:', student.attendance, 'Assignments:', student.assignments);

    const analyticsData = {
      success: true,
      data: {
        student: {
          name: student.name,
          apaarId: student.apaarId,
          course: student.course,
          semester: student.semester,
          cgpa: student.cgpa || 0,
          attendance: student.attendance || 0,
          assignments: student.assignments || 0
        },
        performanceTrend: [
          { semester: 'Sem 1', cgpa: 7.5, attendance: 75 },
          { semester: 'Sem 2', cgpa: 7.8, attendance: 80 },
          { semester: 'Sem 3', cgpa: 8.0, attendance: 78 },
          { semester: 'Sem 4', cgpa: student.cgpa, attendance: student.attendance }
        ],
        risk: {
          level: student.attendance < 75 || student.cgpa < 6.0 ? 'High' : student.attendance < 85 ? 'Medium' : 'Low',
          score: student.attendance < 75 ? 70 : student.attendance < 85 ? 40 : 20,
          factors: [
            ...(student.attendance < 75 ? ['Low attendance (below 75%)'] : []),
            ...(student.cgpa < 6.0 ? ['Low CGPA (below 6.0)'] : []),
            ...(student.assignments < 70 ? ['Incomplete assignments'] : [])
          ]
        },
        recommendations: [
          student.attendance < 75 ? '⚠️ Improve attendance immediately - Below minimum requirement' : '✅ Keep up the good attendance!',
          student.cgpa < 7.0 ? '📚 Focus on improving grades through regular study' : '🎯 Maintain your excellent academic performance',
          student.assignments < 80 ? '📝 Complete pending assignments to boost performance' : '💯 Great job on assignment completion!'
        ]
      }
    };

    console.log('📤 Sending analytics data');
    res.json(analyticsData);
  } catch (error) {
    console.error('💥 Analytics route error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==================== LIFECYCLE ROUTES ====================

// @route   GET /api/students/:id/lifecycle
// @desc    Get student lifecycle stages
// @access  Private
router.get('/:id/lifecycle', protect, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id)
      .select('lifecycle currentStage profileCompleteness name email apaarId');

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    res.json({ success: true, data: student });
  } catch (error) {
    console.error('Get lifecycle error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch lifecycle data' });
  }
});

// @route   POST /api/students/:id/lifecycle
// @desc    Add lifecycle stage
// @access  Private (Admin/Institution)
// @route   POST /api/students/:id/lifecycle
// @desc    Add lifecycle stage
// @access  Private (Admin/Institution)
router.post('/:id/lifecycle', protect, authorize('admin', 'institution'), async (req, res) => {
  try {
    const { stage, status, details, notes, documents } = req.body;

    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    // ADD "Schooling" here
    const validStages = [
      'Schooling',
      'Enrollment',
      'Academic Progress',
      'Internship',
      'Placement',
      'Higher Studies',
      'Alumni'
    ];

    if (!validStages.includes(stage)) {
      return res.status(400).json({ success: false, message: 'Invalid stage' });
    }

    const existingStage = student.lifecycle.find(s => s.stage === stage);
    if (existingStage) {
      return res.status(400).json({
        success: false,
        message: 'Stage already exists. Use update endpoint to modify.'
      });
    }

    const newStage = {
      stage,
      status: status || 'In Progress',
      details: details || {},
      notes: notes || '',
      documents: documents || [],
      completedBy: req.user.id
    };

    await student.addLifecycleStage(newStage);

    res.json({
      success: true,
      message: 'Lifecycle stage added successfully',
      data: student
    });
  } catch (error) {
    console.error('Add lifecycle stage error:', error);
    res.status(500).json({ success: false, message: 'Failed to add lifecycle stage' });
  }
});

// @route   PUT /api/students/:id/lifecycle/:stageId
// @desc    Update lifecycle stage
// @access  Private (Admin/Institution)
router.put('/:id/lifecycle/:stageId', protect, authorize('admin', 'institution'), async (req, res) => {
  try {
    const { status, details, notes, documents } = req.body;

    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    const updateData = {};
    if (status) updateData.status = status;
    if (details) updateData.details = details;
    if (notes) updateData.notes = notes;
    if (documents) updateData.documents = documents;

    await student.updateLifecycleStage(req.params.stageId, updateData);

    res.json({
      success: true,
      message: 'Lifecycle stage updated successfully',
      data: student
    });
  } catch (error) {
    console.error('Update lifecycle stage error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update lifecycle stage'
    });
  }
});

// ==================== GENERIC CRUD ROUTES - KEEP AT THE END ====================


router.get('/', protect, authorize('admin', 'institution'), async (req, res) => {
  try {
    const { search, course, limit } = req.query;
    let query = { isActive: true };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { apaarId: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    if (course) query.course = course;
    if (req.user.role === 'institution') query.institution = req.user._id;

    const students = await Student.find(query)
      .populate('institution', 'name location')
      .limit(parseInt(limit) || 0)   // 0 = unlimited
      .sort({ createdAt: -1 });

    res.json({ success: true, count: students.length, data: students });
  } catch (error) {
    console.error('Get students error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});


router.get('/:id', protect, authorize('admin', 'institution', 'student'), async (req, res) => {
  try {
    const student = await Student.findById(req.params.id)
      .populate('institution', 'name shortName location');

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    res.json({ success: true, data: student });
  } catch (error) {
    console.error('Get student error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/students
// @desc    Create student
// @access  Admin, Institution
router.post('/', protect, authorize('admin', 'institution'), async (req, res) => {
  try {
    const studentData = { ...req.body };
    if (req.user.role === 'institution') {
      studentData.institution = req.user._id;
    }

    // ✅ CHECK: Does Student record already exist?
    const existingStudent = await Student.findOne({ email: studentData.email });
    if (existingStudent) {
      return res.status(400).json({
        success: false,
        message: 'Student profile already exists for this email. Use update instead.'
      });
    }

    // ✅ Check if User exists with this email
    let user = await User.findOne({ email: studentData.email });

    // If user doesn't exist, create one
    if (!user) {
      user = await User.create({
        name: studentData.name,
        email: studentData.email,
        password: 'TempPassword@123',
        role: 'student'
      });
      console.log('✅ Created new user account for student');
    } else {
      // User exists - verify it's a student role
      if (user.role !== 'student') {
        return res.status(400).json({
          success: false,
          message: `Email already exists with role: ${user.role}. Cannot register as student.`
        });
      }
      console.log('✅ User account already exists, linking to student profile');
    }

    // Link user ID to student
    studentData.userId = user._id;

    const student = await Student.create(studentData);

    res.status(201).json({
      success: true,
      message: 'Student created successfully',
      data: student
    });
  } catch (error) {
    console.error('Create student error:', error);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Student with this email or APAAR ID already exists in student records'
      });
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/students/:id
// @desc    Update student
// @access  Admin, Institution
router.put('/:id', protect, authorize('admin', 'institution'), async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    res.json({
      success: true,
      message: 'Student updated successfully',
      data: student,
    });
  } catch (error) {
    console.error('Update student error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   DELETE /api/students/:id
// @desc    Delete student (soft delete)
// @access  Admin
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    res.json({ success: true, message: 'Student deleted successfully' });
  } catch (error) {
    console.error('Delete student error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;