"use client";

import { useState, useEffect } from "react";
import TransitPass from "@/components/TransitPass";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrainFront, MapPin, Wallet, Zap, QrCode, LogOut,
  CircleUserRound, Clock3, ArrowRight, Loader2,
  LayoutDashboard, History, Settings, CreditCard, Search, Ticket,
  ArrowLeftRight, MoveRight
} from "lucide-react";
import { useRouter } from "next/navigation";

// 👉 1. THE GEO ARRAY (Do NOT sort this! Used for distance math)
const ALL_STATIONS_GEO = [
  // CENTRAL
  "CSMT", "Masjid", "Sandhurst Road", "Byculla", "Chinchpokli", "Currey Road", "Parel", "Dadar", "Matunga", "Sion", "Kurla", "Vidyavihar", "Ghatkopar", "Vikhroli", "Kanjurmarg", "Bhandup", "Nahur", "Mulund", "Thane", "Kalwa", "Mumbra", "Diva", "Dombivli", "Kalyan",
  // WESTERN
  "Churchgate", "Marine Lines", "Charni Road", "Grant Road", "Mumbai Central", "Mahalaxmi", "Lower Parel", "Matunga Road", "Mahim", "Bandra", "Khar Road", "Santacruz", "Vile Parle", "Andheri", "Jogeshwari", "Goregaon", "Malad", "Kandivali", "Borivali", "Dahisar", "Mira Road", "Bhayandar", "Naigaon", "Vasai Road", "Nalasopara", "Virar",
  // HARBOUR
  "Panvel", "Khandeshwar", "Mansarovar", "Kharghar", "Belapur CBD", "Seawoods", "Nerul", "Juinagar", "Sanpada", "Vashi", "Mankhurd", "Govandi", "Chembur", "Tilak Nagar", "Chunabhatti"
];

// 👉 2. THE SORTED ARRAY (Used ONLY for the dropdown menus)
const ALL_STATIONS_SORTED = [...ALL_STATIONS_GEO].sort();

