<script>
    import Modal from '../common/Modal.svelte';
    import { emailStore } from '$lib/stores/emailStore';
    import { storageService } from '$lib/services/storage';

    export let show = false;
    export let onClose = () => {};

    $: emails = storageService.getEmails();
    $: currentEmail = $emailStore.currentEmail; 
    function handleEmailSelect(email) {
        emailStore.setCurrentEmail(email);
        onClose();
    }
</script>

<Modal {show} title="Select Email" {onClose}> 
    <div class="email-list">
        {#each emails as email}
            <button 
                class="email-item" 
                class:active={email === currentEmail}
                on:click={() => handleEmailSelect(email)}
            >
                <div class="email-info">
                    <i class="bi bi-envelope"></i>
                    <span class="email-address">{email}</span>
                    {#if email === currentEmail}
                        <span class="active-badge">Active</span>
                    {/if}
                </div>
                <i class="bi bi-check-lg check-icon"></i>
            </button>
        {/each}
    </div>
</Modal>

<style>
    .email-list {
        display: flex;
        flex-direction: column;
        gap: 12px;
    }

    .email-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 16px;
        border-radius: 12px;
        background: var(--bg-secondary);
        border: 1px solid var(--border-color);
        cursor: pointer;
        transition: all 0.2s ease;
        color: var(--text-primary);
        text-align: left;
        width: 100%;
    }

    .email-item:hover {
        background: var(--bg-hover);
        transform: translateY(-1px);
        border-color: var(--primary);
    }

    .email-item.active {
        border-color: var(--primary);
        background: var(--bg-hover);
    }

    .email-info {
        display: flex;
        align-items: center;
        gap: 12px;
        font-size: 0.95rem;
    }

    .email-info i {
        color: var(--text-muted);
        font-size: 1.1rem;
    }

    .email-address {
        font-size: 0.95rem;
        color: var(--text-primary);
    }

    .active-badge {
        background: var(--primary);
        color: white;
        padding: 4px 8px;
        border-radius: 12px;
        font-size: 0.75rem;
    }

    .check-icon {
        color: var(--primary);
        opacity: 0;
        transition: opacity 0.2s ease;
    }

    .email-item.active .check-icon {
        opacity: 1;
    }

    .modal-description {
        color: var(--text-secondary);
        font-size: 0.95rem;
        margin-bottom: 24px;
        text-align: center;
    }
</style> 