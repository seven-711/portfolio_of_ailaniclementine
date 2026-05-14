"use client";

import { useSearchParams } from "next/navigation";
import { useSignIn, useSignUp, useClerk } from "@clerk/nextjs";
import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronLeft, Star, Lock, Sparkles, Eye, EyeOff } from "lucide-react";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function JoinPage() {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");
  const isSignIn = mode === "signin";

  const router = useRouter();
  const clerk = useClerk();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const signInHook = useSignIn() as any;
  const signIn = signInHook?.signIn ?? signInHook;
  const signInLoaded = signInHook?.isLoaded ?? !!signIn;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const signUpHook = useSignUp() as any;
  const signUp = signUpHook?.signUp ?? signUpHook;
  const signUpLoaded = signUpHook?.isLoaded ?? !!signUp;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Google OAuth
  const handleGoogleAuth = async () => {
    try {
      // Defensive approach to handle different Clerk versions
      const target = isSignIn ? signIn : signUp;
      const authProvider: any = target || clerk;
      
      const authMethod = 
        authProvider?.authenticateWithRedirect || 
        authProvider?.signIn?.authenticateWithRedirect || 
        authProvider?.signUp?.authenticateWithRedirect ||
        clerk?.client?.signIn?.authenticateWithRedirect;

      if (typeof authMethod !== 'function') {
        throw new Error("Authentication method not found");
      }

      await authMethod.call(authProvider?.signIn || authProvider?.signUp || authProvider, {
        strategy: "oauth_google",
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/profile",
      });
    } catch (err) {
      console.error("Google Auth Error:", err);
      setError("Failed to start Google authentication. Please try again.");
    }
  };

  // Email / password
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isSignIn) {
        if (!signIn) return;
        const result = await signIn.create({ identifier: email, password });
        if (result.status === "complete") {
          router.push("/profile");
        }
      } else {
        if (!signUp) return;
        await signUp.create({ emailAddress: email, password });
        await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
        router.push("/join/verify");
      }
    } catch (err: any) {
      const clerkErr = err as { errors?: { message: string }[] };
      setError(clerkErr?.errors?.[0]?.message ?? "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center overflow-hidden">
      <div className="w-full max-w-md min-h-screen flex flex-col relative">

        {/* Cinematic background */}
        <div className="absolute inset-0 -z-10">
          <img src="/img/ailani_3.jpg" alt="" className="w-full h-full object-cover object-top opacity-25" />
          <div className="absolute inset-0 bg-linear-to-b from-black/50 via-black/75 to-black" />
          <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent" />
        </div>

        {/* Ambient glow */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.12, 0.22, 0.12] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-80px] right-[-60px] w-72 h-72 rounded-full bg-pink-500 blur-[110px] -z-10 pointer-events-none"
        />
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.06, 0.14, 0.06] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 3 }}
          className="absolute bottom-24 left-[-60px] w-60 h-60 rounded-full bg-pink-600 blur-[90px] -z-10 pointer-events-none"
        />

        {/* Back button */}
        <div className="flex items-center px-5 pt-12 pb-0">
          <Link href="/profile" className="flex items-center gap-1 text-neutral-500 hover:text-white transition-colors text-sm">
            <ChevronLeft size={16} />
            <span>Back</span>
          </Link>
        </div>

        {/* Page content */}
        <div className="flex-1 flex flex-col px-6 pt-8 pb-10 gap-6 overflow-y-auto">

          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="flex flex-col items-center text-center gap-4"
          >
            <div className="relative">
              <motion.div
                animate={{ scale: [1, 1.04, 1] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                className="w-[88px] h-[88px] rounded-[26px] overflow-hidden border-2 border-pink-500/50 shadow-[0_0_40px_rgba(236,72,153,0.25)]"
              >
                <img src="/img/ailani_1.jpg" alt="Ailani" className="w-full h-full object-cover" />
              </motion.div>
              <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black/80 border border-white/10 rounded-full px-2.5 py-[3px] flex items-center gap-1.5 backdrop-blur-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_5px_rgba(52,211,153,0.7)]" />
                <span className="text-[10px] font-semibold text-emerald-400 tracking-wide">Online now</span>
              </div>
            </div>

            <div className="mt-1">
              <h1 className="text-[26px] font-bold tracking-tight leading-snug">
                {isSignIn ? (
                  <>Welcome back <span className="text-pink-500">✦</span></>
                ) : (
                  <>Unlock <span className="text-pink-500">Ailani&apos;s</span><br />exclusive world</>
                )}
              </h1>
              <p className="text-neutral-400 text-[13px] leading-relaxed mt-1.5">
                {isSignIn
                  ? "Sign in to access your exclusive content."
                  : "Join 1.2K+ members. It's completely free."}
              </p>
            </div>

            {!isSignIn && (
              <div className="flex items-center gap-2 flex-wrap justify-center">
                <span className="flex items-center gap-1.5 bg-white/5 border border-white/8 rounded-full px-3 py-1.5 text-[11px] text-neutral-300 font-medium">
                  <Star size={10} className="text-yellow-400 fill-yellow-400" /> 4.9 rating
                </span>
                <span className="flex items-center gap-1.5 bg-white/5 border border-white/8 rounded-full px-3 py-1.5 text-[11px] text-neutral-300 font-medium">
                  <Lock size={10} className="text-pink-400" /> Private & secure
                </span>
                <span className="flex items-center gap-1.5 bg-white/5 border border-white/8 rounded-full px-3 py-1.5 text-[11px] text-neutral-300 font-medium">
                  <Sparkles size={10} className="text-pink-400" /> Exclusive drops
                </span>
              </div>
            )}
          </motion.div>

          {/* Auth card */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18 }}
            className="bg-white/4.5 backdrop-blur-2xl border border-white/10 rounded-3xl p-5 flex flex-col gap-4 shadow-2xl"
          >
            {/* Google */}
            <button
              type="button"
              onClick={handleGoogleAuth}
              className="w-full h-12 flex items-center justify-center gap-3 bg-white rounded-2xl text-black font-bold text-sm hover:bg-neutral-100 active:scale-[0.98] transition-all shadow-md"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" fill="#34A853"/>
                <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-white/8" />
              <span className="text-neutral-600 text-[11px] font-medium">or</span>
              <div className="flex-1 h-px bg-white/8" />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-2">
              <label className="text-neutral-400 text-[11px] font-semibold uppercase tracking-wider pl-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full h-12 px-4 rounded-2xl bg-white/6 border border-white/10 text-white placeholder:text-neutral-600 text-sm focus:outline-none focus:border-pink-500/50 transition-colors"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center pl-1 pr-1">
                <label className="text-neutral-400 text-[11px] font-semibold uppercase tracking-wider">Password</label>
                {isSignIn && (
                  <button type="button" className="text-pink-400 text-[11px] font-medium hover:text-pink-300 transition-colors">
                    Forgot?
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full h-12 px-4 pr-12 rounded-2xl bg-white/6 border border-white/10 text-white placeholder:text-neutral-600 text-sm focus:outline-none focus:border-pink-500/50 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* CAPTCHA container for custom flow */}
            <div id="clerk-captcha" className="empty:hidden" />

            {/* Error message */}
            {error && (
              <p className="text-red-400 text-xs text-center px-1 -mt-1">{error}</p>
            )}

            {/* Submit */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-2xl bg-pink-500 hover:bg-pink-600 disabled:opacity-60 text-white font-bold text-sm tracking-wide transition-colors shadow-lg shadow-pink-500/25 mt-1 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                isSignIn ? "Sign in" : "Unlock content"
              )}
            </motion.button>
          </motion.form>

          {/* Toggle mode */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="text-center text-neutral-500 text-xs"
          >
            {isSignIn ? (
              <>Don&apos;t have an account?{" "}
                <Link href="/join" className="text-pink-400 font-semibold hover:text-pink-300 transition-colors">
                  Join for free
                </Link>
              </>
            ) : (
              <>Already have an account?{" "}
                <Link href="/join?mode=signin" className="text-pink-400 font-semibold hover:text-pink-300 transition-colors">
                  Sign in
                </Link>
              </>
            )}
          </motion.p>

          {/* Legal */}
          <p className="text-neutral-700 text-[10px] text-center max-w-[260px] mx-auto leading-relaxed -mt-2">
            By continuing you confirm you are 18+ and agree to our Terms of Service.
          </p>

        </div>
      </div>
    </div>
  );
}
