"use client";

import { motion } from "framer-motion";
import { MessageCircle, ChevronLeft, Plus } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import BottomNav from "@/components/BottomNav";

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-pink-500/30">
      {/* Container for mobile-first feel on desktop */}
      <div className="max-w-md mx-auto min-h-screen flex flex-col relative border-x border-white/5 shadow-2xl">
        
        {/* Top Header / Back Navigation */}
        <header className="absolute top-0 left-0 w-full z-30 px-4 py-6 flex justify-between items-center bg-linear-to-b from-black/60 to-transparent pointer-events-none">
          <Link href="/" className="pointer-events-auto p-2 rounded-full bg-black/20 backdrop-blur-md border border-white/10 text-white hover:bg-black/40 transition-colors">
            <ChevronLeft size={20} />
          </Link>
          <button className="pointer-events-auto p-2 rounded-full bg-black/20 backdrop-blur-md border border-white/10 text-white hover:bg-black/40 transition-colors">
            <Plus size={20} />
          </button>
        </header>

        {/* Hero Section */}
        <div className="relative h-64 w-full">
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.5 }}
              className="w-full h-full"
            >
              <img
                src="/img/ailani_3.jpg"
                alt="Hero Banner"
                className="w-full h-full object-cover brightness-75"
              />
            </motion.div>
            <div className="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent" />
          </div>
          
          {/* Profile Avatar Overlap */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
            className="absolute bottom-[-72px] left-6 z-50"
          >
            <div className="border-4 border-black rounded-[32px] overflow-hidden w-36 h-36 shadow-xl shadow-black/50">
              <img
                src="/img/ailani_1.jpg"
                alt="Ailani Clementine"
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
        </div>

        {/* Profile Content */}
        <main className="flex-1 pt-12 px-6 pb-24">
          
          {/* Action Row */}
          <div className="flex justify-end gap-3 mb-8">
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="h-12 bg-white text-black px-6 rounded-2xl font-bold text-base hover:bg-neutral-200 transition-colors shadow-lg shadow-white/5 flex items-center justify-center"
            >
              Follow for free
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="h-12 w-12 bg-neutral-900 border border-white/10 rounded-2xl flex items-center justify-center hover:bg-neutral-800 transition-colors"
            >
              <MessageCircle size={22} className="text-white" />
            </motion.button>
          </div>

          {/* Name & Handle Section */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <div className="flex justify-between items-end mb-1">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Ailani Clementine</h1>
                <p className="text-pink-500 font-medium text-sm">@ailani.clementine</p>
              </div>
              
              <div className="flex gap-4 text-center">
                <div>
                  <span className="block text-white font-bold text-lg">204</span>
                  <span className="text-neutral-500 text-[10px] uppercase tracking-widest font-bold">Following</span>
                </div>
                <div>
                  <span className="block text-white font-bold text-lg">1.2M</span>
                  <span className="text-neutral-500 text-[10px] uppercase tracking-widest font-bold">Followers</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Bio Section */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <p className="text-neutral-400 text-sm leading-relaxed max-w-sm">
              Portugal based 📍 | Digital Creator ✨<br />
              Travel + lifestyle videography ✈️<br />
              Discover exclusive content below.
            </p>
            
            {/* Social Links */}
            <div className="flex gap-4 mt-4">
              <Image src="/img/instagram.png" alt="Instagram" width={20} height={20} className="w-5 h-5 opacity-60 hover:opacity-100 cursor-pointer transition-opacity" />
              <Image src="/img/x.png" alt="X" width={20} height={20} className="w-5 h-5 opacity-60 hover:opacity-100 cursor-pointer transition-opacity" />
              <Image src="/img/tiktok.png" alt="TikTok" width={20} height={20} className="w-5 h-5 opacity-60 hover:opacity-100 cursor-pointer transition-opacity" />
            </div>
          </motion.div>

          {/* Photos Grid - Masonry style */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-2 gap-3"
          >
            {/* Column 1 */}
            <div className="flex flex-col gap-3">
              <div className="rounded-2xl overflow-hidden aspect-square bg-neutral-900 group relative">
                <img
                  src="/img/ailani_2.jpg"
                  alt="Post 1"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
              </div>
              <div className="rounded-2xl overflow-hidden aspect-3/5 bg-neutral-900 group relative">
                <img
                  src="/img/ailani_3.jpg"
                  alt="Post 2"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
              </div>
            </div>
            
            {/* Column 2 */}
            <div className="flex flex-col gap-3">
              <div className="rounded-2xl overflow-hidden aspect-4/6 bg-neutral-900 group relative">
                <img
                  src="/img/ailani_1.jpg"
                  alt="Post 3"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
              </div>
              <div className="rounded-2xl overflow-hidden aspect-square bg-neutral-900 group relative">
                <img
                  src="/img/ailani_2.jpg"
                  alt="Post 4"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
              </div>
            </div>
          </motion.div>

        </main>

        <BottomNav />

      </div>
    </div>
  );
}
