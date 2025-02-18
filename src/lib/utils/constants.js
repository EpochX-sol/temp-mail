export const API_CONFIG = {
    BASE_URL: 'https://api.snapinbox.net/api/v1',
    REFRESH_INTERVAL: 10000, // 10 seconds
    RATE_LIMIT_THRESHOLD: 10, // calls per interval
    RATE_LIMIT_INTERVAL: 10000, // 10 seconds
};

export const REFRESH_INTERVAL = 10000; // 10 seconds

export const API_ENDPOINTS = {
    RANDOM_INBOX: '/inboxes/random',
    INBOX_MESSAGES: (email) => `/inboxes/${encodeURIComponent(email)}`,
    MESSAGE: (uid) => `/messages/${uid}`,
    DELETE_MESSAGE: (uid) => `/messages/${uid}/delete`,
    DELETE_INBOX: (email) => `/inboxes/${encodeURIComponent(email)}/delete`,
    STAR_MESSAGE: (uid) => `/messages/${uid}/star`,
    READ_MESSAGE: (uid) => `/messages/${uid}/read`,
    UNREAD_MESSAGE: (uid) => `/messages/${uid}/unread`,
    DOMAINS: '/domains',
    BULK_DELETE: '/messages/bulk',
};

export const MAX_API_CALLS = 10;
export const API_WINDOW = 10000; // 10 seconds 