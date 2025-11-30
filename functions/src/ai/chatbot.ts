/**
 * AI Chatbot Function (GPT-4 Integration)
 */

import { onCall } from 'firebase-functions/v2/https';
import { HttpsError } from 'firebase-functions/v2/https';
import { verifyAuth } from '../middleware/auth';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const chatbot = onCall(
  {
    maxInstances: 50,
    timeoutSeconds: 30,
  },
  async (request) => {
    const userId = await verifyAuth(request);
    const { message, conversationHistory } = request.data;

    if (!message || typeof message !== 'string') {
      throw new HttpsError('invalid-argument', 'Message is required');
    }

    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant for ChatTTK, a messaging application. Be friendly, concise, and helpful.',
          },
          ...(conversationHistory || []),
          {
            role: 'user',
            content: message,
          },
        ],
        max_tokens: 500,
        temperature: 0.7,
      });

      const response = completion.choices[0]?.message?.content || 'Sorry, I could not generate a response.';

      return {
        success: true,
        response,
      };
    } catch (error: any) {
      console.error('Error in chatbot:', error);
      throw new HttpsError('internal', 'Failed to get AI response');
    }
  }
);

