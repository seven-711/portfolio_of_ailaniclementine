"use client";

import { useClerk, useUser } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  CreditCard, 
  Bell, 
  Shield, 
  HelpCircle, 
  LogOut, 
  EyeOff, 
  Moon, 
  Languages,
  ChevronRight,
  ChevronLeft,
  UserCircle,
  ShieldCheck,
  Trash2,
  Eye,
  AlertTriangle,
  Wallet,
  RefreshCw,
  History,
  CheckCircle2,
  Smile,
  CircleDollarSign
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

type SettingsView = "main" | "account" | "account-info" | "security" | "delete-account" | "payments" | "paypal-options" | "manage-subscriptions" | "transaction-history";

export default function SettingsPage() {
  const { signOut } = useClerk();
  const { user, isLoaded } = useUser();
  const router = useRouter();
  
  const [view, setView] = useState<SettingsView>("main");
  const [nsfw, setNsfw] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Password Visibility State
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  // Payment Selection
  const [selectedPlan, setSelectedPlan] = useState<"one-time" | "monthly" | null>(null);

  const handleLogout = async () => {
    await signOut();
    router.push("/");
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    try {
      setIsDeleting(true);
      await user.delete();
      router.push("/");
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("Failed to delete account. You might need to re-authenticate first.");
      setIsDeleting(false);
    }
  };

  const handleBack = () => {
    if (view === "account-info" || view === "security" || view === "delete-account") setView("account");
    else if (view === "paypal-options" || view === "manage-subscriptions" || view === "transaction-history") setView("payments");
    else if (view === "account" || view === "payments") setView("main");
    else router.back();
  };

  if (!isLoaded) return null;

  return (
    <div className="min-h-screen bg-black text-white flex justify-center font-sans overflow-x-hidden">
      <div className="w-full max-w-md min-h-screen flex flex-col relative bg-[#121212] border-x border-white/5 shadow-2xl pb-24 overflow-y-auto scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        
        {/* Dynamic Header */}
        <header className="px-6 pt-8 pb-6 flex items-center">
          <button 
            onClick={handleBack}
            className="p-2 -ml-2 rounded-full hover:bg-white/5 transition-colors mr-2"
          >
            <ChevronLeft size={24} />
          </button>
          <div className="text-2xl font-bold flex items-center gap-2 overflow-hidden h-8 relative w-full">
            <AnimatePresence mode="popLayout">
              {view === "main" && (
                <motion.span key="main-title" initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-white absolute left-0">Settings</motion.span>
              )}
              {(view === "account" || view === "account-info" || view === "security" || view === "delete-account") && (
                <motion.span key="account-breadcrumb" initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="flex items-center gap-2 absolute left-0 w-full">
                  <button onClick={() => setView("main")} className="text-white/40 whitespace-nowrap hover:text-white/60 transition-colors">Settings /</button>
                  {view === "account" ? (
                    <span className="text-white whitespace-nowrap">Account</span>
                  ) : (
                    <>
                      <button onClick={() => setView("account")} className="text-white/40 whitespace-nowrap hover:text-white/60 transition-colors">Account /</button>
                      <span className="text-white whitespace-nowrap truncate max-w-[120px]">{view === "account-info" ? "Info" : view === "security" ? "Security" : "Delete"}</span>
                    </>
                  )}
                </motion.span>
              )}
              {(view === "payments" || view === "paypal-options" || view === "manage-subscriptions" || view === "transaction-history") && (
                <motion.span key="payments-breadcrumb" initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="flex items-center gap-2 absolute left-0 w-full">
                  <button onClick={() => setView("main")} className="text-white/40 whitespace-nowrap hover:text-white/60 transition-colors">Settings /</button>
                  {view === "payments" ? (
                    <span className="text-white whitespace-nowrap truncate max-w-[150px]">Payments and subscriptions</span>
                  ) : (
                    <>
                      <button onClick={() => setView("payments")} className="text-white/40 whitespace-nowrap hover:text-white/60 transition-colors">Payments /</button>
                      <span className="text-white whitespace-nowrap truncate max-w-[120px]">{view === "paypal-options" ? "PayPal" : view === "manage-subscriptions" ? "Subscriptions" : "History"}</span>
                    </>
                  )}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </header>

        <main className="flex-1 relative">
          <AnimatePresence mode="popLayout" initial={false}>
            {view === "main" && (
              <motion.div key="main" initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ type: "spring", damping: 25, stiffness: 300 }} className="px-4 flex flex-col gap-8 w-full">
                <section>
                  <div className="bg-[#1a1a1a] rounded-3xl overflow-hidden border border-white/5">
                    <SettingsItem icon={<User size={20} />} label="Account" onClick={() => setView("account")} />
                    <SettingsItem icon={<CreditCard size={20} />} label="Payments and subscriptions" onClick={() => setView("payments")} />
                    <SettingsItem icon={<HelpCircle size={20} />} label="Help, terms and support" />
                    <button onClick={handleLogout} className="w-full flex items-center gap-4 px-5 py-4 hover:bg-white/2 transition-colors group">
                      <div className="text-red-500"><LogOut size={20} /></div>
                      <span className="text-red-500 font-semibold">Log out</span>
                    </button>
                  </div>
                </section>
                <section>
                  <h2 className="px-2 mb-3 text-lg font-bold">Display & Language</h2>
                  <div className="bg-[#1a1a1a] rounded-3xl overflow-hidden border border-white/5">
                    <ToggleItem icon={<EyeOff size={20} />} label="NSFW Contents" active={nsfw} onToggle={() => setNsfw(!nsfw)} />
                    <ToggleItem icon={<Moon size={20} />} label="Dark mode" active={darkMode} onToggle={() => setDarkMode(!darkMode)} />
                    <div className="flex items-center justify-between px-5 py-4 hover:bg-white/2 transition-colors cursor-pointer group">
                      <div className="flex items-center gap-4">
                        <div className="text-white/60"><Languages size={20} /></div>
                        <span className="font-semibold">Language</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-white/40">GB English</span>
                        <ChevronRight size={16} className="text-white/20" />
                      </div>
                    </div>
                  </div>
                </section>
              </motion.div>
            )}

            {view === "account" && (
              <motion.div key="account" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="px-4 w-full">
                <div className="bg-[#1a1a1a] rounded-3xl overflow-hidden border border-white/5">
                  <SettingsItem icon={<UserCircle size={20} />} label="Account Info" onClick={() => setView("account-info")} />
                  <SettingsItem icon={<ShieldCheck size={20} />} label="Password and security settings" onClick={() => setView("security")} />
                  <SettingsItem icon={<Trash2 size={20} />} label="Delete my account" onClick={() => setView("delete-account")} isDestructive />
                </div>
              </motion.div>
            )}

            {view === "account-info" && (
              <motion.div key="account-info" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="px-4 flex flex-col gap-6 w-full">
                <div className="bg-[#1a1a1a] rounded-3xl overflow-hidden border border-white/5">
                  <div className="flex items-center justify-between px-6 py-5 border-b border-white/5 gap-4">
                    <span className="font-bold text-white shrink-0">Email</span>
                    <span className="text-white/60 text-sm truncate text-right">{user?.primaryEmailAddress?.emailAddress}</span>
                  </div>
                  <div className="flex items-center justify-between px-6 py-5 gap-4">
                    <span className="font-bold text-white shrink-0">Joined</span>
                    <span className="text-white/60 text-sm truncate text-right">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "5/14/2026"}</span>
                  </div>
                </div>
              </motion.div>
            )}

            {view === "security" && (
              <motion.div key="security" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="px-4 flex flex-col gap-6 w-full">
                <h2 className="px-2 text-lg font-bold">Add a Password</h2>
                <div className="bg-[#1a1a1a] rounded-3xl p-6 border border-white/5 flex flex-col gap-6">
                  <div className="flex flex-col gap-3">
                    <label className="text-sm font-bold text-white ml-1">New Password</label>
                    <div className="relative">
                      <input type={showNewPass ? "text" : "password"} placeholder="New Password" className="w-full bg-[#262626] border border-white/5 rounded-2xl py-4 px-5 text-white placeholder:text-white/20 focus:outline-hidden focus:border-white/20 transition-all" />
                      <button onClick={() => setShowNewPass(!showNewPass)} className="absolute right-5 top-1/2 -translate-y-1/2 text-white/40">{showNewPass ? <EyeOff size={20} /> : <Eye size={20} />}</button>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3">
                    <label className="text-sm font-bold text-white ml-1">Confirm New Password</label>
                    <div className="relative">
                      <input type={showConfirmPass ? "text" : "password"} placeholder="Confirm New Password" className="w-full bg-[#262626] border border-white/5 rounded-2xl py-4 px-5 text-white placeholder:text-white/20 focus:outline-hidden focus:border-white/20 transition-all" />
                      <button onClick={() => setShowConfirmPass(!showConfirmPass)} className="absolute right-5 top-1/2 -translate-y-1/2 text-white/40">{showConfirmPass ? <EyeOff size={20} /> : <Eye size={20} />}</button>
                    </div>
                  </div>
                  <button className="bg-white text-black font-bold py-4 px-8 rounded-full w-fit mt-2">Add Password</button>
                </div>
              </motion.div>
            )}

            {view === "delete-account" && (
              <motion.div key="delete-account" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="px-4 flex flex-col gap-6 w-full">
                <div className="px-2 flex flex-col gap-2">
                  <h2 className="text-[15px] font-bold uppercase">PERMANENTLY DELETE your Ailani account with all your data?</h2>
                  <p className="text-[15px] font-bold">All data associated with your Ailani account will be permanently deleted.</p>
                </div>
                <div className="bg-[#1a1a1a] rounded-3xl p-6 border border-white/5 flex flex-col gap-6">
                  <div className="bg-[#4a2e1a] rounded-2xl p-4 flex items-center gap-4 border border-[#6a4a2a]">
                    <div className="text-[#ff9d00]"><AlertTriangle size={24} fill="currentColor" className="text-[#4a2e1a]" /></div>
                    <span className="text-[#ff9d00] font-bold text-sm">Warning, this cannot be undone!</span>
                  </div>
                  <button onClick={handleDeleteAccount} disabled={isDeleting} className="bg-[#ff6b7a] text-white font-bold py-4 px-8 rounded-full w-fit hover:bg-[#ff5a6a] transition-all disabled:opacity-50">{isDeleting ? "Deleting..." : "Delete Account"}</button>
                </div>
              </motion.div>
            )}

            {view === "payments" && (
              <motion.div key="payments" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="px-4 w-full">
                <div className="bg-[#1a1a1a] rounded-3xl overflow-hidden border border-white/5">
                  <SettingsItem icon={<Wallet size={20} />} label="Wallet & payments" onClick={() => setView("paypal-options")} />
                  <SettingsItem icon={<RefreshCw size={20} />} label="Manage my subscriptions" onClick={() => setView("manage-subscriptions")} />
                  <SettingsItem icon={<History size={20} />} label="Transaction history" onClick={() => setView("transaction-history")} />
                </div>
              </motion.div>
            )}

            {view === "transaction-history" && (
              <motion.div key="transaction-history" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="px-4 flex flex-col gap-6 w-full">
                <div className="px-2">
                  <h2 className="text-lg font-bold">May 14, 2026</h2>
                </div>
                <div className="bg-[#1a1a1a] rounded-3xl p-6 border border-white/5 flex items-center justify-between group hover:bg-white/2 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="text-white/60">
                      <CircleDollarSign size={24} strokeWidth={1.5} />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-white">Card registration fee</span>
                      <span className="text-white/40 text-sm">Paid • 10:43</span>
                    </div>
                  </div>
                  <span className="text-xl font-bold">$0.00</span>
                </div>
              </motion.div>
            )}

            {view === "manage-subscriptions" && (
              <motion.div key="manage-subscriptions" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="px-4 flex flex-col items-center justify-center pt-12 text-center w-full">
                <div className="mb-6 opacity-40"><Smile size={100} strokeWidth={1} /></div>
                <h2 className="text-3xl font-bold mb-3">No subscriptions found</h2>
                <p className="text-white/60 text-sm mb-8 max-w-[280px]">You're currently not subscribed to Ailani! Subscribe to Ailani to see her content.</p>
                <button onClick={() => setView("paypal-options")} className="bg-white text-black font-bold py-4 px-12 rounded-full hover:bg-white/90 active:scale-95 transition-all w-full max-w-[320px]">Subscribe to Ailani</button>
              </motion.div>
            )}

            {view === "paypal-options" && (
              <motion.div key="paypal" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="px-4 flex flex-col gap-6 w-full">
                <div className="px-2">
                  <h2 className="text-xl font-bold mb-1">Select Subscription Plan</h2>
                  <p className="text-white/40 text-sm">Choose how you'd like to support Ailani</p>
                </div>
                <div className="flex flex-col gap-4">
                  <button onClick={() => setSelectedPlan("one-time")} className={`bg-[#1a1a1a] rounded-3xl p-6 border transition-all text-left relative overflow-hidden group ${selectedPlan === 'one-time' ? 'border-[#ffb2ba] ring-1 ring-[#ffb2ba]' : 'border-white/5 hover:border-white/10'}`}>
                    <div className="flex justify-between items-start mb-4">
                      <div><h3 className="text-lg font-bold">One-time Support</h3><p className="text-white/40 text-sm">Full access, no recurring charges</p></div>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${selectedPlan === 'one-time' ? 'border-[#ffb2ba] bg-[#ffb2ba]' : 'border-white/10'}`}>{selectedPlan === 'one-time' && <CheckCircle2 size={16} className="text-black" />}</div>
                    </div>
                    <div className="flex items-baseline gap-1"><span className="text-3xl font-black">$49.99</span><span className="text-white/40 text-sm">one-time</span></div>
                    {selectedPlan === 'one-time' && <motion.div layoutId="plan-glow" className="absolute inset-0 bg-[#ffb2ba]/5 pointer-events-none" />}
                  </button>
                  <button onClick={() => setSelectedPlan("monthly")} className={`bg-[#1a1a1a] rounded-3xl p-6 border transition-all text-left relative overflow-hidden group ${selectedPlan === 'monthly' ? 'border-[#ffb2ba] ring-1 ring-[#ffb2ba]' : 'border-white/5 hover:border-white/10'}`}>
                    <div className="flex justify-between items-start mb-4">
                      <div><h3 className="text-lg font-bold">Monthly Subscription</h3><p className="text-white/40 text-sm">Support Ailani month-to-month</p></div>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${selectedPlan === 'monthly' ? 'border-[#ffb2ba] bg-[#ffb2ba]' : 'border-white/10'}`}>{selectedPlan === 'monthly' && <CheckCircle2 size={16} className="text-black" />}</div>
                    </div>
                    <div className="flex items-baseline gap-1"><span className="text-3xl font-black">$14.99</span><span className="text-white/40 text-sm">/month</span></div>
                    {selectedPlan === 'monthly' && <motion.div layoutId="plan-glow" className="absolute inset-0 bg-[#ffb2ba]/5 pointer-events-none" />}
                  </button>
                </div>
                <div className="bg-[#1a1a1a] rounded-3xl p-6 border border-white/5 flex flex-col gap-6 mt-2">
                  <div className="flex items-center gap-3"><img src="https://api.iconify.design/logos:paypal.svg" alt="PayPal" className="h-6" /><span className="text-white/60 font-semibold">PayPal Secure Checkout</span></div>
                  <button disabled={!selectedPlan} className="w-full bg-[#ffb2ba] hover:bg-[#ffa0aa] text-black font-bold py-4 rounded-full transition-all disabled:opacity-30 disabled:grayscale">Proceed to PayPal</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

function SettingsItem({ icon, label, onClick, isDestructive }: { icon?: React.ReactNode, label: string, onClick?: () => void, isDestructive?: boolean }) {
  return (
    <button onClick={onClick} className="w-full flex items-center justify-between px-5 py-4 border-b border-white/5 last:border-0 hover:bg-white/2 transition-colors group overflow-hidden">
      <div className="flex items-center gap-4 overflow-hidden flex-1">
        {icon && (
          <div className={`${isDestructive ? 'text-red-500' : 'text-white/60 group-hover:text-white'} transition-colors shrink-0`}>
            {icon}
          </div>
        )}
        <span className={`font-semibold ${isDestructive ? 'text-red-500' : 'text-white/90 group-hover:text-white'} transition-colors truncate text-left`}>
          {label}
        </span>
      </div>
      <ChevronRight size={16} className={`${isDestructive ? 'text-red-500/40' : 'text-white/20 group-hover:text-white'} transition-colors shrink-0 ml-2`} />
    </button>
  );
}

function ToggleItem({ icon, label, active, onToggle }: { icon: React.ReactNode, label: string, active: boolean, onToggle: () => void }) {
  return (
    <div className="flex items-center justify-between px-5 py-4 border-b border-white/5 last:border-0 gap-4 overflow-hidden">
      <div className="flex items-center gap-4 overflow-hidden flex-1">
        <div className="text-white/60 shrink-0">{icon}</div>
        <span className="font-semibold truncate">{label}</span>
      </div>
      <button 
        onClick={onToggle}
        className={`w-12 h-6 rounded-full relative transition-colors duration-200 ${active ? 'bg-[#00ff00]' : 'bg-[#333333]'}`}
      >
        <motion.div animate={{ x: active ? 26 : 2 }} initial={false} className="absolute top-1 left-0 w-4 h-4 bg-white rounded-full shadow-sm" />
      </button>
    </div>
  );
}
