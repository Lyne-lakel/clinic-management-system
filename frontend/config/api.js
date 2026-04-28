/**
 * =============================================================================
 * MASTER API CONFIGURATION — frontend/config/api.js
 * 
 *=============================================================================
 * SINGLE SOURCE OF TRUTH for all API endpoints.
 * Import this constant into any page/component that needs to make API calls.
 *
 * WHY THIS MATTERS:
 * - If you ever need to change the backend URL, you only change it in ONE place
 * - No more hardcoded "http://localhost:5000" scattered throughout 100 files
 * - Easy to switch between dev/production URLs based on environment
 *
 * USAGE IN YOUR PAGES:
 * ```javascript
 * import { API_ADMIN, API_PATIENTS } from '@/config/api';
 * 
 * const response = await fetch(`${API_ADMIN}/reports`);
 * const patientRes = await fetch(`${API_PATIENTS}/${patientId}`);
 * ```
 * =============================================================================
 */

// Admin API: staff, reports, audit logs, dashboard stats, settings
export const API_ADMIN = "http://localhost:5000/api/admin";

// Patient API: patient records, medical history
export const API_PATIENTS = "http://localhost:5000/api/patients";

// Receptionist API: appointments, queue management, patient registration
export const API_RECEPTIONIST = "http://localhost:5000/api/receptionist";

// Health check endpoint (useful for connection status)
export const API_HEALTH = "http://localhost:5000/api/health";

// Fallback/default (for simple cases where you just need the base URL)
export const API_BASE = "http://localhost:5000";
