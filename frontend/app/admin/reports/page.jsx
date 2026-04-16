"use client";

import { useState } from "react";
import { FileBarChart, Download, FileText } from "lucide-react";

const previousReports = [
  { id: 1, name: "March 2026 Report", generated: "Apr 1, 2026" },
  { id: 2, name: "February 2026 Report", generated: "Mar 1, 2026" },
  { id: 3, name: "Q1 2026 Report", generated: "Apr 1, 2026" },
];

export default function SystemReports() {
  const [reportType, setReportType] = useState("Monthly Summary");
  const [month, setMonth] = useState("April");
  const [year, setYear] = useState("2026");
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = "success") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  const handleGenerate = () => {
    showToast(`Generating ${reportType} for ${month} ${year}`, "info");
  };

  const handleExportPDF = () => {
    showToast("Report exported");
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">System Reports</h1>

      {/* Report Generator */}
      <div className="bg-card border border-border rounded-lg p-4 shadow-sm">
        <h3 className="font-semibold text-foreground mb-4">Generate Report</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Report Type</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
            >
              <option value="Monthly Summary">Monthly Summary</option>
              <option value="Quarterly Overview">Quarterly Overview</option>
              <option value="Annual Report">Annual Report</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Month</label>
            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
            >
              <option value="January">January</option>
              <option value="February">February</option>
              <option value="March">March</option>
              <option value="April">April</option>
              <option value="May">May</option>
              <option value="June">June</option>
              <option value="July">July</option>
              <option value="August">August</option>
              <option value="September">September</option>
              <option value="October">October</option>
              <option value="November">November</option>
              <option value="December">December</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Year</label>
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
            >
              <option value="2026">2026</option>
              <option value="2025">2025</option>
              <option value="2024">2024</option>
            </select>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleGenerate}
            aria-label="Generate Report"
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg min-h-[44px] transition-colors"
          >
            <FileBarChart className="w-5 h-5" />
            Generate Report
          </button>
          <button
            onClick={handleExportPDF}
            aria-label="Export PDF"
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg min-h-[44px] transition-colors"
          >
            <Download className="w-5 h-5" />
            Export PDF
          </button>
        </div>
      </div>

      {/* Previous Reports */}
      <div className="bg-card border border-border rounded-lg p-4 shadow-sm">
        <h3 className="font-semibold text-foreground mb-4">Previous Reports</h3>
        <div className="space-y-3">
          {previousReports.map((report) => (
            <div
              key={report.id}
              className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-foreground">{report.name}</p>
                  <p className="text-xs text-muted-foreground">Generated: {report.generated}</p>
                </div>
              </div>
              <button
                onClick={() => showToast(`Downloading ${report.name}`, "info")}
                aria-label={`Download ${report.name}`}
                className="px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded min-h-[32px]"
              >
                Download
              </button>
            </div>
          ))}
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
