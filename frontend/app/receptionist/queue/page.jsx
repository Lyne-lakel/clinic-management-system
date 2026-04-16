/**
 * =============================================================================
 * RECEPTIONIST QUEUE MANAGEMENT PAGE
 * =============================================================================
 * 
 * PURPOSE:
 * This page allows receptionists to manage the patient waiting queue.
 * Patients are ordered by their APPOINTMENT TIME (not FIFO).
 * The system tracks who has arrived (present) vs not yet (absent).
 * 
 * KEY CONCEPTS:
 * - ABSENT: Patient has appointment but hasn't arrived yet
 * - PRESENT: Patient has arrived and is waiting
 * - IN-ROOM: Currently being seen by doctor
 * - SKIPPED: Missed their turn (didn't show when called)
 * - COMPLETED: Finished consultation
 * 
 * WORKFLOW:
 * 1. Patients start as "absent" when added to queue
 * 2. When patient arrives, receptionist marks them "present"
 * 3. Doctor calls next present patient (becomes "in-room")
 * 4. After consultation, patient becomes "completed"
 * 5. If patient doesn't show, they get "skipped"
 * 
 * FEATURES:
 * - Waiting room display (now serving, next, waiting count)
 * - Add new patient to queue
 * - Mark present/skip patients
 * - Move patients up in priority
 * - Call next patient
 * - View completed/skipped history
 * 
 * =============================================================================
 */

"use client";

import { useState } from "react";
import { UserCheck, UserX, ChevronUp, Plus } from "lucide-react";

// -----------------------------------------------------------------------------
// MOCK DATA: INITIAL QUEUE
// -----------------------------------------------------------------------------
// Queue ordered by appointment time, not arrival order
// Status can be: "in-room", "present", "absent", "skipped", "completed"
const initialQueue = [
  { id: 1, ticketNum: 12, name: "Ahmed Benali", appointmentTime: "09:00", status: "in-room" },
  { id: 2, ticketNum: 13, name: "Fatima Zohra", appointmentTime: "09:30", status: "present" },
  { id: 3, ticketNum: 14, name: "Karim Said", appointmentTime: "10:00", status: "present" },
  { id: 4, ticketNum: 15, name: "Lydia Mansour", appointmentTime: "10:30", status: "absent" },
  { id: 5, ticketNum: 16, name: "Omar Khelif", appointmentTime: "11:00", status: "absent" },
  { id: 6, ticketNum: 17, name: "Samira Hadj", appointmentTime: "11:30", status: "absent" },
];

// -----------------------------------------------------------------------------
// MOCK DATA: AVAILABLE PATIENTS
// -----------------------------------------------------------------------------
// Patients that can be added to queue (e.g., walk-ins)
const availablePatients = [
  { id: "P001", name: "Yacine Bouali" },
  { id: "P002", name: "Amina Cherif" },
  { id: "P003", name: "Rachid Taleb" },
];

