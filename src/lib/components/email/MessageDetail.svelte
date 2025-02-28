<script>
    import { emailStore } from '$lib/stores/emailStore';
    import { goto } from '$app/navigation';
    import { createEventDispatcher } from 'svelte';
    import { apiService } from '$lib/services/api';
    import { storageService } from '$lib/services/storage';
    import { onMount } from 'svelte';
    
    const dispatch = createEventDispatcher();
    export let message;

    let isDeleting = false;
    let isStarring = false;
    let iframeHeight = 600;
    let isMarkingRead = false;
 
  
    async function toggleStar() {
        if (isStarring) return;
        isStarring = true;

        try {
            const success = await emailStore.toggleStar(message.uid);
            if (success) {
                message.is_starred = !message.is_starred;
                emailStore.updateMessage(message.uid, { is_starred: message.is_starred });
            }
        } catch (error) {
            throw error;
        } finally {
            isStarring = false;
        }
    }

    async function handleDelete() {
        isDeleting = true;
        try {
            await emailStore.deleteMessage(message.uid);
            handleBack();
        } catch (error) {
            throw error;
        } finally {
            isDeleting = false;
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

    function sanitizeHtml(html) {
        // Convert http to https
        return html.replace(/http:\/\//g, 'https://');
    }

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
                /* Block third-party tracking pixels */
                img[src*="mmstat.com"],
                img[src*="tracking"],
                img[width="1"][height="1"] {
                    display: none !important;
                }
            `;
            iframe.contentDocument.head.appendChild(style); 
            iframeHeight = iframe.contentDocument.body.scrollHeight + 20;
        }
    }

    function handleFullMessageClick() {
        goto(`/message/${message.uid}`, {
            state: { message }
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
                <button 
                    class="tool-btn tooltip-container" 
                    title="Delete"
                    on:click={handleDelete}
                    disabled={isDeleting}
                >
                    {#if isDeleting}
                        <i class="bi bi-arrow-clockwise spinning tool-icon"></i>
                    {:else}
                        <i class="bi bi-trash tool-icon"></i>
                    {/if}
                    <span class="tooltip">Delete</span>
                </button>
                <button 
                    class="tool-btn tooltip-container" 
                    on:click={toggleStar}
                    disabled={isStarring}
                >
                    {#if isStarring}
                        <i class="bi bi-arrow-clockwise spinning tool-icon"></i>
                    {:else}
                        <i class="bi bi-star{message.is_starred ? '-fill' : ''} tool-icon"></i>
                    {/if}
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

        <div class="read-full-message">
            Can't see message content?Read the full message by
            <button class="full-message-btn" on:click={handleFullMessageClick}>
                Click here <i class="bi bi-arrow-right"></i>
            </button> 
        </div>

        <div class="message-content">
            {#if message.msg.html}
                <iframe
                    class="email-iframe"
                    sandbox="allow-same-origin"
                    srcdoc={sanitizeHtml(message.msg.html)}
                    title="Email Content"
                    on:load={adjustIframeContent}
                    style="height: {iframeHeight}px;"
                    referrerpolicy="no-referrer"
                ></iframe>
            {:else if message.msg.text_formatted}
                <pre>{message.msg.text_formatted}</pre>
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
        gap: 8px;
    }

    .tool-btn {
        background: none;
        border: none; 
        padding: 8px;
        height: 36px;
        width: 36px;
        cursor: pointer;
        border-radius: 6px;
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .tool-btn:hover {
        background: var(--bg-hover);
    }

    .tool-icon {
        font-size: 1.2rem;
        color: var(--text-primary);
        transition: color 0.2s ease;
    }

    .bi-star-fill {
        color: var(--primary);
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

    .message-content { 
        width: 100%;
        max-width: 100%;
        overflow-x: auto;
    }

    .email-iframe {
        width: 100%;
        border: none;
        background: white; 
        padding:5px;
    }
 
    .email-iframe :global(body) {
        margin: 0;
        padding: 0;
        width: 100% !important;
        min-width: 100% !important;
        overflow-x: hidden !important;
    }

    .email-iframe :global(img),
    .email-iframe :global(table) {
        max-width: 100% !important;
        height: auto !important;
    }

    .email-iframe :global(*) {
        box-sizing: border-box !important;
        word-wrap: break-word !important;
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

    

    .tooltip-container {
        position: relative;
    }

    .tooltip {
        visibility: hidden;
        width: max-content;
        background: var(--bg-tertiary);
        color: var(--text-primary);
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        white-space: nowrap;
        text-align: center; 
        position: absolute;
        z-index: 1;
        top: 50%;
        left: 110%;
        transform: translateY(-50%);
        opacity: 0;
        transition: opacity 0.15s;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); 
        pointer-events: none;
    }

    .tooltip-container:hover .tooltip {
        opacity: 1;
        visibility: visible;
    }

    .spinning {
        animation: spin 1s linear infinite;
    }

    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }

    .tool-btn:disabled {
        opacity: 0.7;
        cursor: wait;
    }

    .read-full-message {
        text-align: center;
        padding: 8px;   
        color: black;
        font-size: 15px;
        background: linear-gradient(135deg, rgb(238, 229, 229) 0%, rgb(223, 212, 212) 50%, rgb(247, 231, 231) 100%);
    }

    .full-message-btn {
        background: var(--primary);
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 6px;
        cursor: pointer;
        font-weight: 500;
        margin-left: 8px;
        transition: all 0.2s ease;
        display: inline-flex;
        align-items: center;
        gap: 4px;
    }

   

    .full-message-btn:active {
        transform: translateY(0);
    }

    .full-message-btn i {
        font-size: 0.9em;
        transition: transform 0.2s ease;
    }

    .full-message-btn:hover i {
        transform: translateX(2px);
    }

    
    @media (max-width: 768px) {
        .message-detail {
            border-radius: 5px;
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
        .read-full-message {
            padding: 12px;
            font-size: 0.9rem;
        }
 

        .email-iframe {
            width: 100%; 
            border-radius: 0;
        }

        .full-message-btn {
            padding: 6px 12px;
            font-size: 0.9rem;
            margin-top: 5px;
        }

        .tool-btn {
            height: 32px;
            width: 32px;
            padding: 6px;
        }

        .tool-icon {
            font-size: 1.1rem;
        }
    }

    @media (max-width: 480px) {
        .message-detail{
            border-radius: 5px;
        }
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

        .tool-btn {
            height: 28px;
            width: 28px;
            padding: 4px;
        }

        .tool-icon {
            font-size: 1rem;
        }

        .email-iframe {
            width: 100%; 
            border-radius: 0;
        }

        .read-full-message {
            padding: 8px;
            font-size: 0.85rem;
        }

        .full-message-btn {
            padding: 4px 8px;
            font-size: 0.85rem;
            margin-top: 5px;
        }
    } 
</style> 
