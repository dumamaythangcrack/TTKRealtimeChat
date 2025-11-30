/**
 * ChatTTK Cloud Functions - Main Entry Point
 * Exports all Cloud Functions for deployment
 */

import { onRequest } from 'firebase-functions/v2/https';
import { onDocumentCreated, onDocumentUpdated, onDocumentDeleted } from 'firebase-functions/v2/firestore';
import { onSchedule } from 'firebase-functions/v2/scheduler';

// Triggers
export { onUserCreate } from './triggers/onUserCreate';
export { onUserDelete } from './triggers/onUserDelete';
export { onMessageSent } from './triggers/onMessageSent';
export { onCallStart } from './triggers/onCallStart';
export { onStoryCreate } from './triggers/onStoryCreate';
export { onGroupCreate } from './triggers/onGroupCreate';

// Scheduled Functions
export { cleanupStories } from './scheduled/cleanupStories';
export { cleanupDeletedUsers } from './scheduled/cleanupDeletedUsers';
export { generateAnalytics } from './scheduled/generateAnalytics';
export { backupDatabase } from './scheduled/backupDatabase';
export { sendDailySummary } from './scheduled/sendDailySummary';

// Callable Functions
export { sendMessage } from './callable/sendMessage';
export { createGroup } from './callable/createGroup';
export { startCall } from './callable/startCall';
export { sendFriendRequest } from './callable/sendFriendRequest';
export { reportContent } from './callable/reportContent';
export { purchaseItem } from './callable/purchaseItem';
export { adminActions } from './callable/adminActions';

// AI Functions
export { chatbot } from './ai/chatbot';
export { contentModeration } from './ai/contentModeration';
export { imageEnhancement } from './ai/imageEnhancement';
export { translation } from './ai/translation';
export { sentimentAnalysis } from './ai/sentimentAnalysis';
export { smartReply } from './ai/smartReply';

// Blockchain Functions
export { verifyNFT } from './blockchain/verifyNFT';
export { processPayment } from './blockchain/processPayment';
export { mintBadge } from './blockchain/mintBadge';

// Webhooks
export { stripeWebhook } from './webhooks/stripeWebhook';
export { twilioWebhook } from './webhooks/twilioWebhook';
export { githubWebhook } from './webhooks/githubWebhook';

