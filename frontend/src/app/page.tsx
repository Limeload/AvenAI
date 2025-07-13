"use client";

<<<<<<< HEAD
import ChatBox from "@/components/ChatBox";

export default function AskPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
       <ChatBox />;
=======
import { useState } from "react";
import ChatBox from "@/components/ChatBox";
import VoiceChat from "@/components/VoiceChat";

// Import the Message type from ChatBox
import type { Message } from "@/components/ChatBox";

export default function AskPage() {
  const [messages, setMessages] = useState<Message[]>([]);

  // Handler for both ChatBox and VoiceChat
  const handleVoiceMessage = (msg: Message) => {
    setMessages((prev) => [...prev, msg]);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="flex flex-row items-center justify-center gap-16">
        <div className="w-[800px] h-[700px] bg-white rounded-2xl shadow-2xl flex flex-col justify-center items-center">
          <ChatBox messages={messages} setMessages={setMessages} />
        </div>
        <div className="w-[800px] h-[700px] bg-white rounded-2xl shadow-2xl flex flex-col justify-center items-center">
          <VoiceChat onMessage={handleVoiceMessage} />
        </div>
      </div>
>>>>>>> edb7d2b (Initial empty commit)
    </div>
  );
}
