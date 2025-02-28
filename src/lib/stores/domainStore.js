import { writable } from 'svelte/store';

export const domainStore = writable({
    domains: [],
    isLoaded: false
}); 