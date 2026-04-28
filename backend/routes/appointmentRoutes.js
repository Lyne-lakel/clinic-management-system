const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');

/**
 * =============================================================================
 * APPOINTMENT ROUTES — routes/appointmentRoutes.js
 * =============================================================================
 *
 * STUDENT DEFENSE NOTE:
 * This router handles general appointment endpoints, such as the public 
 * waiting room Live Queue Screen.
 * 
 * GET /api/appointments/queue
 * Determines the currently called patient based on the time, lists the next 
 * upcoming patients, and provides health tips if the doctor is on rest.
 * =============================================================================
 */

router.get('/queue', appointmentController.getQueue);

module.exports = router;
