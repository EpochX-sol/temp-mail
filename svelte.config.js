import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
    kit: {
        adapter: adapter(),
        prerender: {
            handleHttpError: ({ path, referrer, message }) => { 
                if (path.startsWith('/api')) {
                    return;
                }
                throw new Error(message);
            },
            handleMissingId: ({ path, id, referrer }) => { 
                throw new Error(`Missing ID ${id} for path ${path}`);
            }
        }
    },
    preprocess: vitePreprocess()
};

export default config;
