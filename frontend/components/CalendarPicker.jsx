'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function CalendarPicker({ selectedDate, onSelectDate, availableDates }) {
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 0)); // January 2025

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const handlePrevMonth = () => {
    const today = new Date();
    const prevMonth = new Date(currentMonth);
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    if (prevMonth >= today) {
      setCurrentMonth(prevMonth);
    }
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const formatDateString = (year, month, day) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const isDateAvailable = (day) => {
    const dateString = formatDateString(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return availableDates.includes(dateString);
  };

  const isDateInPast = (day) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const compareDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return compareDate < today;
  };

  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);
  const days = [];

  // Empty cells for days before month starts
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  // Days of the month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const monthName = currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        Select Date
      </label>

      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        {/* Month/Year Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            type="button"
            onClick={handlePrevMonth}
            className="p-1 hover:bg-gray-200 rounded transition-colors"
            aria-label="Previous month"
          >
            <ChevronLeft size={20} className="text-gray-600" />
          </button>
          <h3 className="font-semibold text-gray-900">{monthName}</h3>
          <button
            type="button"
            onClick={handleNextMonth}
            className="p-1 hover:bg-gray-200 rounded transition-colors"
            aria-label="Next month"
          >
            <ChevronRight size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Weekday Headers */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-center text-xs font-semibold text-gray-600 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-2">
          {days.map((day, index) => {
            const isPast = day && isDateInPast(day);
            const isAvailable = day && isDateAvailable(day);
            const dateString = day ? formatDateString(currentMonth.getFullYear(), currentMonth.getMonth(), day) : '';
            const isSelected = dateString === selectedDate;

            return (
              <button
                key={index}
                type="button"
                onClick={() => isAvailable && !isPast && onSelectDate(dateString)}
                disabled={!day || isPast || !isAvailable}
                className={`p-2 rounded text-sm font-medium transition-all ${
                  !day
                    ? 'invisible'
                    : isPast
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : !isAvailable
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : isSelected
                    ? 'bg-gradient-to-br from-green-500 to-green-600 text-white'
                    : 'bg-white border border-gray-300 text-gray-900 hover:bg-green-50 hover:border-green-300 cursor-pointer'
                }`}
              >
                {day}
              </button>
            );
          })}
        </div>

        <p className="text-xs text-gray-600 mt-4">
          ✓ Green dates are available for booking
        </p>
      </div>
    </div>
  );
}
