"use client";

/**
 * =============================================================================
 * DOCTOR DASHBOARD PAGE
 * =============================================================================
 * 
 * PURPOSE:
 * Main dashboard showing only TODAY's schedule with ability to start/cancel/reschedule.
 * 
 * FEATURES:
 * - Welcome message with date
 * - Summary cards (total today, waiting, completed)
 * - Today's appointments list (oldest first) with:
 *   - Time next to patient name
 *   - Patient notes underneath
 *   - Start Consultation / Cancel / Reschedule buttons
 * - Consultation modal with:
 *   - Patient profile (allergies, chronic, history, records, justifications)
 *   - Notes textarea
 *   - Prescription with default placeholder text
 *   - Justification with default placeholder text
 *   - Print Prescription button (only prescription)
 *   - Print Justification button (only justification)
 * 
 * =============================================================================
 */

import { useState } from "react";
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  Play,
  X,
  Printer,
  Save,
  Phone,
  AlertTriangle,
  FileText,
  RefreshCw,
  Trash2,
  History,
  FileCheck,
  CalendarPlus,
  FileUp
} from "lucide-react";

// =============================================================================
// MOCK DATA - Today's appointments with patient details
// =============================================================================
const initialAppointments = [
  { 
    id: 1, 
    time: "09:00", 
    patient: "Amira Bouzid", 
    age: 32, 
    phone: "+213 555 123456",
    reason: "Prenatal checkup - 28 weeks", 
    patientNotes: "Please check my blood pressure, it was high last time",
    allergies: "None", 
    chronicConditions: "None", 
    lastVisit: "2026-03-15",
    status: "completed",
    notes: "Normal progression, baby healthy",
    prescription: "",
    justification: "",
    visitHistory: [
      { date: "2026-03-15", time: "10:00", reason: "Prenatal checkup - 24 weeks", notes: "All measurements normal", prescription: "Prenatal vitamins" },
    ],
    medicalRecords: ["Blood test - Feb 2026", "Ultrasound - Mar 2026"],
    justifications: [{ date: "2026-03-15", content: "Medical leave for prenatal care", days: 3 }]
  },
  { 
    id: 2, 
    time: "09:30", 
    patient: "Fatima Zerhouni", 
    age: 45, 
    phone: "+213 555 234567",
    reason: "Annual gynecological exam", 
    patientNotes: "I have been experiencing some discomfort",
    allergies: "Penicillin", 
    chronicConditions: "Hypertension", 
    lastVisit: "2025-04-20",
    status: "completed",
    notes: "",
    prescription: "",
    justification: "",
    visitHistory: [
      { date: "2025-04-20", time: "11:00", reason: "Annual exam", notes: "Pap smear normal", prescription: "Amlodipine 5mg" },
    ],
    medicalRecords: ["Pap smear - Apr 2025"],
    justifications: []
  },
  { 
    id: 3, 
    time: "10:00", 
    patient: "Khadija Benali", 
    age: 28, 
    phone: "+213 555 345678",
    reason: "Fertility consultation", 
    patientNotes: "Follow-up on hormone results",
    allergies: "None", 
    chronicConditions: "None", 
    lastVisit: "2026-03-01",
    status: "waiting",
    notes: "",
    prescription: "",
    justification: "",
    visitHistory: [
      { date: "2026-03-01", time: "14:00", reason: "Initial fertility consultation", notes: "Ordered hormone panel", prescription: "" },
    ],
    medicalRecords: ["Hormone panel - Mar 2026"],
    justifications: []
  },
  { 
    id: 4, 
    time: "10:30", 
    patient: "Meriem Saidi", 
    age: 35, 
    phone: "+213 555 456789",
    reason: "Prenatal checkup - 16 weeks", 
    patientNotes: "Feeling nauseous in the mornings",
    allergies: "Sulfa drugs", 
    chronicConditions: "Gestational diabetes", 
    lastVisit: "2026-03-20",
    status: "waiting",
    notes: "",
    prescription: "",
    justification: "",
    visitHistory: [
      { date: "2026-03-20", time: "10:30", reason: "Prenatal checkup - 12 weeks", notes: "GD diagnosed", prescription: "Glucose monitoring" },
    ],
    medicalRecords: ["Glucose test - Mar 2026"],
    justifications: [{ date: "2026-03-20", content: "Rest recommended due to gestational diabetes", days: 2 }]
  },
  { 
    id: 5, 
    time: "11:00", 
    patient: "Nadia Hamidi", 
    age: 52, 
    phone: "+213 555 567890",
    reason: "Menopause management", 
    patientNotes: "Hot flashes have reduced but still present",
    allergies: "Aspirin", 
    chronicConditions: "Osteoporosis", 
    lastVisit: "2026-02-15",
    status: "waiting",
    notes: "",
    prescription: "",
    justification: "",
    visitHistory: [
      { date: "2026-02-15", time: "15:00", reason: "HRT follow-up", notes: "Symptoms improved", prescription: "HRT patch, Calcium+D3" },
    ],
    medicalRecords: ["Bone density - Feb 2026"],
    justifications: []
  },
  { 
    id: 6, 
    time: "11:30", 
    patient: "Souad Mahfoud", 
    age: 29, 
    phone: "+213 555 678901",
    reason: "Post-surgery follow-up", 
    patientNotes: "Healing well, some minor pain",
    allergies: "None", 
    chronicConditions: "None", 
    lastVisit: "2026-03-25",
    status: "waiting",
    notes: "",
    prescription: "",
    justification: "",
    visitHistory: [
      { date: "2026-03-25", time: "09:00", reason: "Surgery - laparoscopy", notes: "Procedure successful", prescription: "Pain medication" },
    ],
    medicalRecords: ["Surgery report - Mar 2026"],
    justifications: [{ date: "2026-03-25", content: "Post-operative recovery leave", days: 7 }]
  },
];

