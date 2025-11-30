/**
 * Application Constants
 */

export const APP_NAME = 'ChatTTK';
export const APP_VERSION = '1.0.0';

// Super Admin Email (for frontend checks)
export const SUPER_ADMIN_EMAIL = 'khangnek705@gmail.com';

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  CHAT: '/chat',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  ADMIN: '/admin',
  STORIES: '/stories',
  FRIENDS: '/friends',
  CALLS: '/calls',
  LIVESTREAM: '/livestream',
  COMMUNITY: '/community',
  SHOP: '/shop',
  BLOCKCHAIN: '/blockchain',
} as const;

// Message Types
export const MESSAGE_TYPES = {
  TEXT: 'text',
  IMAGE: 'image',
  VIDEO: 'video',
  AUDIO: 'audio',
  FILE: 'file',
  STICKER: 'sticker',
  GIF: 'gif',
  LOCATION: 'location',
  CONTACT: 'contact',
  POLL: 'poll',
} as const;

// User Roles
export const USER_ROLES = {
  OWNER: 'owner',
  ADMIN: 'admin',
  MODERATOR: 'moderator',
  MEMBER: 'member',
  USER: 'user',
} as const;

// Group Privacy
export const GROUP_PRIVACY = {
  PUBLIC: 'public',
  PRIVATE: 'private',
  INVITE_ONLY: 'invite_only',
} as const;

// Story Privacy
export const STORY_PRIVACY = {
  PUBLIC: 'public',
  FRIENDS: 'friends',
  CUSTOM: 'custom',
  PRIVATE: 'private',
} as const;

// File Upload Limits
export const FILE_LIMITS = {
  IMAGE: 10 * 1024 * 1024, // 10MB
  VIDEO: 100 * 1024 * 1024, // 100MB
  FILE: 2 * 1024 * 1024 * 1024, // 2GB
  AVATAR: 5 * 1024 * 1024, // 5MB
} as const;

// Pagination
export const PAGINATION = {
  MESSAGES_PER_PAGE: 50,
  USERS_PER_PAGE: 20,
  GROUPS_PER_PAGE: 20,
  STORIES_PER_PAGE: 10,
} as const;

// Colors
export const COLORS = {
  PRIMARY: '#3b82f6',
  SECONDARY: '#8b5cf6',
  SUCCESS: '#10b981',
  WARNING: '#f59e0b',
  ERROR: '#ef4444',
} as const;

// Animation Durations
export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
} as const;

