<script>
    import { onMount, onDestroy } from 'svelte';
    import LoadingSpinner from './LoadingSpinner.svelte';
    import { emailStore } from '$lib/stores/emailStore';
    import { themeStore } from '$lib/stores/themeStore';
    import { createEventDispatcher } from 'svelte';
    import { API_CONFIG, UI_CONFIG } from '$lib/utils/constants';
    import { apiService } from '$lib/services/api';

    const dispatch = createEventDispatcher();

    let searchQuery = '';
    let selectedMessages = new Set();
    let allSelected = false;
    let currentPage = 1;
    let rowsPerPage = UI_CONFIG.PAGINATION.DEFAULT_ROWS_PER_PAGE;
    let totalPages = 1;
    let isRefreshing = false;
    let isDeleting = false;
    let isStarring = new Set();
    let errorMessage = '';
    let isRefreshDisabled = false;

    const pageSizes = UI_CONFIG.PAGINATION.PAGE_SIZES;
    const demoMessages = UI_CONFIG.DEMO_MESSAGES;

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
        currentPage * rowsPerPage
    );
 
    $: pageNumbers = Array.from(
        { length: totalPages }, 
        (_, i) => i + 1
    );

    function handlePageChange(page) {
        if (page >= 1 && page <= totalPages) {
            currentPage = page;
            selectedMessages.clear();
            allSelected = false;
        }
    }

    function handleRowsPerPageChange(event) {
        const newSize = parseInt(event.target.value);
        if (!pageSizes.find(size => size.value === newSize)) {
            return;
        }
        
        const firstItemIndex = (currentPage - 1) * rowsPerPage;
        rowsPerPage = newSize;
        currentPage = Math.max(1, Math.ceil((firstItemIndex + 1) / newSize));
        
        selectedMessages.clear();
        allSelected = false;
        
        try {
            localStorage.setItem('preferredPageSize', newSize.toString());
        } catch (error) {
            throw error;
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
            throw error;
        }
        
        const cleanup = emailStore.startPolling();
        return () => {
            cleanup();
        };
    });

    function handleSelectMessage(uid) {
        if (selectedMessages.has(uid)) {
            selectedMessages.delete(uid);
        } else {
            selectedMessages.add(uid);
        }
         
        allSelected = selectedMessages.size === messages.length;
    }

    function handleSelectAll() {
        if (allSelected || selectedMessages.size === messages.length) {
            selectedMessages.clear();
            allSelected = false;
        } else {
            messages.forEach(msg => selectedMessages.add(msg.uid));
            allSelected = true;
        } 
        selectedMessages = selectedMessages;
    }

    async function handleSingleDelete(uid, event) {
        event.stopPropagation();
        isDeleting = true;
        selectedMessages.delete(uid);
        selectedMessages = selectedMessages;
        
        try {
            await emailStore.deleteMessage(uid);
        } catch (error) {
            throw error;
        } finally {
            isDeleting = false;
        }
    }

    async function handleDelete() {
        if (selectedMessages.size > 0) {
            const uids = Array.from(selectedMessages);
            isDeleting = true;
            selectedMessages.clear();
            allSelected = false;
            selectedMessages = selectedMessages;

            try {
                await emailStore.bulkDelete(uids);
            } catch (error) {
                throw error;
            } finally {
                isDeleting = false;
            }
        }
    }

    async function handleMessageClick(message) { 
        if (!$emailStore.currentEmail) {
            if (message.uid === '1') {
                window.location.href = '/about';  
                return;
            } else if (message.uid === '2') {
                window.location.href = '/contact';  
                return;
            } 
            return;
        }
 
        dispatch('messageSelect', message);
        
        if (!message.is_read) {
            try {
                const success = await apiService.getMessage(message.uid); 
                if (success) {
                    const messageIndex = messages.findIndex(m => m.uid === message.uid);
                    if (messageIndex !== -1) {
                        messages[messageIndex].is_read = true;
                        messages = [...messages];
                    }
                }
            } catch (error) {
                throw error;
            }
        }
    }

    async function toggleStar(uid, event) {
        event?.stopPropagation();
        isStarring.add(uid);
        isStarring = isStarring;

        try {
            const success = await emailStore.toggleStar(uid);
            if (success) {
                const messageIndex = messages.findIndex(m => m.uid === uid);
                if (messageIndex !== -1) {
                    messages[messageIndex].is_starred = !messages[messageIndex].is_starred;
                    messages = [...messages];
                }
            }
        } catch (error) {
            throw error;
        } finally {
            isStarring.delete(uid);
            isStarring = isStarring;
        }
    }

    async function handleRefresh() {
        if ($emailStore.currentEmail && !isRefreshDisabled) {
            isRefreshing = true;
            isRefreshDisabled = true;
            
            await emailStore.refreshMessages(true);
            
            setTimeout(() => {
                isRefreshing = false;
                isRefreshDisabled = false;
            }, 1000);
        }
    }

    function formatMessageTime(date) {
        const now = new Date();
        const messageDate = new Date(date);
        const diffInSeconds = Math.floor((now - messageDate) / 1000);

        if (diffInSeconds < 60) {
            return `${diffInSeconds} second${diffInSeconds === 1 ? '' : 's'} ago`;
        } else if (diffInSeconds < 3600) {
            const diffInMinutes = Math.floor(diffInSeconds / 60);
            return `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`;
        } else if (diffInSeconds < 86400) {
            const diffInHours = Math.floor(diffInSeconds / 3600);
            return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
        } else if (diffInSeconds < 2592000) {  
            const diffInDays = Math.floor(diffInSeconds / 86400);
            return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`;
        } else if (diffInSeconds < 31536000) {  
            const diffInMonths = Math.floor(diffInSeconds / 2592000);  
            return `${diffInMonths} month${diffInMonths === 1 ? '' : 's'} ago`;
        } else {
            const diffInYears = Math.floor(diffInSeconds / 31536000);  
            return `${diffInYears} year${diffInYears === 1 ? '' : 's'} ago`;
        }
    }

 
</script>

{#if errorMessage}
    <div class="error-message">{errorMessage}</div>
{/if}

<div class="message-list"> 
    <div class="toolbar">
        <div class="toolbar-left">
            <button 
                class="tool-btn tooltip-container" 
                title="Select All" 
                on:click={handleSelectAll}
                class:active={selectedMessages.size > 0}
            >
                <label class="checkbox-wrapper">
                    <input 
                        type="checkbox"
                        checked={allSelected}
                        on:change={handleSelectAll}
                    >
                    <span class="checkmark"></span>
                </label>
                <span class="tooltip">Select All</span>
            </button>
            <div class="tool-buttons">
                <button 
                    class="tool-btn tooltip-container" 
                    on:click={handleRefresh}
                    class:inactive={isRefreshDisabled}
                    disabled={isRefreshDisabled}
                >
                    <i class="bi bi-arrow-clockwise tool-icon" class:spinning={isRefreshing}></i>
                    <span class="tooltip">Refresh</span>
                </button>
                <button 
                    class="tool-btn tooltip-container" 
                    on:click={handleDelete}
                    class:active={selectedMessages.size > 0}
                >
                    {#if isDeleting}
                        <i class="bi bi-arrow-clockwise spinning tool-icon"></i>
                    {:else}
                        <i class="bi bi-trash tool-icon"></i>
                    {/if}
                    <span class="tooltip">Delete</span>
                </button>
            </div> 
        </div>

        <div class="toolbar-center desktop-only">
            <h2 class="list-title">Message Inbox</h2>
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
                        disabled={isStarring.has(message.uid)}
                    >
                        {#if isStarring.has(message.uid)}
                            <i class="bi bi-arrow-clockwise spinning star-icon"></i>
                        {:else}
                            <i class="bi {message.is_starred ? 'bi-star-fill' : 'bi-star'} star-icon"></i>
                        {/if}
                    </button>
                    <div class="message-content" on:click={() => handleMessageClick(message)}>
                        <div class="message-avatar">
                            <div 
                                class="avatar-letter" 
                                style="background: {$themeStore === 'dark' ? 'var(--bg-tertiary)' : message.avatarColor || '#E8FFF3'}; 
                                       color: {$themeStore === 'dark' ? 'var(--text-primary)' : message.avatarTextColor || '#50CD89'}"
                            >
                                {message.from?.name?.[0] || message.name?.[0] || 'U'}
                            </div>
                        </div>
                        <div class="message-left-content">
                            <div class="message-name" class:unread={!message.is_read}>{message.from.name}</div>
                            <div class="message-subject" class:unread={!message.is_read}>{message.subject}</div>
                        </div>
                        <div class="message-meta">
                            <span class="message-time">{formatMessageTime(message.date)}</span>
                        </div>
                    </div>
                </div>
            {/each}
        </div>
    {/if}

                    
    <div class="pagination-container" class:pagination-none={!$emailStore.currentEmail}>
        <div class="pagination-left desktop-only">
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
        <div class="pagination-right">
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
        padding: 16px;
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
    .main-container{
        display: flex;
        gap: 5px;
    }
    .tool-btn {
        background: none;
        border: none;
        color: var(--text-primary);
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
        padding: 0 24px;
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
        display: flex;
        align-items: center;
        padding: 14px; 
        gap: 12px;
        min-width: 0;
        cursor: pointer;
    }

    .message-left-content {
        flex: 1;
        display: flex;
        flex-direction: row;
        gap: 12px;
        min-width: 0;
    }

    .message-name {
        font-weight: 500;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        min-width: 200px;
        max-width: 200px;
        margin-right: 48px;
    }

    .message-subject {
        flex: 1;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .message-meta {
        flex-shrink: 0;
        margin-left: auto;
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
        justify-content: space-between;
        align-items: center;
        padding: 8px 24px;
        border-top: 1px;
        min-height: 40px;
    }

    .pagination-left {
        display: flex;
        align-items: center;
        gap: 12px;
    }
    .pagination-none{
        display: none;
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
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='%23A1A5B7' class='bi bi-chevron-down' viewBox='0 0 16 16'%3E%3Cpath fill-rule='evenodd' d='M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z'/%3E%3C/svg%3E");
        background-repeat: no-repeat;
        background-position: right 8px center;
        background-size: 12px;
        cursor: pointer;
        font-size: 13px;
        min-width: 75px;
        transition: all 0.2s ease;
    }

    [data-theme="dark"] .rows-select {
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='%23565674' class='bi bi-chevron-down' viewBox='0 0 16 16'%3E%3Cpath fill-rule='evenodd' d='M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z'/%3E%3C/svg%3E");
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

    .pagination-right {
        display: flex;
        gap: 8px;
        margin-left: auto;
    }

    .page-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        min-width: 32px;
        height: 32px;
        padding: 0 8px;
        border: 1px solid var(--border-color);
        border-radius: 6px;
        background: var(--bg-primary);
        color: var(--text-primary);
        cursor: pointer;
        transition: all 0.2s ease;
    }

    .page-btn:hover:not(:disabled) {
        background: var(--bg-hover);
        border-color: var(--text-muted);
    }
 
    .page-btn:not(:first-child):not(:last-child) {
        background: var(--primary);
        color: white;
        border: none;
    }

    .page-btn:not(:first-child):not(:last-child):hover:not(:disabled) {
        background: var(--primary-dark);
    }

    .page-btn.active {
        background: var(--primary-dark);
        color: white;
        font-weight: 500;
        border: none;
    }

    .page-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        background: var(--bg-primary);
    }

    .page-btn i {
        font-size: 14px;
        color: var(--text-primary); 
    }

    .page-ellipsis {
        display: flex;
        align-items: center;
        padding: 0 4px;
        color: var(--text-secondary);
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

    .message-name.unread,
    .message-subject.unread {
        font-weight: 600;
        color: var(--text-primary);
    }

    .message-name {
        font-weight: 400;
        color: var(--text-secondary);
    }

    .message-subject {
        font-weight: 400;
        color: var(--text-secondary);
    }
 

    .tool-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .message-item.demo {
        opacity: 0.9;
        cursor: pointer; 
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
        background: none;
    }

    .toolbar-center {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-left: 120px;
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
        font-size: 1.3rem;
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

    .desktop-only {
        display: flex;
    }
    @media (max-width: 1024px) {
        .list-title{
           display:none;

        }
        .message-list {
            border-radius: 12px;
            margin: 0 auto;
        }

        .toolbar {
            padding: 8px 12px;
            min-height: 48px;
        }

        .search-box {
           display:none;
        }
        .pagination-left {
            display:none;

        }
    }

    @media (max-width: 768px) {
        .message-list {
            border-radius: 8px;
            margin: 0;
        }

        .toolbar {
            padding: 6px;
            flex-wrap: wrap;
            gap: 10px;
        }

        .toolbar-left {
            order: 1;
            width: 100%;
            justify-content: flex-start;
            gap: 4px;
        }

        .toolbar-center {
            order: 0;
            width: 100%;
            margin-bottom: 8px;
            display: none;
        }

        .toolbar-right {
            order: 2;
            width: 100%;
            display: none;
        }

        .search-box {
            display:none;

        }

        .message-item {
            padding: 8px 12px;
            gap: 10px;
        }

        .message-content {
            flex: 1;
            gap: 8px;
        }

        .message-left-content {
            flex: 1;
            flex-direction: column;
            gap: 2px;
        }

        .message-meta {
            padding-left: 8px;
        }

        .message-name {
            margin-right: 0;
            min-width: 0;
            max-width: 100%;
            font-size: 13px;
        }

        .message-subject {
            font-size: 12px;
            max-width: 200px;
        }

        .message-meta {
            width: auto;
            flex-shrink: 0;
        }

        .message-time {
            font-size: 12px;
        }

        .pagination-container {
            padding: 6px 12px;
            flex-direction: row;
            align-items: center;
            gap: 8px;
            width: 100%;
            min-height: 36px;
        }

        .pagination-right {
            width: auto;
            margin-right: 0;
            justify-content: center;
            flex-wrap: wrap;
        }

        .desktop-only {
            display: none;
        }

        .toolbar-center {
            display: none;
        }

        .toolbar-right {
            display: none;
        }

        .toolbar-left {
            justify-content: flex-start;
        }

        .tool-icon,.star-icon {
            font-size: 1rem;
        }

        .page-btn {
            min-width: 28px;
            height: 28px;
            padding: 0 6px;
        }

        .page-btn i {
            font-size: 0.8rem;
        }

        .page-ellipsis {
            padding: 0 4px;
            font-size: 0.8rem;
        }

        .tool-buttons {
            gap: 4px;
        }

        .tool-btn {
            padding: 4px;
            height: 32px;
            width: 32px;
        } 
        .tooltip {
            display: none;
        }

        .checkbox-wrapper {
            width: 20px;
            height: 20px;
            top: -2px;
        }

        .checkmark {
            height: 20px;
            width: 20px;
        }
    }

    @media (max-width: 480px) {
        .message-list {
            border-radius: 5px;
        }

        .message-item {
            padding: 6px 8px;
            gap: 8px;
        }

        .message-avatar {
            width: 24px;
            height: 24px;
        }

        .message-name {
            font-size: 12px;
        }

        .message-subject {
            font-size: 11px;
        }

        .page-btn {
            min-width: 24px;
            height: 24px;
            padding: 0 4px;
        }

        .rows-select {
            padding: 4px 20px 4px 8px;
            font-size: 12px;
        }

        .toolbar-left {
            gap: 2px;
        }

        .tool-buttons {
            gap: 2px;
        }

        .tool-btn {
            padding: 3px;
            height: 28px;
            width: 28px;
        }

        .tool-icon ,.star-icon{
            font-size: 1rem;
        }

        .pagination-container {
            padding: 4px 8px;
            flex-direction: row;
            align-items: center;
            gap: 4px; 
        }

        .pagination-right {
            gap: 4px;
        }

        .page-btn {
            min-width: 24px;
            height: 24px;
            padding: 0 4px;
        }

        .page-btn i {
            font-size: 0.7rem;
        }

        .page-ellipsis {
            font-size: 0.7rem;
        }

        .checkbox-wrapper {
            width: 18px;
            height: 18px;
        }

        .checkmark {
            height: 18px;
            width: 18px;
        }
    }
 
    .tool-btn.active {
        color: var(--primary);
    }

    .tool-btn.active .tool-icon {
        color: var(--primary);  
    }

    .error-message {
        color: var(--danger);
        background: var(--bg-danger);
        padding: 10px;
        border-radius: 5px;
        margin: 10px 0;
        text-align: center;
    }

    .tool-btn.inactive {
        opacity: 0.5;
        cursor: not-allowed;
        pointer-events: none;
    }

</style>