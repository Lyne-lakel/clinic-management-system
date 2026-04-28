# RECEPTIONIST MODULE - ARCHITECTURE & DATA FLOW DIAGRAM

## 🏗️ SYSTEM ARCHITECTURE

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              RECEPTIONIST PAGES                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────────────┐  ┌──────────────────────┐  ┌──────────────────┐ │
│  │  Appointments Page   │  │    Queue Page        │  │   Patients Page  │ │
│  │  ─────────────────   │  │  ─────────────────   │  │  ───────────────│ │
│  │ - List all appts     │  │ - Show today's queue │  │ - List patients │ │
│  │ - Filter by doctor   │  │ - Mark present/skip  │  │ - Add new       │ │
│  │ - Search by patient  │  │ - Call next patient  │  │ - Update info   │ │
│  │ - View details       │  │ - Complete appt      │  │ - Search & sort │ │
│  └──────┬───────────────┘  └──────┬──────────────┘  └────────┬─────────┘ │
│         │                         │                         │             │
│         └─────────────────────────┼─────────────────────────┘             │
│                                   │                                       │
│                          SmartBookingModal                                 │
│                      (imported into Queue page)                            │
│                    ┌─────────────────────────────┐                        │
│                    │ - Select doctor             │                        │
│                    │ - Pick date                 │                        │
│                    │ - Fetch available slots     │                        │
│                    │ - Display time cards        │                        │
│                    │ - Book appointment          │                        │
│                    └────────────┬────────────────┘                        │
│                                 │                                        │
└─────────────────────────────────┼────────────────────────────────────────┘
                                  │
                    Calls (fetch) API endpoints
                                  │
                   ┌──────────────▼───────────────┐
                   │                              │
┌──────────────────────────────────────────────────────────────────────────┐
│                     EXPRESS BACKEND API                                   │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│  /api/receptionist (Route prefix: receptionistRoutes.js)                 │
│  ────────────────────────────────────────────────────────────────────    │
│                                                                            │
│  ┌─────────────────────────────────────────────────────────────────────┐ │
│  │ APPOINTMENTS ENDPOINTS (appointmentController.js)                   │ │
│  │ ──────────────────────────────────────────────────────────          │ │
│  │ POST   /appointments              → createAppointment()            │ │
│  │ GET    /appointments              → getAllAppointments()           │ │
│  │ GET    /appointments/:id          → getAppointmentById()           │ │
│  │ PATCH  /appointments/:id/status   → updateAppointmentStatus()      │ │
│  │ DELETE /appointments/:id          → deleteAppointment()            │ │
│  └────────────────────────────┬──────────────────────────────────────┘ │
│                               │                                         │
│  ┌─────────────────────────────────────────────────────────────────────┐ │
│  │ SMART BOOKING ENDPOINT (appointmentController.js)                  │ │
│  │ ─────────────────────────────────────────────────────               │ │
│  │ GET    /doctors/:id/available-slots → getDoctorAvailableSlots()    │ │
│  │        Fetches doctor's schedule + checks existing appointments    │ │
│  │        Returns: [{ startTime, endTime, status }, ...]              │ │
│  └────────────────────────────┬──────────────────────────────────────┘ │
│                               │                                         │
│  ┌─────────────────────────────────────────────────────────────────────┐ │
│  │ PATIENT ENDPOINTS (patientController.js - reused)                   │ │
│  │ ────────────────────────────────────────────────                    │ │
│  │ GET    /patients                   → getAllPatients()              │ │
│  │ GET    /patients/:id               → getPatientById()              │ │
│  │ POST   /patients                   → addPatient()                  │ │
│  │ PUT    /patients/:id               → updatePatient()               │ │
│  └────────────────────────────┬──────────────────────────────────────┘ │
│                               │                                         │
│                        Calls Database                                    │
│                               │                                         │
└───────────────────────────────┼──────────────────────────────────────────┘
                                │
