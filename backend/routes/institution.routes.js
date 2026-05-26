const express = require('express');
const router = express.Router();
const Institution = require('../models/institution.model');
const User = require('../models/user.model');
const { protect, authorize } = require('../middleware/auth.middleware');

// ==================== SPECIAL ROUTES - MUST BE FIRST ====================

// @route   GET /api/institutions/stats
// @desc    Get institution statistics
// @access  All authenticated users
router.get('/stats', protect, authorize('admin', 'institution'), async (req, res) => {
  try {
    let match = { isActive: true };

    // If institution logs in -> show only its own institution stats
    if (req.user.role === 'institution') {
      match._id = req.user.institutionId || req.user._id;
    }

    const total = await Institution.countDocuments(match);

    const avgNirf = await Institution.aggregate([
      { $match: match },
      { $group: { _id: null, avg: { $avg: "$nirfScore" } } }
    ]);

    res.json({
      success: true,
      data: {
        total,
        avgNirf: avgNirf[0]?.avg?.toFixed(2) || "0.00"
      }
    });

  } catch (error) {
    console.error("Institution Stats Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// ==================== BULK OPERATIONS ====================

// @route   POST /api/institutions/bulk-add
// @desc    Bulk add institutions
// @access  Admin only
router.post('/bulk-add', protect, authorize('admin'), async (req, res) => {
  try {
    const institutionsData = req.body;

    if (!Array.isArray(institutionsData) || institutionsData.length === 0) {
      return res.status(400).json({ success: false, message: "No data provided" });
    }

    const results = { successful: [], failed: [], total: institutionsData.length };

    for (let i = 0; i < institutionsData.length; i++) {
      let inst = institutionsData[i];

      try {
        // Ensure unique AISHE Code
        const aishe = inst.aisheCode && inst.aisheCode.trim() !== ""
          ? inst.aisheCode.trim()
          : `AISHE-${Date.now()}-${i}`;

        // Check if institution exists
        const exists = await Institution.findOne({ aisheCode: aishe });
        if (exists) {
          results.failed.push({
            row: i + 1,
            data: inst,
            error: `Institution with AISHE ${aishe} already exists`,
          });
          continue;
        }

        // ✅ Check if User exists with this email (if email provided)
        let user = null;
        if (inst.email) {
          const email = inst.email.trim().toLowerCase();
          user = await User.findOne({ email });

          if (!user) {
            // Create user account for institution
            user = await User.create({
              name: inst.name?.trim(),
              email: email,
              password: 'TempPassword@123',
              role: 'institution'
            });
          } else if (user.role !== 'institution') {
            results.failed.push({
              row: i + 1,
              data: inst,
              error: `Email exists with role: ${user.role}. Cannot register as institution.`
            });
            continue;
          }
        }

        // Build institution payload
        const newInst = {
          ...inst,
          aisheCode: aishe,
          name: inst.name?.trim(),
          shortName: inst.shortName?.trim(),
          email: inst.email?.trim().toLowerCase(),
          userId: user?._id // ✅ Link to user account if exists
        };

        const created = await Institution.create(newInst);

        results.successful.push({
          row: i + 1,
          id: created._id,
          name: created.name,
          aisheCode: created.aisheCode,
        });

      } catch (err) {
        results.failed.push({
          row: i + 1,
          data: inst,
          error: err.message,
        });
      }
    }

    res.json({
      success: results.successful.length > 0,
      message: `Bulk add completed`,
      results,
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==================== ANALYTICS ROUTE - BEFORE /:id ====================

// @route   GET /api/institutions/:id/analytics
// @desc    Get institution analytics
// @access  Private (Admin, Institution)
router.get('/:id/analytics', protect, authorize('admin', 'institution'), async (req, res) => {
  try {
    console.log('📊 Institution analytics request for ID:', req.params.id);

    const institution = await Institution.findById(req.params.id);

    if (!institution) {
      console.log('❌ Institution not found');
      return res.status(404).json({ success: false, error: 'Institution not found' });
    }

    console.log('✅ Found institution:', institution.name);

    res.json({
      success: true,
      data: {
        institution: {
          name: institution.name,
          location: institution.location || 'India',
          established: institution.established || 2000,
          type: institution.type || 'Autonomous',
          naacGrade: institution.naacGrade || 'A+',
          nirfRank: institution.nirfRank || 104,
          rating: 4.5
        },
        stats: {
          totalStudents: 2100,
          totalFaculty: 349,
          placementRate: 85,
          avgCGPA: 7.8,
          researchPublications: 245,
          patents: 18,
          collaborations: 32,
          alumniNetwork: 5000,
          studentSatisfaction: 88,
          facultyStudentRatio: 15,
          infrastructureScore: 8.5
        },
        rankings: {
          nirfRank: institution.nirfRank || 104,
          naacScore: 80.75,
          naacGrade: 'A+',
          complianceScore: 100
        },
        trends: [
          { year: '2021', students: 1800, avgCGPA: 7.2, placementRate: 78, researchPapers: 180 },
          { year: '2022', students: 1950, avgCGPA: 7.5, placementRate: 82, researchPapers: 210 },
          { year: '2023', students: 2050, avgCGPA: 7.7, placementRate: 84, researchPapers: 230 },
          { year: '2024', students: 2100, avgCGPA: 7.8, placementRate: 85, researchPapers: 245 }
        ],
        departments: [
          { name: 'Computer Science', students: 650, faculty: 85, avgCGPA: 8.2, placementRate: 92 },
          { name: 'Electronics', students: 450, faculty: 62, avgCGPA: 7.8, placementRate: 88 },
          { name: 'Mechanical', students: 520, faculty: 78, avgCGPA: 7.5, placementRate: 82 },
          { name: 'Civil', students: 380, faculty: 58, avgCGPA: 7.4, placementRate: 78 },
          { name: 'MBA', students: 100, faculty: 20, avgCGPA: 7.9, placementRate: 95 }
        ]
      }
    });
  } catch (error) {
    console.error('💥 Institution analytics error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==================== GENERIC CRUD ROUTES - KEEP AT THE END ====================

// @route   GET /api/institutions
// @desc    Get all institutions
// @access  All authenticated users
router.get('/', protect, async (req, res) => {
  try {
    const { search, type, limit } = req.query; // ❗ removed default 50

    let query = { isActive: true };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { aisheCode: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }

    if (type) {
      query.type = type;
    }

    const institutions = await Institution.find(query)
      .limit(parseInt(limit) || 0)   // unlimited
      .sort({ nirfScore: -1 });

    return res.json({
      success: true,
      count: institutions.length,
      data: institutions
    });
  } catch (error) {
    console.error('Get institutions error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});;

// @route   GET /api/institutions/:id
// @desc    Get single institution
// @access  All authenticated users
router.get('/:id', protect, async (req, res) => {
  try {
    const institution = await Institution.findById(req.params.id);

    if (!institution) {
      return res.status(404).json({ success: false, message: 'Institution not found' });
    }

    res.json({ success: true, data: institution });
  } catch (error) {
    console.error('Get institution error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/institutions
// @desc    Create institution
// @access  Admin only
// CREATE institution
router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const institutionData = { ...req.body };

    // AISHE check
    const existingInstitution = await Institution.findOne({
      aisheCode: institutionData.aisheCode
    });
    if (existingInstitution) {
      return res.status(400).json({
        success: false,
        message: 'Institution with this AISHE code already exists'
      });
    }

    let user = null;

    // 🔥 If email provided → create login account
    if (institutionData.email) {
      const email = institutionData.email.trim().toLowerCase();
      user = await User.findOne({ email });

      if (!user) {
        user = await User.create({
          name: institutionData.name,
          email,
          password: 'TempPassword@123',
          role: 'institution'
        });
      } else if (user.role !== 'institution') {
        return res.status(400).json({
          success: false,
          message: `Email already exists with role: ${user.role}. Cannot register as institution.`
        });
      }

      institutionData.userId = user._id;
      institutionData.email = email;
    }

    const institution = await Institution.create(institutionData);

    res.status(201).json({
      success: true,
      message: 'Institution created successfully',
      data: institution,
      tempPassword: 'TempPassword@123'
    });
  } catch (error) {
    console.error('Create institution error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/institutions/:id
// @desc    Update institution
// @access  Admin only
router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const institution = await Institution.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!institution) {
      return res.status(404).json({ success: false, message: 'Institution not found' });
    }

    res.json({
      success: true,
      message: 'Institution updated successfully',
      data: institution,
    });
  } catch (error) {
    console.error('Update institution error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   DELETE /api/institutions/:id
// @desc    Delete institution (soft delete)
// @access  Admin only
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const institution = await Institution.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!institution) {
      return res.status(404).json({ success: false, message: 'Institution not found' });
    }

    res.json({
      success: true,
      message: 'Institution deleted successfully',
    });
  } catch (error) {
    console.error('Delete institution error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;