// Default prescription placeholder
const DEFAULT_PRESCRIPTION = `Medication: 
Dosage: 
Frequency: 
Duration: 
Special instructions: `;

// Default justification placeholder
const DEFAULT_JUSTIFICATION = `This is to certify that the patient mentioned above was examined on this date and requires:

[ ] Medical leave for ___ days
[ ] Rest at home
[ ] Light duty work
[ ] Other: _______________

Reason: `;

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================
function getTodayDate() {
  const today = new Date();
  const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
  return today.toLocaleDateString("en-US", options);
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================
export default function DoctorDashboard() {
  const [appointments, setAppointments] = useState(initialAppointments);
  const [showConsultation, setShowConsultation] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [consultNotes, setConsultNotes] = useState("");
  const [consultPrescription, setConsultPrescription] = useState("");
  const [consultJustification, setConsultJustification] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const [toasts, setToasts] = useState([]);
  
  // Follow-up date state
  const [followUpDate, setFollowUpDate] = useState("");
  const [followUpEndDate, setFollowUpEndDate] = useState("");
  const [isDateRange, setIsDateRange] = useState(false);
  
  // Requested documents state (simple text placeholder)
  const [requestedDocs, setRequestedDocs] = useState("");

  // Toast helper
  const showToast = (message, type = "success") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  // Stats calculations
  const totalToday = appointments.length;
  const waitingCount = appointments.filter(a => a.status === "waiting").length;
  const completedCount = appointments.filter(a => a.status === "completed").length;

  // Sort appointments: waiting/is_serving first (by time), then completed at the bottom
  const sortedAppointments = [...appointments].sort((a, b) => {
    // Completed appointments go to the bottom
    if (a.status === "completed" && b.status !== "completed") return 1;
    if (a.status !== "completed" && b.status === "completed") return -1;
    // Otherwise sort by time (oldest first)
    return a.time.localeCompare(b.time);
  });

  // Start consultation
  const handleStartConsultation = (patient) => {
    setSelectedPatient(patient);
    setConsultNotes(patient.notes || "");
    setConsultPrescription(patient.prescription || DEFAULT_PRESCRIPTION);
    setConsultJustification(patient.justification || DEFAULT_JUSTIFICATION);
    setShowHistory(false);
    // Reset follow-up and requested docs
    setFollowUpDate(patient.followUpDate || "");
    setFollowUpEndDate(patient.followUpEndDate || "");
    setIsDateRange(!!patient.followUpEndDate);
    setRequestedDocs(patient.requestedDocs || "");
    setAppointments(prev => 
      prev.map(a => a.id === patient.id ? { ...a, status: "is_serving" } : a)
    );
    setShowConsultation(true);
    showToast("Consultation started", "info");
  };

  // Save consultation
  const handleSave = () => {
    if (!selectedPatient) return;
    setAppointments(prev =>
      prev.map(a => 
        a.id === selectedPatient.id 
          ? { 
              ...a, 
              status: "completed", 
              notes: consultNotes, 
              prescription: consultPrescription, 
              justification: consultJustification,
              followUpDate: followUpDate,
              followUpEndDate: isDateRange ? followUpEndDate : "",
              requestedDocs: requestedDocs
            }
          : a
      )
    );
    setShowConsultation(false);
    setSelectedPatient(null);
    setConsultNotes("");
    setConsultPrescription("");
    setConsultJustification("");
    setFollowUpDate("");
    setFollowUpEndDate("");
    setIsDateRange(false);
    setRequestedFiles([]);
    setNewFileRequest("");
    setShowHistory(false);
    showToast("Consultation saved");
  };

  // Print prescription - ONLY prescription content
  const handlePrintPrescription = () => {
    if (!selectedPatient) return;
    
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Prescription - ${selectedPatient.patient}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
          .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 20px; margin-bottom: 30px; }
          .clinic-name { font-size: 24px; font-weight: bold; color: #0066cc; }
          .doctor-info { margin-top: 10px; color: #666; }
          .patient-info { background: #f5f5f5; padding: 15px; border-radius: 8px; margin-bottom: 30px; }
          .patient-name { font-size: 18px; font-weight: bold; }
          .section { margin-bottom: 25px; }
          .section-title { font-weight: bold; font-size: 14px; color: #333; margin-bottom: 10px; border-bottom: 1px solid #ddd; padding-bottom: 5px; }
          .content { white-space: pre-wrap; line-height: 1.6; }
          .footer { margin-top: 50px; text-align: right; }
          @media print { body { padding: 20px; } }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="clinic-name">CityMed Clinic</div>
          <div class="doctor-info">
            <div>Dr. Ahmed Nouar - Gynecologist</div>
            <div>123 Medical Center Blvd, Algiers</div>
            <div>Tel: +213 21 123 456</div>
          </div>
        </div>
        <div class="patient-info">
          <div class="patient-name">${selectedPatient.patient}</div>
          <div>Age: ${selectedPatient.age} years | Phone: ${selectedPatient.phone}</div>
        </div>
<div class="section">
  <div class="section-title">PRESCRIPTION</div>
  <div class="content">${consultPrescription || "No prescription"}</div>
  </div>
  ${requestedDocs ? `
  <div class="section">
  <div class="section-title">REQUESTED DOCUMENTS</div>
  <div class="content">${requestedDocs}</div>
  </div>
  ` : ""}
  ${followUpDate ? `
  <div class="section">
  <div class="section-title">FOLLOW-UP</div>
  <div class="content">Scheduled for: ${followUpDate}${isDateRange && followUpEndDate ? " to " + followUpEndDate : ""}</div>
  </div>
  ` : ""}
  <div class="footer">
          <div>Date: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</div>
          <div style="margin-top: 50px; border-top: 1px solid #000; width: 200px; margin-left: auto;"></div>
          <div style="margin-top: 5px;">Dr. Ahmed Nouar</div>
        </div>
        <script>window.print();</script>
      </body>
      </html>
    `);
    printWindow.document.close();
    showToast("Printing prescription", "info");
  };

  // Print justification - ONLY justification content
  const handlePrintJustification = () => {
    if (!selectedPatient) return;
    
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Medical Justification - ${selectedPatient.patient}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
          .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 20px; margin-bottom: 30px; }
          .clinic-name { font-size: 24px; font-weight: bold; color: #0066cc; }
          .doctor-info { margin-top: 10px; color: #666; }
          .patient-info { background: #f5f5f5; padding: 15px; border-radius: 8px; margin-bottom: 30px; }
          .patient-name { font-size: 18px; font-weight: bold; }
          .section { margin-bottom: 25px; }
          .section-title { font-weight: bold; font-size: 16px; color: #333; margin-bottom: 15px; text-align: center; text-transform: uppercase; }
          .content { white-space: pre-wrap; line-height: 1.8; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
          .footer { margin-top: 50px; text-align: right; }
          @media print { body { padding: 20px; } }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="clinic-name">CityMed Clinic</div>
          <div class="doctor-info">
            <div>Dr. Ahmed Nouar - Gynecologist</div>
            <div>123 Medical Center Blvd, Algiers</div>
            <div>Tel: +213 21 123 456</div>
          </div>
        </div>
        <div class="patient-info">
          <div class="patient-name">${selectedPatient.patient}</div>
          <div>Age: ${selectedPatient.age} years | Phone: ${selectedPatient.phone}</div>
        </div>
        <div class="section">
          <div class="section-title">Medical Justification</div>
          <div class="content">${consultJustification || "No justification provided"}</div>
        </div>
        <div class="footer">
          <div>Date: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</div>
          <div style="margin-top: 50px; border-top: 1px solid #000; width: 200px; margin-left: auto;"></div>
          <div style="margin-top: 5px;">Dr. Ahmed Nouar</div>
          <div style="font-size: 12px; color: #666;">Medical License No: 12345</div>
        </div>
        <script>window.print();</script>
      </body>
      </html>
    `);
    printWindow.document.close();
    showToast("Printing justification", "info");
  };

  // Close consultation
  const handleCloseConsultation = () => {
    if (selectedPatient) {
      setAppointments(prev =>
        prev.map(a => a.id === selectedPatient.id ? { ...a, status: "waiting" } : a)
      );
    }
    setShowConsultation(false);
    setSelectedPatient(null);
    setConsultNotes("");
    setConsultPrescription("");
    setConsultJustification("");
    setFollowUpDate("");
    setFollowUpEndDate("");
    setIsDateRange(false);
    setRequestedDocs("");
    setShowHistory(false);
  };

  // Reschedule appointment
  const handleReschedule = (aptId) => {
    showToast("Reschedule request sent to receptionist", "info");
  };

  // Cancel appointment
  const handleCancel = (aptId) => {
    if (confirm("Are you sure you want to cancel this appointment?")) {
      setAppointments(prev => prev.filter(a => a.id !== aptId));
      showToast("Appointment cancelled", "warning");
    }
  };

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      {/* Welcome Section with Date */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Welcome, Dr. Ahmed Nouar</h1>
        <p className="text-muted-foreground">{getTodayDate()}</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-lg p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Today</p>
              <p className="text-2xl font-bold text-foreground">{totalToday}</p>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Waiting</p>
              <p className="text-2xl font-bold text-foreground">{waitingCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Completed</p>
              <p className="text-2xl font-bold text-foreground">{completedCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Today's Appointments List */}
      <div className="bg-card border border-border rounded-lg shadow-sm">
        <div className="p-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">Today&apos;s Schedule</h2>
        </div>
        
        <div className="divide-y divide-border">
          {sortedAppointments.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              No appointments scheduled for today
            </div>
          ) : (
            sortedAppointments.map((apt) => (
              <div 
                key={apt.id} 
                className={`p-4 ${apt.status === "completed" ? "opacity-60 bg-muted/20" : ""}`}
              >
                <div className="flex items-start justify-between gap-4">
                  {/* Left: Time + Patient Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-lg font-bold text-blue-600">{apt.time}</span>
                      <span className="font-semibold text-foreground">{apt.patient}</span>
                      {apt.status === "is_serving" && (
                        <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-700 font-medium">
                          In Consultation
                        </span>
                      )}
                      {apt.status === "completed" && (
                        <CheckCircle className="w-5 h-5 text-emerald-500" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">{apt.reason}</p>
                    {apt.patientNotes && (
                      <p className="text-sm text-foreground bg-muted/50 px-3 py-2 rounded-lg italic">
                        &ldquo;{apt.patientNotes}&rdquo;
                      </p>
                    )}
                  </div>
                  
                  {/* Right: Action Buttons */}
                  {apt.status === "waiting" && (
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleStartConsultation(apt)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2 min-h-[40px]"
                      >
                        <Play className="w-4 h-4" />
                        Start
                      </button>
                      <button
                        onClick={() => handleReschedule(apt.id)}
                        className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg min-h-[40px] min-w-[40px] flex items-center justify-center"
                        aria-label="Reschedule"
                        title="Reschedule"
                      >
                        <RefreshCw className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleCancel(apt.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg min-h-[40px] min-w-[40px] flex items-center justify-center"
                        aria-label="Cancel"
                        title="Cancel"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Consultation Modal */}
      {showConsultation && selectedPatient && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl w-full max-w-5xl shadow-xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="p-4 border-b border-border flex items-center justify-between shrink-0">
              <div>
                <h2 className="font-semibold text-lg text-foreground">Consultation</h2>
                <p className="text-sm text-muted-foreground">
                  {selectedPatient.patient} - {selectedPatient.time}
                </p>
              </div>
              <button
                onClick={handleCloseConsultation}
                aria-label="Close Modal"
                className="p-2 hover:bg-muted rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            
            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Left: Patient Profile */}
                <div className="space-y-4">
                  {/* Basic Info */}
                  <div className="bg-muted/30 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold">
                        {selectedPatient.patient.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-foreground">{selectedPatient.patient}</h3>
                        <p className="text-sm text-muted-foreground">{selectedPatient.age} years old</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-muted-foreground">Phone:</span>
                        <p className="font-medium">{selectedPatient.phone}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Last Visit:</span>
                        <p className="font-medium">{selectedPatient.lastVisit}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Medical Info */}
                  <div className="bg-muted/30 rounded-lg p-4 space-y-3">
                    <h4 className="font-medium text-foreground">Medical Information</h4>
                    <div>
                      <span className="text-xs text-muted-foreground">Reason for Visit:</span>
                      <p className="text-sm font-medium text-foreground">{selectedPatient.reason}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <span className="text-xs text-muted-foreground">Allergies:</span>
                        <p className={`text-sm font-medium ${selectedPatient.allergies !== "None" ? "text-red-600" : "text-foreground"}`}>
                          {selectedPatient.allergies}
                        </p>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground">Chronic Conditions:</span>
                        <p className={`text-sm font-medium ${selectedPatient.chronicConditions !== "None" ? "text-amber-600" : "text-foreground"}`}>
                          {selectedPatient.chronicConditions}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Appointment History Button */}
                  <button
                    onClick={() => setShowHistory(!showHistory)}
                    className="w-full bg-muted text-foreground px-4 py-3 rounded-lg font-medium hover:bg-muted/80 flex items-center justify-center gap-2"
                  >
                    <History className="w-5 h-5" />
                    {showHistory ? "Hide" : "View"} Appointment History
                  </button>

                  {/* Appointment History */}
                  {showHistory && (
                    <div className="bg-muted/30 rounded-lg p-4 space-y-3 max-h-60 overflow-y-auto">
                      <h4 className="font-medium text-foreground">Past Visits</h4>
                      {selectedPatient.visitHistory && selectedPatient.visitHistory.length > 0 ? (
                        selectedPatient.visitHistory.map((visit, idx) => (
                          <div key={idx} className="border-l-2 border-blue-500 pl-3 py-2">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-foreground">{visit.date} at {visit.time}</p>
                                <p className="text-xs text-muted-foreground">{visit.reason}</p>
                              </div>
                              {visit.notes && (
                                <button
                                  onClick={() => alert(`Notes: ${visit.notes}\n\nPrescription: ${visit.prescription || "None"}`)}
                                  className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                  title="View notes"
                                >
                                  <FileText className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">No previous visits</p>
                      )}

                      {/* Medical Records */}
                      {selectedPatient.medicalRecords && selectedPatient.medicalRecords.length > 0 && (
                        <>
                          <h4 className="font-medium text-foreground mt-4">Medical Records</h4>
                          {selectedPatient.medicalRecords.map((record, idx) => (
                            <p key={idx} className="text-sm text-foreground flex items-center gap-2">
                              <FileText className="w-4 h-4 text-muted-foreground" />
                              {record}
                            </p>
                          ))}
                        </>
                      )}

                      {/* Justifications */}
                      {selectedPatient.justifications && selectedPatient.justifications.length > 0 && (
                        <>
                          <h4 className="font-medium text-foreground mt-4">Past Justifications</h4>
                          {selectedPatient.justifications.map((just, idx) => (
                            <div key={idx} className="text-sm bg-purple-50 p-2 rounded">
                              <p className="font-medium text-purple-700">{just.date} - {just.days} days</p>
                              <p className="text-purple-600">{just.content}</p>
                            </div>
                          ))}
                        </>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Right: Notes, Prescription, Justification */}
                <div className="space-y-4">
                  {/* Notes - NOT printed */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Notes <span className="text-xs text-muted-foreground">(not printed)</span>
                    </label>
                    <textarea
                      value={consultNotes}
                      onChange={(e) => setConsultNotes(e.target.value)}
                      placeholder="Write consultation notes..."
                      rows={4}
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  {/* Prescription - with default placeholder */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Prescription
                    </label>
                    <textarea
                      value={consultPrescription}
                      onChange={(e) => setConsultPrescription(e.target.value)}
                      rows={5}
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                    />
                  </div>

                  {/* Justification - with default placeholder */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      <span className="flex items-center gap-1">
                        <FileCheck className="w-4 h-4" />
                        Medical Justification
                      </span>
                    </label>
                    <textarea
                      value={consultJustification}
                      onChange={(e) => setConsultJustification(e.target.value)}
                      rows={5}
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono text-sm"
                    />
                  </div>

                  {/* Follow-up Date Section */}
                  <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4">
                    <label className="block text-sm font-medium text-foreground mb-2">
                      <span className="flex items-center gap-1">
                        <CalendarPlus className="w-4 h-4 text-amber-600" />
                        Schedule Follow-up
                      </span>
                    </label>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <input
                          type="date"
                          value={followUpDate}
                          onChange={(e) => setFollowUpDate(e.target.value)}
                          className="flex-1 px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                        <label className="flex items-center gap-2 text-sm text-foreground">
                          <input
                            type="checkbox"
                            checked={isDateRange}
                            onChange={(e) => setIsDateRange(e.target.checked)}
                            className="w-4 h-4 rounded border-border text-amber-600 focus:ring-amber-500"
                          />
                          Date Range
                        </label>
                      </div>
                      {isDateRange && (
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">to</span>
                          <input
                            type="date"
                            value={followUpEndDate}
                            onChange={(e) => setFollowUpEndDate(e.target.value)}
                            min={followUpDate}
                            className="flex-1 px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500"
                          />
                        </div>
                      )}
                      {followUpDate && (
                        <p className="text-xs text-amber-600">
                          Follow-up scheduled for: {followUpDate}{isDateRange && followUpEndDate ? ` to ${followUpEndDate}` : ""}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Request Documents Section - Simple Textarea */}
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                    <label className="block text-sm font-medium text-foreground mb-2">
                      <span className="flex items-center gap-1">
                        <FileUp className="w-4 h-4 text-blue-600" />
                        Request Documents from Patient
                      </span>
                    </label>
                    <textarea
                      value={requestedDocs}
                      onChange={(e) => setRequestedDocs(e.target.value)}
                      placeholder="Enter the documents you need from the patient (e.g., blood test results, X-ray, prescription from another doctor...)"
                      rows={3}
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                    <p className="text-xs text-muted-foreground mt-1">This will appear on the printed prescription</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Modal Footer */}
            <div className="p-4 border-t border-border flex flex-wrap gap-3 shrink-0">
              <button
                onClick={handleSave}
                className="flex-1 bg-emerald-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-emerald-700 flex items-center justify-center gap-2 min-h-[44px]"
              >
                <Save className="w-5 h-5" />
                Save
              </button>
              <button
                onClick={handlePrintPrescription}
                className="bg-blue-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-blue-700 flex items-center justify-center gap-2 min-h-[44px]"
              >
                <Printer className="w-5 h-5" />
                Print Prescription
              </button>
              <button
                onClick={handlePrintJustification}
                className="bg-purple-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-purple-700 flex items-center justify-center gap-2 min-h-[44px]"
              >
                <FileCheck className="w-5 h-5" />
                Print Justification
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notifications */}
      <div className="fixed bottom-20 md:bottom-5 right-5 space-y-2 z-50">
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
