"use client";

/**
 * =============================================================================
 * SYSTEM SETTINGS PAGE — frontend/app/admin/settings/page.jsx
 * ======================================================================  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">System Settings</h1>

      {/* Clinic Information — Only working hours is editable */}
      <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
        <h3 className="font-semibold text-foreground mb-4">Clinic Information</h3>
        <div className="space-y-4 max-w-md">

          {/* Clinic Name — Read Only */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Clinic Name</label>
            <p className="px-3 py-2 bg-muted rounded-lg text-foreground">
              {settings?.clinicName || "CityMed Clinic"}
            </p>
          </div>

          {/* Address — Read Only */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Address</label>
            <p className="px-3 py-2 bg-muted rounded-lg text-foreground">
              {settings?.address || "123 Medical Center Blvd, Algiers"}
            </p>
          </div>

          {/* Phone — Read Only */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Phone</label>
            <p className="px-3 py-2 bg-muted rounded-lg text-foreground">
              {settings?.phone || "+213 21 123 456"}
            </p>
          </div>

          {/* Working Hours — Editable */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Working Hours <span className="text-xs text-[#1d4ed8] ml-1">(editable)</span>
            </label>
            <input
              type="text"
              value={workingHours}
              onChange={(e) => setWorkingHours(e.target.value)}
              placeholder="e.g. 8:00 AM - 6:00 PM"
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
            />
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            aria-label="Save changes"
            className="flex items-center gap-2 px-4 py-2.5 bg-[#1d4ed8] hover:bg-[#1e40af] text-white rounded-lg min-h-[44px] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <Save className="w-5 h-5" />
            {saving ? "Saving…" : "Save Working Hours"}
          </button>
        </div>
      </div>

      {/* System Health — Real-time data from server */}
      <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
        <h3 className="font-semibold text-foreground mb-4">System Health</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

          <div className="p-3 bg-muted/30 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Database</p>
            <HealthBadge value={settings?.health?.databaseStatus || "Unknown"} />
          </div>

          <div className="p-3 bg-muted/30 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">API Status</p>
            <HealthBadge value={settings?.health?.apiStatus || "Unknown"} />
          </div>

          <div className="p-3 bg-muted/30 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Email Service</p>
            <HealthBadge value={settings?.health?.emailService || "Unknown"} />
          </div>

          <div className="p-3 bg-muted/30 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Last Backup</p>
            <p className="text-sm font-medium text-foreground">
              {formatDate(settings?.lastBackup)}
            </p>
          </div>

          <div className="p-3 bg-muted/30 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Server Uptime</p>
            <p className="text-sm font-medium text-foreground">
              {settings?.health?.systemUptime || "—"}
            </p>
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
              <p className="text-xs text-muted-foreground">
                {settings?.autoBackupSchedule || "Daily at 2:00 AM"}
              </p>
            </div>
          </div>

          <button
            onClick={handleBackupNow}
            disabled={backingUp}
            aria-label="Run backup now"
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg min-h-[44px] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-5 h-5 ${backingUp ? "animate-spin" : ""}`} />
            {backingUp ? "Running Backup…" : "Run Backup Now"}
          </button>
        </div>
      </div>

      {/* Toast Notifications */}
      <div className="fixed bottom-5 right-5 space-y-2 z-50">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`px-4 py-3 rounded-lg shadow text-white text-sm ${
              toast.type === "success" ? "bg-green-500"
              : toast.type === "error"   ? "bg-red-500"
              : toast.type === "warning" ? "bg-yellow-500"
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
