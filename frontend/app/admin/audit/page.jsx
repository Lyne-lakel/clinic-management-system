"use client";

<<<<<<< HEAD
/**
 * =============================================================================
 * AUDIT LOGS PAGE — frontend/app/admin/audit/page.jsx
 * =============================================================================
 *
 * PURPOSE:
 * Displays a searchable, filterable list of all system actions logged by
 * the backend's auditLogger utility. All data is real — no hardcoded arrays.
 *
 * WHAT CHANGED FROM MOCK VERSION:
 *   BEFORE: const auditLogs = [ { id: 1, ... }, { id: 2, ... } ] (static)
 *   AFTER:  useEffect fetches from GET /api/admin/audit-logs in real-time.
 *
 * FEATURES:
 *   - Live search that queries the backend (not just client-side filter)
 *   - Role filter dropdown (All / Admin / Doctor / Receptionist)
 *   - Loading and empty states
 *   - Auto-refresh every 30 seconds for a near-real-time feel
 *
 * API ENDPOINT: GET http://localhost:5000/api/admin/audit-logs
 *   Supports: ?search=&role=&page=&limit=
 * =============================================================================
 */

import { useState, useEffect, useCallback } from "react";
import { Search, RefreshCw } from "lucide-react";
import { API_ADMIN } from "@/config/api";

export default function AuditLogs() {
  // ─── State ─────────────────────────────────────────────────────────────────
  const [logs, setLogs]           = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [search, setSearch]       = useState("");
  const [roleFilter, setRoleFilter] = useState("All");

  // ─── Fetch Logs from Backend ────────────────────────────────────────────────
  // STUDENT DEFENSE NOTE:
  // `useCallback` memoizes this function so it doesn't get recreated on every
  // render. This is important because we pass `fetchLogs` to a dependency array
  // in `useEffect`. Without `useCallback`, adding it to the dependency array
  // would cause an infinite re-render loop.
  const fetchLogs = useCallback(async () => {
    try {
      setLoading(true);

      // Build the query string dynamically from the current filter state.
      // URLSearchParams handles URL encoding (spaces → %20, etc.) automatically.
      const params = new URLSearchParams();
      if (search.trim())       params.set("search", search.trim());
      if (roleFilter !== "All") params.set("role", roleFilter);
      params.set("limit", "100"); // Show up to 100 logs per page

      const url = `${API_ADMIN}/audit-logs?${params.toString()}`;
      const res  = await fetch(url);

      if (!res.ok) throw new Error(`Server error: ${res.status}`);

      const data = await res.json();
      // The backend returns { logs: [...], pagination: {...} }
      setLogs(data.logs || []);
      setError(null);
    } catch (err) {
      console.error("[AuditLogs] Failed to fetch:", err);
      setError("Could not load audit logs. Is the server running?");
    } finally {
      setLoading(false);
    }
  }, [search, roleFilter]); // Re-run when search or roleFilter changes

  // Run fetchLogs on mount AND whenever search/roleFilter changes.
  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  // ─── Auto-Refresh (every 30 seconds) ────────────────────────────────────────
  // STUDENT DEFENSE NOTE:
  // `setInterval` calls a function repeatedly at a given interval (in ms).
  // We store the interval ID in a variable so we can `clearInterval` it in the
  // cleanup function. The cleanup runs when the component is removed from the
  // screen (unmounted), preventing memory leaks.
  useEffect(() => {
    const intervalId = setInterval(fetchLogs, 30000); // 30,000ms = 30 seconds
    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [fetchLogs]);

  // ─── Role Badge Colors ───────────────────────────────────────────────────────
  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "Admin":        return "bg-purple-100 text-purple-800";
      case "Doctor":       return "bg-blue-100 text-blue-800";
      case "Receptionist": return "bg-emerald-100 text-emerald-800";
      case "System":       return "bg-gray-100 text-gray-800";
      default:             return "bg-gray-100 text-gray-800";
    }
  };

  // ─── Format Timestamp ────────────────────────────────────────────────────────
  // STUDENT DEFENSE NOTE:
  // MongoDB stores dates as ISO strings (e.g., "2026-04-04T09:15:00.000Z").
  // `toLocaleString` converts it to a human-readable local time format.
  const formatTimestamp = (isoString) => {
    if (!isoString) return "—";
    const date = new Date(isoString);
    return date.toLocaleString("en-GB", {
      year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit"
    });
  };

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Audit Logs</h1>
        {/* Manual refresh button */}
        <button
          onClick={fetchLogs}
          disabled={loading}
          aria-label="Refresh audit logs"
          className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:bg-muted rounded-lg transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Text Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter by user or action..."
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground"
          />
        </div>

        {/* Role Filter Dropdown */}
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm"
        >
          <option value="All">All Roles</option>
          <option value="Admin">Admin</option>
          <option value="Doctor">Doctor</option>
          <option value="Receptionist">Receptionist</option>
          <option value="System">System</option>
        </select>
      </div>

      {/* Audit Logs Table */}
