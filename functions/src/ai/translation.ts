/**
 * Translation Function (Google Translate API)
 */

import { onCall } from 'firebase-functions/v2/https';
import { HttpsError } from 'firebase-functions/v2/https';
import { verifyAuth } from '../middleware/auth';
import { Translate } from '@google-cloud/translate';

const translate = new Translate();

export const translation = onCall(
  {
    maxInstances: 50,
    timeoutSeconds: 30,
  },
  async (request) => {
    const userId = await verifyAuth(request);
    const { text, targetLanguage } = request.data;

    if (!text || !targetLanguage) {
      throw new HttpsError('invalid-argument', 'Text and target language are required');
    }

    try {
      const [translation] = await translate.translate(text, targetLanguage);

      return {
        success: true,
        translatedText: translation,
        sourceLanguage: 'auto-detected',
        targetLanguage,
      };
    } catch (error: any) {
      console.error('Error in translation:', error);
      throw new HttpsError('internal', 'Failed to translate text');
    }
  }
);

