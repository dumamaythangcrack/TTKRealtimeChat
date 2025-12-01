"use strict";
/**
 * Translation Function (Google Translate API)
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.translation = void 0;
const https_1 = require("firebase-functions/v2/https");
const https_2 = require("firebase-functions/v2/https");
const auth_1 = require("../middleware/auth");
const translate_1 = require("@google-cloud/translate");
const translate = new translate_1.Translate();
exports.translation = (0, https_1.onCall)({
    maxInstances: 50,
    timeoutSeconds: 30,
}, async (request) => {
    const userId = await (0, auth_1.verifyAuth)(request);
    const { text, targetLanguage } = request.data;
    if (!text || !targetLanguage) {
        throw new https_2.HttpsError('invalid-argument', 'Text and target language are required');
    }
    try {
        const [translation] = await translate.translate(text, targetLanguage);
        return {
            success: true,
            translatedText: translation,
            sourceLanguage: 'auto-detected',
            targetLanguage,
        };
    }
    catch (error) {
        console.error('Error in translation:', error);
        throw new https_2.HttpsError('internal', 'Failed to translate text');
    }
});
//# sourceMappingURL=translation.js.map