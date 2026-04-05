"use client";

import Typewriter from 'typewriter-effect';
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { motion, Variants } from "framer-motion";
import { TrainFront, Zap, Accessibility, QrCode, Menu, X, Sun, Moon, ArrowRight } from "lucide-react";
import Link from "next/link"
import HowItWorksSection from "@/components/HowItWorks";

export default function LandingPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [fare, setFare] = useState(0);

  // 1. Prevent hydration mismatch for dark mode toggle
  // 2. Trigger the cool number counting animation for the fare
  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => {
      if (fare < 45) setFare((prev) => prev + 5);
    }, 100);
    return () => clearTimeout(timer);
  }, [fare]);

  // --- ANIMATION VARIANTS (TypeScript Error Free!) ---
  const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 },
    },
  };

  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 60, damping: 15 } },
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 text-gray-900 dark:text-gray-100 font-sans transition-colors duration-300 overflow-hidden">
      
      {/* --- NAVBAR --- */}
      <nav className="max-w-7xl mx-auto px-6 lg:px-8 py-6 flex items-center justify-between relative z-50">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2">
          <TrainFront className="w-8 h-8 text-amber-500" />
          <span className="text-2xl font-bold tracking-tight">TransitX</span>
        </motion.div>

        {/* Desktop Nav */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600 dark:text-gray-300">
          {["How it works", "Tickets", "Accessibility", "Help"].map((item) => (
            <a key={item} href="#how-it-works" className="hover:text-amber-500 dark:hover:text-amber-400 transition-colors">
              {item}
            </a>
          ))}
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="hidden md:flex items-center gap-4">
          {/* THEME TOGGLE BUTTON */}
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-800 transition-colors"
              aria-label="Toggle Dark Mode"
            >
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          )}

          {/* Sign In - Now a text link */}
  <Link 
    href="/signin" 
    className="text-sm font-semibold text-gray-600 hover:text-amber-500 dark:text-gray-400 dark:hover:text-amber-400 transition-colors"
  >
    Sign In
  </Link>

  {/* Sign Up - The primary amber button */}
  <Link href="/signup">
    <button className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold rounded-full transition-all shadow-lg shadow-amber-500/20 active:scale-95">
      Sign Up
    </button>
  </Link>
        </motion.div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center gap-4">
          {mounted && (
            <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="p-2">
              {theme === "dark" ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
            </button>
          )}
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <main className="max-w-7xl mx-auto px-6 lg:px-8 pt-16 pb-24 grid lg:grid-cols-2 gap-16 items-center">
        
        {/* Left Column: Text & Buttons */}
        <motion.div variants={staggerContainer} initial="hidden" animate="show" className="space-y-8 relative z-10">
          <motion.h1 variants={fadeInUp} className="text-5xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] text-gray-900 dark:text-white">
            TransitX — Seamless Mumbai Local Tickets
          </motion.h1>
          <motion.p variants={fadeInUp} className="text-lg lg:text-xl text-gray-600 dark:text-gray-400 max-w-lg leading-relaxed">
            Choose stations, get fare, receive a dynamic QR — quick and accessible for every commuter.
          </motion.p>
          <motion.div variants={fadeInUp} className="flex flex-wrap gap-4">
            <button className="group flex items-center gap-2 px-8 py-3.5 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-full shadow-lg shadow-amber-500/30 transition-all hover:pr-6">
              Buy Ticket <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity -ml-6 group-hover:ml-0" />
            </button>
            <button className="px-8 py-3.5 bg-gray-200 dark:bg-zinc-800 hover:bg-gray-300 dark:hover:bg-zinc-700 text-gray-900 dark:text-white font-semibold rounded-full transition-colors">
              Explore Demo
            </button>
          </motion.div>
        </motion.div>

        {/* Right Column: Animated Browser Mockup */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, rotate: -2 }} 
          animate={{ opacity: 1, scale: 1, rotate: 0 }} 
          transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
          className="relative z-10"
        >
          {/* Floating decorative elements */}
          <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }} className="absolute -top-10 -right-6 w-20 h-20 bg-amber-500/10 dark:bg-amber-500/5 rounded-full blur-2xl" />
          
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl shadow-gray-200/50 dark:shadow-black/50 border border-gray-100 dark:border-zinc-800 overflow-hidden relative">
            
            {/* Browser Header */}
            <div className="bg-gray-50 dark:bg-zinc-950 px-4 py-3 border-b border-gray-100 dark:border-zinc-800 flex items-center justify-between">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
              </div>
              <span className="text-xs font-medium text-gray-400">TransitX — Desktop Preview</span>
            </div>
            
            {/* Browser Content */}
            <div className="p-8 grid sm:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">From</label>
                  <div className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-lg text-gray-500 dark:text-gray-400 text-sm">
                    {/* Replace the text on Line 137 with this */}
{mounted ? (
  <Typewriter
    options={{
      strings: ['Chhatrapati Shivaji Maharaj Terminus', 'Churchgate', 'Dadar'],
      autoStart: true,
      loop: true,
      delay: 50,
      deleteSpeed: 30,
      wrapperClassName: "text-gray-900 dark:text-white font-medium"
    }}
  />
) : (
  <span className="text-gray-900 dark:text-white font-medium">
    Chhatrapati Shivaji Maharaj Terminus
  </span>
)}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">To</label>
                  <div className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-lg text-gray-500 dark:text-gray-400 text-sm">
               
