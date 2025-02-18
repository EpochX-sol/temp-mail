import { writable } from 'svelte/store';
import { browser } from '$app/environment';

function createThemeStore() {
    const prefersDark = browser && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = browser ? localStorage.getItem('theme') || (prefersDark ? 'dark' : 'light') : 'light';
    
    const { subscribe, set } = writable(initialTheme);

    if (browser) {
        // Set initial theme
        document.documentElement.classList.toggle('dark', initialTheme === 'dark');
    }

    return {
        subscribe,
        toggleTheme: () => {
            if (!browser) return;
            
            const currentTheme = localStorage.getItem('theme') || (prefersDark ? 'dark' : 'light');
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