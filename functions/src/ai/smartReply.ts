/**
 * Smart Reply Function (AI-generated quick replies)
 */

import { onCall } from 'firebase-functions/v2/https';
import { HttpsError } from 'firebase-functions/v2/https';
import { verifyAuth } from '../middleware/auth';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const smartReply = onCall(
  {
    maxInstances: 50,
    timeoutSeconds: 30,
  },
  async (request) => {
    const userId = await verifyAuth(request);
    const { message, context } = request.data;

    if (!message) {
      throw new HttpsError('invalid-argument', 'Message is required');
    }

    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'Generate 3 short, casual quick reply suggestions (max 10 words each) for a messaging app.',
          },
          {
            role: 'user',
            content: `Message: "${message}"\nContext: ${context || 'none'}\n\nGenerate 3 quick reply options:`,
          },
        ],
        max_tokens: 100,
        temperature: 0.8,
      });

      const response = completion.choices[0]?.message?.content || '';
      const replies = response.split('\n').filter(line => line.trim()).slice(0, 3);

      return {
        success: true,
        replies,
      };
    } catch (error: any) {
      console.error('Error in smartReply:', error);
      throw new HttpsError('internal', 'Failed to generate smart replies');
    }
  }
);

