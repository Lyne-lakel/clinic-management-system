/**
 * =============================================================================
 * PATIENT CONTROLLER — controllers/patientController.js
 * =============================================================================
 *
 * STUDENT DEFENSE NOTE:
 * This controller provides full CRUD operations for Patient records.
 * While the Admin frontend does not currently have a dedicated patient
 * management page, these endpoints are essential because:
 *
 *   1. The dashboard's "Total Patients" stat card queries the Patient collection.
 *   2. The Report generator counts new patients per period.
 *   3. The Appointment model references Patient IDs.
 *   4. Future features (receptionist view, patient portal) will need these endpoints.
 *
 * SEARCH IMPLEMENTATION:
 * We implement a text search across firstName, lastName, and email using
 * MongoDB's $regex operator with the case-insensitive `i` option.
 * =============================================================================
 */

const Patient   = require('../models/Patient');
const logAction = require('../utils/auditLogger');

// Helper: add a frontend-friendly alias `chronicConditions` that maps to `conditions`.
// This keeps the frontend simple (many components expect `chronicConditions`).
function addChronicAlias(doc) {
    if (!doc) return doc;
    // Convert Mongoose document to plain object if needed
    const obj = (typeof doc.toObject === 'function') ? doc.toObject() : { ...doc };
    obj.chronicConditions = obj.conditions ?? 'None';
    return obj;
}

// ─── 1. GET ALL PATIENTS ─────────────────────────────────────────────────────
/**
 * GET /api/patients
 * GET /api/patients?search=ahmed&status=Active
 *
 * STUDENT DEFENSE NOTE:
 * We combine search and filter into one endpoint using optional query parameters.
 * Supports:
 *   ?search=   → full-text search across name and email
 *   ?status=   → filter by 'Active' or 'Inactive'
 *   ?page=, ?limit= → pagination
 */
exports.getAllPatients = async (req, res) => {
    try {
        const { search, status, page = 1, limit = 20 } = req.query;
        const filter = {};

        // Apply status filter if provided.
        if (status) {
            filter.status = status;
        }

        // Apply text search if provided.
        // We search across firstName, lastName, and email simultaneously.
        if (search && search.trim() !== '') {
            filter.$or = [
                { firstName: { $regex: search, $options: 'i' } },
                { lastName:  { $regex: search, $options: 'i' } },
                { email:     { $regex: search, $options: 'i' } },
                { phone:     { $regex: search, $options: 'i' } }
            ];
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const [patients, total] = await Promise.all([
            Patient.find(filter)
                .sort({ createdAt: -1 })    // Newest registrations first
                .skip(skip)
                .limit(parseInt(limit)),
            Patient.countDocuments(filter)
        ]);

        // Map to include `chronicConditions` alias for frontend compatibility
        const patientsWithAlias = patients.map(p => addChronicAlias(p));

        res.status(200).json({
            patients: patientsWithAlias,
            pagination: {
                total,
                page:       parseInt(page),
                limit:      parseInt(limit),
                totalPages: Math.ceil(total / parseInt(limit))
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching patients', error: error.message });
    }
};

// ─── 2. GET SINGLE PATIENT ───────────────────────────────────────────────────
/**
 * GET /api/patients/:id
 *
 * STUDENT DEFENSE NOTE:
 * Fetches a single patient by their MongoDB ObjectId.
 * We also use `.populate('appointments')` conceptually, but since Appointment
 * references Patient (not the other way around), we query appointments separately.
 */
exports.getPatientById = async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.id);
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }
        // Return alias for frontend
        res.status(200).json(addChronicAlias(patient));
    } catch (error) {
        res.status(500).json({ message: 'Error fetching patient', error: error.message });
    }
};

// ─── 3. ADD NEW PATIENT ──────────────────────────────────────────────────────
/**
 * POST /api/patients
 * Body: { firstName, lastName, email, phone, dateOfBirth, gender, bloodType, ... }
 *
 * STUDENT DEFENSE NOTE:
 * We validate required fields (firstName, lastName) before attempting to save.
 * The `error.code === 11000` check handles MongoDB's "duplicate key" error,
 * which occurs when a patient with the same email already exists (unique constraint).
 */
exports.addPatient = async (req, res) => {
    try {
        const {
            firstName, lastName, email, phone,
            dateOfBirth, gender, bloodType, allergies,
            conditions, assignedDoctor, address,
            emergencyContact
        } = req.body;

        // Validate required fields.
        if (!firstName || !lastName) {
            return res.status(400).json({ message: 'First name and last name are required' });
        }

        const newPatient = await Patient.create({
            firstName, lastName, email, phone,
            dateOfBirth, gender, bloodType, allergies,
            conditions, assignedDoctor, address,
            emergencyContact
        });

        await logAction(req, 'Receptionist', 'Receptionist', `Registered new patient: ${firstName} ${lastName}`);

        // Return alias for frontend (`chronicConditions`)
        res.status(201).json(addChronicAlias(newPatient));
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ message: 'A patient with this email already exists' });
        }
        res.status(500).json({ message: 'Error adding patient', error: error.message });
    }
};

// ─── 4. UPDATE PATIENT ───────────────────────────────────────────────────────
/**
 * PUT /api/patients/:id
 * Body: { any updatable fields }
 *
 * STUDENT DEFENSE NOTE:
 * We use `findByIdAndUpdate` with `{ new: true, runValidators: true }`.
 *   - `new: true`: returns the updated document.
 *   - `runValidators: true`: re-runs Schema validation on the updated fields,
 *     ensuring we can't accidentally save invalid data through an update.
 */
exports.updatePatient = async (req, res) => {
    try {
        const updated = await Patient.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true, runValidators: true }
        );

        if (!updated) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        await logAction(req, 'Receptionist', 'Receptionist', `Updated record for patient: ${updated.firstName} ${updated.lastName}`);

        // Return alias for frontend
        res.status(200).json(addChronicAlias(updated));
    } catch (error) {
        res.status(500).json({ message: 'Error updating patient', error: error.message });
    }
};

// ─── 5. DELETE PATIENT ───────────────────────────────────────────────────────
/**
 * DELETE /api/patients/:id
 *
 * STUDENT DEFENSE NOTE:
 * In a real production system, we would NEVER permanently delete a patient
 * record due to medical data regulations. Instead, we would set `status: 'Inactive'`.
 * For this academic project, we implement true deletion for completeness,
 * with a comment noting the real-world alternative.
 *
 * REAL WORLD ALTERNATIVE:
 *   await Patient.findByIdAndUpdate(id, { status: 'Inactive' });  // Soft delete
 */
exports.deletePatient = async (req, res) => {
    try {
        const patient = await Patient.findByIdAndDelete(req.params.id);
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        await logAction(req, 'Receptionist', 'Receptionist', `Deleted patient record: ${patient.firstName} ${patient.lastName}`);

        res.status(200).json({ message: 'Patient record deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting patient', error: error.message });
    }
};
