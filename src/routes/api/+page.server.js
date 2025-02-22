import { SEO_CONFIG } from '$lib/utils/seo';

export async function load() {
    return {
        seo: SEO_CONFIG.PAGES.API,
        preloadedData: { 
            lastUpdated: new Date().toISOString(),
            apiVersion: "1.0.0"
        }
    };
} 