"use strict";
/**
 * Smart Reply Function (AI-generated quick replies)
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.smartReply = void 0;
const https_1 = require("firebase-functions/v2/https");
const https_2 = require("firebase-functions/v2/https");
const auth_1 = require("../middleware/auth");
const openai_1 = __importDefault(require("openai"));
const openai = new openai_1.default({
    apiKey: process.env.OPENAI_API_KEY,
});
exports.smartReply = (0, https_1.onCall)({
    maxInstances: 50,
    timeoutSeconds: 30,
}, async (request) => {
    const userId = await (0, auth_1.verifyAuth)(request);
    const { message, context } = request.data;
    if (!message) {
        throw new https_2.HttpsError('invalid-argument', 'Message is required');
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
    }
    catch (error) {
        console.error('Error in smartReply:', error);
        throw new https_2.HttpsError('internal', 'Failed to generate smart replies');
    }
});
//# sourceMappingURL=smartReply.js.map