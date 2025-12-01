"use strict";
/**
 * GitHub Webhook Handler
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.githubWebhook = void 0;
const https_1 = require("firebase-functions/v2/https");
exports.githubWebhook = (0, https_1.onRequest)({
    maxInstances: 10,
    timeoutSeconds: 30,
}, async (req, res) => {
    try {
        // Handle GitHub webhook events (commits, PRs, etc.)
        const event = req.body;
        console.log('GitHub webhook received:', event.type);
        res.status(200).send({ received: true });
    }
    catch (error) {
        console.error('Error in githubWebhook:', error);
        res.status(400).send({ error: 'Webhook handler failed' });
    }
});
//# sourceMappingURL=githubWebhook.js.map