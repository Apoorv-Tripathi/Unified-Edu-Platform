const express = require('express');
const router = express.Router();
const schemeController = require('../controllers/scheme.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

// Public routes
router.get('/', schemeController.getSchemes);

// Admin routes
router.get('/analytics', authenticate, authorize(['admin']), schemeController.getSchemeAnalytics);
router.post('/', authenticate, authorize(['admin']), schemeController.createScheme);
router.put('/:id', authenticate, authorize(['admin']), schemeController.updateScheme);

// Institution routes
router.get('/institution/:institutionId/stats', authenticate, authorize(['admin', 'institution']), schemeController.getInstitutionSchemeStats);

// Enrollment routes
router.post('/enroll', authenticate, authorize(['admin', 'institution']), schemeController.enrollStudent);
router.put('/enrollment/status', authenticate, authorize(['admin', 'institution']), schemeController.updateEnrollmentStatus);

module.exports = router;