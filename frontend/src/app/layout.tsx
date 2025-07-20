import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "AI Voice Assistant",
  description: "An intelligent voice-powered chatbot powered by Vapi, OpenAI, and Pinecone.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const assistantId = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID;
  const publicKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY;
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased bg-gray-50 text-gray-900`}>
        {children}
      </body>
    </html>
  );
}
