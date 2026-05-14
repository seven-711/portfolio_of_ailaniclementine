"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X } from "lucide-react";
import { useRouter } from "next/navigation";

export default function OneSignalHandler() {
  const { isSignedIn, user } = useUser();
  const [showToast, setShowToast] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (isSignedIn && user) {
      const hasSeenWelcome = sessionStorage.getItem("hasSeenWelcome");
      
      if (!hasSeenWelcome) {
        const timer = setTimeout(() => {
          setShowToast(true);
          sessionStorage.setItem("hasSeenWelcome", "true");
          
          // Set session start time for messaging (30 min window)
          if (!localStorage.getItem("introSessionStart")) {
            localStorage.setItem("introSessionStart", Date.now().toString());
          }
          
          // Auto-hide after 3.5 seconds
          setTimeout(() => {
            setShowToast(false);
          }, 3500);

          if (typeof window !== "undefined" && (window as any).OneSignal) {
            const OneSignal = (window as any).OneSignal;
            OneSignal.push(function() {
              OneSignal.User.addTag("last_login", new Date().toISOString());
            });
          }
        }, 2000);
        
        return () => clearTimeout(timer);
      }
    }
  }, [isSignedIn, user]);

  const handleToastClick = () => {
    setShowToast(false);
    router.push("/messages");
  };

  return (
    <AnimatePresence>
      {showToast && (
        <motion.div
          initial={{ y: -100, opacity: 0, scale: 0.9 }}
          animate={{ y: 20, opacity: 1, scale: 1 }}
          exit={{ y: -100, opacity: 0, scale: 0.9 }}
          className="fixed top-0 left-0 right-0 z-100 flex justify-center px-4"
        >
          <motion.div 
            onClick={handleToastClick}
            className="w-full max-w-[340px] bg-neutral-900/90 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl flex items-start gap-4 cursor-pointer hover:bg-neutral-800 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="relative shrink-0">
              <div className="w-12 h-12 rounded-full overflow-hidden border border-pink-500/30">
                <img src="/img/ailani_1.jpg" alt="Ailani" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-pink-500 rounded-full p-1 border-2 border-neutral-900">
                <MessageCircle size={10} className="text-white fill-white" />
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <span className="text-[13px] font-bold text-white tracking-wide">Ailani Clementine</span>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowToast(false);
                  }}
                  className="text-white/20 hover:text-white transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
              <p className="text-[13px] text-white/80 leading-snug mt-1 font-medium">
                hey stranger 👋 thanks for following.. dm me i don't bite
              </p>
              <div className="flex items-center gap-2 mt-2">
                <div className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-pulse" />
                <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Now</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
