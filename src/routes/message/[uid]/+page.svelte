<script>
    import { page } from '$app/stores';
    import { onMount } from 'svelte';
    import { apiService } from '$lib/services/api';
    import LoadingSpinner from '$lib/components/email/LoadingSpinner.svelte';

    let message = null;
    let loading = true;
    let error = null;

    let iframeHeight = 600;

    function adjustIframeContent(event) {
        const iframe = event.target;
        if (iframe.contentDocument && iframe.contentDocument.body) { 
            const style = document.createElement('style');
            style.textContent = `
                body {
                    margin: 0;
                    padding: 0;
                    width: 100% !important;
                    min-width: 100% !important;
                    overflow-x: hidden !important;
                }
                img, table {
                    max-width: 100% !important;
                    height: auto !important;
                }
                * {
                    box-sizing: border-box !important;
                    word-wrap: break-word !important;
                }
            `;
            iframe.contentDocument.head.appendChild(style); 
            iframeHeight = iframe.contentDocument.body.scrollHeight + 20;
        }
    }

    onMount(async () => {
        // Check if we have message data from navigation
        const navigationState = history.state?.navigationData;
        const uid = $page.params.uid;

        if (navigationState?.message?.uid === uid) {
            // Use existing message data if available
            message = navigationState.message;
            loading = false;
        } else { 
            try {
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

<div class="message-detail">
    <div class="message-container">
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
            
            <div class="message-content">
                {#if message.msg.html}
                    <iframe
                        class="email-iframe"
                        sandbox="allow-same-origin"
                        srcdoc={message.msg.html}
                        title="Email Content"
                        on:load={adjustIframeContent}
                        style="height: {iframeHeight}px;"
                    ></iframe>
                {:else if message.msg.text_formatted}
                    <pre>{message.msg.text_formatted}</pre>
                {:else}
                    <pre>{message.msg.text}</pre>
                {/if}
            </div>
        {/if}
    </div>
</div>

<style>
    .message-detail {
        max-width: 100%; 
        background: var(--bg-primary);  
        overflow: hidden;
    }

    .message-container {
        background: var(--bg-primary);
        border-radius: 12px;
        overflow: hidden;
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

    .message-header {
        padding: 24px;
        border-bottom: 1px solid var(--border-color);
        background: var(--bg-secondary);
    }

    .message-subject {
        font-size: 1.5rem;
        font-weight: 600;
        color: var(--text-primary);
        margin: 0 0 16px 0;
        line-height: 1.3;
    }

    .message-meta {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .sender-info {
        display: flex;
        align-items: center;
        gap: 12px;
    }

    .avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 500;
        font-size: 1.2rem;
    }

    .sender-details {
        display: flex;
        flex-direction: column;
        gap: 4px;
    }

    .sender-name, .sender-email {
        color: var(--text-primary);
        font-weight: 500;
    }

    .sender-email {
        font-weight: normal;
        margin-left: 4px;
    }

    .message-date {
        color: var(--text-primary);
        font-size: 0.9rem;
    }

    .message-content { 
        width: 100%;
        max-width: 100%;
        overflow-x: auto;
    }

    .email-iframe {
        width: 100%;
        height: 100%;
        border: none;
        background: white;
        padding:0px 5px;
    }

    .message-content :global(pre) {
        white-space: pre-wrap;
        font-family: inherit;
        margin: 0;
    }

    @media (max-width: 768px) {
        .message-detail {
            margin: 0;
            border-radius: 0;
            width: 100%;
        }

        .message-header {
            padding: 16px;
        }

        .message-subject {
            font-size: 1.2rem;
            margin-bottom: 12px;
        }

        .sender-info {
            gap: 8px;
        }

        .avatar {
            width: 32px;
            height: 32px;
            font-size: 1rem;
        }

        .sender-name {
            font-size: 0.9rem;
        }

        .sender-email {
            display: block;
            margin: 2px 0 0 0;
            font-size: 0.8rem;
        }

        .message-date {
            font-size: 0.8rem;
        }

        .message-content {
            padding: 16px;
        }

        .email-iframe {
            width: 100%;
            margin-left: -16px;
            border-radius: 0;
        }
    }

    @media (max-width: 480px) {
        .message-detail{
            max-width: 100%;

        }
        .message-header {
            padding: 12px;
        }

        .message-subject {
            font-size: 1.1rem;
            margin-bottom: 10px;
        }

        .avatar {
            width: 28px;
            height: 28px;
            font-size: 0.9rem;
        }

        .sender-name {
            font-size: 0.85rem;
        }

        .sender-email {
            font-size: 0.75rem;
        }

        .message-date {
            font-size: 0.75rem;
        }

        .message-content {
            padding: 12px;
        }

        .email-iframe {
            margin-left: -12px;
        }
    }
</style> 