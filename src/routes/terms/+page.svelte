<script>
    import { TERMS_PAGE_CONFIG } from '$lib/utils/constants';
    import { SEO_CONFIG } from '$lib/utils/constants';
    import SEO from '$lib/components/common/SEO.svelte';
</script>

<SEO {...SEO_CONFIG.TERMS} />

<div class="terms-page">
    <header class="terms-header">
        <div class="header-content">
            <h1>Terms and Conditions</h1> 
        </div>
    </header>

    <main class="terms-content">
        <div class="terms-section">
            {#each TERMS_PAGE_CONFIG.CONTENT.split('\n\n') as paragraph}
                <p>{paragraph.trim()}</p>
            {/each}
        </div>
    </main>
</div>

<style>
    .terms-page {
        min-height: 100vh;
        background: var(--bg-page);
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }

    .terms-header {
        padding: 40px 20px;
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
        font-family: 'Inter', sans-serif;
    }
 
    .terms-content {
        max-width: 1100px;
        margin: 0 auto;
        padding: 30px 20px;
    }

    .terms-section {
        margin-bottom: 40px;
        padding: 24px;
        border-radius: 12px;
        box-shadow: var(--shadow-sm); 
    }

 

    p {
        color: var(--text-secondary);
        line-height: 1.6;
        margin-bottom: 16px;
    } 

    .terms-section p {
        color: var(--text-secondary);
        line-height: 1.8;
        margin-bottom: 24px;
        font-size: 1rem;
    }

    .terms-section p:last-child {
        margin-bottom: 0;
    }

    @media (max-width: 768px) {
        .terms-header {
            padding: 40px 20px;
        }

        .header-content h1 {
            font-size: 2rem;
        }

        .terms-content {
            padding: 20px;
        }

        .terms-section {
            padding: 20px;
            margin-bottom: 20px;
        } 
    }
</style> 