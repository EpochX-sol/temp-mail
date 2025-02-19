import { writable } from 'svelte/store';
import { apiService } from '../services/api';

interface EmailState {
    currentEmail: string | null;
    messages: Message[];
    loading: boolean;
    error: string | null;
    lastRefresh: number | null;
    isPaused: boolean;
}

function createEmailStore() {
    const { subscribe, set, update } = writable<EmailState>({
        currentEmail: null,
        messages: [],
        loading: false,
        error: null,
        lastRefresh: null,
        isPaused: false
    });

    let store: EmailState;
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
        setCurrentEmail: async (email: string) => {
            update(s => ({ ...s, currentEmail: email, loading: true }));
            await refreshMessages(true);
        },
        refreshMessages,
        toggleStar: async (uid: string) => {
            try {
                const response = await apiService.toggleStar(uid);
                update(s => ({
                    ...s,
                    messages: s.messages.map(msg => 
                        msg.uid === uid ? { ...msg, is_starred: response.data?.is_starred ?? !msg.is_starred } : msg
                    )
                }));
            } catch (error) {
                console.error('Failed to toggle star:', error);
            }
        },
        deleteMessage: async (uid: string) => {
            try {
                await apiService.deleteMessage(uid);
                update(s => ({
                    ...s,
                    messages: s.messages.filter(msg => msg.uid !== uid)
                }));
            } catch (error) {
                console.error('Failed to delete message:', error);
            }
        },
        bulkDelete: async (uids: string[]) => {
            try {
                await apiService.bulkDelete(uids);
                update(s => ({
                    ...s,
                    messages: s.messages.filter(msg => !uids.includes(msg.uid))
                }));
            } catch (error) {
                console.error('Failed to bulk delete messages:', error);
            }
        },
        markAsRead: async (uid: string) => {
            try {
                await apiService.markAsRead(uid);
                update(s => ({
                    ...s,
                    messages: s.messages.map(msg => 
                        msg.uid === uid ? { ...msg, is_read: true } : msg
                    )
                }));
            } catch (error) {
                console.error('Failed to mark as read:', error);
            }
        },
        markAsUnread: async (uid: string) => {
            try {
                await apiService.markAsUnread(uid);
                update(s => ({
                    ...s,
                    messages: s.messages.map(msg => 
                        msg.uid === uid ? { ...msg, is_read: false } : msg
                    )
                }));
            } catch (error) {
                console.error('Failed to mark as unread:', error);
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