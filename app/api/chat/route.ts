import { NextRequest, NextResponse } from 'next/server';

// TypeScript interfaces
interface ChatMessage {
  role: 'user' | 'bot';
  message: string;
}

interface ChatRequest {
  conversation_id: string | null;
  message: string;
}

interface ChatResponse {
  conversation_id: string;
  message: ChatMessage[];
}

// In-memory storage for conversations (in production, use a database)
const conversations = new Map<string, ChatMessage[]>();

// Function to generate a simple conversation ID
function generateConversationId(): string {
  return `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Function to simulate bot response (replace with actual AI/bot logic)
function generateBotResponse(userMessage: string): string {
  // Simple echo bot for demonstration
  const responses = [
    `I received your message: "${userMessage}"`,
    `That's interesting! You said: "${userMessage}"`,
    `Thanks for sharing: "${userMessage}"`,
    `I understand you're saying: "${userMessage}"`,
  ];
  return responses[Math.floor(Math.random() * responses.length)];
}

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json();
    
    // Validate request
    if (!body.message || typeof body.message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required and must be a string' },
        { status: 400 }
      );
    }

    // Get or create conversation ID
    let conversationId = body.conversation_id;
    if (!conversationId) {
      conversationId = generateConversationId();
      conversations.set(conversationId, []);
    }

    // Get existing conversation or create new one
    let conversationHistory = conversations.get(conversationId) || [];

    // Add user message
    const userMessage: ChatMessage = {
      role: 'user',
      message: body.message
    };
    conversationHistory.push(userMessage);

    // Generate bot response
    const botResponseText = generateBotResponse(body.message);
    const botMessage: ChatMessage = {
      role: 'bot',
      message: botResponseText
    };
    conversationHistory.push(botMessage);

    // Keep only the 5 most recent messages (as specified in requirements)
    const recentMessages = conversationHistory.slice(-5);
    
    // Update conversation storage
    conversations.set(conversationId, conversationHistory);

    // Prepare response
    const response: ChatResponse = {
      conversation_id: conversationId,
      message: recentMessages
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET method to retrieve conversation history or all conversations
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const conversationId = searchParams.get('conversation_id');

  // If no conversation_id provided, return all conversation IDs
  if (!conversationId) {
    const allConversations = Array.from(conversations.entries()).map(([id, messages]) => ({
      conversation_id: id,
      message: messages.slice(-5) // return only the 5 most recent messages
    }));

    return NextResponse.json(allConversations);
  }

  // Return specific conversation
  const conversationHistory = conversations.get(conversationId);
  
  if (!conversationHistory) {
    return NextResponse.json(
      { error: 'Conversation not found' },
      { status: 404 }
    );
  }

  // Return the 5 most recent messages
  const recentMessages = conversationHistory.slice(-5);
  
  const response: ChatResponse = {
    conversation_id: conversationId,
    message: recentMessages
  };

  return NextResponse.json(response);
}