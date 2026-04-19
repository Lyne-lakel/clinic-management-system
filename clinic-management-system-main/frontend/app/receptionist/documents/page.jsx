"use client";

import { useState } from "react";
import { Upload, Search, X, FileText } from "lucide-react";

const documentTypes = [
  { value: "lab", label: "Lab Report" },
  { value: "imaging", label: "Imaging" },
  { value: "prescription", label: "Prescription" },
  { value: "vaccination", label: "Vaccination Record" },
  { value: "insurance", label: "Insurance Document" },
];

const mockPatients = [
  { id: "P001", name: "Ahmed Benali" },
  { id: "P002", name: "Fatima Zohra" },
  { id: "P003", name: "Karim Said" },
  { id: "P004", name: "Lydia Mansour" },
  { id: "P005", name: "Omar Khelif" },
];

const initialUploads = [
  { id: 1, fileName: "blood_test_results.pdf", patient: "Ahmed Benali", patientId: "P001", date: "2025-04-18" },
  { id: 2, fileName: "xray_chest.jpg", patient: "Karim Said", patientId: "P003", date: "2025-04-18" },
  { id: 3, fileName: "insurance_card.pdf", patient: "Lydia Mansour", patientId: "P004", date: "2025-04-17" },
  { id: 4, fileName: "prescription_march.pdf", patient: "Fatima Zohra", patientId: "P002", date: "2025-04-17" },
];

