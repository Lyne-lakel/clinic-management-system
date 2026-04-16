"use client";

/**
 * =============================================================================
 * ADMIN STAFF MANAGEMENT PAGE
 * =============================================================================
 * 
 * PURPOSE:
 * Manage all staff members (doctors, receptionists).
 * Note: Admin is not a separate role - one of the doctors is the admin.
 * 
 * FEATURES:
 * - Table with clickable rows to view staff profile
 * - Profile modal showing all staff details
 * - Add staff (doctors and receptionists only - no Admin option)
 * - Delete staff member completely
 * - Enable/disable staff accounts
 * - Admin (Dr. Ahmed Nouar) does not have working hours/days shown
 * 
 * =============================================================================
 */

import { useState } from "react";
import { UserPlus, X, Trash2 } from "lucide-react";

// =============================================================================
// MOCK STAFF DATA
// Dr. Ahmed Nouar is both a doctor AND the admin - no working hours shown for admin
// =============================================================================
const initialStaff = [
  { 
    id: 1, 
    name: "Dr. Ahmed Nouar", 
    role: "Gyneco Doctor", 
    isAdmin: true, // This doctor is also the admin
    email: "ahmed@clinic.com", 
    phone: "+213 555 111222",
    dob: "1978-05-12",
    emergencyContact: "+213 555 999888",
    workingHours: "08:00 - 16:00",
    workingDays: "Mon, Tue, Wed, Thu, Fri",
    status: "Active", 
    joined: "Jan 2025" 
  },
  { 
    id: 2, 
    name: "Sarah Lee", 
    role: "Receptionist", 
    isAdmin: false,
    email: "sarah@clinic.com",
    phone: "+213 555 222333",
    dob: "1992-08-23",
    emergencyContact: "+213 555 777666",
    workingHours: "08:00 - 18:00",
    workingDays: "Mon, Tue, Wed, Thu, Fri, Sat",
    status: "Active", 
    joined: "Feb 2025" 
  },
  { 
    id: 3, 
    name: "Dr. Fatima Bensalem", 
    role: "Cardio Doctor", 
    isAdmin: false,
    email: "fatima@clinic.com",
    phone: "+213 555 444555",
    dob: "1980-11-30",
    emergencyContact: "+213 555 333222",
    workingHours: "10:00 - 18:00",
    workingDays: "Mon, Wed, Thu, Sat",
    status: "Active", 
    joined: "Jan 2025" 
  },
];

