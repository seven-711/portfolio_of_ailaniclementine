"use client";

import MuxPlayer from "@mux/mux-player-react";

interface OptimizedVideoProps {
  playbackId: string;
  posterUrl?: string;
  className?: string;
  accentColor?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
}

/**
 * Optimized Video Component (Mux)
 * - Adaptive Bitrate Streaming (HLS)
 * - Automatic thumbnail generation
 * - Mobile optimized
 * - Low buffering
 */
export default function OptimizedVideo({ 
  playbackId, 
  posterUrl, 
  className, 
  accentColor = "#ec4899", // Pink-500
  autoPlay = false,
  muted = false,
  loop = false
}: OptimizedVideoProps) {
  return (
    <div className={`relative overflow-hidden rounded-3xl border border-white/5 shadow-2xl bg-black ${className}`}>
      <MuxPlayer
        playbackId={playbackId}
        metadata={{
          video_title: "Ailani Exclusive Content",
        }}
        poster={posterUrl}
        accentColor={accentColor}
        autoPlay={autoPlay}
        muted={muted}
        loop={loop}
        className="w-full h-full aspect-video"
        streamType="on-demand"
      />
    </div>
  );
}
