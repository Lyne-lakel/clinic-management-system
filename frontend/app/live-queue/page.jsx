"use client";

/**
 * =============================================================================
 * LIVE QUEUE SCREEN — app/live-queue/page.jsx
 * =============================================================================
 *
 * STUDENT DEFENSE NOTE:
 * This is the public-facing "TV Screen" designed to be displayed in the waiting room.
 * It automatically fetches data every 10 seconds from our specialized API:
 *   GET /api/appointments/queue
 *
 * Requirements fulfilled:
 * 1. Big Format Display: Highlights the current patient being called.
 * 2. Sound Effect: Plays the existing `success.mp3` when the current patient changes.
 * 3. Next Patients List: Lists upcoming patients with their token #, name, time, status.
 * 4. Empty Zone Handling: When the doctor is on rest (no current patient), the big
 *    empty zone gracefully converts into a Health Tips display with beautiful UI.
 * 5. Status Mapping: Handles the 'Absent', 'Arrived', and 'In Progress' states.
 * =============================================================================
 */

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Clock, CheckCircle, HeartPulse, Stethoscope } from 'lucide-react';

export default function LiveQueueScreen() {
  const [queueData, setQueueData] = useState({
    currentCall: null,
    upcoming: [],
    healthTips: []
  });
  const [loading, setLoading] = useState(true);
  const previousCallId = useRef(null);

  // Helper to map database statuses to user-friendly waiting room statuses
  const getDisplayStatus = (dbStatus) => {
    switch (dbStatus) {
      case 'Confirmed': return 'Arrived';
      case 'Pending': return 'In Progress';
      case 'No Show': return 'Absent';
      default: return dbStatus; // Keep as is if it matches
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Arrived': return 'text-blue-600 bg-blue-50';
      case 'In Progress': return 'text-amber-600 bg-amber-50';
      case 'Absent': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const fetchQueue = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/appointments/queue');
      const data = await res.json();

      if (data.success) {
        setQueueData(data.data);

        // Check if the current call has CHANGED to play the sound effect
        if (data.data.currentCall && data.data.currentCall._id !== previousCallId.current) {
          const audio = new Audio('/sounds/success.mp3');
          audio.play().catch(e => console.log("Audio play prevented by browser interaction policy:", e));
          previousCallId.current = data.data.currentCall._id;
        } else if (!data.data.currentCall) {
          // If no one is called, reset the tracker
          previousCallId.current = null;
        }
      }
    } catch (error) {
      console.error("Failed to fetch queue data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch immediately on component mount
    fetchQueue();

    // Set up auto-refresh every 10 seconds to keep the TV screen live
    const intervalId = setInterval(fetchQueue, 10000);

    // Cleanup interval on unmount
    return () => clearInterval(intervalId);
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <p className="text-3xl text-blue-800 animate-pulse font-bold">Loading Live Queue...</p>
      </div>
    );
  }

  const { currentCall, upcoming, healthTips } = queueData;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* ─── HEADER ───────────────────────────────────────────────────────── */}
      <header className="bg-[#1d4ed8] text-white p-6 shadow-md flex justify-between items-center">
        <div>
          <h1 className="text-5xl font-bold tracking-tight">CityMed Clinic</h1>
          <p className="text-blue-200 mt-2 text-2xl">Live Waiting Room Queue</p>
        </div>
        <div className="text-right">
          <p className="text-4xl font-medium">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
          <p className="text-blue-200 text-xl">{new Date().toLocaleDateString()}</p>
        </div>
      </header>

      {/* ─── MAIN CONTENT ─────────────────────────────────────────────────── */}
      <main className="flex-1 p-8 grid grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Current Call OR Health Tips */}
        <div className="col-span-12 lg:col-span-7 flex flex-col">
          {currentCall ? (
            // --- CURRENTLY CALLED PATIENT ---
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden flex-1 border-4 border-blue-600 flex flex-col justify-center items-center text-center p-12">
              <div className="bg-blue-100 text-blue-800 px-8 py-3 rounded-full text-3xl font-bold mb-8 uppercase tracking-widest shadow-sm animate-pulse">
                Now Calling
              </div>
              
              <h2 className="text-9xl font-black text-gray-900 mb-6 tracking-tight">
                #{currentCall._id.toString().slice(-3).toUpperCase()}
              </h2>
              
              <p className="text-7xl font-bold text-blue-700 mb-16">
                {currentCall.patientName}
              </p>
              
              <div className="bg-slate-100 w-full p-8 rounded-2xl flex items-center justify-center gap-6">
                <Stethoscope className="w-16 h-16 text-blue-600" />
                <div className="text-left">
                  <p className="text-2xl text-gray-500 font-medium">Please proceed to</p>
                  <p className="text-4xl font-bold text-gray-800">
                    Dr. {currentCall.doctorName}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            // --- HEALTH TIPS (Displayed when the doctor is on break/no patients called) ---
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl shadow-lg flex-1 border border-blue-100 p-10 flex flex-col">
              <div className="flex items-center gap-4 mb-10">
                <HeartPulse className="w-12 h-12 text-rose-500" />
                <h2 className="text-5xl font-bold text-blue-900 tracking-tight">Health & Wellness Tips</h2>
              </div>
              
              <div className="grid gap-8 flex-1">
                {healthTips.map((tip) => (
                  <Card key={tip.id} className="border-none shadow-md bg-white/80 backdrop-blur">
                    <CardContent className="p-8 flex items-center gap-8">
                      <div className="text-7xl bg-blue-100 p-6 rounded-3xl shadow-inner">{tip.image}</div>
                      <div>
                        <h3 className="text-3xl font-bold text-gray-800 mb-4">{tip.title}</h3>
                        <p className="text-2xl text-gray-600 leading-relaxed">{tip.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: UPCOMING QUEUE */}
        <div className="col-span-12 lg:col-span-5 flex flex-col">
          <div className="bg-white rounded-3xl shadow-lg overflow-hidden flex-1 border border-slate-200 flex flex-col">
            <div className="bg-slate-800 text-white p-6 shadow-md">
              <h2 className="text-3xl font-bold flex items-center gap-3">
                <Clock className="w-8 h-8" />
                Next Patients
              </h2>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 bg-slate-50">
              {upcoming.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400">
                  <CheckCircle className="w-20 h-20 mb-6 text-emerald-400 opacity-50" />
                  <p className="text-3xl font-medium">No more patients waiting</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {upcoming.map((appt, index) => {
                    // Extract HH:MM from Date string
                    const timeString = new Date(appt.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    // Map internal DB status to requested display statuses
                    const displayStatus = getDisplayStatus(appt.status);
                    const colorClass = getStatusColor(displayStatus);

                    return (
                      <div 
                        key={appt._id} 
                        className={`flex items-center p-6 rounded-2xl border bg-white ${index === 0 ? 'border-blue-300 shadow-md ring-2 ring-blue-100' : 'border-slate-200 shadow-sm'}`}
                      >
                        {/* Token Number */}
                        <div className="w-24 text-center border-r-2 border-gray-100 pr-6 mr-6 shrink-0">
                          <p className="text-base text-gray-400 uppercase font-bold mb-1">Token</p>
                          <p className="text-3xl font-black text-gray-800">
                            #{appt._id.toString().slice(-3).toUpperCase()}
                          </p>
                        </div>
                        
                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <p className="text-3xl font-bold text-gray-900 truncate mb-2">
                            {appt.patientName}
                          </p>
                          <div className="flex items-center gap-6 text-lg font-medium">
                            <span className="flex items-center gap-2 text-gray-500 bg-gray-100 px-3 py-1 rounded-lg">
                              <Clock className="w-5 h-5" /> {timeString}
                            </span>
                            <span className={`px-4 py-1.5 rounded-full text-base font-bold uppercase tracking-wider ${colorClass}`}>
                              {displayStatus}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
