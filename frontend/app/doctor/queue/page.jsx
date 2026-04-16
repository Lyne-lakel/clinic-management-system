"use client";

import { useState } from "react";
import {
  ClipboardList,
  Play,
  CheckCircle,
  UserX,
  Clock,
} from "lucide-react";
import ConsultationModal from "@/components/doctor/ConsultationModal";

// Mock appointments data - queue only shows non-completed
const initialAppointments = [
  { id: 1, time: "09:00", patient: "Ahmed Benali", age: 45, reason: "Check-up", allergies: "Penicillin", chronicConditions: "Hypertension", lastVisit: "2026-03-15", contact: "+213 555 123456", visitHistory: [], medicalRecords: [], status: "completed", notes: "", prescription: "" },
  { id: 2, time: "09:30", patient: "Samira Khelifi", age: 28, reason: "Follow-up", allergies: "None", chronicConditions: "None", lastVisit: "2026-03-20", contact: "+213 555 234567", visitHistory: [], medicalRecords: [], status: "completed", notes: "", prescription: "" },
  { id: 3, time: "10:00", patient: "Youssef Amrani", age: 52, reason: "Chest pain", allergies: "Aspirin", chronicConditions: "Diabetes", lastVisit: "2026-02-28", contact: "+213 555 345678", visitHistory: [], medicalRecords: [], status: "is_serving", notes: "", prescription: "" },
  { id: 4, time: "10:30", patient: "Fatima Zohra", age: 32, reason: "Annual check-up", allergies: "None", chronicConditions: "Hypertension", lastVisit: "2026-03-15", contact: "+213 555 456789", visitHistory: [], medicalRecords: [], status: "present", notes: "Annual control", prescription: "" },
  { id: 5, time: "11:00", patient: "Karim Said", age: 41, reason: "Headache", allergies: "None", chronicConditions: "None", lastVisit: "2026-01-10", contact: "+213 555 567890", visitHistory: [], medicalRecords: [], status: "absent", notes: "", prescription: "" },
  { id: 6, time: "11:30", patient: "Nadia Boudiaf", age: 36, reason: "Skin rash", allergies: "Sulfa drugs", chronicConditions: "Asthma", lastVisit: "2026-03-01", contact: "+213 555 678901", visitHistory: [], medicalRecords: [], status: "present", notes: "", prescription: "" },
  { id: 7, time: "14:00", patient: "Lydia Mansour", age: 29, reason: "Emergency visit", allergies: "None", chronicConditions: "None", lastVisit: "2026-02-15", contact: "+213 555 789012", visitHistory: [], medicalRecords: [], status: "present", notes: "Emergency", prescription: "" },
  { id: 8, time: "14:30", patient: "Omar Bensalem", age: 58, reason: "Blood pressure", allergies: "Ibuprofen", chronicConditions: "Hypertension, Arthritis", lastVisit: "2026-03-10", contact: "+213 555 890123", visitHistory: [], medicalRecords: [], status: "absent", notes: "", prescription: "" },
  { id: 9, time: "15:00", patient: "Amina Cherif", age: 44, reason: "Joint pain", allergies: "None", chronicConditions: "None", lastVisit: "2026-02-20", contact: "+213 555 901234", visitHistory: [], medicalRecords: [], status: "present", notes: "", prescription: "" },
  { id: 10, time: "15:30", patient: "Rachid Hamidi", age: 67, reason: "Routine check", allergies: "Penicillin", chronicConditions: "Diabetes, Heart disease", lastVisit: "2026-03-05", contact: "+213 555 012345", visitHistory: [], medicalRecords: [], status: "present", notes: "", prescription: "" },
];

