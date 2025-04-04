import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter(),
    prerender: {
      entries: ['*','/message/1'],
      handleMissingId: 'ignore'
    },
  },
  onwarn: (warning, handler) => { 
    return
}
 
};

export default config;