interface Message {
    uid: string;
    recipient: string;
    sender: string;
    subject: string;
    is_starred: boolean;
    is_read: boolean;
    from: {
        name: string;
        address: string;
    };
    msg: {
        text: string;
        text_formatted: string;
        html: string;
    };
    date: string;
    timestamp: number;
}

interface ApiResponse<T> {
    status: 'ok' | 'error';
    code: number;
    msg?: string;
    data?: T;
}

const API_BASE_URL = 'https://api.snapinbox.net/api/v1';

const API_ENDPOINTS = {
    RANDOM_EMAIL: '/inboxes/random',
    INBOX_MESSAGES: (email: string) => `/inboxes/${email}`,
    MESSAGE: (uid: string) => `/messages/${uid}`,
    DELETE_MESSAGE: (uid: string) => `/messages/${uid}/delete`,
    DELETE_INBOX: (email: string) => `/inboxes/${email}/delete`,
    STAR_MESSAGE: (uid: string) => `/messages/${uid}/star`,
    READ_MESSAGE: (uid: string) => `/messages/${uid}/read`,
    UNREAD_MESSAGE: (uid: string) => `/messages/${uid}/unread`,
    DOMAINS: '/domains',
    BULK_DELETE: '/messages/bulk'
};

class ApiService {
    private lastRequestTime: number = 0;
    private readonly minRequestInterval: number = 1000; // 1 second

    private async checkRateLimit(): Promise<void> {
        const now = Date.now();
        const timeSinceLastRequest = now - this.lastRequestTime;
        if (timeSinceLastRequest < this.minRequestInterval) {
            await new Promise(resolve => 
                setTimeout(resolve, this.minRequestInterval - timeSinceLastRequest)
            );
        }
        this.lastRequestTime = now;
    }

    private async handleRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        try {
            await this.checkRateLimit();
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                }
            });

            if (response.status === 429) {
                window.location.href = '/rate-limit';
                throw new Error('Rate limit exceeded');
            }

            const data = await response.json();
            if (data.code >= 400) {
                throw new Error(data.msg || 'API Error');
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    async getRandomEmail(): Promise<{ email: string }> {
        return this.handleRequest(API_ENDPOINTS.RANDOM_EMAIL);
    }

    async getInboxMessages(email: string): Promise<{ messages: Message[] }> {
        return this.handleRequest(API_ENDPOINTS.INBOX_MESSAGES(email));
    }

    async getMessage(uid: string): Promise<{ message: Message }> {
        return this.handleRequest(API_ENDPOINTS.MESSAGE(uid));
    }

    async deleteMessage(uid: string): Promise<ApiResponse<void>> {
        return this.handleRequest(API_ENDPOINTS.DELETE_MESSAGE(uid));
    }

    async deleteInbox(email: string): Promise<ApiResponse<void>> {
        return this.handleRequest(API_ENDPOINTS.DELETE_INBOX(email));
    }

    async toggleStar(uid: string): Promise<ApiResponse<{ is_starred: boolean }>> {
        return this.handleRequest(API_ENDPOINTS.STAR_MESSAGE(uid));
    }

    async markAsRead(uid: string): Promise<ApiResponse<void>> {
        return this.handleRequest(API_ENDPOINTS.READ_MESSAGE(uid));
    }

    async markAsUnread(uid: string): Promise<ApiResponse<void>> {
        return this.handleRequest(API_ENDPOINTS.UNREAD_MESSAGE(uid));
    }

    async getDomains(): Promise<{ domains: string[] }> {
        return this.handleRequest(API_ENDPOINTS.DOMAINS);
    }

    async bulkDelete(uids: string[]): Promise<ApiResponse<void>> {
        return this.handleRequest(API_ENDPOINTS.BULK_DELETE, {
            method: 'POST',
            body: JSON.stringify({ uids })
        });
    }
}

export const apiService = new ApiService(); 