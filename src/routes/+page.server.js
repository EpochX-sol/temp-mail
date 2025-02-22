import { SEO_CONFIG } from '$lib/utils/seo';

export async function load() {
    return {
        seo: SEO_CONFIG.PAGES.HOME,
        preloadedData: {
            lastUpdated: new Date().toISOString()
        }
    };
} 