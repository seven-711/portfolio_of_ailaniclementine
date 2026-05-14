"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md border-t border-white/5 bg-black/80 backdrop-blur-xl px-4 py-4 grid grid-cols-5 place-items-center z-50">
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
  );
}
