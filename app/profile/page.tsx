"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, ChevronLeft, Lock, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/BottomNav";
import { useProfile } from "@/hooks/useProfile";
import SubscriptionModal from "@/components/SubscriptionModal";

export default function ProfilePage() {
  const { profile, toggleFollow, updateSubscription } = useProfile();
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [activeTab, setActiveTab] = useState<"posts" | "media">("posts");
  const [showSubModal, setShowSubModal] = useState(false);

  const isFollowing = profile?.is_following ?? false;

  const handleFollowClick = async () => {
    if (!isSignedIn) {
      router.push("/join");
    } else {
      await toggleFollow(!isFollowing);
    }
  };

  const handleCheckout = async (option: string) => {
    await updateSubscription(true, 'active');
    setShowSubModal(false);
  };

  if (!isLoaded) return null;

  return (
    <div className="min-h-screen bg-black text-white selection:bg-pink-500/30">
      {/* Container for mobile-first feel on desktop */}
      <div className="max-w-md mx-auto min-h-screen flex flex-col relative border-x border-white/5 shadow-2xl">
        
        {/* Top Header / Back Navigation */}
        <header className="absolute top-0 left-0 w-full z-30 px-4 py-6 flex justify-between items-center bg-linear-to-b from-black/60 to-transparent pointer-events-none">
          <Link href="/" className="pointer-events-auto p-2 rounded-full bg-black/20 backdrop-blur-md border border-white/10 text-white hover:bg-black/40 transition-colors">
            <ChevronLeft size={20} />
          </Link>
          
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
          
        </div>

        {/* Profile Content */}
        <main className="flex-1 px-4 sm:px-6 pb-24">
          
          {/* Action Row & Avatar */}
          <div className="flex justify-between items-end mb-6 relative z-50">
            {/* Profile Avatar Overlap */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
              className="-mt-12 sm:-mt-16"
            >
              <div className="border-4 border-black rounded-[32px] overflow-hidden w-24 h-24 sm:w-36 sm:h-36 shadow-xl shadow-black/50">
                <img
                  src="/img/ailani_1.jpg"
                  alt="Ailani Clementine"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>

            <div className="flex gap-2 sm:gap-3">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleFollowClick}
                className={`h-12 px-5 sm:px-6 rounded-2xl font-bold text-sm sm:text-base transition-colors shadow-lg flex items-center justify-center shrink-0 ${
                  isSignedIn && isFollowing
                    ? "bg-neutral-900 border border-white/10 text-white hover:bg-neutral-800 shadow-black/20" 
                    : "bg-white text-black hover:bg-neutral-200 shadow-white/5"
                }`}
              >
                {isSignedIn && isFollowing ? "Unfollow" : "Follow for free"}
              </motion.button>
              {isSignedIn && (
                <Link href="/messages">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    className="h-12 w-12 bg-neutral-900 border border-white/10 rounded-2xl flex items-center justify-center hover:bg-neutral-800 transition-colors shrink-0"
                  >
                    <MessageCircle size={22} className="text-white" />
                  </motion.button>
                </Link>
              )}
            </div>
          </div>

          {/* Name & Handle Section */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <div className="flex justify-between items-end mb-1 gap-2">
              <div className="min-w-0 shrink">
                <h1 className="text-[22px] min-[390px]:text-2xl sm:text-3xl font-bold tracking-tight whitespace-nowrap">Ailani Clementine</h1>
                <p className="text-pink-500 font-medium text-xs sm:text-sm truncate">@ailani.clementine</p>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <img src="/icons/location.svg" className="w-4 h-4 brightness-0 invert" alt="Location" />
                  <span className="text-xs sm:text-sm text-white font-medium">Miami, US</span>
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
            <p className="text-neutral-400 text-sm leading-relaxed max-w-sm whitespace-pre-line">
              Hey, I'm Ailani :) <br /> <br />
              Freshman at UMiami 👩🏻‍🎓 <br />
              <br />
              Just started this page, so everything's free for now.

              Subscribe and send me a message for a little 
              private treat made just for you ❤️
            </p>

            <button 
              onClick={() => setShowDisclaimer(!showDisclaimer)}
              className="text-neutral-500 text-xs mt-3 hover:text-white transition-colors underline decoration-neutral-700 underline-offset-4"
            >
              {showDisclaimer ? "See less" : "See more"}
            </button>

            <AnimatePresence>
              {showDisclaimer && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <p className="text-[10px] text-neutral-600 mt-4 mb-2 leading-relaxed max-w-sm">
                    By accessing, subscribing to, following, or interacting with this page, you acknowledge and agree that all content shared through this account — including images, videos, audio, text, captions, messages, and private communications — is intended solely for personal entertainment and private viewing.<br/><br/>
                    All materials are owned, licensed, or otherwise lawfully controlled by the page owner and are protected under applicable copyright and intellectual property laws. Content may not be copied, downloaded, recorded, reproduced, redistributed, modified, sold, shared, or used for commercial or public purposes without prior written consent.<br/><br/>
                    Any interaction, communication, or content provided through this page is for entertainment purposes only and should not be considered medical, legal, financial, or professional advice.<br/><br/>
                    By continuing to access or engage with this page, you confirm that you meet all required age restrictions within your jurisdiction, understand these terms, and accept full responsibility for your interactions and use of the content.<br/><br/>
                    The page owner reserves the right to revise, update, or enforce these terms at any time without prior notice.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Social Links */}
            <div className="flex gap-4 mt-4">
              <Image src="/img/instagram.png" alt="Instagram" width={20} height={20} className="w-5 h-5 opacity-60 hover:opacity-100 cursor-pointer transition-opacity" />
              <Image src="/img/x.png" alt="X" width={20} height={20} className="w-5 h-5 opacity-60 hover:opacity-100 cursor-pointer transition-opacity" />
              <Image src="/img/tiktok.png" alt="TikTok" width={20} height={20} className="w-5 h-5 opacity-60 hover:opacity-100 cursor-pointer transition-opacity" />
            </div>

            {/* Join CTA */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
              className="mt-5"
            >
              <Link href="/join">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  className="w-full py-3.5 rounded-2xl bg-pink-500 hover:bg-pink-600 text-white font-bold text-sm tracking-wide transition-colors shadow-lg shadow-pink-500/20"
                >
                  Join for free
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>


          {/* Tabs */}
          <div className="border-b border-white/10 mb-4 flex pt-4">
            <button 
              onClick={() => setActiveTab("posts")}
              className={`flex-1 pb-3 text-center font-bold transition-colors ${activeTab === "posts" ? "text-white border-b-2 border-pink-500" : "text-white/50 hover:text-white border-b-2 border-transparent"}`}
            >
              Posts (3)
            </button>
            <button 
              onClick={() => setActiveTab("media")}
              className={`flex-1 pb-3 text-center font-bold transition-colors ${activeTab === "media" ? "text-white border-b-2 border-pink-500" : "text-white/50 hover:text-white border-b-2 border-transparent"}`}
            >
              Media (3)
            </button>
          </div>
          
          <div className="mb-6">
            <span className="bg-pink-500/10 text-pink-500 text-xs font-bold px-3 py-1.5 rounded-full border border-pink-500/20">
              All 3
            </span>
          </div>

          {activeTab === "posts" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col gap-6 pb-8"
          >
            {/* Post 1 */}
            <div className="border border-white/10 rounded-2xl bg-[#121212] overflow-hidden">
              {/* Post Header */}
              <div className="p-4 flex items-start justify-between">
                <div className="flex gap-3 items-center">
                  <img src="/img/ailani_1.jpg" alt="Ailani" className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <h4 className="font-bold text-white text-sm">Ailani Clementine</h4>
                    <p className="text-neutral-400 text-xs">@ailani.clementine</p>
                  </div>
                </div>
                <span className="text-neutral-400 text-xs">3 days ago</span>
              </div>
              
              {/* Post Caption */}
              <div className="px-4 pb-4">
                {isSignedIn && isFollowing ? (
                  <p className="text-sm text-white/90 leading-relaxed font-medium">Golden hour in Miami ☀️</p>
                ) : (
                  <div className="h-3.5 w-3/4 bg-neutral-500 rounded blur-sm opacity-50"></div>
                )}
              </div>

              {/* Media Container */}
              <div className="relative w-full aspect-4/5 sm:aspect-square bg-black">
                <img 
                  src={isSignedIn && isFollowing ? "/img/ailani_1.jpg" : "/img/ailani_blur_1.png"} 
                  className={`w-full h-full object-cover transition-all duration-700 ${isSignedIn && isFollowing ? 'opacity-100' : 'opacity-80'}`} 
                  alt="Post content" 
                />
                
                {!(isSignedIn && isFollowing) && (
                  <div className="absolute inset-0 flex items-center justify-center p-6">
                    <div className="bg-white/10 backdrop-blur-xl rounded-2xl w-full max-w-[280px] pt-10 pb-6 px-6 flex flex-col items-center relative border border-white/10 shadow-2xl">
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex flex-col items-center z-10">
                        <div className="w-16 h-16 rounded-full border-[3px] border-white/20 overflow-hidden relative">
                          <img src="/img/ailani_1.jpg" alt="Ailani" className="w-full h-full object-cover" />
                        </div>
                        <div className="bg-white rounded-full p-1 -mt-3 relative z-20 border-[3px] border-black">
                          <Lock size={12} className="text-black fill-black stroke-2" />
                        </div>
                      </div>
                      <h3 className="text-white font-bold text-lg mb-1 mt-2">Unlock to view</h3>
                      <div className="flex items-center gap-1.5 text-white/80 mb-6">
                        <ImageIcon size={16} className="text-white/80" />
                        <span className="text-xs font-medium">1 Image</span>
                      </div>
                      <button onClick={() => setShowSubModal(true)} className="bg-white text-black font-bold text-sm px-6 py-2.5 rounded-full hover:bg-neutral-200 transition-colors w-full max-w-[160px]">
                        View image
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Post 2 */}
            <div className="border border-white/10 rounded-2xl bg-[#121212] overflow-hidden">
              <div className="p-4 flex items-start justify-between">
                <div className="flex gap-3 items-center">
                  <img src="/img/ailani_1.jpg" alt="Ailani" className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <h4 className="font-bold text-white text-sm">Ailani Clementine</h4>
                    <p className="text-neutral-400 text-xs">@ailani.clementine</p>
                  </div>
                </div>
                <span className="text-neutral-400 text-xs">5 days ago</span>
              </div>
              <div className="px-4 pb-4">
                {isSignedIn && isFollowing ? (
                  <p className="text-sm text-white/90 leading-relaxed font-medium">Finally got my UMiami dorm settled in! 🎓✨</p>
                ) : (
                  <div className="h-3.5 w-1/2 bg-neutral-500 rounded blur-sm opacity-50"></div>
                )}
              </div>
              <div className="relative w-full aspect-4/5 sm:aspect-square bg-black">
                <img 
                  src={isSignedIn && isFollowing ? "/img/ailani_2.jpg" : "/img/ailani_blur_2.png"} 
                  className={`w-full h-full object-cover transition-all duration-700 ${isSignedIn && isFollowing ? 'opacity-100' : 'opacity-80'}`} 
                  alt="Post content" 
                />
                {!(isSignedIn && isFollowing) && (
                  <div className="absolute inset-0 flex items-center justify-center p-6">
                    <div className="bg-white/10 backdrop-blur-xl rounded-2xl w-full max-w-[280px] pt-10 pb-6 px-6 flex flex-col items-center relative border border-white/10 shadow-2xl">
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex flex-col items-center z-10">
                        <div className="w-16 h-16 rounded-full border-[3px] border-white/20 overflow-hidden relative">
                          <img src="/img/ailani_1.jpg" alt="Ailani" className="w-full h-full object-cover" />
                        </div>
                        <div className="bg-white rounded-full p-1 -mt-3 relative z-20 border-[3px] border-black">
                          <Lock size={12} className="text-black fill-black stroke-2" />
                        </div>
                      </div>
                      <h3 className="text-white font-bold text-lg mb-1 mt-2">Unlock to view</h3>
                      <div className="flex items-center gap-1.5 text-white/80 mb-6">
                        <ImageIcon size={16} className="text-white/80" />
                        <span className="text-xs font-medium">2 Images</span>
                      </div>
                      <button onClick={() => setShowSubModal(true)} className="bg-white text-black font-bold text-sm px-6 py-2.5 rounded-full hover:bg-neutral-200 transition-colors w-full max-w-[160px]">
                        View image
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Post 3 */}
            <div className="border border-white/10 rounded-2xl bg-[#121212] overflow-hidden">
              <div className="p-4 flex items-start justify-between">
                <div className="flex gap-3 items-center">
                  <img src="/img/ailani_1.jpg" alt="Ailani" className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <h4 className="font-bold text-white text-sm">Ailani Clementine</h4>
                    <p className="text-neutral-400 text-xs">@ailani.clementine</p>
                  </div>
                </div>
                <span className="text-neutral-400 text-xs">1 week ago</span>
              </div>
              <div className="px-4 pb-4">
                {isSignedIn && isFollowing ? (
                  <p className="text-sm text-white/90 leading-relaxed font-medium">Miami nights are the best ✨</p>
                ) : (
                  <div className="h-3.5 w-2/3 bg-neutral-500 rounded blur-sm opacity-50"></div>
                )}
              </div>
              <div className="relative w-full aspect-4/5 sm:aspect-square bg-black">
                <img 
                  src={isSignedIn && isFollowing ? "/img/ailani_3.jpg" : "/img/ailani_blur_3.png"} 
                  className={`w-full h-full object-cover transition-all duration-700 ${isSignedIn && isFollowing ? 'opacity-100' : 'opacity-80'}`} 
                  alt="Post content" 
                />
                {!(isSignedIn && isFollowing) && (
                  <div className="absolute inset-0 flex items-center justify-center p-6">
                    <div className="bg-white/10 backdrop-blur-xl rounded-2xl w-full max-w-[280px] pt-10 pb-6 px-6 flex flex-col items-center relative border border-white/10 shadow-2xl">
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex flex-col items-center z-10">
                        <div className="w-16 h-16 rounded-full border-[3px] border-white/20 overflow-hidden relative">
                          <img src="/img/ailani_1.jpg" alt="Ailani" className="w-full h-full object-cover" />
                        </div>
                        <div className="bg-white rounded-full p-1 -mt-3 relative z-20 border-[3px] border-black">
                          <Lock size={12} className="text-black fill-black stroke-2" />
                        </div>
                      </div>
                      <h3 className="text-white font-bold text-lg mb-1 mt-2">Unlock to view</h3>
                      <div className="flex items-center gap-1.5 text-white/80 mb-6">
                        <ImageIcon size={16} className="text-white/80" />
                        <span className="text-xs font-medium">1 Image</span>
                      </div>
                      <button onClick={() => setShowSubModal(true)} className="bg-white text-black font-bold text-sm px-6 py-2.5 rounded-full hover:bg-neutral-200 transition-colors w-full max-w-[160px]">
                        View image
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
          )}

          {activeTab === "media" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-2 gap-3 pb-8"
            >
              {/* Column 1 */}
              <div className="flex flex-col gap-3">
                <div className="rounded-2xl overflow-hidden aspect-square bg-neutral-900 group relative">
                  <img
                    src={isSignedIn && isFollowing ? "/img/ailani_2.jpg" : "/img/ailani_blur_2.png"}
                    alt="Post 1"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  {!(isSignedIn && isFollowing) && <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />}
                </div>
                <div className="rounded-2xl overflow-hidden aspect-3/5 bg-neutral-900 group relative">
                  <img
                    src={isSignedIn && isFollowing ? "/img/ailani_3.jpg" : "/img/ailani_blur_3.png"}
                    alt="Post 2"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  {!(isSignedIn && isFollowing) && <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />}
                </div>
              </div>
              
              {/* Column 2 */}
              <div className="flex flex-col gap-3">
                <div className="rounded-2xl overflow-hidden aspect-4/5 bg-neutral-900 group relative">
                  <img
                    src={isSignedIn && isFollowing ? "/img/ailani_1.jpg" : "/img/ailani_blur_1.png"}
                    alt="Post 3"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  {!(isSignedIn && isFollowing) && <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />}
                </div>
                <div className="rounded-2xl overflow-hidden aspect-square bg-neutral-900 group relative">
                  <img
                    src="/img/ailani_2.jpg"
                    alt="Post 4"
                    className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ${isSignedIn && isFollowing ? '' : 'filter blur-md opacity-50'}`}
                  />
                  {!(isSignedIn && isFollowing) && <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />}
                </div>
              </div>
            </motion.div>
          )}

        </main>

        <BottomNav />
        
        <SubscriptionModal 
          isOpen={showSubModal} 
          onClose={() => setShowSubModal(false)} 
          onCheckout={handleCheckout} 
        />

      </div>
    </div>
  );
}
