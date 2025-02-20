<script>
    import { onMount, onDestroy } from 'svelte';
    import LoadingSpinner from './LoadingSpinner.svelte';
    import { emailStore } from '$lib/stores/emailStore';
    import { themeStore } from '$lib/stores/themeStore';
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();

    let searchQuery = '';
    let selectedMessages = new Set();
    let allSelected = false;
    let currentPage = 1;
    let rowsPerPage = 10;
    let totalPages = 1;
    let isRefreshing = false;

    const pageSizes = [
        { value: 5, label: '5' },
        { value: 10, label: '10' },
        { value: 20, label: '20' },
        { value: 50, label: '50' }
    ];

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
 
    $: filteredMessages = displayMessages.filter(message => {
        const searchLower = searchQuery.toLowerCase();
        return (
            message.from.name.toLowerCase().includes(searchLower) ||
            message.from.address.toLowerCase().includes(searchLower) ||
            message.subject.toLowerCase().includes(searchLower)
        );
    });
 
    $: {
        const totalItems = filteredMessages.length;
        totalPages = Math.max(1, Math.ceil(totalItems / rowsPerPage));
        
        if (currentPage > totalPages) {
            currentPage = totalPages;
        }
    }
 
    $: paginatedMessages = filteredMessages.slice(
        (currentPage - 1) * rowsPerPage,
        Math.min(currentPage * rowsPerPage, filteredMessages.length)
    );
 
    $: pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    function handlePageChange(page) {
        if (page >= 1 && page <= totalPages) {
            currentPage = page;
            selectedMessages.clear();
            allSelected = false;
        }
    }

    function handleRowsPerPageChange(event) {
        const newSize = parseInt(event.target.value);
        if (isNaN(newSize) || !pageSizes.find(size => size.value === newSize)) {
            return;
        }
        
        const firstItemIndex = (currentPage - 1) * rowsPerPage;
        rowsPerPage = newSize;
        currentPage = Math.floor(firstItemIndex / newSize) + 1;
        
        selectedMessages.clear();
        allSelected = false;
        
        try {
            localStorage.setItem('preferredPageSize', newSize.toString());
        } catch (error) {
            console.error('Failed to save page size preference:', error);
        }
    }

    onMount(() => {
        try {
            const savedSize = localStorage.getItem('preferredPageSize');
            if (savedSize) {
                const size = parseInt(savedSize);
                if (pageSizes.find(p => p.value === size)) {
                    rowsPerPage = size;
                }
            }
        } catch (error) {
            console.error('Failed to load page size preference:', error);
        }
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

    async function handleSingleDelete(uid, event) {
        event.stopPropagation();
        try {
            await emailStore.deleteMessage(uid);
            selectedMessages.delete(uid);
            selectedMessages = selectedMessages;
        } catch (error) {
            console.error('Failed to delete message:', error);
        }
    }

    async function handleDelete() {
        if (selectedMessages.size > 0) {
            const uids = Array.from(selectedMessages);
            try {
                await emailStore.bulkDelete(uids);
                selectedMessages.clear();
                allSelected = false;
            } catch (error) {
                console.error('Failed to bulk delete messages:', error);
            }
        }
    }

    async function handleMessageClick(message) {
        dispatch('messageSelect', message);
    }

    async function toggleStar(uid) {
        await emailStore.toggleStar(uid);
    }

    async function handleRefresh() {
        if ($emailStore.currentEmail) {
            isRefreshing = true;
            await emailStore.refreshMessages(true);
            setTimeout(() => {
                isRefreshing = false;
            }, 500);
        }
    }
</script>

<div class="message-list"> 
    <div class="toolbar">
        <div class="toolbar-left">
            <button class="tool-btn tooltip-container" title="Select All" on:click={handleSelectAll}>
                <i class="bi bi-check-square tool-icon"></i>
                <span class="tooltip">Select All</span>
            </button>
            <div class="tool-buttons">
                <button class="tool-btn tooltip-container" on:click={handleRefresh}>
                    <i class="bi bi-arrow-clockwise tool-icon" class:spinning={isRefreshing}></i>
                    <span class="tooltip">Refresh</span>
                </button>
                <button 
                    class="tool-btn tooltip-container" 
                    on:click={handleDelete}
                    disabled={selectedMessages.size === 0}
                >
                    <i class="bi bi-trash tool-icon"></i>
                    <span class="tooltip">Delete</span>
                </button>
            </div> 
        </div>

        <div class="toolbar-center desktop-only">
            <h2 class="list-title">Message Inboxs</h2>
        </div>

        <div class="toolbar-right desktop-only">
            <div class="search-box">
                <i class="bi bi-search"></i>
                <input 
                    type="text" 
                    placeholder="Search messages..." 
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
            {#each paginatedMessages as message, index}
            
                <div  
                    class="message-item" 
                    class:unread={!message.is_read}
                    class:demo={!$emailStore.currentEmail && index < 2}
                    class:blurred={!$emailStore.currentEmail && index >= 2}
                    on:click={() => handleMessageClick(message)}
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
 
                    <div class="message-avatar">
                        <div 
                            class="avatar-letter" 
                            style="background: {$themeStore === 'dark' ? 'var(--bg-tertiary)' : message.avatarColor || '#E8FFF3'}; 
                                   color: {$themeStore === 'dark' ? 'var(--text-primary)' : message.avatarTextColor || '#50CD89'}"
                        >
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
            <select 
                class="rows-select"
                bind:value={rowsPerPage}
                on:change={handleRowsPerPageChange}
            >
                {#each pageSizes as size}
                    <option value={size.value}>{size.label}</option>
                {/each}
            </select> 
            
        </div>
        <div class="pagination-center">
            <button 
                class="page-btn" 
                on:click={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                <i class="bi bi-chevron-left"></i>
            </button>

            {#each pageNumbers as pageNum}
                {#if pageNum === 1 || pageNum === totalPages || (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)}
                    <button 
                        class="page-btn" 
                        class:active={currentPage === pageNum}
                        on:click={() => handlePageChange(pageNum)}
                    >
                        {pageNum}
                    </button>
                {:else if pageNum === currentPage - 2 || pageNum === currentPage + 2}
                    <span class="page-ellipsis">...</span>
                {/if}
            {/each}

            <button 
                class="page-btn" 
                on:click={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                <i class="bi bi-chevron-right"></i>
            </button>
        </div>
    </div>
</div>

<style>
    .message-list {
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

    .list-header {
        padding: 15px;
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
        transition: background-color 0.2s ease, border-left 0.2s ease;
    }

    .message-item:hover { 
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
        padding: 6px;
        cursor: pointer;
        font-size: 1.2rem;
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

    .message-avatar {
        width: 35px;
        height: 35px;
        border-radius: 6px;
        overflow: hidden;
        flex-shrink: 0;
        background: var(--bg-tertiary);
        border: 1px solid var(--border-color);
        transition: background-color 0.2s ease, border-color 0.2s ease;
    }

    .avatar-letter {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 500;
        color: var(--text-secondary);
        font-size: 14px;
        text-transform: uppercase;
        background: transparent;
        transition: color 0.2s ease;
    }

    .message-avatar:hover {
        background: var(--bg-hover);
        border-color: var(--border-primary);
    }

    .message-avatar:hover .avatar-letter {
        color: var(--text-primary);
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
        color: var(--text-primary);
        background-color: transparent;
        border-radius: 6px;
        appearance: none;
        -webkit-appearance: none;
        -moz-appearance: none;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='currentColor' d='M1.4 0L6 4.6L10.6 0L12 1.4L6 7.4L0 1.4L1.4 0Z'/%3E%3C/svg%3E");
        background-repeat: no-repeat;
        background-position: right 8px center;
        background-size: 12px 8px;
        cursor: pointer;
        font-size: 13px;
        min-width: 75px;
        transition: all 0.2s ease;
    }

    .rows-select:focus {
        outline: 0;
        border-color: var(--primary);
    }

    .rows-select:hover {
        border-color: var(--text-muted);
        background-color: var(--bg-hover);
    }

    .rows-select::-ms-expand {
        display: none;
    }

    .rows-select option {
        background-color: var(--bg-primary);
        color: var(--text-primary);
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
        .desktop-only {
            display: none;
        }

        .message-list {
            border-radius: 5px;
            margin: 0 -12px;
            width: 100%;
        }

        .toolbar {
            padding: 8px 12px;
            gap: 8px;
        }

        .tool-buttons {
            gap: 4px;
        }

        .tool-btn {
            padding: 4px;
        }

        .tool-icon {
            font-size: 0.5rem;
        }

        .message-item {
            padding: 10px 12px;
            gap: 8px;
        }

        .message-time {
            display: none;
        }

        .message-content {
            min-width: 0;
        }

        .message-name {
            font-size: 12px;
            margin-bottom: 2px;
        }

        .message-subject {
            max-width: calc(100vw - 120px);
        }

        .pagination-container {
            flex-direction: row;
            gap: 12px;
            align-items: center;
            padding: 8px 12px;
            justify-content: flex-end;
        }

        .rows-select, .rows-text {
            display: none;
        }

        .pagination-center {
            justify-content: flex-start;
        }

        .page-btn {
            min-width: 28px;
            height: 28px;
            font-size: 12px;
        }
    }

    @media (max-width: 480px) {
        .tool-icon {
            font-size: 0.5rem;
        }

        .tool-btn {
            padding: 3px;
        }
        .message-list {
            border-radius: 5px;
            margin: 0 -12px;
            width: 100%;
        }
        .message-avatar {
            width: 28px;
            height: 28px;
        }

        .avatar-letter {
            font-size: 12px;
        }

        .message-name {
            font-size: 11px;
        }

        .message-subject {
            max-width: calc(100vw - 100px);
            font-size: 11px;
        }

        .message-actions {
            position: absolute;
            right: 6px;
            top: 50%;
            transform: translateY(-50%);
        }

        .message-item {
            position: relative;
            padding: 8px 10px;
        }

        .checkbox-wrapper {
            width: 14px;
            height: 14px;
        }

        .checkmark {
            height: 14px;
            width: 14px;
            border-width: 1.5px;
        }

        .checkbox-wrapper input:checked ~ .checkmark:after {
            left: 4px;
            top: 1px;
            width: 3px;
            height: 7px;
        }

        .action-btn {
            padding: 4px;
        }

        .action-btn i {
            font-size: 0.85rem;
        }

        .page-btn {
            min-width: 24px;
            height: 24px;
            font-size: 11px;
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

    .message-item.unread .message-name,
    .message-item.unread .message-subject {
        font-weight: 700;
        color: var(--text-primary);
        transition: font-weight 0.2s ease, color 0.2s ease;
    }

    .message-item:not(.unread) .message-name {
        font-weight: 400;
        color: var(--text-secondary);
        opacity: 0.8;
    }

    .message-item:not(.unread) .message-subject {
        font-weight: 400;
        color: var(--text-muted);
        opacity: 0.8;
    }

    .message-item:not(.unread) .message-time {
        opacity: 0.7;
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

    .toolbar-center {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .list-title {
        font-size: 1.25rem;
        font-weight: 500;
        color: var(--text-primary);
        margin: 0;
    }

    .tool-buttons {
        display: flex;
        gap: 8px;
    }

    .tool-icon {
        font-size: 1.25rem;
        transition: transform 0.2s ease;
    }

    .page-ellipsis {
        padding: 0 8px;
        color: var(--text-muted);
        user-select: none;
    }

    .page-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        pointer-events: none;
    }

    .message-actions {
        margin-left: auto;
        display: flex;
        gap: 8px;
        opacity: 0;
        transition: opacity 0.2s ease;
    }

    .message-item:hover .message-actions {
        opacity: 1;
    }

    .action-btn {
        background: none;
        border: none;
        color: var(--text-muted);
        padding: 6px;
        cursor: pointer;
        transition: color 0.2s ease;
    }

    .action-btn:hover {
        color: var(--primary);
    }

    .action-btn:hover i {
        color: #dc3545;
    }

    .spinning {
        animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }

    @media (min-width: 768px) {
        .desktop-only {
            display: flex;
        }
    }
</style>
