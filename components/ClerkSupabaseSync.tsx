"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function ClerkSupabaseSync() {
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (!isLoaded || !user) return;

    const syncUser = async () => {
      console.log("Supabase Sync: Checking for user", user.id);
      try {
        const { data: existingProfile, error: fetchError } = await supabase
          .from("profiles") // Reverted to plural
          .select("id")
          .eq("id", user.id)
          .single();

        if (fetchError && fetchError.code !== "PGRST116") {
          console.error("Supabase Sync: Fetch error:", fetchError);
          return;
        }

        if (!existingProfile) {
          console.log("Supabase Sync: User not found, creating profile...");
          const { error: insertError } = await supabase
            .from("profiles") // Reverted to plural
            .insert([
              { 
                id: user.id, 
                email: user.primaryEmailAddress?.emailAddress,
                is_subscribed: false,
                subscription_status: 'free'
              },
            ]);
          
          if (insertError) {
            console.error("Supabase Sync: Insert error:", insertError);
          } else {
            console.log("Supabase Sync: Success! User synced.");
          }
        } else {
          console.log("Supabase Sync: User already exists.");
        }
      } catch (err) {
        console.error("Supabase Sync: Unexpected error:", err);
      }
    };

    syncUser();
  }, [user, isLoaded]);

  return null; // This component doesn't render anything
}
