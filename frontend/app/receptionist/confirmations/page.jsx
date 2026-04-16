"use client";

import { useState } from "react";
import { Phone, CheckCircle, XCircle, Trash2 } from "lucide-react";

// Mock appointments needing confirmation with complete dates
const initialAppointments = [
  {
    id: 1,
    patient: "Fatima Zohra",
    phone: "0555-234-567",
    date: "2026-04-03",
    time: "09:30",
    failedAttempts: 0,
  },
  {
    id: 2,
    patient: "Omar Khelif",
    phone: "0555-567-890",
    date: "2026-04-03",
    time: "11:00",
    failedAttempts: 2,
  },
  {
    id: 3,
    patient: "Yacine Bouali",
    phone: "0555-678-901",
    date: "2026-04-04",
    time: "14:00",
    failedAttempts: 0,
  },
  {
    id: 4,
    patient: "Nadia Hamidi",
    phone: "0555-789-012",
    date: "2026-04-04",
    time: "10:00",
    failedAttempts: 1,
  },
  {
    id: 5,
    patient: "Rachid Taleb",
    phone: "0555-890-123",
    date: "2026-04-07",
    time: "09:00",
    failedAttempts: 0,
  },
  {
    id: 6,
    patient: "Amina Cherif",
    phone: "0555-901-234",
    date: "2026-04-08",
    time: "15:00",
    failedAttempts: 0,
  },
];

function formatDate(dateStr) {
  const date = new Date(dateStr);
  const weekday = date.toLocaleDateString("en-US", { weekday: "long" });
  return `${weekday} ${dateStr}`;
}

function getPriorityFromDate(dateStr) {
  const today = new Date();
  const date = new Date(dateStr);
  const diffDays = Math.ceil((date - today) / (1000 * 60 * 60 * 24));
  
  if (diffDays <= 0) return "today";
  if (diffDays === 1) return "tomorrow";
  return "week";
}

function getPriorityStyle(priority) {
  switch (priority) {
    case "today":
      return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
    case "tomorrow":
      return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400";
    case "week":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

export default function ConfirmationsPage() {
  const [appointments, setAppointments] = useState(initialAppointments);
  const [filterPriority, setFilterPriority] = useState("all");
  const [confirmedIds, setConfirmedIds] = useState([]);
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = "success") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  const filteredAppointments = appointments.filter((apt) => {
    const priority = getPriorityFromDate(apt.date);
    return filterPriority === "all" || priority === filterPriority;
  });

  const pendingCount = appointments.filter((apt) => !confirmedIds.includes(apt.id)).length;

  // Mark as failed attempt
  function markFailedAttempt(id) {
    setAppointments((prev) =>
      prev.map((apt) =>
        apt.id === id ? { ...apt, failedAttempts: apt.failedAttempts + 1 } : apt
      )
    );
    showToast("Call attempt recorded", "info");
  }

  // Mark as confirmed
  function markConfirmed(id) {
    setConfirmedIds((prev) => [...prev, id]);
    showToast("Appointment confirmed");
  }

  // Delete appointment
  function deleteAppointment(id) {
    setAppointments((prev) => prev.filter((apt) => apt.id !== id));
    setConfirmedIds((prev) => prev.filter((cid) => cid !== id));
    showToast("Appointment deleted", "warning");
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Confirmations</h2>
          <p className="text-muted-foreground">{pendingCount} appointments pending confirmation</p>
        </div>

        {/* Priority Filter */}
        <div className="flex gap-2">
          {[
            { value: "all", label: "All" },
            { value: "today", label: "Today" },
            { value: "tomorrow", label: "Tomorrow" },
            { value: "week", label: "This Week" },
          ].map((filter) => (
            <button
              key={filter.value}
              onClick={() => setFilterPriority(filter.value)}
              className={`px-4 py-2 rounded-lg text-sm min-h-[44px] ${
                filterPriority === filter.value
                  ? "bg-blue-600 text-white"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Appointments List */}
      <div className="space-y-4">
        {filteredAppointments.length === 0 ? (
          <div className="bg-card border border-border rounded-lg p-8 text-center">
            <p className="text-muted-foreground">No appointments to confirm for this filter.</p>
          </div>
        ) : (
          filteredAppointments.map((apt) => {
            const priority = getPriorityFromDate(apt.date);
            const isConfirmed = confirmedIds.includes(apt.id);

            return (
              <div
                key={apt.id}
                className={`bg-card border border-border rounded-lg p-4 ${
                  isConfirmed ? "opacity-60" : ""
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Patient Info */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="font-semibold text-foreground text-lg">{apt.patient}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs ${getPriorityStyle(priority)}`}>
                        {priority === "today" ? "Today" : priority === "tomorrow" ? "Tomorrow" : "This Week"}
                      </span>
                      {isConfirmed && (
                        <span className="px-2 py-1 rounded-full text-xs bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                          Confirmed
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="w-4 h-4" />
                      <span>{apt.phone}</span>
                    </div>
                    <p className="text-foreground">
                      {formatDate(apt.date)} at {apt.time}
                    </p>
                    {apt.failedAttempts > 0 && (
                      <p className="text-sm text-amber-600">
                        Failed attempts: {apt.failedAttempts}
                      </p>
                    )}
                  </div>

                  {/* Actions - Only 3 buttons */}
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => markFailedAttempt(apt.id)}
                      disabled={isConfirmed}
                      className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 min-h-[44px] flex items-center gap-2 disabled:opacity-50"
                      aria-label="Mark as failed attempt"
                    >
                      <XCircle className="w-4 h-4" />
                      Failed Attempt
                    </button>
                    <button
                      onClick={() => markConfirmed(apt.id)}
                      disabled={isConfirmed}
                      className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 min-h-[44px] flex items-center gap-2 disabled:opacity-50"
                      aria-label="Mark as confirmed"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Confirmed
                    </button>
                    <button
                      onClick={() => deleteAppointment(apt.id)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 min-h-[44px] flex items-center gap-2"
                      aria-label="Delete appointment"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-emerald-600">{confirmedIds.length}</p>
          <p className="text-sm text-muted-foreground">Confirmed</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-amber-600">
            {appointments.filter((a) => a.failedAttempts > 0).length}
          </p>
          <p className="text-sm text-muted-foreground">With Failed Attempts</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-foreground">{pendingCount}</p>
          <p className="text-sm text-muted-foreground">Pending</p>
        </div>
      </div>

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
