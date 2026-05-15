"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ShieldCheck, MessageCircle, Clock, Check, Image as ImageIcon } from "lucide-react";
import { useState } from "react";

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: (option: 'monthly' | 'onetime') => Promise<void>;
}

export default function SubscriptionModal({ isOpen, onClose, onCheckout }: SubscriptionModalProps) {
  const [selectedOption, setSelectedOption] = useState<'monthly' | 'onetime'>('monthly');
  const [subStep, setSubStep] = useState<'options' | 'checkout'>('options');
  const [email, setEmail] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCheckoutClick = async () => {
    setIsProcessing(true);
    try {
      await onCheckout(selectedOption);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center px-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
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
                onClick={onClose}
                className="p-1 text-white/40 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="px-5 pb-5 pt-1">
              {subStep === 'options' ? (
                <>
                  <div className="flex flex-col mb-2">
                    <div className="w-16 h-16 rounded-full overflow-hidden mb-3 border-2 border-white/10">
                      <img src="/img/ailani_1.jpg" alt="Ailani" className="w-full h-full object-cover" />
                    </div>
                    <h2 className="text-xl font-black text-white mb-0.5 uppercase tracking-tight">Ailani Clementine</h2>
                    <div className="flex items-center gap-2 text-white/40">
                      <ImageIcon size={14} />
                      <span className="text-xs font-bold tracking-tighter">Exclusive Content</span>
                    </div>
                  </div>

                  <div className="h-px bg-white/10 w-full mb-4" />

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

                  <div className="flex flex-col items-center gap-3">
                    <button 
                      onClick={() => setSubStep('checkout')}
                      className="w-full bg-pink-500 hover:bg-pink-600 text-white font-black text-xs uppercase tracking-widest py-3.5 rounded-full transition-all active:scale-95 shadow-lg shadow-pink-500/20"
                    >
                      Join now
                    </button>
                    <button 
                      onClick={onClose}
                      className="text-[11px] font-black text-white uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity"
                    >
                      No, thanks
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex flex-col mb-6 pt-2">
                    <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-1">Checkout</h2>
                    <p className="text-[12px] text-white/40 font-bold uppercase tracking-widest">Complete your payment</p>
                  </div>

                  <div className="bg-white/3 rounded-3xl p-6 border border-white/10 mb-6 shadow-inner">
                    <div className="flex flex-col gap-2.5">
                      <div className="flex justify-between items-center text-[13px]">
                        <span className="text-white/40 font-semibold tracking-tight">Subtotal</span>
                        <span className="text-white font-bold">{selectedOption === 'monthly' ? '$14.99' : '$49.99'}</span>
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
                    <input 
                      type="email" 
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white/2 border border-white/10 rounded-2xl px-5 py-4.5 text-white text-[15px] font-medium focus:border-pink-500/50 focus:bg-white/5 outline-none transition-all placeholder:text-white/10"
                    />
                  </div>

                  <div className="flex flex-col items-center gap-5">
                    <button 
                      onClick={handleCheckoutClick}
                      disabled={isProcessing}
                      className="w-full bg-[#0070ba] hover:bg-[#005ea6] text-white font-black text-sm uppercase tracking-widest py-5 rounded-full transition-all active:scale-95 flex items-center justify-center gap-3 shadow-lg shadow-[#0070ba]/20 disabled:opacity-50"
                    >
                      {isProcessing ? (
                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <img src="https://api.iconify.design/logos:paypal.svg?color=white" alt="PayPal" className="h-4.5 brightness-0 invert" />
                          <span>Pay with PayPal</span>
                        </>
                      )}
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
  );
}
