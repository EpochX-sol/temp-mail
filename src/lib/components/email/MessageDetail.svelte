<script>
    import { emailStore } from '$lib/stores/emailStore';
    import { goto } from '$app/navigation';
    import { createEventDispatcher } from 'svelte';
    import { apiService } from '$lib/services/api';
    
    const dispatch = createEventDispatcher();
    export let message;

    async function toggleStar() {
        try {
            await emailStore.toggleStar(message.uid); 
            message = { 
                ...message, 
                is_starred: !message.is_starred 
            };
        } catch (error) {
            console.error('Failed to toggle star:', error);
        }
    }

    function handleBack() {
        dispatch('back');
    }

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
    console.log(message)

</script>

<div class="message-detail">
    <div class="toolbar">
        <div class="toolbar-left">
            <button class="tool-btn tooltip-container" on:click={handleBack}>
                <i class="bi bi-arrow-left tool-icon"></i>
                <span class="tooltip">Back</span>
            </button>
            <div class="tool-buttons">
                <button class="tool-btn tooltip-container" title="Delete">
                    <i class="bi bi-trash tool-icon"></i>
                    <span class="tooltip">Delete</span>
                </button>
                <button 
                    class="tool-btn tooltip-container" 
                    on:click={toggleStar}
                >
                    <i class="bi bi-star{message.is_starred ? '-fill' : ''} tool-icon"></i>
                    <span class="tooltip">{message.is_starred ? 'Unstar' : 'Star'}</span>
                </button>
            </div>
        </div>
    </div>

    <div class="message-container">
        <header class="message-header">
            <h1 class="message-subject">{message.subject}</h1>
            <div class="message-meta">
                <div class="sender-info">
                    <div class="avatar" style="background: {message.avatarColor}; color: {message.avatarTextColor}">
                        {message.from.name[0].toUpperCase()}
                    </div>
                    <div class="sender-details">
                        <div class="sender-name">
                            {message.from.name}
                            <span class="sender-email">&lt;{message.from.address}&gt;</span>
                        </div>
                        <div class="message-date">
                            {formatDate(message.date)}
                        </div>
                    </div>
                </div>
            </div>
        </header>

        <div class="message-content">
            {#if message.msg.html}
                {@html message.msg.html}
            {:else if message.msg.text_formatted}
                {@html message.msg.text_formatted}
            {:else}
                <pre>{message.msg.text}</pre>
            {/if}
        </div>
    </div>
</div>

<style>
    .message-detail {
        background: var(--bg-primary);
        border-radius: 16px;
        box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
        overflow: hidden;
        display: flex;
        flex-direction: column;
        min-height: 200px;
        max-width: 1200px;
        margin: 0 auto;
        width: 100%;
    }

    .toolbar {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        padding: 16px;
        border-bottom: 1px solid var(--border-color);
    }

    .toolbar-left {
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .tool-buttons {
        display: flex;
        gap: 4px;
    }

    .tool-btn {
        background: none;
        border: none;
        color: var(--text-primary);
        padding: 4px;
        height: 32px;
        width: 32px;
        cursor: pointer;
        border-radius: 4px;
        transition: all 0.2s ease;
    }

    .tool-btn:hover {
        background: var(--bg-hover);
    }

    .tool-icon {
        font-size: 1rem;
        color: var(--text-muted);
        transition: color 0.2s ease;
    }

    .bi-star-fill {
        color: var(--primary);
    }

    .toolbar-center {
        display: none;
    }

    .message-container {
        background: var(--bg-primary);
        border-radius: 12px;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
        overflow: hidden;
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
        background: var(--primary);
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

    .sender-name {
        color: var(--text-primary);
        font-weight: 500;
    }

    .sender-email {
        color: var(--text-muted);
        font-weight: normal;
        margin-left: 4px;
    }

    .message-date {
        color: var(--text-muted);
        font-size: 0.9rem;
    }

    .message-actions {
        display: flex;
        gap: 8px;
    }

    .action-btn {
        background: none;
        border: none;
        color: var(--text-muted);
        padding: 8px;
        cursor: pointer;
        border-radius: 6px;
        transition: all 0.2s ease;
    }

    .action-btn:hover {
        background: var(--bg-hover);
        color: var(--primary);
    }

    .message-content {
        padding: 24px;
        color: var(--text-primary);
        line-height: 1.6;
        width: 100%;
        max-width: 100%;
        overflow-x: auto;
    }

    .message-content :global(p) {
        margin: 0 0 16px 0;
        max-width: 100%;
    }

    .message-content :global(pre) {
        white-space: pre-wrap;
        font-family: inherit;
        margin: 0;
    }

    .message-content :global(*) {
        max-width: 100%;
        box-sizing: border-box;
    }

    .message-content :global(img) {
        max-width: 100%;
        height: auto;
    }

    .tool-btn:hover .tool-icon {
        color: var(--text-primary);
    }

    @media (max-width: 768px) {
        .message-detail {
            border-radius: 0;
            padding: 0;
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
            font-size: 0.9rem;
        }
    }

    @media (max-width: 480px) {
        .toolbar {
            padding: 8px;
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
            font-size: 0.85rem;
        }

        .tool-btn {
            height: 28px;
            width: 28px;
        }

        .tool-icon {
            font-size: 0.9rem;
        }
    }

    .tooltip-container {
        position: relative;
    }

    .tooltip {
        position: absolute;
        left: calc(100% + 8px);
        top: 50%;
        transform: translateY(-50%);
        background: var(--bg-tertiary);
        color: var(--text-primary);
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        white-space: nowrap;
        opacity: 0;
        visibility: hidden;
        transition: all 0.2s ease;
        z-index: 1000;
        box-shadow: var(--shadow-sm);
    }

    .tooltip-container:hover .tooltip {
        opacity: 1;
        visibility: visible;
    }
</style> 