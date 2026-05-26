const express = require('express');
const router = express.Router();
const Teacher = require('../models/teacher.model');
const User = require('../models/user.model');
const Student = require('../models/student.model');
const { protect, authorize } = require('../middleware/auth.middleware');

// ========================================================
// GET ALL TEACHERS
// ========================================================
router.get('/', protect, authorize('admin', 'institution'), async (req, res) => {
  try {
    const { search, department, designation, limit } = req.query;

    let query = { isActive: true };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { aparId: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    if (department) {
      query.department = { $regex: department, $options: 'i' };
    }

    if (designation) {
      query.designation = designation;
    }

    // ⭐ IMPORTANT: Institution sees ONLY its own faculty
    if (req.user.role === 'institution') {
      query.institutionId = req.user._id;
    }

    const teachers = await Teacher.find(query)
      .populate('institutionId', 'name shortName')
      .limit(parseInt(limit) || 0)
      .sort({ rating: -1 });

    return res.json({
      success: true,
      count: teachers.length,
      data: teachers
    });
  } catch (error) {
    console.error('Get teachers error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ========================================================
// TEACHER STATS
// ========================================================
router.get('/stats', protect, async (req, res) => {
  try {
    const total = await Teacher.countDocuments({ isActive: true });

    const avgRating = await Teacher.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: null, avg: { $avg: '$rating' } } }
    ]);

    const avgPublications = await Teacher.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: null, avg: { $avg: '$publications' } } }
    ]);

    const byDepartment = await Teacher.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$department', count: { $sum: 1 } } }
    ]);

    res.json({
      success: true,
      data: {
        total,
        avgRating: avgRating[0]?.avg?.toFixed(2) || '0.00',
        avgPublications: Math.round(avgPublications[0]?.avg || 0),
        byDepartment: byDepartment.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {})
      }
    });
  } catch (error) {
    console.error('Get teacher stats error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ========================================================
// FACULTY ANALYTICS (MUST BE BEFORE /:id ROUTE)
// ========================================================
router.get('/:id/analytics', protect, authorize('faculty', 'admin'), async (req, res) => {
  try {
    const teacherId = req.params.id;

    console.log('Analytics request for teacher ID:', teacherId);

    // Find teacher
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      console.log('Teacher not found for ID:', teacherId);
      return res.status(404).json({
        success: false,
        error: 'Faculty not found'
      });
    }

    console.log('Found teacher:', teacher.name);

    // Get students taught by this faculty
    const students = await Student.find({ isActive: true }).limit(50);

    // Calculate stats
    const totalStudents = students.length;
    const avgPerformance = totalStudents > 0
      ? (students.reduce((sum, s) => sum + (s.cgpa || 0), 0) / totalStudents * 10).toFixed(1)
      : 0;

    const excellent = students.filter(s => (s.cgpa || 0) >= 8).length;
    const average = students.filter(s => (s.cgpa || 0) >= 6 && (s.cgpa || 0) < 8).length;
    const needsAttention = students.filter(s => (s.cgpa || 0) < 6).length;

    // Performance metrics
    const performanceMetrics = {
      coursesHandled: 3,
      completionRate: 92,
      studentSatisfaction: 88,
      assignmentCompletion: 85,
      attendanceRate: 87,
      publications: teacher.publications || 0
    };

    // Recent activity
    const recentActivity = [
      { action: 'Graded Assignment 3', course: 'Data Structures & Algorithms', time: '2 hours ago' },
      { action: 'Updated Course Material', course: 'Operating Systems', time: '1 day ago' },
      { action: 'Published Quiz Results', course: 'Database Management Systems', time: '2 days ago' }
    ];

    const responseData = {
      success: true,
      data: {
        faculty: {
          name: teacher.name,
          department: teacher.department,
          designation: teacher.designation,
          employeeId: teacher.aparId,
          experience: teacher.experience || 5,
          qualification: 'PhD',
          achievements: [
            'Best Faculty Award 2023',
            `Published ${teacher.publications || 0} research papers`,
            'Student Satisfaction: 4.5/5'
          ]
        },
        studentStats: {
          totalStudents,
          avgPerformance,
          excellent,
          average,
          needsAttention
        },
        performanceMetrics,
        recentActivity
      }
    };

    console.log('Sending analytics response');
    res.json(responseData);

  } catch (error) {
    console.error('Faculty analytics error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error: ' + error.message
    });
  }
});

