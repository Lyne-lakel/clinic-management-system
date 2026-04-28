/**
 * =============================================================================
 * APPOINTMENT CONTROLLER — controllers/appointmentController.js
 * =============================================================================
 *
 * STUDENT DEFENSE NOTE:
 * This controller manages all appointment operations for the Receptionist module.
 * Key responsibilities:
 *
 *   1. CREATE appointments: Receptionist books a patient with a doctor
 *   2. READ appointments: List all, or get one by ID (with time-slot filtering)
 *   3. UPDATE appointments: Change status (Pending → Confirmed → Completed/NoShow)
 *   4. DELETE appointments: Cancel or remove from schedule
 *
 * RELATIONAL LOGIC — HOW IT ALL CONNECTS:
 *
 *   Patient (One) ──┐
 *                   ├─→ Appointment (Many)
 *   Doctor (One)  ──┘
 *
 *   Example:
 *   - Patient "Ahmed" (ObjectId: 507f1f77bcf86cd799439011) can have MANY appointments
 *   - Doctor "Dr. Nouar" (ObjectId: 507f1f77bcf86cd799439012) can have MANY appointments
 *   - Each Appointment document stores BOTH IDs to link them together
 *   - When a receptionist books Ahmed with Dr. Nouar on 2026-04-19 at 09:00,
 *     we create: { patient: 507f..., doctor: 507f..., date: 2026-04-19T09:00, status: 'Pending' }
 *
 * AUDIT LOGGING:
 * Every significant action (create, status change, cancel) triggers an audit log
 * entry so we can track "who booked what when" for compliance and debugging.
 * =============================================================================
 */

const Appointment  = require('../models/Appointment');
const Patient      = require('../models/Patient');
const Staff        = require('../models/Staff');
const logAction    = require('../utils/auditLogger');

// ─── 1. CREATE APPOINTMENT ──────────────────────────────────────────────────────
/**
 * POST /api/receptionist/appointments
 *
 * Request body example:
 * {
 *   patientId: "507f1f77bcf86cd799439011",      // Link to Patient
 *   patientName: "Ahmed Benali",                 // Quick read without joining
 *   doctorId: "507f1f77bcf86cd799439012",       // Link to Staff (doctor)
 *   doctorName: "Dr. Nouar",
 *   date: "2026-04-19T09:00:00Z",                // ISO format date-time
 *   duration: 30,                                 // minutes
 *   reason: "General Consultation",
 *   notes: "Patient mentioned ongoing fatigue"
 * }
 *
 * STUDENT DEFENSE NOTE:
 * We validate that the patientId and doctorId actually exist in the database
 * before creating the appointment. This prevents "orphaned" records that
 * reference non-existent patients or doctors.
 *
 * Return:
 * { _id: "...", patient: {...full document...}, doctor: {...full document...}, ... }
 * (Uses .populate() to return the full Patient and Staff documents, not just IDs)
 */
exports.createAppointment = async (req, res) => {
    try {
        const { patientId, patientName, doctorId, doctorName, date, duration, reason, notes } = req.body;

        // Validation: Required fields
        if (!patientId || !patientName || !doctorId || !date) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: patientId, patientName, doctorId, date'
            });
        }

        // Validation: Patient exists
        const patient = await Patient.findById(patientId);
        if (!patient) {
            return res.status(404).json({
                success: false,
                message: `Patient with ID ${patientId} not found`
            });
        }

        // Validation: Doctor exists and is active
        const doctor = await Staff.findById(doctorId);
        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: `Doctor with ID ${doctorId} not found`
            });
        }

        if (doctor.status !== 'Active') {
            return res.status(400).json({
                success: false,
                message: `Doctor ${doctor.name} is currently suspended`
            });
        }

        // Validation: Check if appointment slot is actually available
        // (Doctor's schedule might have this slot marked as "blocked")
        const appointmentDate = new Date(date);
        const appointmentHours = appointmentDate.getHours();
        const appointmentMinutes = appointmentDate.getMinutes();
        const slotTimeString = `${String(appointmentHours).padStart(2, '0')}:${String(appointmentMinutes).padStart(2, '0')}`;

        // Check if doctor has a schedule and the slot is available
        let isSlotAvailable = true;
        if (doctor.schedule && doctor.schedule.availableSlots && doctor.schedule.availableSlots.length > 0) {
            const slot = doctor.schedule.availableSlots.find(s => s.startTime === slotTimeString);
            if (!slot) {
                return res.status(400).json({
                    success: false,
                    message: `Doctor ${doctor.name} has no slot at ${slotTimeString}`
                });
            }
            if (slot.status === 'blocked') {
                return res.status(400).json({
                    success: false,
                    message: `Slot ${slotTimeString} is blocked for ${doctor.name}`
                });
            }
        }

        // Check if patient already has an appointment at the exact same time
        const existingAppointment = await Appointment.findOne({
            patient: patientId,
            date: appointmentDate
        });
        if (existingAppointment) {
            return res.status(400).json({
                success: false,
                message: `Patient ${patientName} already has an appointment on this date`
            });
        }

        // Create the appointment
        const appointment = new Appointment({
            patient: patientId,
            patientName: patientName,
            doctor: doctorId,
            doctorName: doctorName || doctor.name,
            date: appointmentDate,
            duration: duration || 30,
            reason: reason || 'General Consultation',
            notes: notes || '',
            status: 'Pending'  // Default status when first created
        });

        // Save to database
        await appointment.save();

        // Populate the references so we return full objects, not just IDs
        await appointment.populate('patient');
        await appointment.populate('doctor');

        // Log the action for audit trail
        logAction(req.user?.userId || 'system', 'Appointment', 'create', `Booked ${patientName} with Dr. ${doctorName} on ${date}`);

        res.status(201).json({
            success: true,
            message: 'Appointment created successfully',
            data: appointment
        });

    } catch (err) {
        console.error('[appointmentController.createAppointment] Error:', err);
        res.status(500).json({
            success: false,
            message: 'Failed to create appointment',
            error: err.message
        });
    }
};

