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
            return domains ? JSON.parse(domains) : null;
        }
        return null;
    },

    setDomains(domains) {
        if (isBrowser) {
            localStorage.setItem('domains', JSON.stringify(domains));
        }
    }
}; 