export default function DashboardPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('book');
  const [balance, setBalance] = useState<number | null>(null);
  
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [journeyType, setJourneyType] = useState("Single"); 
  
  const [isLoading, setIsLoading] = useState(false);
  const [ticketData, setTicketData] = useState<any>(null);
  const [userName, setUserName] = useState("Loading...");
  const [pastTickets, setPastTickets] = useState([]);
  const [isFetchingTickets, setIsFetchingTickets] = useState(false);

  // 👉 3. LIVE FARE CALCULATION LOGIC
  const calculateFare = (distance: number) => {
    if (distance === 0) return 0;
    if (distance <= 5) return 10;
    if (distance <= 10) return 20;
    if (distance <= 20) return 30;
    return 50;
  };

  // We use the GEO array here to get the actual physical distance
  const distance = (origin && destination) 
    ? Math.abs(ALL_STATIONS_GEO.indexOf(origin) - ALL_STATIONS_GEO.indexOf(destination)) 
    : 0;
    
  const baseFare = calculateFare(distance);
  const liveFare = journeyType === "Return" ? baseFare * 2 : baseFare;

  useEffect(() => {
    if (activeTab === 'tickets') {
      const token = localStorage.getItem("token");
      setIsFetchingTickets(true);
      fetch("/api/my-tickets", {
        headers: { "Authorization": `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => setPastTickets(data))
        .finally(() => setIsFetchingTickets(false));
    }
  }, [activeTab]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch("/api/user", {
        headers: { "Authorization": `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          setUserName(data.username.toUpperCase());
        })
        .catch(err => console.error("User fetch failed", err));
    }
  }, []);

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/signin");
    } else {
      fetchBalance(token);
    }
  }, [router]);

  const fetchBalance = async (token: string) => {
    try {
      const res = await fetch("/api/balance", {
        headers: { "Authorization": `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setBalance(data.balance.amount);
    } catch (err) { console.error("Balance fetch error", err); }
  };

  const handleBookTicket = async () => {
    if (!origin || !destination || origin === destination) return;
    setIsLoading(true);
    const token = localStorage.getItem("token");

    try {
      const res = await fetch("/api/ticket", {
        method: "POST",
        // Pass the liveFare to backend so we don't have to recalculate it there if we trust it (or backend recalculates it to be secure)
        body: JSON.stringify({ from: origin, to: destination, type: journeyType, fare: liveFare }),
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      });
      const data = await res.json();
      if (res.ok) {
        setTicketData(data);
        if (balance !== null) setBalance(prev => prev! - liveFare);
      } else {
        alert(data.msg || "Booking failed");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#fcfdfe] dark:bg-zinc-950 flex selection:bg-amber-500/30">
      <aside className="fixed left-0 top-0 bottom-0 w-[280px] bg-white dark:bg-zinc-900 border-r border-gray-100 dark:border-zinc-800 p-8 flex flex-col z-50">
        <div className="flex items-center gap-3 mb-12 px-2">
          <div className="w-10 h-10 bg-[#f2a238] rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20">
            <TrainFront className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-black tracking-tighter dark:text-white uppercase">TransitX</span>
        </div>

        <nav className="space-y-2 flex-grow">
          <SidebarLink icon={<LayoutDashboard size={20} />} label="Dashboard" active={activeTab === 'book'} onClick={() => setActiveTab('book')} />
          <SidebarLink icon={<History size={20} />} label="My Tickets" active={activeTab === 'tickets'} onClick={() => setActiveTab('tickets')} />
          <SidebarLink icon={<CreditCard size={20} />} label="Wallet" active={false} />
          <SidebarLink icon={<Settings size={20} />} label="Settings" active={false} />
        </nav>

        <button onClick={() => { localStorage.removeItem("token"); router.push("/signin"); }} className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-red-500 font-bold text-sm transition-colors mt-auto">
          <LogOut size={18} /> Sign Out
        </button>
      </aside>
      
      <main className="ml-[280px] flex-grow p-12">
        <header className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight italic">Mumbaichi Local.</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium tracking-tight">Generate your encrypted QR ticket instantly.</p>
          </div>
          <div className="flex items-center gap-4 px-6 py-4 bg-white dark:bg-zinc-900 rounded-3xl border border-gray-100 dark:border-zinc-800 shadow-sm shadow-black/5">
            <Wallet className="w-6 h-6 text-amber-500" />
            <div className="flex flex-col">
              <span className="text-[9px] font-black uppercase text-gray-400 tracking-[0.2em]">Balance</span>
              <span className="text-xl font-black text-gray-900 dark:text-white leading-none">
                ₹{balance?.toFixed(2) ?? '0.00'}
              </span>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-[1.4fr_1fr] gap-12 items-start">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-zinc-900 p-10 rounded-[40px] border border-gray-100 dark:border-zinc-800 shadow-2xl shadow-black/5 space-y-8">
            <div className="flex items-center gap-3 mb-2">
              <Zap className="w-6 h-6 text-amber-500" fill="currentColor" />
              <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Quick Book</h2>
            </div>

            <div className="grid grid-cols-1 gap-6 relative">
              <StationSelect label="From Station" value={origin} onChange={setOrigin} stations={ALL_STATIONS_SORTED} />
              
              <div className="absolute left-1/2 top-[35%] -translate-x-1/2 -translate-y-1/2 z-10 hidden md:block">
                <div className="p-3 bg-white dark:bg-zinc-800 rounded-full border border-gray-100 dark:border-zinc-700 shadow-md">
                  <ArrowRight className="w-4 h-4 text-amber-500" />
                </div>
              </div>

              <StationSelect label="To Station" value={destination} onChange={setDestination} stations={ALL_STATIONS_SORTED} />

              {/* Journey Type Selector */}
              <div>
                <label className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 ml-2 block mb-3">Journey Type</label>
                <div className="flex gap-4">
                  <button
                    onClick={() => setJourneyType("Single")}
                    className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-sm transition-all ${
                      journeyType === "Single" 
                        ? "bg-[#f2a238] text-white shadow-lg shadow-amber-500/20" 
                        : "bg-[#f8f9fc] text-gray-400 dark:bg-zinc-950 dark:text-gray-500 border border-gray-100 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800"
                    }`}
                  >
                    <MoveRight className="w-4 h-4" />
                    Single
                  </button>
                  <button
                    onClick={() => setJourneyType("Return")}
                    className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-sm transition-all ${
                      journeyType === "Return" 
                        ? "bg-[#f2a238] text-white shadow-lg shadow-amber-500/20" 
                        : "bg-[#f8f9fc] text-gray-400 dark:bg-zinc-950 dark:text-gray-500 border border-gray-100 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800"
                    }`}
                  >
                    <ArrowLeftRight className="w-4 h-4" />
                    Return
                  </button>
                </div>
              </div>

              {/* 👉 4. THE LIVE FARE UI BOX */}
              <AnimatePresence>
                {(origin && destination && origin !== destination) && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                    animate={{ opacity: 1, height: "auto", marginTop: 8 }}
                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="flex items-center justify-between bg-amber-50 dark:bg-amber-500/10 p-5 rounded-2xl border border-amber-100 dark:border-amber-500/20">
                      <span className="text-[11px] font-black uppercase tracking-[0.2em] text-amber-500">Calculated Fare</span>
                      <span className="text-2xl font-black text-amber-600 dark:text-amber-500">
                        ₹{liveFare}.00
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>

            <button
              disabled={isLoading || !origin || !destination || origin === destination}
              onClick={handleBookTicket}
              className="w-full bg-[#f2a238] hover:bg-[#e08f20] disabled:opacity-50 text-white font-bold py-5 rounded-2xl shadow-lg shadow-amber-500/20 flex items-center justify-center gap-3 transition-all active:scale-[0.98]"
            >
              {isLoading ? <Loader2 className="animate-spin" /> : <>Generate Secure Ticket <ArrowRight size={18} /></>}
            </button>
          </motion.div>

          <AnimatePresence mode="wait">
            {ticketData ? (
              <TransitPass ticketData={ticketData} origin={origin} destination={destination} userName={userName} />
            ) : (
              <div className="h-full border-2 border-dashed border-gray-200 dark:border-zinc-800 rounded-[40px] flex flex-col items-center justify-center p-12 text-center opacity-30">
                <Search size={48} className="text-gray-300 mb-4" />
                <p className="text-sm font-bold text-gray-400">Select your route to <br />preview your live ticket</p>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* ... MY TICKETS OVERLAY ... */}
        <AnimatePresence>
          {activeTab === 'tickets' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-zinc-950/80 backdrop-blur-md flex justify-end"
              onClick={() => setActiveTab('book')}
            >
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 30, stiffness: 250 }}
                className="w-full max-w-[550px] h-screen bg-[#fafbfc] dark:bg-zinc-950 shadow-2xl p-10 overflow-y-auto border-l border-white/10"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-10 sticky top-0 bg-[#fafbfc]/90 dark:bg-zinc-950/90 backdrop-blur-md pt-2 pb-6 z-20 border-b border-gray-100 dark:border-zinc-800/50">
                  <div>
                    <h2 className="text-3xl font-black dark:text-white tracking-tighter">My Tickets</h2>
                    <p className="text-xs font-bold text-gray-400 tracking-[0.2em] uppercase mt-1">Journey History</p>
                  </div>
                  <button onClick={() => setActiveTab('book')} className="p-3 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 hover:border-amber-500/50 rounded-full transition-all shadow-sm">
                    <LogOut size={18} className="rotate-180 text-gray-600 dark:text-gray-300" />
                  </button>
                </div>

                <div className="space-y-6">
                  {isFetchingTickets ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                      <Loader2 className="animate-spin text-amber-500 w-8 h-8" />
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Loading Records...</span>
                    </div>
                  ) : pastTickets.length > 0 ? (
                    pastTickets.map((t: any, index: number) => {
                      const isExpired = new Date(t.ExpiresAt) < new Date();

                      return (
                        <motion.div
                          key={t.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ scale: 1.02 }}
                          className="relative overflow-hidden p-6 rounded-3xl border border-gray-200/60 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xl shadow-black/5 hover:border-amber-500/30 transition-colors group cursor-default"
                        >
                          <Ticket className="absolute -bottom-6 -right-4 w-32 h-32 text-gray-50 dark:text-zinc-800/30 -rotate-12 transition-transform group-hover:scale-110 group-hover:rotate-0 duration-500" />
                          <div className="flex justify-between items-center mb-6 relative z-10">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">
                              {new Date(t.CreatedAt).toLocaleDateString()} <span className="mx-1 text-gray-300">•</span> {new Date(t.CreatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                            <span className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.15em] flex items-center gap-1.5 ${isExpired
                                ? 'bg-gray-100 text-gray-400 dark:bg-zinc-800 dark:text-zinc-500'
                                : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                              }`}>
                              {!isExpired && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />}
                              {isExpired ? 'Expired' : 'Active Ticket'}
                            </span>
                          </div>

                          <div className="flex items-center justify-between relative z-10 mb-6">
                            <div className="flex-1">
                              <span className="block text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Origin</span>
                              <span className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">{t.from}</span>
                            </div>

                            <div className="px-4 flex flex-col items-center">
                              <div className="w-8 h-[2px] bg-gray-100 dark:bg-zinc-800 mb-1"></div>
                              {t.type === "Return" ? <ArrowLeftRight className="w-4 h-4 text-amber-500" /> : <ArrowRight className="w-4 h-4 text-amber-500" />}
                            </div>

                            <div className="flex-1 text-right">
                              <span className="block text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Destination</span>
                              <span className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">{t.to}</span>
                            </div>
                          </div>

                          <div className="pt-5 border-t-2 border-dashed border-gray-100 dark:border-zinc-800 flex justify-between items-end relative z-10">
                            <div>
                              <span className="block text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Travel Class</span>
                              <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                                {t.type === "Return" ? "Return Commuter" : "Standard Commuter"}
                              </span>
                            </div>
                            <div className="text-right">
                              <span className="block text-[9px] font-black text-amber-500 uppercase tracking-[0.2em] mb-1">Total Paid</span>
                              <span className="text-2xl font-black text-gray-900 dark:text-white leading-none">₹{t.fare}.00</span>
                            </div>
                          </div>

                          <div className="absolute -left-3 top-[65%] w-6 h-6 bg-[#fafbfc] dark:bg-zinc-950 rounded-full border-r border-gray-200/60 dark:border-zinc-800 z-20"></div>
                          <div className="absolute -right-3 top-[65%] w-6 h-6 bg-[#fafbfc] dark:bg-zinc-950 rounded-full border-l border-gray-200/60 dark:border-zinc-800 z-20"></div>
                        </motion.div>
                      );
                    })
                  ) : (
                    <div className="flex flex-col items-center justify-center py-20 opacity-40">
                      <Ticket size={48} className="mb-4 text-gray-400" />
                      <div className="font-black uppercase tracking-widest text-sm text-center">No Journey History</div>
                      <p className="text-xs font-medium mt-2">Your purchased tickets will appear here.</p>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

const SidebarLink = ({ icon, label, active, onClick }: any) => (
  <button onClick={onClick} className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-sm font-bold transition-all ${active ? "bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-500" : "text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-800"}`}>
    {icon} {label}
  </button>
);

const StationSelect = ({ label, value, onChange, stations }: any) => (
  <div className="space-y-3">
    <label className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 ml-2">{label}</label>
    <div className="relative group">
      <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-amber-500 transition-colors" />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-[64px] bg-[#f8f9fc] dark:bg-zinc-950 border border-gray-100 dark:border-zinc-800 rounded-2xl pl-14 pr-6 text-sm font-bold focus:outline-none focus:border-amber-500 transition-all dark:text-white appearance-none cursor-pointer"
      >
        <option value="">Choose Station</option>
        {stations.map((s: string) => <option key={s} value={s}>{s}</option>)}
      </select>
    </div>
  </div>
);