import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import path from 'path';

export interface ChatMessage {
  id?: number;
  conversation_id: string;
  role: 'user' | 'bot';
  message: string;
  created_at?: string;
}

export interface Conversation {
  id: string;
  created_at: string;
  updated_at: string;
}

class DatabaseManager {
  private db: Database | null = null;
  private dbPath: string;

  constructor() {
    // Create database in the project root for development
    this.dbPath = process.env.NODE_ENV === 'production' 
      ? '/app/data/chat.db' 
      : path.join(process.cwd(), 'chat.db');
  }

  private async getDb(): Promise<Database> {
    if (!this.db) {
      this.db = await open({
        filename: this.dbPath,
        driver: sqlite3.Database
      });
      await this.init();
    }
    return this.db;
  }

  private async init() {
    const db = await this.getDb();
    
    // Create conversations table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS conversations (
        id TEXT PRIMARY KEY,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create messages table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        conversation_id TEXT NOT NULL,
        role TEXT NOT NULL CHECK (role IN ('user', 'bot')),
        message TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (conversation_id) REFERENCES conversations (id)
      )
    `);

    // Create index for better performance
    await db.exec(`
      CREATE INDEX IF NOT EXISTS idx_messages_conversation_id 
      ON messages (conversation_id);
    `);
  }

  // Create a new conversation
  async createConversation(conversationId: string): Promise<void> {
    const db = await this.getDb();
    await db.run(
      'INSERT INTO conversations (id, created_at, updated_at) VALUES (?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)',
      conversationId
    );
  }

  // Check if conversation exists
  async conversationExists(conversationId: string): Promise<boolean> {
    const db = await this.getDb();
    const result = await db.get(
      'SELECT id FROM conversations WHERE id = ?',
      conversationId
    );
    return !!result;
  }

  // Add a message to a conversation
  async addMessage(conversationId: string, role: 'user' | 'bot', message: string): Promise<ChatMessage> {
    const db = await this.getDb();
    
    // Ensure conversation exists
    const exists = await this.conversationExists(conversationId);
    if (!exists) {
      await this.createConversation(conversationId);
    }

    // Insert message
    const result = await db.run(
      'INSERT INTO messages (conversation_id, role, message) VALUES (?, ?, ?)',
      conversationId,
      role,
      message
    );

    // Update conversation timestamp
    await db.run(
      'UPDATE conversations SET updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      conversationId
    );

    // Return the inserted message
    const insertedMessage = await db.get(
      'SELECT * FROM messages WHERE id = ?',
      result.lastID
    );
    return insertedMessage as ChatMessage;
  }

  // Get recent messages for a conversation (last N messages)
  async getRecentMessages(conversationId: string, limit: number = 5): Promise<ChatMessage[]> {
    const db = await this.getDb();
    // Use a subquery to get the most recent N messages, then order them chronologically
    const messages = await db.all(
      `SELECT * FROM (
         SELECT * FROM messages 
         WHERE conversation_id = ? 
         ORDER BY created_at DESC 
         LIMIT ?
       ) ORDER BY created_at ASC`,
      conversationId,
      limit
    );
    return messages as ChatMessage[];
  }

  // Get all conversations with their latest message
  async getAllConversations(): Promise<Array<{conversation_id: string, message: ChatMessage[]}>> {
    const db = await this.getDb();
    // Get conversations ordered by most recent message (descending)
    const conversations = await db.all(
      `SELECT DISTINCT conversation_id, MAX(created_at) as last_message_time 
       FROM messages 
       GROUP BY conversation_id 
       ORDER BY last_message_time DESC`
    );

    const result = [];
    for (const conv of conversations) {
      const messages = await this.getRecentMessages(conv.conversation_id, 5);
      result.push({
        conversation_id: conv.conversation_id,
        message: messages
      });
    }
    return result;
  }

  // Get full conversation history (for debugging/admin)
  async getFullConversation(conversationId: string): Promise<ChatMessage[]> {
    const db = await this.getDb();
    const messages = await db.all(
      'SELECT * FROM messages WHERE conversation_id = ? ORDER BY created_at ASC',
      conversationId
    );
    return messages as ChatMessage[];
  }

  // Close database connection
  async close(): Promise<void> {
    if (this.db) {
      await this.db.close();
      this.db = null;
    }
  }

  // For testing - clear all data
  async clearAllData(): Promise<void> {
    const db = await this.getDb();
    await db.exec('DELETE FROM messages');
    await db.exec('DELETE FROM conversations');
  }
}

// Create singleton instance
let dbInstance: DatabaseManager | null = null;

export function getDatabase(): DatabaseManager {
  if (!dbInstance) {
    dbInstance = new DatabaseManager();
  }
  return dbInstance;
}

export { DatabaseManager };