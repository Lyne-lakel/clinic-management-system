/**
 * =============================================================================
 * ADMIN ROUTES — routes/adminRoutes.js
 * =============================================================================
 *
 * STUDENT DEFENSE NOTE:
 * This file is the "traffic directory" of our backend. It defines WHICH function
 * runs when a specific URL is requested. The actual logic lives in controllers.
 *
 * MVC FLOW:
 *   Browser Request → server.js → adminRoutes.js (routing) → Controller (logic) → Model (data)
 *
 * Route organisation (grouped by feature for readability):
 *   /api/admin/staff/*       → Staff CRUD (adminController)
 *   /api/admin/stats         → Dashboard analytics (statsController)
 *   /api/admin/audit-logs/*  → Audit log reads (auditController)
 *   /api/admin/reports/*     → Report generation & export (reportController)
 *   /api/admin/settings/*    → System settings & backup (settingsController)
 * =============================================================================
 */

const express = require('express');
const router  = express.Router();

// Import all controllers
const adminCtrl    = require('../controllers/adminController');
const statsCtrl    = require('../controllers/statsController');
const auditCtrl    = require('../controllers/auditController');
const reportCtrl   = require('../controllers/reportController');
const settingsCtrl = require('../controllers/settingsController');

// ─── STAFF MANAGEMENT ROUTES ──────────────────────────────────────────────────

// GET all staff (sorted newest first)
router.get('/staff', adminCtrl.getAllStaff);

// GET staff by search query: /api/admin/staff/search?q=ahmed
// IMPORTANT: This must be defined BEFORE `/staff/:id` to prevent Express
// from treating "search" as an ID parameter.
router.get('/staff/search', adminCtrl.searchStaff);

// POST a new staff member (accepts all fields from the Add Staff modal)
router.post('/add-staff', adminCtrl.addStaff);

// DELETE a specific staff member by their MongoDB ObjectId
router.delete('/delete-staff/:id', adminCtrl.deleteStaff);

// PATCH to toggle status between 'Active' and 'Suspended'
// Using PATCH (not PUT) because we're only changing one field, not the whole document.
router.patch('/toggle-status/:id', adminCtrl.toggleStatus);

// GET the saved schedule for a specific doctor (pre-populates the modal).
// Must be defined BEFORE /staff/:id (more specific route first).
router.get('/staff/:id/schedule', adminCtrl.getStaffSchedule);

// PUT to save the admin's configured schedule (slots array + config).
router.put('/staff/:id/schedule', adminCtrl.updateStaffSchedule);


// ─── DASHBOARD ANALYTICS ROUTES ───────────────────────────────────────────────

// GET all dashboard statistics in a single call.
// This powers all 5 stat cards + monthly activity table + staff workload table.
router.get('/stats', statsCtrl.getDashboardStats);


// ─── AUDIT LOG ROUTES ─────────────────────────────────────────────────────────

// GET all audit logs with optional ?search= and ?role= filters + pagination.
// Powers the Audit Logs page table.
router.get('/audit-logs', auditCtrl.getAuditLogs);

// GET the 20 most recent audit log entries (lightweight, for summary widgets).
router.get('/audit-logs/recent', auditCtrl.getRecentLogs);


// ─── SYSTEM REPORTS ROUTES ────────────────────────────────────────────────────

// POST to generate a new report for a given { type, month, year }.
// Calculates real stats and saves a Report document.
router.post('/reports/generate', reportCtrl.generateReport);

// GET all previously generated reports (for the "Previous Reports" list).
router.get('/reports', reportCtrl.getAllReports);

// IMPORTANT: `/reports/export/:id` MUST be defined BEFORE `/reports/:id`.
// Reason: Express matches routes top-to-bottom. If /reports/:id is first,
// Express treats "export" as the :id value and calls getReportById instead of exportReport.
// Always define more specific routes before more general parameterised ones.

// GET a CSV file download for a specific report.
// The browser will download this as a file due to the Content-Disposition header set in the controller.
router.get('/reports/export/:id', reportCtrl.exportReport);

// GET the full data of a single report by ID.
router.get('/reports/:id', reportCtrl.getReportById);


// ─── SYSTEM SETTINGS ROUTES ───────────────────────────────────────────────────

// GET the clinic settings (includes dynamic system health data).
// Powers the Settings page initial load.
router.get('/settings', settingsCtrl.getSettings);

// PUT to update the working hours (the only editable field in the Settings UI).
router.put('/settings', settingsCtrl.updateSettings);

// POST to trigger a manual system backup (updates lastBackup timestamp + audit log).
router.post('/settings/backup', settingsCtrl.triggerBackup);


// Export the router to be used in server.js
module.exports = router;