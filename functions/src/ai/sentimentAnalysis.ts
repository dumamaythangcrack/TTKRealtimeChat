/**
 * Sentiment Analysis Function
 */

import { onCall } from 'firebase-functions/v2/https';
import { HttpsError } from 'firebase-functions/v2/https';
import { verifyAuth } from '../middleware/auth';

export const sentimentAnalysis = onCall(
  {
    maxInstances: 50,
    timeoutSeconds: 30,
  },
  async (request) => {
    const userId = await verifyAuth(request);
    const { text } = request.data;

    if (!text) {
      throw new HttpsError('invalid-argument', 'Text is required');
    }

    try {
      // Simple sentiment analysis (can be enhanced with ML)
      const positiveWords = ['good', 'great', 'excellent', 'happy', 'love', 'amazing'];
      const negativeWords = ['bad', 'terrible', 'hate', 'sad', 'angry', 'awful'];
      
      const lowerText = text.toLowerCase();
      let positiveScore = 0;
      let negativeScore = 0;

      positiveWords.forEach(word => {
        if (lowerText.includes(word)) positiveScore++;
      });

      negativeWords.forEach(word => {
        if (lowerText.includes(word)) negativeScore++;
      });

      const sentiment = positiveScore > negativeScore ? 'positive' : 
                       negativeScore > positiveScore ? 'negative' : 'neutral';
      const score = (positiveScore - negativeScore) / Math.max(positiveScore + negativeScore, 1);

      return {
        success: true,
        sentiment,
        score,
      };
    } catch (error: any) {
      console.error('Error in sentimentAnalysis:', error);
      throw new HttpsError('internal', 'Failed to analyze sentiment');
    }
  }
);

