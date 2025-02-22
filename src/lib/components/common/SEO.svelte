<script>
    import { SEO_CONFIG } from '$lib/utils/seo';
    
    export let page = 'DEFAULT';
    export let customTitle = '';
    export let customDescription = '';
    export let customKeywords = ''; 
    
    const config = page === 'DEFAULT' ? SEO_CONFIG.DEFAULT : SEO_CONFIG.PAGES[page];
    
    $: title = customTitle || config.title;
    $: description = customDescription || config.description;
    $: keywords = customKeywords || config.keywords; 
    
    const canonicalUrl = typeof window !== 'undefined' ? window.location.href : '';
</script>

<svelte:head>
    <title>{title}</title>
    <meta name="description" content={description} />
    <meta name="keywords" content={keywords} />
     
    <meta property="og:type" content="website" />
    <meta property="og:url" content={canonicalUrl} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} /> 
     
    <meta name="twitter:card" content={config.twitterCard} />
    <meta name="twitter:url" content={canonicalUrl} />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} /> 
     
    <meta name="robots" content="index, follow" />
    <meta name="googlebot" content="index, follow" />
    <link rel="canonical" href={canonicalUrl} />
     
    <script type="application/ld+json">
        {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": title,
            "description": description,
            "url": canonicalUrl
        })}
    </script>
</svelte:head> 