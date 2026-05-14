"use client";

import { motion } from "framer-motion";
import { MessageSquareText } from "lucide-react";
import BottomNav from "@/components/BottomNav";

export default function MessagesPage() {
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-pink-500/30 flex justify-center">
      <div className="w-full max-w-md min-h-screen flex flex-col relative border-x border-white/5 shadow-2xl items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="flex flex-col items-center text-center px-6"
        >
          <div className="w-20 h-20 bg-neutral-900 rounded-full flex items-center justify-center mb-6 border border-white/10 shadow-lg shadow-pink-500/10">
            <MessageSquareText size={32} className="text-pink-500" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Messages</h1>
          <p className="text-neutral-400 text-sm max-w-[250px] leading-relaxed">
            This section is currently under development. Check back later for updates!
          </p>
        </motion.div>
        
        <BottomNav />
      </div>
    </div>
  );
}