┌───────────────────────────────▼──────────────────────────────────────────┐
│                    MONGODB DATABASE                                       │
├───────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│  ┌──────────────────────┐  ┌──────────────────────┐  ┌─────────────────┐│
│  │    PATIENT           │  │    APPOINTMENT       │  │      STAFF      ││
│  │    ─────────────     │  │    ──────────────    │  │     ──────      ││
│  │ _id: ObjectId        │  │ _id: ObjectId        │  │ _id: ObjectId   ││
│  │ firstName: String    │  │ patient: ObjectId ─┐ │  │ name: String    ││
│  │ lastName: String     │  │ patientName: Str ──┼─┼──→ role: String    ││
│  │ phone: String        │  │ doctor: ObjectId ──┼─┼─┐│ email: String   ││
│  │ dateOfBirth: Date    │  │ doctorName: Str    │  │ ││ schedule: {     ││
│  │ allergies: String    │  │ date: Date         │  │ ││   slots: [...]  ││
│  │ conditions: String   │  │ duration: Number   │  │ ││   start/end     ││
│  │ status: Active/...   │  │ reason: String     │  │ ││   status        ││
│  │ assignedDoctor: Str  │  │ status: Pending/.. │  │ ││ }               ││
│  │ emergencyContact: {} │  │ notes: String      │  │ ││ status: Active  ││
│  │ createdAt: Date      │  │ createdAt: Date    │  │ ││ joined: Date    ││
│  │ updatedAt: Date      │  │ updatedAt: Date    │  │ ││ consultations   ││
│  │                      │  │                    │  │ ││ ...             ││
│  └──────────────────────┘  └────────────────────┘  └─┴────────────────┘│
│                                                                           │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │ AUDITLOG                                                         │   │
│  │ ────────                                                         │   │
│  │ _id: ObjectId                                                   │   │
│  │ user: String (receptionist ID)                                 │   │
│  │ action: String (e.g., "Booked Ahmed with Dr. Nouar")          │   │
│  │ resource: String ("Appointment", "Patient", etc.)              │   │
│  │ type: String ("create", "update", "delete")                    │   │
│  │ timestamp: Date                                                 │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                           │
└───────────────────────────────────────────────────────────────────────────┘
```

---

## 🔄 DATA FLOW: Creating an Appointment

```
STEP 1: Receptionist opens "New Appointment" form
    ↓
    Receptionist selects patient: "Ahmed Benali" (already in database)
    ↓
    Receptionist selects doctor from dropdown: "Dr. Nouar"
    ↓
STEP 2: Component calls API to get available slots
    
    Frontend Code:
    const response = await fetch(
      '/api/receptionist/doctors/507f1f77bcf86cd799439012/available-slots?date=2026-04-19'
    );
    
    Backend Processes:
    ├─ Find doctor with ID 507f1f77bcf86cd799439012
    ├─ Get doctor's schedule.availableSlots
    ├─ Query Appointment collection for conflicts
    └─ Return slots with status: "available", "booked", or "blocked"
    
    ↓
    Response back to frontend:
    {
      data: [
        { startTime: "09:00", endTime: "09:30", status: "available" },
        { startTime: "09:35", endTime: "10:05", status: "available" },
        { startTime: "10:10", endTime: "10:40", status: "booked" },
        { startTime: "14:00", endTime: "14:30", status: "blocked" }
      ]
    }
    ↓
STEP 3: SmartBookingModal displays time cards
    
    UI shows:
    ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
    │ 09:00-   │ │ 09:35-   │ │ 10:10-   │ │ 14:00-   │
    │ 09:30 ✓  │ │ 10:05 ✓  │ │ 10:40 ✗  │ │ 14:30 ✗  │
    │ GREEN    │ │ GREEN    │ │ RED      │ │ GRAY     │
    └──────────┘ └──────────┘ └──────────┘ └──────────┘
    
    ↓
STEP 4: Receptionist clicks available slot (green)
    
    Selected: 09:00-09:30
    
    ↓
STEP 5: Click "Confirm Booking" button
    
    Frontend sends:
    POST /api/receptionist/appointments
    {
      patientId: "507f1f77bcf86cd799439011",
      patientName: "Ahmed Benali",
      doctorId: "507f1f77bcf86cd799439012",
      doctorName: "Dr. Nouar",
      date: "2026-04-19T09:00:00Z",
      duration: 30,
      reason: "General Consultation",
      notes: "Patient has been having headaches"
    }
    
    ↓
    Backend Validation:
    ├─ Check Patient exists ✓
    ├─ Check Doctor exists ✓
    ├─ Check Doctor is active ✓
    ├─ Check slot not blocked ✓
    ├─ Check slot not already booked ✓
    └─ Check patient doesn't have appointment same time ✓
    
    ↓
    Backend creates Appointment document:
    {
      _id: ObjectId("607e2f77bcf86cd799439022"),
      patient: ObjectId("507f1f77bcf86cd799439011"),
      patientName: "Ahmed Benali",
      doctor: ObjectId("507f1f77bcf86cd799439012"),
      doctorName: "Dr. Nouar",
      date: ISODate("2026-04-19T09:00:00Z"),
      duration: 30,
      reason: "General Consultation",
      status: "Pending",
      notes: "Patient has been having headaches",
      createdAt: ISODate("2026-04-19T08:50:00Z"),
      updatedAt: ISODate("2026-04-19T08:50:00Z")
    }
    
    ↓
    Audit log created:
    {
      _id: ObjectId(...),
      user: "receptionist-123",
      action: "Booked Ahmed Benali with Dr. Nouar on 2026-04-19T09:00",
      resource: "Appointment",
      type: "create",
      timestamp: ISODate("2026-04-19T08:50:00Z")
    }
    
    ↓
    Backend response (with populated references):
    {
      success: true,
      data: {
        _id: "607e2f77bcf86cd799439022",
        patient: { _id: "507f...", firstName: "Ahmed", lastName: "Benali", ... },
        doctor: { _id: "507f...", name: "Dr. Nouar", role: "Gyneco Doctor", ... },
        date: "2026-04-19T09:00:00Z",
        status: "Pending"
      }
    }
    
    ↓
