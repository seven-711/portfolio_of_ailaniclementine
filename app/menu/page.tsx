"use client";

import { motion } from "framer-motion";
import { User as UserIcon, Settings, X, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { generateRandomName, getInitials } from "@/lib/user-utils";

export default function MenuPage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [displayName, setDisplayName] = useState("");
  const [initials, setInitials] = useState("");

  useEffect(() => {
    const storedName = localStorage.getItem("random_display_name");
    if (storedName) {
      setDisplayName(storedName);
      setInitials(getInitials(storedName));
    } else {
      const { displayName } = generateRandomName();
      setDisplayName(displayName);
      setInitials(getInitials(displayName));
      localStorage.setItem("random_display_name", displayName);
    }
  }, []);

  const menuItems = [
    { icon: <UserIcon size={24} />, label: "Profile", href: "/account" },
    { icon: <Settings size={24} />, label: "Settings", href: "/settings" },
  ];

  if (!isLoaded) return null;

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="fixed inset-0 z-50 bg-black flex justify-center overflow-hidden"
    >
      <div className="w-full max-w-md h-full flex flex-col relative bg-[#121212] border-l border-white/5 shadow-2xl">
        {/* Decorative Background Glow */}
        <div className="absolute top-[-10%] right-[-10%] w-[120px] h-[120px] bg-linear-to-br from-pink-500/20 to-transparent blur-2xl" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[120px] h-[120px] bg-linear-to-r from-purple-500/20 to-transparent blur-2xl" />

        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4">
          <button 
            onClick={() => router.back()}
            className="p-2 -ml-2 rounded-full hover:bg-white/5 transition-colors text-white/60 hover:text-white"
          >
            <X size={24} />
          </button>
          <span className="text-white/40 text-[10px] font-bold tracking-[0.2em] uppercase">Navigation</span>
          <div className="w-10" /> {/* Spacer */}
        </div>

        {/* Profile Section */}
        <div className="flex flex-col items-center mt-4 mb-8 px-6">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ 
              type: "spring",
              delay: 0.2,
              stiffness: 100,
              damping: 15
            }}
            className="w-32 h-32 rounded-full bg-linear-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center shadow-xl relative group"
          >
            {/* Outer Glow Ring */}
            <div className="absolute -inset-1 rounded-full bg-linear-to-r from-pink-500/10 to-purple-500/10 blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Inner Content */}
            <div className="absolute inset-1 rounded-full bg-[#121212] flex items-center justify-center border border-white/5">
              <span className="text-5xl font-bold text-transparent bg-clip-text bg-linear-to-b from-white to-white/40 select-none uppercase">
                {initials}
              </span>
            </div>

            {/* Floating Badge */}
            <div className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-pink-500 border-[3px] border-[#121212] flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            </div>
          </motion.div>
          
          <motion.div
            initial={{ y: 5, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center mt-4"
          >
            <h2 className="text-2xl font-bold text-white mb-0.5 tracking-tight capitalize">
              {displayName}
            </h2>
            <p className="text-white/40 text-xs font-medium">Personalized Account</p>
          </motion.div>
        </div>

        {/* Menu Items */}
        <nav className="flex flex-col px-4 gap-2">
          {menuItems.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 + index * 0.1 }}
            >
              <Link
                href={item.href}
                className="flex items-center justify-between p-4 rounded-2xl bg-white/2 hover:bg-white/5 transition-all group border border-white/5"
              >
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-white/5 flex items-center justify-center text-white/60 group-hover:text-white transition-all duration-300">
                    {item.icon}
                  </div>
                  <span className="text-lg font-semibold text-white/80 group-hover:text-white transition-colors">
                    {item.label}
                  </span>
                </div>
                <div className="w-8 h-8 rounded-full border border-white/5 flex items-center justify-center group-hover:bg-white group-hover:border-white transition-all duration-300">
                  <ChevronRight size={16} className="text-white/20 group-hover:text-black group-hover:translate-x-0.5 transition-all" />
                </div>
              </Link>
            </motion.div>
          ))}
        </nav>

        {/* Footer info */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-auto pb-8 px-8 flex flex-col items-center gap-3"
        >
          <div className="h-px w-8 bg-white/10" />
          <p className="text-white/20 text-[9px] font-bold tracking-[0.3em] uppercase">
            Ailani Clementine v1.0
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
