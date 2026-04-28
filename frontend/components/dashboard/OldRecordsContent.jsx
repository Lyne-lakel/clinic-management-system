'use client';

import { useState } from 'react';

export default function OldRecordsContent({ onNotify }) {
  const [filterType, setFilterType] = useState('');
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');
  const [isAddingFile, setIsAddingFile] = useState(false);
  const [newFileData, setNewFileData] = useState({
    name: '',
    type: 'lab',
    date: '',
    notes: '',
  });
  const [uploadingFile, setUploadingFile] = useState(null);

  const [records, setRecords] = useState([
    {
      id: 1,
      name: 'Lab Report - Cholesterol Panel',
      date: '2023-11-15',
      type: 'lab',
      size: '2.4 MB',
      notes: 'Routine cholesterol screening showing normal levels',
    },
    {
      id: 2,
      name: 'X-Ray - Chest',
      date: '2023-10-20',
      type: 'imaging',
      size: '3.8 MB',
      notes: 'Clear chest X-ray, no abnormalities detected',
    },
    {
      id: 3,
      name: 'Prescription Record',
      date: '2023-09-10',
      type: 'prescription',
      size: '0.5 MB',
      notes: 'Prescribed medication for blood pressure management',
    },
    {
      id: 4,
      name: 'Vaccination Certificate',
      date: '2023-08-05',
      type: 'vaccination',
      size: '1.2 MB',
      notes: 'COVID-19 booster dose administered',
    },
  ]);

  const types = [
    { id: 'lab', name: 'Lab Reports' },
    { id: 'imaging', name: 'Imaging' },
    { id: 'prescription', name: 'Prescriptions' },
    { id: 'vaccination', name: 'Vaccinations' },
  ];

  const filteredRecords = records.filter((record) => {
    const recordDate = new Date(record.date);
    const startDate = filterStartDate ? new Date(filterStartDate) : null;
    const endDate = filterEndDate ? new Date(filterEndDate) : null;

    if (filterType && record.type !== filterType) return false;
    if (startDate && recordDate < startDate) return false;
    if (endDate && recordDate > endDate) return false;

    return true;
  });

  const handleAddFile = () => {
    if (newFileData.name && newFileData.date && newFileData.type) {
      const newRecord = {
        id: records.length + 1,
        name: newFileData.name,
        date: newFileData.date,
        type: newFileData.type,
        size: '0.0 MB',
        notes: newFileData.notes,
      };
      setRecords([newRecord, ...records]);
      setNewFileData({ name: '', type: 'lab', date: '', notes: '' });
      setIsAddingFile(false);
      if (onNotify) onNotify('File added successfully');
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadingFile({ fileName: file.name, size: `${(file.size / 1024).toFixed(2)} KB` });
      setTimeout(() => setUploadingFile(null), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Old Records</h1>
        <p className="text-base text-gray-600 mt-1">Manage and view your personal medical files</p>
      </div>

      {/* Add File Button */}
      <button
        onClick={() => setIsAddingFile(!isAddingFile)}
<<<<<<< HEAD
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1d4ed8] hover:bg-[#1d4ed8] text-white rounded-lg transition-colors font-medium text-base"
=======
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium text-base"
>>>>>>> 71c599f5aae482780c43c836ebac595de4d47a83
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Add File
      </button>

      {/* Add File Form */}
      {isAddingFile && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-4 text-lg">Add New File</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-base font-semibold text-gray-900 mb-2">File Name</label>
              <input
                type="text"
                value={newFileData.name}
                onChange={(e) => setNewFileData({ ...newFileData, name: e.target.value })}
                placeholder="Enter file name"
<<<<<<< HEAD
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1d4ed8] text-base"
=======
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
>>>>>>> 71c599f5aae482780c43c836ebac595de4d47a83
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-base font-semibold text-gray-900 mb-2">Type</label>
                <select
                  value={newFileData.type}
                  onChange={(e) => setNewFileData({ ...newFileData, type: e.target.value })}
<<<<<<< HEAD
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1d4ed8] text-base"
=======
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
>>>>>>> 71c599f5aae482780c43c836ebac595de4d47a83
                >
                  {types.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-base font-semibold text-gray-900 mb-2">Date</label>
                <input
                  type="date"
                  value={newFileData.date}
                  onChange={(e) => setNewFileData({ ...newFileData, date: e.target.value })}
<<<<<<< HEAD
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1d4ed8] text-base"
=======
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
>>>>>>> 71c599f5aae482780c43c836ebac595de4d47a83
                />
              </div>
            </div>

            <div>
              <label className="block text-base font-semibold text-gray-900 mb-2">Notes (Optional)</label>
              <textarea
                value={newFileData.notes}
                onChange={(e) => setNewFileData({ ...newFileData, notes: e.target.value })}
                placeholder="Add any relevant notes about this file"
<<<<<<< HEAD
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1d4ed8] resize-none h-20 text-base"
=======
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none h-20 text-base"
>>>>>>> 71c599f5aae482780c43c836ebac595de4d47a83
              />
            </div>

            <div className="flex gap-2">
<<<<<<< HEAD
              <label className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-100 border-2 border-[#1d4ed8] rounded-lg cursor-pointer hover:bg-blue-50 transition-colors font-medium text-[#1d4ed8]">
=======
              <label className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-100 border-2 border-blue-600 rounded-lg cursor-pointer hover:bg-blue-50 transition-colors font-medium text-blue-600">
>>>>>>> 71c599f5aae482780c43c836ebac595de4d47a83
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Attach File
                <input
                  type="file"
                  onChange={handleFileUpload}
                  className="hidden"
                  accept="*"
                />
              </label>
              <button
                onClick={handleAddFile}
<<<<<<< HEAD
                className="flex-1 px-4 py-2 bg-[#1d4ed8] hover:bg-[#1d4ed8] text-white rounded-lg transition-colors font-semibold"
=======
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-semibold"
>>>>>>> 71c599f5aae482780c43c836ebac595de4d47a83
              >
                Add Record
              </button>
              <button
                onClick={() => {
                  setIsAddingFile(false);
                  if (onNotify) onNotify('Action cancelled');
                }}
                className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg transition-colors font-semibold"
              >
                Cancel
              </button>
            </div>

            {uploadingFile && (
              <p className="text-xs text-gray-600">
                {uploadingFile.message || `Uploading: ${uploadingFile.fileName}`}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Type Filter */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Type</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
<<<<<<< HEAD
              className={`w-full px-3 py-2.5 border-2 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-[#1d4ed8] ${
                filterType
                  ? 'border-[#1d4ed8] bg-blue-50 text-gray-900'
=======
              className={`w-full px-3 py-2.5 border-2 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                filterType
                  ? 'border-blue-600 bg-blue-50 text-gray-900'
>>>>>>> 71c599f5aae482780c43c836ebac595de4d47a83
                  : 'border-gray-300 bg-white text-gray-900'
              }`}
            >
              <option value="">All Types</option>
              {types.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>

          {/* Date Range Start */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">From Date</label>
            <input
              type="date"
              value={filterStartDate}
              onChange={(e) => setFilterStartDate(e.target.value)}
<<<<<<< HEAD
              className={`w-full px-3 py-2.5 border-2 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-[#1d4ed8] ${
                filterStartDate
                  ? 'border-[#1d4ed8] bg-blue-50'
=======
              className={`w-full px-3 py-2.5 border-2 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                filterStartDate
                  ? 'border-blue-600 bg-blue-50'
>>>>>>> 71c599f5aae482780c43c836ebac595de4d47a83
                  : 'border-gray-300 bg-white'
              }`}
            />
          </div>

          {/* Date Range End */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">To Date</label>
            <input
              type="date"
              value={filterEndDate}
              onChange={(e) => setFilterEndDate(e.target.value)}
<<<<<<< HEAD
              className={`w-full px-3 py-2.5 border-2 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-[#1d4ed8] ${
                filterEndDate
                  ? 'border-[#1d4ed8] bg-blue-50'
=======
              className={`w-full px-3 py-2.5 border-2 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                filterEndDate
                  ? 'border-blue-600 bg-blue-50'
>>>>>>> 71c599f5aae482780c43c836ebac595de4d47a83
                  : 'border-gray-300 bg-white'
              }`}
            />
          </div>
        </div>

        {/* Clear Filters */}
        {(filterType || filterStartDate || filterEndDate) && (
          <button
            onClick={() => {
              setFilterType('');
              setFilterStartDate('');
              setFilterEndDate('');
            }}
            className="mt-3 text-sm text-red-600 hover:text-red-700 font-medium"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Records List */}
      <div className="space-y-3">
        {filteredRecords.length > 0 ? (
          filteredRecords.map((record) => (
            <div
              key={record.id}
              className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 text-lg">{record.name}</h3>
                  <div className="text-base text-gray-600 mt-2 space-y-1">
                    <p>{new Date(record.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                    <p className="text-sm">{record.size}</p>
                    {record.notes && <p className="text-gray-700 italic">{record.notes}</p>}
                  </div>
                </div>

                <div className="flex gap-2 flex-shrink-0">
                  <button
                    title="Download"
                    className="p-2.5 hover:bg-blue-50 rounded-lg transition-colors"
                  >
<<<<<<< HEAD
                    <svg className="w-5 h-5 text-[#1d4ed8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
=======
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
>>>>>>> 71c599f5aae482780c43c836ebac595de4d47a83
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </button>
                  <button
                    title="View"
                    className="p-2.5 hover:bg-green-50 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
            <p className="text-gray-600 text-base">No records found matching your filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
