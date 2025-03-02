<script>
    import { page } from '$app/stores';
    import SEO from '$lib/components/common/SEO.svelte';

    // Get the status code
    $: status = $page.status;
    $: message = $page.error?.message || 'An unexpected error occurred.';
</script>

<SEO 
    title="{status} Error - Temp Mail"
    description={message}
/>

<div class="error-page">
    <h1>{status} Error</h1>
    <p class="error-message">{message}</p>

    <div class="actions">
        <a href="/" class="back-home-link">Back to Home</a>
    </div>
</div>

<style>
    .error-page {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 2rem;
        background: var(--bg-page);
        color: var(--text-primary);
    }

    h1 {
        font-size: 2rem;
        margin-bottom: 1rem;
    }

    .error-message {
        margin-bottom: 2rem;
        font-size: 1.1rem;
        text-align: center;
    }

    .actions {
        display: flex;
        gap: 1rem;
    }

    .back-home-link {
        text-decoration: none;
        color: var(--primary);
        font-size: 1.1rem;
        padding: 0.5rem 1rem; 
        border-radius: 8px;
        transition: background 0.2s ease;
    }

    .back-home-link:hover {
        background: var(--bg-tertiary);
    }
</style> 