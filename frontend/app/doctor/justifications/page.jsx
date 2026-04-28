"use client";

/**
 * =============================================================================
 * DOCTOR JUSTIFICATIONS PAGE
 * =============================================================================
 * 
 * PURPOSE:
 * View and manage all medical justifications issued to patients.
 * 
 * FEATURES:
 * - List all justifications with patient details
 * - Add new justification button
 * - Search by date or patient name
 * - View full justification details
 * - Print individual justifications
 * 
 * =============================================================================
 */

import { useState } from "react";
import { 
  FileCheck, 
  Search, 
  Plus, 
  Calendar, 
  User, 
  Printer,
  X,
  Clock,
  Filter
} from "lucide-react";

// =============================================================================
// MOCK DATA - All justifications
// =============================================================================
const initialJustifications = [
  {
    id: 1,
    date: "2026-04-13",
    patient: "Amira Bouzid",
    patientAge: 32,
    patientPhone: "+213 555 123456",
    reason: "Prenatal care",
    days: 3,
    content: "This is to certify that the patient mentioned above was examined on this date and requires:\n\n[X] Medical leave for 3 days\n[ ] Rest at home\n[ ] Light duty work\n\nReason: Prenatal care and observation due to elevated blood pressure.",
    startDate: "2026-04-13",
    endDate: "2026-04-16"
  },
  {
    id: 2,
    date: "2026-04-10",
    patient: "Meriem Saidi",
    patientAge: 35,
    patientPhone: "+213 555 456789",
    reason: "Gestational diabetes monitoring",
    days: 2,
    content: "This is to certify that the patient mentioned above was examined on this date and requires:\n\n[X] Medical leave for 2 days\n[X] Rest at home\n\nReason: Gestational diabetes monitoring and glucose level stabilization.",
    startDate: "2026-04-10",
    endDate: "2026-04-12"
  },
  {
    id: 3,
    date: "2026-04-05",
    patient: "Souad Mahfoud",
    patientAge: 29,
    patientPhone: "+213 555 678901",
    reason: "Post-operative recovery",
    days: 7,
    content: "This is to certify that the patient mentioned above was examined on this date and requires:\n\n[X] Medical leave for 7 days\n[X] Rest at home\n[ ] Light duty work\n\nReason: Post-operative recovery following laparoscopic surgery. Patient advised complete rest.",
    startDate: "2026-04-05",
    endDate: "2026-04-12"
  },
  {
    id: 4,
    date: "2026-03-28",
    patient: "Fatima Zerhouni",
    patientAge: 45,
    patientPhone: "+213 555 234567",
    reason: "Medical examination",
    days: 1,
    content: "This is to certify that the patient mentioned above was examined on this date and requires:\n\n[X] Medical leave for 1 day\n\nReason: Annual gynecological examination requiring rest period.",
    startDate: "2026-03-28",
    endDate: "2026-03-28"
  },
  {
    id: 5,
    date: "2026-03-20",
    patient: "Nadia Hamidi",
    patientAge: 52,
    patientPhone: "+213 555 567890",
    reason: "HRT adjustment",
    days: 2,
    content: "This is to certify that the patient mentioned above was examined on this date and requires:\n\n[X] Medical leave for 2 days\n[X] Rest at home\n\nReason: Hormone replacement therapy adjustment period. Monitoring for side effects.",
    startDate: "2026-03-20",
    endDate: "2026-03-22"
  },
];

// All patients for the dropdown
const allPatients = [
  { id: 1, name: "Amira Bouzid", age: 32, phone: "+213 555 123456" },
  { id: 2, name: "Fatima Zerhouni", age: 45, phone: "+213 555 234567" },
  { id: 3, name: "Khadija Benali", age: 28, phone: "+213 555 345678" },
  { id: 4, name: "Meriem Saidi", age: 35, phone: "+213 555 456789" },
  { id: 5, name: "Nadia Hamidi", age: 52, phone: "+213 555 567890" },
  { id: 6, name: "Souad Mahfoud", age: 29, phone: "+213 555 678901" },
];

