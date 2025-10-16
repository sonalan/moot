import React, { useEffect, useRef, useState } from 'react'

interface ChatformProps {
    sendMessage: (message: string) => void;
}

function Chatform({ sendMessage }: ChatformProps) {
    const [input, setInput] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    
    useEffect(() => {
    if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + 'px';
    }
    }, [input]);

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

    return (
        <>
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
        </>
    )
}

export default Chatform