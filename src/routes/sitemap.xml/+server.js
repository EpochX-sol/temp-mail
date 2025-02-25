import { BASE_URL } from '$lib/utils/constants';  
export async function GET() { 
    const pages = [
        {
            url: '/',
            changefreq: 'daily',
            priority: 1.0
        },
        {
            url: '/about',
            changefreq: 'monthly',
            priority: 0.8
        },
        {
            url: '/api',
            changefreq: 'monthly',
            priority: 0.8
        },
        {
            url: '/contact',
            changefreq: 'monthly',
            priority: 0.8
        },
        {
            url: '/privacy',
            changefreq: 'monthly',
            priority: 0.5
        },
        {
            url: '/terms',
            changefreq: 'monthly',
            priority: 0.5
        }
    ];

    // Generate the XML
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${pages.map(page => `
    <url>
        <loc>${BASE_URL}${page.url}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>${page.changefreq}</changefreq>
        <priority>${page.priority}</priority>
    </url>`).join('')}
</urlset>`;

    return new Response(sitemap, {
        headers: {
            'Content-Type': 'application/xml',
            'Cache-Control': 'max-age=0, s-maxage=3600'
        }
    });
} 