import Mux from '@mux/mux-node';
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Configure Mux directly in the API route
const muxClient = new Mux({
  tokenId: process.env.MUX_TOKEN_ID!,
  tokenSecret: process.env.MUX_TOKEN_SECRET!,
});

const { video } = muxClient;

export async function POST() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Create a new direct upload URL
    const upload = await video.uploads.create({
      cors_origin: "*", 
      new_asset_settings: {
        playback_policy: ["public"],
        mp4_support: "standard",
      },
    });

    return NextResponse.json({
      url: upload.url,
      id: upload.id,
    });
  } catch (error) {
    console.error("[MUX_UPLOAD_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
