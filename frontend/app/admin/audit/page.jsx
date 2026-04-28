"use client";

/**
 * ======================================================================      <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
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
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-1 text-xs font-medium rounded ${getRoleBadgeColor(log.role)}`}>
                      {log.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground font-medium">{log.name}</td>
                  <td className="px-4 py-3 text-sm text-foreground">{log.action}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground font-mono">{log.ipAddress}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty / Error States */}
        {!loading && error && (
          <div className="p-8 text-center text-red-600">{error}</div>
        )}
        {!loading && !error && logs.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">
            {search || roleFilter !== "All"
              ? "No logs found matching your search."
              : "No audit logs recorded yet. Actions will appear here automatically."}
          </div>
        )}
      </div>
    </div>
  );
}
