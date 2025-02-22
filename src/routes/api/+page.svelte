<script>
    import { page } from '$app/stores';
    import { onMount } from 'svelte';
    import { API_PAGE_CONFIG } from '$lib/utils/constants';
    import SEO from '$lib/components/common/SEO.svelte';
    import Button from '$lib/components/common/Button.svelte';

    let showRateLimitError = false;

    onMount(() => {
        const errorParam = $page.url.searchParams.get('error');
        showRateLimitError = errorParam === 'rate_limit';
    });
</script>

<SEO page="API" />

<div class="api-page">
    <header class="api-header">
        <div class="header-content">
            <h1>{API_PAGE_CONFIG.TEXTS.TITLE}</h1>
            <p class="subtitle">{API_PAGE_CONFIG.TEXTS.SUBTITLE}</p>
            
            {#if showRateLimitError}
                <div class="rate-limit-alert" transition:fade>
                    <i class="bi bi-exclamation-triangle"></i>
                    <p>{API_PAGE_CONFIG.TEXTS.RATE_LIMIT_ERROR}</p>
                </div>
            {/if}
        </div>
    </header>

    <main class="api-content">
        <div class="content-wrapper">
            <section class="intro-section">
                <h2>How It Works</h2>
                <p>{API_PAGE_CONFIG.TEXTS.INTRO}</p>
                
                <div class="api-info">
                    {#each API_PAGE_CONFIG.INFO_CARDS as card}
                        <div class="info-card">
                            <i class="bi {card.icon}"></i>
                            <h3>{card.title}</h3>
                            <p>{card.description}</p>
                        </div>
                    {/each}
                </div>
            </section>

            <section class="endpoints-section">
                <h2>API Endpoints</h2>
                {#each API_PAGE_CONFIG.ENDPOINTS as endpoint}
                    <div class="endpoint-card">
                        <div class="endpoint-header">
                            <span class="method {endpoint.method.toLowerCase()}">{endpoint.method}</span>
                            <code class="path">{endpoint.path}</code>
                        </div>
                        <div class="endpoint-content">
                            <h3>{endpoint.title}</h3>
                            <p>{endpoint.description}</p>
                            <div class="response">
                                <h4>Example Response</h4>
                                <pre><code>{JSON.stringify(endpoint.response, null, 2)}</code></pre>
                            </div>
                        </div>
                    </div>
                {/each}
            </section>

            <section class="cta-section">
                <h2>{API_PAGE_CONFIG.TEXTS.CTA_TITLE}</h2>
                <p>{API_PAGE_CONFIG.TEXTS.CTA_SUBTITLE}</p>
                <Button 
                    variant="info"
                    size="md"
                    icon="bi-code-slash"
                    on:click={() => window.open(API_PAGE_CONFIG.TEXTS.CTA_BUTTON_LINK, '_blank')}
                >
                    {API_PAGE_CONFIG.TEXTS.CTA_BUTTON_TEXT}
                </Button>
            </section>
        </div>
    </main>
</div>

<style>
    .api-page {
        min-height: 100vh;
        background: var(--bg-page);
        color: var(--text-primary);
    }

    .api-header {
        padding: 60px 20px;
        text-align: center;
    }

    .header-content {
        max-width: 800px;
        margin: 0 auto;
    }

    .header-content h1 {
        font-size: 2.5rem;
        margin: 0;
        color: var(--text-primary);
        font-weight: 600;
    }

    .subtitle {
        color: var(--text-secondary);
        font-size: 1.1rem;
        margin-top: 12px;
    }

    .api-content {
        max-width: 1200px;
        margin: 0 auto;
        padding: 48px 24px;
    }

    .intro-section {
        margin-bottom: 48px;
    }

    .api-info {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 24px;
        margin-top: 32px;
    }

    .info-card {
        background: var(--bg-primary);
        padding: 24px;
        border-radius: 8px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        transition: transform 0.2s;
    }

    .info-card:hover {
        transform: translateY(-5px);
    }

    .info-card i {
        font-size: 2rem;
        color: var(--highlight-color);
        margin-bottom: 16px;
    }

    .endpoint-card {
        background: var(--bg-primary);
        border-radius: 8px;
        margin-bottom: 24px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        overflow: hidden;
    }

    .endpoint-header {
        padding: 16px;
        background: var(--bg-secondary);
        display: flex;
        align-items: center;
        gap: 12px;
    }

    .method {
        padding: 4px 8px;
        border-radius: 4px;
        font-weight: bold;
        font-size: 0.9rem;
    }

    .method.get {
        background: #28a745;
        color: white;
    }

    .path {
        font-family: monospace;
        font-size: 1rem;
    }

    .endpoint-content {
        padding: 24px;
    }

    .response {
        margin-top: 16px;
        background: var(--bg-tertiary);
        border-radius: 4px;
        padding: 16px;
    }

    .response pre {
        margin: 0;
        overflow-x: auto;
    }

    .response code {
        font-family: monospace;
        font-size: 0.9rem;
    }

    .cta-section {
        text-align: center;
        margin-top: 64px;
        padding: 48px;
        background: var(--bg-primary);
        border-radius: 8px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }

    .cta-button {
        display: inline-block; 
        color: white;
        background: #0056b3;
        padding: 12px 24px;
        border-radius: 6px;
        text-decoration: none;
        font-weight: bold;
        margin-top: 24px;
        transition: background-color 0.2s;
    }
 
    @media (max-width: 768px) {
        .api-header {
            padding: 40px 0;
        }

        .header-content h1 {
            font-size: 2rem;
        }

        .api-content {
            padding: 24px;
        }

        .endpoint-header {
            flex-direction: column;
            align-items: flex-start;
        }

        .info-card {
            padding: 16px;
        }
    }

    .rate-limit-alert {
        margin-top: 1rem;
        padding: 1rem;
        background-color: #fff3cd;
        border: 1px solid #ffeeba;
        border-radius: 6px;
        color: #856404;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .rate-limit-alert i {
        font-size: 1.25rem;
    }

    .rate-limit-alert p {
        margin: 0;
        font-size: 0.95rem;
    }

    :global(.dark) .rate-limit-alert {
        background-color: #382d06;
        border-color: #665c2c;
        color: #ffd970;
    }
</style>