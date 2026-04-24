"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrainFront, User, Lock, Eye, EyeOff, Loader2, ArrowRight, AlertCircle, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SigninPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  useEffect(() => setMounted(true), []);

  const handleSignin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch("/api/signin", {
        method: "POST",
        body: JSON.stringify(formData),
        headers: { "Content-Type": "application/json" },
      });
      
      const data = await res.json();
      
      if (res.ok) {
        if (data.token) localStorage.setItem("token", data.token);
        setSuccess(`Welcome back, ${formData.username}`);
        setTimeout(() => {
          router.push("/dashboard");
        }, 1000);
      } else {
        setError(data.msg || data.message || "Invalid username or password");
      }
    } catch (err) {
      setError("Unable to connect to the server.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 flex flex-col items-center justify-center p-6 selection:bg-amber-500/30 relative">
      <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 group z-50">
        <div className="w-9 h-9 bg-[#f2a238] rounded-lg flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
          <TrainFront className="text-white w-5 h-5" />
        </div>
        <span className="text-xl font-bold tracking-tight dark:text-white">TransitX</span>
      </Link>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-[440px]">
        <div className="flex flex-col items-center mb-10">
          <h1 className="text-2xl font-bold tracking-tight dark:text-white mb-2">Welcome Back</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Sign in to your commuter account</p>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-10 rounded-[40px] shadow-2xl shadow-black/5">
          <form onSubmit={handleSignin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-[0.15em] text-gray-400 ml-1">Username</label>
              <div className="relative group">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-[#f2a238] transition-colors" />
                <input required type="text" placeholder="Username" 
                  onChange={(e) => { setFormData({ ...formData, username: e.target.value }); setError(null); }} 
                  className="w-full bg-[#f8f9fc] dark:bg-zinc-950 border border-gray-100 dark:border-zinc-800 rounded-2xl py-4 pl-14 pr-5 text-sm focus:outline-none focus:border-[#f2a238] transition-all dark:text-white placeholder:text-gray-400" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                 <label className="text-[11px] font-black uppercase tracking-[0.15em] text-gray-400">Password</label>
                 <Link href="#" className="text-[10px] font-black text-[#f2a238] uppercase tracking-wider hover:opacity-80">Forgot?</Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-[#f2a238] transition-colors" />
                <input required type={showPassword ? "text" : "password"} placeholder="Password" 
                  onChange={(e) => { setFormData({ ...formData, password: e.target.value }); setError(null); }} 
                  className="w-full bg-[#f8f9fc] dark:bg-zinc-950 border border-gray-100 dark:border-zinc-800 rounded-2xl py-4 pl-14 pr-14 text-sm focus:outline-none focus:border-[#f2a238] transition-all dark:text-white placeholder:text-gray-400" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <AnimatePresence mode="wait">
              {error && (
                <motion.div initial={{ opacity: 0, height: 0, y: -10 }} animate={{ opacity: 1, height: "auto", y: 0 }} exit={{ opacity: 0, height: 0, y: -10 }} className="overflow-hidden">
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-2 text-red-500 text-sm font-medium">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <p>{error}</p>
                  </div>
                </motion.div>
              )}
              {success && (
                <motion.div initial={{ opacity: 0, height: 0, y: -10 }} animate={{ opacity: 1, height: "auto", y: 0 }} exit={{ opacity: 0, height: 0, y: -10 }} className="overflow-hidden">
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2 text-emerald-500 text-sm font-medium">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                    <p>{success}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <button disabled={isLoading} type="submit" className="w-full bg-[#f2a238] hover:bg-[#e08f20] text-white font-bold py-4 rounded-2xl shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98]">
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Sign in <ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-gray-50 dark:border-zinc-800 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
              New to TransitX? <Link href="/signup" className="text-[#f2a238] font-bold hover:underline">Create an account</Link>
            </p>
          </div>
        </div>

        <div className="mt-10 flex justify-center items-center gap-6 text-[10px] uppercase tracking-[0.15em] font-black text-gray-400">
          <div className="flex items-center gap-2"><div className="w-1 h-1 bg-[#f2a238] rounded-full" />End-to-end encrypted</div>
          <div className="flex items-center gap-2"><div className="w-1 h-1 bg-[#f2a238] rounded-full" />Secure QR Gen</div>
        </div>
      </motion.div>
    </div>
  );
}