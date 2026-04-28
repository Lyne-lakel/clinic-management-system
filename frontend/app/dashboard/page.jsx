'use client';

import { useState } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardContent from '@/components/dashboard/DashboardContent';
import BookAppointmentContent from '@/components/dashboard/BookAppointmentContent';
import MedicalHistoryContent from '@/components/dashboard/MedicalHistoryContent';
import OldRecordsContent from '@/components/dashboard/OldRecordsContent';
import SettingsHelpContent from '@/components/dashboard/SettingsHelpContent';
import Notification from '@/components/Notification';

export default function DashboardPage() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notification, setNotification] = useState(null);

  const sections = {
    dashboard: <DashboardContent />,
    appointment: <BookAppointmentContent onNotify={setNotification} />,
    history: <MedicalHistoryContent />,
    records: <OldRecordsContent onNotify={setNotification} />,
    settings: <SettingsHelpContent onNotify={setNotification} />,
  };

  return (
    <div className="flex h-screen bg-white">
      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        onNotify={setNotification}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Notification */}
        <Notification message={notification} type="success" />

        {/* Mobile Header */}
        <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-md transition-colors"
          >
            <svg
              className="w-6 h-6 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto bg-gray-50">
          <div className="p-6 lg:p-8 max-w-7xl mx-auto w-full">
            {sections[activeSection]}
          </div>
        </div>
      </div>
    </div>
  );
}
