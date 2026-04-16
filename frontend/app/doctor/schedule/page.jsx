"use client";

/**
 * =============================================================================
 * DOCTOR SCHEDULE PAGE
 * =============================================================================
 * 
 * PURPOSE:
 * Display all appointments with a week calendar (expandable to month view).
 * 
 * FEATURES:
 * - Horizontal week calendar (default view)
 * - Expand to full month calendar view
 * - Click on a day to see appointments for that day
 * - Appointments list sorted oldest first
 * - Reschedule and cancel options
 * - Start consultation opens full modal
 * 
 * =============================================================================
 */

import { useState } from "react";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Play,
  Clock,
  X,
  Save,
  Printer,
  Phone,
  AlertTriangle,
  CheckCircle,
  FileText,
  History,
  RefreshCw,
  Trash2,
  FileCheck,
  Maximize2,
  Minimize2
} from "lucide-react";

// =============================================================================
// MOCK DATA - All appointments with patient details
// =============================================================================
const allAppointments = [
  // Today (April 13, 2026)
  { 
    id: 1, 
    date: "2026-04-13",
    time: "09:00", 
    patient: "Amira Bouzid", 
    age: 32, 
    phone: "+213 555 123456",
    reason: "Prenatal checkup - 28 weeks", 
    patientNotes: "Please check my blood pressure",
    allergies: "None", 
    chronicConditions: "None", 
    lastVisit: "2026-03-15",
    status: "completed",
    notes: "Normal progression",
    prescription: "",
    justification: "",
    visitHistory: [
      { date: "2026-03-15", time: "10:00", reason: "Prenatal checkup - 24 weeks", notes: "All measurements normal", prescription: "Prenatal vitamins" },
    ],
    medicalRecords: ["Blood test - Feb 2026"],
    justifications: []
  },
  { 
    id: 2, 
    date: "2026-04-13",
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
    visitHistory: [],
    medicalRecords: ["Hormone panel - Mar 2026"],
    justifications: []
  },
  { 
    id: 3, 
    date: "2026-04-13",
    time: "11:00", 
    patient: "Nadia Hamidi", 
    age: 52, 
    phone: "+213 555 567890",
    reason: "Menopause management", 
    patientNotes: "Hot flashes reduced",
    allergies: "Aspirin", 
    chronicConditions: "Osteoporosis", 
    lastVisit: "2026-02-15",
    status: "waiting",
    notes: "",
    prescription: "",
    justification: "",
    visitHistory: [],
    medicalRecords: ["Bone density - Feb 2026"],
    justifications: []
  },
  // Tomorrow
  { 
    id: 4, 
    date: "2026-04-14",
    time: "09:30", 
    patient: "Fatima Zerhouni", 
    age: 45, 
    phone: "+213 555 234567",
    reason: "Annual gynecological exam", 
    patientNotes: "",
    allergies: "Penicillin", 
    chronicConditions: "Hypertension", 
    lastVisit: "2025-04-20",
    status: "waiting",
    notes: "",
    prescription: "",
    justification: "",
    visitHistory: [],
    medicalRecords: [],
    justifications: []
  },
  { 
    id: 5, 
    date: "2026-04-14",
    time: "10:30", 
    patient: "Meriem Saidi", 
    age: 35, 
    phone: "+213 555 456789",
    reason: "Prenatal checkup - 16 weeks", 
    patientNotes: "Morning sickness",
    allergies: "Sulfa drugs", 
    chronicConditions: "Gestational diabetes", 
    lastVisit: "2026-03-20",
    status: "waiting",
    notes: "",
    prescription: "",
    justification: "",
    visitHistory: [],
    medicalRecords: [],
    justifications: []
  },
  // April 15
  { 
    id: 6, 
    date: "2026-04-15",
    time: "11:30", 
    patient: "Souad Mahfoud", 
    age: 29, 
    phone: "+213 555 678901",
    reason: "Post-surgery follow-up", 
    patientNotes: "Healing well",
    allergies: "None", 
    chronicConditions: "None", 
    lastVisit: "2026-03-25",
    status: "waiting",
    notes: "",
    prescription: "",
    justification: "",
    visitHistory: [],
    medicalRecords: [],
    justifications: []
  },
  // April 16
  { 
    id: 7, 
    date: "2026-04-16",
    time: "14:00", 
    patient: "Leila Bensaid", 
    age: 38, 
    phone: "+213 555 789012",
    reason: "Pregnancy confirmation", 
    patientNotes: "First pregnancy",
    allergies: "None", 
    chronicConditions: "None", 
    lastVisit: "",
    status: "waiting",
    notes: "",
    prescription: "",
    justification: "",
    visitHistory: [],
    medicalRecords: [],
    justifications: []
  },
  // April 17
  { 
    id: 8, 
    date: "2026-04-17",
    time: "09:00", 
    patient: "Samira Hadj", 
    age: 42, 
    phone: "+213 555 890123",
    reason: "Hormonal imbalance check", 
    patientNotes: "",
    allergies: "Ibuprofen", 
    chronicConditions: "PCOS", 
    lastVisit: "2026-02-01",
    status: "waiting",
    notes: "",
    prescription: "",
    justification: "",
    visitHistory: [],
    medicalRecords: [],
    justifications: []
  },
];