export default function StaffManagement() {
  const [staff, setStaff] = useState(initialStaff);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [newStaff, setNewStaff] = useState({ 
    name: "", 
    email: "", 
    role: "Receptionist",
    phone: "",
    dob: "",
    emergencyContact: "",
    workingHours: "08:00 - 18:00",
    workingDays: "Mon, Tue, Wed, Thu, Fri"
  });
  const [toasts, setToasts] = useState([]);

  // Show toast notification
  const showToast = (message, type = "success") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  // Add new staff member
  const handleAddStaff = () => {
    if (!newStaff.name || !newStaff.email || !newStaff.phone) {
      showToast("Please fill in all required fields", "error");
      return;
    }
    const newMember = {
      id: Date.now(),
      ...newStaff,
      isAdmin: false,
      status: "Active",
      joined: "Apr 2026",
    };
    setStaff([...staff, newMember]);
    setNewStaff({ 
      name: "", 
      email: "", 
      role: "Receptionist",
      phone: "",
      dob: "",
      emergencyContact: "",
      workingHours: "08:00 - 18:00",
      workingDays: "Mon, Tue, Wed, Thu, Fri"
    });
    setShowAddModal(false);
    showToast("Staff member added successfully");
  };

  // Toggle staff status (enable/disable)
  const toggleStatus = (id, e) => {
    e.stopPropagation();
    const member = staff.find((s) => s.id === id);
    // Don't allow disabling the admin
    if (member?.isAdmin) {
      showToast("Cannot disable admin account", "error");
      return;
    }
    setStaff(staff.map((s) => {
      if (s.id === id) {
        return { ...s, status: s.status === "Active" ? "Suspended" : "Active" };
      }
      return s;
    }));
    if (member) {
      showToast(
        member.status === "Active" ? "Staff account suspended" : "Staff account activated", 
        member.status === "Active" ? "warning" : "success"
      );
    }
  };

  // Delete staff member completely
  const handleDeleteStaff = (id, e) => {
    e.stopPropagation();
    const member = staff.find((s) => s.id === id);
    // Don't allow deleting the admin
    if (member?.isAdmin) {
      showToast("Cannot delete admin account", "error");
      return;
    }
    if (confirm(`Are you sure you want to permanently delete ${member?.name}? This action cannot be undone.`)) {
      setStaff(staff.filter((s) => s.id !== id));
      showToast("Staff member deleted", "warning");
    }
  };

  // Open profile modal
  const handleRowClick = (member) => {
    setSelectedStaff(member);
    setShowProfileModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Staff Management</h1>
        <button
          onClick={() => setShowAddModal(true)}
          aria-label="Add Staff"
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg min-h-[44px] transition-colors"
        >
          <UserPlus className="w-5 h-5" />
          Add Staff
        </button>
      </div>

      {/* Staff Table */}
      <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-medium text-foreground">Name</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-foreground">Role</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-foreground">Email</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-foreground">Working Hours</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-foreground">Status</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {staff.map((member) => (
                <tr 
                  key={member.id} 
                  className="hover:bg-muted/30 cursor-pointer"
                  onClick={() => handleRowClick(member)}
                >
                  <td className="px-4 py-3 text-sm text-foreground font-medium">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                        {member.name.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div>
                        {member.name}
                        {member.isAdmin && (
                          <span className="ml-2 text-xs px-2 py-0.5 bg-purple-100 text-purple-700 rounded">Admin</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{member.role}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{member.email}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {/* Admin doesn't show working hours/days */}
                    {member.isAdmin ? (
                      <span className="text-muted-foreground italic">N/A (Admin)</span>
                    ) : (
                      member.workingHours
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-2 py-1 text-xs font-medium rounded ${
                        member.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {member.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {/* Enable/Disable button - not for admin */}
                      {!member.isAdmin && (
                        <>
                          <button
                            onClick={(e) => toggleStatus(member.id, e)}
                            aria-label={member.status === "Active" ? "Disable staff" : "Enable staff"}
                            className={`px-3 py-1.5 text-xs font-medium rounded min-h-[32px] transition-colors ${
                              member.status === "Active"
                                ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                                : "bg-green-100 text-green-700 hover:bg-green-200"
                            }`}
                          >
                            {member.status === "Active" ? "Disable" : "Enable"}
                          </button>
                          <button
                            onClick={(e) => handleDeleteStaff(member.id, e)}
                            aria-label="Delete staff member"
                            className="p-1.5 text-red-600 hover:bg-red-100 rounded min-h-[32px] min-w-[32px] flex items-center justify-center"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      {member.isAdmin && (
                        <span className="text-xs text-muted-foreground italic">Protected</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Staff Profile Modal */}
      {showProfileModal && selectedStaff && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-lg w-full max-w-lg shadow-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="font-semibold text-foreground">Staff Profile</h2>
              <button
                onClick={() => setShowProfileModal(false)}
                aria-label="Close modal"
                className="p-1 hover:bg-muted rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              {/* Profile Header */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold">
                  {selectedStaff.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">{selectedStaff.name}</h3>
                  <p className="text-muted-foreground">{selectedStaff.role}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded ${
                      selectedStaff.status === "Active" 
                        ? "bg-green-100 text-green-800" 
                        : "bg-red-100 text-red-800"
                    }`}>
                      {selectedStaff.status}
                    </span>
                    {selectedStaff.isAdmin && (
                      <span className="px-2 py-0.5 text-xs font-medium rounded bg-purple-100 text-purple-700">
                        Admin
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Profile Details */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="text-sm font-medium text-foreground">{selectedStaff.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Phone</p>
                    <p className="text-sm font-medium text-foreground">{selectedStaff.phone || "Not provided"}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Date of Birth</p>
                    <p className="text-sm font-medium text-foreground">{selectedStaff.dob || "Not provided"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Emergency Contact</p>
                    <p className="text-sm font-medium text-foreground">{selectedStaff.emergencyContact || "Not provided"}</p>
                  </div>
                </div>
                {/* Only show working hours/days if NOT admin */}
                {!selectedStaff.isAdmin && (
                  <>
                    <div>
                      <p className="text-xs text-muted-foreground">Working Hours</p>
                      <p className="text-sm font-medium text-foreground">{selectedStaff.workingHours || "Not set"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Working Days</p>
                      <p className="text-sm font-medium text-foreground">{selectedStaff.workingDays || "Not set"}</p>
                    </div>
                  </>
                )}
                <div>
                  <p className="text-xs text-muted-foreground">Joined</p>
                  <p className="text-sm font-medium text-foreground">{selectedStaff.joined}</p>
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-border">
              <button
                onClick={() => setShowProfileModal(false)}
                className="w-full px-4 py-2 bg-muted hover:bg-muted/80 text-foreground rounded-lg min-h-[44px]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Staff Modal - NO Admin option in role dropdown */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-lg w-full max-w-lg shadow-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="font-semibold text-foreground">Add New Staff</h2>
              <button
                onClick={() => setShowAddModal(false)}
                aria-label="Close modal"
                className="p-1 hover:bg-muted rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Full Name *</label>
                <input
                  type="text"
                  value={newStaff.name}
                  onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                  placeholder="Enter full name"
                />
              </div>
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Email *</label>
                <input
                  type="email"
                  value={newStaff.email}
                  onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                  placeholder="Enter email"
                />
              </div>
              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Phone Number *</label>
                <input
                  type="tel"
                  value={newStaff.phone}
                  onChange={(e) => setNewStaff({ ...newStaff, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                  placeholder="+213 555 000000"
                />
              </div>
              {/* Date of Birth */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Date of Birth</label>
                <input
                  type="date"
                  value={newStaff.dob}
                  onChange={(e) => setNewStaff({ ...newStaff, dob: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                />
              </div>
              {/* Emergency Contact */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Emergency Contact</label>
                <input
                  type="tel"
                  value={newStaff.emergencyContact}
                  onChange={(e) => setNewStaff({ ...newStaff, emergencyContact: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                  placeholder="+213 555 000000"
                />
              </div>
              {/* Role - NO Admin option */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Role</label>
                <select
                  value={newStaff.role}
                  onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                >
                  <option value="Receptionist">Receptionist</option>
                  <option value="Gyneco Doctor">Gyneco Doctor</option>
                  <option value="Cardio Doctor">Cardio Doctor</option>
                  <option value="General Doctor">General Doctor</option>
                </select>
              </div>
              {/* Working Hours */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Working Hours</label>
                <input
                  type="text"
                  value={newStaff.workingHours}
                  onChange={(e) => setNewStaff({ ...newStaff, workingHours: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                  placeholder="08:00 - 18:00"
                />
              </div>
              {/* Working Days */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Working Days</label>
                <input
                  type="text"
                  value={newStaff.workingDays}
                  onChange={(e) => setNewStaff({ ...newStaff, workingDays: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                  placeholder="Mon, Tue, Wed, Thu, Fri"
                />
              </div>
            </div>
            <div className="p-4 border-t border-border flex gap-3 justify-end">
              <button
                onClick={() => setShowAddModal(false)}
                aria-label="Cancel"
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted rounded-lg min-h-[44px]"
              >
                Cancel
              </button>
              <button
                onClick={handleAddStaff}
                aria-label="Add staff member"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg min-h-[44px]"
              >
                Add Staff
              </button>
            </div>
          </div>
        </div>
      )}

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
