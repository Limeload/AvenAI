import React, { useEffect, useState } from "react";

interface SuggestedPromptsProps {
  input: string;
  setInput: (val: string) => void;
  showStarter?: boolean;
}

const starterPrompts = [
  "What payment methods does Aven support?",
  "How do I reset my Aven password?",
  "What are Aven's business hours?",
  "How can I contact Aven support?",
  "What services does Aven offer?",
];

const suggestionMap: { [key: string]: string[] } = {
  payment: [
    "What payment methods does Aven support?",
    "How do I update my payment information?",
    "What are the payment processing fees?",
    "Can I pay with cryptocurrency?",
  ],
  password: [
    "How do I reset my Aven password?",
    "What are the password requirements?",
    "How do I enable two-factor authentication?",
    "I forgot my password, what should I do?",
  ],
  support: [
    "How can I contact Aven support?",
    "What are Aven's business hours?",
    "How do I submit a support ticket?",
    "Is there 24/7 customer support?",
  ],
  service: [
    "What services does Aven offer?",
    "What are the pricing plans?",
    "Do you offer custom solutions?",
    "What industries do you serve?",
  ],
  account: [
    "How do I create an Aven account?",
    "How do I update my account information?",
    "Can I have multiple users on one account?",
    "How do I delete my account?",
  ],
};

const fallbackMap: { [key: string]: string[] } = {
  'credit card': [
    'How do I add a new credit card to my account?',
    'What credit cards does Aven accept?',
    'How do I remove a saved credit card?',
    'Is my credit card information secure with Aven?'
  ],
  'debit card': [
    'Can I use a debit card for payments?',
    'How do I update my debit card information?',
    'Are there any fees for using a debit card?'
  ],
  'payment': [
    'What payment methods does Aven support?',
    'How do I update my payment information?',
    'What are the payment processing fees?',
    'Can I pay with cryptocurrency?'
  ]
};

function generateSuggestions(userInput: string): string[] {
  const keyword = userInput.toLowerCase();
  const matchedSuggestions = Object.entries(suggestionMap)
    .filter(([key]) => keyword.includes(key))
    .flatMap(([, suggestions]) => suggestions);
  if (matchedSuggestions.length > 0) return matchedSuggestions;
  // Fallback: check for more general or phrase-based suggestions
  const fallback = Object.entries(fallbackMap)
    .filter(([key]) => keyword.includes(key))
    .flatMap(([, suggestions]) => suggestions);
  return fallback.length > 0 ? fallback : [];
}

export default function SuggestedPrompts({ input, setInput, showStarter }: SuggestedPromptsProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    if (input.length > 2) {
      setSuggestions(generateSuggestions(input));
    } else {
      setSuggestions([]);
    }
  }, [input]);

  if (suggestions.length === 0 && showStarter) {
    return (
      <div className="mb-3">
        <p className="text-xs font-medium text-gray-500 mb-2">Suggested questions:</p>
        <div className="space-y-2 text-left max-w-md mx-auto">
          {starterPrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => setInput(prompt)}
              className="block w-full text-left p-2 rounded bg-gray-100 hover:bg-gray-200 transition"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (suggestions.length === 0) return null;

  return (
    <div className="mb-3">
      <p className="text-xs font-medium text-gray-500 mb-2">Related questions:</p>
      <div className="flex flex-wrap gap-2">
        {suggestions.slice(0, 3).map((suggestion, index) => (
          <button
            key={index}
            onClick={() => setInput(suggestion)}
            className="text-xs px-3 py-1 bg-gray text-black rounded-full hover:bg-gray-200 transition"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
} 