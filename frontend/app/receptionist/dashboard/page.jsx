"use client";

/**
 * =============================================================================
 * RECEPTIONIST DASHBOARD PAGE
 * =============================================================================
 * 
 * PURPOSE:
 * Main dashboard showing today's confirmed appointments with "in progress" on top.
 * Only shows confirmed patients. Welcome message like doctor page.
 * 
 * =============================================================================
 */

import Link from "next/link";
import { Calendar, Users, Clock, CheckCircle } from "lucide-react";
<<<<<<< HEAD
import { useState, useEffect } from "react";

const API_RECEPTIONIST = "http://localhost:5000/api/receptionist";

// Sort: confirmed first, then by time
function sortSchedule(schedule) {
  return [...schedule].sort((a, b) => {
    if (a.status === "confirmed" && b.status !== "confirmed") return -1;
    if (a.status !== "confirmed" && b.status === "confirmed") return 1;
    return a.time ? a.time.localeCompare(b.time) : 0;
  });
}

// Format date to YYYY-MM-DD
function formatDateKey(date) {
  if (typeof date === "string") return date;
  return date.toISOString().split("T")[0];
}

export default function DashboardPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const today = formatDateKey(new Date());
        const res = await fetch(`${API_RECEPTIONIST}/appointments?date=${today}`);
        const data = await res.json();
        if (data.success) {
          setAppointments(data.data || []);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

=======

// Today's confirmed appointments (only confirmed status shown)
const todaySchedule = [
  { id: 1, time: "09:00", patient: "Ahmed Benali", doctor: "Dr. Nouar", status: "in-progress" },
  { id: 2, time: "09:30", patient: "Fatima Zohra", doctor: "Dr. Bensalem", status: "confirmed" },
  { id: 3, time: "10:00", patient: "Karim Said", doctor: "Dr. Nouar", status: "confirmed" },
  { id: 4, time: "10:30", patient: "Lydia Mansour", doctor: "Dr. Khelifi", status: "confirmed" },
  { id: 5, time: "11:00", patient: "Omar Khelif", doctor: "Dr. Bensalem", status: "confirmed" },
  { id: 6, time: "11:30", patient: "Samira Hadj", doctor: "Dr. Nouar", status: "confirmed" },
  { id: 7, time: "14:00", patient: "Yacine Bouali", doctor: "Dr. Khelifi", status: "confirmed" },
];

// Stats for dashboard cards
const stats = [
  { label: "Today's Appointments", value: 24, icon: Calendar, color: "text-blue-600", bg: "bg-blue-100" },
  { label: "In Queue Now", value: 5, icon: Users, color: "text-emerald-600", bg: "bg-emerald-100" },
  { label: "Pending Requests", value: 3, icon: Clock, color: "text-amber-600", bg: "bg-amber-100" },
  { label: "Completed Today", value: 12, icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-100" },
];

// Sort: in-progress first, then by time
function sortSchedule(schedule) {
  return [...schedule].sort((a, b) => {
    if (a.status === "in-progress" && b.status !== "in-progress") return -1;
    if (a.status !== "in-progress" && b.status === "in-progress") return 1;
    return a.time.localeCompare(b.time);
  });
}

export default function DashboardPage() {
>>>>>>> 71c599f5aae482780c43c836ebac595de4d47a83
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

<<<<<<< HEAD
  // Calculate stats from appointments
  const todaySchedule = appointments.map(apt => ({
    id: apt._id,
    time: apt.date ? apt.date.split("T")[1]?.substring(0, 5) : "N/A",
    patient: apt.patient?.firstName + " " + (apt.patient?.lastName || ""),
    doctor: apt.doctor?.name || "Unknown Doctor",
    status: apt.status === "Confirmed" ? "confirmed" : apt.status === "Completed" ? "completed" : "pending"
  }));

  const stats = [
    { label: "Today's Appointments", value: appointments.length, icon: Calendar, color: "text-[#1d4ed8]", bg: "bg-blue-100" },
    { label: "In Queue Now", value: appointments.filter(a => a.status === "Confirmed").length, icon: Users, color: "text-emerald-600", bg: "bg-emerald-100" },
    { label: "Pending Requests", value: appointments.filter(a => a.status === "Pending").length, icon: Clock, color: "text-amber-600", bg: "bg-amber-100" },
    { label: "Completed Today", value: appointments.filter(a => a.status === "Completed").length, icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-100" },
  ];

  const sortedSchedule = sortSchedule(todaySchedule);

  if (loading) return <div className="flex items-center justify-center p-8"><p className="text-muted-foreground">Loading dashboard...</p></div>;
  if (error) return <div className="text-red-500 p-4">Error: {error}</div>;

  return (
    <div className="space-y-6">

=======
  const sortedSchedule = sortSchedule(todaySchedule);

  return (
    <div className="space-y-6">
      
      {/* Welcome Message with Date (like doctor page) */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Welcome, Sarah</h1>
        <p className="text-muted-foreground">{today}</p>
      </div>
>>>>>>> 71c599f5aae482780c43c836ebac595de4d47a83

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-card border border-border rounded-lg p-4 flex items-center gap-4"
            >
              <div className={`p-2 rounded-lg ${stat.bg} ${stat.color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Today's Schedule - Only confirmed patients, in-progress on top */}
      <div className="bg-card border border-border rounded-lg">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h3 className="font-semibold text-foreground">Today&apos;s Schedule</h3>
<<<<<<< HEAD
          <Link href="/receptionist/appointments" className="text-sm text-[#1d4ed8] hover:underline">
=======
          <Link href="/receptionist/appointments" className="text-sm text-blue-600 hover:underline">
>>>>>>> 71c599f5aae482780c43c836ebac595de4d47a83
            View all
          </Link>
        </div>
        
        <div className="divide-y divide-border">
          {sortedSchedule.map((apt) => (
            <div
              key={apt.id}
<<<<<<< HEAD
              className="p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-lg font-bold text-[#1d4ed8] w-14">{apt.time}</span>
=======
              className={`p-4 ${apt.status === "in-progress" ? "bg-blue-50 dark:bg-blue-900/10" : ""}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-lg font-bold text-blue-600 w-14">{apt.time}</span>
>>>>>>> 71c599f5aae482780c43c836ebac595de4d47a83
                  <div>
                    <p className="font-medium text-foreground">{apt.patient}</p>
                    <p className="text-sm text-muted-foreground">{apt.doctor}</p>
                  </div>
                </div>
<<<<<<< HEAD
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  apt.status === "confirmed" ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400" :
                  apt.status === "completed" ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400" :
                  "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                }`}>
                  {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                </span>
=======
                {/* Only show "In Progress" badge */}
                {apt.status === "in-progress" && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded-full text-sm font-medium">
                    In Progress
                  </span>
                )}
>>>>>>> 71c599f5aae482780c43c836ebac595de4d47a83
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
