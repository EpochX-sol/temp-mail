import { writable } from 'svelte/store';
import { browser } from '$app/environment';

function createThemeStore() {
    // Get initial theme
    const getInitialTheme = () => {
        if (!browser) return 'light';
        
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) return savedTheme;
        
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        return prefersDark ? 'dark' : 'light';
    };

    const { subscribe, set } = writable(getInitialTheme());

    // Apply theme to document
    const applyTheme = (theme) => {
        if (!browser) return;
        
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(theme);
        localStorage.setItem('theme', theme);
        set(theme);
    };

    // Initialize theme
    if (browser) {
        applyTheme(getInitialTheme());
        
        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            const currentTheme = localStorage.getItem('theme');
            if (!currentTheme) {
                applyTheme(e.matches ? 'dark' : 'light');
            }
        });
    }

    return {
        subscribe,
        toggleTheme: () => {
            if (!browser) return;
            const currentTheme = localStorage.getItem('theme') || getInitialTheme();
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            applyTheme(newTheme);
        },
        setTheme: (theme) => {
            if (!browser) return;
            applyTheme(theme);
        }
    };
}

export const themeStore = createThemeStore(); 