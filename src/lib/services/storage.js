const isBrowser = typeof window !== 'undefined';
let subscribers = [];

export const storageService = {
    subscribe(callback) {
        subscribers.push(callback);
        return () => {
            subscribers = subscribers.filter(cb => cb !== callback);
        };
    },

    notifySubscribers() {
        subscribers.forEach(callback => callback());
    },

    getEmails() {
        if (isBrowser) {
            const emails = localStorage.getItem('emails');
            return emails ? JSON.parse(emails) : [];
        }
        return [];
    },

    setCurrentEmail(email) {
        if (isBrowser) {
            localStorage.setItem('currentEmail', email);
        }
    },

    // Make sure this method isn't being called unnecessarily
    clearCurrentEmail() {
        if (isBrowser) {
            localStorage.removeItem('currentEmail');
        }
    },

    addEmail(email) {
        const emails = this.getEmails();
        if (emails.length >= this.MAX_EMAILS) {
            return { success: false, message: 'Maximum limit of 10 emails exceeded.' };
        }
        if (!emails.includes(email)) {
            emails.push(email);
            localStorage.setItem('emails', JSON.stringify(emails));
            this.setCurrentEmail(email);
            this.notifySubscribers();
            return { success: true };
        }
        return { success: false, message: 'Email already exists.' };
    },

    removeEmail(email) {
        const emails = this.getEmails().filter(e => e !== email);
        localStorage.setItem('emails', JSON.stringify(emails));
        if (emails.length > 0) {
            this.setCurrentEmail(emails[0]);
        } else {
            this.clearCurrentEmail();
        }
        this.notifySubscribers();
    },

    getTheme() {
        if (!isBrowser) return 'light';
        return localStorage.getItem('theme_mode') || 'light';
    },

    setTheme(theme) {
        if (!isBrowser) return;
        localStorage.setItem('theme_mode', theme);
    },

    getDomains() {
        if (isBrowser) {
            const domains = localStorage.getItem('domains');
            const timestamp = localStorage.getItem('domains_timestamp');
            
            if (domains && timestamp) {
                // Check if domains are less than 1 hour old
                const isValid = Date.now() - parseInt(timestamp) < 3600000; // 1 hour
                if (isValid) {
                    return JSON.parse(domains);
                }
            }
        }
        return null;
    },

    setDomains(domains) {
        if (isBrowser) {
            localStorage.setItem('domains', JSON.stringify(domains));
            localStorage.setItem('domains_timestamp', Date.now().toString());
        }
    },

    getMessageCache(uid) {
        if (!isBrowser) return null;
        const cache = localStorage.getItem(`message_${uid}`);
        const timestamp = localStorage.getItem(`message_${uid}_timestamp`);
        
        if (cache && timestamp) {
            // Cache valid for 1 hour
            const isValid = Date.now() - parseInt(timestamp) < 3600000;
            if (isValid) {
                return JSON.parse(cache);
            }
        }
        return null;
    },

    setMessageCache(uid, message) {
        if (!isBrowser) return;
        localStorage.setItem(`message_${uid}`, JSON.stringify(message));
        localStorage.setItem(`message_${uid}_timestamp`, Date.now().toString());
    }
}; 