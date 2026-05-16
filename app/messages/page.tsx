"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronLeft, MoreVertical, MoreHorizontal, Zap, Heart, Sparkles, EyeOff, Info, CheckCheck, Plus, Send, BellOff, Archive, X, ShieldCheck, MessageCircle, Clock, Check, Image as ImageIcon, Lock as LockIcon, Trash2 } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useProfile } from "@/hooks/useProfile";
import { useUser } from "@clerk/nextjs";
import OptimizedImage from "@/components/media/OptimizedImage";
import OptimizedVideo from "@/components/media/OptimizedVideo";

interface Message {
  id: string;
  sender: "ai" | "user";
  text?: string;
  url?: string; // For images (publicId)
  playbackId?: string; // For videos
  time: string;
  type: "text" | "photo" | "video" | "notification";
  isUnsent?: boolean;
}

export default function MessagesPage() {
  const { isSignedIn, user, isLoaded: userLoaded } = useUser();
  const [activeTab, setActiveTab] = useState<"messages" | "media">("messages");
  const [messages, setMessages] = useState<Message[]>([]);

  const [input, setInput] = useState("");
  const { profile, loading: profileLoading, updateSubscription } = useProfile();
  const [isExpired, setIsExpired] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [hasMounted, setHasMounted] = useState(false);
  
  useEffect(() => {
    setHasMounted(true);
  }, []);
  
  // A user is "active" if they are subscribed OR if their trial hasn't expired yet
  const canChat = profile?.is_subscribed || !isExpired;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showSubModal, setShowSubModal] = useState(false);
  const [selectedOption, setSelectedOption] = useState<'monthly' | 'onetime'>('monthly');
  const [subStep, setSubStep] = useState<'options' | 'checkout'>('options');
  const [email, setEmail] = useState("");
  const ws = useRef<WebSocket | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [longPressedMessageId, setLongPressedMessageId] = useState<string | null>(null);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);

  const handleUnsend = (id: string) => {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, isUnsent: true } : m));
    setLongPressedMessageId(null);
  };

  const startLongPress = (id: string) => {
    // Only allow long press on user messages
    const msg = messages.find(m => m.id === id);
    if (msg?.sender !== "user") return;

    longPressTimer.current = setTimeout(() => {
      setLongPressedMessageId(id);
    }, 600);
  };

  const endLongPress = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
  };

  useEffect(() => {
    const checkSession = () => {
      const startTime = localStorage.getItem("introSessionStart");
      if (startTime) {
        const elapsed = Date.now() - parseInt(startTime);
        const thirtyMinutes = 30 * 60 * 1000;
        const remaining = Math.max(0, thirtyMinutes - elapsed);
        
        setTimeLeft(Math.floor(remaining / 1000));
        
        if (elapsed > thirtyMinutes) {
          setIsExpired(true);
        }
      }
    };

    checkSession();
    const interval = setInterval(checkSession, 1000);
    return () => clearInterval(interval);
  }, []);

  // Load chat history when user is loaded
  useEffect(() => {
    if (!userLoaded) return;

    const storageKey = user ? `chat_history_${user.id}` : "chat_history_guest";
    const savedMessages = localStorage.getItem(storageKey);
    
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    } else {
      // Default welcome message
      setMessages([
        {
          id: "welcome-1",
          sender: "ai",
          text: "hey stranger 👋 thanks for following.. dm me i don't bite",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: "text",
        }
      ]);
    }
  }, [user, userLoaded]);

  // Save chat history
  useEffect(() => {
    if (userLoaded && messages.length > 0) {
      const storageKey = user ? `chat_history_${user.id}` : "chat_history_guest";
      localStorage.setItem(storageKey, JSON.stringify(messages));
    }
  }, [messages, user, userLoaded]);

  useEffect(() => {
    // We use a public echo server to demonstrate a functional WebSocket connection
    ws.current = new WebSocket("wss://echo.websocket.org");
    
    ws.current.onopen = () => console.log("WebSocket connected");
    
    ws.current.onmessage = (event) => {
      if (isExpired) return;
      
      const aiResponse: Message = {
        id: Date.now().toString() + "_ai",
        sender: "ai",
        text: `You said: "${event.data}". That's so interesting! Tell me more ❤️`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: "text",
      };
      
      setTimeout(() => {
        setMessages(prev => [...prev, aiResponse]);
      }, 1000);
    };
    
    return () => {
      if (ws.current) ws.current.close();
    };
  }, [isExpired]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!canChat) return;

    // If there's a file, upload it
    if (selectedFiles.length > 0) {
      handleConfirmUpload();
    }

    // If there's text, send it
    if (input.trim()) {
      const newMessage: Message = {
        id: Date.now().toString() + "_text",
        sender: "user",
        text: input.trim(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: "text",
      };
      setMessages(prev => [...prev, newMessage]);
      setInput("");
      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        ws.current.send(newMessage.text || "");
      }
    }
  };

  const handlePlusClick = () => {
    if (!canChat) {
      setShowSubModal(true);
      return;
    }
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const newUrls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(prev => [...prev, ...newUrls]);
    setSelectedFiles(prev => [...prev, ...files]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeFile = (index: number) => {
    URL.revokeObjectURL(previewUrls[index]);
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleConfirmUpload = async () => {
    if (selectedFiles.length === 0) return;

    const filesToUpload = [...selectedFiles];
    setSelectedFiles([]);
    setPreviewUrls([]);
    setIsUploading(true);

    try {
      for (const file of filesToUpload) {
        const isVideo = file.type.startsWith("video/");
        const isImage = file.type.startsWith("image/");

      if (isVideo) {
        // 1. Get Mux upload URL
        const res = await fetch("/api/upload/mux", { method: "POST" });
        const { url, id } = await res.json();

        // 2. Upload file to Mux
        await fetch(url, {
          method: "PUT",
          body: file,
          headers: { "Content-Type": file.type },
        });

        // 3. Poll for asset readiness (simplified for now - we'll just use a placeholder playbackId if we don't have it yet, 
        // but Mux usually takes a bit. In a real app, you'd use a webhook or poll.
        // For now, let's assume we store the upload ID and it'll show up later, 
        // OR we just show a "Processing" state.)
        
        // Note: The upload ID is NOT the playback ID. We need the playback ID.
        // For this demo, I'll add a message that says "Video processing..."
        const newMessage: Message = {
          id: Date.now().toString() + "_" + Math.random().toString(36).substring(7),
          sender: "user",
          playbackId: "", // Empty for now, will show processing
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: "video",
        };
        setMessages(prev => [...prev, newMessage]);

      } else if (isImage) {
        // 1. Get Cloudinary signature
        const res = await fetch("/api/upload/cloudinary", { method: "POST" });
        const { signature, timestamp, cloudName, apiKey } = await res.json();

        if (!cloudName || !signature || !apiKey) {
          throw new Error("Cloudinary configuration missing. Check your environment variables.");
        }

        // 2. Upload to Cloudinary
        const formData = new FormData();
        formData.append("file", file);
        formData.append("signature", signature);
        formData.append("timestamp", timestamp.toString());
        formData.append("api_key", apiKey);
        formData.append("folder", "ailani_clementine");

        const uploadRes = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          { method: "POST", body: formData }
        );
        
        if (!uploadRes.ok) {
          const errorData = await uploadRes.json();
          console.error("Cloudinary upload failed:", errorData);
          throw new Error(errorData.error?.message || "Upload failed");
        }

        const uploadData = await uploadRes.json();
        console.log("Cloudinary upload success:", uploadData);

        if (uploadData.public_id) {
          const newMessage: Message = {
            id: Date.now().toString() + "_" + Math.random().toString(36).substring(7),
            sender: "user",
            url: uploadData.public_id,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            type: "photo",
          };
          setMessages(prev => [...prev, newMessage]);
        } else {
          throw new Error("No public_id returned from Cloudinary");
        }
      }
    }
  } catch (error: any) {
      console.error("Upload process error:", error);
      alert(`Failed to upload media: ${error.message || "Unknown error"}`);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleCheckout = async () => {
    try {
      // In a real app, you'd process payment here first
      await updateSubscription(true, 'active');
      setShowSubModal(false);
      setSubStep('options');
      // Maybe show a success toast or message
    } catch (err) {
      console.error("Checkout failed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center selection:bg-pink-500/30">
      
      <main className="w-full max-w-md h-screen flex flex-col relative overflow-hidden bg-black">
        
        {/* Background atmospheric glow */}
        <div className="absolute top-[-100px] left-0 right-0 h-[400px] bg-cover bg-center opacity-20 blur-[60px] -z-10"
             style={{ backgroundImage: "url('/img/ailani_1.jpg')" }}></div>

        {/* Top Navigation */}
        <header className="flex justify-between items-center w-full px-5 py-4 backdrop-blur-xl bg-black/40 border-b border-white/10 sticky top-0 z-50">
          <div className="flex items-center gap-3">
            <Link href="/profile" className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors">
              <ChevronLeft size={20} className="text-white" />
            </Link>
            
            <div className="w-10 h-10 rounded-full border border-white/20 overflow-hidden shrink-0">
              <img src="/img/ailani_1.jpg" alt="Ailani" className="w-full h-full object-cover" />
            </div>
            
            <div className="flex flex-col">
              <h1 className="font-bold text-[16px] text-white leading-tight">Ailani</h1>
              <div className="flex items-center gap-3 mt-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                  <span className="font-medium text-[11px] text-neutral-400 uppercase tracking-wider">Online</span>
                </div>
                {profile?.is_subscribed ? (
                  <div className="flex items-center gap-1.5 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    <ShieldCheck size={10} className="text-emerald-500" />
                    <span className="font-bold text-[10px] text-emerald-500 uppercase tracking-tighter">
                      Subscriber
                    </span>
                  </div>
                ) : (hasMounted && !isExpired && timeLeft !== null) && (
                  <div className="flex items-center gap-1.5 bg-pink-500/10 px-2 py-0.5 rounded-full border border-pink-500/20">
                    <Zap size={10} className="text-pink-500 fill-pink-500" />
                    <span className="font-bold text-[10px] text-pink-500 uppercase tracking-tighter">
                      Trial: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="relative">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <MoreVertical size={20} className="text-white" />
            </button>

            <AnimatePresence>
              {isMenuOpen && (
                <>
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsMenuOpen(false)}
                    className="fixed inset-0 z-40"
                  />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10, x: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10, x: 10 }}
                    className="absolute right-0 mt-2 w-48 bg-black/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden"
                  >
                    <div className="py-1.5">
                      <button className="w-full flex items-center gap-3 px-4 py-2.5 text-white hover:bg-white/5 transition-colors">
                        <BellOff size={18} className="text-neutral-400" />
                        <span className="text-sm font-medium">Mute</span>
                      </button>
                      <button className="w-full flex items-center gap-3 px-4 py-2.5 text-white hover:bg-white/5 transition-colors">
                        <Archive size={18} className="text-neutral-400" />
                        <span className="text-sm font-medium">Archive</span>
                      </button>
                      <button 
                        onClick={() => {
                          setShowSubModal(true);
                          setIsMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-white hover:bg-white/5 transition-colors"
                      >
                        <Plus size={18} className="text-neutral-400" />
                        <span className="text-sm font-medium">Subscribe</span>
                      </button>
                      <button className="w-full flex items-center gap-3 px-4 py-2.5 text-white hover:bg-white/5 transition-colors">
                        <EyeOff size={18} className="text-neutral-400" />
                        <span className="text-sm font-medium">Mark as unread</span>
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </header>

        <AnimatePresence>
          {showSubModal && (
            <div className="fixed inset-0 z-100 flex items-center justify-center px-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowSubModal(false)}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-[400px] bg-[#1a1a1a] rounded-[32px] overflow-hidden shadow-2xl border border-white/5"
              >
                {/* Modal Header */}
                <div className="px-6 pt-6 flex items-center justify-between min-h-10">
                  <div className="flex items-center gap-3">
                    {subStep === 'checkout' && (
                      <button 
                        onClick={() => setSubStep('options')}
                        className="p-1 -ml-1 text-white/40 hover:text-white transition-colors"
                      >
                        <ChevronLeft size={24} />
                      </button>
                    )}
                  </div>
                  <button 
                    onClick={() => setShowSubModal(false)}
                    className="p-1 text-white/40 hover:text-white transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="px-5 pb-5 pt-1">
                  {subStep === 'options' ? (
                    <>
                      {/* Profile Section */}
                      <div className="flex flex-col mb-2">
                        <div className="w-16 h-16 rounded-full overflow-hidden mb-3 border-2 border-white/10">
                          <img src="/img/ailani_1.jpg" alt="Ailani" className="w-full h-full object-cover" />
                        </div>
                        <h2 className="text-xl font-black text-white mb-0.5 uppercase tracking-tight">Ailani Clementine</h2>
                        <div className="flex items-center gap-2 text-white/40">
                          <ImageIcon size={14} />
                          <span className="text-xs font-bold tracking-tighter">3</span>
                        </div>
                      </div>

                      <div className="h-px bg-white/10 w-full mb-4" />

                      {/* Benefits */}
                      <div className="flex flex-col gap-3 mb-4">
                        <div className="flex items-center gap-3 text-white">
                          <div className="w-4 h-4 flex items-center justify-center opacity-70">
                            <ShieldCheck size={18} />
                          </div>
                          <span className="text-[13px] font-bold">My exclusive subscriber-only content</span>
                        </div>
                        <div className="flex items-center gap-3 text-white">
                          <div className="w-4 h-4 flex items-center justify-center opacity-70">
                            <MessageCircle size={18} />
                          </div>
                          <span className="text-[13px] font-bold">Unlimited direct messaging with me</span>
                        </div>
                        <div className="flex items-center gap-3 text-white">
                          <div className="w-4 h-4 flex items-center justify-center opacity-70">
                            <Clock size={18} />
                          </div>
                          <span className="text-[13px] font-bold">Cancel at any time, risk free</span>
                        </div>
                      </div>

                      <div className="h-px bg-white/10 w-full mb-4" />

                      {/* Pricing Selection */}
                      <div className="mb-4">
                        <span className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-2 block">Subscriptions</span>
                        <div className="flex flex-col gap-2">
                          <button 
                            onClick={() => setSelectedOption('monthly')}
                            className={`w-full bg-[#2a2a2a] border-2 rounded-2xl p-3.5 flex items-center justify-between transition-all ${selectedOption === 'monthly' ? 'border-pink-500' : 'border-white/5 opacity-60'}`}
                          >
                            <div className="flex flex-col items-start">
                              <span className="text-[13px] font-bold text-white tracking-tight">Monthly Subscription</span>
                              <span className="text-[11px] text-white/40 font-bold">$14.99/month</span>
                            </div>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${selectedOption === 'monthly' ? 'border-pink-500 bg-pink-500/10' : 'border-white/20'}`}>
                              {selectedOption === 'monthly' && <Check size={12} className="text-pink-500" />}
                            </div>
                          </button>

                          <button 
                            onClick={() => setSelectedOption('onetime')}
                            className={`w-full bg-[#2a2a2a] border-2 rounded-2xl p-3.5 flex items-center justify-between transition-all ${selectedOption === 'onetime' ? 'border-pink-500' : 'border-white/5 opacity-60'}`}
                          >
                            <div className="flex flex-col items-start">
                              <span className="text-[13px] font-bold text-white tracking-tight">One-time Support</span>
                              <span className="text-[11px] text-white/40 font-bold">$49.99 once</span>
                            </div>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${selectedOption === 'onetime' ? 'border-pink-500 bg-pink-500/10' : 'border-white/20'}`}>
                              {selectedOption === 'onetime' && <Check size={12} className="text-pink-500" />}
                            </div>
                          </button>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="flex flex-col items-center gap-3">
                        <div className="flex flex-col items-center gap-2 w-full">
                          <span className="text-[12px] font-black text-white/40 tracking-widest uppercase">
                            {selectedOption === 'monthly' ? '$14.99' : '$49.99'}
                          </span>
                          <button 
                            onClick={() => setSubStep('checkout')}
                            className="w-full bg-pink-500 hover:bg-pink-600 text-white font-black text-xs uppercase tracking-widest py-3.5 rounded-full transition-all active:scale-95 shadow-lg shadow-pink-500/20"
                          >
                            Join now
                          </button>
                        </div>
                        <button 
                          onClick={() => setShowSubModal(false)}
                          className="text-[11px] font-black text-white uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity"
                        >
                          No, thanks
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Checkout Form */}
                      <div className="flex flex-col mb-6 pt-2">
                        <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-1">Checkout</h2>
                        <p className="text-[12px] text-white/40 font-bold uppercase tracking-widest">Complete your payment</p>
                      </div>

                      <div className="bg-white/3 rounded-3xl p-6 border border-white/10 mb-6 shadow-inner">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10 shrink-0">
                              <img src="/img/ailani_1.jpg" alt="Ailani" className="w-full h-full object-cover" />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[14px] font-bold text-white leading-tight">Subscription</span>
                              <span className="text-[11px] text-white/40 font-medium mt-0.5">No commitment, cancel anytime.</span>
                            </div>
                          </div>
                          <ChevronLeft size={16} className="text-white/20 -rotate-90" />
                        </div>
                        
                        <div className="flex flex-col gap-2.5 pt-4 border-t border-white/5">
                          <div className="flex justify-between items-center text-[13px]">
                            <span className="text-white/40 font-semibold tracking-tight">Subtotal</span>
                            <span className="text-white font-bold">{selectedOption === 'monthly' ? '$14.99' : '$49.99'}</span>
                          </div>
                          <div className="flex justify-between items-center text-[13px]">
                            <span className="text-white/40 font-semibold tracking-tight">Processing Fee</span>
                            <span className="text-white font-bold">$0.00</span>
                          </div>
                          <div className="flex justify-between items-center pt-3 mt-1 border-t border-white/10">
                            <span className="text-white font-black uppercase text-[12px] tracking-widest">Total to pay</span>
                            <span className="text-pink-500 text-xl font-black tracking-tighter">
                              {selectedOption === 'monthly' ? '$14.99' : '$49.99'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-5 mb-8">
                        <div className="flex flex-col gap-2.5">
                          <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Payment Email</label>
                          <input 
                            type="email" 
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-white/2 border border-white/10 rounded-2xl px-5 py-4.5 text-white text-[15px] font-medium focus:border-pink-500/50 focus:bg-white/5 outline-none transition-all placeholder:text-white/10"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col items-center gap-5">
                        <button 
                          onClick={handleCheckout}
                          className="w-full bg-[#0070ba] hover:bg-[#005ea6] text-white font-black text-sm uppercase tracking-widest py-5 rounded-full transition-all active:scale-95 flex items-center justify-center gap-3 shadow-lg shadow-[#0070ba]/20"
                        >
                          <img src="https://api.iconify.design/logos:paypal.svg?color=white" alt="PayPal" className="h-4.5 brightness-0 invert" />
                          <span>Pay with PayPal</span>
                        </button>
                        <button 
                          onClick={() => setSubStep('options')}
                          className="text-[11px] font-black text-white uppercase tracking-[0.2em] opacity-30 hover:opacity-100 transition-opacity"
                        >
                          Change Plan
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>


        {/* Tab Bar */}
        <div className="flex border-b border-white/10 sticky top-[73px] z-40 bg-black/80 backdrop-blur-xl">
          <button
            onClick={() => setActiveTab("messages")}
            className={`flex-1 py-3 text-[13px] font-semibold uppercase tracking-wider transition-all ${
              activeTab === "messages"
                ? "text-pink-500 border-b-2 border-pink-500"
                : "text-neutral-500 hover:text-neutral-300"
            }`}
          >
            Messages
          </button>
          <button
            onClick={() => setActiveTab("media")}
            className={`flex-1 py-3 text-[13px] font-semibold uppercase tracking-wider transition-all ${
              activeTab === "media"
                ? "text-pink-500 border-b-2 border-pink-500"
                : "text-neutral-500 hover:text-neutral-300"
            }`}
          >
            Media
          </button>
        </div>

        {/* Chat Canvas */}
        {activeTab === "messages" && (
        <section className="flex-1 px-5 flex flex-col gap-6 overflow-y-auto pt-2 pb-32 relative">
          {/* Close unsend menu when clicking elsewhere */}
          {longPressedMessageId && (
            <div 
              className="fixed inset-0 z-50" 
              onClick={() => setLongPressedMessageId(null)}
            />
          )}
          <div className="text-center mt-2">
            <span className="font-semibold text-[12px] text-neutral-500 uppercase tracking-widest">Today</span>
          </div>

          {messages.map((msg) => {
            if (msg.isUnsent) {
              const isUser = msg.sender === "user";
              return (
                <div key={msg.id} className={`${isUser ? 'self-end' : 'self-start'} max-w-[85%]`}>
                  <div className="bg-neutral-900/50 border border-white/5 px-4 py-2 rounded-2xl shadow-inner">
                    <p className="text-[13px] text-white/30 font-medium italic">
                      {isUser ? "You unsent a message" : "This message was unsent"}
                    </p>
                  </div>
                </div>
              );
            }

            if (msg.type === "notification") {
              return (
                <div key={msg.id} className="ml-10 max-w-[85%]">
                  <div className="bg-neutral-900 px-4 py-3 rounded-2xl flex gap-3 items-center border border-white/10 shadow-sm">
                    <div className="w-10 h-10 rounded-full bg-pink-500/10 flex items-center justify-center shrink-0">
                      <Info size={20} className="text-pink-500" />
                    </div>
                    <p className="text-[14px] text-neutral-300">
                      Exclusive chat on! Expect some <span className="font-bold text-white">bold or revealing photos</span> ahead!
                    </p>
                  </div>
                </div>
              );
            }

            if (msg.type === "photo") {
              const isUser = msg.sender === "user";
              return (
                <div 
                  key={msg.id} 
                  className={`${isUser ? 'self-end' : 'ml-10'} max-w-[70%] relative group`}
                  onPointerDown={() => isUser && startLongPress(msg.id)}
                  onPointerUp={endLongPress}
                  onPointerLeave={endLongPress}
                  onContextMenu={(e) => {
                    if (isUser) {
                      e.preventDefault();
                      setLongPressedMessageId(msg.id);
                    }
                  }}
                >
                  <AnimatePresence>
                    {longPressedMessageId === msg.id && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 10 }}
                        className="absolute -top-12 right-0 z-[60] bg-red-500 text-white px-4 py-2 rounded-xl shadow-2xl flex items-center gap-2 cursor-pointer whitespace-nowrap active:scale-95 transition-transform"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUnsend(msg.id);
                        }}
                      >
                        <Trash2 size={14} className="fill-white/20" />
                        <span className="text-xs font-bold uppercase tracking-widest">Unsend</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <div className="flex items-center gap-2">
                    {isUser && (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setLongPressedMessageId(msg.id === longPressedMessageId ? null : msg.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-white/10 rounded-full text-white/40 hover:text-white shrink-0"
                        title="Message options"
                      >
                        <MoreHorizontal size={18} />
                      </button>
                    )}
                    <div className="relative aspect-4/5 rounded-3xl overflow-hidden bg-neutral-900 border border-white/10 group-hover:border-white/20 cursor-pointer shadow-xl transition-colors">
                      {!isUser && !(isSignedIn && profile?.is_subscribed) && (
                        <div className="absolute inset-0 z-10 bg-black/40 backdrop-blur-xl flex flex-col items-center justify-center p-6 text-center">
                          <div className="w-12 h-12 rounded-full border border-white/50 flex items-center justify-center mb-4 bg-black/40">
                            <EyeOff size={24} className="text-white" />
                          </div>
                          <p className="font-bold text-white drop-shadow-md text-[20px]">Your eyes only</p>
                        </div>
                      )}
                      <OptimizedImage 
                        src={msg.url || "/img/ailani_blur_1.png"}
                        alt="Media content" 
                        width={400}
                        height={500}
                        className={`w-full h-full object-cover ${!isUser && !(isSignedIn && profile?.is_subscribed) ? 'scale-110 filter blur-sm' : ''}`} 
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-1 mt-1">
                    <span className="text-[10px] text-neutral-400">{msg.time}</span>
                    {isUser && <CheckCheck size={14} className="text-pink-500" />}
                  </div>
                </div>
              );
            }

            if (msg.type === "video") {
              const isUser = msg.sender === "user";
              return (
                <div 
                  key={msg.id} 
                  className={`${isUser ? 'self-end' : 'ml-10'} max-w-[85%] w-full relative group`}
                  onPointerDown={() => isUser && startLongPress(msg.id)}
                  onPointerUp={endLongPress}
                  onPointerLeave={endLongPress}
                  onContextMenu={(e) => {
                    if (isUser) {
                      e.preventDefault();
                      setLongPressedMessageId(msg.id);
                    }
                  }}
                >
                  <AnimatePresence>
                    {longPressedMessageId === msg.id && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 10 }}
                        className="absolute -top-12 right-0 z-[60] bg-red-500 text-white px-4 py-2 rounded-xl shadow-2xl flex items-center gap-2 cursor-pointer whitespace-nowrap active:scale-95 transition-transform"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUnsend(msg.id);
                        }}
                      >
                        <Trash2 size={14} className="fill-white/20" />
                        <span className="text-xs font-bold uppercase tracking-widest">Unsend</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <div className="flex items-center gap-2">
                    {isUser && (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setLongPressedMessageId(msg.id === longPressedMessageId ? null : msg.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-white/10 rounded-full text-white/40 hover:text-white shrink-0"
                        title="Message options"
                      >
                        <MoreHorizontal size={18} />
                      </button>
                    )}
                    <div className="relative rounded-3xl overflow-hidden bg-neutral-900 border border-white/10 group-hover:border-white/20 shadow-xl transition-colors">
                      {!isUser && !(isSignedIn && profile?.is_subscribed) && (
                        <div className="absolute inset-0 z-10 bg-black/60 backdrop-blur-2xl flex flex-col items-center justify-center p-6 text-center">
                          <div className="w-12 h-12 rounded-full border border-white/50 flex items-center justify-center mb-4 bg-black/40">
                            <LockIcon size={24} className="text-white" />
                          </div>
                          <p className="font-bold text-white drop-shadow-md text-[20px]">Premium Video</p>
                          <p className="text-white/60 text-xs mt-2 uppercase tracking-widest font-black">Subscribe to watch</p>
                        </div>
                      )}
                      {!msg.playbackId ? (
                        <div className="aspect-video bg-black/80 flex flex-col items-center justify-center p-6 text-center gap-3">
                          <div className="w-10 h-10 border-4 border-pink-500/30 border-t-pink-500 rounded-full animate-spin" />
                          <p className="text-[14px] font-bold text-white/60 uppercase tracking-widest">Processing Video...</p>
                        </div>
                      ) : (
                        <OptimizedVideo 
                          playbackId={msg.playbackId || ""}
                          autoPlay={false}
                          muted={true}
                          className={!isUser && !(isSignedIn && profile?.is_subscribed) ? 'filter blur-xl opacity-50' : ''}
                        />
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-1 mt-1">
                    <span className="text-[10px] text-neutral-400">{msg.time}</span>
                    {isUser && <CheckCheck size={14} className="text-pink-500" />}
                  </div>
                </div>
              );
            }

            if (msg.sender === "ai") {
              return (
                <div key={msg.id} className="flex gap-2 items-end max-w-[85%]">
                  <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 shadow-md border border-white/20">
                    <img src="/img/ailani_1.jpg" alt="Ailani" className="w-full h-full object-cover" />
                  </div>
                  <div className="bg-neutral-900 border border-white/10 px-4 py-3 rounded-2xl rounded-bl-none shadow-sm relative min-w-0">
                    <p className="text-[16px] text-white leading-relaxed wrap-break-word whitespace-pre-wrap">{msg.text}</p>
                    <span className="block text-[10px] text-right mt-1 text-neutral-400">{msg.time}</span>
                  </div>
                </div>
              );
            }

            return (
              <div 
                key={msg.id} 
                className="flex flex-col gap-2 items-end relative group"
                onPointerDown={() => startLongPress(msg.id)}
                onPointerUp={endLongPress}
                onPointerLeave={endLongPress}
                onContextMenu={(e) => {
                  e.preventDefault();
                  setLongPressedMessageId(msg.id);
                }}
              >
                <AnimatePresence>
                  {longPressedMessageId === msg.id && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8, y: 10 }}
                      className="absolute -top-12 right-0 z-[60] bg-red-500 text-white px-4 py-2 rounded-xl shadow-2xl flex items-center gap-2 cursor-pointer whitespace-nowrap active:scale-95 transition-transform"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUnsend(msg.id);
                      }}
                    >
                      <Trash2 size={14} className="fill-white/20" />
                      <span className="text-xs font-bold uppercase tracking-widest">Unsend</span>
                    </motion.div>
                  )}
                </AnimatePresence>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setLongPressedMessageId(msg.id === longPressedMessageId ? null : msg.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-white/10 rounded-full text-white/40 hover:text-white shrink-0"
                    title="Message options"
                  >
                    <MoreHorizontal size={18} />
                  </button>
                  <div className="bg-pink-600 text-white px-4 py-3 rounded-2xl rounded-br-none shadow-lg max-w-[80%] min-w-0 group-hover:bg-pink-500 transition-colors">
                    <p className="text-[16px] leading-relaxed wrap-break-word whitespace-pre-wrap">{msg.text}</p>
                    <div className="flex items-center justify-end gap-1 mt-1">
                      <span className="text-[10px] text-white/70">{msg.time}</span>
                      <CheckCheck size={14} className="text-white/90" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          {isUploading && (
            <div className="flex flex-col gap-2 items-end animate-pulse">
              <div className="bg-neutral-800 text-white/50 px-4 py-3 rounded-2xl rounded-br-none border border-white/5">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  <span className="text-xs font-bold uppercase tracking-widest ml-2">Uploading media...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} className="pb-4" />
        </section>
        )}

        {/* Media Tab - Empty State */}
        {activeTab === "media" && (
          <div className="flex-1 flex flex-col items-center justify-center px-8 py-16 text-center gap-4">
            <div className="w-20 h-20 rounded-full bg-neutral-900 border border-white/10 flex items-center justify-center mb-2">
              <svg className="w-9 h-9 text-neutral-600" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3 3h18M3 21h18" />
              </svg>
            </div>
            <h2 className="text-white font-bold text-[20px] leading-snug">This looks a bit empty, isn&apos;t it?</h2>
            <p className="text-neutral-500 text-[14px] leading-relaxed max-w-[260px]">
              Unlock exclusive content from creators. Your media will be waiting here anytime.
            </p>
            
          </div>
        )}

        {/* Bottom Input Bar - only visible on Messages tab */}
        {activeTab === "messages" && (
        <div className="shrink-0 w-full z-50 p-4 bg-linear-to-t from-black via-black/90 to-transparent pb-8">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            accept="image/*,video/*"
            multiple
          />
          <div className={`bg-white/5 backdrop-blur-xl ${previewUrls.length > 0 ? 'rounded-3xl' : 'rounded-full'} p-1.5 flex flex-col gap-2 border border-white/10 shadow-2xl overflow-hidden relative group transition-all duration-300 focus-within:bg-white/10 focus-within:border-white/20`}>
            <AnimatePresence>
              {previewUrls.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="flex gap-2 overflow-x-auto px-2 pt-2 pb-1 scrollbar-hide no-scrollbar"
                >
                  {previewUrls.map((url, index) => (
                    <motion.div 
                      key={url}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="relative w-20 h-20 rounded-2xl overflow-hidden border border-white/20 bg-black/40 shadow-inner shrink-0"
                    >
                      {selectedFiles[index]?.type.startsWith('video/') ? (
                        <video src={url} className="w-full h-full object-cover" />
                      ) : (
                        <img src={url} className="w-full h-full object-cover" alt="Preview" />
                      )}
                      <button 
                        onClick={() => removeFile(index)} 
                        className="absolute top-1 right-1 bg-black/60 backdrop-blur-md rounded-full p-1.5 text-white hover:bg-black/80 transition-colors shadow-lg"
                      >
                        <X size={12} />
                      </button>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
            
            <div className="flex items-center gap-1 w-full">
              <button 
                onClick={handlePlusClick}
                disabled={isUploading}
                className={`w-9 h-9 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-all shrink-0 text-white/60 hover:text-white ${isUploading ? 'opacity-20 cursor-not-allowed' : ''}`}>
                <Plus size={20} className={isUploading ? 'animate-spin' : ''} />
              </button>
              <input 
                className={`flex-1 bg-transparent border-none focus:outline-none focus:ring-0 text-[14px] text-white placeholder:text-white/30 px-2 min-w-0 ${!canChat ? 'opacity-20' : ''}`} 
                placeholder={!canChat ? "Chat locked" : (previewUrls.length > 0 ? "Add a caption..." : "Type something here...")}
                type="text"
                value={input}
                disabled={!canChat}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              />
              {!canChat ? (
                <button 
                  onClick={() => setShowSubModal(true)}
                  className="absolute inset-0 bg-pink-500 hover:bg-pink-600 flex items-center justify-center text-white font-black text-[12px] uppercase tracking-widest transition-all z-20"
                >
                  Subscribe to reply
                </button>
              ) : (
                <button 
                  onClick={handleSend}
                  disabled={!input.trim() && selectedFiles.length === 0}
                  className={`w-9 h-9 flex-none flex items-center justify-center rounded-full transition-all duration-300 relative z-10 ${input.trim() || selectedFiles.length > 0 ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/20 scale-100' : 'bg-transparent text-pink-500/50 scale-90'}`}
                >
                  <Send size={16} className={`${input.trim() || selectedFiles.length > 0 ? 'ml-0.5' : ''} shrink-0`} />
                </button>
              )}
            </div>
          </div>
        </div>
        )}

      </main>
    </div>
  );
}
