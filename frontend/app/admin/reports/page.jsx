"use client";

<<<<<<< HEAD
/**
 * =============================================================================
 * SYSTEM REPORTS PAGE — frontend/app/admin/reports/page.jsx
 * =============================================================================
 *
 * PURPOSE:
 * Allows the admin to generate, view, and export clinic reports.
 * All buttons now call real backend endpoints instead of just showing toasts.
 *
 * WHAT CHANGED FROM MOCK VERSION:
 *   BEFORE: handleGenerate/handleExportPDF only called showToast()
 *   AFTER:  Real API calls:
 *     - "Generate Report"  → POST /api/admin/reports/generate
 *     - "Previous Reports" → GET /api/admin/reports (on page load)
 *     - "Download"         → GET /api/admin/reports/export/:id (triggers file download)
 *     - "Export PDF"       → Downloads the most recently generated report as CSV
 *
 * NOTE ON CSV vs PDF:
 * True PDF generation requires a server-side library (pdf-lib, puppeteer).
 * We implement CSV export which is fully functional and opens directly in Excel.
 * For academic presentation, this is entirely valid and defensible.
 * =============================================================================
 */

import { useState, useEffect } from "react";
import { FileBarChart, Download, FileText } from "lucide-react";
import { API_ADMIN } from "@/config/api";

