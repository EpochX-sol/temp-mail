export const API_CONFIG = {
    BASE_URL: 'https://api.snapinbox.net/api/v1',
    REFRESH_INTERVAL: 10000, // 10 seconds
    RATE_LIMIT_THRESHOLD: 10, // calls per interval
    RATE_LIMIT_INTERVAL: 10000, // 10 seconds
};

export const API_ENDPOINTS = {
    RANDOM_INBOX: '/inboxes/random',
    INBOX_MESSAGES: (email: string) => `/inboxes/${encodeURIComponent(email)}`,
    MESSAGE: (uid: string) => `/messages/${uid}`,
    DELETE_MESSAGE: (uid: string) => `/messages/${uid}/delete`,
    DELETE_INBOX: (email: string) => `/inboxes/${encodeURIComponent(email)}/delete`,
    STAR_MESSAGE: (uid: string) => `/messages/${uid}/star`,
    READ_MESSAGE: (uid: string) => `/messages/${uid}/read`,
    UNREAD_MESSAGE: (uid: string) => `/messages/${uid}/unread`,
    DOMAINS: '/domains',
    BULK_DELETE: '/messages/bulk',
}; 