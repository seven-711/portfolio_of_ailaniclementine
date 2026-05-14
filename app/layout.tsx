import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import Script from "next/script";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "LuvAI - Subscription",
  description: "LuvAI Subscription Plan",
};

import BottomNav from "@/components/BottomNav";
import OneSignalHandler from "@/components/OneSignalHandler";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider 
      signInForceRedirectUrl="/profile" 
      signUpForceRedirectUrl="/profile"
    >
      <html
        lang="en"
        className={`${poppins.variable} h-full antialiased`}
      >
        <head>
          <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
          <Script
            src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js"
            strategy="beforeInteractive"
            defer
          />
          <Script id="onesignal-init" strategy="afterInteractive">
            {`
              window.OneSignal = window.OneSignal || [];
              OneSignal.push(function() {
                OneSignal.init({
                appId: "${process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID}",
                  safari_web_id: "YOUR_SAFARI_WEB_ID", // TODO: Optional
                  notifyButton: {
                    enable: true,
                  },
                });
              });
            `}
          </Script>
        </head>
        <body className="min-h-full flex flex-col bg-black text-white">
          <OneSignalHandler />
          {children}
          <BottomNav />
        </body>
      </html>
    </ClerkProvider>
  );
}
