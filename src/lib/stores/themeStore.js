import { writable } from 'svelte/store';
import { browser } from '$app/environment';

function createThemeStore() {
    const { subscribe, set } = writable('light');

    return {
        subscribe,
        setTheme: (theme) => {
            if (!browser) return;
            
            // Update theme
            set(theme);
            
            // Store preference
            localStorage.setItem('theme', theme);
            
            // Update CSS variables
            document.documentElement.setAttribute('data-theme', theme);
        },
        toggleTheme: () => {
            if (!browser) return;
            
            const current = localStorage.getItem('theme') || 'light';
            const newTheme = current === 'dark' ? 'light' : 'dark';
            
            // Use setTheme to ensure consistent updates
            themeStore.setTheme(newTheme);
        }
    };
}

export const themeStore = createThemeStore(); 