<script>
    import { onMount, onDestroy } from 'svelte';
    import { apiService } from '$lib/services/api';
    import LoadingSpinner from './LoadingSpinner.svelte';
    import { emailStore } from '$lib/stores/emailStore';
 

    let searchQuery = '';
    let selectedMessages = new Set();
    let allSelected = false;

    const demoMessages = [
        {
            uid: '1',
            name: 'us@inboxes.com',
            subject: 'Welcome to our service - Welcome to the inboxes.com temporary email service',
            time: 'A few seconds ago',
            from: {
                name: 'Welcome Bot',
                address: 'us@inboxes.com'
            },
            is_starred: false,
            is_read: false,
            avatarColor: '#FFE2E5',
            avatarTextColor: '#F1416C'
        },
        {
            uid: '2',
            name: 'support@inboxes.com',
            subject: 'Have questions? - you can contact us for help',
            time: '39 seconds ago',
            from: {
                name: 'Support Team',
                address: 'support@inboxes.com'
            },
            is_starred: false,
            is_read: false,
            avatarColor: '#E8FFF3',
            avatarTextColor: '#50CD89'
        },
        {
            uid: '3',
            name: 'security@inboxes.com',
            subject: 'Your privacy is our priority - Learn about our security features',
            time: '1 minute ago',
            from: {
                name: 'Security Team',
                address: 'security@inboxes.com'
            },
            is_starred: false,
            is_read: false,
            avatarColor: '#FFF8DD',
            avatarTextColor: '#FFA800'
        },
        {
            uid: '4',
            name: 'tips@inboxes.com',
            subject: 'Pro tips for using temporary email - Get the most out of our service',
            time: '2 minutes ago',
            from: {
                name: 'Tips & Tricks',
                address: 'tips@inboxes.com'
            },
            is_starred: false,
            is_read: false,
            avatarColor: '#EEE5FF',
            avatarTextColor: '#7239EA'
        }
    ];

    $: messages = $emailStore.messages;
    $: displayMessages = $emailStore.currentEmail ? messages : demoMessages;

    onMount(() => {
        const cleanup = emailStore.startPolling();
        return () => {
            cleanup();
        };
    });

    function handleSelectAll() {
        if (allSelected) {
            selectedMessages.clear();
        } else {
            messages.forEach(msg => selectedMessages.add(msg.uid));
        }
        selectedMessages = selectedMessages;
        allSelected = !allSelected;
    }

    function handleSelectMessage(uid) {
        if (selectedMessages.has(uid)) {
            selectedMessages.delete(uid);
        } else {
            selectedMessages.add(uid);
        }
        selectedMessages = selectedMessages;
        allSelected = selectedMessages.size === messages.length;
    }

    async function handleDelete() {
        if (selectedMessages.size > 0) {
            const uids = Array.from(selectedMessages);
            await emailStore.bulkDelete(uids);
            selectedMessages.clear();
            allSelected = false;
        }
    }

    async function handleMarkAsRead(uid) {
        await emailStore.markAsRead(uid);
    }

    async function handleMarkAsUnread(uid) {
        await emailStore.markAsUnread(uid);
    }

    async function toggleStar(uid) {
        await emailStore.toggleStar(uid);
    }

    async function handleRefresh() {
        if ($emailStore.currentEmail) {
            await emailStore.refreshMessages(true);
        }
    }
</script>