// Status badge component
function StatusBadge({ status }) {
  const styles = {
    present: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    absent: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
    is_serving: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  };
  const labels = {
    present: "Ready",
    absent: "Not Arrived",
    is_serving: "Current",
  };
  return (
    <span className={`text-xs px-2 py-1 rounded font-medium ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}

export default function DoctorQueue() {
  const [appointments, setAppointments] = useState(initialAppointments);
  const [showModal, setShowModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = "success") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  // Filter out completed - queue only shows active patients
  const queueAppointments = appointments.filter((a) => a.status !== "completed");

  // Get currently serving patient
  const currentlyServing = appointments.find((a) => a.status === "is_serving");

  // Waiting list (present patients)
  const waitingList = appointments.filter((a) => a.status === "present");

  // Stats
  const presentCount = waitingList.length;
  const absentCount = appointments.filter((a) => a.status === "absent").length;
  const completedCount = appointments.filter((a) => a.status === "completed").length;

  // Start consultation - changes status to is_serving and opens modal
  const handleStart = (apt) => {
    // Complete any currently serving patient first
    setAppointments((prev) =>
      prev.map((a) => {
        if (a.status === "is_serving") return { ...a, status: "completed" };
        if (a.id === apt.id) return { ...a, status: "is_serving" };
        return a;
      })
    );
    setSelectedPatient(apt);
    setShowModal(true);
    showToast("Consultation started", "info");
  };

  // Save & Complete handler for ConsultationModal
  const handleSaveComplete = (data) => {
    if (!selectedPatient) return;
    setAppointments((prev) =>
      prev.map((a) =>
        a.id === selectedPatient.id
          ? { ...a, status: "completed", notes: data.notes, prescription: data.prescription }
          : a
      )
    );
    setShowModal(false);
    setSelectedPatient(null);
    showToast("Consultation saved");
  };

  // Mark absent - removes from queue view
  const handleMarkAbsent = (id) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "absent" } : a))
    );
    showToast("Patient marked as absent", "warning");
  };

  // Close modal
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPatient(null);
  };

  // Update patient data handler
  const handleUpdatePatient = (updatedPatient) => {
    setAppointments((prev) =>
      prev.map((a) =>
        a.id === updatedPatient.id ? updatedPatient : a
      )
    );
    setSelectedPatient(updatedPatient);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <ClipboardList className="w-6 h-6 text-blue-600" />
          Consultation Queue
        </h1>
        <p className="text-muted-foreground">Patients ordered by appointment time</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-emerald-600">{presentCount}</p>
          <p className="text-sm text-emerald-700 dark:text-emerald-400">Present</p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-gray-600 dark:text-gray-400">{absentCount}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Absent</p>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">{completedCount}</p>
          <p className="text-sm text-blue-700 dark:text-blue-400">Completed</p>
        </div>
      </div>

      {/* Currently Serving */}
      {currentlyServing && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mb-1">Currently Serving</p>
              <p className="text-lg font-semibold text-foreground">{currentlyServing.patient}</p>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {currentlyServing.time}
              </p>
            </div>
            <button
              onClick={() => handleStart(currentlyServing)}
              aria-label="Resume consultation"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 min-h-[44px]"
            >
              Resume
            </button>
          </div>
        </div>
      )}

      {/* Queue Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">#</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Time</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Patient</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Status</th>
                <th className="text-right px-4 py-3 text-sm font-medium text-muted-foreground">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {queueAppointments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                    No patients in queue
                  </td>
                </tr>
              ) : (
                queueAppointments.map((apt, idx) => (
                  <tr
                    key={apt.id}
                    className={`hover:bg-muted/30 ${
                      apt.status === "is_serving" ? "bg-blue-50/50 dark:bg-blue-900/10" : ""
                    }`}
                  >
                    <td className="px-4 py-3">
                      <span className="text-sm font-medium text-muted-foreground">{idx + 1}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-medium text-foreground flex items-center gap-1">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        {apt.time}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-medium text-foreground">{apt.patient}</span>
                      {apt.notes && (
                        <p className="text-xs text-muted-foreground">{apt.notes}</p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={apt.status} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        {apt.status === "present" && (
                          <>
                            <button
                              onClick={() => handleStart(apt)}
                              aria-label={`Start consultation with ${apt.patient}`}
                              className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-1 min-h-[36px]"
                            >
                              <Play className="w-4 h-4" />
                              Start
                            </button>
                            <button
                              onClick={() => handleMarkAbsent(apt.id)}
                              aria-label={`Mark ${apt.patient} as absent`}
                              className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-200 flex items-center gap-1 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 min-h-[36px]"
                            >
                              <UserX className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        {apt.status === "is_serving" && (
                          <button
                            onClick={() => handleStart(apt)}
                            aria-label="Complete consultation"
                            className="bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-emerald-700 flex items-center gap-1 min-h-[36px]"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Complete
                          </button>
                        )}
                        {apt.status === "absent" && (
                          <span className="text-xs text-muted-foreground">Not arrived</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Shared Consultation Modal */}
      <ConsultationModal
        isOpen={showModal}
        onClose={handleCloseModal}
        patient={selectedPatient}
        onSaveComplete={handleSaveComplete}
        hasNextPatient={false}
        onUpdatePatient={handleUpdatePatient}
      />

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
