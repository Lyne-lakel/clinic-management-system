const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

/**
 * =============================================================================
 * AUTHENTICATION ROUTES — routes/authRoutes.js
 * =============================================================================
 *
 * STUDENT DEFENSE NOTE:
 * This router defines the endpoints related to authentication.
 * 
 * POST /api/auth/login 
 * Handles the login request by calling the login function in authController.
 * =============================================================================
 */

// POST route for staff login
router.post('/login', authController.login);

module.exports = router;
