"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap } from "lucide-react";

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [isSessionExpired, setIsSessionExpired] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    const checkSession = () => {
      const startTime = localStorage.getItem("introSessionStart");
      if (startTime) {
        const elapsed = Date.now() - parseInt(startTime);
        const thirtyMinutes = 30 * 60 * 1000;
        const remaining = Math.max(0, thirtyMinutes - elapsed);
        
        setTimeLeft(Math.floor(remaining / 1000));
        
        if (elapsed > thirtyMinutes) {
          setIsSessionExpired(true);
        }
      }
    };

    checkSession();
    const interval = setInterval(checkSession, 1000); // Check every 1s
    return () => clearInterval(interval);
  }, []);

  if (pathname === "/" || pathname === "/messages") return null;

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-50">
      <AnimatePresence>
        {hasMounted && !isSessionExpired && timeLeft !== null && timeLeft > 0 && (
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            className="flex justify-center mb-2"
          >
            <div className="bg-pink-500/90 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 shadow-lg flex items-center gap-1.5">
              <Zap size={10} className="text-white fill-white" />
              <span className="text-[10px] font-black text-white uppercase tracking-wider">
                Trial ends in: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <nav className="border-t border-white/5 bg-black/80 backdrop-blur-xl px-4 py-4 grid grid-cols-5 place-items-center">
        <Link href="/" className={`transition-opacity p-2 ${pathname === '/' ? 'opacity-100' : 'opacity-60 hover:opacity-100'}`}>
          <Image src="/icons/home.svg" alt="Home" width={24} height={24} className="w-6 h-6 invert" />
        </Link>
        <Link href="/discover" className={`transition-opacity p-2 ${pathname === '/discover' ? 'opacity-100' : 'opacity-60 hover:opacity-100'}`}>
          <Image src="/icons/discover.svg" alt="Discover" width={24} height={24} className="w-6 h-6 invert" />
        </Link>
        <Link href="/messages" className={`transition-opacity p-2 ${pathname === '/messages' ? 'opacity-100' : 'opacity-60 hover:opacity-100'}`}>
          <Image src="/icons/messages.svg" alt="Messages" width={24} height={24} className="w-7 h-7 invert" />
        </Link>
        <Link href="/notifications" className={`transition-opacity p-2 ${pathname === '/notifications' ? 'opacity-100' : 'opacity-60 hover:opacity-100'}`}>
          <Image src="/icons/notification.svg" alt="Notifications" width={34} height={34} className="w-7 h-7 invert" />
        </Link>
        <Link href="/menu" className={`transition-opacity p-2 ${pathname === '/menu' ? 'opacity-100' : 'opacity-60 hover:opacity-100'}`}>
          <Image src="/icons/menu.svg" alt="Menu" width={24} height={24} className="w-7 h-7 invert" />
        </Link>
      </nav>
    </div>
  );
}
