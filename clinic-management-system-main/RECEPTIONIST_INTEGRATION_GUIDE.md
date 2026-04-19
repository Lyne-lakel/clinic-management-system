# QUICK INTEGRATION GUIDE - Frontend Integration Snippets

## How to Integrate Smart Booking into Your Pages

### ✅ Step 1: Import the API Constant
All your receptionist pages should import this:
```javascript
import { API_RECEPTIONIST } from "@/config/api";
```

---

## 📱 1. APPOINTMENTS PAGE (`receptionist/appointments/page.jsx`)

### Replace Mock Data with API Call

**OLD CODE (DELETE THIS):**
```javascript
const allAppointments = [
  { id: 1, date: "2026-04-13", time: "09:00", ... },
  // ... hardcoded data
];
```

**NEW CODE (REPLACE WITH THIS):**
```javascript
"use client";
import { useState, useEffect } from "react";
import { API_RECEPTIONIST } from "@/config/api";

export default function AppointmentsPage() {
  const [allAppointments, setAllAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await fetch(`${API_RECEPTIONIST}/appointments`);
        if (!res.ok) throw new Error("Failed to fetch appointments");
        const data = await res.json();
        setAllAppointments(data.data);
      } catch (err) {
        console.error("Error fetching appointments:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAppointments();
  }, []);
  
  if (loading) return <div>Loading appointments...</div>;
  
  return (
    // ... rest of your existing code
    // The calendar, search, filters all still work!
    // Just replace allAppointments (the data source) with the API data
  );
}
```

---

## 👥 2. QUEUE PAGE (`receptionist/queue/page.jsx`)

### Replace Mock Queue with API Integration

**STEP 1: Fetch today's appointments on load**
```javascript
"use client";
import { useState, useEffect } from "react";
import { API_RECEPTIONIST } from "@/config/api";

export default function QueuePage() {
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchQueue = async () => {
      try {
        const today = new Date().toISOString().split("T")[0];
        const res = await fetch(
          `${API_RECEPTIONIST}/appointments?date=${today}&status=Confirmed`
        );
        if (!res.ok) throw new Error("Failed to fetch queue");
        const data = await res.json();
        
        // Convert API format to your queue format
        const formattedQueue = data.data.map((apt, i) => ({
          id: apt._id,
          ticketNum: i + 1,
          name: apt.patientName,
          appointmentTime: new Date(apt.date).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false
          }),
          status: apt.status === "Confirmed" ? "present" : "absent"
        }));
        
        setQueue(formattedQueue.sort((a, b) => 
          a.appointmentTime.localeCompare(b.appointmentTime)
        ));
      } catch (err) {
        console.error("Error fetching queue:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchQueue();
  }, []);
  
  // ... rest of your existing code
}
```

**STEP 2: Update `markPresent()` to use API**
```javascript
// REPLACE THIS:
function markPresent(id) {
  setQueue((prev) =>
    prev.map((q) => (q.id === id ? { ...q, status: "present" } : q))
  );
  showToast("Patient marked as present");
}

// WITH THIS:
async function markPresent(appointmentId) {
  try {
    const res = await fetch(
      `${API_RECEPTIONIST}/appointments/${appointmentId}/status`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Confirmed" })
      }
    );
    
    if (!res.ok) throw new Error("Failed to update status");
    
    setQueue((prev) =>
      prev.map((q) => 
        q.id === appointmentId ? { ...q, status: "present" } : q
      )
    );
    showToast("Patient marked as present");
  } catch (err) {
    showToast(err.message, "error");
  }
}
```

