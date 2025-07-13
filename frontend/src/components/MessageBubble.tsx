type MessageBubbleProps = {
  sender: "user" | "bot";
  message: string;
  sources?: { title: string; url: string }[];
};

export default function MessageBubble({ sender, message, sources }: MessageBubbleProps) {
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
  