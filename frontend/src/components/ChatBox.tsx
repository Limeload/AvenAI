"use client";

<<<<<<< HEAD
import { useState } from "react";
import MessageBubble from "./MessageBubble";
import Loader from "./Loader";
import VoiceChat from "./VoiceChat";


type Message = {
=======
import { Dispatch, SetStateAction, useState, useRef, useEffect } from "react";
import MessageBubble from "./MessageBubble";
import Loader from "./Loader";
import Image from "next/image";

export type Message = {
>>>>>>> edb7d2b (Initial empty commit)
  sender: "user" | "bot";
  text: string;
  sources?: { title: string; url: string }[];
};

<<<<<<< HEAD
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

=======
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
>>>>>>> edb7d2b (Initial empty commit)
    try {
      const res = await fetch("http://localhost:5001/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: userMsg }),
      });
<<<<<<< HEAD

      const data = await res.json();
      const answer = data.answer || data.error || "No response";
      const sources = data.sources || [];


      setMessages((prev) => [...prev, { sender: "bot", text: answer, sources }]);
    } catch (err) {
      setMessages((prev) => [...prev, { sender: "bot", text: "Error reaching server." }]);
=======
      const data = await res.json();
      const answer = data.answer || data.error || "No response";
      const sources = data.sources || [];
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: answer, sources },
      ]);
    } catch (err) {
      setMessages((prev) => [...prev, { sender: "bot", text: "Error reaching server.", sources: [] }]);
>>>>>>> edb7d2b (Initial empty commit)
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") sendMessage();
  };

<<<<<<< HEAD
  const handleVoiceMessage = (msg: Message) => {
    setMessages((prev) => [...prev, msg]);
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
          className="flex-1 border px-4 py-2 text-black rounded-md"
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
        <VoiceChat onMessage={handleVoiceMessage} />
=======
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
              <div className="text-sm text-gray-500">
                <p className="mb-3 font-semibold">Suggested questions:</p>
                <div className="space-y-2 text-left max-w-md mx-auto">
                  <button 
                    onClick={() => setInput("What payment methods does Aven support?")}
                    className="block w-full text-left p-2 rounded bg-gray-100 hover:bg-gray-200 transition"
                  >
                    💳 What payment methods does Aven support?
                  </button>
                  <button 
                    onClick={() => setInput("How do I reset my Aven password?")}
                    className="block w-full text-left p-2 rounded bg-gray-100 hover:bg-gray-200 transition"
                  >
                    🔐 How do I reset my Aven password?
                  </button>
                  <button 
                    onClick={() => setInput("What are Aven's business hours?")}
                    className="block w-full text-left p-2 rounded bg-gray-100 hover:bg-gray-200 transition"
                  >
                    🕒 What are Aven's business hours?
                  </button>
                  <button 
                    onClick={() => setInput("How can I contact Aven support?")}
                    className="block w-full text-left p-2 rounded bg-gray-100 hover:bg-gray-200 transition"
                  >
                    📞 How can I contact Aven support?
                  </button>
                  <button 
                    onClick={() => setInput("What services does Aven offer?")}
                    className="block w-full text-left p-2 rounded bg-gray-100 hover:bg-gray-200 transition"
                  >
                    🏢 What services does Aven offer?
                  </button>
                </div>
              </div>
            </div>
          )}
          {messages.map((msg, i) => (
            <MessageBubble key={i} sender={msg.sender} message={msg.text} sources={msg.sources} />
          ))}
          {loading && <Loader />}
          <div ref={chatEndRef} />
        </div>
        {/* Input */}
        <div className="flex items-center space-x-2 mt-auto p-4 border-t border-gray-200">
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
>>>>>>> edb7d2b (Initial empty commit)
      </div>
    </div>
  );
}
