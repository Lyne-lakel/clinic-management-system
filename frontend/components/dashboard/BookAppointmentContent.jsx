'use client';

import { useState } from 'react';

export default function BookAppointmentContent({ onNotify }) {
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [notes, setNotes] = useState('');
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const doctors = [
    { id: 1, name: 'Dr. Sarah Johnson', specialty: 'General Practitioner' },
    { id: 2, name: 'Dr. Michael Chen', specialty: 'Cardiologist' },
  ];

  // Mock availability data - dates that are unavailable for each doctor
  const unavailableDates = {
    'Dr. Sarah Johnson': [5, 12, 19, 26],
    'Dr. Michael Chen': [3, 10, 17, 24],
  };

  // Mock time slots available for each doctor on specific dates
  const getAvailableTimeSlots = (doctor, date) => {
    // Return different time slots based on doctor and day
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) return []; // No slots on weekends
    
    const allSlots = ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM'];
    
    // Mock: different doctors have different available slots
    if (doctor === 'Dr. Sarah Johnson') {
      return allSlots.filter((_, i) => i % 2 === 0); // Every other slot
    } else if (doctor === 'Dr. Michael Chen') {
      return allSlots.filter((_, i) => i % 2 !== 0); // Every other slot (different ones)
    }
    return allSlots;
  };

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const isDateDisabled = (day) => {
    if (!selectedDoctor) return true;
    
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Disable past dates
    if (date < today) return true;
    
    // Disable dates based on doctor's availability
    const unavailable = unavailableDates[selectedDoctor] || [];
    return unavailable.includes(day);
  };

  const handleDateSelect = (day) => {
    if (!isDateDisabled(day)) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      setSelectedDate(date);
      setSelectedTime(''); // Reset time when date changes
    }
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} />);
    }

    // Days of month
    for (let day = 1; day <= daysInMonth; day++) {
      const isDisabled = isDateDisabled(day);
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();

      days.push(
        <button
          key={day}
          type="button"
          onClick={() => handleDateSelect(day)}
          disabled={isDisabled}
          className={`p-2 text-sm font-medium rounded-lg transition-all ${
            isSelected
              ? 'bg-blue-600 text-white border-2 border-blue-600'
              : isDisabled
              ? 'text-gray-300 bg-gray-50 cursor-not-allowed'
              : 'text-gray-700 border-2 border-gray-200 hover:border-gray-300 bg-white'
          }`}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  const timeSlots = selectedDate && selectedDoctor ? getAvailableTimeSlots(selectedDoctor, selectedDate) : [];

  const handleBooking = (e) => {
    e.preventDefault();
    if (selectedDoctor && selectedDate && selectedTime) {
      const dateStr = selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
      if (onNotify) onNotify('Appointment confirmed successfully');
      setSelectedDoctor('');
      setSelectedDate(null);
      setSelectedTime('');
      setNotes('');
    }
  };

  const monthYear = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Book an Appointment</h1>
      </div>

      {/* Booking Form */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <form onSubmit={handleBooking} className="space-y-6">
          {/* Doctor Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Select Doctor
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {doctors.map((doctor) => (
                <button
                  key={doctor.id}
                  type="button"
                  onClick={() => setSelectedDoctor(doctor.name)}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    selectedDoctor === doctor.name
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <p className="font-semibold text-gray-900">{doctor.name}</p>
                  <p className="text-sm text-gray-600">{doctor.specialty}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Calendar Date Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Select Date
            </label>
            {selectedDoctor ? (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                {/* Month Navigation */}
                <div className="flex items-center justify-between mb-4">
                  <button
                    type="button"
                    onClick={handlePrevMonth}
                    className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <h3 className="text-sm font-semibold text-gray-900">{monthYear}</h3>
                  <button
                    type="button"
                    onClick={handleNextMonth}
                    className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>

                {/* Day Headers */}
                <div className="grid grid-cols-7 gap-2 mb-2">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <div key={day} className="text-center text-xs font-semibold text-gray-600">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Days */}
                <div className="grid grid-cols-7 gap-2">
                  {renderCalendar()}
                </div>

                {/* Selected Date Display */}
                {selectedDate && (
                  <div className="mt-4 pt-4 border-t border-gray-300">
                    <p className="text-sm text-gray-600">
                      Selected: <span className="font-semibold text-gray-900">{selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-600">Please select a doctor first</p>
              </div>
            )}
          </div>

          {/* Time Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Select Time
            </label>
            {selectedDate ? (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {timeSlots.length > 0 ? (
                  timeSlots.map((time) => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => setSelectedTime(time)}
                      className={`p-3 rounded-lg font-medium transition-all border-2 text-sm ${
                        selectedTime === time
                          ? 'border-blue-600 bg-blue-50 text-blue-700'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {time}
                    </button>
                  ))
                ) : (
                  <div className="col-span-full text-center py-4">
                    <p className="text-sm text-gray-600">No available time slots for this date</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-600">Please select a date first</p>
              </div>
            )}
          </div>

          {/* Additional Notes */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Additional Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Please provide any additional information or reason for your visit that may help us serve you better..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none h-24"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
            >
              Confirm Appointment
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedDoctor('');
                setSelectedDate(null);
                setSelectedTime('');
                setNotes('');
                setCurrentMonth(new Date());
                if (onNotify) onNotify('Form reset');
              }}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-3 rounded-lg transition-colors"
            >
              Reset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
