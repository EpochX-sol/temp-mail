import { SEO_CONFIG } from '$lib/utils/seo';
import { UI_CONFIG } from '$lib/utils/constants';

export const prerender = true;

export async function load() {
    return {
        seo: SEO_CONFIG.PAGES.HOME,
        preloadedData: {
            lastUpdated: new Date().toISOString()
        },
        demoMessages: UI_CONFIG.DEMO_MESSAGES,
        config: UI_CONFIG
    };
} 