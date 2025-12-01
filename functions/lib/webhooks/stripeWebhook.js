"use strict";
/**
 * Stripe Webhook Handler
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.stripeWebhook = void 0;
const https_1 = require("firebase-functions/v2/https");
const firestore_1 = require("firebase-admin/firestore");
const db = (0, firestore_1.getFirestore)();
exports.stripeWebhook = (0, https_1.onRequest)({
    maxInstances: 10,
    timeoutSeconds: 30,
}, async (req, res) => {
    try {
        const event = req.body;
        // Handle different event types
        switch (event.type) {
            case 'payment_intent.succeeded':
                // Update user's coins or subscription
                const userId = event.data.object.metadata?.userId;
                if (userId) {
                    await db.collection('users').doc(userId).update({
                        'stats.coins': firestore_1.FieldValue.increment(event.data.object.amount / 100), // Convert cents to coins
                    });
                }
                break;
            case 'customer.subscription.created':
            case 'customer.subscription.updated':
                // Handle subscription updates
                break;
        }
        res.status(200).send({ received: true });
    }
    catch (error) {
        console.error('Error in stripeWebhook:', error);
        res.status(400).send({ error: 'Webhook handler failed' });
    }
});
//# sourceMappingURL=stripeWebhook.js.map