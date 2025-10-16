'use client'

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
}

interface ChatContentProps {
  messages: Message[];
}

export default function ChatContent({ messages }: ChatContentProps) {
  return (
    <div className="flex flex-col h-96 border border-gray-300 rounded-lg bg-white shadow-sm">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50 rounded-t-lg">
        <h2 className="text-lg font-semibold text-gray-800">Chat Messages</h2>
        <span className="text-sm text-gray-500">{messages.length} messages</span>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <p>No messages yet. Start a conversation!</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.sender === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-800'
                }`}
              >
                <div className="flex items-start space-x-2">
                  <div className="flex-1">
                    <p className="text-sm">{message.text}</p>
                  </div>
                </div>
                <div className={`text-xs mt-1 ${
                  message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {message.sender === 'user' ? 'You' : 'Bot'}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}