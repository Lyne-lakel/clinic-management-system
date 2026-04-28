"use client";

<<<<<<< HEAD
import { useState, useEffect } from "react";
import { Send, Check, CheckCheck } from "lucide-react";

const API_RECEPTIONIST = "http://localhost:5000/api/receptionist";

export default function MessagesPage() {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [chats, setChats] = useState({});
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await fetch(`${API_RECEPTIONIST}/doctors`);
        const data = await res.json();
        if (data.success && data.data && data.data.length > 0) {
          const doctorList = data.data.map(doc => ({
            id: doc._id,
            name: doc.name,
            specialty: doc.specialization || "Specialist"
          }));
          setDoctors(doctorList);
          setSelectedDoctor(doctorList[0].id);
        }
      } catch (err) {
        console.error("Failed to fetch doctors:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);
=======
import { useState } from "react";
import { Send, Check, CheckCheck } from "lucide-react";

const doctors = [
  { id: "dr1", name: "Dr. Nouar", specialty: "General Practice" },
  { id: "dr2", name: "Dr. Bensalem", specialty: "Internal Medicine" },
  { id: "dr3", name: "Dr. Khelifi", specialty: "Pediatrics" },
];

// Mock chat history per doctor
const initialChats = {
  dr1: [
    { id: 1, text: "Good morning Dr. Nouar, patient Ahmed Benali is asking about his test results.", sender: "me", time: "09:15", status: "seen" },
    { id: 2, text: "Good morning Sarah. Please ask him to come in this afternoon, I'll have everything ready.", sender: "doctor", time: "09:18", status: "seen" },
    { id: 3, text: "Will do. Should I schedule him at 2:00 PM?", sender: "me", time: "09:20", status: "seen" },
    { id: 4, text: "Yes, 2:00 PM works. Thank you.", sender: "doctor", time: "09:22", status: "seen" },
  ],
  dr2: [
    { id: 1, text: "Dr. Bensalem, Fatima Zohra called to reschedule her appointment.", sender: "me", time: "10:30", status: "seen" },
    { id: 2, text: "What time did she prefer?", sender: "doctor", time: "10:35", status: "seen" },
    { id: 3, text: "She asked for next Tuesday morning if possible.", sender: "me", time: "10:36", status: "sent" },
  ],
  dr3: [
    { id: 1, text: "Hello Dr. Khelifi, a new patient wants to book an appointment for their child.", sender: "me", time: "11:00", status: "seen" },
  ],
};

export default function MessagesPage() {
  const [selectedDoctor, setSelectedDoctor] = useState(doctors[0].id);
  const [chats, setChats] = useState(initialChats);
  const [newMessage, setNewMessage] = useState("");
>>>>>>> 71c599f5aae482780c43c836ebac595de4d47a83

  const currentDoctor = doctors.find((d) => d.id === selectedDoctor);
  const currentChat = chats[selectedDoctor] || [];

  function sendMessage() {
    if (!newMessage.trim()) return;

    const message = {
      id: Date.now(),
      text: newMessage.trim(),
      sender: "me",
      time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }),
      status: "sent",
    };

    setChats((prev) => ({
      ...prev,
      [selectedDoctor]: [...(prev[selectedDoctor] || []), message],
    }));

    setNewMessage("");
  }

  function handleKeyPress(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

<<<<<<< HEAD
  if (loading) return <div className="flex items-center justify-center p-8"><p className="text-muted-foreground">Loading messages...</p></div>;
  if (doctors.length === 0) return <div className="flex items-center justify-center p-8"><p className="text-muted-foreground">No doctors available</p></div>;

=======
>>>>>>> 71c599f5aae482780c43c836ebac595de4d47a83
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Messages</h2>
        <p className="text-muted-foreground">Chat with doctors</p>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        {/* Doctor Selector */}
        <div className="p-4 border-b border-border">
          <label className="block text-sm font-medium text-foreground mb-2">Select Doctor</label>
          <select
            value={selectedDoctor}
            onChange={(e) => setSelectedDoctor(e.target.value)}
            className="w-full px-4 py-2 border border-input rounded-lg bg-background min-h-[44px]"
          >
            {doctors.map((doc) => (
              <option key={doc.id} value={doc.id}>
                {doc.name} - {doc.specialty}
              </option>
            ))}
          </select>
        </div>

        {/* Chat Header */}
        <div className="p-4 border-b border-border bg-muted/50">
          <div className="flex items-center gap-3">
<<<<<<< HEAD
            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-[#1d4ed8] flex items-center justify-center font-bold">
=======
            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center font-bold">
>>>>>>> 71c599f5aae482780c43c836ebac595de4d47a83
              {currentDoctor?.name.charAt(0)}
            </div>
            <div>
              <p className="font-medium text-foreground">{currentDoctor?.name}</p>
              <p className="text-sm text-muted-foreground">{currentDoctor?.specialty}</p>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="h-96 overflow-y-auto p-4 space-y-4 bg-muted/30">
          {currentChat.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No messages yet. Start a conversation.
            </div>
          ) : (
            currentChat.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[70%] rounded-lg px-4 py-2 ${
                    msg.sender === "me"
<<<<<<< HEAD
                      ? "bg-[#1d4ed8] text-white"
=======
                      ? "bg-blue-600 text-white"
>>>>>>> 71c599f5aae482780c43c836ebac595de4d47a83
                      : "bg-card border border-border text-foreground"
                  }`}
                >
                  <p>{msg.text}</p>
                  <div className={`flex items-center justify-end gap-1 mt-1 text-xs ${
                    msg.sender === "me" ? "text-blue-200" : "text-muted-foreground"
                  }`}>
                    <span>{msg.time}</span>
                    {msg.sender === "me" && (
                      msg.status === "seen" ? (
                        <CheckCheck className="w-4 h-4" />
                      ) : (
                        <Check className="w-4 h-4" />
                      )
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Message Input */}
        <div className="p-4 border-t border-border">
          <div className="flex gap-3">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 border border-input rounded-lg bg-background min-h-[44px]"
            />
            <button
              onClick={sendMessage}
              disabled={!newMessage.trim()}
<<<<<<< HEAD
              className="px-4 py-2 bg-[#1d4ed8] text-white rounded-lg hover:bg-[#1d4ed8] disabled:opacity-50 min-h-[44px] flex items-center gap-2"
=======
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 min-h-[44px] flex items-center gap-2"
>>>>>>> 71c599f5aae482780c43c836ebac595de4d47a83
              aria-label="Send message"
            >
              <Send className="w-5 h-5" />
              Send
            </button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Press Enter to send
          </p>
        </div>
      </div>
    </div>
  );
}