// Default placeholders
const DEFAULT_PRESCRIPTION = `Medication: 
Dosage: 
Frequency: 
Duration: 
Special instructions: `;

const DEFAULT_JUSTIFICATION = `This is to certify that the patient mentioned above was examined on this date and requires:

[ ] Medical leave for ___ days
[ ] Rest at home
[ ] Light duty work
[ ] Other: _______________

Reason: `;

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

function getWeekDays(startDate) {
  const days = [];
  const start = new Date(startDate);
  // Start from Monday
  const dayOfWeek = start.getDay();
  const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  start.setDate(start.getDate() + diff);
  
  for (let i = 0; i < 7; i++) {
    const day = new Date(start);
    day.setDate(start.getDate() + i);
    days.push(day);
  }
  return days;
}

function generateCalendarDays(year, month) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDay = firstDay.getDay();
  
  const days = [];
  // Fill empty slots for days before the 1st
  for (let i = 0; i < startingDay; i++) {
    days.push(null);
  }
  // Fill the actual days
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }
  return days;
}

function formatDate(date) {
  return date.toISOString().split("T")[0];
}

function formatDateDisplay(dateStr) {
  const date = new Date(dateStr);
  const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
  return date.toLocaleDateString("en-US", options);
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================
export default function DoctorSchedule() {
  const today = new Date();
  const [appointments, setAppointments] = useState(allAppointments);
  const [selectedDate, setSelectedDate] = useState(formatDate(today));
  const [weekStart, setWeekStart] = useState(new Date());
  const [expandedView, setExpandedView] = useState(false); // false = week, true = month
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  
  // Consultation modal state
  const [showConsultation, setShowConsultation] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [consultNotes, setConsultNotes] = useState("");
  const [consultPrescription, setConsultPrescription] = useState("");
  const [consultJustification, setConsultJustification] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const [toasts, setToasts] = useState([]);

  const monthNames = ["January", "February", "March", "April", "May", "June", 
                      "July", "August", "September", "October", "November", "December"];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const weekDays = getWeekDays(weekStart);
  const calendarDays = generateCalendarDays(currentYear, currentMonth);

  // Toast helper
  const showToast = (message, type = "success") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  // Get appointments for selected date
  const selectedDateAppointments = appointments
    .filter(apt => apt.date === selectedDate)
    .sort((a, b) => a.time.localeCompare(b.time));

  // Count appointments per date
  const getAppointmentCount = (dateStr) => {
    return appointments.filter(apt => apt.date === dateStr).length;
  };

  // Navigation
  const goToPrevWeek = () => {
    const newStart = new Date(weekStart);
    newStart.setDate(newStart.getDate() - 7);
    setWeekStart(newStart);
  };

  const goToNextWeek = () => {
    const newStart = new Date(weekStart);
    newStart.setDate(newStart.getDate() + 7);
    setWeekStart(newStart);
  };

  const goToPrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // Check if date is today
  const isToday = (dateStr) => {
    return dateStr === formatDate(today);
  };

  // Start consultation
  const handleStartConsultation = (patient) => {
    setSelectedPatient(patient);
    setConsultNotes(patient.notes || "");
    setConsultPrescription(patient.prescription || DEFAULT_PRESCRIPTION);
    setConsultJustification(patient.justification || DEFAULT_JUSTIFICATION);
    setShowHistory(false);
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
          ? { ...a, status: "completed", notes: consultNotes, prescription: consultPrescription, justification: consultJustification }
          : a
      )
    );
    setShowConsultation(false);
    setSelectedPatient(null);
    showToast("Consultation saved");
  };

  // Print functions
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
          .content { white-space: pre-wrap; line-height: 1.6; }
          .footer { margin-top: 50px; text-align: right; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="clinic-name">CityMed Clinic</div>
          <div class="doctor-info">Dr. Ahmed Nouar - Gynecologist<br/>123 Medical Center Blvd, Algiers</div>
        </div>
        <div class="patient-info">
          <strong>${selectedPatient.patient}</strong><br/>
          Age: ${selectedPatient.age} years | Phone: ${selectedPatient.phone}
        </div>
        <h3>PRESCRIPTION</h3>
        <div class="content">${consultPrescription || "No prescription"}</div>
        <div class="footer">
          <div>Date: ${new Date().toLocaleDateString()}</div>
          <div style="margin-top: 40px;">Dr. Ahmed Nouar</div>
        </div>
        <script>window.print();</script>
      </body>
      </html>
    `);
    printWindow.document.close();
    showToast("Printing prescription", "info");
  };

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
          .patient-info { background: #f5f5f5; padding: 15px; border-radius: 8px; margin-bottom: 30px; }
          .content { white-space: pre-wrap; line-height: 1.8; padding: 20px; border: 1px solid #ddd; }
          .footer { margin-top: 50px; text-align: right; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="clinic-name">CityMed Clinic</div>
          <div>Dr. Ahmed Nouar - Gynecologist</div>
        </div>
        <div class="patient-info">
          <strong>${selectedPatient.patient}</strong><br/>
          Age: ${selectedPatient.age} years
        </div>
        <h3>MEDICAL JUSTIFICATION</h3>
        <div class="content">${consultJustification || "No justification"}</div>
        <div class="footer">
          <div>Date: ${new Date().toLocaleDateString()}</div>
          <div style="margin-top: 40px;">Dr. Ahmed Nouar</div>
        </div>
        <script>window.print();</script>
      </body>
      </html>
    `);
    printWindow.document.close();
    showToast("Printing justification", "info");
  };

  const handleCloseConsultation = () => {
    if (selectedPatient) {
      setAppointments(prev =>
        prev.map(a => a.id === selectedPatient.id ? { ...a, status: "waiting" } : a)
      );
    }
    setShowConsultation(false);
    setSelectedPatient(null);
  };

  const handleReschedule = (aptId) => {
    showToast("Reschedule request sent to receptionist", "info");
  };

  const handleCancel = (aptId) => {
    if (confirm("Are you sure you want to cancel this appointment?")) {
      setAppointments(prev => prev.filter(a => a.id !== aptId));
      showToast("Appointment cancelled", "warning");
    }
  };

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Calendar className="w-6 h-6 text-blue-600" />
            Schedule
          </h1>
          <p className="text-muted-foreground">{formatDateDisplay(selectedDate)}</p>
        </div>
        <button
          onClick={() => setExpandedView(!expandedView)}
          className="p-2 hover:bg-muted rounded-lg flex items-center gap-2 text-sm text-muted-foreground"
        >
          {expandedView ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          {expandedView ? "Week View" : "Month View"}
        </button>
      </div>

      {/* Calendar Section */}
      <div className="bg-card border border-border rounded-lg p-4">
        {!expandedView ? (
          // WEEK VIEW - Horizontal
          <>
            <div className="flex items-center justify-between mb-4">
              <button onClick={goToPrevWeek} className="p-2 hover:bg-muted rounded-lg">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="font-medium text-foreground">
                {weekDays[0].toLocaleDateString("en-US", { month: "short", day: "numeric" })} - {weekDays[6].toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </span>
              <button onClick={goToNextWeek} className="p-2 hover:bg-muted rounded-lg">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-7 gap-2">
              {weekDays.map((day, idx) => {
                const dateStr = formatDate(day);
                const count = getAppointmentCount(dateStr);
                const isSelected = dateStr === selectedDate;
                const isTodayDate = isToday(dateStr);
                
                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedDate(dateStr)}
                    className={`p-3 rounded-lg text-center transition-colors min-h-[80px] flex flex-col items-center justify-center ${
                      isSelected
                        ? "bg-blue-600 text-white"
                        : isTodayDate
                        ? "bg-blue-100 text-blue-700 border-2 border-blue-500"
                        : "hover:bg-muted"
                    }`}
                  >
                    <span className="text-xs">{dayNames[day.getDay()]}</span>
                    <span className="text-lg font-bold">{day.getDate()}</span>
                    {count > 0 && (
                      <span className={`text-xs mt-1 px-2 py-0.5 rounded-full ${
                        isSelected ? "bg-white/30 text-white" : "bg-blue-100 text-blue-700"
                      }`}>
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </>
        ) : (
          // MONTH VIEW - Full Calendar
          <>
            <div className="flex items-center justify-between mb-4">
              <button onClick={goToPrevMonth} className="p-2 hover:bg-muted rounded-lg">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="font-medium text-foreground text-lg">
                {monthNames[currentMonth]} {currentYear}
              </span>
              <button onClick={goToNextMonth} className="p-2 hover:bg-muted rounded-lg">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-7 gap-1 mb-2">
              {dayNames.map(day => (
                <div key={day} className="text-center text-xs text-muted-foreground font-medium py-2">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, idx) => {
                if (!day) return <div key={idx} />;
                
                const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                const count = getAppointmentCount(dateStr);
                const isSelected = dateStr === selectedDate;
                const isTodayDate = isToday(dateStr);
                
                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedDate(dateStr)}
                    className={`p-2 rounded-lg text-center transition-colors min-h-[60px] flex flex-col items-center justify-center ${
                      isSelected
                        ? "bg-blue-600 text-white"
                        : isTodayDate
                        ? "bg-blue-100 text-blue-700 border border-blue-500"
                        : count > 0
                        ? "bg-muted/50 hover:bg-muted"
                        : "hover:bg-muted"
                    }`}
                  >
                    <span className="text-sm font-medium">{day}</span>
                    {count > 0 && (
                      <span className={`text-[10px] mt-0.5 ${isSelected ? "text-white/80" : "text-blue-600"}`}>
                        {count} apt
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Appointments List for Selected Date */}
      <div className="bg-card border border-border rounded-lg">
        <div className="p-4 border-b border-border">
          <h2 className="font-semibold text-foreground">
            Appointments for {new Date(selectedDate).toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
          </h2>
        </div>
        
        <div className="divide-y divide-border">
          {selectedDateAppointments.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              No appointments scheduled for this day
            </div>
          ) : (
            selectedDateAppointments.map((apt) => (
              <div key={apt.id} className={`p-4 ${apt.status === "completed" ? "opacity-60 bg-muted/20" : ""}`}>
                <div className="flex items-start justify-between gap-4">
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
                    <p className="text-sm text-muted-foreground">{apt.reason}</p>
                    {apt.patientNotes && (
                      <p className="text-sm text-foreground bg-muted/50 px-3 py-2 rounded-lg italic mt-2">
                        &ldquo;{apt.patientNotes}&rdquo;
                      </p>
                    )}
                  </div>
                  
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
                        className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg"
                        title="Reschedule"
                      >
                        <RefreshCw className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleCancel(apt.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
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
            <div className="p-4 border-b border-border flex items-center justify-between shrink-0">
              <div>
                <h2 className="font-semibold text-lg text-foreground">Consultation</h2>
                <p className="text-sm text-muted-foreground">{selectedPatient.patient} - {selectedPatient.time}</p>
              </div>
              <button onClick={handleCloseConsultation} className="p-2 hover:bg-muted rounded-lg">
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Patient Profile */}
                <div className="space-y-4">
                  <div className="bg-muted/30 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold">
                        {selectedPatient.patient.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{selectedPatient.patient}</h3>
                        <p className="text-sm text-muted-foreground">{selectedPatient.age} years old</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div><span className="text-muted-foreground">Phone:</span><p className="font-medium">{selectedPatient.phone}</p></div>
                      <div><span className="text-muted-foreground">Last Visit:</span><p className="font-medium">{selectedPatient.lastVisit || "First visit"}</p></div>
                    </div>
                  </div>
                  
                  <div className="bg-muted/30 rounded-lg p-4 space-y-3">
                    <h4 className="font-medium">Medical Information</h4>
                    <div><span className="text-xs text-muted-foreground">Reason:</span><p className="text-sm font-medium">{selectedPatient.reason}</p></div>
                    <div className="grid grid-cols-2 gap-3">
                      <div><span className="text-xs text-muted-foreground">Allergies:</span><p className={`text-sm font-medium ${selectedPatient.allergies !== "None" ? "text-red-600" : ""}`}>{selectedPatient.allergies}</p></div>
                      <div><span className="text-xs text-muted-foreground">Chronic:</span><p className={`text-sm font-medium ${selectedPatient.chronicConditions !== "None" ? "text-amber-600" : ""}`}>{selectedPatient.chronicConditions}</p></div>
                    </div>
                  </div>

                  <button onClick={() => setShowHistory(!showHistory)} className="w-full bg-muted text-foreground px-4 py-3 rounded-lg font-medium hover:bg-muted/80 flex items-center justify-center gap-2">
                    <History className="w-5 h-5" />
                    {showHistory ? "Hide" : "View"} History
                  </button>

                  {showHistory && (
                    <div className="bg-muted/30 rounded-lg p-4 space-y-3 max-h-60 overflow-y-auto">
                      <h4 className="font-medium">Past Visits</h4>
                      {selectedPatient.visitHistory && selectedPatient.visitHistory.length > 0 ? (
                        selectedPatient.visitHistory.map((visit, idx) => (
                          <div key={idx} className="border-l-2 border-blue-500 pl-3 py-2">
                            <p className="text-sm font-medium">{visit.date} at {visit.time}</p>
                            <p className="text-xs text-muted-foreground">{visit.reason}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">No previous visits</p>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Notes & Forms */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Notes <span className="text-xs text-muted-foreground">(not printed)</span></label>
                    <textarea value={consultNotes} onChange={(e) => setConsultNotes(e.target.value)} placeholder="Write consultation notes..." rows={4} className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Prescription</label>
                    <textarea value={consultPrescription} onChange={(e) => setConsultPrescription(e.target.value)} rows={5} className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1 flex items-center gap-1"><FileCheck className="w-4 h-4" />Medical Justification</label>
                    <textarea value={consultJustification} onChange={(e) => setConsultJustification(e.target.value)} rows={5} className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono text-sm" />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t border-border flex flex-wrap gap-3 shrink-0">
              <button onClick={handleSave} className="flex-1 bg-emerald-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-emerald-700 flex items-center justify-center gap-2 min-h-[44px]">
                <Save className="w-5 h-5" />Save
              </button>
              <button onClick={handlePrintPrescription} className="bg-blue-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-blue-700 flex items-center justify-center gap-2 min-h-[44px]">
                <Printer className="w-5 h-5" />Print Prescription
              </button>
              <button onClick={handlePrintJustification} className="bg-purple-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-purple-700 flex items-center justify-center gap-2 min-h-[44px]">
                <FileCheck className="w-5 h-5" />Print Justification
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toasts */}
      <div className="fixed bottom-20 md:bottom-5 right-5 space-y-2 z-50">
        {toasts.map((toast) => (
          <div key={toast.id} className={`px-4 py-3 rounded-lg shadow text-white ${toast.type === "success" ? "bg-green-500" : toast.type === "warning" ? "bg-yellow-500" : "bg-blue-500"}`}>
            {toast.message}
          </div>
        ))}
      </div>
    </div>
  );
}