**STEP 3: Update `markAbsent()` (skip) to use API**
```javascript
// REPLACE THIS:
function markAbsent(id) {
  setQueue((prev) =>
    prev.map((q) => (q.id === id ? { ...q, status: "skipped" } : q))
  );
  showToast("Patient skipped", "warning");
}

// WITH THIS:
async function markAbsent(appointmentId) {
  try {
    const res = await fetch(
      `${API_RECEPTIONIST}/appointments/${appointmentId}/status`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "No Show" })
      }
    );
    
    if (!res.ok) throw new Error("Failed to update status");
    
    setQueue((prev) =>
      prev.map((q) => 
        q.id === appointmentId ? { ...q, status: "skipped" } : q
      )
    );
    showToast("Patient marked as no-show", "warning");
  } catch (err) {
    showToast(err.message, "error");
  }
}
```

**STEP 4: Add Smart Booking Modal**
```javascript
import SmartBookingModal from "@/components/SmartBookingModal";

export default function QueuePage() {
  // ... existing state ...
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [doctors, setDoctors] = useState([]);
  
  // Fetch doctors list on mount
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await fetch(`${API_RECEPTIONIST}/doctors`);
        if (!res.ok) throw new Error("Failed to fetch doctors");
        const data = await res.json();
        setDoctors(data.data);
      } catch (err) {
        console.error("Error fetching doctors:", err);
      }
    };
    
    fetchDoctors();
  }, []);
  
  // ... rest of your code ...
  
  return (
    <div className="space-y-6">
      {/* Your existing queue UI */}
      
      {/* Add a "Book Appointment" button somewhere */}
      <button
        onClick={() => {
          setSelectedPatient({
            _id: "patient-to-book-id",
            firstName: "Patient",
            lastName: "Name"
          });
          setShowBookingModal(true);
        }}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        ➕ Book Appointment
      </button>
      
      {/* Smart Booking Modal */}
      {showBookingModal && selectedPatient && (
        <SmartBookingModal
          patient={selectedPatient}
          doctors={doctors}
          onClose={() => {
            setShowBookingModal(false);
            setSelectedPatient(null);
          }}
          onSuccess={(newAppointment) => {
            // Refresh queue when new appointment is booked
            const today = new Date().toISOString().split("T")[0];
            fetch(`${API_RECEPTIONIST}/appointments?date=${today}`)
              .then(res => res.json())
              .then(data => {
                const formattedQueue = data.data.map((apt, i) => ({
                  id: apt._id,
                  ticketNum: i + 1,
                  name: apt.patientName,
                  appointmentTime: new Date(apt.date).toLocaleTimeString(),
                  status: "present"
                }));
                setQueue(formattedQueue.sort((a, b) => 
                  a.appointmentTime.localeCompare(b.appointmentTime)
                ));
              });
          }}
          showToast={showToast}
        />
      )}
    </div>
  );
}
```

---

## 👤 3. PATIENTS PAGE (`receptionist/patients/page.jsx`)

### Replace Mock Patients with API

**STEP 1: Fetch patients on load**
```javascript
"use client";
import { useState, useEffect } from "react";
import { API_RECEPTIONIST } from "@/config/api";

export default function PatientsPage() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await fetch(`${API_RECEPTIONIST}/patients`);
        if (!res.ok) throw new Error("Failed to fetch patients");
        const data = await res.json();
        
        // Convert MongoDB format to your format
        const formattedPatients = data.data.map(p => ({
          id: p._id,
          name: `${p.firstName} ${p.lastName}`,
          firstName: p.firstName,
          lastName: p.lastName,
          age: new Date().getFullYear() - new Date(p.dateOfBirth).getFullYear(),
          phone: p.phone,
          dob: p.dateOfBirth,
          allergies: p.allergies || "None",
          chronicConditions: p.conditions || "None",
          medicalHistory: ""
        }));
        
        setPatients(formattedPatients);
      } catch (err) {
        console.error("Error fetching patients:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPatients();
  }, []);
  
  if (loading) return <div>Loading patients...</div>;
  
  // ... rest of your existing code
}
```

