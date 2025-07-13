"use client";

import { useState } from "react";
import MessageBubble from "./MessageBubble";
import Loader from "./Loader";

type Message = {
  sender: "user" | "bot";
  text: string;
  sources?: { title: string; url: string }[];
};

export default function ChatBox() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
 
  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = input.trim();

    setMessages((prev) => [...prev, { sender: "user", text: userMsg }]);
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


      setMessages((prev) => [...prev, { sender: "bot", text: answer, sources }]);
    } catch (err) {
      setMessages((prev) => [...prev, { sender: "bot", text: "Error reaching server." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="max-w-xl mx-auto mt-10 px-4">
      <div className="border rounded-md p-4 h-[400px] overflow-y-auto mb-4 bg-white">
        {messages.map((msg, i) => (
          <MessageBubble key={i} sender={msg.sender} message={msg.text} sources={msg.sources} />
        ))}
        {loading && <Loader />}
      </div>
      <div className="flex space-x-2">
        <input
          type="text"
          className="flex-1 border px-4 py-2 rounded-md"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a question..."
          disabled={loading}
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-md"
        >
          Send
        </button>
      </div>
    </div>
  );
}
