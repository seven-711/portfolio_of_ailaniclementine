"use client";

import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, UserCircle, ShieldCheck, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";

export default function AccountSettingsPage() {
  const router = useRouter();

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
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <span className="text-white/40">Settings /</span>
            <span className="text-white">Account</span>
          </h1>
        </header>

        <main className="px-4">
          <div className="bg-[#1a1a1a] rounded-3xl overflow-hidden border border-white/5">
            <AccountSubItem 
              icon={<UserCircle size={20} />} 
              label="Account Info" 
              href="/settings/account/info" 
            />
            <AccountSubItem 
              icon={<ShieldCheck size={20} />} 
              label="Password and security settings" 
              href="/settings/account/security" 
            />
            <AccountSubItem 
              icon={<Trash2 size={20} />} 
              label="Delete my account" 
              href="/settings/account/delete"
              isDestructive
            />
          </div>
        </main>

        <BottomNav />
      </div>
    </div>
  );
}

function AccountSubItem({ icon, label, href, isDestructive }: { icon: React.ReactNode, label: string, href: string, isDestructive?: boolean }) {
  return (
    <Link href={href} className="block group">
      <div className="flex items-center justify-between px-6 py-5 border-b border-white/5 last:border-0 hover:bg-white/2 transition-colors">
        <div className="flex items-center gap-4">
          <div className={`${isDestructive ? 'text-red-500' : 'text-white/60 group-hover:text-white'} transition-colors`}>
            {icon}
          </div>
          <span className={`font-bold ${isDestructive ? 'text-red-500' : 'text-white/90 group-hover:text-white'} transition-colors`}>
            {label}
          </span>
        </div>
        <ChevronRight size={18} className={`${isDestructive ? 'text-red-500/40' : 'text-white/20 group-hover:text-white'} transition-colors`} />
      </div>
    </Link>
  );
}
