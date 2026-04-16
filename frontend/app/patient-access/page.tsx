"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check, Loader2 } from "lucide-react";

type PatientType = "old" | "new";
type RequestStatus = "idle" | "pending" | "confirmed";

const clinic = {
  id: 1,
  name: "Centre Medical Alger",
  slug: "centre-medical-alger",
};

const doctors = [
  { id: 1, name: "Dr. Sarah Johnson", specialties: ["General Practice", "Cardiology"] },
  { id: 2, name: "Dr. Ahmed Mohammed", specialties: ["General Practice", "Internal Medicine"] },
];

const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 9; hour < 17; hour++) {
    for (let minute = 0; minute < 60; minute += 40) {
      slots.push(`${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`);
    }
  }
  return slots;
};

const bookedSlots = ["09:00", "09:40", "14:00", "14:40", "15:20"];

const getAvailableDates = () => {
  const dates = [];
  const today = new Date();
  for (let i = 1; i <= 14; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    const dayOfWeek = date.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      dates.push({
        date: date.toISOString().split("T")[0],
        label: date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }),
      });
    }
  }
  return dates;
};

export default function PatientAccessPage() {
  const router = useRouter();
  const [patientType, setPatientType] = useState<PatientType>("new");
  const [requestStatus, setRequestStatus] = useState<RequestStatus>("idle");
  const [isClinicOpen] = useState(true);
  const [fileNumber, setFileNumber] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    notes: "",
  });
  const [confirmationData, setConfirmationData] = useState<{
    fileNumber: string;
    message: string;
  } | null>(null);

  const availableDates = getAvailableDates();
  const timeSlots = generateTimeSlots();

  const handleOldPatientLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileNumber.trim()) return;

    setRequestStatus("pending");
    setTimeout(() => {
      setRequestStatus("confirmed");
      setConfirmationData({
        fileNumber: fileNumber.toUpperCase(),
        message: "Your medical records have been loaded. Redirecting to dashboard...",
      });
      setTimeout(() => router.push("/dashboard"), 2000);
    }, 1500);
  };

  const handleNewPatientSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoctor || !selectedDate || !selectedTime || !formData.fullName || !formData.phone || !formData.email) {
      return;
    }

    setRequestStatus("pending");
    setTimeout(() => {
      if (!isClinicOpen) {
        setRequestStatus("pending");
        setConfirmationData({
          fileNumber: "",
          message: "Clinic is currently closed. Your request will be processed later.",
        });
      } else {
        const generatedFileNumber = `MCP${Date.now()}`.toUpperCase();
        setRequestStatus("confirmed");
        setConfirmationData({
          fileNumber: generatedFileNumber,
          message: `Your appointment is confirmed. Your file number is ${generatedFileNumber}. Check your email for details.`,
        });
        setTimeout(() => router.push("/dashboard"), 2500);
      }
    }, 1500);
  };

  if (requestStatus === "confirmed" && confirmationData) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center">
        <div className="w-full max-w-md px-4">
          <div className="bg-card rounded-2xl border border-border p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-6">
              <Check className="h-8 w-8 text-secondary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-4">Success!</h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              {confirmationData.message}
            </p>
            {confirmationData.fileNumber && (
              <div className="bg-muted rounded-lg p-4 mb-6">
                <p className="text-sm text-muted-foreground mb-1">File Number</p>
                <p className="text-lg font-mono font-bold text-foreground">{confirmationData.fileNumber}</p>
              </div>
            )}
            {requestStatus === "pending" && (
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Redirecting...</span>
              </div>
            )}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center">
            <Button variant="ghost" asChild>
              <Link href="/" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-12 lg:py-16">
        <div className="max-w-2xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              Access Your Appointments
            </h1>
            <p className="text-lg text-muted-foreground">
              Access your appointments and medical records
            </p>
          </div>

          {/* Toggle */}
          <div className="flex gap-4 mb-8">
            <button
              onClick={() => {
                setPatientType("old");
                setRequestStatus("idle");
                setConfirmationData(null);
              }}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                patientType === "old"
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              Old Patient
            </button>
            <button
              onClick={() => {
                setPatientType("new");
                setRequestStatus("idle");
                setConfirmationData(null);
              }}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                patientType === "new"
                  ? "bg-secondary text-secondary-foreground shadow-lg"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              New Patient
            </button>
          </div>

          {/* Forms */}
          <div className="bg-card rounded-2xl border border-border p-8">
            {patientType === "old" ? (
              <form onSubmit={handleOldPatientLogin} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    File Number
                  </label>
                  <input
                    type="text"
                    value={fileNumber}
                    onChange={(e) => setFileNumber(e.target.value)}
                    placeholder="Enter your file number"
                    className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    disabled={requestStatus === "pending"}
                  />
                </div>
                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                  disabled={requestStatus === "pending" || !fileNumber.trim()}
                >
                  {requestStatus === "pending" ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Logging in...
                    </>
                  ) : (
                    "Login"
                  )}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleNewPatientSubmit} className="space-y-6">
                {/* Clinic - Static */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Clinic
                  </label>
                  <input
                    type="text"
                    value={clinic.name}
                    disabled
                    className="w-full px-4 py-2.5 rounded-lg border border-border bg-muted text-foreground focus:outline-none"
                  />
                </div>

                {/* Doctor */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Select Doctor *
                  </label>
                  <select
                    value={selectedDoctor}
                    onChange={(e) => {
                      setSelectedDoctor(e.target.value);
                      setSelectedDate("");
                      setSelectedTime("");
                    }}
                    className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-secondary/50"
                    disabled={requestStatus === "pending"}
                  >
                    <option value="">Choose a doctor...</option>
                    {doctors.map((doctor) => (
                      <option key={doctor.id} value={doctor.id}>
                        {doctor.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date */}
                {selectedDoctor && (
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-3">
                      Select Date *
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {availableDates.map((d) => (
                        <button
                          key={d.date}
                          onClick={() => {
                            setSelectedDate(d.date);
                            setSelectedTime("");
                          }}
                          disabled={requestStatus === "pending"}
                          className={`py-2.5 px-2 rounded-lg text-sm font-medium transition-all ${
                            selectedDate === d.date
                              ? "bg-secondary text-secondary-foreground"
                              : "bg-muted text-muted-foreground hover:bg-muted/80"
                          }`}
                        >
                          {d.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Time Slot */}
                {selectedDate && (
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-3">
                      Select Time Slot *
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {timeSlots.map((slot) => (
                        <button
                          key={slot}
                          onClick={() => setSelectedTime(slot)}
                          disabled={bookedSlots.includes(slot) || requestStatus === "pending"}
                          className={`py-2.5 px-2 rounded-lg text-sm font-medium transition-all ${
                            selectedTime === slot
                              ? "bg-secondary text-secondary-foreground"
                              : bookedSlots.includes(slot)
                              ? "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
                              : "bg-muted text-muted-foreground hover:bg-muted/80"
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Patient Info */}
                <div className="space-y-4 pt-4 border-t border-border">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="Your full name"
                      className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/50"
                      disabled={requestStatus === "pending"}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+213 XX XX XX XX"
                      className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/50"
                      disabled={requestStatus === "pending"}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="your@email.com"
                      className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/50"
                      disabled={requestStatus === "pending"}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Additional Notes (Optional)
                    </label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Any additional information for the doctor"
                      rows={3}
                      className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/50"
                      disabled={requestStatus === "pending"}
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold"
                  disabled={
                    requestStatus === "pending" ||
                    !selectedDoctor ||
                    !selectedDate ||
                    !selectedTime ||
                    !formData.fullName ||
                    !formData.phone ||
                    !formData.email
                  }
                >
                  {requestStatus === "pending" ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Processing...
                    </>
                  ) : (
                    "Request Appointment"
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
