'use client'

import { useParams } from 'next/navigation'
import ChatContent from '../../components/chat/ChatContent';
import { useEffect, useState } from 'react';
import Chatform from '../../components/chat/chat-form/Chatform';

// sample api request and response
// http://localhost:3000/api/chat?conversation_id=conv_1760502253502_zwjnxq4tk
// {"conversation_id":"conv_1760502253502_zwjnxq4tk","message":[{"role":"user","message":"Hello!"},{"role":"bot","message":"That's interesting! You said: \"Hello!\""},{"role":"user","message":"How are you?"},{"role":"bot","message":"Thanks for sharing: \"How are you?\""}]}

export default function ChatDetail() {
    const params = useParams()
    const chatId = params.chatId as string
    const [messages, setMessages] = useState<Array<{id: string, text: string, sender: 'user' | 'bot'}>>([])

    const fetchChatData = async () => {
        const response = await fetch(`http://localhost:3000/api/chat?conversation_id=${chatId}`);
        const data = await response.json();
        return data;
    }

    const postChatData = async (message: string, chatId: string) => {
        const response = await fetch(`http://localhost:3000/api/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message,
                conversation_id: chatId
            })
        });
        const data = await response.json();
        return data;
    }

    const handleSendMessage = async (message: string) => {
        try {
            const data = await postChatData(message, chatId);
            console.log('Sent message, received:', data);
            
            // Update messages with the new conversation data
            const formattedMessages = data.message.map((msg: any, index: number) => ({
                id: `msg_${index}`,
                text: msg.message,
                sender: msg.role
            }));
            setMessages(formattedMessages);
        } catch (error) {
            console.error('Error sending message:', error);
        }
    }

    useEffect(() => {
        fetchChatData().then(data => {
            console.log('Fetched chat data:', data);
            // Handle the fetched data (e.g., set state)
            const formattedMessages = data.message.map((msg: any, index: number) => ({
                id: `msg_${index}`,
                text: msg.message,
                sender: msg.role
            }));
            setMessages(formattedMessages);
        }).catch(error => {
        console.error('Error fetching chat data:', error);
        });

    }, [chatId]);
  
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Chat</h1>
            <p className="text-gray-600">Chat ID: {chatId}</p>
            <ChatContent messages={messages} />
            {/* TODO: Add actual chat interface here */}
            <Chatform sendMessage={handleSendMessage} />
        </div>
    )
}