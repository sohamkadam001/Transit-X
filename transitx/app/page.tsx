"use client";

import Typewriter from 'typewriter-effect';
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { motion, Variants } from "framer-motion";
import {
  TrainFront, Zap, QrCode, Menu, X, Sun, Moon, ArrowRight,
  Ticket, Repeat, CalendarDays, CheckCircle2,
  Eye, Volume2, Ear, Accessibility as Wheelchair,
  HelpCircle, Mail, Phone, MapPin, Navigation
} from "lucide-react";
import Link from "next/link";
import HowItWorksSection from "@/components/HowItWorks";

const demoStations = [
  "Andheri", "Bandra", "Belapur CBD", "Bhandup", "Bhayandar", "Borivali", "Byculla",
  "CSMT", "Charni Road", "Chembur", "Chinchpokli", "Chunabhatti", "Churchgate",
  "Currey Road", "Dadar", "Dahisar", "Diva", "Dombivli", "Ghatkopar", "Goregaon",
  "Govandi", "Grant Road", "Jogeshwari", "Juinagar", "Kalwa", "Kalyan", "Kandivali",
  "Kanjurmarg", "Khandeshwar", "Khar Road", "Kharghar", "Kurla", "Lower Parel",
  "Mahalaxmi", "Mahim", "Malad", "Mankhurd", "Mansarovar", "Marine Lines", "Matunga",
  "Matunga Road", "Mira Road", "Mulund", "Mumbai Central", "Mumbra", "Nahur",
  "Naigaon", "Nalasopara", "Nerul", "Panvel", "Parel", "Sandhurst Road", "Sanpada",
  "Santacruz", "Seawoods", "Sion", "Thane", "Tilak Nagar", "Vasai Road", "Vashi",
  "Vidyavihar", "Vikhroli", "Vile Parle", "Virar", "Masjid"
].sort();

