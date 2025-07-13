"use client";

<<<<<<< HEAD
=======
import React from "react";

>>>>>>> edb7d2b (Initial empty commit)
type MessageBubbleProps = {
  sender: "user" | "bot";
  message: string;
  sources?: { title: string; url: string }[];
};

export default function MessageBubble({ sender, message, sources }: MessageBubbleProps) {
<<<<<<< HEAD
  return (
    <div className={`mb-4 ${sender === "user" ? "text-right" : "text-left"}`}>
      <div
        className={`inline-block max-w-xs px-4 py-2 rounded-lg ${
          sender === "user"
            ? "bg-blue-600 text-white"
            : "bg-gray-200 text-gray-800"
        }`}
      >
           <div className="whitespace-pre-wrap leading-relaxed text-gray-800">
               {message}
           </div>

        {sources && sources.length > 0 && (
          <div className="mt-2">
            <p className="text-sm font-bold mb-1">Follow the link to see more details →</p>
            {sources.map((source, index) => (
              <a
                key={index}
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm font-semibold text-blue-600 hover:underline"
=======
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
>>>>>>> edb7d2b (Initial empty commit)
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
<<<<<<< HEAD
  
=======
>>>>>>> edb7d2b (Initial empty commit)
