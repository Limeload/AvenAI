"use client";

export type Message = {
  sender: "user" | "bot";
  text: string;
  sources?: { title: string; url: string }[];
}; 