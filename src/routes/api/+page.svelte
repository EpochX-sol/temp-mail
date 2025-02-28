<script>
    import { page } from '$app/stores';
    import { onMount } from 'svelte';
    import { API_PAGE_CONFIG } from '$lib/utils/constants';
    import SEO from '$lib/components/common/SEO.svelte';
    import Button from '$lib/components/common/Button.svelte';

    let showRateLimitError = false;

    onMount(() => { 
        if (typeof window !== 'undefined') {
            showRateLimitError = sessionStorage.getItem('rateLimitError') === 'true'; 
            sessionStorage.removeItem('rateLimitError');
        }
    });
</script>

<SEO page="API" />

<div class="api-page">
    {#if showRateLimitError}
        <div class="rate-limit-warning">
            <i class="bi bi-exclamation-triangle-fill"></i>
            {API_PAGE_CONFIG.TEXTS.RATE_LIMIT_ERROR}
        </div>
    {/if}

    <header class="api-header">
        <div class="header-content">
            <h1>{API_PAGE_CONFIG.TEXTS.TITLE}</h1>
            <p class="subtitle">{API_PAGE_CONFIG.TEXTS.SUBTITLE}</p>
 
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

            <section class="how-it-works"> 
                <p>
                    Create disposable email addresses instantly on our secure domains. Monitor incoming messages through our 
                    "Inbox Messages" endpoint and access detailed message content, including attachments, via our 
                    "Message Content" endpoint. All through a simple, RESTful API interface.
                </p>

                <div class="docs-links">
                    <p>
                        Explore our comprehensive documentation in 
                        <a href="/docs" class="link">our API guide</a> 
                        or visit our official page on 
                        <a href="https://rapidapi.com" class="link">Rapid API</a>.
                    </p>
                </div>

                <ul class="feature-list">
                    <li>Instant email address generation on our verified domains</li>
                    <li>Perfect for automated testing and email verification workflows</li>
                    <li>Secure message handling for your automated communications</li>
                    <li>Enterprise-grade SMTP server with high-performance message processing</li>
                    <li>Reliable message and attachment storage with instant access</li>
                    <li>Simple REST API for managing and monitoring inboxes</li>
                    <li>Comprehensive message data in JSON format including headers, body content, 
                        timestamps, and attachment handling</li>
                </ul>

                <div class="cta-section">
                    <h1>Ready to get started? </h1>
                    <p>Get your API key  and start building amazing applications.</p>
                    <a href="https://rapidapi.com" class="cta-button">Get API Key</a>
                </div>
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
        padding: 30px 20px;
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
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .info-card:hover {
        transform: translateY(-5px);
    }

    .info-card i {
        font-size: 2rem;
        color: var(--highlight-color);
        margin-bottom: 16px;
        display: block;
    }

    .info-card h3 {
        margin-bottom: 12px;
    }

    .info-card p {
        margin: 0;
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
        border-radius: 8px;  
        background: var(--bg-secondary);
        padding: 20px;
    }

    .cta-button {
        display: inline-block; 
        color: white;
        background: #0056b3;
        padding: 12px 24px;
        border-radius: 6px;
        text-decoration: none;
        font-weight: bold; 
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
 

    .how-it-works {
        margin-top: 30px;
        padding: 0 20px;
    }

    .how-it-works h2 {
        font-size: 2rem;
        margin-bottom: 24px; 
    }

    .how-it-works p {
        font-size: 1.1rem;
        line-height: 1.6; 
        margin-bottom: 24px;
    } 

    .feature-list {
        list-style: none;
        padding: 0;
        margin: 32px 0;
    }

    .feature-list li {
        padding: 12px; 
        border-radius: 8px; 
        position: relative;
        padding-left: 24px;
    }

    .feature-list li::before {
        content: "•";
        position: absolute;
        left: 8px;
        color: var(--primary);
    }
 
    .cta-section p {
        margin-bottom: 4px;
    }

    .cta-button {
        margin-top: 10px;
        display: inline-block;
        background: var(--primary);
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        text-decoration: none;
        font-weight: 500;
        transition: all 0.2s ease;
    }

    .cta-button:hover {
        background: var(--primary-dark);
        transform: translateY(-2px);
    }

    .link {
        color: var(--primary);
        text-decoration: none;
        transition: color 0.2s ease;
    }

    .link:hover {
        color: var(--primary-dark);
        text-decoration: underline;
    }

    @media (max-width: 768px) {
        .how-it-works {
            margin-top: 40px;
            padding: 0 16px;
        }

        .feature-list li {
            padding: 12px;
            padding-left: 20px;
            font-size: 0.95rem;
        }

        .cta-section {
            padding: 32px 16px;
        }
    }

    .rate-limit-warning {
        background-color: #fbff001e; 
        border: 1px solid #ffeeba;
        padding: 16px 24px;
        border-radius: 8px;
        margin: 20px auto;
        max-width: 800px;
        display: flex;
        align-items: center;
        gap: 12px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }

    .rate-limit-warning i {
        font-size: 1.2rem;
        color: #856404;
    }

    @media (max-width: 768px) {
        .rate-limit-warning {
            margin: 16px;
            padding: 12px 16px;
            font-size: 0.9rem;
        }
    }
</style>