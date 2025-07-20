"use client";
import { useState, useRef, useEffect } from "react";

type Source = { title?: string; url?: string };
type MessageType = { sender: string; text: string; sources?: Source[] };

export default function ChatBox() {
  const [messages, setMessages] = useState<MessageType[]>([]);
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
        { sender: "bot", text: data.answer || data.error || "No response", sources: data.sources || [] },
      ]);
    } catch (err) {
      setMessages((prev) => [...prev, { sender: "bot", text: "Error reaching server." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-200 rounded-2xl shadow-2xl flex flex-col justify-center p-4">
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto px-2 mb-2 max-h-[500px]">
          {messages.map((msg, i) => (
            <div key={i} className={`mb-3 flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}> 
              <div
                className={
                  msg.sender === "user"
                    ? "bg-gray-900 text-white rounded-2xl rounded-br-sm px-4 py-2 max-w-xs shadow"
                    : "bg-white text-gray-900 rounded-2xl rounded-bl-sm px-4 py-2 max-w-xs shadow border border-gray-200"
                }
                style={{ wordBreak: "break-word" }}
              >
                {msg.text}
                {msg.sender === "bot" && msg.sources && msg.sources.length > 0 && (
                  <div className="mt-2 text-xs text-gray-500">
                    <span className="font-semibold mr-1">Sources:</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {msg.sources.map((src: Source, idx: number) => (
                        src.url ? (
                          <a
                            key={idx}
                            href={src.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2 py-1 bg-gray-100 text-gray-800 rounded hover:bg-gray-200 transition underline"
                          >
                            {src.title || src.url}
                          </a>
                        ) : (
                          <span key={idx} className="px-2 py-1 bg-gray-100 rounded">
                            {src.title || "Source"}
                          </span>
                        )
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
          {loading && <div className="text-center text-gray-400">Loading...</div>}
          <div ref={chatEndRef} />
        </div>
        <div className="flex flex-col mt-auto p-4 border-t border-gray-200 bg-white rounded-b-2xl">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              className="flex-1 border border-gray-300 px-4 py-2 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-gray-700 bg-gray-50"
              placeholder="Type a question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              disabled={loading}
            />
            <button
              onClick={sendMessage}
              disabled={loading}
              className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-md shadow transition"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 