// Default justification template
const DEFAULT_JUSTIFICATION = `This is to certify that the patient mentioned above was examined on this date and requires:

[ ] Medical leave for ___ days
[ ] Rest at home
[ ] Light duty work
[ ] Other: _______________

Reason: `;

// =============================================================================
// MAIN COMPONENT
// =============================================================================
export default function DoctorJustifications() {
  const [justifications, setJustifications] = useState(initialJustifications);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all"); // all, date, patient
  const [dateFilter, setDateFilter] = useState("");
  
  // Add new justification modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newJustification, setNewJustification] = useState({
    patient: "",
    reason: "",
    days: 1,
    content: DEFAULT_JUSTIFICATION,
    startDate: new Date().toISOString().split("T")[0]
  });
  
  // View justification modal
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedJustification, setSelectedJustification] = useState(null);
  
  const [toasts, setToasts] = useState([]);

  // Toast helper
  const showToast = (message, type = "success") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  // Filter justifications
  const filteredJustifications = justifications.filter(j => {
    // Text search (patient name or reason)
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      if (!j.patient.toLowerCase().includes(term) && !j.reason.toLowerCase().includes(term)) {
        return false;
      }
    }
    
    // Date filter
    if (dateFilter) {
      if (j.date !== dateFilter) return false;
    }
    
    return true;
  }).sort((a, b) => new Date(b.date) - new Date(a.date)); // Newest first

  // Handle add justification
  const handleAddJustification = () => {
    if (!newJustification.patient || !newJustification.reason) {
      showToast("Please fill in all required fields", "error");
      return;
    }
    
    const selectedPatient = allPatients.find(p => p.name === newJustification.patient);
    
    const endDate = new Date(newJustification.startDate);
    endDate.setDate(endDate.getDate() + newJustification.days - 1);
    
    const newItem = {
      id: Date.now(),
      date: new Date().toISOString().split("T")[0],
      patient: newJustification.patient,
      patientAge: selectedPatient?.age || 0,
      patientPhone: selectedPatient?.phone || "",
      reason: newJustification.reason,
      days: newJustification.days,
      content: newJustification.content,
      startDate: newJustification.startDate,
      endDate: endDate.toISOString().split("T")[0]
    };
    
    setJustifications(prev => [newItem, ...prev]);
    setNewJustification({
      patient: "",
      reason: "",
      days: 1,
      content: DEFAULT_JUSTIFICATION,
      startDate: new Date().toISOString().split("T")[0]
    });
    setShowAddModal(false);
    showToast("Justification created successfully");
  };

  // View justification
  const handleView = (justification) => {
    setSelectedJustification(justification);
    setShowViewModal(true);
  };

  // Print justification
  const handlePrint = (justification) => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Medical Justification - ${justification.patient}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
          .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 20px; margin-bottom: 30px; }
          .clinic-name { font-size: 24px; font-weight: bold; color: #0066cc; }
          .doctor-info { margin-top: 10px; color: #666; }
          .patient-info { background: #f5f5f5; padding: 15px; border-radius: 8px; margin-bottom: 30px; }
          .patient-name { font-size: 18px; font-weight: bold; }
          .section { margin-bottom: 25px; }
          .section-title { font-weight: bold; font-size: 16px; color: #333; margin-bottom: 15px; text-align: center; text-transform: uppercase; }
          .content { white-space: pre-wrap; line-height: 1.8; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
          .dates { background: #e8f4fc; padding: 10px; border-radius: 8px; margin-bottom: 20px; text-align: center; }
          .footer { margin-top: 50px; text-align: right; }
          @media print { body { padding: 20px; } }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="clinic-name">CityMed Clinic</div>
          <div class="doctor-info">
            <div>Dr. Ahmed Nouar - Gynecologist</div>
            <div>123 Medical Center Blvd, Algiers</div>
            <div>Tel: +213 21 123 456</div>
          </div>
        </div>
        
        <div class="patient-info">
          <div class="patient-name">${justification.patient}</div>
          <div>Age: ${justification.patientAge} years | Phone: ${justification.patientPhone}</div>
        </div>
        
        <div class="dates">
          <strong>Period:</strong> ${justification.startDate} to ${justification.endDate} (${justification.days} day${justification.days > 1 ? "s" : ""})
        </div>
        
        <div class="section">
          <div class="section-title">Medical Justification</div>
          <div class="content">${justification.content}</div>
        </div>
        
        <div class="footer">
          <div>Issued on: ${justification.date}</div>
          <div style="margin-top: 50px; border-top: 1px solid #000; width: 200px; margin-left: auto;"></div>
          <div style="margin-top: 5px;">Dr. Ahmed Nouar</div>
          <div style="font-size: 12px; color: #666;">Medical License No: 12345</div>
        </div>
        
        <script>window.print();</script>
      </body>
      </html>
    `);
    printWindow.document.close();
    showToast("Printing justification", "info");
  };

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <FileCheck className="w-6 h-6 text-[#1d4ed8]" />
            Justifications
          </h1>
          <p className="text-muted-foreground">Manage all medical justifications</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-[#1d4ed8] text-white px-4 py-3 rounded-lg font-medium hover:bg-[#1e40af] flex items-center gap-2 min-h-[44px] transition-colors"
        >
          <Plus className="w-5 h-5" />
          New Justification
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search by patient */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by patient name or reason..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1d4ed8] focus:border-[#1d4ed8] outline-none transition-all text-gray-900 bg-white placeholder:text-gray-400 min-h-[44px]"
            />
          </div>
          
          {/* Filter by date */}
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1d4ed8] focus:border-[#1d4ed8] outline-none transition-all text-gray-900 bg-white min-h-[44px]"
            />
          </div>
          
          {/* Clear filters */}
          {(searchTerm || dateFilter) && (
            <button
              onClick={() => { setSearchTerm(""); setDateFilter(""); }}
              className="px-4 py-2.5 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 min-h-[44px]"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Justifications List */}
      <div className="bg-card border border-border rounded-lg divide-y divide-border">
        {filteredJustifications.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            No justifications found
          </div>
        ) : (
          filteredJustifications.map((just) => (
            <div key={just.id} className="p-4 hover:bg-muted/30 transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-bold">
                      {just.patient.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{just.patient}</h3>
                      <p className="text-sm text-muted-foreground">{just.reason}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3 text-sm">
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      {just.date}
                    </span>
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      {just.days} day{just.days > 1 ? "s" : ""}
                    </span>
                    <span className="text-muted-foreground">
                      {just.startDate} - {just.endDate}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleView(just)}
                    className="px-3 py-2 text-[#1d4ed8] hover:bg-blue-50 rounded-lg text-sm font-medium min-h-[40px]"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handlePrint(just)}
                    className="p-2 text-[#1d4ed8] hover:bg-blue-50 rounded-lg min-h-[40px] min-w-[40px] flex items-center justify-center"
                    title="Print"
                  >
                    <Printer className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Justification Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl w-full max-w-2xl shadow-xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-4 border-b border-border flex items-center justify-between shrink-0">
              <h2 className="font-semibold text-lg text-foreground">New Justification</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-muted rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Patient Selection */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Patient <span className="text-red-500">*</span>
                </label>
                <select
                  value={newJustification.patient}
                  onChange={(e) => setNewJustification(prev => ({ ...prev, patient: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1d4ed8] focus:border-[#1d4ed8] outline-none transition-all text-gray-900 bg-white min-h-[44px]"
                >
                  <option value="">Select patient...</option>
                  {allPatients.map(p => (
                    <option key={p.id} value={p.name}>{p.name} - {p.age} years</option>
                  ))}
                </select>
              </div>

              {/* Reason */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Reason <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newJustification.reason}
                  onChange={(e) => setNewJustification(prev => ({ ...prev, reason: e.target.value }))}
                  placeholder="e.g., Prenatal care, Post-operative recovery..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1d4ed8] focus:border-[#1d4ed8] outline-none transition-all text-gray-900 bg-white placeholder:text-gray-400 min-h-[44px]"
                />
              </div>

              {/* Dates and Days */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Start Date</label>
                  <input
                    type="date"
                    value={newJustification.startDate}
                    onChange={(e) => setNewJustification(prev => ({ ...prev, startDate: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1d4ed8] focus:border-[#1d4ed8] outline-none transition-all text-gray-900 bg-white min-h-[44px]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Number of Days</label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={newJustification.days}
                    onChange={(e) => setNewJustification(prev => ({ ...prev, days: parseInt(e.target.value) || 1 }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1d4ed8] focus:border-[#1d4ed8] outline-none transition-all text-gray-900 bg-white min-h-[44px]"
                  />
                </div>
              </div>

              {/* Justification Content */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Justification Content
                </label>
                <textarea
                  value={newJustification.content}
                  onChange={(e) => setNewJustification(prev => ({ ...prev, content: e.target.value }))}
                  rows={8}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1d4ed8] focus:border-[#1d4ed8] outline-none transition-all text-gray-900 bg-white font-mono text-sm"
                />
              </div>
            </div>
            
            <div className="p-4 border-t border-border flex gap-3 shrink-0">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 bg-red-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-red-700 min-h-[44px] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddJustification}
                className="flex-1 bg-[#1d4ed8] text-white px-4 py-3 rounded-lg font-medium hover:bg-[#1e40af] flex items-center justify-center gap-2 min-h-[44px] transition-colors"
              >
                <Plus className="w-5 h-5" />
                Create Justification
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Justification Modal */}
      {showViewModal && selectedJustification && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl w-full max-w-2xl shadow-xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-4 border-b border-border flex items-center justify-between shrink-0">
              <div>
                <h2 className="font-semibold text-lg text-foreground">Justification Details</h2>
                <p className="text-sm text-muted-foreground">{selectedJustification.patient}</p>
              </div>
              <button
                onClick={() => setShowViewModal(false)}
                className="p-2 hover:bg-muted rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Patient Info */}
              <div className="bg-muted/30 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-bold">
                    {selectedJustification.patient.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">{selectedJustification.patient}</h3>
                    <p className="text-sm text-muted-foreground">{selectedJustification.patientAge} years old</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Phone:</span>
                    <p className="font-medium">{selectedJustification.patientPhone}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Issued:</span>
                    <p className="font-medium">{selectedJustification.date}</p>
                  </div>
                </div>
              </div>

              {/* Justification Details */}
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-purple-700">Reason: {selectedJustification.reason}</h4>
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                    {selectedJustification.days} day{selectedJustification.days > 1 ? "s" : ""}
                  </span>
                </div>
                <div className="text-sm text-purple-600 mb-3">
                  Period: {selectedJustification.startDate} to {selectedJustification.endDate}
                </div>
                <div className="bg-white rounded-lg p-4 border border-purple-200">
                  <pre className="whitespace-pre-wrap text-sm text-foreground font-sans">
                    {selectedJustification.content}
                  </pre>
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t border-border flex gap-3 shrink-0">
              <button
                onClick={() => setShowViewModal(false)}
                className="flex-1 bg-red-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-red-700 min-h-[44px] transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => handlePrint(selectedJustification)}
                className="flex-1 bg-[#1d4ed8] text-white px-4 py-3 rounded-lg font-medium hover:bg-[#1e40af] flex items-center justify-center gap-2 min-h-[44px] transition-colors"
              >
                <Printer className="w-5 h-5" />
                Print
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notifications */}
      <div className="fixed bottom-20 md:bottom-5 right-5 space-y-2 z-50">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`px-4 py-3 rounded-lg shadow text-white ${
              toast.type === "success"
                ? "bg-green-500"
                : toast.type === "error"
                ? "bg-red-500"
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
