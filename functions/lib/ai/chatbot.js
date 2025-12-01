"use strict";
/**
 * AI Chatbot Function (GPT-4 Integration)
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatbot = void 0;
const https_1 = require("firebase-functions/v2/https");
const https_2 = require("firebase-functions/v2/https");
const auth_1 = require("../middleware/auth");
const openai_1 = __importDefault(require("openai"));
const openai = new openai_1.default({
    apiKey: process.env.OPENAI_API_KEY,
});
exports.chatbot = (0, https_1.onCall)({
    maxInstances: 50,
    timeoutSeconds: 30,
}, async (request) => {
    const userId = await (0, auth_1.verifyAuth)(request);
    const { message, conversationHistory } = request.data;
    if (!message || typeof message !== 'string') {
        throw new https_2.HttpsError('invalid-argument', 'Message is required');
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
    }
    catch (error) {
        console.error('Error in chatbot:', error);
        throw new https_2.HttpsError('internal', 'Failed to get AI response');
    }
});
//# sourceMappingURL=chatbot.js.map