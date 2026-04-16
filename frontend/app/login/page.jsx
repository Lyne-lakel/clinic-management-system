/**
 * =============================================================================
 * LOGIN PAGE
 * =============================================================================
 * 
 * PURPOSE:
 * Entry point for staff authentication. Users enter their email and password
 * to access the clinic management system.
 * 
 * AUTHENTICATION FLOW:
 * 1. User enters email and password
 * 2. System validates against mock user database
 * 3. If single role: redirect directly to that role's dashboard
 * 4. If multiple roles: redirect to role selection page
 * 
 * =============================================================================
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

// -----------------------------------------------------------------------------
// MOCK USER DATABASE
// -----------------------------------------------------------------------------
const users = [
  { email: "admin@clinic.com", password: "admin123", roles: ["admin"] },
  { email: "doctor@clinic.com", password: "doctor123", roles: ["doctor"] },
  { email: "reception@clinic.com", password: "recep123", roles: ["receptionist"] },
  { email: "sarah@clinic.com", password: "multi123", roles: ["admin", "doctor"] },
  { email: "karim@clinic.com", password: "multi123", roles: ["doctor", "receptionist"] }
];

// -----------------------------------------------------------------------------
// ROLE TO ROUTE MAPPING
// -----------------------------------------------------------------------------
const roleRoutes = {
  admin: "/admin/dashboard",
  doctor: "/doctor/dashboard",
  receptionist: "/receptionist/dashboard"
};

export default function LoginPage() {
  const router = useRouter();
  
  // ---------------------------------------------------------------------------
  // STATE MANAGEMENT
  // ---------------------------------------------------------------------------
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ---------------------------------------------------------------------------
  // FORM SUBMISSION HANDLER
  // ---------------------------------------------------------------------------
  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Simulate network delay
    setTimeout(() => {
      const user = users.find(
        (u) => u.email === email && u.password === password
      );

      if (!user) {
        setError("Invalid email or password");
        setLoading(false);
        return;
      }

      if (user.roles.length === 1) {
        router.push(roleRoutes[user.roles[0]]);
      } else {
        router.push("/select-role?email=" + encodeURIComponent(email));
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-emerald-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        
        {/* =====================================================================
            LOGIN FORM CARD
            ===================================================================== */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-xl font-semibold text-gray-900 text-center mb-6">
            Staff Login
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@clinic.com"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Forgot Password Link */}
          <div className="mt-6 text-center">
            <a
              href="#"
              className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
            >
              Forgot your password?
            </a>
          </div>
        </div>

        {/* =====================================================================
            DEMO CREDENTIALS BOX
            ===================================================================== */}
        <div className="mt-6 bg-white/60 rounded-xl p-4">
          <p className="text-xs text-gray-500 text-center mb-2 font-medium">
            Demo Credentials
          </p>
          <div className="grid grid-cols-1 gap-1 text-xs text-gray-600">
            <div className="flex justify-between">
              <span>Admin:</span>
              <span className="font-mono">admin@clinic.com / admin123</span>
            </div>
            <div className="flex justify-between">
              <span>Doctor:</span>
              <span className="font-mono">doctor@clinic.com / doctor123</span>
            </div>
            <div className="flex justify-between">
              <span>Reception:</span>
              <span className="font-mono">reception@clinic.com / recep123</span>
            </div>
            <div className="flex justify-between">
              <span>Multi-role:</span>
              <span className="font-mono">sarah@clinic.com / multi123</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
