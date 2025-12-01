"use strict";
/**
 * Twilio Webhook Handler
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.twilioWebhook = void 0;
const https_1 = require("firebase-functions/v2/https");
exports.twilioWebhook = (0, https_1.onRequest)({
    maxInstances: 10,
    timeoutSeconds: 30,
}, async (req, res) => {
    try {
        // Handle Twilio SMS/webhook events
        const event = req.body;
        // Process SMS delivery status, incoming messages, etc.
        console.log('Twilio webhook received:', event);
        res.status(200).send({ received: true });
    }
    catch (error) {
        console.error('Error in twilioWebhook:', error);
        res.status(400).send({ error: 'Webhook handler failed' });
    }
});
//# sourceMappingURL=twilioWebhook.js.map