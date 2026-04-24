"use client";
import { motion } from "framer-motion";
import {
  TrainFront, CheckCircle, Clock3, ArrowRight,
  QrCode, CircleUserRound, CalendarClock
} from "lucide-react";

interface TransitPassProps {
  ticketData: any;
  origin: string;
  destination: string;
  userName: string;
}

export default function TransitPass({ ticketData, origin, destination, userName }: TransitPassProps) {
  if (!ticketData) return null;
  const formatFullDateTime = (dateInput: any) => {
    if (!dateInput) return "N/A";
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return "N/A";

    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(date).replace(',', '');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className="flex justify-center w-full mt-10"
    >
      <div className="w-full max-w-[900px] bg-zinc-950 rounded-[40px] flex flex-col overflow-hidden shadow-[0_25px_60px_rgba(242,162,56,0.15)] border border-zinc-800 relative z-10">
        <div className="flex h-[320px] relative">
          <motion.div
            animate={{ x: ["-100%", "100%"] }}
            transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500/10 to-transparent w-[200%] pointer-events-none"
          />

          <div className="absolute top-1/2 left-[70%] -translate-y-1/2 -translate-x-1/2 w-10 h-10 bg-[#fcfdfe] dark:bg-zinc-950 rounded-full z-20 border border-zinc-800 hidden md:block" />
          <div className="flex-grow p-10 flex flex-col justify-between border-r-2 border-dashed border-zinc-800 relative z-10">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-zinc-900 rounded-full flex items-center justify-center border border-zinc-800">
                  <CircleUserRound className="w-6 h-6 text-amber-500" />
                </div>
                <div>
                  <span className="text-[9px] font-black uppercase text-zinc-500 tracking-[0.2em]">Ticket Holder</span>
                  <p className="text-sm font-black text-white italic">{userName}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 rounded-full border border-green-500/20">
                <CheckCircle className="w-3 h-3 text-green-500" />
                <span className="text-[9px] font-black text-green-500 uppercase tracking-widest">Active</span>
              </div>
            </div>

            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-8 bg-zinc-900/40 p-6 rounded-3xl border border-zinc-800/50">
              <div>
                <p className="text-2xl font-black text-white leading-none">{origin}</p>
                <p className="text-[10px] text-zinc-500 mt-1 font-bold uppercase tracking-wider">Origin</p>
              </div>
              <ArrowRight className="w-6 h-6 text-zinc-700" />
              <div className="text-right">
                <p className="text-2xl font-black text-white leading-none">{destination}</p>
                <p className="text-[10px] text-zinc-500 mt-1 font-bold uppercase tracking-wider">Destination</p>
              </div>
            </div>

            <div className="flex justify-between items-end px-1">
              <div>
                <span className="text-[9px] font-black uppercase text-zinc-600 tracking-widest">Travel Class</span>
                <p className="text-[11px] font-bold text-zinc-400">Standard Commuter Pass</p>
              </div>
              <div className="text-right">
                <span className="text-[9px] font-black uppercase text-zinc-600 tracking-widest">Fare Paid</span>
                <p className="text-3xl font-black text-amber-500 leading-none">₹{ticketData.fare}.00</p>
              </div>
            </div>
          </div>
          <div className="w-[32%] flex flex-col items-center justify-center p-6 bg-zinc-900/30 relative z-10 border-l border-zinc-800/50">

            <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-amber-500/30">
              <TrainFront className="text-white w-6 h-6" />
            </div>

            <div className="relative w-full max-w-[140px] aspect-square bg-white rounded-[2rem] mb-6 shadow-2xl shadow-black/40 flex items-center justify-center p-3 overflow-hidden">
              <QrCode size={110} className="text-zinc-950 w-full h-full" />

              <motion.div
                animate={{ y: [-60, 60] }}
                transition={{
                  repeat: Infinity,
                  repeatType: "reverse",
                  duration: 1.5,
                  ease: "easeInOut"
                }}
                className="absolute left-0 right-0 h-[3px] bg-amber-500 shadow-[0_0_15px_#f59e0b] z-20"
              />
            </div>
            <div className="w-full space-y-3 px-2">
              <div className="relative pl-3 border-l border-zinc-800">
                <span className="text-[8px] font-black uppercase text-zinc-500 tracking-widest block">Issued</span>
                <p className="text-[10px] font-bold text-zinc-400">
                  {formatFullDateTime(ticketData.ticket.CreatedAt)}
                </p>
              </div>

              <div className="relative pl-3 border-l border-amber-500/30">
                <span className="text-[8px] font-black uppercase text-amber-500/60 tracking-widest block">Valid Until</span>
                <p className="text-[10px] font-bold text-amber-500 leading-tight">
                  {formatFullDateTime(ticketData.ticket.ExpiresAt)}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="relative border-t border-zinc-800/60 bg-zinc-900/20 py-4 flex flex-col items-center">
          <div className="absolute top-0 left-10 right-10 h-[1px] bg-gradient-to-r from-transparent via-zinc-700/30 to-transparent" />

          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.3em]">
            <span className="opacity-60">Commence journey within </span>
            <span className="text-amber-400 font-black opacity-100 drop-shadow-[0_0_12px_rgba(251,191,36,0.8)] px-1">
              2 Hours
            </span>
            <span className="opacity-60"> of booking</span>
          </p>
        </div>
      </div>
    </motion.div>
  );
}