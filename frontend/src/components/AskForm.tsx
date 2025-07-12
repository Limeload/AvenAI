"use client";

import React, { useState } from "react";

export default function AskForm() {
  const [question, setQuestion] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    setLoading(true);
    setResults([]);
    setError("");

    try {
      const res = await fetch("http://localhost:5001/api/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: question.trim() }),
      });

      const data = await res.json();
      if (res.ok) {
        setResults(data.matches || []);
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
        <div className="p-3 bg-red-100 text-red-700 rounded-md mb-4">
          {error}
        </div>
      )}

      {!loading && results.length === 0 && question && !error && (
        <div className="text-gray-600 text-sm text-center">No results found.</div>
      )}

      <div className="space-y-4">
        {results.map((item, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-md p-4 hover:shadow-sm transition"
          >
            <h3 className="text-md font-medium text-gray-900 mb-2">
              {item.title || "Untitled"}
            </h3>
            {item.url && (
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 text-sm hover:underline"
              >
                Follow the link to see more details →
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