// ─── 2. GET ALL APPOINTMENTS ────────────────────────────────────────────────────
/**
 * GET /api/receptionist/appointments
 * Supports filters:
 *   ?date=2026-04-19               (appointments on a specific date)
 *   ?doctorId=507f...              (appointments for a specific doctor)
 *   ?status=Pending                (appointments with a specific status)
 *   ?page=1&limit=20               (pagination)
 *
 * STUDENT DEFENSE NOTE:
 * The receptionist needs to see:
 * 1. Today's appointments (for the queue view)
 * 2. Appointments for a specific doctor (to check availability)
 * 3. Appointments with status="Pending" (to confirm or reschedule)
 *
 * We support flexible filtering using query parameters.
 */
exports.getAllAppointments = async (req, res) => {
    try {
        const { date, doctorId, status, page = 1, limit = 50 } = req.query;
        const skip = (page - 1) * limit;
        const filter = {};

        // Apply date filter if provided (matches the entire day)
        if (date) {
            const startOfDay = new Date(date);
            const endOfDay = new Date(date);
            endOfDay.setDate(endOfDay.getDate() + 1);
            filter.date = { $gte: startOfDay, $lt: endOfDay };
        }

        // Apply doctor filter if provided
        if (doctorId) {
            filter.doctor = doctorId;
        }

        // Apply status filter if provided
        if (status) {
            filter.status = status;
        }

        // Fetch appointments with populated references
        const appointments = await Appointment
            .find(filter)
            .populate('patient', 'firstName lastName phone')  // Include only essential patient fields
            .populate('doctor', 'name role')                  // Include only essential doctor fields
            .sort({ date: 1 })  // Sort by date ascending (earliest first)
            .skip(skip)
            .limit(limit);

        // Get total count for pagination metadata
        const total = await Appointment.countDocuments(filter);

        res.status(200).json({
            success: true,
            data: appointments,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total: total,
                pages: Math.ceil(total / limit)
            }
        });

    } catch (err) {
        console.error('[appointmentController.getAllAppointments] Error:', err);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch appointments',
            error: err.message
        });
    }
};

// ─── 3. GET SINGLE APPOINTMENT ──────────────────────────────────────────────────
/**
 * GET /api/receptionist/appointments/:id
 *
 * Fetch a single appointment by its MongoDB ObjectId.
 * Used by the Queue page to get full details of a selected appointment.
 */
exports.getAppointmentById = async (req, res) => {
    try {
        const { id } = req.params;

        const appointment = await Appointment
            .findById(id)
            .populate('patient')
            .populate('doctor');

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: `Appointment with ID ${id} not found`
            });
        }

        res.status(200).json({
            success: true,
            data: appointment
        });

    } catch (err) {
        console.error('[appointmentController.getAppointmentById] Error:', err);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch appointment',
            error: err.message
        });
    }
};

// ─── 4. UPDATE APPOINTMENT STATUS ───────────────────────────────────────────────
/**
 * PATCH /api/receptionist/appointments/:id/status
 *
 * Request body:
 * { status: "Confirmed" | "Completed" | "No Show" | "Cancelled" }
 *
 * STUDENT DEFENSE NOTE:
 * The appointment status follows a workflow:
 *   Pending → Confirmed → Completed (or No Show if patient didn't show)
 *   Pending → Cancelled (if receptionist cancels)
 *
 * This endpoint is used by:
 * 1. Queue Manager: Mark patient as "present" or "no show"
 * 2. Doctor: Mark appointment as "completed"
 * 3. Admin: Manually adjust status if needed
 *
 * Every status change is logged in the audit trail.
 */