export default function LandingPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [fare, setFare] = useState(0);
  const [demoFrom, setDemoFrom] = useState("Andheri");
  const [demoTo, setDemoTo] = useState("Churchgate");
  const [journeyType, setJourneyType] = useState("Single");

  const calculateFare = (distance: number) => {
    if (distance === 0) return 0;
    if (distance <= 5) return 10;
    if (distance <= 10) return 20;
    if (distance <= 20) return 30;
    return 50;
  };
  const dummyDistance = Math.abs(demoStations.indexOf(demoFrom) - demoStations.indexOf(demoTo));
  const baseFare = calculateFare(dummyDistance);
  const totalDemoFare = journeyType === "Return" ? baseFare * 2 : baseFare;

  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => {
      if (fare < 45) setFare((prev) => prev + 5);
    }, 100);
    return () => clearTimeout(timer);
  }, [fare]);

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

  const navLinks = [
    { name: "How it works", href: "#how-it-works" },
    { name: "Tickets", href: "#tickets" },
    { name: "Accessibility", href: "#accessibility" },
    { name: "Help", href: "#help" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 text-gray-900 dark:text-gray-100 font-sans transition-colors duration-300 overflow-hidden">
      <nav className="max-w-7xl mx-auto px-6 lg:px-8 py-6 flex items-center justify-between relative z-50">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2">
          <TrainFront className="w-8 h-8 text-amber-500" />
          <Link href={"/"} className="text-2xl font-bold tracking-tight">TransitX</Link>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600 dark:text-gray-300">
          {navLinks.map((item) => (
            <a key={item.name} href={item.href} className="hover:text-amber-500 dark:hover:text-amber-400 transition-colors">
              {item.name}
            </a>
          ))}
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="hidden md:flex items-center gap-4">
          {mounted && (
            <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-800 transition-colors">
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          )}
          <Link href="/signin" className="text-sm font-semibold text-gray-600 hover:text-amber-500 dark:text-gray-400 dark:hover:text-amber-400 transition-colors">
            Sign In
          </Link>
          <Link href="/signup">
            <button className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold rounded-full transition-all shadow-lg shadow-amber-500/20 active:scale-95">
              Sign Up
            </button>
          </Link>
        </motion.div>

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

      <main className="max-w-7xl mx-auto px-6 lg:px-8 pt-16 pb-24 grid lg:grid-cols-2 gap-16 items-center">
        <motion.div variants={staggerContainer} initial="hidden" animate="show" className="space-y-8 relative z-10">
          <motion.h1 variants={fadeInUp} className="text-5xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] text-gray-900 dark:text-white">
            TransitX — Seamless Mumbai Local Tickets
          </motion.h1>
          <motion.p variants={fadeInUp} className="text-lg lg:text-xl text-gray-600 dark:text-gray-400 max-w-lg leading-relaxed">
            Choose stations, get fare, receive a dynamic QR — quick and accessible for every commuter.
          </motion.p>
          <motion.div variants={fadeInUp} className="flex flex-wrap gap-4">
            <Link href="/signin">
              <button className="group flex items-center gap-2 px-8 py-3.5 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-full shadow-lg shadow-amber-500/30 transition-all hover:pr-6">
                Buy Ticket <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity -ml-6 group-hover:ml-0" />
              </button>
            </Link>
            <a href="#explore-demo">
              <button className="px-8 py-3.5 bg-gray-200 dark:bg-zinc-800 hover:bg-gray-300 dark:hover:bg-zinc-700 text-gray-900 dark:text-white font-semibold rounded-full transition-colors">
                Explore Demo
              </button>
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95, rotate: -2 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
          className="relative z-10 hidden lg:block"
        >
          <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }} className="absolute -top-10 -right-6 w-20 h-20 bg-amber-500/10 dark:bg-amber-500/5 rounded-full blur-2xl" />

          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl shadow-gray-200/50 dark:shadow-black/50 border border-gray-100 dark:border-zinc-800 overflow-hidden relative">
            <div className="bg-gray-50 dark:bg-zinc-950 px-4 py-3 border-b border-gray-100 dark:border-zinc-800 flex items-center justify-between">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
              </div>
              <span className="text-xs font-medium text-gray-400">TransitX — Auto Preview</span>
            </div>

            <div className="p-8 grid sm:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">From</label>
                  <div className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-lg text-gray-500 dark:text-gray-400 text-sm">
                    {mounted ? <Typewriter options={{ strings: ['CSMT', 'Churchgate', 'Dadar'], autoStart: true, loop: true, delay: 50, deleteSpeed: 30, wrapperClassName: "text-gray-900 dark:text-white font-medium" }} /> : <span>CSMT</span>}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">To</label>
                  <div className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-lg text-gray-500 dark:text-gray-400 text-sm">
                    {mounted ? <Typewriter options={{ strings: ['Borivali', 'Thane', 'Andheri'], autoStart: true, loop: true, delay: 80, deleteSpeed: 30, wrapperClassName: "text-gray-900 dark:text-white font-medium" }} /> : <span>Borivali</span>}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Fare</label>
                  <div className="text-5xl font-black text-gray-900 dark:text-white tracking-tighter">₹{fare}</div>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center space-y-4">
                <motion.div whileHover={{ scale: 1.05, rotate: 2 }} className="relative w-32 h-48 rounded-xl overflow-hidden shadow-lg border-4 border-white dark:border-zinc-800 bg-gray-100 dark:bg-zinc-800 flex items-center justify-center cursor-pointer">
                  <QrCode className="w-12 h-12 text-gray-400 dark:text-zinc-600" />
                </motion.div>
                <p className="text-[10px] text-gray-500 text-center leading-tight">Valid until 10:42 AM • ID TX-2026</p>
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      <motion.section id="explore-demo" initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="pt-24 pb-20 px-6 lg:px-8 bg-amber-500/5 dark:bg-amber-500/10 border-y border-amber-500/20">
        <div className="max-w-4xl mx-auto">
          <motion.div variants={fadeInUp} className="text-center mb-12">
            <h2 className="text-sm font-bold tracking-widest text-amber-500 uppercase mb-3">Live Demo</h2>
            <h3 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-4">Try the Fare Calculator</h3>
            <p className="text-gray-600 dark:text-gray-400">See how quickly you can generate a journey fare before signing up.</p>
          </motion.div>

          <motion.div variants={fadeInUp} className="bg-white dark:bg-zinc-900 p-8 rounded-3xl shadow-xl border border-gray-200 dark:border-zinc-800">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    <MapPin className="w-4 h-4 text-amber-500" /> Starting Station
                  </label>
                  <select
                    value={demoFrom}
                    onChange={(e) => setDemoFrom(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-gray-900 dark:text-white font-medium cursor-pointer"
                  >
                    {demoStations.map(station => <option key={`from-${station}`} value={station}>{station}</option>)}
                  </select>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    <Navigation className="w-4 h-4 text-amber-500" /> Destination
                  </label>
                  <select
                    value={demoTo}
                    onChange={(e) => setDemoTo(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-gray-900 dark:text-white font-medium cursor-pointer"
                  >
                    {demoStations.map(station => <option key={`to-${station}`} value={station}>{station}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Journey Type</label>
                  <div className="flex gap-4">
                    <button onClick={() => setJourneyType("Single")} className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${journeyType === "Single" ? "bg-amber-500 text-white shadow-lg shadow-amber-500/30" : "bg-gray-100 text-gray-500 dark:bg-zinc-800 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-zinc-700"}`}>Single</button>
                    <button onClick={() => setJourneyType("Return")} className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${journeyType === "Return" ? "bg-amber-500 text-white shadow-lg shadow-amber-500/30" : "bg-gray-100 text-gray-500 dark:bg-zinc-800 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-zinc-700"}`}>Return</button>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-zinc-950 p-8 rounded-2xl border border-gray-200 dark:border-zinc-800 flex flex-col justify-center items-center text-center h-full">
                <span className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Total Fare</span>
                <div className="text-7xl font-black text-gray-900 dark:text-white tracking-tighter mb-6">
                  ₹{totalDemoFare}
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-amber-600 dark:text-amber-400 bg-amber-500/10 px-4 py-2 rounded-full">
                  <CheckCircle2 className="w-4 h-4" /> Ready to purchase
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      <div id="how-it-works" className="pt-20">
        <HowItWorksSection />
      </div>

      <motion.section id="tickets" initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="pt-24 pb-20 px-6 lg:px-8 border-t border-gray-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto">
          <motion.div variants={fadeInUp} className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-sm font-bold tracking-widest text-amber-500 uppercase mb-3">Pricing</h2>
            <h3 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-4">Choose Your Journey</h3>
            <p className="text-gray-600 dark:text-gray-400">Whether you are a daily commuter or an occasional traveler, we have the right digital pass for you.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "Single Journey", icon: Ticket, desc: "Standard one-way commuter ticket.", price: "₹5 - ₹50", features: ["Valid for 1 hour", "No return allowed", "Paperless QR"], popular: false },
              { name: "Return Journey", icon: Repeat, desc: "Round trip valid till midnight.", price: "₹10 - ₹100", features: ["Valid until midnight", "Return from same destination", "Paperless QR"], popular: true },
              { name: "Season Pass", icon: CalendarDays, desc: "Monthly, quarterly or yearly passes.", price: "Varies", features: ["Unlimited travel", "ID verification required", "Auto-renewal available"], popular: false }
            ].map((ticket, idx) => (
              <motion.div variants={fadeInUp} key={idx} className={`relative bg-white dark:bg-zinc-900 rounded-3xl p-8 border ${ticket.popular ? 'border-amber-500 shadow-xl shadow-amber-500/10' : 'border-gray-200 dark:border-zinc-800 shadow-sm'}`}>
                {ticket.popular && <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-500 text-white text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-full">Most Popular</span>}
                <ticket.icon className="w-10 h-10 text-amber-500 mb-6" />
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{ticket.name}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">{ticket.desc}</p>
                <div className="text-3xl font-black text-gray-900 dark:text-white mb-8">{ticket.price}</div>
                <ul className="space-y-4 mb-8">
                  {ticket.features.map((feat, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                      <CheckCircle2 className="w-5 h-5 text-amber-500 flex-shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/signin">
                  <button className={`w-full py-3 rounded-xl font-bold transition-all ${ticket.popular ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-500/20' : 'bg-gray-100 hover:bg-gray-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-gray-900 dark:text-white'}`}>Select {ticket.name}</button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section id="accessibility" initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="pt-24 pb-20 px-6 lg:px-8 border-t border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900/30">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <motion.div variants={fadeInUp}>
            <h2 className="text-sm font-bold tracking-widest text-amber-500 uppercase mb-3">Inclusive Design</h2>
            <h3 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-6">Transit for Everyone.</h3>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
              At TransitX, we believe that moving through Mumbai should be seamless for every single person. We have designed our digital experience to exceed accessibility standards.
            </p>
          </motion.div>
          <div className="grid sm:grid-cols-2 gap-6">
            {[
              { icon: Eye, title: "High Contrast", desc: "Supports native OS themes and dynamic text sizing." },
              { icon: Volume2, title: "Screen Reader", desc: "Tested heavily with VoiceOver and TalkBack flows." },
              { icon: Ear, title: "Haptic Feedback", desc: "Vibrations confirm successful ticket generation." },
              { icon: Wheelchair, title: "Infrastructure", desc: "Maps out elevators and ramps at local stations." }
            ].map((feat, idx) => (
              <motion.div variants={fadeInUp} key={idx} className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-200 dark:border-zinc-800">
                <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center mb-4">
                  <feat.icon className="w-5 h-5 text-amber-500" />
                </div>
                <h4 className="font-bold text-gray-900 dark:text-white mb-2">{feat.title}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section id="help" initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="pt-24 pb-32 px-6 lg:px-8 border-t border-gray-200 dark:border-zinc-800">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-12">
          <motion.div variants={fadeInUp} className="md:col-span-2 space-y-8">
            <div>
              <h2 className="text-sm font-bold tracking-widest text-amber-500 uppercase mb-3">Support</h2>
              <h3 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-4">How can we help?</h3>
            </div>
            <div className="space-y-4">
              {[
                { q: "How long is a digital ticket valid?", a: "A single journey ticket is valid for 1 hour from the time of purchase." },
                { q: "What if my phone battery dies?", a: "You must be able to present a valid QR code upon request by a Ticket Examiner (TC)." },
                { q: "How do I scan the QR code?", a: "Simply hold the QR code displayed on your screen under the optical scanner at the ATVM gates." }
              ].map((faq, idx) => (
                <div key={idx} className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 p-6 rounded-2xl">
                  <h4 className="font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-3">
                    <HelpCircle className="w-5 h-5 text-amber-500" /> {faq.q}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 pl-7">{faq.a}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div variants={fadeInUp} className="space-y-6 mt-16 md:mt-0">
            <div className="bg-gradient-to-br from-amber-500 to-amber-600 text-white p-8 rounded-3xl shadow-xl shadow-amber-600/30">
              <h4 className="text-xl font-bold mb-4">Still need help?</h4>
              <p className="text-white/90 text-base font-medium mb-8 leading-relaxed">Our Mumbai-based support team is available from 9 AM to 9 PM IST, every day.</p>
              <div className="space-y-4">
                <a href="mailto:support@transitx.in" className="flex items-center gap-3 bg-black/10 hover:bg-black/20 border border-white/10 transition-colors p-3 rounded-xl backdrop-blur-sm">
                  <Mail className="w-5 h-5" />
                  <span className="font-semibold text-sm">support@transitx.in</span>
                </a>
                <div className="flex items-center gap-3 bg-black/10 border border-white/10 p-3 rounded-xl backdrop-blur-sm">
                  <Phone className="w-5 h-5" />
                  <span className="font-semibold text-sm">+91 22 1234 5678</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      <footer className="border-t border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <TrainFront className="w-6 h-6 text-amber-500" />
            <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">TransitX</span>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">Making Mumbai local travel simple — check fares, buy tickets and scan securely.</p>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500 font-medium">
            <a href="#how-it-works" className="hover:text-amber-500">How it works</a>
            <a href="#tickets" className="hover:text-amber-500">Tickets</a>
            <a href="#accessibility" className="hover:text-amber-500">Accessibility</a>
            <a href="#help" className="hover:text-amber-500">Help Support</a>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-zinc-800 text-sm text-gray-400 dark:text-gray-500">
            © 2026 TransitX Technologies Pvt. Ltd. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}