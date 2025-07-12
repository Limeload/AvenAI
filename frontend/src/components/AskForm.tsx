"use client";

import React, { useState } from "react";

export default function AskForm() {
  const [question, setQuestion] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResults([]);
    setError("");

    try {
      const res = await fetch("http://localhost:5001/api/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question }),
      });

      const data = await res.json();

      if (res.ok) {
        setResults(data.matches || []);
      } else {
        setError(data.error || "Something went wrong.");
      }
    } catch (err: any) {
      setError("Could not reach backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-4 border rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Ask Aven Support</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          placeholder="Ask your question..."
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {error && <p className="mt-4 text-red-500">{error}</p>}

      {results.length > 0 && (
        <div className="mt-6 space-y-4">
          {results.map((match, idx) => (
            <div key={idx} className="p-4 border rounded">
              <p className="text-sm text-gray-600">
                <strong>Score:</strong> {match.score?.toFixed(4)}
              </p>
              <p>
                <strong>Title:</strong>{" "}
                {match.metadata?.title || "[No title]"}
              </p>
              <p>
                <strong>URL:</strong>{" "}
                <a
                  href={match.metadata?.url}
                  target="_blank"
                  className="text-blue-500 underline"
                >
                  {match.metadata?.url || "[No URL]"}
                </a>
              </p>
              <p className="text-gray-700 mt-2">
                {match.metadata?.text?.slice(0, 300)}...
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
