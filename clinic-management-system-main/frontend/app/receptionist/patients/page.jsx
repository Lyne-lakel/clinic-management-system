"use client";

import { useState, useEffect } from "react";
import { Search, Plus, X, User, Phone as PhoneIcon, Calendar, FileText } from "lucide-react";
import { API_RECEPTIONIST } from "@/config/api";

export default function PatientsPage() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("name");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [toasts, setToasts] = useState([]);

  // =========================================================================
  // FETCH PATIENTS ON LOAD
  // =========================================================================
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_RECEPTIONIST}/patients`);
        const data = await response.json();
        setPatients(data.data || []);
        setLoading(false);
      } catch (err) {
        console.error("[Patients] Error fetching patients:", err);
        setError(err.message);
        setLoading(false);
      }
    };
    
    fetchPatients();
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
        return (p.firstName + " " + p.lastName).toLowerCase().includes(query);
      case "id":
        return p._id.toLowerCase().includes(query);
      case "phone":
        return p.phone.includes(query);
      default:
        return true;
    }
  });

  async function handleAddPatient() {
    if (!newPatient.firstName || !newPatient.phone) {
      showToast("First name and phone are required", "error");
      return;
    }

    try {
      const response = await fetch(`${API_RECEPTIONIST}/patients`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: newPatient.firstName,
          lastName: newPatient.lastName || "",
          phone: newPatient.phone,
          dateOfBirth: newPatient.dateOfBirth || null,
          allergies: newPatient.allergies || "None",
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
      setPatients([...patients, data.data]);
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
  }

  function viewPatient(patient) {
    setSelectedPatient(patient);
    setShowDetailModal(true);
  }

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
          className="px-6 py-3 bg-[#1d4ed8] text-white rounded-lg hover:bg-[#1d4ed8] font-medium min-h-[44px] flex items-center gap-2"
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
            key={patient._id}
            className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start gap-3 mb-3">
              <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 text-[#1d4ed8] flex items-center justify-center font-bold text-lg">
                {patient.firstName.charAt(0)}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">{patient.firstName} {patient.lastName || ""}</h3>
                <p className="text-sm text-muted-foreground">{patient._id.slice(0, 8)} | Phone: {patient.phone}</p>
              </div>
            </div>

            <div className="space-y-2 text-sm mb-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <PhoneIcon className="w-4 h-4" />
                <span>{patient.phone}</span>
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
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => viewPatient(patient)}
                className="flex-1 px-3 py-2 bg-emerald-600 text-white rounded text-sm hover:bg-emerald-700 min-h-[44px]"
                aria-label={`View profile of ${patient.firstName}`}
              >
                View Profile
              </button>
              <button
                className="px-3 py-2 bg-[#1d4ed8] text-white rounded text-sm hover:bg-[#1e40af] min-h-[44px]"
                aria-label={`Add appointment for ${patient.firstName}`}
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
                  <label className="block text-sm font-medium text-foreground mb-1">Last Name</label>
                  <input
                    type="text"
                    value={newPatient.lastName}
                    onChange={(e) => setNewPatient({ ...newPatient, lastName: e.target.value })}
                    className="w-full px-4 py-2 border border-input rounded-lg bg-background min-h-[44px]"
                    placeholder="Last name"
                  />
                </div>
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
                  value={newPatient.dateOfBirth}
                  onChange={(e) => setNewPatient({ ...newPatient, dateOfBirth: e.target.value })}
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

              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleAddPatient}
                  disabled={!newPatient.firstName || !newPatient.phone}
                  className="flex-1 px-4 py-2 bg-[#1d4ed8] text-white rounded-lg hover:bg-[#1e40af] disabled:opacity-50 min-h-[44px]"
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
                <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 text-[#1d4ed8] flex items-center justify-center text-2xl font-bold">
                  {selectedPatient.firstName.charAt(0)}
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-foreground">{selectedPatient.firstName} {selectedPatient.lastName || ""}</h4>
                  <p className="text-muted-foreground">{selectedPatient._id.slice(0, 8)}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-muted p-3 rounded-lg">
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="font-medium text-foreground">{selectedPatient.phone}</p>
                </div>
                <div className="bg-muted p-3 rounded-lg">
                  <p className="text-xs text-muted-foreground">DOB</p>
                  <p className="font-medium text-foreground">{selectedPatient.dateOfBirth || "N/A"}</p>
                </div>
              </div>

              <div className="bg-muted p-3 rounded-lg">
                <p className="text-xs text-muted-foreground">Last Visit</p>
                <p className="font-medium text-foreground">{selectedPatient.lastVisit || "No previous visits"}</p>
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
                : "bg-[#1d4ed8]"
            }`}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </div>
  );
}
