<script>
    import { emailStore } from '$lib/stores/emailStore';
    import { goto } from '$app/navigation';
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();
    
    export let message;

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
            </div>
        </div>
        <div class="toolbar-center">
            <h2 class="list-title">Message Details</h2>
        </div>
 
    </div>

    <div class="message-container">
        <header class="message-header">
            <h1 class="message-subject">{message.subject}</h1>
            <div class="message-meta">
                <div class="sender-info">
                    <div class="avatar">
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
                <div class="message-actions">
                    <button class="action-btn" title="Star">
                        <i class="bi bi-star{message.is_starred ? '-fill' : ''}"></i>
                    </button> 
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
        align-items: center;
        padding: 16px 24px;
        border-bottom: 1px solid var(--border-color);
        background: var(--bg-primary);
    }

    .toolbar-left {
        display: flex;
        align-items: center;
        gap: 16px;
    }

    .toolbar-center {
        flex: 1;
        text-align: center;
    }

    .toolbar-right {
        display: flex;
        align-items: center;
        gap: 16px;
    }

    .tool-buttons {
        display: flex;
        gap: 8px;
    }

    .tool-btn {
        background: none;
        border: none;
        color: var(--text-muted);
        padding: 8px;
        cursor: pointer;
        border-radius: 6px;
        transition: all 0.2s ease;
    }

    .tool-btn:hover {
        background: var(--bg-hover);
        color: var(--text-primary);
    }

    .tool-icon {
        font-size: 1.25rem;
    }

    .list-title {
        font-size: 1.25rem;
        font-weight: 500;
        color: var(--text-primary);
        margin: 0;
    }

    .tooltip-container {
        position: relative;
        display: inline-block;
    }

    .tooltip {
        visibility: hidden;
        width: max-content;
        background-color: #fff;
        color: #333;
        text-align: center;
        border-radius: 6px;
        padding: 5px 8px;
        position: absolute;
        z-index: 1;
        top: 50%;
        left: 110%;
        transform: translateY(-50%);
        opacity: 0;
        transition: opacity 0.3s, visibility 0.3s;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        border: 1px solid #ddd;
    }

    .tooltip-container:hover .tooltip {
        visibility: visible;
        opacity: 1;
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
    }

    .message-subject {
        font-size: 1rem;
        margin: 0 0 16px 0;
        color: var(--text-primary);
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

    @media (max-width: 768px) {
        .message-detail {
            padding: 16px;
        }

        .message-header {
            padding: 16px;
        }

        .message-subject {
            font-size: 1.25rem;
        }

        .message-meta {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
        }

        .message-actions {
            width: 100%;
            justify-content: flex-end;
        }
    }
</style> 