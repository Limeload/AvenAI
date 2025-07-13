"use client";

import React from "react";

type MessageBubbleProps = {
  sender: "user" | "bot";
  message: string;
  sources?: { title: string; url: string }[];
};

export default function MessageBubble({ sender, message, sources }: MessageBubbleProps) {
  const isUser = sender === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4 mx-2`}>
      <div
        className={`max-w-sm px-6 py-4 rounded-lg shadow-sm text-sm whitespace-pre-wrap ${
          isUser
            ? "bg-gray-400 text-white rounded-br-none"
            : "bg-gray-100 text-gray-800 rounded-bl-none"
        }`}
      >
        <p className="mb-2">{message}</p>
        {sources && sources.length > 0 && (
          <div className="mt-4 space-y-2">
            <p className="text-xs font-medium text-gray-500">Sources:</p>
            {sources.map((source, i) => (
              <a
                key={i}
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-xs text-blue-600 hover:underline font-semibold"
              >
                {source.url}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
