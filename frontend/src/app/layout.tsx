import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ElectraLearn | Electoral Intelligence & Democratic Education",
  description: "Advanced autonomous intelligence platform for the Indian Democratic Process. Explore real-time constituency insights, AI-driven education, and immersive election simulations.",
  icons: {
    icon: "/favicon.ico",
  },
};

import { Suspense } from "react";
import { FloatingChatButton } from "@/components/ui/FloatingChatButton";
import ConditionalFooter from "@/components/layout/ConditionalFooter";
import { AuthProvider } from "@/context/AuthContext";
import { Navbar } from "@/components/layout/Navbar";
import GAIntegration from "@/components/GoogleAnalytics";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script src="https://accounts.google.com/gsi/client" async defer></script>
      </head>
      <body className="min-h-full flex flex-col">
        <Suspense fallback={null}>
          <GAIntegration gaId={process.env.NEXT_PUBLIC_GA_ID || "G-ELECTION2026"} />
        </Suspense>
        <AuthProvider>
          <Navbar />
          {children}
          <ConditionalFooter />
          <FloatingChatButton />
        </AuthProvider>
      </body>
    </html>
  );
}
