export const API_CONFIG = {
    BASE_URL: 'https://api.snapinbox.net/api/v1',
    REFRESH_INTERVAL: 10000,
    RATE_LIMIT_THRESHOLD: 10,
    RATE_LIMIT_INTERVAL: 10000,
};

export const REFRESH_INTERVAL = 10000;

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
export const API_WINDOW = 10000;

export const UI_CONFIG = {
    PAGINATION: {
        DEFAULT_PAGE: 1,
        DEFAULT_ROWS_PER_PAGE: 10,
        PAGE_SIZES: [
            { value: 5, label: '5' },
            { value: 10, label: '10' },
            { value: 20, label: '20' },
            { value: 50, label: '50' }
        ]
    },
    ANIMATION: {
        MAX_ITERATIONS: 10,
        REFRESH_ANIMATION_DURATION: 500,
        COPY_FEEDBACK_DURATION: 2000
    },
    DEMO_MESSAGES: [
        {
            uid: '1',
            name: 'us@inboxes.com',
            subject: 'Welcome to our service - Welcome to the inboxes.com temporary email service',
            time: 'A few seconds ago',
            from: {
                name: 'Welcome Bot',
                address: 'us@inboxes.com'
            },
            is_starred: false,
            is_read: false,
            avatarColor: '#FFE2E5',
            avatarTextColor: '#F1416C'
        },
        {
            uid: '2',
            name: 'support@inboxes.com',
            subject: 'Have questions? - you can contact us for help',
            time: '39 seconds ago',
            from: {
                name: 'Support Team',
                address: 'support@inboxes.com'
            },
            is_starred: false,
            is_read: false,
            avatarColor: '#E8FFF3',
            avatarTextColor: '#50CD89'
        },
        {
            uid: '3',
            name: 'security@inboxes.com',
            subject: 'Your privacy is our priority - Learn about our security features',
            time: '1 minute ago',
            from: {
                name: 'Security Team',
                address: 'security@inboxes.com'
            },
            is_starred: false,
            is_read: false,
            avatarColor: '#FFF8DD',
            avatarTextColor: '#FFA800'
        },
        {
            uid: '4',
            name: 'tips@inboxes.com',
            subject: 'Pro tips for using temporary email - Get the most out of our service',
            time: '2 minutes ago',
            from: {
                name: 'Tips & Tricks',
                address: 'tips@inboxes.com'
            },
            is_starred: false,
            is_read: false,
            avatarColor: '#EEE5FF',
            avatarTextColor: '#7239EA'
        }
    ],
    LOCAL_STORAGE_KEYS: {
        PAGE_SIZE: 'preferredPageSize',
        CURRENT_EMAIL: 'currentEmail',
        THEME: 'theme'
    }
}; 