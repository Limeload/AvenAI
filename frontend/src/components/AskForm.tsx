"use client";

import React, { useState } from "react";

export default function AskForm() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [sources, setSources] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    setLoading(true);
    setAnswer("");
    setSources([]);
    setError("");

    try {
      const res = await fetch("http://localhost:5001/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: question.trim() }),
      });

      const data = await res.json();
      if (res.ok) {
        setAnswer(data.answer || "No answer generated.");
        setSources(data.sources || []);
      } else {
        setError(data.error || "Something went wrong.");
      }
    } catch (err) {
      setError("Could not reach backend. Please check if the server is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 px-4">
      <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6">
        Ask Aven Support
      </h1>

      <form onSubmit={handleSubmit} className="flex items-center space-x-2 mb-6">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask a question..."
          className="flex-1 px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !question.trim()}
          className="bg-blue-600 text-white px-5 py-3 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Searching..." : "Ask"}
        </button>
      </form>

      {error && (
        <div className="p-3 bg-red-100 text-red-700 rounded-md mb-4">{error}</div>
      )}

      {!loading && answer && (
        <div className="bg-white border border-gray-200 p-5 rounded-md shadow-sm mb-6">
          <h2 className="text-lg font-medium text-gray-800 mb-2">Answer:</h2>
          <p className="text-gray-700 whitespace-pre-line">{answer}</p>
        </div>
      )}

      {sources.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-md font-semibold text-gray-700">Sources:</h3>
          {sources.map((item, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-md p-4 hover:shadow-sm transition"
            >
              <p className="text-sm bold text-gray-700 mb-1">
                {item.title || "Untitled"}
              </p>
              {item.url && (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 text-sm hover:underline"
                >
                  {item.url}
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
