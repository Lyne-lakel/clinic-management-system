"use client";

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
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3 text-sm text-muted-foreground font-mono">{log.timestamp}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-1 text-xs font-medium rounded ${getRoleBadgeColor(log.role)}`}>
                      {log.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground font-medium">{log.name}</td>
                  <td className="px-4 py-3 text-sm text-foreground">{log.action}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground font-mono">{log.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredLogs.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">
            No logs found matching your search.
          </div>
        )}
      </div>
    </div>
  );
}
