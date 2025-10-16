'use client'

import { useEffect, useState } from "react";



export default function ChatArchive() {
    // API returns: [{"conversation_id":"conv_123","message":[{"role":"user","message":"Hello"}]}]
    
    const [conversations, setConversations] = useState<Array<{
        conversation_id: string, 
        last_message: string, 
        updated_at: string
    }>>([])
    
    const fetchChatArchive = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/chat');
            const data = await response.json();
            console.log('Fetched conversations:', data);
            
            // Transform the API response to match our expected format
            const transformedConversations = data.map((conv: any) => {
                // Get the last message from the conversation
                const lastMessage = conv.message && conv.message.length > 0 
                    ? conv.message[conv.message.length - 1].message 
                    : 'No messages';
                
                return {
                    conversation_id: conv.conversation_id,
                    last_message: lastMessage,
                    updated_at: new Date().toISOString() // Since we don't have timestamps, use current time
                };
            });
            
            setConversations(transformedConversations);
        } catch (error) {
            console.error('Error fetching conversations:', error);
            setConversations([]); // Set to empty array on error
        }
    }

    useEffect(() => {
        fetchChatArchive();
    }, []);

    return (
        <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Chat Archive</h1>
        <p>Here is recent chat archive</p>
       
        <ul className="mt-4 space-y-2">
            {!conversations || conversations.length === 0 ? (
                <li>No conversations found. <button className="text-blue-600 hover:underline" onClick={fetchChatArchive}>Load Conversations</button></li>
            ) : (
                conversations.map((conv) => (
                    <li key={conv.conversation_id} className="border bg-gray-200 border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                        <a href={`/chat/${conv.conversation_id}`} className="block">
                            <div className="font-medium text-gray-900 mb-1">
                                Chat: {conv.conversation_id}
                            </div>
                            <div className="text-gray-600 text-sm mb-2">
                                Last message: "{conv.last_message}"
                            </div>
                            <div className="text-gray-400 text-xs">
                                Updated: {new Date(conv.updated_at).toLocaleString()}
                            </div>
                        </a>
                    </li>
                ))
            )}
        </ul>
        </div>
    )
}