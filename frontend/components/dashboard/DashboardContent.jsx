'use client';

import { useState, useEffect } from 'react';

export default function DashboardContent() {
  const [countdowns, setCountdowns] = useState({});

  // Mock appointments within next 15 days
  const upcomingAppointments = [
    { id: 1, doctor: 'Dr. Sarah Johnson', date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), time: '10:00 AM', specialty: 'General Practitioner' },
    { id: 2, doctor: 'Dr. Michael Chen', date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), time: '2:30 PM', specialty: 'Cardiologist' },
    { id: 3, doctor: 'Dr. Emma Wilson', date: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000), time: '11:00 AM', specialty: 'Dermatologist' },
  ];

  // Update countdowns every second
  useEffect(() => {
    const updateCountdowns = () => {
      const now = new Date();
      const newCountdowns = {};

      upcomingAppointments.forEach((apt) => {
        const diff = apt.date - now;
        if (diff > 0) {
          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
          const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((diff % (1000 * 60)) / 1000);

          if (days > 0) {
            newCountdowns[apt.id] = `in ${days} day${days > 1 ? 's' : ''}`;
          } else if (hours > 0) {
            newCountdowns[apt.id] = `in ${hours} hour${hours > 1 ? 's' : ''}`;
          } else {
            newCountdowns[apt.id] = `in ${minutes} min ${seconds}s`;
          }
        }
      });

      setCountdowns(newCountdowns);
    };

    updateCountdowns();
    const interval = setInterval(updateCountdowns, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Welcome, Sarah Anderson</h1>
      </div>

      {/* Upcoming Appointments */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Upcoming Appointments</h2>
        <div className="space-y-3">
          {upcomingAppointments.map((apt) => (
            <div
              key={apt.id}
              className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-lg">{apt.doctor}</p>
                  <p className="text-base text-gray-600 mt-1">
                    {apt.date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} at {apt.time}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">{apt.specialty}</p>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="bg-blue-50 px-4 py-2.5 rounded-lg text-center">
                    <p className="text-base text-blue-600 font-semibold">{countdowns[apt.id]}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-4 py-2.5 text-base font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors">
                      Reschedule
                    </button>
                    <button className="px-4 py-2.5 text-base font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors">
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
