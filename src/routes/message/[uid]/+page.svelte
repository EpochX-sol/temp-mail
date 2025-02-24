<script>
    import { page } from '$app/stores';
    import { onMount } from 'svelte';
    import { apiService } from '$lib/services/api';
    import LoadingSpinner from '$lib/components/email/LoadingSpinner.svelte';

    let message = null;
    let loading = true;
    let error = null;

    onMount(async () => {
        try {
            const uid = $page.params.uid;
            const response = await apiService.getMessage(uid);
            if (response.code === 200 && response.message) {
                message = response.message;
                 
                if (!message.is_read) {
                    message = { ...message, is_read: true }; 
                    apiService.markAsRead(uid).catch(error => {
                        console.error('Failed to mark message as read:', error);
                    });
                }
            } else {
                error = 'Message not found';
            }
        } catch (err) {
            console.error('Failed to fetch message:', err);
            error = 'Failed to load message';
        } finally {
            loading = false;
        }
    });

    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric'
        });
    }
</script>

<svelte:head>
    {#if message}
        <title>{message.subject} - Email Content</title>
    {:else}
        <title>Loading Message...</title>
    {/if}
</svelte:head>

<div class="email-viewer">
    {#if loading}
        <div class="loading-container">
            <LoadingSpinner />
        </div>
    {:else if error}
        <div class="error-container">
            <i class="bi bi-exclamation-circle"></i>
            <p>{error}</p>
        </div>
    {:else if message}
        <div class="email-header">
            <h1 class="email-subject">{message.subject}</h1>
            <div class="email-meta">
                <div class="sender">
                    <span class="from-name">{message.from.name}</span>
                    <span class="from-address">&lt;{message.from.address}&gt;</span>
                </div>
                <div class="date">{formatDate(message.date)}</div>
            </div>
        </div>
        <div class="email-content">
            <!-- {#if message.msg.html}
                <iframe
                    class="email-iframe"
                    sandbox="allow-same-origin"
                    srcdoc={message.msg.html}
                    title="Email Content" 
                    style="height: 100vh; width: 50vw;"
                ></iframe>
            {:else if message.msg.text_formatted}
                <pre>{message.msg.text_formatted}</pre>
            {:else}
                <pre>{message.msg.text}</pre>
            {/if} -->
        </div>
    {/if}
</div>

<style>
    .email-viewer {
        max-width: 900px;
        margin: 10px auto;
        padding: 20px;
        min-height: 100vh;
        background: var(--bg-primary);
    }

    .loading-container {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 300px;
    }

    .error-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 300px;
        color: var(--danger);
        gap: 16px;
    }

    .error-container i {
        font-size: 3rem;
    }

    .error-container p {
        font-size: 1.2rem;
        margin: 0;
    }

    .email-header {
        border-bottom: 1px solid var(--border-color);
        padding-bottom: 20px;
        margin-bottom: 20px;
    }

    .email-subject {
        font-size: 1.8rem;
        color: var(--text-primary);
        margin: 0 0 16px 0;
        font-weight: 600;
        line-height: 1.3;
    }

    .email-meta {
        color: var(--text-secondary);
        font-size: 0.95rem;
    }

    .sender {
        margin-bottom: 8px;
    }

    .from-name {
        font-weight: 500;
        color: var(--text-primary);
    }

    .from-address {
        margin-left: 8px;
        color: var(--text-secondary);
    }

    .date {
        color: var(--text-secondary);
    }

    .email-content {
        color: var(--text-primary);
        line-height: 1.6;
        font-size: 1rem;
    }

    .email-content :global(img) {
        max-width: 100%;
        height: auto;
    }

    .email-content :global(a) {
        color: var(--primary);
        text-decoration: none;
    }

    .email-content :global(a:hover) {
        text-decoration: underline;
    }

    .email-content :global(pre) {
        white-space: pre-wrap;
        word-wrap: break-word;
        background: var(--bg-secondary);
        padding: 16px;
        border-radius: 8px;
        overflow-x: auto;
    }

    @media (max-width: 768px) {
        .email-viewer {
            padding: 16px;
        }

        .email-subject {
            font-size: 1.5rem;
        }

        .email-meta {
            font-size: 0.9rem;
        }

        .email-content {
            font-size: 0.95rem;
        }
    }

    @media (max-width: 480px) {
        .email-viewer {
            padding: 12px;
        }

        .email-subject {
            font-size: 1.3rem;
            margin-bottom: 12px;
        }

        .email-meta {
            font-size: 0.85rem;
        }

        .email-content {
            font-size: 0.9rem;
        }
    }
</style> 