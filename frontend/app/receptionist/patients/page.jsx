"use client";

<<<<<<< HEAD
import { useState, useEffect } from "react";
import { Search, Plus, X, User, Phone as PhoneIcon, Calendar, FileText } from "lucide-react";
import { API_RECEPTIONIST } from "@/config/api";
import SmartBookingModal from "@/components/SmartBookingModal";
import { 
  getPatientFullName, 
  getPatientId, 
  getPatientPhone 
} from "@/utils/patientFilters";

export default function PatientsPage() {
  const [patients, setPatients] = useState([]);
  const [totalPatients, setTotalPatients] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [doctors, setDoctors] = useState([]); // State for doctors list
  
=======
import { useState } from "react";
import { Search, Plus, X, User, Phone as PhoneIcon, Calendar, FileText } from "lucide-react";

// Mock patients data
const initialPatients = [
  { id: "P001", name: "Ahmed Benali", age: 45, phone: "0555-123-456", dob: "1980-03-15", lastVisit: "2025-04-15", totalVisits: 8, allergies: "Penicillin", chronicConditions: "Hypertension, Diabetes Type 2", medicalHistory: "Appendectomy (2015), Knee surgery (2020)" },
  { id: "P002", name: "Fatima Zohra", age: 32, phone: "0555-234-567", dob: "1993-07-22", lastVisit: "2025-04-10", totalVisits: 3, allergies: "None", chronicConditions: "Asthma", medicalHistory: "Tonsillectomy (2010)" },
  { id: "P003", name: "Karim Said", age: 58, phone: "0555-345-678", dob: "1967-11-08", lastVisit: "2025-04-18", totalVisits: 15, allergies: "Sulfa drugs, Ibuprofen", chronicConditions: "Heart disease, High cholesterol", medicalHistory: "Bypass surgery (2018), Cataract surgery (2022)" },
  { id: "P004", name: "Lydia Mansour", age: 28, phone: "0555-456-789", dob: "1997-02-14", lastVisit: "2025-04-01", totalVisits: 2, allergies: "Latex", chronicConditions: "None", medicalHistory: "None" },
  { id: "P005", name: "Omar Khelif", age: 41, phone: "0555-567-890", dob: "1984-09-30", lastVisit: "2025-03-25", totalVisits: 6, allergies: "None", chronicConditions: "Migraines", medicalHistory: "Wisdom teeth extraction (2012)" },
  { id: "P006", name: "Samira Hadj", age: 55, phone: "0555-678-901", dob: "1970-05-12", lastVisit: "2025-04-16", totalVisits: 12, allergies: "Aspirin", chronicConditions: "Arthritis, Osteoporosis", medicalHistory: "Hip replacement (2021)" },
];

const doctors = ["Dr. Nouar", "Dr. Bensalem", "Dr. Khelifi"];

export default function PatientsPage() {
  const [patients, setPatients] = useState(initialPatients);
>>>>>>> 71c599f5aae482780c43c836ebac595de4d47a83
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("name");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
<<<<<<< HEAD
  // State for the SmartBookingModal when "+ Appt" button is clicked
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedPatientForBooking, setSelectedPatientForBooking] = useState(null);
  const [toasts, setToasts] = useState([]);

  // =========================================================================
  // FETCH PATIENTS ON LOAD
  // =========================================================================
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        
        const res = await fetch(`${API_RECEPTIONIST}/patients?limit=1000`);
        
        // ✅ Step 1: Validate HTTP response status
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }
        
        // ✅ Step 2: Safely parse JSON response
        let responseData;
        try {
          responseData = await res.json();
        } catch (parseErr) {
          throw new Error('Failed to parse API response: ' + parseErr.message);
        }
        
        // ✅ Step 3: Validate response is an object
        if (!responseData || typeof responseData !== 'object') {
          throw new Error('Invalid response structure from API');
        }
        
        // ✅ Step 4: Extract patients array (handles both formats)
        const patientsList = Array.isArray(responseData.patients)
          ? responseData.patients          // Expected format: { patients: [...], pagination }
          : Array.isArray(responseData.data)
            ? responseData.data            // Fallback: { data: [...], pagination }
            : Array.isArray(responseData)
              ? responseData                // Flat array format: [...]
              : [];
        
        // ✅ Step 5: Validate extracted data is array
        if (!Array.isArray(patientsList)) {
          console.error('[Patients] Extracted data is not array:', patientsList);
          throw new Error('Invalid patients array format');
        }
        
        // ✅ Step 6: Filter out null/undefined elements with logging
        const validPatients = patientsList.filter(p => 
          p && typeof p === 'object'
        );
        
        if (validPatients.length !== patientsList.length) {
          console.warn('[Patients] Filtered out invalid entries', {
            totalFetched: patientsList.length,
            validPatients: validPatients.length,
            filtered: patientsList.length - validPatients.length,
            invalidEntries: patientsList.filter(p => !p || typeof p !== 'object')
          });
        }
        
        // ✅ Step 7: Log any patients missing required fields
        const missingFields = validPatients.filter(p => 
          !p.firstName || !p.lastName
        );
        
        if (missingFields.length > 0) {
          console.warn('[Patients] Found patients with missing name fields', {
            count: missingFields.length,
            examples: missingFields.slice(0, 3)
          });
        }
        
        setPatients(validPatients);
        // Capture total patient count from pagination info
        setTotalPatients(
          responseData.pagination?.total || 
          validPatients.length || 
          0
        );
        setLoading(false);
        
      } catch (err) {
        console.error('[Patients] Error fetching patients:', {
          message: err.message,
          stack: err.stack
        });
        setError(err.message);
        setPatients([]);  // Reset to empty array on error
        setLoading(false);
      }
    };
    
    fetchPatients();
  }, []);

  // =========================================================================
  // FETCH DOCTORS FOR SMART BOOKING
  // =========================================================================
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await fetch(`${API_RECEPTIONIST}/doctors`);
        if (res.ok) {
          const data = await res.json();
          setDoctors(data.data || []);
        }
      } catch (err) {
        console.error('[Patients] Error fetching doctors:', err);
      }
    };
    fetchDoctors();
  }, []);

  const [newPatient, setNewPatient] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    dateOfBirth: "",
    allergies: "",
    chronicConditions: "",
    medicalHistory: "",
    notes: "",
  });
