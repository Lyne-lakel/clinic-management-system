'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import CalendarPicker from './CalendarPicker';
import TimeSlotSelector from './TimeSlotSelector';

// Mock data for doctors and time slots
const MOCK_DOCTORS = [
  { id: 1, name: 'Dr. Sarah Johnson', specialty: 'General Practice' },
  { id: 2, name: 'Dr. Michael Chen', specialty: 'Cardiology' },
];

const MOCK_TIME_SLOTS = {
  '1': {
    '2025-01-15': ['09:00', '09:30', '10:00', '11:00', '14:00', '15:30'],
    '2025-01-16': ['10:00', '10:30', '13:00', '14:00', '15:00', '16:00'],
    '2025-01-17': ['09:00', '10:00', '11:30', '14:00', '14:30', '15:00'],
  },
  '2': {
    '2025-01-15': ['08:30', '09:00', '10:30', '13:00', '14:00'],
    '2025-01-16': ['09:00', '09:30', '11:00', '13:30', '15:00', '16:30'],
    '2025-01-17': ['10:00', '11:00', '14:00', '15:00', '16:00'],
  },
};

export default function NewPatientForm() {
  const router = useRouter();
  const [clinic] = useState('Central Clinic');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const availableTimeSlots = selectedDoctor && selectedDate 
    ? (MOCK_TIME_SLOTS[selectedDoctor]?.[selectedDate] || [])
    : [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!selectedDoctor || !selectedDate || !selectedTime) {
      setError('Please complete all fields');
      return;
    }

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      router.push('/dashboard');
    }, 500);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Clinic Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Clinic
        </label>
        <div className="px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-700">
          {clinic}
        </div>
        <p className="text-xs text-gray-500 mt-1">Currently available clinic</p>
      </div>

      {/* Doctor Selection */}
      <div>
        <label htmlFor="doctor" className="block text-sm font-medium text-gray-700 mb-2">
          Select Doctor
        </label>
        <select
          id="doctor"
          value={selectedDoctor}
          onChange={(e) => {
            setSelectedDoctor(e.target.value);
            setSelectedDate('');
            setSelectedTime('');
          }}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-white"
        >
          <option value="">Choose a doctor...</option>
          {MOCK_DOCTORS.map((doctor) => (
            <option key={doctor.id} value={doctor.id}>
              {doctor.name} • {doctor.specialty}
            </option>
          ))}
        </select>
      </div>

      {/* Calendar Picker - Only show after doctor selection */}
      {selectedDoctor && (
        <CalendarPicker 
          selectedDate={selectedDate} 
          onSelectDate={setSelectedDate}
          availableDates={Object.keys(MOCK_TIME_SLOTS[selectedDoctor] || {})}
        />
      )}

      {/* Time Slot Selector - Only show after date selection */}
      {selectedDate && (
        <TimeSlotSelector
          selectedTime={selectedTime}
          onSelectTime={setSelectedTime}
          timeSlots={availableTimeSlots}
        />
      )}

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={!selectedDoctor || !selectedDate || !selectedTime || loading}
        className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold py-3 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading && (
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        )}
        {loading ? 'Requesting...' : 'Request Appointment'}
      </button>

      <p className="text-xs text-center text-gray-500">
        Your appointment will be confirmed within 24 hours via email.
      </p>
    </form>
  );
}
