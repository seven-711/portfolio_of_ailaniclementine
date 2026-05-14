"use client";

import { useSignUp } from "@clerk/nextjs";
import { useState, FormEvent } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Mail } from "lucide-react";

export default function VerifyPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const signUpHook = useSignUp() as any;
  const signUp = signUpHook?.signUp ?? signUpHook;
  const router = useRouter();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleVerify = async (e: FormEvent) => {
    e.preventDefault();
    if (!signUp) return;
    setError("");
    setLoading(true);
    try {
      const result = await signUp.attemptEmailAddressVerification({ code });
      if (result.status === "complete") {
        router.push("/profile");
      }
    } catch (err: unknown) {
      const clerkErr = err as { errors?: { message: string }[] };
      setError(clerkErr?.errors?.[0]?.message ?? "Invalid code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center">
      <div className="w-full max-w-md min-h-screen flex flex-col px-6 pt-12 pb-10">

        <Link href="/join" className="flex items-center gap-1 text-neutral-500 hover:text-white transition-colors text-sm mb-12">
          <ChevronLeft size={16} /> Back
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center text-center gap-4 mb-8"
        >
          <div className="w-16 h-16 rounded-2xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center">
            <Mail size={28} className="text-pink-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Check your email</h1>
            <p className="text-neutral-400 text-sm mt-2 leading-relaxed max-w-[240px] mx-auto">
              We sent a 6-digit verification code to your email address.
            </p>
          </div>
        </motion.div>

        <motion.form
          onSubmit={handleVerify}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/4.5 backdrop-blur-2xl border border-white/10 rounded-3xl p-5 flex flex-col gap-4"
        >
          <div className="flex flex-col gap-2">
            <label className="text-neutral-400 text-[11px] font-semibold uppercase tracking-wider pl-1">Verification code</label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="000000"
              maxLength={6}
              required
              className="w-full h-14 px-4 rounded-2xl bg-white/6 border border-white/10 text-white text-center text-2xl font-bold tracking-[0.4em] placeholder:text-neutral-700 focus:outline-none focus:border-pink-500/50 transition-colors"
            />
          </div>

          {error && <p className="text-red-400 text-xs text-center">{error}</p>}

          <motion.button
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading || code.length < 6}
            className="w-full h-12 rounded-2xl bg-pink-500 hover:bg-pink-600 disabled:opacity-50 text-white font-bold text-sm tracking-wide transition-colors shadow-lg shadow-pink-500/25 flex items-center justify-center"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : "Verify & continue"}
          </motion.button>
        </motion.form>

        <p className="text-neutral-600 text-xs text-center mt-5">
          Didn&apos;t receive it?{" "}
          <button
            onClick={() => signUp?.prepareEmailAddressVerification?.({ strategy: "email_code" })}
            className="text-pink-400 font-semibold hover:text-pink-300 transition-colors"
          >
            Resend code
          </button>
        </p>

      </div>
    </div>
  );
}
