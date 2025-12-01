"use strict";
/**
 * Backup Database Scheduled Function
 * Create daily backups of critical data
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.backupDatabase = void 0;
const scheduler_1 = require("firebase-functions/v2/scheduler");
const firestore_1 = require("firebase-admin/firestore");
const storage_1 = require("firebase-admin/storage");
const db = (0, firestore_1.getFirestore)();
const storage = (0, storage_1.getStorage)();
exports.backupDatabase = (0, scheduler_1.onSchedule)({
    schedule: 'every 24 hours', // Run daily
    timeZone: 'UTC',
}, async () => {
    console.log('Starting database backup...');
    try {
        const today = new Date().toISOString().split('T')[0];
        const backupData = {
            timestamp: new Date().toISOString(),
            users: [],
            groups: [],
            conversations: [],
        };
        // Backup users (limit to 1000 for performance)
        const usersSnapshot = await db.collection('users').limit(1000).get();
        backupData.users = usersSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
        // Backup groups
        const groupsSnapshot = await db.collection('groups').limit(500).get();
        backupData.groups = groupsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
        // Save backup to Storage
        const bucket = storage.bucket();
        const fileName = `backups/${today}.json`;
        const file = bucket.file(fileName);
        await file.save(JSON.stringify(backupData, null, 2), {
            contentType: 'application/json',
            metadata: {
                metadata: {
                    backupDate: today,
                    recordCount: {
                        users: backupData.users.length,
                        groups: backupData.groups.length,
                    },
                },
            },
        });
        console.log(`Backup saved to ${fileName}`);
    }
    catch (error) {
        console.error('Error in backupDatabase:', error);
        throw error;
    }
});
//# sourceMappingURL=backupDatabase.js.map