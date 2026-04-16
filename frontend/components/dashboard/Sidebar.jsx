'use client';

import { useState, useEffect } from 'react';

const menuItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    id: 'appointment',
    label: 'Book Appointment',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    id: 'history',
    label: 'Consultation History',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    id: 'records',
    label: 'Old Records',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
      </svg>
    ),
  },
  {
    id: 'settings',
    label: 'Settings & Help',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
];

const brightColors = [
  'bg-purple-400',
];

const getRandomColor = (patientId) => {
  const index = patientId.charCodeAt(0) % brightColors.length;
  return brightColors[index];
};

export default function Sidebar({ activeSection, setActiveSection, sidebarOpen, setSidebarOpen, onNotify }) {
  const [isMobile, setIsMobile] = useState(false);
  const patientId = 'PA-89234';
  const profileColor = getRandomColor(patientId);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleMenuClick = (id) => {
    setActiveSection(id);
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const handleLogout = () => {
    onNotify('Logout successful');
    setTimeout(() => {
      // Backend logout logic would go here
    }, 1500);
  };

  const sidebarContent = (
    <>
      {/* Patient Profile Section */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-4 mb-4">
          <div className={`w-12 h-12 rounded-full ${profileColor} flex items-center justify-center text-white font-bold text-lg flex-shrink-0`}>
            SA
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-gray-900 text-sm">Sarah Anderson</p>
            <p className="text-xs text-gray-500">ID: #PA-89234</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleMenuClick(item.id)}
            className={`group w-full text-left px-4 py-3 rounded-lg transition-all duration-150 flex items-center gap-3 ${
              activeSection === item.id
                ? 'bg-green-100 text-green-700 font-semibold'
                : 'text-gray-600 hover:bg-green-50 hover:text-green-600 font-normal'
            }`}
          >
            <span className={`flex-shrink-0 transition-colors ${activeSection === item.id ? 'text-green-600' : 'text-gray-500 group-hover:text-green-500'}`}>{item.icon}</span>
            <span className="text-base">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 font-medium rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span className="text-base">Logout</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 bg-white flex-col border-r border-gray-200 h-screen">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      {isMobile && sidebarOpen && (
        <aside className="fixed left-0 top-0 w-64 h-screen bg-white flex flex-col z-50 lg:hidden shadow-lg">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">Menu</h3>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1 hover:bg-gray-100 rounded-md transition-colors"
            >
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            {sidebarContent}
          </div>
        </aside>
      )}
    </>
  );
}