=======
import { useState } from "react";
import { Search } from "lucide-react";

const auditLogs = [
  { id: 1, timestamp: "2026-04-04 09:15", role: "Admin", name: "Lyne", action: "Created Staff Account", ip: "192.168.1.1" },
  { id: 2, timestamp: "2026-04-04 08:30", role: "Admin", name: "Lyne", action: "Generated Monthly Report", ip: "192.168.1.1" },
  { id: 3, timestamp: "2026-04-03 17:00", role: "Receptionist", name: "Sarah", action: "Login", ip: "192.168.1.5" },
  { id: 4, timestamp: "2026-04-03 14:20", role: "Admin", name: "Lyne", action: "Exported Report", ip: "192.168.1.1" },
  { id: 5, timestamp: "2026-04-03 10:45", role: "Doctor", name: "Nouar", action: "Logout", ip: "192.168.1.1" },
  { id: 6, timestamp: "2026-04-02 16:30", role: "Admin", name: "Lyne", action: "System Backup", ip: "System" },
];

export default function AuditLogs() {
  const [search, setSearch] = useState("");

  const filteredLogs = auditLogs.filter((log) => {
    const searchLower = search.toLowerCase();
    return (
      log.name.toLowerCase().includes(searchLower) ||
      log.action.toLowerCase().includes(searchLower) ||
      log.role.toLowerCase().includes(searchLower)
    );
  });

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "Admin":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400";
      case "Doctor":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "Receptionist":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Audit Logs</h1>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter by user or action..."
          className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground"
        />
      </div>

      {/* Logs Table */}
>>>>>>> 71c599f5aae482780c43c836ebac595de4d47a83
      <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-medium text-foreground">Timestamp</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-foreground">Role</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-foreground">Name</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-foreground">Action</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-foreground">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
<<<<<<< HEAD
              {/* Loading skeleton rows */}
              {loading && logs.length === 0 && (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    <td className="px-4 py-3"><div className="h-4 bg-muted rounded animate-pulse w-32" /></td>
                    <td className="px-4 py-3"><div className="h-4 bg-muted rounded animate-pulse w-16" /></td>
                    <td className="px-4 py-3"><div className="h-4 bg-muted rounded animate-pulse w-20" /></td>
                    <td className="px-4 py-3"><div className="h-4 bg-muted rounded animate-pulse w-48" /></td>
                    <td className="px-4 py-3"><div className="h-4 bg-muted rounded animate-pulse w-24" /></td>
                  </tr>
                ))
              )}

              {/* Actual data rows */}
              {!loading && logs.map((log) => (
                <tr key={log._id} className="hover:bg-muted/30">
                  <td className="px-4 py-3 text-sm text-muted-foreground font-mono">
                    {formatTimestamp(log.createdAt)}
                  </td>
=======
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3 text-sm text-muted-foreground font-mono">{log.timestamp}</td>
>>>>>>> 71c599f5aae482780c43c836ebac595de4d47a83
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-1 text-xs font-medium rounded ${getRoleBadgeColor(log.role)}`}>
                      {log.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground font-medium">{log.name}</td>
                  <td className="px-4 py-3 text-sm text-foreground">{log.action}</td>
<<<<<<< HEAD
                  <td className="px-4 py-3 text-sm text-muted-foreground font-mono">{log.ipAddress}</td>
=======
                  <td className="px-4 py-3 text-sm text-muted-foreground font-mono">{log.ip}</td>
>>>>>>> 71c599f5aae482780c43c836ebac595de4d47a83
                </tr>
              ))}
            </tbody>
          </table>
        </div>
<<<<<<< HEAD

        {/* Empty / Error States */}
        {!loading && error && (
          <div className="p-8 text-center text-red-600">{error}</div>
        )}
        {!loading && !error && logs.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">
            {search || roleFilter !== "All"
              ? "No logs found matching your search."
              : "No audit logs recorded yet. Actions will appear here automatically."}
=======
        {filteredLogs.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">
            No logs found matching your search.
>>>>>>> 71c599f5aae482780c43c836ebac595de4d47a83
          </div>
        )}
      </div>
    </div>
  );
}
