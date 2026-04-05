"use client";

import  { useState, useEffect } from "react";
import TransitPass from "@/components/TransitPass";
import { motion, AnimatePresence } from "framer-motion";
import { 
  TrainFront, MapPin, Wallet, Zap, QrCode, LogOut, 
  CircleUserRound, Clock3, ArrowRight, Loader2,
  LayoutDashboard, History, Settings, CreditCard, Search
} from "lucide-react";
import { useRouter } from "next/navigation";

// Full station list from your database seed
const ALL_STATIONS = [
  "CSMT", "Masjid", "Sandhurst Road", "Byculla", "Chinchpokli", "Currey Road", "Parel", "Dadar", "Matunga", "Sion", "Kurla", "Vidyavihar", "Ghatkopar", "Vikhroli", "Kanjurmarg", "Bhandup", "Nahur", "Mulund", "Thane", "Kalwa", "Mumbra", "Diva", "Dombivli", "Kalyan",
  "Churchgate", "Marine Lines", "Charni Road", "Grant Road", "Mumbai Central", "Mahalaxmi", "Lower Parel", "Matunga Road", "Mahim", "Bandra", "Khar Road", "Santacruz", "Vile Parle", "Andheri", "Jogeshwari", "Goregaon", "Malad", "Kandivali", "Borivali", "Dahisar", "Mira Road", "Bhayandar", "Naigaon", "Vasai Road", "Nalasopara", "Virar",
  "Panvel", "Khandeshwar", "Mansarovar", "Kharghar", "Belapur CBD", "Seawoods", "Nerul", "Juinagar", "Sanpada", "Vashi", "Mankhurd", "Govandi", "Chembur", "Tilak Nagar", "Chunabhatti"
].sort();

export default function DashboardPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('book');
  
  // States
  const [balance, setBalance] = useState<number | null>(null);
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [ticketData, setTicketData] = useState<any>(null);
  const [userName, setUserName] = useState("Loading...");
  const [pastTickets, setPastTickets] = useState([]);
