import { API_CONFIG, API_ENDPOINTS } from '../utils/constants.js';

class ApiService {
    constructor() {
        this.requestCount = 0;
        this.lastResetTime = Date.now();
    }

    async checkRateLimit() {
        console.log('Checking rate limit');
        const now = Date.now();
        if (now - this.lastResetTime >= API_CONFIG.RATE_LIMIT_INTERVAL) {
            console.log('Resetting rate limit counter');
            this.requestCount = 0;
            this.lastResetTime = now;
        }

        this.requestCount++;
        console.log(`Request count: ${this.requestCount}`);
        if (this.requestCount > API_CONFIG.RATE_LIMIT_THRESHOLD) {
            console.log('Rate limit exceeded');
            window.location.href = '/rate-limit';
            throw new Error('Rate limit exceeded');
        }
    }

    async handleRequest(endpoint, options = {}) {
        console.log('Making request to:', endpoint);
        await this.checkRateLimit();

        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers,
                },
            });
            console.log('Response status:', response.status);

            if (response.status === 429) {
                console.log('Rate limit response received');
                window.location.href = '/rate-limit';
                throw new Error('Rate limit exceeded');
            }

            if (!response.ok) {
                console.error('HTTP error:', response.status);
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Response data:', data);
            return data;
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    async getRandomEmail() {
        console.log('Getting random email');
        try {
            const response = await this.handleRequest(API_ENDPOINTS.RANDOM_INBOX);
            console.log('Random email response:', response);
            if (!response || !response.email) {
                console.error('Invalid response format:', response);
                throw new Error('Invalid response format');
            }
            return response;
        } catch (error) {
            console.error('Failed to get random email:', error);
            throw error;
        }
    }

    async getInboxMessages(email) {
        return this.handleRequest(API_ENDPOINTS.INBOX_MESSAGES(email));
    }

    async getMessage(uid) {
        return this.handleRequest(API_ENDPOINTS.MESSAGE(uid));
    }

    async deleteMessage(uid) {
        return this.handleRequest(API_ENDPOINTS.DELETE_MESSAGE(uid));
    }

    async deleteInbox(email) {
        return this.handleRequest(API_ENDPOINTS.DELETE_INBOX(email));
    }

    async toggleStar(uid) {
        return this.handleRequest(API_ENDPOINTS.STAR_MESSAGE(uid));
    }

    async markAsRead(uid) {
        return this.handleRequest(API_ENDPOINTS.READ_MESSAGE(uid));
    }

    async markAsUnread(uid) {
        return this.handleRequest(API_ENDPOINTS.UNREAD_MESSAGE(uid));
    }

    async bulkDelete(uids) {
        return this.handleRequest(API_ENDPOINTS.BULK_DELETE, {
            method: 'POST',
            body: JSON.stringify({ uids }),
        });
    }

    async getDomains() {
        return this.handleRequest(API_ENDPOINTS.DOMAINS);
    }
}

export const apiService = new ApiService(); 