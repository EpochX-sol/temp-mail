const isBrowser = typeof window !== 'undefined';

class StorageService {
    constructor() {
        this.EMAIL_KEY = 'temp_mail_addresses';
        this.THEME_KEY = 'theme_mode';
    }

    getEmails() {
        if (!isBrowser) return [];
        const emails = localStorage.getItem(this.EMAIL_KEY);
        return emails ? JSON.parse(emails) : [];
    }

    addEmail(email) {
        if (!isBrowser) return;
        const emails = this.getEmails();
        if (!emails.includes(email)) {
            emails.push(email);
            localStorage.setItem(this.EMAIL_KEY, JSON.stringify(emails));
        }
    }

    removeEmail(email) {
        if (!isBrowser) return;
        const emails = this.getEmails().filter(e => e !== email);
        localStorage.setItem(this.EMAIL_KEY, JSON.stringify(emails));
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