exports.updateAppointmentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // Validation: Valid status value
        const validStatuses = ['Pending', 'Confirmed', 'Completed', 'Cancelled', 'No Show'];
        if (!status || !validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
            });
        }

        // Find and update
        const appointment = await Appointment.findByIdAndUpdate(
            id,
            { status: status },
            { new: true }  // Return the updated document
        ).populate('patient').populate('doctor');

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: `Appointment with ID ${id} not found`
            });
        }

        // Log the status change
        logAction(
            req.user?.userId || 'system',
            'Appointment',
            'update',
            `Changed appointment status to ${status} for ${appointment.patientName}`
        );

        res.status(200).json({
            success: true,
            message: `Appointment status updated to ${status}`,
            data: appointment
        });

    } catch (err) {
        console.error('[appointmentController.updateAppointmentStatus] Error:', err);
        res.status(500).json({
            success: false,
            message: 'Failed to update appointment status',
            error: err.message
        });
    }
};

// ─── 5. DELETE APPOINTMENT ──────────────────────────────────────────────────────
/**
 * DELETE /api/receptionist/appointments/:id
 *
 * Remove an appointment from the schedule entirely.
 * Used when: patient cancels, receptionist books wrong slot, etc.
 *
 * STUDENT DEFENSE NOTE:
 * We soft-delete by changing status to "Cancelled" rather than hard-deleting,
 * so we maintain a complete audit trail of all bookings (including cancelled ones).
 * This is important for:
 * - "No Show Rate" calculations (includes historical data)
 * - Compliance audits (all changes must be traceable)
 */
exports.deleteAppointment = async (req, res) => {
    try {
        const { id } = req.params;

        const appointment = await Appointment.findByIdAndUpdate(
            id,
            { status: 'Cancelled' },
            { new: true }
        );

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: `Appointment with ID ${id} not found`
            });
        }

        // Log the cancellation
        logAction(
            req.user?.userId || 'system',
            'Appointment',
            'delete',
            `Cancelled appointment for ${appointment.patientName}`
        );

        res.status(200).json({
            success: true,
            message: 'Appointment cancelled successfully',
            data: appointment
        });

    } catch (err) {
        console.error('[appointmentController.deleteAppointment] Error:', err);
        res.status(500).json({
            success: false,
            message: 'Failed to cancel appointment',
            error: err.message
        });
    }
};

// ─── 6. GET DOCTOR'S AVAILABLE SLOTS ────────────────────────────────────────────
/**
 * GET /api/receptionist/doctors/:doctorId/available-slots?date=2026-04-19
 *
 * Returns the time slots available for a specific doctor on a specific date.
 * This powers the "Smart Booking" feature where the receptionist sees:
 *   [09:00-09:30 ✓]  [09:35-10:05 ✓]  [14:00-14:30 ✗]
 *
 * STUDENT DEFENSE NOTE:
 * This endpoint is the CORE of the "Check Availability" feature.
 * It reads the doctor's schedule.availableSlots and filters out:
 * 1. Slots marked as "blocked" (prayer time, lunch, etc.)
 * 2. Slots already booked by other patients
 *
 * Returns an array like:
 * [
 *   { startTime: "09:00", endTime: "09:30", status: "available" },
 *   { startTime: "09:35", endTime: "10:05", status: "available" },
 *   { startTime: "10:10", endTime: "10:40", status: "booked" }
 * ]
 */
exports.getDoctorAvailableSlots = async (req, res) => {
    try {
        const { doctorId } = req.params;
        const { date } = req.query;

        // Validation: doctorId and date are provided
        if (!doctorId || !date) {
            return res.status(400).json({
                success: false,
                message: 'doctorId and date query parameter are required'
            });
        }

        // Find the doctor
        const doctor = await Staff.findById(doctorId);
        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: `Doctor with ID ${doctorId} not found`
            });
        }

        // Check if doctor has a schedule configured
        if (!doctor.schedule || !doctor.schedule.availableSlots || doctor.schedule.availableSlots.length === 0) {
            return res.status(200).json({
                success: true,
                message: 'Doctor has no schedule configured',
                data: []
            });
        }

        // Get all appointments for this doctor on this date
        const appointmentDate = new Date(date);
        const nextDay = new Date(appointmentDate);
        nextDay.setDate(nextDay.getDate() + 1);

        const existingAppointments = await Appointment.find({
            doctor: doctorId,
            date: {
                $gte: appointmentDate,
                $lt: nextDay
            },
            status: { $ne: 'Cancelled' }  // Don't count cancelled appointments
        });

        // Build list of booked times
        const bookedTimes = existingAppointments.map(apt => apt.date.toTimeString().slice(0, 5)); // "09:00"

        // Enhance slots with availability status
        const slotsWithStatus = doctor.schedule.availableSlots.map(slot => ({
            startTime: slot.startTime,
            endTime: slot.endTime,
            status: slot.status === 'blocked' ? 'blocked' : (bookedTimes.includes(slot.startTime) ? 'booked' : 'available')
        }));

        res.status(200).json({
            success: true,
            data: slotsWithStatus,
            doctor: {
                _id: doctor._id,
                name: doctor.name,
                role: doctor.role
            }
        });

    } catch (err) {
        console.error('[appointmentController.getDoctorAvailableSlots] Error:', err);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch available slots',
            error: err.message
        });
    }
};
