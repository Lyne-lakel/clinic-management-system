/**
 * =============================================================================
 * PATIENT ROUTES — routes/patientRoutes.js
 * =============================================================================
 *
 * STUDENT DEFENSE NOTE:
 * Patient routes are separated from admin routes because in a full system,
 * different user roles would have different access to patient data:
 *   - Receptionists: can view and add patients
 *   - Doctors: can view and update patient medical notes
 *   - Admin: can view, add, update, delete patients
 *
 * Separating routes by resource (patients, staff, appointments) is a REST
 * best practice and makes the codebase easier to maintain and extend.
 *
 * All routes are prefixed with /api/patients (set in server.js).
 * =============================================================================
 */

const express      = require('express');
const router       = express.Router();
const patientCtrl  = require('../controllers/patientController');

// GET all patients (supports ?search=, ?status=, ?page=, ?limit=)
router.get('/', patientCtrl.getAllPatients);

// GET a single patient by MongoDB ObjectId
router.get('/:id', patientCtrl.getPatientById);

// POST to register a new patient
router.post('/', patientCtrl.addPatient);

// PUT to update a patient's details (full update with validation)
router.put('/:id', patientCtrl.updatePatient);

// DELETE a patient record (with audit logging)
router.delete('/:id', patientCtrl.deletePatient);

module.exports = router;