{mounted ? (
  <Typewriter
    options={{
      strings: ['Borivali', 'Thane', 'Andheri', 'Panvel'],
      autoStart: true,
      loop: true,
      delay: 80,
      deleteSpeed: 30,
      wrapperClassName: "text-gray-900 dark:text-white font-medium"
    }}
  />
) : (
  <span className="text-gray-900 dark:text-white font-medium">
    Borivali
  </span>
)}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Fare</label>
                  <div className="text-5xl font-black text-gray-900 dark:text-white tracking-tighter">
                    ₹{fare}
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col items-center justify-center space-y-4">
                <motion.div whileHover={{ scale: 1.05, rotate: 2 }} className="relative w-32 h-48 rounded-xl overflow-hidden shadow-lg border-4 border-white dark:border-zinc-800 bg-gray-100 dark:bg-zinc-800 flex items-center justify-center cursor-pointer">
                   <QrCode className="w-12 h-12 text-gray-400 dark:text-zinc-600" />
                </motion.div>
                <p className="text-[10px] text-gray-500 text-center leading-tight">
                  Valid until 10:42 AM • ID TX-20260404-789
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      {/* --- FEATURES SECTION --- */}
      <motion.section initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="max-w-7xl mx-auto px-6 lg:px-8 pb-20">
        <div className="grid md:grid-cols-3 gap-8 border-y border-gray-200 dark:border-zinc-800 py-12">
          
          {[
            { icon: Zap, title: "Fast fares", desc: "Instant fare lookup between any two Mumbai stations.", bg: "bg-amber-500 text-white", border: "border-transparent" },
            { icon: Accessibility, title: "Accessible UI", desc: "Large text, clear contrast and screen-reader friendly flows.", bg: "bg-amber-500 text-white", border: "border-gray-200 dark:border-zinc-800" },
            { icon: QrCode, title: "Secure QR tickets", desc: "Dynamically generated QR codes, valid only for the journey time.", bg: "bg-amber-500 text-white dark:text-white-400", border: "border-gray-200 dark:border-zinc-800" }
          ].map((feat, idx) => (
            <motion.div key={idx} variants={fadeInUp} whileHover={{ y: -5 }} className="flex gap-4 items-start group">
              <div className={`p-3 rounded-xl flex-shrink-0 border transition-colors ${feat.bg} ${feat.border} group-hover:border-amber-500/50`}>
                <feat.icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1 text-gray-900 dark:text-white group-hover:text-amber-500 transition-colors">{feat.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{feat.desc}</p>
              </div>
            </motion.div>
          ))}

        </div>
      </motion.section>

      {/* --- PREVIEW GALLERY --- */}
   <motion.section 
        initial="hidden" 
        whileInView="show" 
        viewport={{ once: true, margin: "-100px" }} 
        variants={staggerContainer} 
        className="max-w-7xl mx-auto px-6 lg:px-8 pb-24"
      >
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-6">
          Preview other parts of TransitX:
        </h3>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { title: "How It Works", desc: "Step-by-step commuter flow." },
            { title: "Fare & QR Demo", desc: "Try a sample ticket generation." },
            { title: "Active Tickets", desc: "Manage purchased journeys." }
          ].map((item, idx) => (
            <motion.div 
              key={idx} 
              variants={fadeInUp}
              // TRIGGER: This starts the "hover" state for all child elements simultaneously
              whileHover={mounted ? "hover" : ""} 
              whileTap={mounted ? { scale: 0.98 } : {}}
              // ANIMATION: Added the vertical lift back here
              animate={mounted ? { y: 0 } : {}}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative flex gap-4 items-center cursor-pointer group p-4 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 shadow-sm overflow-hidden"
            >
              {/* THE HOVER LAYER: Fades in background on hover */}
              {mounted && (
                <motion.div 
                  variants={{
                    hover: { opacity: 1 }
                  }}
                  initial={{ opacity: 0 }}
                  className="absolute inset-0 bg-slate-100 dark:bg-zinc-800 z-0"
                />
              )}

              {/* WRAPPER FOR LIFT ANIMATION: This handles the Y-axis movement */}
              <motion.div 
                variants={{
                  hover: { y: -8 }
                }}
                className="relative z-10 flex gap-4 items-center w-full"
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                {/* ICON BOX */}
                <div className="w-16 h-16 bg-gray-50 dark:bg-zinc-800 rounded-lg flex-shrink-0 border border-gray-200 dark:border-zinc-700 flex items-center justify-center group-hover:border-amber-500/50 transition-colors duration-300">
                  <TrainFront className="w-6 h-6 text-gray-400 group-hover:text-amber-500 transition-colors duration-300" />
                </div>
                
                {/* TEXT CONTENT */}
                <div className="space-y-0.5">
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-amber-500 transition-colors duration-300">
                    {item.title}
                  </h4>
                  <p className="text-xs text-gray-500">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </motion.section>
      <HowItWorksSection />
      {/* --- FOOTER --- */}
      <footer className="border-t border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid md:grid-cols-4 gap-12 text-sm">
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2 mb-6">
              <TrainFront className="w-6 h-6 text-amber-500" />
              <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">TransitX</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400">Making Mumbai local travel simple — check fares, buy tickets and scan securely.</p>
            <div className="space-y-1 text-gray-600 dark:text-gray-400">
              <p>Contact: <a href="mailto:support@transitx.in" className="hover:text-amber-500 underline underline-offset-2">support@transitx.in</a></p>
              <p>Phone: +91 22 1234 5678</p>
            </div>
          </div>

          <div className="md:col-span-1 md:justify-self-center">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Quick links</h4>
            <ul className="space-y-3 text-gray-600 dark:text-gray-400">
              <li><a href="#how-it-works" className="hover:text-amber-500 transition-colors">How it works</a></li>
              <li><a href="#" className="hover:text-amber-500 transition-colors">Active Tickets</a></li>
              <li><a href="#" className="hover:text-amber-500 transition-colors">Help Center</a></li>
            </ul>
          </div>

          <div className="md:col-span-1 md:justify-self-center">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4 opacity-0 hidden md:block">Links 2</h4>
            <ul className="space-y-3 text-gray-600 dark:text-gray-400 mt-0 md:mt-8">
              <li><a href="#" className="hover:text-amber-500 transition-colors">Fare & QR Demo</a></li>
              <li><a href="#" className="hover:text-amber-500 transition-colors">Accessibility</a></li>
              <li><a href="#" className="hover:text-amber-500 transition-colors">Privacy Policy</a></li>
            </ul>
          </div>

          <div className="md:col-span-1 space-y-4">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Support</h4>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              For technical support or accessibility assistance, email <a href="mailto:help@transitx.in" className="hover:text-amber-500 underline underline-offset-2">help@transitx.in</a> or call +91 22 8765 4321. We are available 9am–9pm IST.
            </p>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-zinc-800 w-full text-center">
        <p className="text-sm text-gray-400 dark:text-gray-500">
          © 2026 TransitX Technologies Pvt. Ltd. All rights reserved.
        </p>
      </div>
      </footer>
    </div>
  );
}