"use client";

/**
 * =============================================================================
 * ADMIN SYSTEM SETTINGS PAGE
 * =============================================================================
 * 
 * PURPOSE:
 * System configuration page for admin.
 * Only working hours are editable - everything else is read-only.
 * 
 * =============================================================================
 */

import { useState } from "react";
import { Save, Database, RefreshCw } from "lucide-react";

export default function SystemSettings() {
  // Only working hours are editable
  const [workingHours, setWorkingHours] = useState("8:00 AM - 6:00 PM");
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = "success") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  const handleSave = () => {
    showToast("Working hours updated");
  };

  const handleBackupNow = () => {
    showToast("Backup initiated", "info");
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">System Settings</h1>

      {/* Clinic Information - Only working hours editable */}
      <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
        <h3 className="font-semibold text-foreground mb-4">Clinic Information</h3>
        <div className="space-y-4 max-w-md">
          {/* Clinic Name - Read Only */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Clinic Name</label>
            <p className="px-3 py-2 bg-muted rounded-lg text-foreground">CityMed Clinic</p>
          </div>
          {/* Address - Read Only */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Address</label>
            <p className="px-3 py-2 bg-muted rounded-lg text-foreground">123 Medical Center Blvd, Algiers</p>
          </div>
          {/* Phone - Read Only */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Phone</label>
            <p className="px-3 py-2 bg-muted rounded-lg text-foreground">+213 21 123 456</p>
          </div>
          {/* Working Hours - Editable */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Working Hours</label>
            <input
              type="text"
              value={workingHours}
              onChange={(e) => setWorkingHours(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
            />
          </div>
          <button
            onClick={handleSave}
            aria-label="Save changes"
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg min-h-[44px] transition-colors"
          >
            <Save className="w-5 h-5" />
            Save Working Hours
          </button>
        </div>
      </div>

      {/* System Health - Read Only */}
      <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
        <h3 className="font-semibold text-foreground mb-4">System Health</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-3 bg-muted/30 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Database</p>
            <p className="text-sm font-medium text-emerald-600 flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full" />
              Connected
            </p>
          </div>
          <div className="p-3 bg-muted/30 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">API Status</p>
            <p className="text-sm font-medium text-emerald-600 flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full" />
              Operational
            </p>
          </div>
          <div className="p-3 bg-muted/30 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Email Service</p>
            <p className="text-sm font-medium text-emerald-600 flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full" />
              Connected
            </p>
          </div>
          <div className="p-3 bg-muted/30 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Last Backup</p>
            <p className="text-sm font-medium text-foreground">April 8, 2026</p>
          </div>
          <div className="p-3 bg-muted/30 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Uptime (30 days)</p>
            <p className="text-sm font-medium text-foreground">99.8%</p>
          </div>
        </div>
      </div>

      {/* Backup Settings */}
      <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
        <h3 className="font-semibold text-foreground mb-4">Backup Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
            <Database className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium text-foreground">Auto-backup Schedule</p>
              <p className="text-xs text-muted-foreground">Daily at 2:00 AM</p>
            </div>
          </div>
          <button
            onClick={handleBackupNow}
            aria-label="Run backup now"
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg min-h-[44px] transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
            Run Backup Now
          </button>
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
