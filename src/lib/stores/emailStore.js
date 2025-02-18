import { writable } from 'svelte/store';
import { apiService } from '../services/api';
import { storageService } from '../services/storage';
import { API_CONFIG } from '../utils/constants';

const browser = typeof window !== 'undefined';

function createEmailStore() {
    const storedEmail = browser ? localStorage.getItem('currentEmail') : null;
    const { subscribe, set, update } = writable({
        currentEmail: storedEmail,
        messages: [],
        loading: false,
        error: null,
        lastRefresh: null,
        isPaused: false
    });

    let store;
    subscribe(value => store = value);

    async function refreshMessages(force = false) {
        if (!store.currentEmail || store.loading || store.isPaused) return;

        const now = Date.now();
        if (!force && store.lastRefresh && now - store.lastRefresh < 10000) {
            return;
        }

        update(s => ({ ...s, loading: true }));
        try {
            const response = await apiService.getInboxMessages(store.currentEmail);
            update(s => ({
                ...s,
                messages: response.messages,
                lastRefresh: now,
                error: null
            }));
        } catch (error) {
            update(s => ({ ...s, error: 'Failed to fetch messages' }));
        } finally {
            update(s => ({ ...s, loading: false }));
        }
    }

    return {
        subscribe,
        setCurrentEmail: (email) => {
            if (browser) {
                localStorage.setItem('currentEmail', email);
            }
            update(state => ({ ...state, currentEmail: email }));
            refreshMessages(true);
        },
        clearEmail: () => {
            if (browser) {
                localStorage.removeItem('currentEmail');
            }
            update(state => ({ ...state, currentEmail: null, messages: [] }));
        },
        toggleStar: async (uid) => {
            try {
                await apiService.toggleStar(uid);
                update(state => ({
                    ...state,
                    messages: state.messages.map(msg => 
                        msg.uid === uid ? { ...msg, is_starred: !msg.is_starred } : msg
                    )
                }));
            } catch (error) {
                console.error('Failed to toggle star:', error);
            }
        },
        deleteMessage: async (uid) => {
            try {
                await apiService.deleteMessage(uid);
                update(state => ({
                    ...state,
                    messages: state.messages.filter(msg => msg.uid !== uid)
                }));
            } catch (error) {
                console.error('Failed to delete message:', error);
            }
        },
        markAsRead: async (uid) => {
            try {
                await apiService.markAsRead(uid);
                update(state => ({
                    ...state,
                    messages: state.messages.map(msg => 
                        msg.uid === uid ? { ...msg, is_read: true } : msg
                    )
                }));
            } catch (error) {
                console.error('Failed to mark as read:', error);
            }
        },
        startPolling: () => {
            const pollInterval = setInterval(() => {
                if (document.visibilityState === 'visible') {
                    refreshMessages();
                }
            }, 10000);

            document.addEventListener('visibilitychange', () => {
                update(s => ({ ...s, isPaused: document.visibilityState !== 'visible' }));
                if (document.visibilityState === 'visible') {
                    refreshMessages(true);
                }
            });

            return () => clearInterval(pollInterval);
        }
    };
}

export const emailStore = createEmailStore(); 