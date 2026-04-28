'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function OldPatientForm() {
  const router = useRouter();
  const [fileNumber, setFileNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!fileNumber.trim()) {
      setError('Please enter your file number');
      return;
    }

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      // Mock validation - file numbers should be numeric and at least 3 digits
      if (/^\d{3,}$/.test(fileNumber)) {
        router.push('/dashboard');
      } else {
        setError('Invalid file number. Please check and try again.');
        setLoading(false);
      }
    }, 500);
  };

  return (
    <form onSubmit={handleLogin} className="space-y-6">
      <div>
        <label htmlFor="fileNumber" className="block text-sm font-medium text-gray-700 mb-2">
          File Number
        </label>
        <input
          id="fileNumber"
          type="text"
          value={fileNumber}
          onChange={(e) => {
            setFileNumber(e.target.value);
            setError('');
          }}
          placeholder="Enter your file number"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1d4ed8] focus:border-transparent transition-all"
        />
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-[#1d4ed8] to-[#1d4ed8] text-white font-semibold py-3 rounded-lg hover:from-[#1d4ed8] hover:to-[#1d4ed8] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading && (
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        )}
        {loading ? 'Logging in...' : 'Login'}
      </button>

      <p className="text-xs text-center text-gray-500">
        Your file number can be found on your appointment card or previous visit documentation.
      </p>
    </form>
  );
}