=======

  const [newPatient, setNewPatient] = useState({
    name: "",
    phone: "",
    dob: "",
    allergies: "",
    chronicConditions: "",
    medicalHistory: "",
    doctor: doctors[0],
    appointmentDate: "",
    appointmentTime: "morning",
    notes: "",
    createAppointment: true,
  });
  const [toasts, setToasts] = useState([]);
>>>>>>> 71c599f5aae482780c43c836ebac595de4d47a83

  const showToast = (message, type = "success") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

<<<<<<< HEAD
  // Inline defensive filter with optional chaining and nullish coalescing
  const filteredPatients = patients.filter((p) => {
    const query = searchQuery.toLowerCase();
    
    switch (searchType) {
      case "name":
        // Use optional chaining (?.) and nullish coalescing (?? "") to prevent crashes
        const fName = p?.firstName ?? "";
        const lName = p?.lastName ?? "";
        return (fName + " " + lName).toLowerCase().includes(query);
      
      case "id":
        return (p?._id ?? "").toLowerCase().includes(query);
      
      case "phone":
        return (p?.phone ?? "").includes(query);
      
=======
  const filteredPatients = patients.filter((p) => {
    const query = searchQuery.toLowerCase();
    switch (searchType) {
      case "name":
        return p.name.toLowerCase().includes(query);
      case "id":
        return p.id.toLowerCase().includes(query);
      case "phone":
        return p.phone.includes(query);
>>>>>>> 71c599f5aae482780c43c836ebac595de4d47a83
      default:
        return true;
    }
  });

<<<<<<< HEAD
  async function handleAddPatient() {
    // Ensure BOTH firstName and lastName are provided (backend requires both)
    if (!newPatient.firstName?.trim() || !newPatient.lastName?.trim() || !newPatient.phone?.trim()) {
      showToast("First name, last name, and phone are required", "error");
      return;
    }

    try {
      const response = await fetch(`${API_RECEPTIONIST}/patients`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: newPatient.firstName.trim(),
          lastName: newPatient.lastName.trim(),
          phone: newPatient.phone.trim(),
          dateOfBirth: newPatient.dateOfBirth || null,
          allergies: newPatient.allergies || "None",
          // Send `conditions` (backend schema) and include `chronicConditions` for compatibility
          conditions: newPatient.chronicConditions || "None",
          chronicConditions: newPatient.chronicConditions || "None",
          medicalHistory: newPatient.medicalHistory || "None",
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add patient");
      }

      const data = await response.json();
      
      // Add the new patient to the list
      setPatients([...patients, data]);
      // Increment total patient count
      setTotalPatients(totalPatients + 1);
      showToast("Patient added successfully");
      
      // Reset form
      setNewPatient({
        firstName: "",
        lastName: "",
        phone: "",
        dateOfBirth: "",
        allergies: "",
        chronicConditions: "",
        medicalHistory: "",
        notes: "",
      });
      setShowAddModal(false);
    } catch (err) {
      console.error("[Patients] Error adding patient:", err);
      showToast(err.message, "error");
    }
=======
  function handleAddPatient() {
    if (!newPatient.name || !newPatient.phone) return;

    const id = "P" + String(patients.length + 1).padStart(3, "0");
    const today = new Date().toISOString().split("T")[0];

    let age = 0;
    if (newPatient.dob) {
      const birthDate = new Date(newPatient.dob);
      const ageDiff = Date.now() - birthDate.getTime();
      age = Math.floor(ageDiff / (1000 * 60 * 60 * 24 * 365.25));
    }

    const patient = {
      id,
      name: newPatient.name,
      phone: newPatient.phone,
      dob: newPatient.dob,
      age,
      lastVisit: today,
      totalVisits: 0,
      allergies: newPatient.allergies || "None",
      chronicConditions: newPatient.chronicConditions || "None",
      medicalHistory: newPatient.medicalHistory || "None",
    };

    setPatients([...patients, patient]);
    showToast("Patient added successfully");
    setNewPatient({
      name: "",
      phone: "",
      dob: "",
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
>>>>>>> 71c599f5aae482780c43c836ebac595de4d47a83
  }

  function viewPatient(patient) {
    setSelectedPatient(patient);
    setShowDetailModal(true);
  }

<<<<<<< HEAD
  // If loading, show a loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-[#1d4ed8] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading patients...</p>
        </div>
      </div>
    );
  }

  // If there was an error
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-500 font-medium">Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-[#1d4ed8] text-white rounded-lg hover:bg-[#1e40af]"
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }

=======
>>>>>>> 71c599f5aae482780c43c836ebac595de4d47a83
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Patients</h2>
          <p className="text-muted-foreground">Search and manage patient records</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
<<<<<<< HEAD
          className="px-6 py-3 bg-[#1d4ed8] text-white rounded-lg hover:bg-[#1d4ed8] font-medium min-h-[44px] flex items-center gap-2"
=======
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium min-h-[44px] flex items-center gap-2"
>>>>>>> 71c599f5aae482780c43c836ebac595de4d47a83
          aria-label="Add new patient"
        >
          <Plus className="w-5 h-5" />
          Add New Patient
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px] relative">
            <label className="block text-sm font-medium text-foreground mb-1">Search Patients</label>
            <Search className="absolute left-3 top-[calc(50%+12px)] -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-input rounded-lg bg-background min-h-[44px]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Search By</label>
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              className="px-4 py-2 border border-input rounded-lg bg-background min-h-[44px]"
            >
              <option value="name">Name</option>
              <option value="id">Patient ID</option>
              <option value="phone">Phone</option>
            </select>
          </div>
        </div>
      </div>

      <p className="text-sm text-muted-foreground">
<<<<<<< HEAD
        Showing {filteredPatients.length} of {totalPatients} patients {searchQuery && `(filtered from ${totalPatients})`}
=======
        Showing {filteredPatients.length} of {patients.length} patients
>>>>>>> 71c599f5aae482780c43c836ebac595de4d47a83
      </p>

      {/* Patient Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
<<<<<<< HEAD
        {filteredPatients.map((patient) => {
          if (!patient) return null;
          
          // Use safe accessor functions that handle missing data
          const fullName = getPatientFullName(patient);
          const patientId = getPatientId(patient);
          const phone = getPatientPhone(patient);
          const firstInitial = (patient.firstName?.[0] || patient.lastName?.[0] || "U").toUpperCase();
          
          return (
          <div
            key={patientId || Math.random()}
            className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start gap-3 mb-3">
              <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 text-[#1d4ed8] flex items-center justify-center font-bold text-lg">
                {firstInitial}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">{fullName}</h3>
                <p className="text-sm text-muted-foreground">{patientId.slice(0, 8)} | Phone: {phone || "N/A"}</p>
=======
        {filteredPatients.map((patient) => (
          <div
            key={patient.id}
            className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start gap-3 mb-3">
              <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center font-bold text-lg">
                {patient.name.charAt(0)}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">{patient.name}</h3>
                <p className="text-sm text-muted-foreground">{patient.id} | Age: {patient.age}</p>
>>>>>>> 71c599f5aae482780c43c836ebac595de4d47a83
              </div>
            </div>

            <div className="space-y-2 text-sm mb-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <PhoneIcon className="w-4 h-4" />
<<<<<<< HEAD
                <span>{phone || "No phone"}</span>
              </div>
              {patient.dateOfBirth && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>DOB: {patient.dateOfBirth}</span>
                </div>
              )}
              {patient.allergies && (
                <div className="text-sm text-amber-600">
                  ⚠️ Allergies: {patient.allergies}
                </div>
              )}
=======
                <span>{patient.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>Last visit: {patient.lastVisit}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <FileText className="w-4 h-4" />
                <span>{patient.totalVisits} total visits</span>
              </div>
>>>>>>> 71c599f5aae482780c43c836ebac595de4d47a83
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => viewPatient(patient)}
                className="flex-1 px-3 py-2 bg-emerald-600 text-white rounded text-sm hover:bg-emerald-700 min-h-[44px]"
<<<<<<< HEAD
                aria-label={`View profile of ${fullName}`}
=======
                aria-label={`View profile of ${patient.name}`}
>>>>>>> 71c599f5aae482780c43c836ebac595de4d47a83
              >
                View Profile
              </button>
              <button
<<<<<<< HEAD
                // Opens SmartBookingModal with this patient pre-selected for appointment creation
                onClick={() => {
                  setSelectedPatientForBooking(patient);
                  setShowBookingModal(true);
                }}
                className="px-3 py-2 bg-[#1d4ed8] text-white rounded text-sm hover:bg-[#1e40af] min-h-[44px]"
                aria-label={`Add appointment for ${fullName}`}
=======
                className="px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 min-h-[44px]"
                aria-label={`Add appointment for ${patient.name}`}
>>>>>>> 71c599f5aae482780c43c836ebac595de4d47a83
              >
                + Appt
              </button>
            </div>
          </div>
<<<<<<< HEAD
        );
        })}
=======
        ))}
>>>>>>> 71c599f5aae482780c43c836ebac595de4d47a83
      </div>

      {filteredPatients.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No patients found matching your search.
        </div>
      )}

      {/* Add New Patient Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Add New Patient</h3>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-muted rounded">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
<<<<<<< HEAD
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">First Name *</label>
                  <input
                    type="text"
                    value={newPatient.firstName}
                    onChange={(e) => setNewPatient({ ...newPatient, firstName: e.target.value })}
                    className="w-full px-4 py-2 border border-input rounded-lg bg-background min-h-[44px]"
                    placeholder="First name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Last Name *</label>
                  <input
                    type="text"
                    required
                    value={newPatient.lastName}
                    onChange={(e) => setNewPatient({ ...newPatient, lastName: e.target.value })}
                    className="w-full px-4 py-2 border border-input rounded-lg bg-background min-h-[44px]"
                    placeholder="Last name"
                  />
                </div>
=======
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Full Name *</label>
                <input
                  type="text"
                  value={newPatient.name}
                  onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
                  className="w-full px-4 py-2 border border-input rounded-lg bg-background min-h-[44px]"
                  placeholder="Enter patient name"
                />
>>>>>>> 71c599f5aae482780c43c836ebac595de4d47a83
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Phone Number *</label>
                <input
                  type="tel"
                  value={newPatient.phone}
                  onChange={(e) => setNewPatient({ ...newPatient, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-input rounded-lg bg-background min-h-[44px]"
                  placeholder="0555-XXX-XXX"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Date of Birth</label>
                <input
                  type="date"
<<<<<<< HEAD
                  value={newPatient.dateOfBirth}
                  onChange={(e) => setNewPatient({ ...newPatient, dateOfBirth: e.target.value })}
=======
                  value={newPatient.dob}
                  onChange={(e) => setNewPatient({ ...newPatient, dob: e.target.value })}
>>>>>>> 71c599f5aae482780c43c836ebac595de4d47a83
                  className="w-full px-4 py-2 border border-input rounded-lg bg-background min-h-[44px]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Allergies</label>
                <input
                  type="text"
                  value={newPatient.allergies}
                  onChange={(e) => setNewPatient({ ...newPatient, allergies: e.target.value })}
                  className="w-full px-4 py-2 border border-input rounded-lg bg-background min-h-[44px]"
                  placeholder="e.g., Penicillin, Latex"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Chronic Conditions</label>
                <input
                  type="text"
                  value={newPatient.chronicConditions}
                  onChange={(e) => setNewPatient({ ...newPatient, chronicConditions: e.target.value })}
                  className="w-full px-4 py-2 border border-input rounded-lg bg-background min-h-[44px]"
                  placeholder="e.g., Diabetes, Hypertension"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Medical History</label>
                <textarea
                  value={newPatient.medicalHistory}
                  onChange={(e) => setNewPatient({ ...newPatient, medicalHistory: e.target.value })}
                  className="w-full px-4 py-2 border border-input rounded-lg bg-background min-h-[80px] resize-none"
                  placeholder="Previous surgeries, major illnesses..."
                />
              </div>

<<<<<<< HEAD
              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleAddPatient}
                  disabled={!newPatient.firstName || !newPatient.lastName || !newPatient.phone}
                  className="flex-1 px-4 py-2 bg-[#1d4ed8] text-white rounded-lg hover:bg-[#1e40af] disabled:opacity-50 min-h-[44px]"
=======
              <label className="flex items-center gap-3 p-3 bg-muted rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  checked={newPatient.createAppointment}
                  onChange={(e) => setNewPatient({ ...newPatient, createAppointment: e.target.checked })}
                  className="w-5 h-5"
                />
                <span className="text-foreground">Create appointment immediately</span>
              </label>

              {newPatient.createAppointment && (
                <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-medium text-foreground">Appointment Details</h4>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Select Doctor</label>
                    <select
                      value={newPatient.doctor}
                      onChange={(e) => setNewPatient({ ...newPatient, doctor: e.target.value })}
                      className="w-full px-4 py-2 border border-input rounded-lg bg-background min-h-[44px]"
                    >
                      {doctors.map((doc) => (
                        <option key={doc} value={doc}>{doc}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Appointment Date</label>
                    <input
                      type="date"
                      value={newPatient.appointmentDate}
                      onChange={(e) => setNewPatient({ ...newPatient, appointmentDate: e.target.value })}
                      className="w-full px-4 py-2 border border-input rounded-lg bg-background min-h-[44px]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Preferred Time</label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="time"
                          value="morning"
                          checked={newPatient.appointmentTime === "morning"}
                          onChange={(e) => setNewPatient({ ...newPatient, appointmentTime: e.target.value })}
                          className="w-5 h-5"
                        />
                        <span className="text-foreground">Morning</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="time"
                          value="evening"
                          checked={newPatient.appointmentTime === "evening"}
                          onChange={(e) => setNewPatient({ ...newPatient, appointmentTime: e.target.value })}
                          className="w-5 h-5"
                        />
                        <span className="text-foreground">Evening</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleAddPatient}
                  disabled={!newPatient.name || !newPatient.phone}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 min-h-[44px]"
>>>>>>> 71c599f5aae482780c43c836ebac595de4d47a83
                >
                  Add Patient
                </button>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 min-h-[44px]"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Patient Detail Modal */}
<<<<<<< HEAD
      {showDetailModal && selectedPatient && (() => {
        // Use safe accessor functions
        const fullName = getPatientFullName(selectedPatient);
        const patientId = getPatientId(selectedPatient);
        const phone = getPatientPhone(selectedPatient);
        const firstInitial = (selectedPatient.firstName?.[0] || selectedPatient.lastName?.[0] || "U").toUpperCase();
        const dob = selectedPatient.dateOfBirth || "N/A";
        const lastVisit = selectedPatient.lastVisit || "No previous visits";
        const allergies = selectedPatient.allergies || "None listed";
        const conditions = selectedPatient.chronicConditions || "None listed";
        const history = selectedPatient.medicalHistory || "No history provided";
        
        return (
=======
      {showDetailModal && selectedPatient && (
>>>>>>> 71c599f5aae482780c43c836ebac595de4d47a83
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Patient Profile</h3>
              <button onClick={() => setShowDetailModal(false)} className="p-2 hover:bg-muted rounded">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
<<<<<<< HEAD
                <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 text-[#1d4ed8] flex items-center justify-center text-2xl font-bold">
                  {firstInitial}
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-foreground">{fullName}</h4>
                  <p className="text-muted-foreground">{patientId.slice(0, 8)}</p>
=======
                <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center text-2xl font-bold">
                  {selectedPatient.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-foreground">{selectedPatient.name}</h4>
                  <p className="text-muted-foreground">{selectedPatient.id}</p>
>>>>>>> 71c599f5aae482780c43c836ebac595de4d47a83
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-muted p-3 rounded-lg">
<<<<<<< HEAD
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="font-medium text-foreground">{phone}</p>
                </div>
                <div className="bg-muted p-3 rounded-lg">
                  <p className="text-xs text-muted-foreground">DOB</p>
                  <p className="font-medium text-foreground">{dob}</p>
                </div>
              </div>

              <div className="bg-muted p-3 rounded-lg">
                <p className="text-xs text-muted-foreground">Last Visit</p>
                <p className="font-medium text-foreground">{lastVisit}</p>
=======
                  <p className="text-xs text-muted-foreground">Age</p>
                  <p className="font-medium text-foreground">{selectedPatient.age} years</p>
                </div>
                <div className="bg-muted p-3 rounded-lg">
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="font-medium text-foreground">{selectedPatient.phone}</p>
                </div>
                <div className="bg-muted p-3 rounded-lg">
                  <p className="text-xs text-muted-foreground">Total Visits</p>
                  <p className="font-medium text-foreground">{selectedPatient.totalVisits}</p>
                </div>
                <div className="bg-muted p-3 rounded-lg">
                  <p className="text-xs text-muted-foreground">Last Visit</p>
                  <p className="font-medium text-foreground">{selectedPatient.lastVisit}</p>
                </div>
>>>>>>> 71c599f5aae482780c43c836ebac595de4d47a83
              </div>

              <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-200 dark:border-red-800">
                <p className="text-xs text-red-600 dark:text-red-400 font-medium">Allergies</p>
<<<<<<< HEAD
                <p className="text-foreground">{allergies}</p>
=======
                <p className="text-foreground">{selectedPatient.allergies}</p>
>>>>>>> 71c599f5aae482780c43c836ebac595de4d47a83
              </div>

              <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg border border-amber-200 dark:border-amber-800">
                <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">Chronic Conditions</p>
<<<<<<< HEAD
                <p className="text-foreground">{conditions}</p>
=======
                <p className="text-foreground">{selectedPatient.chronicConditions}</p>
>>>>>>> 71c599f5aae482780c43c836ebac595de4d47a83
              </div>

              <div className="bg-muted p-3 rounded-lg">
                <p className="text-xs text-muted-foreground font-medium">Medical History</p>
<<<<<<< HEAD
                <p className="text-foreground">{history}</p>
=======
                <p className="text-foreground">{selectedPatient.medicalHistory}</p>
>>>>>>> 71c599f5aae482780c43c836ebac595de4d47a83
              </div>

              <button
                onClick={() => setShowDetailModal(false)}
                className="w-full px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 min-h-[44px]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
<<<<<<< HEAD
        ) })()}
=======
      )}
>>>>>>> 71c599f5aae482780c43c836ebac595de4d47a83

      {/* Toast Notifications */}
      <div className="fixed bottom-5 right-5 space-y-2 z-50">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`px-4 py-3 rounded-lg shadow text-white ${
              toast.type === "success"
                ? "bg-green-500"
                : toast.type === "error"
                ? "bg-red-500"
                : toast.type === "warning"
                ? "bg-yellow-500"
<<<<<<< HEAD
                : "bg-[#1d4ed8]"
=======
                : "bg-blue-500"
>>>>>>> 71c599f5aae482780c43c836ebac595de4d47a83
            }`}
          >
            {toast.message}
          </div>
        ))}
      </div>
<<<<<<< HEAD

      {/* SmartBookingModal - Opens when "+ Appt" button is clicked on a patient card */}
      {showBookingModal && selectedPatientForBooking && (
        <SmartBookingModal
          patient={selectedPatientForBooking}
          doctors={doctors}
          isOpen={showBookingModal}
          onClose={() => {
            setShowBookingModal(false);
            setSelectedPatientForBooking(null);
          }}
          onSuccess={() => {
            setShowBookingModal(false);
            setSelectedPatientForBooking(null);
            showToast("Appointment booked successfully!");
          }}
          showToast={showToast}
        />
      )}
=======
>>>>>>> 71c599f5aae482780c43c836ebac595de4d47a83
    </div>
  );
}
