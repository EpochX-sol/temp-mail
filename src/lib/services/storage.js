const isBrowser = typeof window !== 'undefined';

class StorageService {
    constructor() {
        this.EMAIL_KEY = 'emails';
        this.THEME_KEY = 'theme_mode';
    }

    getEmails() {
        const emails = localStorage.getItem(this.EMAIL_KEY);
        return emails ? JSON.parse(emails) : [];
    }

    addEmail(email) {
        const emails = this.getEmails();
        if (!emails.includes(email)) {
            emails.push(email);
            localStorage.setItem(this.EMAIL_KEY, JSON.stringify(emails));
            this.setCurrentEmail(email);
            return true;
        }
        return false;
    }

    setCurrentEmail(email) {
        localStorage.setItem('currentEmail', email);
        const emails = this.getEmails();
        if (!emails.includes(email)) {
            this.addEmail(email);
        }
    }

    removeEmail(email) {
        const emails = this.getEmails().filter(e => e !== email);
        localStorage.setItem(this.EMAIL_KEY, JSON.stringify(emails));
        if (emails.length > 0) {
            this.setCurrentEmail(emails[0]);
        } else {
            localStorage.removeItem('currentEmail');
        }
    }

    getTheme() {
        if (!isBrowser) return 'light';
        return localStorage.getItem(this.THEME_KEY) || 'light';
    }

    setTheme(theme) {
        if (!isBrowser) return;
        localStorage.setItem(this.THEME_KEY, theme);
    }
}

export const storageService = new StorageService(); 