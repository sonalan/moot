'use client'

import { useParams } from 'next/navigation'

export default function ChatDetail() {
  const params = useParams()
  const chatId = params.chatId as string

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Chat</h1>
      <p className="text-gray-600">Chat ID: {chatId}</p>
      
      {/* TODO: Add actual chat interface here */}
      <div className="mt-8 p-4 border border-gray-200 rounded-lg">
        <p className="text-sm text-gray-500">
          This is a placeholder for the chat interface. 
          The chat ID from the URL is: <strong>{chatId}</strong>
        </p>
      </div>
    </div>
  )
}