export default function DocumentsPage() {
  const [uploads, setUploads] = useState(initialUploads);
  const [patientSearch, setPatientSearch] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showPatientDropdown, setShowPatientDropdown] = useState(false);

  const [docType, setDocType] = useState("lab");
  const [docTitle, setDocTitle] = useState("");
  const [docDescription, setDocDescription] = useState("");
  const [docDate, setDocDate] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = "success") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  const filteredPatients = mockPatients.filter(
    (p) =>
      p.name.toLowerCase().includes(patientSearch.toLowerCase()) ||
      p.id.toLowerCase().includes(patientSearch.toLowerCase())
  );

  function selectPatient(patient) {
    setSelectedPatient(patient);
    setPatientSearch(patient.name);
    setShowPatientDropdown(false);
  }

  function clearPatient() {
    setSelectedPatient(null);
    setPatientSearch("");
  }

  function handleFileSelect(e) {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  }

  function handleUpload() {
    if (!selectedPatient || !selectedFile || !docTitle) return;

    setIsUploading(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          const newUpload = {
            id: Date.now(),
            fileName: selectedFile.name,
            patient: selectedPatient.name,
            patientId: selectedPatient.id,
            date: new Date().toISOString().split("T")[0],
          };
          setUploads([newUpload, ...uploads]);
          setIsUploading(false);
          showToast("Document uploaded");
          setDocTitle("");
          setDocDescription("");
          setDocDate("");
          setSelectedFile(null);
          return 0;
        }
        return prev + 10;
      });
    }, 200);
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Document Upload</h2>
        <p className="text-muted-foreground">Upload documents to patient profiles</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left - Upload Form */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="font-semibold text-foreground mb-4">Upload New Document</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Document Type</label>
              <select
                value={docType}
                onChange={(e) => setDocType(e.target.value)}
                className="w-full px-4 py-2 border border-input rounded-lg bg-background min-h-[44px]"
              >
                {documentTypes.map((type) => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Title *</label>
              <input
                type="text"
                value={docTitle}
                onChange={(e) => setDocTitle(e.target.value)}
                className="w-full px-4 py-2 border border-input rounded-lg bg-background min-h-[44px]"
                placeholder="Document title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Description</label>
              <textarea
                value={docDescription}
                onChange={(e) => setDocDescription(e.target.value)}
                className="w-full px-4 py-2 border border-input rounded-lg bg-background min-h-[80px] resize-none"
                placeholder="Optional description..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Document Date</label>
              <input
                type="date"
                value={docDate}
                onChange={(e) => setDocDate(e.target.value)}
                className="w-full px-4 py-2 border border-input rounded-lg bg-background min-h-[44px]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Select File *</label>
              <div className="border-2 border-dashed border-input rounded-lg p-6 text-center bg-muted/50">
                <input
                  type="file"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload"
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                />
                <label htmlFor="file-upload" className="cursor-pointer block">
                  {selectedFile ? (
                    <div className="space-y-2">
                      <FileText className="w-10 h-10 mx-auto text-[#1d4ed8]" />
                      <p className="text-foreground font-medium">{selectedFile.name}</p>
                      <p className="text-sm text-muted-foreground">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                      <p className="text-sm text-[#1d4ed8]">Click to change file</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="w-10 h-10 mx-auto text-muted-foreground" />
                      <p className="text-foreground">Click to select a file</p>
                      <p className="text-sm text-muted-foreground">PDF, JPG, PNG, DOC accepted</p>
                    </div>
                  )}
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Right - Patient Assignment */}
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="font-semibold text-foreground mb-4">Assign to Patient</h3>

            <div className="relative mb-4">
              <label className="block text-sm font-medium text-foreground mb-1">Search Patient</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  value={patientSearch}
                  onChange={(e) => {
                    setPatientSearch(e.target.value);
                    setShowPatientDropdown(true);
                    if (!e.target.value) setSelectedPatient(null);
                  }}
                  onFocus={() => setShowPatientDropdown(true)}
                  className="w-full pl-10 pr-4 py-2 border border-input rounded-lg bg-background min-h-[44px]"
                  placeholder="Search by name or ID..."
                />
              </div>

              {showPatientDropdown && patientSearch && !selectedPatient && (
                <div className="absolute z-10 w-full mt-1 bg-card border border-border rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {filteredPatients.length > 0 ? (
                    filteredPatients.map((patient) => (
                      <button
                        key={patient.id}
                        onClick={() => selectPatient(patient)}
                        className="w-full px-4 py-3 text-left hover:bg-muted flex items-center justify-between min-h-[44px]"
                      >
                        <span className="text-foreground">{patient.name}</span>
                        <span className="text-sm text-muted-foreground">{patient.id}</span>
                      </button>
                    ))
                  ) : (
                    <p className="px-4 py-3 text-muted-foreground">No patients found</p>
                  )}
                </div>
              )}
            </div>

            {selectedPatient && (
              <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-lg mb-4 border border-emerald-200 dark:border-emerald-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">{selectedPatient.name}</p>
                    <p className="text-sm text-muted-foreground">{selectedPatient.id}</p>
                  </div>
                  <button
                    onClick={clearPatient}
                    className="p-2 hover:bg-background rounded min-h-[44px] min-w-[44px] flex items-center justify-center"
                    aria-label="Clear selected patient"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {isUploading && (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-foreground">Uploading...</span>
                  <span className="text-sm text-muted-foreground">{uploadProgress}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-[#1d4ed8] h-2 rounded-full transition-all duration-200"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            <button
              onClick={handleUpload}
              disabled={!selectedPatient || !selectedFile || !docTitle || isUploading}
              className="w-full px-4 py-3 bg-[#1d4ed8] text-white rounded-lg hover:bg-[#1d4ed8] disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] font-medium flex items-center justify-center gap-2"
            >
              <Upload className="w-5 h-5" />
              {isUploading ? "Uploading..." : "Upload to Patient Profile"}
            </button>
          </div>
        </div>
      </div>

      {/* Recent Uploads - Without Status Column */}
      <div className="bg-card border border-border rounded-lg">
        <div className="p-4 border-b border-border">
          <h3 className="font-semibold text-foreground">Recent Uploads</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="p-3 text-left text-sm font-medium text-muted-foreground">File Name</th>
                <th className="p-3 text-left text-sm font-medium text-muted-foreground">Patient</th>
                <th className="p-3 text-left text-sm font-medium text-muted-foreground">Date Uploaded</th>
              </tr>
            </thead>
            <tbody>
              {uploads.map((upload) => (
                <tr key={upload.id} className="border-t border-border">
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#1d4ed8]" />
                      <span className="text-foreground">{upload.fileName}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="text-foreground">{upload.patient}</div>
                    <div className="text-xs text-muted-foreground">{upload.patientId}</div>
                  </td>
                  <td className="p-3 text-muted-foreground">{upload.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
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
