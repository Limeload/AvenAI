"use client";

import { useEffect, useState } from "react";
import Vapi from "@vapi-ai/web";
import Image from "next/image";
import { Message } from "./Message";

interface VoiceChatProps {
  onMessage: (message: Message) => void;
}

export default function VoiceChat({ onMessage }: VoiceChatProps) {
  const [vapi, setVapi] = useState<any>(null);
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_VAPI_API_KEY;
    const assistantId = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID;

    if (!apiKey || !assistantId) {
      console.error("❌ Missing VAPI environment variables");
      return;
    }

    const v = new Vapi(apiKey);

    v.on("message", (data: any) => {
      console.log("📥 Vapi message:", data);
      if (data.type === "transcript" && data.final) {
        onMessage({ sender: "user", text: data.transcript });
      } else if (data.type === "speech") {
        onMessage({ sender: "bot", text: data.transcript });
      }
    });

    v.on("error", (error: any) => {
      console.error("❌ Vapi error:", error);
    });

    setVapi(v);
  }, [onMessage]);

  const toggleRecording = () => {
    if (!vapi) {
      console.error("❌ Vapi not initialized");
      return;
    }

    const assistantId = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID;
    if (!assistantId) {
      console.error("❌ Assistant ID is missing");
      return;
    }

    if (isListening) {
      console.log("🛑 Stopping conversation");
      vapi.stop();
      setIsListening(false);
    } else {
      console.log("🎤 Starting conversation with assistant:", assistantId);
      vapi.start(assistantId); 
      setIsListening(true);
    }
  };

  return (
    <div className="w-64 bg-white rounded-2xl shadow-2xl p-6 flex flex-col items-center justify-center ml-8">
      {/* Assistant Avatar */}
      <div className="w-full flex justify-center mb-4">
        <Image
          src="/assistant-avatar.png"
          alt="Assistant Avatar"
          width={180}
          height={180}
          className="object-cover"
          style={{ borderRadius: 0 }}
        />
      </div>
      <button
        onClick={toggleRecording}
        className={`w-16 h-16 rounded-full shadow flex items-center justify-center text-3xl transition-all duration-200
          border-2 border-black
          ${isListening ? "bg-gray-300 text-black scale-110" : "bg-black text-white hover:bg-gray-800 hover:scale-105"}
        `}
        title={isListening ? "Stop voice input" : "Start voice input"}
        style={{ outline: 'none' }}
      >
        🎤
      </button>
      <div className="mt-4 text-center text-black font-semibold text-lg">Voice Assistant</div>
    </div>
  );
}
