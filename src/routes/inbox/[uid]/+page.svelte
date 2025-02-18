<script>
    import { onMount } from 'svelte';
    import { apiService } from '$lib/services/api';
    import LoadingSpinner from '$lib/components/email/LoadingSpinner.svelte';

    export let data;
    const { uid } = data;

    let message = null;
    let loading = true;
    let error = null;

    async function loadMessage() {
        try {
            const response = await apiService.getMessage(uid);
            message = response.message;
        } catch (err) {
            error = 'Failed to load message';
        } finally {
            loading = false;
        }
    }

    onMount(loadMessage);
</script>

<svelte:head>
    <title>{message ? message.subject : 'Loading...'} - Temp Mail</title>
</svelte:head>

<div class="email-view">
    {#if loading}
        <LoadingSpinner />
    {:else if error}
        <div class="error">{error}</div>
    {:else if message}
        <div class="email-header">
            <h1>{message.subject}</h1>
            <div class="email-meta">
                <div class="sender">
                    From: <strong>{message.from.name}</strong> &lt;{message.from.address}&gt;
                </div>
                <div class="date">
                    {new Date(message.timestamp * 1000).toLocaleString()}
                </div>
            </div>
        </div>

        <div class="email-content">
            {@html message.msg.html}
        </div>

        <div class="email-actions">
            <a href="/read_full/{uid}" class="view-full-btn">
                View Full Email
            </a>
        </div>
    {/if}
</div>

<style>
    .email-view {
        background: var(--kt-body-bg);
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        padding: 2rem;
    }

    .email-header {
        border-bottom: 1px solid var(--kt-border-color);
        padding-bottom: 1rem;
        margin-bottom: 2rem;
    }

    h1 {
        font-size: 1.5rem;
        margin-bottom: 1rem;
        color: var(--kt-text-primary);
    }

    .email-meta {
        color: var(--kt-text-muted);
        font-size: 0.9rem;
    }

    .sender {
        margin-bottom: 0.5rem;
    }

    .email-content {
        line-height: 1.6;
        color: var(--kt-text-primary);
    }

    .email-actions {
        margin-top: 2rem;
        padding-top: 1rem;
        border-top: 1px solid var(--kt-border-color);
    }

    .view-full-btn {
        display: inline-block;
        padding: 0.5rem 1rem;
        background: var(--kt-primary);
        color: white;
        text-decoration: none;
        border-radius: 4px;
        transition: background-color 0.3s;
    }

    .view-full-btn:hover {
        background: var(--kt-primary-dark);
    }

    .error {
        color: var(--kt-danger);
        text-align: center;
        padding: 2rem;
    }
</style> 