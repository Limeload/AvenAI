"use client";

import React, { useState } from "react";

export default function AskForm() {
  const [question, setQuestion] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [answer, setAnswer] = useState("");

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
        setAnswer(data.answer || "");
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
{results.length > 0 && (
  <div className="mb-6 bg-gray-50 p-4 rounded-md border">
    <h2 className="text-lg font-semibold mb-2">📘 Answer</h2>
    <p className="text-gray-800">{answer}</p>
  </div>
)}
</div>
    </div>
  );
}
