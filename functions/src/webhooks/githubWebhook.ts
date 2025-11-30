/**
 * GitHub Webhook Handler
 */

import { onRequest } from 'firebase-functions/v2/https';

export const githubWebhook = onRequest(
  {
    maxInstances: 10,
    timeoutSeconds: 30,
  },
  async (req, res) => {
    try {
      // Handle GitHub webhook events (commits, PRs, etc.)
      const event = req.body;

      console.log('GitHub webhook received:', event.type);

      res.status(200).send({ received: true });
    } catch (error) {
      console.error('Error in githubWebhook:', error);
      res.status(400).send({ error: 'Webhook handler failed' });
    }
  }
);

