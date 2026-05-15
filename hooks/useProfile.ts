import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export function useProfile() {
  const { user, isLoaded } = useUser();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded || !user) {
      if (isLoaded && !user) setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        // Try to get existing profile
        let { data, error } = await supabase
          .from("profiles") // Reverted to plural
          .select("*")
          .eq("id", user.id)
          .single();

        if (error && error.code === "PGRST116") {
          // Profile doesn't exist, create it
          const { data: newProfile, error: createError } = await supabase
            .from("profiles") // Reverted to plural
            .insert([
              { 
                id: user.id, 
                email: user.primaryEmailAddress?.emailAddress,
                is_subscribed: false,
                is_following: false,
                subscription_status: 'free'
              },
            ])
            .select()
            .single();

          if (createError) {
            console.error("Create profile error:", createError);
            throw createError;
          }
          data = newProfile;
        } else if (error) {
          throw error;
        }

        setProfile(data);
      } catch (err) {
        console.error("Error fetching/creating profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, isLoaded]);

  const updateSubscription = async (isSubscribed: boolean, status: string = 'active') => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from("profiles") // Reverted to plural
        .update({ 
          is_subscribed: isSubscribed,
          subscription_status: status,
          updated_at: new Date().toISOString()
        })
        .eq("id", user.id)
        .select()
        .single();

      if (error) throw error;
      setProfile(data);
      return data;
    } catch (err) {
      console.error("Error updating subscription:", err);
      throw err;
    }
  };

  const toggleFollow = async (isFollowing: boolean) => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from("profiles")
        .update({ 
          is_following: isFollowing,
          updated_at: new Date().toISOString()
        })
        .eq("id", user.id)
        .select()
        .single();

      if (error) throw error;
      setProfile(data);
      return data;
    } catch (err) {
      console.error("Error updating follow status:", err);
      throw err;
    }
  };

  return { profile, loading, user, updateSubscription, toggleFollow };
}
