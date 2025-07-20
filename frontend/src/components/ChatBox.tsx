"use client";
import { useState, useRef, useEffect } from "react";

export default function ChatBox() {
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Setup speech recognition
  useEffect(() => {
    if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = "en-US";
      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setListening(false);
      };
      recognitionRef.current.onerror = () => {
        setListening(false);
      };
      recognitionRef.current.onend = () => {
        setListening(false);
      };
    }
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages((prev) => [...prev, { sender: "user", text: userMsg }]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: userMsg }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: data.answer || data.error || "No response" },
      ]);
    } catch (err) {
      setMessages((prev) => [...prev, { sender: "bot", text: "Error reaching server." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleMic = () => {
    if (!recognitionRef.current) return;
    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
    } else {
      setListening(true);
      recognitionRef.current.start();
    }
  };

  return (
    <div className="w-full h-full bg-white rounded-2xl shadow-2xl flex flex-col justify-center">
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto px-2 mb-2 max-h-[500px]">
          {messages.map((msg, i) => (
            <div key={i} className={`mb-2 ${msg.sender === "user" ? "text-right" : "text-left"}`}>
              <span className={msg.sender === "user" ? "text-blue-600" : "text-green-600"}>
                {msg.sender}: {msg.text}
              </span>
            </div>
          ))}
          {loading && <div>Loading...</div>}
          <div ref={chatEndRef} />
        </div>
        <div className="flex flex-col mt-auto p-4 border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              className="flex-1 border px-4 py-2 rounded-md text-black"
              placeholder="Type a question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              disabled={loading}
            />
            <button
              onClick={sendMessage}
              disabled={loading}
              className="bg-black text-white px-4 py-2 rounded-md"
            >
              Send
            </button>
            <button
              onClick={handleMic}
              disabled={loading}
              className={`ml-2 rounded-full p-2 border ${listening ? "bg-green-200" : "bg-gray-200"}`}
              title={listening ? "Stop listening" : "Start voice input"}
            >
              {listening ? "🎤..." : "🎤"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 