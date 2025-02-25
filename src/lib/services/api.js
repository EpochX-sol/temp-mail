import { API_CONFIG, API_ENDPOINTS } from '../utils/constants.js';

class ApiService {
    constructor() {
        this.requestCount = 0;
        this.lastResetTime = Date.now();
        this.hasRedirected = false;
    }

    async checkRateLimit() { 
        const now = Date.now();
        if (now - this.lastResetTime >= API_CONFIG.RATE_LIMIT_INTERVAL) { 
            this.requestCount = 0;
            this.lastResetTime = now;
        }

        this.requestCount++; 
        if (this.requestCount > API_CONFIG.RATE_LIMIT_THRESHOLD) { 
            this.requestCount = 0;
            this.lastResetTime = now;
            this.redirectToApiPage('rate_limit');
            throw new Error('Rate limit exceeded. Please check our API documentation for limits and pricing.');
        }
    }

    redirectToApiPage(errorType) {
        if (!this.hasRedirected) {
            this.hasRedirected = true;
            window.location.href = errorType ? `/api?error=${errorType}` : '/api';
        }
    }

    async handleRequest(endpoint, options = {}) { 
        await this.checkRateLimit();

        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers,
                },
            }); 

            if (response.status === 429) { 
                this.requestCount = 0;
                this.lastResetTime = Date.now();
                this.redirectToApiPage('rate_limit');
                throw new Error('Rate limit exceeded. Please check our API documentation for limits and pricing.');
            }

            if (!response.ok) {
                console.error('HTTP error:', response.status);
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json(); 
            return data;
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    async getRandomEmail() { 
        try {
            const response = await this.handleRequest(API_ENDPOINTS.RANDOM_INBOX); 
            if (!response || response.code !== 200) {
                throw new Error('Invalid response format');
            }
            return response;
        } catch (error) { 
            throw error;
        }
    }

    async getInboxMessages(email) {
        try {
            const response = await this.handleRequest(API_ENDPOINTS.INBOX_MESSAGES(email));
            if (response.code !== 200) {
                throw new Error(response.msg || 'Failed to fetch messages');
            }
            return response;
        } catch (error) {
            throw error;
        }
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

  
  
    async bulkDelete(uids) {
        return this.handleRequest(API_ENDPOINTS.BULK_DELETE, {
            method: 'POST',
            body: JSON.stringify({ uids }),
        });
    }

    async getDomains() {
        try {
            const response = await this.handleRequest(API_ENDPOINTS.DOMAINS);
            if (!response || response.code !== 200) {
                throw new Error(response.msg || 'Failed to fetch domains');
            }
            return response;
        } catch (error) {
            console.error('Failed to get domains:', error);
            throw error;
        }
    }

    async markAsRead(uid) {
        try {
            const response = await this.handleRequest(API_ENDPOINTS.READ_MESSAGE(uid));
            return response.code === 200;
        } catch (error) {
            console.error('Failed to mark message as read:', error);
            return false;
        }
    }
}

export const apiService = new ApiService(); 