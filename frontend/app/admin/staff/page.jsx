'use client';
import React, { useState, useEffect } from 'react';

/**
 * ======================================================================  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Staff Management</h1>
        <button
          onClick={() => setShowAddModal(true)}
          aria-label="Add Staff"
          className="flex items-center gap-2 px-4 py-2.5 bg-[#1d4ed8] hover:bg-[#1e40af] text-white rounded-lg min-h-[44px] transition-colors"
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
                  key={member._id}
                  className="hover:bg-muted/30 cursor-pointer"
                  onClick={() => { setSelectedStaff(member); setShowProfileModal(true); }}
                >
                  {/* Name */}
                  <td className="px-4 py-3 text-sm text-foreground font-medium">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1d4ed8] to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        {member.name}
                        {member.isAdmin && (
                          <span className="ml-2 text-xs px-2 py-0.5 bg-purple-100 text-purple-700 rounded">Admin</span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Role */}
                  <td className="px-4 py-3 text-sm text-muted-foreground">{member.role}</td>

                  {/* Email */}
                  <td className="px-4 py-3 text-sm text-muted-foreground">{member.email}</td>

                  {/* Working Hours */}
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {member.isAdmin ? (
                      <span className="text-muted-foreground italic">N/A (Admin)</span>
                    ) : member.schedule?.availableSlots?.length > 0 ? (
                      <span className="text-emerald-600 font-medium text-xs">
                        {member.schedule.shiftStart}–{member.schedule.shiftEnd}
                        <span className="text-muted-foreground font-normal ml-1">
                          ({member.schedule.availableSlots.filter(s => s.status === 'available').length} slots)
                        </span>
                      </span>
                    ) : (
                      member.workingHours || '—'
                    )}
                  </td>

                  {/* Status badge */}
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-1 text-xs font-medium rounded ${
                      member.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {member.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                      {!member.isAdmin && (
                        <>
                          {/* Working Hours / Scheduling — doctors only */}
                          {isDoctor(member.role) && (
                            <button
                              onClick={(e) => handleOpenSchedule(member, e)}
                              aria-label="Configure working hours"
                              title="Configure Working Hours"
                              className="p-1.5 text-[#1d4ed8] hover:bg-blue-100 rounded min-h-[32px] min-w-[32px] flex items-center justify-center transition-colors"
                            >
                              <Clock className="w-4 h-4" />
                            </button>
                          )}

                          {/* Enable / Disable */}
                          <button
                            onClick={(e) => toggleStatus(member._id, e)}
                            aria-label={member.status === 'Active' ? 'Disable staff' : 'Enable staff'}
                            className={`px-2 py-1.5 text-xs font-medium rounded min-h-[32px] transition-colors ${
                              member.status === 'Active'
                                ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                                : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                            }`}
                          >
                            {member.status === 'Active' ? 'Disable' : 'Enable'}
                          </button>

                          {/* Delete */}
                          <button
                            onClick={(e) => handleDeleteStaff(member._id, e)}
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
        {staff.length === 0 && (
          <div className="p-8 text-center text-muted-foreground text-sm">
            No staff members yet. Click "Add Staff" to get started.
          </div>
        )}
      </div>

      {/* ── Staff Profile Modal ──────────────────────────────────────────────── */}
      {showProfileModal && selectedStaff && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-lg w-full max-w-lg shadow-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="font-semibold text-foreground">Staff Profile</h2>
              <button onClick={() => setShowProfileModal(false)} aria-label="Close modal" className="p-1 hover:bg-muted rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#1d4ed8] to-purple-600 flex items-center justify-center text-white text-xl font-bold">
                  {selectedStaff.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">{selectedStaff.name}</h3>
                  <p className="text-muted-foreground">{selectedStaff.role}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded ${selectedStaff.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                      {selectedStaff.status}
                    </span>
                    {selectedStaff.isAdmin && (
                      <span className="px-2 py-0.5 text-xs font-medium rounded bg-purple-100 text-purple-700">Admin</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="text-sm font-medium text-foreground">{selectedStaff.email || '—'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Phone</p>
                    <p className="text-sm font-medium text-foreground">{selectedStaff.phone || 'Not provided'}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Date of Birth</p>
                    <p className="text-sm font-medium text-foreground">{selectedStaff.dob || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Emergency Contact</p>
                    <p className="text-sm font-medium text-foreground">{selectedStaff.emergencyContact || 'Not provided'}</p>
                  </div>
                </div>
                {!selectedStaff.isAdmin && (
                  <>
                    <div>
                      <p className="text-xs text-muted-foreground">Working Hours</p>
                      <p className="text-sm font-medium text-foreground">{selectedStaff.workingHours || 'Not set'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Working Days</p>
                      <p className="text-sm font-medium text-foreground">{selectedStaff.workingDays || 'Not set'}</p>
                    </div>
                    {/* Show schedule summary if a schedule has been configured */}
                    {selectedStaff.schedule?.availableSlots?.length > 0 && (
                      <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">Scheduled Slots</p>
                        <p className="text-sm font-medium text-foreground">
                          {selectedStaff.schedule.shiftStart} – {selectedStaff.schedule.shiftEnd} ·{' '}
                          {selectedStaff.schedule.slotDuration}min slots ·{' '}
                          {selectedStaff.schedule.restInterval}min rest
                        </p>
                        <p className="text-xs text-emerald-700 mt-1">
                          {selectedStaff.schedule.availableSlots.filter(s => s.status === 'available').length} open /{' '}
                          {selectedStaff.schedule.availableSlots.length} total slots
                        </p>
                      </div>
                    )}
                  </>
                )}
                <div>
                  <p className="text-xs text-muted-foreground">Joined</p>
                  <p className="text-sm font-medium text-foreground">
                    {selectedStaff.joined ? new Date(selectedStaff.joined).toLocaleDateString('en-GB') : '—'}
                  </p>
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-border">
              <button onClick={() => setShowProfileModal(false)} className="w-full px-4 py-2 bg-muted hover:bg-muted/80 text-foreground rounded-lg min-h-[44px]">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Add Staff Modal ─────────────────────────────────────────────────── */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-lg w-full max-w-lg shadow-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="font-semibold text-foreground">Add New Staff</h2>
              <button onClick={() => setShowAddModal(false)} aria-label="Close modal" className="p-1 hover:bg-muted rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              {[
                { label: 'Full Name *', key: 'name', type: 'text', placeholder: 'Enter full name' },
                { label: 'Email *', key: 'email', type: 'email', placeholder: 'Enter email' },
                { label: 'Phone Number *', key: 'phone', type: 'tel', placeholder: '+213 555 000000' },
                { label: 'Date of Birth', key: 'dob', type: 'date', placeholder: '' },
                { label: 'Emergency Contact', key: 'emergencyContact', type: 'tel', placeholder: '+213 555 000000' },
              ].map(({ label, key, type, placeholder }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-foreground mb-1">{label}</label>
                  <input
                    type={type}
                    value={newStaff[key]}
                    onChange={e => setNewStaff({ ...newStaff, [key]: e.target.value })}
                    placeholder={placeholder}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1d4ed8] focus:border-[#1d4ed8] outline-none transition-all text-gray-900 bg-white"
                  />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Role</label>
                <select
                  value={newStaff.role}
                  onChange={e => setNewStaff({ ...newStaff, role: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1d4ed8] focus:border-[#1d4ed8] outline-none transition-all text-gray-900 bg-white"
                >
                  <option value="Receptionist">Receptionist</option>
                  <option value="Gyneco Doctor">Gyneco Doctor</option>
                  <option value="Cardio Doctor">Cardio Doctor</option>
                  <option value="General Doctor">General Doctor</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Working Hours</label>
                <input type="text" value={newStaff.workingHours} onChange={e => setNewStaff({ ...newStaff, workingHours: e.target.value })} placeholder="08:00 - 18:00" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1d4ed8] focus:border-[#1d4ed8] outline-none transition-all text-gray-900 bg-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Working Days</label>
                <input type="text" value={newStaff.workingDays} onChange={e => setNewStaff({ ...newStaff, workingDays: e.target.value })} placeholder="Mon, Tue, Wed, Thu, Fri" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1d4ed8] focus:border-[#1d4ed8] outline-none transition-all text-gray-900 bg-white" />
              </div>
            </div>
            <div className="p-4 border-t border-border flex gap-3 justify-end">
              <button onClick={() => setShowAddModal(false)} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg min-h-[44px] transition-colors">
                Cancel
              </button>
              <button onClick={handleAddStaff} className="px-4 py-2 bg-[#1d4ed8] hover:bg-[#1e40af] text-white text-sm font-medium rounded-lg min-h-[44px] transition-colors">
                Add Staff
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Schedule Modal ──────────────────────────────────────────────────── */}
      {showScheduleModal && scheduleDoctor && (
        <ScheduleModal
          doctor={scheduleDoctor}
          onClose={() => setShowScheduleModal(false)}
          onSave={() => {
            // Refresh the staff list so the Working Hours column updates
            fetch(`${API_ADMIN}/staff`)
              .then(res => res.json())
              .then(data => setStaff(data))
              .catch(() => {});
          }}
          showToast={showToast}
        />
      )}

      {/* Toast Notifications */}
      <div className="fixed bottom-5 right-5 space-y-2 z-50">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`px-4 py-3 rounded-lg shadow text-white text-sm ${
              toast.type === 'success' ? 'bg-green-500'
              : toast.type === 'error'   ? 'bg-red-500'
              : toast.type === 'warning' ? 'bg-yellow-500'
              : 'bg-[#1d4ed8]'
            }`}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </div>
  );
}