STEP 6: Frontend shows success toast
    
    "✅ Appointment booked for Ahmed Benali with Dr. Nouar at 09:00"
    
    ↓
STEP 7: Modal closes, queue refreshes
    
    New appointment appears in queue at correct time!
    ↓
STEP 8: Admin can see audit log
    
    Admin Panel → Audit Logs shows:
    "Receptionist booked Ahmed Benali with Dr. Nouar on 2026-04-19 @ 08:50"
```

---

## 📱 Frontend Component Hierarchy

```
receptionist/layout.jsx (Main layout)
    │
    ├─ receptionist/appointments/page.jsx
    │   └─ Uses: API_RECEPTIONIST fetch
    │   └─ Displays: Calendar + appointment list
    │   └─ Shows: Search, filter by doctor
    │
    ├─ receptionist/queue/page.jsx
    │   ├─ Uses: SmartBookingModal component
    │   ├─ Uses: API_RECEPTIONIST fetch
    │   ├─ Functions:
    │   │   ├─ markPresent() → PATCH /appointments/:id/status
    │   │   ├─ markSkipped() → PATCH /appointments/:id/status
    │   │   ├─ handleCallNext() → Internal logic
    │   │   └─ handleCompleteAppointment() → PATCH /appointments/:id/status
    │   └─ Displays: Queue with patient list, ticket numbers
    │
    ├─ receptionist/patients/page.jsx
    │   ├─ Uses: API_RECEPTIONIST fetch
    │   ├─ Functions:
    │   │   ├─ handleAddPatient() → POST /patients
    │   │   ├─ handleUpdatePatient() → PUT /patients/:id
    │   │   └─ handleSearch() → Client-side filter
    │   └─ Displays: Patient table, search, add form
    │
    └─ SmartBookingModal.jsx (Component)
        ├─ Props: patient, doctors, onClose, onSuccess, showToast
        ├─ States: selectedDoctor, selectedDate, selectedSlot, availableSlots
        ├─ Effects:
        │   └─ Fetch slots when doctor/date changes
        │       → GET /doctors/:id/available-slots?date=X
        ├─ Functions:
        │   └─ handleConfirmBooking()
        │       → POST /appointments with slot details
        └─ Displays: Doctor dropdown, date picker, time-slot grid
```

---

## 🔗 API CALL DEPENDENCY CHAIN

```
User Action                 API Call                        Backend Logic
─────────────────          ────────────────                 ──────────────

Open Appointments    →      GET /appointments              Query all appointments
Page                 →      (optional: ?date=, ?doctor=)   Filter & pagination
                                                            Populate patient/doctor
                                                            Return: appointment array

Click "New Appt"     →      GET /doctors                   Query all active doctors
in Queue                     (NEW ENDPOINT NEEDED)         Return: doctor list
                                                            Note: Not in current code!

Select Doctor        →      GET /doctors/:id               Fetch single doctor
& Date                       /available-slots              
                            ?date=2026-04-19              Get schedule.availableSlots
                                                            Check for conflicts
                                                            Return: slots with status

Click Time Slot      →      POST /appointments            Validate all data
                             {patientId, doctorId, date}  Save to Appointment
                                                            Log to AuditLog
                                                            Return: created appointment

Mark Patient         →      PATCH /appointments/:id       Update status field
Present                      /status {status: "Confirmed"} Log status change
                                                            Return: updated appointment

Complete Appt        →      PATCH /appointments/:id       Update status to "Completed"
                            /status {status: "Completed"}  Log completion
                                                            Return: updated appointment

Register             →      POST /patients                 Validate patient data
New Patient                 {firstName, lastName, ...}     Save to Patient
                                                            Log registration
                                                            Return: created patient

