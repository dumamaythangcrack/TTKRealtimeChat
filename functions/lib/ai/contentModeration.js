"use strict";
/**
 * Content Moderation Function (Cloud Vision API)
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.contentModeration = contentModeration;
exports.moderateImage = moderateImage;
const vision_1 = require("@google-cloud/vision");
const visionClient = new vision_1.ImageAnnotatorClient();
/**
 * Moderate text content
 */
async function contentModeration(text) {
    // Simple keyword-based moderation (can be enhanced with ML)
    const toxicKeywords = ['spam', 'scam', 'hate', 'abuse'];
    const lowerText = text.toLowerCase();
    let isToxic = false;
    let isSpam = false;
    let score = 0;
    // Check for toxic keywords
    for (const keyword of toxicKeywords) {
        if (lowerText.includes(keyword)) {
            isToxic = true;
            score += 0.3;
        }
    }
    // Check for spam patterns (repeated characters, excessive caps)
    if (/(.)\1{4,}/.test(text) || text === text.toUpperCase() && text.length > 10) {
        isSpam = true;
        score += 0.2;
    }
    return {
        isToxic,
        isSpam,
        isNSFW: false,
        score: Math.min(score, 1),
        reason: isToxic ? 'Contains toxic content' : isSpam ? 'Spam detected' : undefined,
    };
}
/**
 * Moderate image content
 */
async function moderateImage(imageUrl) {
    try {
        const [result] = await visionClient.safeSearchDetection(imageUrl);
        const safeSearch = result.safeSearchAnnotation;
        if (!safeSearch) {
            return {
                isToxic: false,
                isSpam: false,
                isNSFW: false,
                score: 0,
            };
        }
        const isNSFW = safeSearch.adult === 'VERY_LIKELY' ||
            safeSearch.adult === 'LIKELY' ||
            safeSearch.racy === 'VERY_LIKELY' ||
            safeSearch.racy === 'LIKELY';
        const score = isNSFW ? 0.9 : 0;
        return {
            isToxic: false,
            isSpam: false,
            isNSFW,
            score,
            reason: isNSFW ? 'NSFW content detected' : undefined,
        };
    }
    catch (error) {
        console.error('Error moderating image:', error);
        return {
            isToxic: false,
            isSpam: false,
            isNSFW: false,
            score: 0,
        };
    }
}
//# sourceMappingURL=contentModeration.js.map