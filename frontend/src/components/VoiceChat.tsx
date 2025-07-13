"use client";

import { useEffect, useState } from "react";
import Vapi from "@vapi-ai/web";

type Message = {
  sender: "user" | "bot";
  text: string;
};

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
      vapi.start(assistantId); // ✅ Correct for current SDK
      setIsListening(true);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <button
        onClick={toggleRecording}
        className={`w-16 h-16 rounded-full shadow-lg transition ${
          isListening ? "bg-red-500" : "bg-blue-600"
        } hover:scale-110`}
        title={isListening ? "Stop voice input" : "Start voice input"}
      >
        🎤
      </button>
    </div>
  );
}
