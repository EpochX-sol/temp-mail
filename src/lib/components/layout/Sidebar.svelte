<script>
    const mainNavItems = [
        { id: 'inbox', icon: 'bi-envelope', label: 'Inbox', count: 3, isActive: true },
        { id: 'marked', icon: 'bi-star', label: 'Marked' },
        { id: 'draft', icon: 'bi-file-earmark-text', label: 'Draft', count: 5 },
        { id: 'sent', icon: 'bi-send', label: 'Sent' },
        { id: 'trash', icon: 'bi-trash', label: 'Trash' }
    ];

    const customNavItems = [
        { id: 'custom-work', icon: 'bi-briefcase', label: 'Custom Work', count: 6, color: '#FF4081' },
        { id: 'partnership', icon: 'bi-people', label: 'Partnership', color: '#4CAF50' },
        { id: 'in-progress', icon: 'bi-clock-history', label: 'In Progress', color: '#9C27B0' }
    ];

    const handleNewMessage = () => {};
    const handleAddLabel = () => {};
</script>

<aside class="sidebar">
    <button class="new-message" on:click={handleNewMessage}>
        <i class="bi bi-plus-lg"></i>
        <span>New Message</span>
    </button>

    <nav class="nav-menu">
        {#each mainNavItems as item}
            <a href="/{item.id}" class="nav-item" class:active={item.isActive}>
                <i class="bi {item.icon}"></i>
                <span>{item.label}</span>
 
            </a>
        {/each}
    </nav>

    <div class="divider"></div>

    <nav class="nav-menu">
        {#each customNavItems as item}
            <a href="/{item.id}" class="nav-item">
                <i class="bi {item.icon}" style="color: {item.color}"></i>
                <span>{item.label}</span>
               
            </a>
        {/each}
    </nav>

    <div class="divider"></div>

    <button class="nav-item add-label" on:click={handleAddLabel}>
        <i class="bi bi-plus"></i>
        <span>Add Label</span>
    </button>
</aside>

<style>
    .sidebar {
        background: var(--bg-primary);
        border-right: 1px solid var(--border-color);
        padding: 16px; 
    }

    .new-message {
        width: 100%;
        background: #0D6EFD;
        color: #fff;
        border: none;
        border-radius: 10px;
        padding: 12px;
        font-size: 14px;
        font-weight: 500;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        cursor: pointer;
        margin-bottom: 20px;
        transition: background-color 0.2s;
    }

    .new-message:hover {
        background: #0b5ed7;
    }

    .nav-menu {
        display: flex;
        flex-direction: column;
        gap: 2px;
    }

    .nav-item {
        display: flex;
        align-items: center;
        padding: 10px 12px;
        border-radius: 8px;
        color: var(--text-muted);
        text-decoration: none;
        font-size: 14px;
        font-weight: 500;
        transition: all 0.2s;
    }

    .nav-item:hover {
        background: var(--bg-secondary);
        color: var(--text-primary);
    }

    .nav-item.active {
        background: var(--bg-tertiary);
        color: var(--text-primary);
    }

    .nav-item i {
        width: 20px;
        font-size: 18px;
        margin-right: 12px;
    }

    .nav-item span {
        flex: 1;
    }

    .badge {
        background: #E2E8F0;
        color: #64748B;
        padding: 2px 8px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: 500;
        min-width: 20px;
        text-align: center;
    }

    .divider {
        height: 1px;
        background: var(--border-color);
        margin: 12px 0;
    }

    .add-label {
        width: 100%;
        background: none;
        border: none;
        cursor: pointer;
        justify-content: flex-start;
        padding: 10px 12px;
    }

    .add-label:hover {
        background: #F8FAFC;
    }
</style>