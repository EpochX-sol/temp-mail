import { writable } from 'svelte/store';

export const warningStore = writable({
    show: false,
    message: '',
    type: ''
}); 