import React, { useState } from "react";
import { Shield, Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";

export default function AdminLogin({ onLoginSuccess, onCancel }) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === "guesthouseadmin") {
      onLoginSuccess();
    } else {
      setIsShaking(true);
      alert("Incorrect password!");
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white relative">
      
      {/* Back Button */}
      <button
        onClick={onCancel}
        className="absolute top-6 left-6 flex items-center gap-2 px-3 py-1 bg-slate-800/70 backdrop-blur rounded-lg hover:bg-slate-700 transition"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      {/* Login Card */}
      <div className={`w-full max-w-md p-8 rounded-2xl bg-slate-950/70 backdrop-blur border border-blue-500/40 ${isShaking ? 'animate-shake' : ''}`}>
        
        {/* Logo/Icon */}
        <div className="flex justify-center mb-6">
          <Shield className="w-12 h-12 text-blue-400" />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-center text-blue-400 mb-4">
          Admin Access
        </h2>
        <p className="text-center text-slate-400 mb-6">
          Enter your credentials to continue
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <label className="block text-sm text-blue-400 mb-1 flex items-center gap-2">
              <Lock className="w-4 h-4" /> Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-lg border border-blue-500/40 bg-slate-900 text-white placeholder-slate-500 focus:border-blue-400 focus:outline-none transition"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 font-semibold transition"
          >
            Login
          </button>
        </form>

        {/* Security Note */}
        <p className="mt-6 text-center text-slate-400 text-xs">
          You the Admin lil bro? xD
        </p>
      </div>

      {/* Minimal shake animation */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}
