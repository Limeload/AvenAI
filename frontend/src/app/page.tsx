"use client";

import ChatBox from "@/components/ChatBox";

export default function AskPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-[800px] h-[700px] bg-white rounded-2xl shadow-2xl flex flex-col justify-center items-center">
        <ChatBox />
      </div>
    </div>
  );
}