<div class="message-list"> 
    <div class="toolbar">
        <div class="toolbar-left">
            <label class="checkbox-wrapper">
                <input 
                    type="checkbox" 
                    checked={allSelected}
                    on:change={handleSelectAll}
                >
                <span class="checkmark"></span>
            </label>
            <button class="tool-btn tooltip-container" on:click={handleRefresh}>
                <i class="bi bi-arrow-clockwise"></i>
                <span class="tooltip">Refresh</span>
            </button>
            <button 
                class="tool-btn tooltip-container" 
                on:click={handleDelete}
                disabled={selectedMessages.size === 0}
            >
                <i class="bi bi-trash"></i>
                <span class="tooltip">Delete</span>
            </button>
            <button class="tool-btn tooltip-container">
                <i class="bi bi-archive"></i>
                <span class="tooltip">Archive</span>
            </button>
        </div>
        <div class="toolbar-right">
            <div class="search-box">
                <i class="bi bi-search"></i>
                <input 
                    type="text" 
                    placeholder="Search inbox" 
                    bind:value={searchQuery}
                >
            </div>
        </div>
    </div>

    {#if $emailStore.currentEmail && messages.length === 0}
        <div class="loading-container">
            <LoadingSpinner />
            <p class="loading-text">Your inbox is empty</p>
        </div>
    {:else}
        <div class="messages">
            {#each displayMessages as message, index}
                <div 
                    class="message-item" 
                    class:unread={!message.is_read}
                    class:demo={!$emailStore.currentEmail && index < 2}
                    class:blurred={!$emailStore.currentEmail && index >= 2}
                    on:click={() => handleMarkAsRead(message.uid)}
                >
                    <label class="checkbox-wrapper" on:click|stopPropagation>
                        <input 
                            type="checkbox"
                            checked={selectedMessages.has(message.uid)}
                            on:change={() => handleSelectMessage(message.uid)}
                        >
                        <span class="checkmark"></span>
                    </label>
                    <button 
                        class="star-btn tooltip-container" 
                        class:starred={message.is_starred}
                        on:click|stopPropagation={() => toggleStar(message.uid)}
                    >
                        <i class="bi {message.is_starred ? 'bi-star-fill' : 'bi-star'}"></i>
                        <span class="tooltip">Star</span>
                    </button>
                    <button 
                        class="read-btn tooltip-container"
                        on:click|stopPropagation={() => message.is_read ? handleMarkAsUnread(message.uid) : handleMarkAsRead(message.uid)}
                    >
                        <i class="bi {message.is_read ? 'bi-envelope-open' : 'bi-envelope-fill'}"></i>
                        <span class="tooltip">{message.is_read ? 'Mark as unread' : 'Mark as read'}</span>
                    </button>
                    <div class="message-avatar">
                        <div class="avatar-letter" style="background: {message.avatarColor || '#E8FFF3'}; color: {message.avatarTextColor || '#50CD89'}">
                            {message.from?.name?.[0] || message.name?.[0] || 'U'}
                        </div>
                    </div>
                    <div class="message-content">
                        <div class="message-name">{message.from?.name || message.name}</div>
                        <div class="message-subject">{message.subject}</div>
                    </div>
                    <div class="message-time">
                        {message.time || new Date(message.date).toLocaleString()}
                    </div>
                </div>
            {/each}
        </div>
    {/if}

    <div class="pagination-container">
        <div class="pagination-left">
            <select class="rows-select">
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
            </select> 
        </div>
        <div class="pagination-center">
            <button class="page-btn"><i class="bi bi-chevron-left"></i></button>
            <button class="page-btn active">1</button>
            <button class="page-btn">2</button>
            <button class="page-btn"><i class="bi bi-chevron-right"></i></button>
        </div>
    </div>
</div>

<style>
    .message-list {
        background: var(--bg-primary);
        border-radius: 16px;
        box-shadow: var(--shadow-md);
        overflow: hidden;
        display: flex;
        flex-direction: column;
        min-height: 200px;
    }

    .list-header {
        padding: 24px;
        border-bottom: 1px solid var(--border-color);
    }

    .list-header h2 {
        font-size: 1.5rem;
        font-weight: 600;
        color: var(--text-primary);
        margin: 0 0 8px;
    }

    .text-muted {
        color: var(--text-muted);
        font-size: 0.9rem;
    }

    .toolbar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px 24px;
        border-bottom: 1px solid var(--border-color);
    }

    .toolbar-left {
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .toolbar-right {
        flex: 0 0 auto;
    }

    .tool-btn {
        background: none;
        border: none;
        color: var(--text-muted);
        padding: 8px;
        border-radius: 4px;
        cursor: pointer;
    }

    .tool-btn:hover {
        color: var(--text-primary);
        background: var(--bg-hover);
    }

    .search-box {
        display: flex;
        align-items: center;
        background: var(--bg-secondary);
        border-radius: 8px;
        padding: 8px 16px;
        width: 250px;
    }

    .search-box i {
        color: var(--text-muted);
        margin-right: 8px;
    }

    .search-box input {
        border: none;
        background: transparent;
        width: 100%;
        font-size: 14px;
        color: var(--text-primary);
        outline: none;
    }

    .search-box input::placeholder {
        color: var(--text-muted);
    }

    .messages {
        position: relative;
        overflow: hidden;
    }

    .message-item {
        display: flex;
        align-items: center;
        padding: 16px 24px;
        border-bottom: 1px solid var(--border-color);
        gap: 16px; 
    }

    .message-item:hover {
        background: var(--bg-hover);
        cursor: pointer;
    }

    .checkbox-wrapper {
        position: relative;
        display: inline-block;
        width: 20px;
        height: 20px;
        cursor: pointer;
    }

    .checkbox-wrapper input {
        opacity: 0;
        width: 0;
        height: 0;
    }

    .checkmark {
        position: absolute;
        top: 0;
        left: 0;
        height: 20px;
        width: 20px;
        background-color: transparent;
        border: 2px solid var(--text-muted);
        border-radius: 6px;
    }

    .checkbox-wrapper:hover input ~ .checkmark {
        border-color: #0D6EFD;
    }

    .checkbox-wrapper input:checked ~ .checkmark {
        background-color: #0D6EFD;
        border-color: #0D6EFD;
    }

    .checkbox-wrapper input:checked ~ .checkmark:after {
        content: '';
        position: absolute;
        left: 5px;
        top: 2px;
        width: 4px;
        height: 8px;
        border: solid white;
        border-width: 0 2px 2px 0;
        transform: rotate(45deg);
    }

    .star-btn {
        background: none;
        border: none;
        color: var(--text-muted);
        padding: 4px;
        cursor: pointer;
    }

    .star-btn:hover {
        color: #FFC700;
    }

    .star-btn.starred {
        color: #FFC700;
    }

    .star-btn.starred i {
        fill: #FFC700;
    }

    .archive-btn {
        background: none;
        border: none;
        color: var(--text-muted);
        padding: 4px;
        cursor: pointer;
    }

    .archive-btn:hover {
        color: #FFC700;
    }

    .message-avatar {
        width: 35px;
        height: 35px;
        border-radius: 6px;
        overflow: hidden;
        flex-shrink: 0;
    }

    .avatar-letter {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 500;
        color: #7E8299;
        font-size: 14px;
        text-transform: uppercase;
    }

    .message-content {
        flex: 1;
        min-width: 0;
    }

    .message-name {
        font-weight: 600;
        color: var(--text-primary);
        font-size: 14px;
        margin-bottom: 4px;
    }

    .message-subject {
        color: var(--text-secondary);
        font-size: 13px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .message-labels {
        display: flex;
        gap: 4px;
        margin-top: 4px;
    }

    .label {
        padding: 2px 8px;
        border-radius: 4px;
        font-size: 11px;
        font-weight: 500;
    }

    .message-time {
        color: var(--text-muted);
        font-size: 13px;
        white-space: nowrap;
    }

    .pagination-container {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 16px 24px;
        border-top: 1px solid var(--border-color);
    }

    .pagination-left {
        display: flex;
        align-items: center;
        gap: 12px;
    }

    .rows-select {
        padding: 6px 8px;
        padding-right: 24px;
        border: 1px solid var(--border-color);
        color: var(--text-muted);
        background-color: var(--bg-secondary);
        border-radius: 6px;
        appearance: none;
        -webkit-appearance: none;
        -moz-appearance: none;
        background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="12" height="8" viewBox="0 0 12 8"><path fill="%23565674" d="M1.4 0L6 4.6L10.6 0L12 1.4L6 7.4L0 1.4L1.4 0Z"/></svg>');
        background-repeat: no-repeat;
        background-position: right 8px center;
        background-size: 12px 8px;
        cursor: pointer;
        font-size: 13px;
        min-width: 75px;
    }

    .rows-select:focus {
        outline: 0;
    }

    .rows-select:hover {
        border-color: var(--border-color);
    }

    .pagination-center {
        display: flex;
        align-items: center;
        gap: 4px;
    }

    .page-btn {
        min-width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid var(--border-color);
        border-radius: 6px;
        background: var(--bg-primary);
        color: var(--text-muted);
        font-size: 13px;
        cursor: pointer;
    }

    .page-btn:hover {
        background: var(--bg-hover);
        color: var(--text-primary);
    }

    .page-btn.active {
        background: #0D6EFD;
        color: white;
        border-color: #0D6EFD;
    }

    .rows-text {
        color: var(--text-muted);
        font-size: 13px;
    }

    @media (max-width: 768px) {
        .message-list {
            min-height: 400px;
        }

        .list-header {
            padding: 16px;
        }

        .list-header h2 {
            font-size: 1.25rem;
        }
    }

    /* Tooltip container */
    .tooltip-container {
        position: relative;
        display: inline-block;
    }

    /* Tooltip text */
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

    /* Show the tooltip on hover */
    .tooltip-container:hover .tooltip {
        visibility: visible;
        opacity: 1;
    }

    .loading-container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 48px 0;
        gap: 16px;
    }

    .loading-text {
        color: var(--text-muted);
        font-size: 14px;
        margin-top: 8px;
        text-align: center;
    }

    .read-btn {
        background: none;
        border: none;
        color: var(--text-muted);
        padding: 4px;
        cursor: pointer;
    }

    .read-btn:hover {
        color: var(--primary);
    }

   

    .message-item.unread .message-name,
    .message-item.unread .message-subject {
        font-weight: 600;
    }

    .tool-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .message-item.demo {
        opacity: 0.9;
        pointer-events: none;
    }

    .message-item.blurred {
        opacity: 0.4;
        filter: blur(2px);
        pointer-events: none;
    }

    .message-item.blurred:hover {
        transform: none;
        box-shadow: none;
    }

    .message-item.demo:hover {
        transform: none;
        box-shadow: none;
    }
</style>