**STEP 2: Update `handleAddPatient()` to save to database**
```javascript
// REPLACE THIS:
const handleAddPatient = () => {
  if (!newPatient.name || !newPatient.phone) return;
  
  const patient = {
    id: "P" + String(patients.length + 1).padStart(3, "0"),
    name: newPatient.name,
    phone: newPatient.phone,
    // ... etc - just adds to local state
  };
  
  setPatients([...patients, patient]);
  showToast("Patient added successfully");
  // ... reset form
};

// WITH THIS:
const handleAddPatient = async () => {
  if (!newPatient.name || !newPatient.phone) {
    showToast("Name and phone are required", "error");
    return;
  }
  
  try {
    const res = await fetch(`${API_RECEPTIONIST}/patients`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName: newPatient.name.split(" ")[0],
        lastName: newPatient.name.split(" ").slice(1).join(" "),
        phone: newPatient.phone,
        dateOfBirth: newPatient.dob,
        email: newPatient.email || "",
        gender: "Other",
        bloodType: "Unknown",
        allergies: newPatient.allergies || "None",
        conditions: newPatient.chronicConditions || "None",
        address: ""
      })
    });
    
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Failed to add patient");
    }
    
    const createdPatient = await res.json();
    
    // Add to UI
    const formattedPatient = {
      id: createdPatient.data._id,
      name: `${createdPatient.data.firstName} ${createdPatient.data.lastName}`,
      firstName: createdPatient.data.firstName,
      lastName: createdPatient.data.lastName,
      phone: createdPatient.data.phone,
      // ... etc
    };
    
    setPatients([...patients, formattedPatient]);
    showToast("✅ Patient registered successfully");
    
    // Reset form
    setNewPatient({
      name: "",
      phone: "",
      dob: "",
      email: "",
      allergies: "",
      chronicConditions: "",
      medicalHistory: "",
      doctor: doctors[0],
      appointmentDate: "",
      appointmentTime: "morning",
      notes: "",
      createAppointment: true,
    });
    setShowAddModal(false);
    
  } catch (err) {
    console.error("Error adding patient:", err);
    showToast(err.message, "error");
  }
};
```

---

## 🔄 Testing the Integration

### Test Flow:
1. **Start backend:** `cd backend && npm start`
2. **Start frontend:** `cd frontend && npm run dev`
3. **Open browser:** http://localhost:3000

### Test Sequence:
1. Go to Receptionist → Patients
2. Click "Add New Patient"
3. Fill form and submit
4. Check browser console - should see fetch POST succeed
5. Go to Receptionist → Appointments
6. Should see list populate from API
7. Go to Receptionist → Queue
8. Click "Book Appointment"
9. Select doctor → select date → select time slot
10. Confirm booking
11. Check admin panel → Audit Logs to see the action logged!

---

## 🐛 Common Issues & Fixes

### Issue: "API_RECEPTIONIST is not defined"
**Fix:** Add import at top of file:
```javascript
import { API_RECEPTIONIST } from "@/config/api";
```

### Issue: "POST /api/receptionist/appointments 404"
**Fix:** Make sure backend is running and server.js has:
```javascript
app.use('/api/receptionist', require('./routes/receptionistRoutes'));
```

### Issue: "Cannot read property '_id' of undefined"
**Fix:** Check that API response is in correct format. Log the response:
```javascript
const data = await res.json();
console.log("API Response:", data);
```

### Issue: "Empty appointments list even though I created one"
**Fix:** Make sure you're querying with the correct date:
```javascript
const today = new Date().toISOString().split("T")[0];
// Should be "2026-04-19" format
```

---

## ✅ Checklist for Integration

- [ ] Imported `API_RECEPTIONIST` in all receptionist pages
- [ ] Updated appointments/page.jsx with API fetch
- [ ] Updated queue/page.jsx with API status updates
- [ ] Added SmartBookingModal import to queue/page.jsx
- [ ] Updated patients/page.jsx with API save
- [ ] Tested end-to-end flow
- [ ] Checked audit logs to see actions logged
- [ ] Verified data persists on page refresh
- [ ] Tested error cases (invalid slot, duplicate booking, etc.)

