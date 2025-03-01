import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter({
      fallback: 'index.html',
      strict: false
    }),
    prerender: {
      entries: ['/about', '/contact', '/api', '/terms', '/privacy', '/message/1','/'],
    }
  }
};

export default config;