// -----------------------------------------------------------------------------
// HELPER FUNCTION: GET STATUS BADGE STYLING
// -----------------------------------------------------------------------------
// Returns CSS classes for status badges based on status type
function getStatusStyle(status) {
  switch (status) {
    case "in-room":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
    case "present":
      return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400";
    case "absent":
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
    case "skipped":
      return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400";
    case "completed":
      return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

export default function QueuePage() {
  // ---------------------------------------------------------------------------
  // STATE MANAGEMENT
  // ---------------------------------------------------------------------------
  const [queue, setQueue] = useState(initialQueue);      // Main queue array
  const [showAddModal, setShowAddModal] = useState(false);  // Add patient modal visibility
  const [selectedPatient, setSelectedPatient] = useState("");  // Selected patient in modal
  const [appointmentTime, setAppointmentTime] = useState("12:00");  // Time input in modal
  const [toasts, setToasts] = useState([]);              // Toast notifications

  // ---------------------------------------------------------------------------
  // TOAST NOTIFICATION SYSTEM
  // ---------------------------------------------------------------------------
  const showToast = (message, type = "success") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  // ---------------------------------------------------------------------------
  // COMPUTED VALUES (QUEUE STATS)
  // ---------------------------------------------------------------------------
  // Find the patient currently in the room
  const nowServing = queue.find((q) => q.status === "in-room");
  // Get all present (waiting) patients
  const presentPatients = queue.filter((q) => q.status === "present");
  // Next patient to be called (first present patient)
  const nextInQueue = presentPatients[0];
  // Count of waiting patients
  const waitingCount = presentPatients.length;
  // Next ticket number to assign
  const nextTicket = queue.length > 0 ? Math.max(...queue.map((q) => q.ticketNum)) + 1 : 1;

  // ---------------------------------------------------------------------------
  // ACTION: MARK PATIENT AS PRESENT
  // ---------------------------------------------------------------------------
  // Called when a patient arrives at the clinic
  function markPresent(id) {
    setQueue((prev) =>
      prev.map((q) => (q.id === id ? { ...q, status: "present" } : q))
    );
    showToast("Patient marked as present");
  }

  // ---------------------------------------------------------------------------
  // ACTION: MARK PATIENT AS SKIPPED
  // ---------------------------------------------------------------------------
  // Called when a patient misses their turn
  function markAbsent(id) {
    setQueue((prev) =>
      prev.map((q) => (q.id === id ? { ...q, status: "skipped" } : q))
    );
    showToast("Patient skipped", "warning");
  }

  // ---------------------------------------------------------------------------
  // ACTION: CALL NEXT PATIENT
  // ---------------------------------------------------------------------------
  // Moves current patient to completed, calls next present patient
  function callNext() {
    setQueue((prev) => {
      // First, mark current in-room patient as completed
      const updated = prev.map((q) => {
        if (q.status === "in-room") {
          return { ...q, status: "completed" };
        }
        return q;
      });

      // Then, find first present patient and set them to in-room
      const firstPresentIndex = updated.findIndex((q) => q.status === "present");
      if (firstPresentIndex !== -1) {
        updated[firstPresentIndex] = { ...updated[firstPresentIndex], status: "in-room" };
      }

      return updated;
    });
    showToast("Calling next patient", "info");
  }

  // ---------------------------------------------------------------------------
  // ACTION: SKIP CURRENT PATIENT
  // ---------------------------------------------------------------------------
  // Marks current patient as skipped, calls next present patient
  function skipCurrent() {
    setQueue((prev) => {
      // Mark current in-room patient as skipped
      const updated = prev.map((q) => {
        if (q.status === "in-room") {
          return { ...q, status: "skipped" };
        }
        return q;
      });

      // Find next present patient and set them to in-room
      const firstPresentIndex = updated.findIndex((q) => q.status === "present");
      if (firstPresentIndex !== -1) {
        updated[firstPresentIndex] = { ...updated[firstPresentIndex], status: "in-room" };
      }

      return updated;
    });
    showToast("Patient skipped", "warning");
  }

  // ---------------------------------------------------------------------------
  // ACTION: MOVE PATIENT UP IN PRIORITY
  // ---------------------------------------------------------------------------
  // Moves a waiting patient to right after the current in-room patient
  function moveUp(id) {
    setQueue((prev) => {
      const index = prev.findIndex((q) => q.id === id);
      if (index <= 0) return prev;  // Already at top

      // Find position of in-room patient
      const inRoomIndex = prev.findIndex((q) => q.status === "in-room");
      // Can't move above in-room patient
      if (index <= inRoomIndex + 1) return prev;

      // Remove patient and insert right after in-room patient
      const newQueue = [...prev];
      const [item] = newQueue.splice(index, 1);
      newQueue.splice(inRoomIndex + 1, 0, item);
      return newQueue;
    });
    showToast("Patient moved up", "info");
  }

  // ---------------------------------------------------------------------------
  // ACTION: ADD NEW PATIENT TO QUEUE
  // ---------------------------------------------------------------------------
  // Adds a walk-in or new patient to the queue in time-sorted order
  function addToQueue() {
    if (!selectedPatient) return;

    // Find patient details
    const patient = availablePatients.find((p) => p.id === selectedPatient);
    if (!patient) return;

    // Create new queue entry
    const newEntry = {
      id: Date.now(),
      ticketNum: nextTicket,
      name: patient.name,
      appointmentTime: appointmentTime,
      status: "absent",  // New patients start as absent until they arrive
    };

    // Insert in sorted order by appointment time
    setQueue((prev) => {
      const newQueue = [...prev, newEntry];
      return newQueue.sort((a, b) => a.appointmentTime.localeCompare(b.appointmentTime));
    });

    showToast("Patient added to queue");
    // Reset modal state
    setSelectedPatient("");
    setAppointmentTime("12:00");
    setShowAddModal(false);
  }

  // ---------------------------------------------------------------------------
  // FILTERED LISTS
  // ---------------------------------------------------------------------------
  // Active queue: patients still waiting or being served
  const activeQueue = queue.filter((q) => q.status !== "completed" && q.status !== "skipped");
  // History: completed or skipped patients
  const historyQueue = queue.filter((q) => q.status === "completed" || q.status === "skipped");

  return (
    <div className="space-y-6">
      
      {/* =====================================================================
          PAGE HEADER
          ===================================================================== */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">Queue Management</h2>
        <p className="text-muted-foreground">Patients ordered by appointment time</p>
      </div>

      {/* =====================================================================
          WAITING ROOM DISPLAY
          Large display showing current status - positioned at TOP for visibility
          Shows: Now Serving | Next | Waiting Count
          ===================================================================== */}
      <div className="bg-blue-600 text-white rounded-lg p-6">
        <div className="grid grid-cols-3 gap-4 text-center">
          {/* Now Serving */}
          <div>
            <p className="text-sm opacity-80">NOW SERVING</p>
            <p className="text-5xl font-bold">#{nowServing?.ticketNum || "--"}</p>
            {nowServing && <p className="text-sm mt-1">{nowServing.name}</p>}
          </div>
          {/* Next Patient */}
          <div className="border-l border-r border-white/20">
            <p className="text-sm opacity-80">NEXT</p>
            <p className="text-4xl font-bold">#{nextInQueue?.ticketNum || "--"}</p>
            {nextInQueue && <p className="text-sm mt-1">{nextInQueue.name}</p>}
          </div>
          {/* Waiting Count */}
          <div>
            <p className="text-sm opacity-80">WAITING</p>
            <p className="text-4xl font-bold">{waitingCount}</p>
            <p className="text-sm mt-1">patients</p>
          </div>
        </div>
      </div>

      {/* =====================================================================
          MAIN CONTENT AREA
          Left: Action buttons + History
          Right: Queue list table
          ===================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* -----------------------------------------------------------------
            LEFT PANEL: ACTIONS + HISTORY
            ----------------------------------------------------------------- */}
        <div className="space-y-4">
          {/* Action Buttons Card */}
          <div className="bg-card border border-border rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-foreground">Actions</h3>

            {/* Add Patient Button */}
            <button
              onClick={() => setShowAddModal(true)}
              className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 min-h-[44px] flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Patient to Queue
            </button>

            {/* Call Next Button */}
            <button
              onClick={callNext}
              disabled={!nextInQueue}
              className="w-full px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
            >
              Call Next Patient
            </button>

            {/* Skip Current Button */}
            <button
              onClick={skipCurrent}
              disabled={!nowServing}
              className="w-full px-4 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
            >
              Skip Current Patient
            </button>
          </div>

          {/* Today's History Card */}
          <div className="bg-card border border-border rounded-lg p-4">
            <h3 className="font-semibold text-foreground mb-3">Completed Today</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {historyQueue.length === 0 ? (
                <p className="text-sm text-muted-foreground">No completed patients yet</p>
              ) : (
                historyQueue.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-2 bg-muted rounded text-sm">
                    <span className="text-foreground">#{item.ticketNum} - {item.name}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${getStatusStyle(item.status)}`}>
                      {item.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* -----------------------------------------------------------------
            RIGHT PANEL: QUEUE LIST TABLE
            Shows all active patients with their status and actions
            ----------------------------------------------------------------- */}
        <div className="lg:col-span-2">
          <div className="bg-card border border-border rounded-lg">
            {/* Table Header */}
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h3 className="font-semibold text-foreground">Queue List</h3>
              <span className="text-sm text-muted-foreground">{activeQueue.length} patients</span>
            </div>

            {/* Queue Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="p-3 text-left text-sm font-medium text-muted-foreground">Ticket</th>
                    <th className="p-3 text-left text-sm font-medium text-muted-foreground">Patient</th>
                    <th className="p-3 text-left text-sm font-medium text-muted-foreground">Appt. Time</th>
                    <th className="p-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                    <th className="p-3 text-left text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {activeQueue.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-muted-foreground">
                        No patients in queue
                      </td>
                    </tr>
                  ) : (
                    activeQueue.map((item) => (
                      <tr
                        key={item.id}
                        className={`border-t border-border ${
                          item.status === "in-room" ? "bg-blue-50 dark:bg-blue-950/20" : ""
                        }`}
                      >
                        {/* Ticket Number */}
                        <td className="p-3">
                          <span className="font-bold text-lg text-foreground">#{item.ticketNum}</span>
                        </td>
                        {/* Patient Name */}
                        <td className="p-3 text-foreground">{item.name}</td>
                        {/* Appointment Time */}
                        <td className="p-3 text-foreground font-medium">{item.appointmentTime}</td>
                        {/* Status Badge */}
                        <td className="p-3">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${getStatusStyle(item.status)}`}>
                            {item.status === "in-room" ? "In Room" : item.status === "present" ? "Present" : "Absent"}
                          </span>
                        </td>
                        {/* Action Buttons */}
                        <td className="p-3">
                          <div className="flex gap-2 flex-wrap">
                            {/* Show Present/Skip buttons for absent patients */}
                            {item.status === "absent" && (
                              <>
                                <button
                                  onClick={() => markPresent(item.id)}
                                  className="px-3 py-1 bg-emerald-600 text-white rounded text-sm hover:bg-emerald-700 min-h-[44px] flex items-center gap-1"
                                  aria-label={`Mark ${item.name} as present`}
                                >
                                  <UserCheck className="w-4 h-4" />
                                  Present
                                </button>
                                <button
                                  onClick={() => markAbsent(item.id)}
                                  className="px-3 py-1 bg-amber-500 text-white rounded text-sm hover:bg-amber-600 min-h-[44px] flex items-center gap-1"
                                  aria-label={`Skip ${item.name}`}
                                >
                                  <UserX className="w-4 h-4" />
                                  Skip
                                </button>
                              </>
                            )}
                            {/* Show Move Up button for present patients */}
                            {item.status === "present" && (
                              <button
                                onClick={() => moveUp(item.id)}
                                className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 min-h-[44px] flex items-center gap-1"
                                aria-label={`Move ${item.name} up`}
                              >
                                <ChevronUp className="w-4 h-4" />
                                Move Up
                              </button>
                            )}
                            {/* Show status text for in-room patients */}
                            {item.status === "in-room" && (
                              <span className="text-sm text-blue-600 font-medium">Currently serving</span>
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
        </div>
      </div>

      {/* =====================================================================
          ADD PATIENT MODAL
          Allows adding walk-in patients to the queue
          ===================================================================== */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-foreground mb-4">Add Patient to Queue</h3>

            <div className="space-y-4">
              {/* Patient Selection Dropdown */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Select Patient</label>
                <select
                  value={selectedPatient}
                  onChange={(e) => setSelectedPatient(e.target.value)}
                  className="w-full px-4 py-2 border border-input rounded-lg bg-background min-h-[44px]"
                >
                  <option value="">Choose a patient...</option>
                  {availablePatients.map((p) => (
                    <option key={p.id} value={p.id}>{p.name} ({p.id})</option>
                  ))}
                </select>
              </div>

              {/* Time Input */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Appointment Time</label>
                <input
                  type="time"
                  value={appointmentTime}
                  onChange={(e) => setAppointmentTime(e.target.value)}
                  className="w-full px-4 py-2 border border-input rounded-lg bg-background min-h-[44px]"
                />
              </div>

              {/* Next Ticket Preview */}
              <p className="text-sm text-muted-foreground">Ticket number: #{nextTicket}</p>

              {/* Modal Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={addToQueue}
                  disabled={!selectedPatient}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 min-h-[44px]"
                >
                  Add to Queue
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

      {/* =====================================================================
          TOAST NOTIFICATIONS
          Fixed position at bottom-right, auto-dismiss after 3 seconds
          ===================================================================== */}
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
