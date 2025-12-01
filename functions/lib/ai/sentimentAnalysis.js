"use strict";
/**
 * Sentiment Analysis Function
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.sentimentAnalysis = void 0;
const https_1 = require("firebase-functions/v2/https");
const https_2 = require("firebase-functions/v2/https");
const auth_1 = require("../middleware/auth");
exports.sentimentAnalysis = (0, https_1.onCall)({
    maxInstances: 50,
    timeoutSeconds: 30,
}, async (request) => {
    const userId = await (0, auth_1.verifyAuth)(request);
    const { text } = request.data;
    if (!text) {
        throw new https_2.HttpsError('invalid-argument', 'Text is required');
    }
    try {
        // Simple sentiment analysis (can be enhanced with ML)
        const positiveWords = ['good', 'great', 'excellent', 'happy', 'love', 'amazing'];
        const negativeWords = ['bad', 'terrible', 'hate', 'sad', 'angry', 'awful'];
        const lowerText = text.toLowerCase();
        let positiveScore = 0;
        let negativeScore = 0;
        positiveWords.forEach(word => {
            if (lowerText.includes(word))
                positiveScore++;
        });
        negativeWords.forEach(word => {
            if (lowerText.includes(word))
                negativeScore++;
        });
        const sentiment = positiveScore > negativeScore ? 'positive' :
            negativeScore > positiveScore ? 'negative' : 'neutral';
        const score = (positiveScore - negativeScore) / Math.max(positiveScore + negativeScore, 1);
        return {
            success: true,
            sentiment,
            score,
        };
    }
    catch (error) {
        console.error('Error in sentimentAnalysis:', error);
        throw new https_2.HttpsError('internal', 'Failed to analyze sentiment');
    }
});
//# sourceMappingURL=sentimentAnalysis.js.map