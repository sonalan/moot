'use client'
import React, { useState, useRef, useEffect } from 'react';
import { Earth, Pizza, PiIcon } from 'lucide-react';
import { send } from 'process';

interface IgniterProps {
  sendMessage: (message: string) => void;
}
function Igniter({sendMessage}: IgniterProps) {

  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + 'px';
    }
  }, [input]);

  const suggestions = [
    { icon: Pizza, label: 'Chose your side', text: 'Pineapple is better then pepperoni on pizza' },
    { icon: Earth, label: 'Spining Flat', text: 'What if earth is flat and spining like a beyblade' },
    { icon: PiIcon, label: 'Pi dilemma', text: 'Matematicians are wrong pi must be 4.13' }
    
  ];

  const handleSend = () => {
    if (input.trim()) {
      console.log(input)
      sendMessage(input);
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };


  const handleSuggestionClick = (text: string) => {
    setInput(text);
    textareaRef.current?.focus();
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 18) return 'afternoon';
    return 'evening';
    };

  const greeting = getGreeting();

  return (
    <>
        <div className="flex-1 flex flex-col items-center justify-center px-4">
          <div className="w-full max-w-4xl">
            {/* Greeting */}
            <div className="text-center mb-12">
              <h1 className="text-5xl font-light text-gray-100 mb-2">
                <span className="text-orange-400 mr-3">✱</span>
                Good {greeting}, stranger
              </h1>
            </div>

            {/* Input Box */}
            <div className="mb-8">
              <div className="relative bg-zinc-800 rounded-3xl border border-zinc-700 overflow-hidden">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="What do you wanna challenge today?"
                  className="w-full bg-transparent px-6 py-5 text-gray-300 placeholder-gray-500 outline-none resize-none min-h-[80px]"
                  rows={1}
                />
              </div>
            </div>

            {/* Suggestion Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion.text)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-zinc-800 hover:bg-zinc-750 border border-zinc-700 rounded-xl transition-colors text-sm text-gray-300"
                >
                  <suggestion.icon size={18} className="text-gray-400" />
                  {suggestion.label}
                </button>
              ))}
            </div>
          </div>
        </div>
    </>
  )
}

export default Igniter