"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { FaDroplet } from "react-icons/fa6";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    await new Promise((r) => setTimeout(r, 800));

    if (email === "admin@fillgo.id" && password === "admin123") {
      localStorage.setItem("pengelola_auth", "true");
      router.push("/pengelola");
      router.push("/pengelola/dashboard")
    } else {
      setError("Email atau password salah.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#EFF6FF] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-sm p-10 flex flex-col items-center">

        {/* Logo */}
        <div className="w-16 h-16 rounded-2xl bg-[#1447E6] flex items-center justify-center mb-6">
          <FaDroplet size={28} color="white" />
        </div>

        {/* Heading */}
        <h1 className="text-2xl font-bold text-gray-900 mb-1">FillGo Station</h1>
        <p className="text-sm text-gray-400 mb-8">Smart Water Monitoring System</p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full space-y-4">

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1.5">
              Email
            </label>
            <div className="flex items-center gap-3 bg-gray-100 rounded-xl px-4 py-3">
              <FiMail size={18} className="text-gray-400 shrink-0" />
              <input
                type="text"
                placeholder="Masukkan email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-transparent w-full text-sm text-gray-700 outline-none placeholder:text-gray-400"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1.5">
              Password
            </label>
            <div className="flex items-center gap-3 bg-gray-100 rounded-xl px-4 py-3">
              <FiLock size={18} className="text-gray-400 shrink-0" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Masukkan password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-transparent w-full text-sm text-gray-700 outline-none placeholder:text-gray-400"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="text-gray-400 hover:text-gray-600 transition-colors shrink-0"
              >
                {showPassword ? <FiEye size={18} /> : <FiEyeOff size={18} />}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <p className="text-sm text-red-500 text-center">{error}</p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1447E6] hover:bg-[#1040d0] disabled:opacity-60 transition-colors text-white font-semibold py-3.5 rounded-xl text-sm mt-2"
          >
            {loading ? "Memverifikasi..." : "Sign In"}
          </button>
        </form>

        {/* Hint kredensial dev */}
        <p className="mt-6 text-xs text-gray-300 text-center">
          Demo: admin@fillgo.id / admin123
        </p>
      </div>
    </div>
  );
}