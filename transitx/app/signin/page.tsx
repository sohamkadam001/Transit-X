"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TrainFront, User, Lock, Eye, EyeOff, LogIn, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SigninPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  useEffect(() => setMounted(true), []);

  const handleSignin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch("/api/signin", {
        method: "POST",
        body: JSON.stringify(formData),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (res.ok) {
        if (data.token) localStorage.setItem("token", data.token);
        router.push("/dashboard");
      } else {
        alert(data.msg || data.message || "Login Failed");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 flex flex-col items-center justify-center p-6 selection:bg-amber-500/30">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[440px]"
      >
        {/* BRANDING - MATCHING SIGNUP */}
        <div className="flex flex-col items-center mb-10">
          <div className="flex items-center gap-3 mb-3">
             <div className="w-12 h-12 bg-[#f2a238] rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20">
                <TrainFront className="text-white w-7 h-7" />
             </div>
             <span className="text-3xl font-black tracking-tighter dark:text-white">TransitX</span>
          </div>
          <p className="text-gray-500 dark:text-gray-400 font-medium">Welcome back, Commuter</p>
        </div>

        {/* SIGNIN CARD */}
        <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-10 rounded-[40px] shadow-2xl shadow-black/5">
          <form onSubmit={handleSignin} className="space-y-6">
            
            {/* USERNAME */}
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-[0.15em] text-gray-400 ml-1">Username</label>
              <div className="relative group">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-[#f2a238] transition-colors" />
                <input
                  required
                  type="text"
                  placeholder="Username"
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full bg-[#f8f9fc] dark:bg-zinc-950 border border-gray-100 dark:border-zinc-800 rounded-2xl py-4 pl-14 pr-5 text-sm focus:outline-none focus:border-[#f2a238] transition-all dark:text-white placeholder:text-gray-400"
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                 <label className="text-[11px] font-black uppercase tracking-[0.15em] text-gray-400">Password</label>
                 <Link href="#" className="text-[10px] font-black text-[#f2a238] uppercase tracking-wider hover:opacity-80">Forgot?</Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-[#f2a238] transition-colors" />
                <input
                  required
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-[#f8f9fc] dark:bg-zinc-950 border border-gray-100 dark:border-zinc-800 rounded-2xl py-4 pl-14 pr-14 text-sm focus:outline-none focus:border-[#f2a238] transition-all dark:text-white placeholder:text-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* SIGNIN BUTTON - MATCHING SIGNUP ORANGE */}
            <button
              disabled={isLoading}
              type="submit"
              className="w-full bg-[#f2a238] hover:bg-[#e08f20] text-white font-bold py-4 rounded-2xl shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Sign in
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* FOOTER */}
          <div className="mt-10 pt-8 border-t border-gray-50 dark:border-zinc-800 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
              New to TransitX?{" "}
              <Link href="/signup" className="text-[#f2a238] font-bold hover:underline">
                Create an account
              </Link>
            </p>
          </div>
        </div>

        {/* SECURITY BADGES */}
        <div className="mt-10 flex justify-center items-center gap-6 text-[10px] uppercase tracking-[0.15em] font-black text-gray-400">
          <div className="flex items-center gap-2">
            <div className="w-1 h-1 bg-[#f2a238] rounded-full" />
            End-to-end encrypted
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1 h-1 bg-[#f2a238] rounded-full" />
            Secure QR Gen
          </div>
        </div>
      </motion.div>
    </div>
  );
}