"use client";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("name");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

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

  const showToast = (message, type = "success") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  const filteredPatients = patients.filter((p) => {
    const query = searchQuery.toLowerCase();
    switch (searchType) {
      case "name":
        return p.name.toLowerCase().includes(query);
      case "id":
        return p.id.toLowerCase().includes(query);
      case "phone":
        return p.phone.includes(query);
      default:
        return true;
    }
  });

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
  }

  function viewPatient(patient) {
    setSelectedPatient(patient);
    setShowDetailModal(true);
  }

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
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium min-h-[44px] flex items-center gap-2"
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
        Showing {filteredPatients.length} of {patients.length} patients
      </p>

      {/* Patient Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
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
              </div>
            </div>

            <div className="space-y-2 text-sm mb-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <PhoneIcon className="w-4 h-4" />
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
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => viewPatient(patient)}
                className="flex-1 px-3 py-2 bg-emerald-600 text-white rounded text-sm hover:bg-emerald-700 min-h-[44px]"
                aria-label={`View profile of ${patient.name}`}
              >
                View Profile
              </button>
              <button
                className="px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 min-h-[44px]"
                aria-label={`Add appointment for ${patient.name}`}
              >
                + Appt
              </button>
            </div>
          </div>
        ))}
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
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Full Name *</label>
                <input
                  type="text"
                  value={newPatient.name}
                  onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
                  className="w-full px-4 py-2 border border-input rounded-lg bg-background min-h-[44px]"
                  placeholder="Enter patient name"
                />
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
                  value={newPatient.dob}
                  onChange={(e) => setNewPatient({ ...newPatient, dob: e.target.value })}
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
      {showDetailModal && selectedPatient && (
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
                <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center text-2xl font-bold">
                  {selectedPatient.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-foreground">{selectedPatient.name}</h4>
                  <p className="text-muted-foreground">{selectedPatient.id}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-muted p-3 rounded-lg">
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
              </div>

              <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-200 dark:border-red-800">
                <p className="text-xs text-red-600 dark:text-red-400 font-medium">Allergies</p>
                <p className="text-foreground">{selectedPatient.allergies}</p>
              </div>

              <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg border border-amber-200 dark:border-amber-800">
                <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">Chronic Conditions</p>
                <p className="text-foreground">{selectedPatient.chronicConditions}</p>
              </div>

              <div className="bg-muted p-3 rounded-lg">
                <p className="text-xs text-muted-foreground font-medium">Medical History</p>
                <p className="text-foreground">{selectedPatient.medicalHistory}</p>
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
      )}

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
                : "bg-blue-500"
            }`}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </div>
  );
}
