"use client";

import { useState } from "react";

import Link from "next/link";
import { X, User } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import Image from "next/image";


export default function Home() {
  return (
    <div className="grow flex flex-col bg-black text-white min-h-screen">
      {/* Top App Bar (Shared Component) */}
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-container-padding-mobile py-base">
        <div className="flex items-center gap-2">
          <Image src="/img/ailani_logo.png" alt="Ailani Logo" width={100} height={36} className="w-auto h-[86px] object-contain" />
        </div>
      </header>

      <main className="grow flex flex-col w-full bg-black">
        {/* Hero Section with Background Image */}
        <section className="relative h-[650px] w-full overflow-hidden shrink-0">
          <Image
            alt="Portrait of Ailani Clementine"
            className="absolute inset-0 w-full h-full object-cover"
            src="/img/ailani_1.jpg"
            fill
            priority
          />
          <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent"></div>

          {/* Hero Content Overlay */}
          <div className="absolute bottom-0 left-0 w-full px-container-padding-mobile pb-stack-lg flex flex-col items-center">
            {/* Name & Subheader */}
            <h2 className="text-[32px] font-[poppins] font-extrabold leading-tight text-white drop-shadow-xl text-center">Ailani Clementine</h2>
            <p className="font-title-md text-[15px] text-gray opacity-50 drop-shadow-sm mb-stack-md">@itzailaniclementine</p>

            {/* Social Icons Div */}
            <div className="flex items-center gap-6 mb-stack-sm bg-black/30 backdrop-blur-md px-6 py-3 rounded-full border border-white/10">
              <Image src="/img/instagram.png" alt="Instagram" width={28} height={28} className="w-7 h-7 object-contain hover:scale-110 transition-transform cursor-pointer" />
              <Image src="/img/facebook.png" alt="Facebook" width={28} height={28} className="w-7 h-7 object-contain hover:scale-110 transition-transform cursor-pointer" />
              <div className="bg-amber-100">
                <Image src="/img/x.png" alt="X" width={28} height={28} className="w-7 h-7 object-contain hover:scale-110 transition-transform cursor-pointer" />
              </div>
              <Image src="/img/tiktok.png" alt="TikTok" width={28} height={28} className="w-7 h-7 object-contain hover:scale-110 transition-transform cursor-pointer" />
              <Image src="/img/snapchat.png" alt="Snapchat" width={28} height={28} className="w-7 h-7 object-contain hover:scale-110 transition-transform cursor-pointer" />
            </div>
            <div>
              <h3 className="text-white">19 | Miami ✨</h3>
            </div>
          </div>

        </section>

        {/* Link-in-Bio Style Content Section */}
        <section className="px-container-padding-mobile relative z-10 flex flex-col items-center gap-stack-md w-full max-w-md mx-auto pb-stack-lg bg-black">

          {/* Exclusive Content Card */}
          <ExclusiveContentCard />

          {/* DM ME Div */}
          <PremiumCard />

        </section>
      </main>
    </div>
  );
}

