import { writable } from 'svelte/store';
import { apiService } from '../services/api';
import { storageService } from '../services/storage';
import { API_CONFIG } from '../utils/constants';
import { browser } from '$app/environment';

const STORAGE_KEY = 'currentEmail';

function createEmailStore() {
     const savedEmail = browser ? localStorage.getItem(STORAGE_KEY) : null;
    
    const { subscribe, set, update } = writable({
        currentEmail: savedEmail,
        messages: [],
        loading: false,
        error: null
    });

    let store;
    subscribe(value => {
        store = value;
        // Save currentEmail to localStorage whenever it changes
        if (browser && value.currentEmail) {
            localStorage.setItem(STORAGE_KEY, value.currentEmail);
        }
    });

    async function refreshMessages(force = false) {
        if (!store.currentEmail || store.loading) return;

        update(s => ({ ...s, loading: true }));
        try {
            const response = await apiService.getInboxMessages(store.currentEmail);
            if (response.code === 200) {
                update(s => ({
                    ...s,
                    messages: response.messages || [],
                    error: null,
                    loading: false
                }));
            }
        } catch (error) {
            // Don't keep trying to refresh if we hit rate limit
            if (error.message === 'Rate limit exceeded') {
                update(s => ({ 
                    ...s, 
                    error: 'Rate limit exceeded. Please wait a moment.',
                    loading: false
                }));
                return;
            }
            update(s => ({ 
                ...s, 
                error: error.message,
                loading: false 
            }));
        }
    }

    async function toggleStar(uid) {
        try {
            const response = await apiService.toggleStar(uid);
            if (response.success) {
                update(state => {
                    const messages = state.messages.map(msg => {
                        if (msg.uid === uid) {
                            return { ...msg, is_starred: !msg.is_starred };
                        }
                        return msg;
                    });
                    return { ...state, messages };
                });
            }
            return response;
        } catch (error) {
            throw error;
        }
    }

    async function setCurrentEmail(email) {
        update(s => ({ ...s, currentEmail: email, messages: [], loading: true }));
        
        try {
            const response = await apiService.getInboxMessages(email);
            if (response.code === 200) {
                update(s => ({
                    ...s,
                    messages: response.messages || [],
                    loading: false,
                    error: null
                }));
            }
        } catch (error) {
            update(s => ({ 
                ...s, 
                loading: false, 
                error: error.message 
            }));
        }
    }

    function clearCurrentEmail() {
        if (browser) {
            localStorage.removeItem(STORAGE_KEY);
        }
        update(s => ({ 
            ...s, 
            currentEmail: null, 
            messages: [], 
            loading: false, 
            error: null 
        }));
    }

    return {
        subscribe,
        setCurrentEmail,
        clearCurrentEmail,
        getAllEmails: () => {
            return storageService.getEmails();
        },
        toggleStar,
        deleteMessage: async (uid) => {
            try {
                await apiService.deleteMessage(uid);
                update(state => ({
                    ...state,
                    messages: state.messages.filter(msg => msg.uid !== uid)
                }));
            } catch (error) {
                console.error('Failed to delete message:', error);
                throw error;
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
        refreshMessages,
        startPolling: () => {
            const pollInterval = setInterval(() => {
                if (document.visibilityState === 'visible') {
                    refreshMessages();
                }
            }, 10000);

            document.addEventListener('visibilitychange', () => {
                if (document.visibilityState === 'visible') {
                    refreshMessages(true);
                }
            });

            return () => clearInterval(pollInterval);
        },
        bulkDelete: async (uids) => {
            try {
                await apiService.bulkDelete(uids);
                update(state => ({
                    ...state,
                    messages: state.messages.filter(msg => !uids.includes(msg.uid))
                }));
            } catch (error) {
                console.error('Failed to bulk delete messages:', error);
                throw error;
            }
        },
        deleteInbox: async (email) => {
            try {
                await apiService.deleteInbox(email);
                storageService.removeEmail(email);
                
                set({
                    currentEmail: null,
                    messages: [],
                    loading: false,
                    error: null,
                    lastRefresh: null,
                    isPaused: false
                });

                const remainingEmails = storageService.getEmails().filter(e => e !== email);
                if (remainingEmails.length > 0) {
                    const nextEmail = remainingEmails[0];
                    set({ currentEmail: nextEmail, messages: [], loading: true, error: null });
                    try {
                        const response = await apiService.getInboxMessages(nextEmail);
                        if (response.code === 200) {
                            update(s => ({
                                ...s,
                                messages: response.messages || [],
                                loading: false,
                                error: null
                            }));
                        }
                    } catch (error) {
                        update(s => ({ ...s, loading: false, error: error.message }));
                    }
                    storageService.setCurrentEmail(nextEmail);
                }
            } catch (error) {
                console.error('Failed to delete inbox:', error);
                throw error;
            }
        },
        updateMessage(uid, updates) {
            update(store => {
                const messageIndex = store.messages.findIndex(m => m.uid === uid);
                if (messageIndex !== -1) {
                    store.messages[messageIndex] = {
                        ...store.messages[messageIndex],
                        ...updates
                    };
                }
                return store;
            });
        }
    };
}

export const emailStore = createEmailStore(); 