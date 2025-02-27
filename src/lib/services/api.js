import { API_CONFIG, API_ENDPOINTS } from '../utils/constants.js';
import { warningStore } from '../stores/warningStore';
import { storageService } from './storage';

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
            
            // Set rate limit flag in sessionStorage
            if (typeof window !== 'undefined') {
                sessionStorage.setItem('rateLimitError', 'true');
            }
            
            this.redirectToApiPage('rate_limit');
            throw new Error('Rate limit exceeded. Please check our API documentation for limits and pricing.');
        }
    }

    redirectToApiPage(errorType) {
        if (!this.hasRedirected) {
            this.hasRedirected = true;
            window.location.href = '/api';
        }
    }

    async handleRequest(endpoint, options = {}) {  
        try {
            await this.checkRateLimit();

            const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers,
                },
            }); 

            if (response.status === 429) {
                if (typeof window !== 'undefined') {
                    sessionStorage.setItem('rateLimitError', 'true');
                    window.location.href = '/api';
                }
                throw new Error('Rate limit exceeded');
            }

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error(`API Error (${endpoint}):`, error);
            warningStore.set({
                show: true,
                message: error.message || 'An error occurred while fetching data',
                type: 'error'
            });
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
            console.error('Failed to fetch inbox messages:', error);
            warningStore.set({
                show: true,
                message: 'Failed to fetch messages. Please try again later.',
                type: 'error'
            });
            throw error;
        }
    }

    async getMessage(uid) {
        try {
            const cachedMessage = storageService.getMessageCache(uid);
            if (cachedMessage) {
                return { code: 200, message: cachedMessage };
            }

            const response = await this.handleRequest(API_ENDPOINTS.MESSAGE(uid));
            if (response.code === 200 && response.message) {
                storageService.setMessageCache(uid, response.message);
            }
            return response;
        } catch (error) {
            console.error('Failed to fetch message:', error);
            warningStore.set({
                show: true,
                message: 'Failed to load message. Please try again later.',
                type: 'error'
            });
            throw error;
        }
    }

    async deleteMessage(uid) {
        try {
            return await this.handleRequest(API_ENDPOINTS.DELETE_MESSAGE(uid));
        } catch (error) {
            console.error('Failed to delete message:', error);
            warningStore.set({
                show: true,
                message: 'Failed to delete message. Please try again later.',
                type: 'error'
            });
            throw error;
        }
    }

    async deleteInbox(email) {
        return this.handleRequest(API_ENDPOINTS.DELETE_INBOX(email));
    }

    async toggleStar(uid) {
        try {
            return await this.handleRequest(API_ENDPOINTS.STAR_MESSAGE(uid));
        } catch (error) {
            console.error('Failed to toggle star:', error);
            warningStore.set({
                show: true,
                message: 'Failed to update star status. Please try again later.',
                type: 'error'
            });
            throw error;
        }
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
            console.error('Failed to fetch domains:', error);
            warningStore.set({
                show: true,
                message: 'Failed to load domains. Please try again later.',
                type: 'error'
            });
            throw error;
        }
    }

    async markAsRead(uid) {
        try {
            const response = await this.handleRequest(API_ENDPOINTS.READ_MESSAGE(uid));
            return response.code === 200;
        } catch (error) {
            return false;
        }
    }
}

export const apiService = new ApiService(); 