Search Patients      →      GET /patients                  Query patient collection
                            ?search=ahmed                  Filter by name/email
                                                            Return: matching patients
```

---

## ⚙️ KEY TECHNICAL FLOWS

### 1. Smart Booking Logic

```
User selects doctor & date
    ↓
Backend: getDoctorAvailableSlots()
    ├─ Load doctor.schedule.availableSlots
    ├─ Query: Appointment.find({ doctor, date, status != "Cancelled" })
    ├─ For each slot:
    │   ├─ If slot.status == "blocked" → return "blocked"
    │   ├─ Else if slot exists in appointments → return "booked"
    │   ├─ Else → return "available"
    └─ Return array with all statuses
    ↓
Frontend: Display as color-coded cards
```

### 2. Appointment Creation Validation

```
POST /appointments with { patientId, doctorId, date }
    ↓
Backend: createAppointment()
    ├─ Validate required fields
    ├─ Fetch patient = Patient.findById(patientId)
    ├─ If !patient → return 404 error
    ├─ Fetch doctor = Staff.findById(doctorId)
    ├─ If !doctor → return 404 error
    ├─ If doctor.status != "Active" → return 400 error
    ├─ Check if slot exists in doctor.schedule.availableSlots
    ├─ If slot exists AND status == "blocked" → return 400 error
    ├─ Check if appointment already exists:
    │   Query: Appointment.find({ patient, date })
    │   If found → return 400 error
    ├─ If all validations pass:
    │   ├─ Create new Appointment document
    │   ├─ Save to MongoDB
    │   ├─ Populate references
    │   ├─ Log to AuditLog
    │   └─ Return 201 success
    └─ Else → return appropriate error
```

### 3. Queue Status Update

```
User marks patient as "present"
    ↓
Frontend: PATCH /appointments/:id/status { status: "Confirmed" }
    ↓
Backend: updateAppointmentStatus()
    ├─ Validate status is one of: [Pending, Confirmed, Completed, Cancelled, No Show]
    ├─ Find appointment
    ├─ Update status
    ├─ Save to MongoDB
    ├─ Log action: "Changed status to Confirmed for Ahmed Benali"
    └─ Return updated appointment
    ↓
Frontend: Update UI (card color changes from gray to green)
```

---

## 📊 COLLECTION RELATIONSHIPS (ER Diagram)

```
┌──────────────┐           ┌───────────────┐          ┌──────────────┐
│   PATIENT    │           │  APPOINTMENT  │          │    STAFF     │
├──────────────┤           ├───────────────┤          ├──────────────┤
│ _id (PK)     │◄──────────│ patient (FK)  │          │ _id (PK)     │
│ firstName    │ 1      Many│ doctorName    │  Many─┐ │ name         │
│ lastName     │           │ doctor (FK)   ├────────┼─│ role         │
│ phone        │           │ date          │  1     │ │ schedule{}   │
│ dateOfBirth  │           │ duration      │        │ │ status       │
│ allergies    │           │ status        │        │ └──────────────┘
│ conditions   │           │ notes         │        │
│ status       │           │ createdAt     │        │
└──────────────┘           │ updatedAt     │        │
                           └───────────────┘        │
                                  │                │
                                  │ (logged by)    │
                                  ▼                │
                           ┌───────────────┐       │
                           │   AUDITLOG    │       │
                           ├───────────────┤       │
                           │ _id           │       │
                           │ user          │       │
                           │ action        │       │
                           │ resource      │       │
                           │ type          │       │
                           │ timestamp     │       │
                           └───────────────┘       │
                                                   └─ (not shown: link to user)
```

---

## 🎯 SUMMARY: How It All Works Together

1. **Receptionist opens app** → Fetches list of patients and doctors from API

2. **Receptionist wants to book an appointment:**
   - Selects patient from list
   - Opens Smart Booking modal
   - Selects doctor → Component fetches available slots
   - Selects date → Component re-fetches slots
   - Clicks time card → Modal confirms booking with API
   - API creates Appointment, logs action, returns success
   - Modal closes, queue refreshes to show new appointment

3. **During the day, as patients arrive:**
   - Receptionist marks patient as "present" → API updates appointment status
   - Status change is logged
   - Queue UI shows patient moved to "in room" when doctor calls them
   - Doctor completes appointment → Receptionist marks "completed"
   - All actions tracked in audit log

4. **Admin can review everything:**
   - Total appointments created this month
   - No-show rate
   - Which receptionist booked what
   - Full audit trail of queue operations
   - All data persistent in MongoDB

**Result:** A functional, auditable clinic appointment system! ✅