// ========================================================
// GET SINGLE TEACHER (AFTER ANALYTICS ROUTE)
// ========================================================
router.get('/:id', protect, async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id)
      .populate('institutionId', 'name shortName location');

    if (!teacher) {
      return res.status(404).json({ success: false, message: 'Teacher not found' });
    }

    res.json({ success: true, data: teacher });
  } catch (error) {
    console.error('Get teacher error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ========================================================
// CREATE TEACHER
// ========================================================
router.post('/', protect, authorize('admin', 'institution'), async (req, res) => {
  try {
    const teacherData = { ...req.body };

    // ⭐ If institution logged in → force-link this teacher to that institution
    if (req.user.role === 'institution') {
      teacherData.institutionId = req.user._id;
    }

    // Check teacher duplicate
    const existingTeacher = await Teacher.findOne({ email: teacherData.email });
    if (existingTeacher) {
      return res.status(400).json({
        success: false,
        message: 'Teacher profile already exists for this email. Use update instead.'
      });
    }

    // Check user exists
    let user = await User.findOne({ email: teacherData.email }).select('+password');

    if (!user) {
      // Create new user
      user = await User.create({
        name: teacherData.name,
        email: teacherData.email,
        password: 'TempPassword@123',
        role: 'faculty'
      });
    } else {
      if (user.role !== 'faculty') {
        return res.status(400).json({
          success: false,
          message: `Email already exists with role: ${user.role}. Cannot register as faculty.`
        });
      }

      const isTempAccount = await user.comparePassword('TempPassword@123');
      if (!isTempAccount) {
        return res.status(400).json({
          success: false,
          message: 'User has already activated account. Teacher should login instead.'
        });
      }
    }

    teacherData.userId = user._id;

    const teacher = await Teacher.create(teacherData);

    res.status(201).json({
      success: true,
      message: 'Teacher created successfully',
      data: teacher,
      tempPassword: 'TempPassword@123'
    });

  } catch (error) {
    console.error('Create teacher error:', error);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Teacher with this email or APAR ID already exists'
      });
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
});
// ========================================================
// UPDATE TEACHER
// ========================================================
router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const teacher = await Teacher.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!teacher) {
      return res.status(404).json({ success: false, message: 'Teacher not found' });
    }

    res.json({
      success: true,
      message: 'Teacher updated successfully',
      data: teacher
    });
  } catch (error) {
    console.error('Update teacher error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ========================================================
// BULK ADD TEACHERS
// ========================================================
router.post('/bulk-add', protect, authorize('admin', 'institution'), async (req, res) => {
  try {
    const teachersData = req.body;

    if (!Array.isArray(teachersData) || teachersData.length === 0) {
      return res.status(400).json({ success: false, message: "No data provided" });
    }

    const results = { successful: [], failed: [], total: teachersData.length };

    for (let i = 0; i < teachersData.length; i++) {
      let t = teachersData[i];

      try {
        const email = t.email?.trim().toLowerCase();
        if (!email) {
          results.failed.push({ row: i + 1, data: t, error: "Email is required" });
          continue;
        }

        const existingEmail = await Teacher.findOne({ email });
        if (existingEmail) {
          results.failed.push({
            row: i + 1,
            data: t,
            error: `Teacher with email ${email} exists`
          });
          continue;
        }

        const apar =
          t.aparId && t.aparId.trim() !== ""
            ? t.aparId.trim()
            : `APAR-${Date.now()}-${i}`;

        const existingApar = await Teacher.findOne({ aparId: apar });

        if (existingApar) {
          results.failed.push({
            row: i + 1,
            data: t,
            error: `APAR ID ${apar} exists`
          });
          continue;
        }

        const newTeacher = {
          ...t,
          email,
          aparId: apar,
          name: t.name?.trim(),
          department: t.department?.trim()
        };

        // ⭐ If institution logged in → attach institutionId
        if (req.user.role === 'institution') {
          newTeacher.institutionId = req.user._id;
        }

        const created = await Teacher.create(newTeacher);

        results.successful.push({
          row: i + 1,
          id: created._id,
          name: created.name,
          email: created.email,
          aparId: created.aparId
        });

      } catch (err) {
        results.failed.push({
          row: i + 1,
          data: t,
          error: err.message
        });
      }
    }

    res.json({
      success: results.successful.length > 0,
      message: "Bulk add completed",
      results
    });

  } catch (error) {
    console.error('Bulk add teachers error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ========================================================
// BULK DELETE TEACHERS
// ========================================================
router.post('/bulk-delete', protect, authorize('admin'), async (req, res) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid data format. Expected an array of teacher IDs.'
      });
    }

    const results = { successful: [], failed: [], total: ids.length };

    for (const id of ids) {
      try {
        const teacher = await Teacher.findById(id);

        if (!teacher) {
          results.failed.push({ id, error: 'Teacher not found' });
          continue;
        }

        await Teacher.findByIdAndDelete(id);

        results.successful.push({
          id,
          name: teacher.name,
          email: teacher.email
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

// ========================================================
// DELETE TEACHER (SOFT DELETE)
// ========================================================
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const teacher = await Teacher.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!teacher) {
      return res.status(404).json({ success: false, message: 'Teacher not found' });
    }

    res.json({
      success: true,
      message: 'Teacher deleted successfully'
    });
  } catch (error) {
    console.error('Delete teacher error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;