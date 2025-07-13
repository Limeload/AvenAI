type MessageBubbleProps = {
  sender: "user" | "bot";
  message: string;
};

export default function MessageBubble({ sender, message }: MessageBubbleProps) {
  return (
    <div className={`mb-4 ${sender === "user" ? "text-right" : "text-left"}`}>
      <div
        className={`inline-block max-w-xs px-4 py-2 rounded-lg ${
          sender === "user"
            ? "bg-blue-600 text-white"
            : "bg-gray-200 text-gray-800"
        }`}
      >
        {message}
      </div>
    </div>
  );
}
  