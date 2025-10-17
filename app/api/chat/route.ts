import { NextRequest, NextResponse } from 'next/server';
import { getDatabase, ChatMessage } from '../../lib/database';
import { getOllamaService } from '../../lib/ollama';

// TypeScript interfaces
interface ChatRequest {
  conversation_id: string | null;
  message: string;
}

interface ChatResponse {
  conversation_id: string;
  message: ChatMessage[];
}

// Function to generate a simple conversation ID
function generateConversationId(): string {
  return `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
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
    }

    const db = getDatabase();
    const ollama = getOllamaService();

    // Add user message to database
    await db.addMessage(conversationId, 'user', body.message);

    // Generate bot response using Ollama
    const botResponseText = await ollama.generateResponse(body.message);
    
    // Add bot message to database
    await db.addMessage(conversationId, 'bot', botResponseText);

    // Get the 5 most recent messages for response
    const recentMessages = await db.getRecentMessages(conversationId, 5);

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
  try {
    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get('conversation_id');
    const db = getDatabase();

    // If no conversation_id provided, return all conversation IDs
    if (!conversationId) {
      const allConversations = await db.getAllConversations();
      return NextResponse.json(allConversations);
    }

    // Return specific conversation
    const recentMessages = await db.getRecentMessages(conversationId, 5);
    
    if (recentMessages.length === 0) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      );
    }

    const response: ChatResponse = {
      conversation_id: conversationId,
      message: recentMessages
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Chat API GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}