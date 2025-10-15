/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server'
import { POST, GET } from './route'

// Mock console.error to avoid cluttering test output
const mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {})

// Helper function to create a mock NextRequest
function createMockRequest(method: string, body?: any, searchParams?: Record<string, string>) {
  const url = new URL('http://localhost:3000/api/chat')
  
  if (searchParams) {
    Object.entries(searchParams).forEach(([key, value]) => {
      url.searchParams.set(key, value)
    })
  }

  const request = {
    method,
    url: url.toString(),
    json: async () => body,
    headers: new Headers(),
  } as unknown as NextRequest

  return request
}

describe('/api/chat', () => {
  beforeEach(() => {
    // Clear any existing conversations between tests
    // Note: In a real implementation, you'd want to reset the storage
    jest.clearAllMocks()
  })

  afterAll(() => {
    mockConsoleError.mockRestore()
  })

  describe('POST /api/chat', () => {
    it('should create a new conversation when conversation_id is null', async () => {
      const request = createMockRequest('POST', {
        conversation_id: null,
        message: 'Hello, world!'
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toHaveProperty('conversation_id')
      expect(data.conversation_id).toMatch(/^conv_\d+_[a-z0-9]+$/)
      expect(data).toHaveProperty('message')
      expect(Array.isArray(data.message)).toBe(true)
      expect(data.message).toHaveLength(2) // user message + bot response
      
      // Check user message
      expect(data.message[0]).toEqual({
        role: 'user',
        message: 'Hello, world!'
      })
      
      // Check bot response
      expect(data.message[1]).toEqual({
        role: 'bot',
        message: expect.stringContaining('Hello, world!')
      })
    })

    it('should continue an existing conversation when conversation_id is provided', async () => {
      // First request to create conversation
      const firstRequest = createMockRequest('POST', {
        conversation_id: null,
        message: 'First message'
      })

      const firstResponse = await POST(firstRequest)
      const firstData = await firstResponse.json()
      const conversationId = firstData.conversation_id

      // Second request with existing conversation_id
      const secondRequest = createMockRequest('POST', {
        conversation_id: conversationId,
        message: 'Second message'
      })

      const secondResponse = await POST(secondRequest)
      const secondData = await secondResponse.json()

      expect(secondResponse.status).toBe(200)
      expect(secondData.conversation_id).toBe(conversationId)
      expect(secondData.message).toHaveLength(4) // 2 previous + 2 new messages
      
      // Check that the conversation history is maintained
      expect(secondData.message[0].message).toBe('First message')
      expect(secondData.message[2].message).toBe('Second message')
    })

    it('should limit message history to 5 most recent messages', async () => {
      // Create a conversation and add multiple messages
      let conversationId: string | null = null
      
      // Send 4 messages (8 total with bot responses)
      for (let i = 1; i <= 4; i++) {
        const request = createMockRequest('POST', {
          conversation_id: conversationId,
          message: `Message ${i}`
        })

        const response = await POST(request)
        const data = await response.json()
        
        if (i === 1) {
          conversationId = data.conversation_id
        }
      }

      // Send 5th message
      const finalRequest = createMockRequest('POST', {
        conversation_id: conversationId,
        message: 'Message 5'
      })

      const finalResponse = await POST(finalRequest)
      const finalData = await finalResponse.json()

      expect(finalResponse.status).toBe(200)
      expect(finalData.message).toHaveLength(5) // Only 5 most recent
      
      // When we have 6 user messages (12 total with bot responses), 
      // the last 5 messages will be: bot response 3, user 4, bot 4, user 5, bot 5
      expect(finalData.message[0].role).toBe('bot')
      expect(finalData.message[1].role).toBe('user')
      expect(finalData.message[1].message).toBe('Message 4')
      expect(finalData.message[4].role).toBe('bot') // Last is bot response to message 5
    })

    it('should return 400 error when message is missing', async () => {
      const request = createMockRequest('POST', {
        conversation_id: null
        // message is missing
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data).toHaveProperty('error')
      expect(data.error).toBe('Message is required and must be a string')
    })

    it('should return 400 error when message is not a string', async () => {
      const request = createMockRequest('POST', {
        conversation_id: null,
        message: 123 // Invalid type
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data).toHaveProperty('error')
      expect(data.error).toBe('Message is required and must be a string')
    })

    it('should return 400 error when message is empty string', async () => {
      const request = createMockRequest('POST', {
        conversation_id: null,
        message: ''
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data).toHaveProperty('error')
      expect(data.error).toBe('Message is required and must be a string')
    })

    it('should handle malformed JSON request', async () => {
      const request = {
        method: 'POST',
        url: 'http://localhost:3000/api/chat',
        json: async () => {
          throw new Error('Invalid JSON')
        },
        headers: new Headers(),
      } as unknown as NextRequest

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data).toHaveProperty('error')
      expect(data.error).toBe('Internal server error')
    })

    it('should handle non-existent conversation_id gracefully', async () => {
      const request = createMockRequest('POST', {
        conversation_id: 'non_existent_conv_id',
        message: 'Hello'
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.conversation_id).toBe('non_existent_conv_id')
      expect(data.message).toHaveLength(2) // New conversation started
    })

    it('should generate different bot responses', async () => {
      const responses = new Set()
      
      // Test multiple requests to see if we get different responses
      for (let i = 0; i < 10; i++) {
        const request = createMockRequest('POST', {
          conversation_id: null,
          message: 'Test message'
        })

        const response = await POST(request)
        const data = await response.json()
        
        responses.add(data.message[1].message)
      }

      // Should have more than one unique response (randomness)
      expect(responses.size).toBeGreaterThan(1)
    })
  })

  describe('GET /api/chat', () => {
    it('should retrieve conversation history', async () => {
      // First create a conversation
      const postRequest = createMockRequest('POST', {
        conversation_id: null,
        message: 'Test message'
      })

      const postResponse = await POST(postRequest)
      const postData = await postResponse.json()
      const conversationId = postData.conversation_id

      // Then retrieve it with GET
      const getRequest = createMockRequest('GET', undefined, {
        conversation_id: conversationId
      })

      const getResponse = await GET(getRequest)
      const getData = await getResponse.json()

      expect(getResponse.status).toBe(200)
      expect(getData.conversation_id).toBe(conversationId)
      expect(getData.message).toHaveLength(2)
      expect(getData.message[0].message).toBe('Test message')
    })

    it('should return 400 error when conversation_id parameter is missing', async () => {
      const request = createMockRequest('GET')

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data).toHaveProperty('error')
      expect(data.error).toBe('conversation_id parameter is required')
    })

    it('should return 404 error for non-existent conversation', async () => {
      const request = createMockRequest('GET', undefined, {
        conversation_id: 'non_existent_id'
      })

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data).toHaveProperty('error')
      expect(data.error).toBe('Conversation not found')
    })

    it('should return only the 5 most recent messages for long conversations', async () => {
      // Create a long conversation
      let conversationId: string | null = null
      
      for (let i = 1; i <= 6; i++) {
        const request = createMockRequest('POST', {
          conversation_id: conversationId,
          message: `Message ${i}`
        })

        const response = await POST(request)
        const data = await response.json()
        
        if (i === 1) {
          conversationId = data.conversation_id
        }
      }

      // Get conversation history
      const getRequest = createMockRequest('GET', undefined, {
        conversation_id: conversationId!
      })

      const getResponse = await GET(getRequest)
      const getData = await getResponse.json()

      expect(getResponse.status).toBe(200)
      expect(getData.message).toHaveLength(5) // Only 5 most recent
      // When we have 6 user messages (12 total), last 5 will start with bot response to message 4
      expect(getData.message[0].role).toBe('bot') 
      expect(getData.message[1].role).toBe('user')
      expect(getData.message[1].message).toBe('Message 5')
    })
  })

  describe('Conversation ID Generation', () => {
    it('should generate unique conversation IDs', async () => {
      const ids = new Set()
      
      for (let i = 0; i < 5; i++) {
        const request = createMockRequest('POST', {
          conversation_id: null,
          message: 'Test'
        })

        const response = await POST(request)
        const data = await response.json()
        
        ids.add(data.conversation_id)
      }

      expect(ids.size).toBe(5) // All IDs should be unique
    })

    it('should generate conversation IDs with correct format', async () => {
      const request = createMockRequest('POST', {
        conversation_id: null,
        message: 'Test'
      })

      const response = await POST(request)
      const data = await response.json()

      expect(data.conversation_id).toMatch(/^conv_\d+_[a-z0-9]+$/)
    })
  })
})