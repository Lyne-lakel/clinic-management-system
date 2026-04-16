"use client";

/**
 * =============================================================================
 * ADMIN DASHBOARD PAGE
 * =============================================================================
 * 
 * PURPOSE:
 * Main dashboard for admin with overview of clinic statistics.
 * Shows welcome message with date, summary cards including no-show rate,
 * improved monthly activity and staff workload sections.
 * No quick actions section.
 * 
 * =============================================================================
 */

import { Users, Calendar, UserCheck, TrendingDown, Server } from "lucide-react";

// Mock metrics data
const mockMetrics = {
  totalPatients: 1284,
  totalAppointments: 8942,
  activeStaff: 12,
  noShowRate: "8.2%",
  systemUptime: "99.8%",
};

// Monthly activity data for chart display
const monthlyActivity = [
  { month: "Jan", appointments: 398, newPatients: 35, noShows: 32 },
  { month: "Feb", appointments: 423, newPatients: 38, noShows: 35 },
  { month: "Mar", appointments: 456, newPatients: 42, noShows: 38 },
  { month: "Apr", appointments: 312, newPatients: 28, noShows: 25 },
];

// Staff workload breakdown
const staffWorkload = [
  { name: "Dr. Ahmed Nouar", role: "Gyneco Doctor", consultations: 156, hoursWorked: 142 },
  { name: "Dr. Fatima Bensalem", role: "Cardio Doctor", consultations: 128, hoursWorked: 136 },
  { name: "Sarah Lee", role: "Receptionist", appointmentsManaged: 542, hoursWorked: 160 },
  { name: "Lyne Chen", role: "Admin", tasksCompleted: 89, hoursWorked: 152 },
];

/**
 * Get today's date formatted nicely
 */
function getTodayDate() {
  const today = new Date();
  const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
  return today.toLocaleDateString("en-US", options);
}

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Welcome Message with Date - only on dashboard */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Welcome, Admin Lyne</h1>
        <p className="text-muted-foreground">{getTodayDate()}</p>
      </div>

      {/* Summary Cards - 5 cards including No Show Rate */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Patients */}
        <div className="bg-card border border-border rounded-lg p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Patients</p>
              <p className="text-xl font-bold text-foreground">{mockMetrics.totalPatients.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Total Appointments */}
        <div className="bg-card border border-border rounded-lg p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <Calendar className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Appointments</p>
              <p className="text-xl font-bold text-foreground">{mockMetrics.totalAppointments.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Active Staff */}
        <div className="bg-card border border-border rounded-lg p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <UserCheck className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Staff</p>
              <p className="text-xl font-bold text-foreground">{mockMetrics.activeStaff}</p>
            </div>
          </div>
        </div>

        {/* No Show Rate */}
        <div className="bg-card border border-border rounded-lg p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <TrendingDown className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">No Show Rate</p>
              <p className="text-xl font-bold text-foreground">{mockMetrics.noShowRate}</p>
            </div>
          </div>
        </div>

        {/* System Uptime */}
        <div className="bg-card border border-border rounded-lg p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Server className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">System Uptime</p>
              <p className="text-xl font-bold text-foreground">{mockMetrics.systemUptime}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Activity Summary - Better Layout */}
      <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
        <h3 className="font-semibold text-foreground mb-4">Monthly Activity Summary</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Month</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Appointments</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">New Patients</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">No-Shows</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {monthlyActivity.map((item, idx) => (
                <tr key={idx} className="hover:bg-muted/30">
                  <td className="py-3 px-4 font-medium text-foreground">{item.month} 2026</td>
                  <td className="py-3 px-4 text-right text-foreground">{item.appointments}</td>
                  <td className="py-3 px-4 text-right text-foreground">{item.newPatients}</td>
                  <td className="py-3 px-4 text-right text-red-600">{item.noShows}</td>
                  <td className="py-3 px-4">
                    <div className="h-2 bg-muted rounded-full w-24">
                      <div 
                        className="h-full bg-emerald-500 rounded-full" 
                        style={{ width: `${(item.appointments / 500) * 100}%` }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm text-emerald-600 font-medium">+8% growth compared to last quarter</p>
      </div>

      {/* Staff Workload - Better Layout */}
      <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
        <h3 className="font-semibold text-foreground mb-4">Staff Workload (This Month)</h3>
        <div className="grid gap-4">
          {staffWorkload.map((staff, idx) => (
            <div 
              key={idx} 
              className="flex items-center justify-between p-4 bg-muted/30 rounded-lg"
            >
              <div className="flex items-center gap-4">
                {/* Avatar placeholder */}
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                  {staff.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div>
                  <p className="font-medium text-foreground">{staff.name}</p>
                  <p className="text-sm text-muted-foreground">{staff.role}</p>
                </div>
              </div>
              <div className="text-right">
                {staff.consultations && (
                  <p className="text-sm text-foreground">
                    <span className="font-bold text-blue-600">{staff.consultations}</span> consultations
                  </p>
                )}
                {staff.appointmentsManaged && (
                  <p className="text-sm text-foreground">
                    <span className="font-bold text-emerald-600">{staff.appointmentsManaged}</span> appointments managed
                  </p>
                )}
                {staff.tasksCompleted && (
                  <p className="text-sm text-foreground">
                    <span className="font-bold text-purple-600">{staff.tasksCompleted}</span> tasks completed
                  </p>
                )}
                <p className="text-xs text-muted-foreground">{staff.hoursWorked} hours worked</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
