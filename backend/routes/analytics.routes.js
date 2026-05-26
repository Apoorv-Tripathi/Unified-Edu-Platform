const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');
const analyticsController = require('../controllers/analytics.controller');

// Overview routes
router.get('/overview', protect, authorize('admin'), analyticsController.getOverview);

router.get('/institution/:id/overview', protect, authorize('admin', 'institution'), analyticsController.getInstitutionOverview);

router.get('/student/:id', protect, analyticsController.getStudentAnalytics);

// Predictive analytics
router.get('/predictive/dropout-risk/:institutionId', protect, analyticsController.getDropoutRisk);

// Trends
router.get('/trends/:institutionId', protect, analyticsController.getTrendAnalysis);

// Compliance metrics
router.get('/compliance/:institutionId', protect, authorize('admin', 'institution'), analyticsController.getComplianceMetrics);

// Comparative analysis
router.get('/comparative', protect, authorize('admin', 'institution'), analyticsController.getComparativeAnalysis);

module.exports = router;