const [isFetchingTickets, setIsFetchingTickets] = useState(false);

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
    // Fetch User Profile
    fetch("/api/user", { // Adjust this to your actual user info endpoint
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
      if (res.ok) setBalance(data.balance.amount); // Assuming your schema uses 'amount'
    } catch (err) { console.error("Balance fetch error", err); }
  };

  const handleBookTicket = async () => {
    if (!origin || !destination || origin === destination) return;
    setIsLoading(true);
    const token = localStorage.getItem("token");

    try {
      const res = await fetch("/api/ticket", {
        method: "POST",
        body: JSON.stringify({ from: origin, to: destination }),
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      });
      const data = await res.json();
      if (res.ok) {
        setTicketData(data);
        // Deduct balance locally for instant feedback
        if (balance !== null) setBalance(prev => prev! - data.fare);
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
      
      {/* --- SIDEBAR --- */}
      <aside className="fixed left-0 top-0 bottom-0 w-[280px] bg-white dark:bg-zinc-900 border-r border-gray-100 dark:border-zinc-800 p-8 flex flex-col z-50">
        <div className="flex items-center gap-3 mb-12 px-2">
          <div className="w-10 h-10 bg-[#f2a238] rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20">
            <TrainFront className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-black tracking-tighter dark:text-white uppercase">TransitX</span>
        </div>

        <nav className="space-y-2 flex-grow">
          <SidebarLink icon={<LayoutDashboard size={20}/>} label="Dashboard" active={activeTab === 'book'} onClick={() => setActiveTab('book')} />
          <SidebarLink icon={<History size={20}/>} label="My Tickets" active={activeTab === 'tickets'} onClick={() => setActiveTab('tickets')} />
          <SidebarLink icon={<CreditCard size={20}/>} label="Wallet" active={false} />
          <SidebarLink icon={<Settings size={20}/>} label="Settings" active={false} />
        </nav>

        <button onClick={() => { localStorage.removeItem("token"); router.push("/signin"); }} className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-red-500 font-bold text-sm transition-colors mt-auto">
          <LogOut size={18}/> Sign Out
        </button>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="ml-[280px] flex-grow p-12">
        <header className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight italic">Mumbaichi Local.</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium tracking-tight">Generate your encrypted QR ticket instantly.</p>
          </div>
          <div className="flex items-center gap-4 px-6 py-4 bg-white dark:bg-zinc-900 rounded-3xl border border-gray-100 dark:border-zinc-800 shadow-sm shadow-black/5">
            <Wallet className="w-6 h-6 text-amber-500"/>
            <div className="flex flex-col">
              <span className="text-[9px] font-black uppercase text-gray-400 tracking-[0.2em]">Balance</span>
              <span className="text-xl font-black text-gray-900 dark:text-white leading-none">
               ₹{balance?.toFixed(2) ?? '0.00'}
              </span>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-[1.4fr_1fr] gap-12 items-start">
          {/* BOOKING CARD */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-zinc-900 p-10 rounded-[40px] border border-gray-100 dark:border-zinc-800 shadow-2xl shadow-black/5 space-y-10">
            <div className="flex items-center gap-3">
              <Zap className="w-6 h-6 text-amber-500" fill="currentColor"/>
              <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Quick Book</h2>
            </div>

            <div className="grid grid-cols-1 gap-8 relative">
              <StationSelect label="From Station" value={origin} onChange={setOrigin} stations={ALL_STATIONS} />
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 hidden md:block">
                <div className="p-3 bg-white dark:bg-zinc-800 rounded-full border border-gray-100 dark:border-zinc-700 shadow-md">
                  <ArrowRight className="w-4 h-4 text-amber-500" />
                </div>
              </div>
              <StationSelect label="To Station" value={destination} onChange={setDestination} stations={ALL_STATIONS} />
            </div>

            <button 
              disabled={isLoading || !origin || !destination} 
              onClick={handleBookTicket}
              className="w-full bg-[#f2a238] hover:bg-[#e08f20] disabled:opacity-50 text-white font-bold py-5 rounded-2xl shadow-lg shadow-amber-500/20 flex items-center justify-center gap-3 transition-all active:scale-[0.98]"
            >
              {isLoading ? <Loader2 className="animate-spin" /> : <>Generate Secure Ticket <ArrowRight size={18}/></>}
            </button>
          </motion.div>

          {/* ANIMATED TICKET SIDE */}
          <AnimatePresence mode="wait">
            {ticketData ? (
              <TransitPass 
  ticketData={ticketData} 
  origin={origin} 
  destination={destination} 
  userName={userName} 
/>
            ) : (
              <div className="h-full border-2 border-dashed border-gray-200 dark:border-zinc-800 rounded-[40px] flex flex-col items-center justify-center p-12 text-center opacity-30">
                <Search size={48} className="text-gray-300 mb-4" />
                <p className="text-sm font-bold text-gray-400">Select your route to <br/>preview your live ticket</p>
              </div>
            )}
          </AnimatePresence>
        </div>
        {/* --- STABLE MY TICKETS OVERLAY --- */}
<AnimatePresence>
  {activeTab === 'tickets' && (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-zinc-950/80 backdrop-blur-md flex justify-end"
      onClick={() => setActiveTab('book')} // Click background to close
    >
      <motion.div 
        initial={{ x: "100%" }} 
        animate={{ x: 0 }} 
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="w-full max-w-[500px] h-screen bg-white dark:bg-zinc-900 shadow-2xl p-10 overflow-y-auto"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-2xl font-black dark:text-white uppercase italic">Journey History</h2>
          <button onClick={() => setActiveTab('book')} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
             <LogOut size={20} className="rotate-180 text-zinc-400" />
          </button>
        </div>

        <div className="space-y-4">
          {isFetchingTickets ? (
            <div className="flex justify-center py-20"><Loader2 className="animate-spin text-amber-500" /></div>
          ) : pastTickets.length > 0 ? (
            pastTickets.map((t: any) => {
              const isExpired = new Date(t.ExpiresAt) < new Date();
              return (
                <div key={t.id} className="p-5 rounded-3xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-black text-sm dark:text-white uppercase tracking-tighter">{t.from} → {t.to}</p>
                      <p className="text-[9px] font-bold text-zinc-500 uppercase mt-1 tracking-widest italic">
                        {new Date(t.CreatedAt).toLocaleDateString()} at {new Date(t.CreatedAt).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest ${isExpired ? 'bg-zinc-200 text-zinc-500' : 'bg-green-500/10 text-green-500'}`}>
                      {isExpired ? 'Expired' : 'Valid'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-zinc-100 dark:border-zinc-800">
                    <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Fare Paid</span>
                    <span className="font-black text-amber-500">₹{t.fare}.00</span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-20 opacity-30 font-black uppercase tracking-widest text-xs italic">No tickets found</div>
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

// Sub-components
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