import { writable } from 'svelte/store';
import { browser } from '$app/environment';

function createThemeStore() {
    let initialTheme = 'light';
    
    if (browser) {
        const userTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        initialTheme = userTheme || (prefersDark ? 'dark' : 'light');
        document.documentElement.classList.toggle('dark', initialTheme === 'dark');
    }
    
    const { subscribe, set } = writable(initialTheme);

    return {
        subscribe,
        toggleTheme: () => {
            if (!browser) return;
            
            const currentTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            localStorage.setItem('theme', newTheme);
            document.documentElement.classList.toggle('dark', newTheme === 'dark');
            set(newTheme);
        },
        setTheme: (theme) => {
            if (!browser) return;
            
            localStorage.setItem('theme', theme);
            document.documentElement.classList.toggle('dark', theme === 'dark');
            set(theme);
        }
    };
}

export const themeStore = createThemeStore(); 