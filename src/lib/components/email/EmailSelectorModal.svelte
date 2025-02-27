<script>
    import Modal from '../common/Modal.svelte';
    import { emailStore } from '$lib/stores/emailStore';
    import { storageService } from '$lib/services/storage';

    export let show = false;
    export let onClose = () => {};

    let emails = [];
    let newEmail = '';
    let emailError = '';
    $: currentEmail = $emailStore.currentEmail;

    $: if (show) {
        emails = storageService.getEmails();
    }

    function validateEmail(email) { 
        const emailRegex = /^[a-zA-Z0-9._]+$/;
        
        if (!email) {
            return 'Email is required';
        }
        if (email.length < 3) {
            return 'Email must be at least 3 characters long';
        }
        if (email.length > 30) {
            return 'Email must be less than 30 characters';
        }
        if (!emailRegex.test(email)) {
            return 'Email can only contain letters, numbers, dots, and underscores';
        }
        return '';
    }

    function handleEmailSelect(email) {
        emailStore.setCurrentEmail(email);
        onClose();
    }

    function truncateEmail(email, maxLength = 28) {
        if (email.length <= maxLength) return email;
        const atIndex = email.indexOf('@');
        if (atIndex === -1) return email;
        
        const domain = email.substring(atIndex);
        const name = email.substring(0, atIndex);
        
        const availableLength = maxLength - domain.length - 3;
        const truncatedName = name.substring(0, availableLength);
        
        return `${truncatedName}...${domain}`;
    }

</script>

<Modal {show} title="Select Email" {onClose}>
    <div class="email-selector">
        {#if emails.length === 0}
            <div class="empty-state">
                <div class="empty-icon">
                    <i class="bi bi-inbox-fill"></i>
                </div>
                <h3>No Emails Found</h3>
                <p>You haven't created any email addresses yet.</p>
            </div>
        {:else}
            <div class="email-list">
                {#each emails as email}
                    <button 
                        class="email-item" 
                        class:active={email === currentEmail}
                        on:click={() => handleEmailSelect(email)}
                    >
                        <div class="email-info">
                            <div class="email-icon">
                                <i class="bi bi-envelope-fill"></i>
                            </div>
                            <div class="email-details">
                                <span class="email-address">{truncateEmail(email)}</span>
                                {#if email === currentEmail}
                                    <span class="status-badge">Active</span>
                                {/if}
                            </div>
                        </div>
                        <i class="bi bi-check-circle-fill check-icon"></i>
                    </button>
                {/each}
            </div>
        {/if}
    </div>
</Modal>

<style>
    

    .empty-state {
        text-align: center;
        padding: 40px 20px;
        color: var(--text-muted);
    }

    .empty-icon {
        font-size: 4rem;
        margin-bottom: 16px;
        color: var(--text-muted);
        opacity: 0.5;
    }

    .empty-state h3 {
        margin: 0 0 8px 0;
        font-size: 1.1rem;
        color: var(--text-primary);
    }

    .empty-state p {
        margin: 0;
        font-size: 0.95rem;
    }

    .email-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
        max-height: 60vh;
        padding:15px 0;
        overflow-y: auto;
        padding-right: 4px;
        scrollbar-width: none;
    }

    .email-list::-webkit-scrollbar {
        width: 6px;
    }

    .email-list::-webkit-scrollbar-track {
        background: var(--bg-secondary);
        border-radius: 3px;
    }

    .email-list::-webkit-scrollbar-thumb {
        background: var(--border-color);
        border-radius: 3px;
    }

    .email-list::-webkit-scrollbar-thumb:hover {
        background: var(--border-hover);
    }

    .email-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 8px;
        border-radius: 12px;
        background: var(--bg-secondary);
        border: 1px solid var(--border-color);
        cursor: pointer;
        transition: all 0.2s ease;
        width: 100%;
        text-align: left;
    }

    .email-item:hover {
        background: var(--bg-hover);
        transform: translateY(-1px);
    }

    .email-item.active { 
        border-color: var(--primary);
        background: var(--bg-tertiary);
    }

    .email-info {
        display: flex;
        align-items: center;
        gap: 12px;
    }

    .email-icon {
        width: 40px;
        height: 40px;
        border-radius: 10px;
        background: var(--bg-tertiary);
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--primary);
        font-size: 1.5rem;
    }

 
    .email-details {
        display: flex;
        gap: 4px;
    }

    .email-address {
        font-size: 1rem;
        color: var(--text-primary);
        font-weight: 500;
    }

    .email-item.active .email-address {
        color: var(--text-primary);
    }

    .status-badge {
        font-size: 0.75rem;
        color: var(--text-muted);
        background: var(--bg-tertiary);
        padding: 2px 8px;
        border-radius: 12px;
        width: fit-content;
    }

    .email-item.active .status-badge {
        background: var(--primary);
        color: var(--bg-secondary);
    }

    .check-icon {
        color: var(--text-muted);
        font-size: 1.2rem;
        opacity: 0;
        transition: all 0.2s ease;
    }

    .email-item.active .check-icon {
        opacity: 1;
        color: var(--primary);
    }

    @media (max-width: 768px) {
        .email-item {
            padding: 12px;
            border-radius: 10px;
        }

        .email-icon {
            width: 24px;
            height: 24px;
            font-size: 1.4rem;
        }
        .email-details{

        flex-direction: column;
        }
        .email-address {
            font-size: 1rem;
        }

        .status-badge {
            font-size: 0.7rem;
        }

        .check-icon {
            font-size: 1.4rem;
        }

        .empty-icon {
            font-size: 3rem;
        }
    }
</style> 