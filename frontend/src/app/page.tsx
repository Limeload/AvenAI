"use client";

import Image from "next/image";
import ChatBox from "@/components/ChatBox";
import VoiceAssistant from "@/components/VoiceAssistant";

export default function AskPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
      <div className="mt-0 mb-6">
        <Image src="/aven-logo.png" alt="Aven Logo" width={180} height={72} priority />
      </div>
      <div className="flex flex-row gap-8">
        <div className="w-[600px] h-[700px] bg-white rounded-2xl shadow-2xl flex flex-col justify-center items-center">
          <ChatBox />
        </div>
        <div className="w-[600px] h-[700px] bg-white rounded-2xl shadow-2xl flex flex-col justify-center items-center">
          <VoiceAssistant />
        </div>
      </div>
    </div>
  );
}