export function PremiumCard() {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full max-w-md mx-auto">
      <motion.div
        whileTap={{ scale: 0.98 }}
        onClick={() => setOpen(true)}
        className="w-full relative overflow-hidden rounded-xl cursor-pointer group"
      >
        {/* Background Image */}
        <img
          src="/img/ailani_3.jpg"
          alt="DM ME"
          className={`absolute inset-0 h-80 w-full object-cover object-center transition-all duration-500 ${
            open
              ? "scale-110 blur-md brightness-50"
              : "scale-100 blur-0 brightness-90 group-hover:scale-110"
          }`}
        />

        {/* Pink Hover Overlay */}
        <div className={`absolute inset-0 transition-opacity duration-500 z-5 ${open ? "opacity-0" : "opacity-0 group-hover:opacity-100 bg-linear-to-t from-pink-400/60 to-transparent"}`} />

        {/* Dark Overlay */}
        <div className={`absolute inset-0 transition-colors z-10 ${open ? "bg-black/40" : "bg-black/50 group-hover:bg-black/30"}`} />

        {/* Default Content */}
        <div className={`relative z-10 p-6 flex flex-col items-center justify-center text-white min-h-[220px] transition-opacity duration-300 ${open ? 'opacity-0' : 'opacity-100'}`}>
          <h3 className="font-display-lg text-3xl font-bold tracking-tight mb-1 flex items-center gap-5">
            dm me 💋
          </h3>

          <p className="font-label-caps tracking-widest opacity-60">
            click here
          </p>
        </div>

        {/* Overlay Content */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-30 flex flex-col justify-between pt-2 pl-2 bg-black/30 backdrop-blur-[2px]"
            >
              {/* Close Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setOpen(false);
                }}
                className="w-10 h-10 rounded-full pt-2 flex items-center justify-center text-white"
              >
                <X size={25} />
              </button>

              {/* Centered Text */}
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-center text-white mb-10"
              >
                <h2 className="text-3xl font-bold mb-3">
                  Mature Content
                </h2>

                <p className="text-sm text-neutral-200 leading-relaxed max-w-xs mx-auto">
                  This area may contain exclusive mature-themed content intended
                  for adults only.
                </p>

                <Link href="/profile" className="mt-3 inline-block rounded-full bg-white text-black px-6 py-4 text-sm font-semibold active:scale-95 transition">
                  Continue (18+)
                </Link>
              </motion.div>

              {/* Spacer */}
              <div />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export function ExclusiveContentCard() {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full max-w-md mx-auto mb-2">
      <motion.div
        whileTap={{ scale: 0.98 }}
        onClick={() => setOpen(true)}
        className="w-full relative overflow-hidden rounded-xl cursor-pointer group"
      >
        {/* Background Image */}
        <img
          src="/img/ailani_2.jpg"
          alt="Exclusive Content"
          className={`absolute inset-0 h-full w-full object-cover transition-all duration-500 ${
            open
              ? "scale-110 blur-md brightness-50"
              : "scale-100 blur-0 brightness-90 group-hover:scale-110"
          }`}
        />

        {/* Pink Hover Overlay */}
        <div className={`absolute inset-0 transition-opacity duration-500 z-5 ${open ? "opacity-0" : "opacity-0 group-hover:opacity-100 bg-linear-to-t from-pink-400/60 to-transparent"}`} />

        {/* Dark Overlay */}
        <div className={`absolute inset-0 transition-colors z-10 ${open ? "bg-black/40" : "bg-black/50 group-hover:bg-black/30"}`} />

        {/* Default Content */}
        <div className={`relative z-10 p-8 flex flex-col items-center justify-center text-white min-h-[220px] transition-opacity duration-300 ${open ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          <p className="font-title-md text-center text-white drop-shadow-lg text-3xl font-bold">
            exclusive content <span className="block text-gray opacity-50 text-body-sm font-bold mt-1 drop-shadow-md">(50% off - limited time only)</span>
          </p>
        </div>

        {/* Overlay Content */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-30 flex flex-col justify-between pt-2 pl-2 bg-black/30 backdrop-blur-[2px]"
            >
              {/* Close Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setOpen(false);
                }}
                className="w-10 h-10 rounded-full flex pt-2 items-center justify-center text-white"
              >
                <X size={25} />
              </button>

              {/* Centered Text */}
              <motion.div
                initial={{ y: 15, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-center text-white pb-2 mb-10"
              >
                <h2 className="text-3xl font-bold mb-2">
                  Mature Content
                </h2>

                <p className="text-xs text-neutral-200 leading-relaxed max-w-[250px] mx-auto mb-4">
                  This area may contain exclusive mature-themed content intended
                  for adults only.
                </p>

                <Link href="/profile" className="inline-block rounded-full bg-white text-black px-6 py-3 text-sm font-semibold active:scale-95 transition">
                  Continue (18+)
                </Link>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

