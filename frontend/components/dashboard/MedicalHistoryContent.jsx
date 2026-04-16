'use client';

import { useState } from 'react';

export default function MedicalHistoryContent() {
  const [filterDoctor, setFilterDoctor] = useState('');
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');
  const [uploadingFile, setUploadingFile] = useState(null);

  // Mock consultation data - newest first
  const allConsultations = [
    {
      id: 1,
      doctor: 'Dr. Sarah Johnson',
      date: '2024-03-20',
      time: '10:30 AM',
      diagnosis: 'Common Cold',
      prescription: { name: 'prescription_cold_treatment.pdf', type: 'pdf', size: '245 KB' },
      followUpDate: '2024-04-03',
      uploadedFiles: [],
    },
    {
      id: 2,
      doctor: 'Dr. Michael Chen',
      date: '2024-02-10',
      time: '2:15 PM',
      diagnosis: 'Annual Check-up',
      prescription: { name: 'annual_checkup_report.pdf', type: 'pdf', size: '512 KB' },
      followUpDate: null,
      uploadedFiles: [],
    },
    {
      id: 3,
      doctor: 'Dr. Sarah Johnson',
      date: '2024-01-15',
      time: '11:00 AM',
      diagnosis: 'Skin Irritation',
      prescription: { name: 'dermatology_treatment.pdf', type: 'pdf', size: '178 KB' },
      followUpDate: '2024-02-01',
      uploadedFiles: [],
    },
  ];

  const doctors = ['Dr. Sarah Johnson', 'Dr. Michael Chen', 'Dr. Emma Wilson'];

  // Filter consultations
  const filteredConsultations = allConsultations.filter((consultation) => {
    const consultDate = new Date(consultation.date);
    const startDate = filterStartDate ? new Date(filterStartDate) : null;
    const endDate = filterEndDate ? new Date(filterEndDate) : null;

    if (filterDoctor && consultation.doctor !== filterDoctor) return false;
    if (startDate && consultDate < startDate) return false;
    if (endDate && consultDate > endDate) return false;

    return true;
  });

  const handleFileUpload = (consultationId, event) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadingFile({ consultationId, fileName: file.name, size: `${(file.size / 1024).toFixed(2)} KB` });
      setTimeout(() => setUploadingFile(null), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Consultation History</h1>
        <p className="text-base text-gray-600 mt-1">View your past consultations and medical documents</p>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Doctor Filter */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Doctor</label>
            <select
              value={filterDoctor}
              onChange={(e) => setFilterDoctor(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Doctors</option>
              {doctors.map((doctor) => (
                <option key={doctor} value={doctor}>
                  {doctor}
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
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Date Range End */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">To Date</label>
            <input
              type="date"
              value={filterEndDate}
              onChange={(e) => setFilterEndDate(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Clear Filters */}
        {(filterDoctor || filterStartDate || filterEndDate) && (
          <button
            onClick={() => {
              setFilterDoctor('');
              setFilterStartDate('');
              setFilterEndDate('');
            }}
            className="mt-3 text-sm text-red-600 hover:text-red-700 font-medium"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Consultations List */}
      <div className="space-y-4">
        {filteredConsultations.length > 0 ? (
          filteredConsultations.map((consultation, index) => (
            <div
              key={consultation.id}
              className={`rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200 border ${index % 2 === 0
                  ? 'bg-white border-gray-200'
                  : 'bg-gray-50 border-gray-200'
                }`}
            >
              {/* Card Header */}
              <div className="p-5 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{consultation.doctor}</h3>
                    <p className="text-base text-gray-600 mt-1">
                      {new Date(consultation.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}{' '}
                      at {consultation.time}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-700">Diagnosis</p>
                    <p className="text-base text-gray-900">{consultation.diagnosis}</p>
                  </div>
                </div>
              </div>

              {/* Card Body - Table Layout */}
              <div className="overflow-x-auto">
                <table className="w-full text-base">
                  <tbody>
                    {/* Prescription / Justification Row */}
                    <tr className="border-t border-gray-200 hover:bg-gray-50">
                      <td className="p-4">
                        <p className="font-medium text-gray-900 text-base">Prescription / Justification</p>
                      </td>
                      <td className="p-4">
                        {consultation.prescription ? (
                          <div className="flex items-center gap-3">
                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                            <div className="flex-1 min-w-0">
                              <p className="text-gray-900 truncate text-base">{consultation.prescription.name}</p>
                              <p className="text-sm text-gray-600">{consultation.prescription.size}</p>
                            </div>
                            <div className="flex gap-2 flex-shrink-0">
                              <button
                                title="Download"
                                className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                              >
                                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                              </button>
                              <button
                                title="View"
                                className="p-2 hover:bg-green-50 rounded-lg transition-colors"
                              >
                                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        ) : (
                          <p className="text-gray-500 italic">No prescription available</p>
                        )}
                      </td>
                    </tr>

                    {/* Follow-up Date Row */}
                    <tr className="border-t border-gray-200 hover:bg-gray-50">
                      <td className="p-4">
                        <p className="font-medium text-gray-900 text-base">Follow-up Date</p>
                      </td>
                      <td className="p-4">
                        {consultation.followUpDate ? (
                          <p className="text-gray-900 text-base">
                            {new Date(consultation.followUpDate).toLocaleDateString('en-US', {
                              month: 'long',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </p>
                        ) : (
                          <p className="text-gray-500 italic text-base">No follow-up scheduled</p>
                        )}
                      </td>
                    </tr>

                    {/* Upload Files Row */}
                    <tr className="border-t border-gray-200 bg-gray-50 hover:bg-gray-100">
                      <td className="p-4">
                        <p className="font-medium text-gray-900 text-base">Attachments</p>
                      </td>
                      <td className="p-4">
                        <label className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg cursor-pointer hover:bg-white transition-colors">
                          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                          <span className="text-base font-medium text-gray-700">Add File</span>
                          <input
                            type="file"
                            onChange={(e) => handleFileUpload(consultation.id, e)}
                            className="hidden"
                            accept="*"
                          />
                        </label>
                        {uploadingFile?.consultationId === consultation.id && (
                          <p className="text-xs text-gray-600 mt-2">
                            Uploading: {uploadingFile.fileName}
                          </p>
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
            <p className="text-gray-600">No consultations found matching your filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
