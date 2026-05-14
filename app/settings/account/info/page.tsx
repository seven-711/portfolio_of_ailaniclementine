"use client";

import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/BottomNav";

export default function AccountInfoPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  if (!isLoaded) return null;

  const joinedDate = user?.createdAt 
    ? new Date(user.createdAt).toLocaleDateString('en-US', {
        month: 'numeric',
        day: 'numeric',
        year: 'numeric'
      })
    : "5/14/2026";

  return (
    <div className="min-h-screen bg-black text-white flex justify-center font-sans overflow-x-hidden">
      <div className="w-full max-w-md min-h-screen flex flex-col relative bg-[#121212] border-x border-white/5 shadow-2xl pb-24">
        
        {/* Header with Consistent Font Size Breadcrumbs */}
        <header className="px-6 pt-8 pb-6 flex items-center">
          <button 
            onClick={() => router.back()}
            className="p-2 -ml-2 rounded-full hover:bg-white/5 transition-colors mr-2"
          >
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-2xl font-bold flex items-center gap-2 overflow-hidden">
            <span className="text-white/40 whitespace-nowrap">Settings / Account /</span>
            <span className="text-white whitespace-nowrap">Info</span>
          </h1>
        </header>

        <main className="px-4 flex flex-col gap-6">
          
          {/* Info Card */}
          <div className="bg-[#1a1a1a] rounded-3xl overflow-hidden border border-white/5">
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
              <span className="font-bold text-white">Email</span>
              <span className="text-white/60 text-sm">{user?.primaryEmailAddress?.emailAddress || "jfac711@gmail.com"}</span>
            </div>
            <div className="flex items-center justify-between px-6 py-5">
              <span className="font-bold text-white">Joined</span>
              <span className="text-white/60 text-sm">{joinedDate}</span>
            </div>
          </div>

          {/* Destructive Action Card */}
          <button className="bg-[#1a1a1a] rounded-3xl overflow-hidden border border-white/5 w-full py-5 px-6 hover:bg-red-500/5 transition-all group text-center">
            <span className="text-red-500 font-bold group-hover:text-red-400 transition-colors">
              Log out all devices and accounts
            </span>
          </button>

        </main>

        <BottomNav />
      </div>
    </div>
  );
}
