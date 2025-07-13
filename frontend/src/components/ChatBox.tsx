"use client";

import { Dispatch, SetStateAction, useState, useRef, useEffect } from "react";
import MessageBubble from "./MessageBubble";
import Loader from "./Loader";
import Image from "next/image";
import { Message } from "./Message";
import SuggestedPrompts from "./SuggestedPrompts";

type ChatBoxProps = {
  messages: Message[];
  setMessages: Dispatch<SetStateAction<Message[]>>;
};

export default function ChatBox({ messages, setMessages }: ChatBoxProps) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages((prev) => [...prev, { sender: "user", text: userMsg, sources: [] }]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5001/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: userMsg }),
      });
      const data = await res.json();
      const answer = data.answer || data.error || "No response";
      const sources = data.sources || [];
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: answer, sources },
      ]);
    } catch (err) {
      setMessages((prev) => [...prev, { sender: "bot", text: "Error reaching server.", sources: [] }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="w-full h-full bg-white rounded-2xl shadow-2xl flex flex-col justify-center">
      {/* Aven Logo */}
      <Image src="/aven-logo.png" alt="Aven" width={140} height={56} className="mb-6 mx-auto" />
      {/* Chat card */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Chat area */}
        <div className="flex-1 overflow-y-auto px-2 mb-2 max-h-[500px]">
          {messages.length === 0 && (
            <div className="text-center text-gray-400 mt-10">
              <div className="mb-6">No messages yet. Try typing or using the mic!</div>
              <SuggestedPrompts input={input} setInput={setInput} showStarter={input.length === 0} />
            </div>
          )}
          {messages.map((msg, i) => (
            <MessageBubble key={i} sender={msg.sender} message={msg.text} sources={msg.sources} />
          ))}
          {loading && <Loader />}
          <div ref={chatEndRef} />
        </div>
        {/* Input */}
        <div className="flex flex-col mt-auto p-4 border-t border-gray-200">
          {/* Dynamic Suggestions */}
          {messages.length > 0 && <SuggestedPrompts input={input} setInput={setInput} />}
          <div className="flex items-center space-x-2">
            <input
              type="text"
              className="flex-1 border px-4 py-2 rounded-md text-black"
              placeholder="Type a question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
            />
            <button
              onClick={sendMessage}
              disabled={loading}
              className="bg-black text-white px-4 py-2 rounded-md"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
