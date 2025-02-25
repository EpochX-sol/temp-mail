import { writable } from 'svelte/store';
import { browser } from '$app/environment';

function createThemeStore() {
    const { subscribe, set } = writable('light');

    return {
        subscribe,
        setTheme: (theme) => {
            if (!browser) return;
             
            set(theme);
             
            localStorage.setItem('theme', theme);
             
            document.documentElement.setAttribute('data-theme', theme);
        },
        toggleTheme: () => {
            if (!browser) return;
            
            const current = localStorage.getItem('theme') || 'light';
            const newTheme = current === 'dark' ? 'light' : 'dark';
             
            themeStore.setTheme(newTheme);
        }
    };
}

export const themeStore = createThemeStore(); 