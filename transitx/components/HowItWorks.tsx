"use client";

import { motion, Variants } from "framer-motion";
import {  Building, Wallet, Ticket, MapPin,QrCode , ArrowRight } from "lucide-react";

const HowItWorksSection = () => {
  // 1. Framer Motion Animation Variants (Staggered Entrance)
  const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

 const fadeInUp: Variants = {
  hidden: { 
    opacity: 0, 
    y: 20 
  },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      type: "spring", 
      stiffness: 100, 
      damping: 15 
    } 
  }
};

  const steps = [
    {
      step: "01",
      icon: <Building className="w-6 h-6 text-amber-500" />,
      title: "Select origin and destination stations.",
      description:
        "Begin your safe journey by specifying where you're starting and where you'd like to arrive. For users, select the corresponding station, line and platform.",
      featureImage: "/path-to-your/step-01-mockup.png", // Replace with your actual image path
      hasPlatformIndicators: true,
    },
    {
      step: "02",
      icon: <Wallet className="w-6 h-6 text-amber-500" />,
      title: "Confirm fare and ticket type.",
      description:
        "The system will calculate the total journey fare according to the current distance/zones. Review any eligible concessions (e.g., child, student). Select from Single or Return.",
      featureImage: "/path-to-your/step-02-mockup.png", // Replace with your actual image path
      hasPieChart: true,
    },
    {
      step: "03",
      icon: <Ticket className="w-6 h-6 text-amber-500" />,
      title: "Get your digital secure QR ticket.",
      description:
        "Complete payment seamlessly and receive a unique QR code directly on your mobile device. Scan and secure securely through automatic station gates and turnstiles.",
      featureImage: "/path-to-your/step-03-mockup.png", // Replace with your actual image path
      isLast: true,
    },
  ];

  return (
    <section id="how-it-works" className="bg-slate-50 dark:bg-zinc-950 py-24 px-6 lg:px-8">
      {/* 2. Section Header and Accessibility Buttons */}
      <div className="max-w-7xl mx-auto flex items-center justify-between mb-16 pb-6 border-b border-gray-200 dark:border-zinc-800">
        <div>
          <span className="text-amber-500 font-bold uppercase tracking-wide text-sm">How it works</span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mt-1 tracking-tight">
            Simplify local Mumbai travel
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-4 max-w-xl text-lg leading-relaxed">
            From station selection to securing your digital QR ticket, our process ensures seamless journey booking every step of the way.
          </p>
        </div>
      </div>

      {/* 3. Staggered Grid of Step Cards */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }} // Triggers slightly before section is fully in view
        className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8"
      >
        {steps.map((step, index) => (
          <motion.div
            key={index}
            variants={fadeInUp}
            whileHover={{ y: -10, transition: { duration: 0.2, ease: "easeOut" } }}
            className="bg-white dark:bg-zinc-900/50 p-8 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm flex flex-col will-change-transform"
          >
            {/* Step Number and Animated Arrow */}
            <div className="flex items-center justify-between mb-6">
              <span className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider bg-gray-100 dark:bg-zinc-800 px-4 py-1.5 rounded-full">
                Step {step.step}
              </span>
             {!step.isLast && (
  <div className="hidden md:flex items-center gap-2 flex-1 px-4">
    {/* The Flowing Line */}
    <div className="h-[2px] flex-1 bg-gradient-to-r from-amber-500/50 to-transparent relative overflow-hidden">
      <motion.div 
        animate={{ x: ["-100%", "100%"] }}
        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500 to-transparent w-1/2"
      />
    </div>
    {/* The Arrow Head */}
    <ArrowRight className="w-4 h-4 text-gray-300 dark:text-zinc-700" />
  </div>
)}
            </div>

            {/* Icon and Title */}
            <div className="flex items-center gap-4 mb-5">
              <div className="w-12 h-12 bg-amber-50 dark:bg-amber-950/40 rounded-full flex items-center justify-center border border-amber-200 dark:border-amber-900/50">
                {step.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">
                {step.title}
              </h3>
            </div>

            {/* Description Text */}
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-8">
              {step.description}
            </p>

            {/* Spacer to push image to the bottom if needed */}
            <div className="flex-grow"></div>

            {/* 4. Mocked Feature/Platform Indicators (from Screenshot) */}
            {step.hasPlatformIndicators && (
                <div className="space-y-4 mb-8">
                    <div className="flex items-center gap-3">
                        <MapPin className="w-8 h-8 text-amber-500"/>
                        <div className="font-semibold text-lg">CSMT <span className="text-sm text-gray-400 dark:text-gray-500 font-medium">(Terminus)</span></div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-xs font-bold text-white uppercase tracking-wider text-center">
                        <div className="bg-amber-500 p-2.5 rounded-full">PLATFORM <span className="ml-1">08</span></div>
                        <div className="bg-zinc-900 p-2.5 rounded-full">CENTRAL <span className="ml-1">P1</span></div>
                        <div className="bg-amber-500 p-2.5 rounded-full col-span-2">BORIVALI <span className="text-xs text-white/70 font-medium ml-1">(Western Line)</span></div>
                    </div>
                </div>
            )}

            {/* Placeholder for the feature mockup image */}
            <div className="mt-auto border border-gray-100 dark:border-zinc-800 rounded-lg p-4 bg-gray-50/50 dark:bg-zinc-950/50 h-36 flex items-center justify-center overflow-hidden">
  {index === 0 && (
    <div className="w-full h-full flex flex-col gap-2 p-2">
      <div className="h-2 w-full bg-amber-500/20 rounded-full" />
      <div className="h-2 w-3/4 bg-gray-200 dark:bg-zinc-800 rounded-full" />
      <div className="h-full w-full bg-gray-100 dark:bg-zinc-900 rounded-md border border-dashed border-gray-300 dark:border-zinc-700 flex items-center justify-center">
        <span className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Map Preview</span>
      </div>
    </div>
  )}

  {index === 1 && (
    <div className="w-full space-y-3 px-2">
      <div className="flex justify-between items-center border-b border-gray-200 dark:border-zinc-800 pb-2">
        <div className="h-2 w-16 bg-gray-200 dark:bg-zinc-800 rounded" />
        <div className="h-2 w-8 bg-amber-500 rounded" />
      </div>
      <div className="flex justify-between items-center">
        <div className="h-2 w-20 bg-gray-200 dark:bg-zinc-800 rounded" />
        <div className="h-2 w-6 bg-gray-200 dark:bg-zinc-800 rounded" />
      </div>
      <div className="h-6 w-full bg-amber-500/10 border border-amber-500/20 rounded-md flex items-center justify-center">
        <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold">CALCULATING...</span>
      </div>
    </div>
  )}

  {index === 2 && (
    <div className="p-3 bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-700 flex items-center justify-center animate-pulse">
      <QrCode className="w-12 h-12 text-zinc-900 dark:text-white" />
    </div>
  )}
</div>

            {/* Bottom Accent Line */}
            <div className="absolute bottom-0 left-0 w-full h-1.5 bg-gradient-to-r from-amber-400 to-amber-600 rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default HowItWorksSection;