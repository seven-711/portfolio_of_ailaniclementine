"use client";

import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { Settings, ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { generateRandomName, getInitials } from "@/lib/user-utils";

export default function AccountPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [handle, setHandle] = useState("");
  const [initials, setInitials] = useState("");
  const [activeTab, setActiveTab] = useState<"purchased" | "liked">("purchased");

  useEffect(() => {
    const storedName = localStorage.getItem("random_display_name");
    const storedHandle = localStorage.getItem("random_handle");
    
    if (storedName && storedHandle) {
      setDisplayName(storedName);
      setHandle(storedHandle);
      setInitials(getInitials(storedName));
    } else {
      const { displayName, handle } = generateRandomName();
      setDisplayName(displayName);
      setHandle(handle);
      setInitials(getInitials(displayName));
      localStorage.setItem("random_display_name", displayName);
      localStorage.setItem("random_handle", handle);
    }
  }, []);

  if (!isLoaded) return null;

  return (
    <div className="min-h-screen bg-black text-white flex justify-center font-sans overflow-x-hidden">
      <div className="w-full max-w-md h-fit min-h-screen flex flex-col relative bg-[#121212] border-x border-white/5 shadow-2xl">
        
        {/* Header with Pattern */}
        <div className="relative h-40 bg-[#1a1a1a] flex flex-col items-center justify-center">
          {/* Subtle Pattern Overlay */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
               style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 30c0-10 5-15 15-15s15 5 15 15-5 15-15 15-15-5-15-15z' fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`, backgroundSize: '40px' }} />
          
          <h1 className="text-4xl font-black tracking-tight text-white mt-4">ailani</h1>
          
          {/* Settings Icon */}
          <Link href="/settings">
            <button className="absolute top-4 right-4 p-2.5 rounded-full bg-black/40 backdrop-blur-md border border-white/5 hover:bg-black/60 transition-all">
              <Settings size={20} className="text-white" />
            </button>
          </Link>
        </div>

        {/* Profile Info Overlay */}
        <div className="px-6 -mt-16 relative z-10">
          <div className="flex flex-col items-start">
            {/* Avatar */}
            <div className="w-32 h-32 rounded-full bg-[#2a2a2a] border-4 border-[#121212] flex items-center justify-center shadow-xl">
              <span className="text-4xl font-bold text-white tracking-widest uppercase">
                {initials}
              </span>
            </div>

            {/* User Details */}
            <div className="mt-4">
              <h2 className="text-xl font-bold text-white tracking-tight">{displayName}</h2>
              <p className="text-neutral-500 text-sm mt-0.5">{handle}</p>
            </div>

            {/* Edit Button */}
            <button className="w-full mt-5 py-2.5 rounded-full border border-primary/30 bg-primary/10 text-primary font-bold text-sm hover:bg-primary/20 transition-all">
              Edit
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex mt-4 border-b border-white/5">
          <button 
            onClick={() => setActiveTab("purchased")}
            className={`flex-1 py-4 text-sm font-bold transition-all relative ${activeTab === "purchased" ? "text-white" : "text-neutral-500 hover:text-white"}`}
          >
            Purchased
            {activeTab === "purchased" && (
              <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-[3px] bg-primary" />
            )}
          </button>
          <button 
            onClick={() => setActiveTab("liked")}
            className={`flex-1 py-4 text-sm font-bold transition-all relative ${activeTab === "liked" ? "text-white" : "text-neutral-500 hover:text-white"}`}
          >
            Liked
            {activeTab === "liked" && (
              <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-[3px] bg-primary" />
            )}
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex flex-col items-center pt-10 pb-20 px-12">
          {activeTab === "purchased" ? (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center"
            >
              <img 
                src="https://api.iconify.design/solar:crown-minimalistic-bold-duotone.svg?color=%23ffb2ba" 
                alt="No items" 
                className="w-32 h-32 object-contain opacity-90"
              />
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center"
            >
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                <Settings size={32} className="text-neutral-700" />
              </div>
              <p className="text-neutral-500 text-sm font-medium">Nothing liked yet</p>
            </motion.div>
          )}
        </div>

      </div>
    </div>
  );
}