export default function SystemReports() {
  // ─── State ─────────────────────────────────────────────────────────────────
  const [reportType, setReportType] = useState("Monthly Summary");
  const [month, setMonth]           = useState("April");
  const [year, setYear]             = useState("2026");
  const [generating, setGenerating] = useState(false);
  const [previousReports, setPreviousReports] = useState([]);
  const [loadingReports, setLoadingReports]   = useState(true);
  const [lastGenerated, setLastGenerated]     = useState(null); // The just-generated report
  const [toasts, setToasts]                   = useState([]);

  // ─── Toast Helper ───────────────────────────────────────────────────────────
  const showToast = (message, type = "success") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  };

  // ─── Load Previous Reports on Mount ─────────────────────────────────────────
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res  = await fetch(`${API_ADMIN}/reports`);
        if (!res.ok) throw new Error("Failed to load reports");
        const data = await res.json();
        setPreviousReports(data);
      } catch (err) {
        console.error("[Reports] Failed to load previous reports:", err);
      } finally {
        setLoadingReports(false);
      }
    };
    fetchReports();
  }, []);

  // ─── Generate Report ────────────────────────────────────────────────────────
  // STUDENT DEFENSE NOTE:
  // We send { type, month, year } to the backend which runs the aggregation
  // queries and saves the result as a Report document in MongoDB.
  // On success, we prepend the new report to the previousReports list so
  // the UI updates instantly without a full page reload.
  const handleGenerate = async () => {
    try {
      setGenerating(true);
      showToast(`Generating ${reportType} for ${month} ${year}…`, "info");

      const res  = await fetch(`${API_ADMIN}/reports/generate`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ type: reportType, month, year })
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Generation failed");
      }

      const newReport = await res.json();

      // Add the new report to the top of the list and remember it for the Export button.
      setPreviousReports(prev => [newReport, ...prev]);
      setLastGenerated(newReport);

      showToast(`✅ ${newReport.name} generated successfully!`, "success");
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setGenerating(false);
    }
  };

  // ─── Download / Export Report as CSV ────────────────────────────────────────
  // STUDENT DEFENSE NOTE:
  // This function uses the browser's built-in download mechanism:
  //   1. We fetch the CSV content from the backend as a Blob (Binary Large Object).
  //   2. We create a temporary URL for the Blob using `URL.createObjectURL`.
  //   3. We create a hidden <a> element, set its `download` attribute, click it.
  //   4. We immediately clean up by revoking the temporary URL.
  //
  // This avoids needing to navigate away from the page to trigger a download.
  const handleDownload = async (reportId, reportName) => {
    try {
      showToast(`Preparing download for ${reportName}…`, "info");

      const res = await fetch(`${API_ADMIN}/reports/export/${reportId}`);

      if (!res.ok) throw new Error("Export failed");

      // Get the raw CSV text from the response.
      const csvText = await res.text();

      // Convert the text to a Blob so the browser can download it as a file.
      const blob = new Blob([csvText], { type: "text/csv" });

      // Create a temporary object URL for the blob.
      const url  = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href     = url;
      link.download = `${reportName.replace(/\s+/g, "_")}.csv`;

      // Programmatically click the link to start the download.
      document.body.appendChild(link);
      link.click();

      // Clean up: remove the temporary element and revoke the URL.
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      showToast(`Downloaded: ${reportName}.csv`, "success");
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  // ─── Export the most recent generated report ─────────────────────────────────
  const handleExportPDF = async () => {
    const target = lastGenerated || previousReports[0];
    if (!target) {
      showToast("Please generate a report first", "warning");
      return;
    }
    await handleDownload(target._id, target.name);
  };

  // ─── Format Date Helper ───────────────────────────────────────────────────────
  const formatDate = (isoString) => {
    if (!isoString) return "—";
    return new Date(isoString).toLocaleDateString("en-GB", {
      day: "numeric", month: "short", year: "numeric"
    });
  };

  // ─── Render ─────────────────────────────────────────────────────────────────
=======
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

>>>>>>> 71c599f5aae482780c43c836ebac595de4d47a83
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">System Reports</h1>

      {/* Report Generator */}
      <div className="bg-card border border-border rounded-lg p-4 shadow-sm">
        <h3 className="font-semibold text-foreground mb-4">Generate Report</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
<<<<<<< HEAD

          {/* Report Type */}
=======
>>>>>>> 71c599f5aae482780c43c836ebac595de4d47a83
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
<<<<<<< HEAD

          {/* Month */}
=======
>>>>>>> 71c599f5aae482780c43c836ebac595de4d47a83
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Month</label>
            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
            >
<<<<<<< HEAD
              {["January","February","March","April","May","June",
                "July","August","September","October","November","December"].map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          {/* Year */}
=======
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
>>>>>>> 71c599f5aae482780c43c836ebac595de4d47a83
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
<<<<<<< HEAD

        <div className="flex flex-wrap gap-3">
          {/* Generate Report Button */}
          <button
            onClick={handleGenerate}
            disabled={generating}
            aria-label="Generate Report"
            className="flex items-center gap-2 px-4 py-2.5 bg-[#1d4ed8] hover:bg-[#1e40af] text-white rounded-lg min-h-[44px] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <FileBarChart className="w-5 h-5" />
            {generating ? "Generating…" : "Generate Report"}
          </button>

          {/* Export CSV Button — downloads the most recent/last generated report */}
          <button
            onClick={handleExportPDF}
            aria-label="Export as CSV"
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg min-h-[44px] transition-colors"
          >
            <Download className="w-5 h-5" />
            Export CSV
          </button>
        </div>

        {/* Show summary of last generated report */}
        {lastGenerated && (
          <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
            <p className="text-sm font-medium text-emerald-800">✅ Report Generated: {lastGenerated.name}</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Patients</p>
                <p className="font-bold text-sm text-foreground">{lastGenerated.data?.totalPatients ?? 0}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Appointments</p>
                <p className="font-bold text-sm text-foreground">{lastGenerated.data?.totalAppointments ?? 0}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground">No-Show Rate</p>
                <p className="font-bold text-sm text-red-600">{lastGenerated.data?.noShowRate ?? "0%"}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground">New Patients</p>
                <p className="font-bold text-sm text-foreground">{lastGenerated.data?.newPatients ?? 0}</p>
              </div>
            </div>
          </div>
        )}
=======
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
>>>>>>> 71c599f5aae482780c43c836ebac595de4d47a83
      </div>

      {/* Previous Reports */}
      <div className="bg-card border border-border rounded-lg p-4 shadow-sm">
        <h3 className="font-semibold text-foreground mb-4">Previous Reports</h3>
<<<<<<< HEAD
        {loadingReports ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-14 bg-muted rounded-lg animate-pulse" />
            ))}
          </div>
        ) : previousReports.length === 0 ? (
          <p className="text-center text-muted-foreground py-6 text-sm">
            No reports generated yet. Use the form above to generate your first report.
          </p>
        ) : (
          <div className="space-y-3">
            {previousReports.map((report) => (
              <div
                key={report._id}
                className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{report.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Generated: {formatDate(report.createdAt)} · by {report.generatedBy}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleDownload(report._id, report.name)}
                  aria-label={`Download ${report.name}`}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-[#1d4ed8] hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded min-h-[32px] transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
              </div>
            ))}
          </div>
        )}
=======
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
>>>>>>> 71c599f5aae482780c43c836ebac595de4d47a83
      </div>

      {/* Toast Notifications */}
      <div className="fixed bottom-5 right-5 space-y-2 z-50">
        {toasts.map((toast) => (
          <div
            key={toast.id}
<<<<<<< HEAD
            className={`px-4 py-3 rounded-lg shadow text-white text-sm ${
              toast.type === "success" ? "bg-green-500"
              : toast.type === "error"   ? "bg-red-500"
              : toast.type === "warning" ? "bg-yellow-500"
              : "bg-[#1d4ed8]"
=======
            className={`px-4 py-3 rounded-lg shadow text-white ${
              toast.type === "success"
                ? "bg-green-500"
                : toast.type === "error"
                ? "bg-red-500"
                : toast.type === "warning"
                ? "bg-yellow-500"
                : "bg-blue-500"
>>>>>>> 71c599f5aae482780c43c836ebac595de4d47a83
            }`}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </div>
  );
}
