<script>
    import { onMount } from 'svelte'; 
    import MessageList from '$lib/components/email/MessageList.svelte';
    import MessageDetail from '$lib/components/email/MessageDetail.svelte';
    import { storageService } from '$lib/services/storage';
    import { emailStore } from '$lib/stores/emailStore';
    import { apiService } from '$lib/services/api';
    import FAQ from '$lib/components/common/FAQ.svelte';
    import Features from '$lib/components/common/Features.svelte';
    import { UI_CONFIG, MAX_EMAILS } from '$lib/utils/constants';
    import Modal from '$lib/components/common/Modal.svelte';
    import EmailSelectorModal from '$lib/components/email/EmailSelectorModal.svelte';
    import SEO from '$lib/components/common/SEO.svelte';
    import EmailManager from '$lib/components/email/EmailManager.svelte';
    import Stats from '$lib/components/common/Stats.svelte';
    import CreateEmailModal from '$lib/components/email/CreateEmailModal.svelte';
    import Button from '$lib/components/common/Button.svelte';
    import DeleteConfirmModal from '$lib/components/email/DeleteConfirmModal.svelte';
    import EmailSelector from '$lib/components/email/EmailSelector.svelte';

    let hasEmail = false;
    let loading = false;
    let emailCount = 0;
    let selectedMessage = null;
    let showEmailSelectorModal = false;
    let showDeleteConfirmModal = false;
    let emailToDelete = '';
    let customUsername = '';
    let showCreateEmailModal = false;
    let isLimitReached = false;

    $: hasEmail = !!$emailStore.currentEmail;
    $: {
        emailCount = storageService.getEmails().length;
        isLimitReached = emailCount >= MAX_EMAILS;
    }

    onMount(() => {
        const unsubscribe = storageService.subscribe(() => {
            emailCount = storageService.getEmails().length;
            isLimitReached = emailCount >= MAX_EMAILS;
        });

        return () => {
            unsubscribe();
        };
    });

    function handleMessageSelect(event) {
        selectedMessage = event.detail;
    }

    function handleBack() {
        selectedMessage = null;
    }

    async function handleDeleteInbox() {
        if (confirm('Are you sure you want to delete this inbox?')) {
            try {
                await emailStore.deleteInbox($emailStore.currentEmail);
                hasEmail = false;
                selectedMessage = null;
            } catch (error) {
                throw error;
            }
        }
    }
  

    function handleDeleteInboxClick(email) {
        emailToDelete = email;
        showDeleteConfirmModal = true;
    }

    async function confirmDeleteInbox() {
        await emailStore.deleteInbox(emailToDelete);
        const remainingEmails = storageService.getEmails();
        if (remainingEmails.length === 0) {
            hasEmail = false;
        } else {
            emailStore.setCurrentEmail(remainingEmails[0]);
        }
    }

    async function handleRandomEmail() {
        try {
            const response = await apiService.getRandomEmail();
            if (response.code === 200 && response.email) {
                await emailStore.setCurrentEmail(response.email);
                storageService.addEmail(response.email);
                hasEmail = true;
            }
        } catch (error) { 
            throw error;
        }
    }

    async function handleCustomEmail(email) {
        try {
            await emailStore.setCurrentEmail(email);
            storageService.addEmail(email);
            hasEmail = true;
        } catch (error) { 
            throw error;
        }
    }

    function handleAddEmail() {
        showCreateEmailModal = true;
    }
</script>

<SEO page="HOME" />

<div class="page-container">
    <header class="header-section {hasEmail ? 'compact' : ''}">
        <div class="header-content {hasEmail?'':'large'}">
            <div class="hero-content">
                <h1 class="compact-title">
                    {#if hasEmail}
                        Your Email
                    {:else}
                        Protect Your Privacy, Stay Anonymous
                    {/if}
                </h1>
                
                <EmailManager 
                    {hasEmail}
                    {loading}
                    on:addInbox={() => showCreateEmailModal = true}
                    on:deleteInbox={({ detail }) => handleDeleteInboxClick(detail.email)}
                    on:showEmails={() => showEmailSelectorModal = true}
                    on:addEmail={handleAddEmail}
                />

                {#if !hasEmail}
                    <Stats {emailCount} />
                    <Button 
                        variant="primary"
                        size="lg"
                        icon="bi-arrow-right"
                        on:click={() => showCreateEmailModal = true}
                        {loading}
                    >
                        Get Your Email
                    </Button>
                {/if}
            </div>
        </div>
    </header>
 
    <main class="main-container">
        <div class="message-list-wrapper">
            {#if selectedMessage}
                <MessageDetail 
                    message={selectedMessage}
                    on:back={handleBack}
                />
            {:else}
                <EmailSelector />
                <MessageList 
                    on:messageSelect={handleMessageSelect}
                />
            {/if}
        </div>
    </main> 
    <Features />
    <FAQ /> 
</div>

<CreateEmailModal
    show={showCreateEmailModal}
    onClose={() => showCreateEmailModal = false}
    onRandomEmail={handleRandomEmail}
    onCustomEmail={handleCustomEmail}
    {isLimitReached}
    {emailCount}
/>

<EmailSelectorModal
    show={showEmailSelectorModal}
    onClose={() => showEmailSelectorModal = false}
/>

<DeleteConfirmModal
    show={showDeleteConfirmModal}
    onClose={() => showDeleteConfirmModal = false}
    onConfirm={confirmDeleteInbox}
    emailToDelete={emailToDelete}
/>

<style>
    .page-container {
        min-height: 100vh;
        background: var(--bg-page);
        display: flex;
        flex-direction: column;
    }

    .header-section {
        background-color: #17191e;
        width: 100%;
        position: relative;
        overflow: hidden; 
    }

    .header-section::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
          }

    .header-section.compact {
        min-height: 300px;
        padding: 20px 0;
    }

    .header-section.compact .header-content {
        padding: 20px 24px;
        min-height: auto;
    }

    .header-section.compact .hero-content h1 {
        font-size: 1.5rem;
        color: white;
    }

    .header-section.compact .dynamic-email {
        margin: 1rem 0;
        padding: 12px 24px;
    }

    .header-section.compact .email-display {
        font-size: 1.4rem;
    }

    .header-content {
        max-width: 1440px;
        margin: 0 auto;
        padding: 80px 24px;
        min-height: 400px;
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
        position: relative;
        z-index: 1;
    }

    .hero-content {
        max-width: 900px;
    }

    .hero-content h1 {
        font-size: 2.8rem;
        font-weight: 800;
        color: white;
        margin: 0;
        line-height: 1.2;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .hero-content h2 {
        font-size: 2.5rem;
        font-weight: 700;
        color: white;
        margin: 0.5rem 0;
    }

    .highlight {
        color: #3b82f6;
    }

    .subtitle {
        color: rgba(255, 255, 255, 0.8);
        font-size: 1.1rem;
        margin: 1rem 0 2rem;
    }

    .main-container {
        position: relative;
        top: -5px;
        flex: 1;
        width: 100%;
    }

    .content-wrapper {
        max-width: 90%;
        margin: 0 auto;
        padding: 0 24px;
    }

    .message-list-wrapper {
        max-width: 80%;
        margin: 0 auto; 
        border-radius: 12px; 
        padding: 24px;
        margin-top: -80px;
        position: relative;
        z-index: 10;
    }

    .message-list-wrapper:has(> :global(.message-detail)) {
        margin-top: -150px;
    }

    .dynamic-email {
        display: flex;
        justify-content: center;
        align-items: center;
        background: rgba(255, 255, 255, 0.1);
        padding: 16px 24px;
        border-radius: 12px;
        margin: 1.5rem auto;
        border: 1px solid rgba(255, 255, 255, 0.2);
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        backdrop-filter: blur(10px);
        max-width: 500px;
        width: 100%;
        gap: 12px;
    }

    .dynamic-email.preview {
        padding: 12px 20px;
        margin: 1rem auto;
        background: rgba(59, 130, 246, 0.1);
        border: 1px solid rgba(59, 130, 246, 0.2);
        box-shadow: none;
        max-width: 400px;
        transition: all 0.3s ease;
    }

    .dynamic-email.preview:has(.email-display.final) {
        background: rgba(59, 130, 246, 0.15);
        border-color: rgba(59, 130, 246, 0.3);
    }

    .email-display {
        font-size: 1.6rem;
        font-weight: 600;
        letter-spacing: 0.5px;
        color: #ffffff;
        text-align: center;
    }

    .dynamic-email.preview .email-display {
        font-size: 1.4rem;
        color: #3b82f6;
    }

    .copy-button {
        background: transparent;
        border: none;
        color: white;
        cursor: pointer;
        padding: 8px;
        border-radius: 4px;
        transition: all 0.2s;
        margin-left: 12px;
        opacity: 0.7;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .copy-button:hover {
        background: rgba(255, 255, 255, 0.2);
        opacity: 1;
    }

    .copy-button i {
        font-size: 1.2rem;
        transition: all 0.2s;
        width: 1.2rem;
        height: 1.2rem;
    }

    .bi-check-circle-fill {
        color: #4ade80;
        font-size: 1.3rem;
    }

    .stats-container {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 24px;
        margin: 2.5rem 0;
    }

    .stat-item {
        background: rgba(255, 255, 255, 0.05);
        color: #ffffff;
        border: 1px solid rgba(255, 255, 255, 0.1);
        padding: 16px;
        border-radius: 12px;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .stat-item:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    }

    .stat-item i {
        color: #60a5fa;
        font-size: 1.5rem;
        margin-bottom: 8px;
        display: block;
    }

    .stat-item span {
        font-weight: 500;
        display: block;
        font-size: 1.1rem;
    }

    .generated-email {
        font-family: 'Roboto Mono', monospace;
        font-size: 1.5rem;
        color: var(--text-primary);
        transition: color 0.3s ease;
        animation: pulse 2s infinite;
    }

    .generated-email.final {
        animation: none;
        color: var(--primary);
    }

    @keyframes pulse {
        0% { opacity: 1; }
        50% { opacity: 0.7; }
        100% { opacity: 1; }
    }

    .email-display {  
        border-radius: 8px;
        display: flex;
        align-items: center;
        gap: 1rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .email-display.animating {
        animation: pulse 0.5s infinite;
    }

    .email-display.final {
        animation: none;
        color: #3b82f6;
    }

    .action-buttons {
        display: flex;
        justify-content: center;
        gap: 16px;
        margin-top: 24px;
    }

    .action-btn {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 10px 20px;
        border-radius: 8px;
        font-size: 0.95rem;
        font-weight: 500;
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        color: rgb(4, 118, 248);
        cursor: pointer;
        transition: all 0.2s ease;
    }

    .action-btn:hover {
        background: rgba(255, 255, 255, 0.2);
        transform: translateY(-1px);
    }

     

    .action-btn.danger {
        background: rgba(244, 67, 54, 0.1);
        border-color: rgba(244, 67, 54, 0.3);
        color: aliceblue;
    }

    .action-btn.danger:hover {
        background: rgba(244, 67, 54, 0.2);
    }

    .action-btn i {
        font-size: 1.1rem;
    }

    @media (max-width: 768px) {
        .header-section {
            padding: 40px 0;
            min-height: auto;
        }

        .header-section.compact {
            padding: 24px 0;
        }

        .header-content {
            padding: 0 16px;
        }
        .large{
            height: 500px;
        }
        .main-container{
        top: -7px;

        }
        .hero-content {
            max-width: 100%; 
        }

        h1 {
            font-size: 1.8rem;
            margin-bottom: 1rem;
        }

        .compact-title {
            font-size: 1.7rem  !important;
        }

        .dynamic-email {
            padding: 12px 16px;
            margin: 1rem 0;
            font-size: 0.8rem;
        }

        .action-buttons {
            flex-wrap: wrap;
            gap: 8px;
        }

        .action-btn {
            flex: 1;
            width: 50%;
            padding: 8px 12px;
            font-size: 0.85rem;
        }

        .action-btn i {
            font-size: 0.9rem;
        }

        .stats-container {
            grid-template-columns: 1fr;
            gap: 12px;
            margin: 1.5rem 0;
        }

        .stat-item {
            padding: 12px;
        }

        .stat-item i {
            font-size: 1.2rem;
            margin-bottom: 4px;
        }

        .stat-item span {
            font-size: 0.95rem;
        }

        .cta-button {
            width: 100%;
            padding: 12px 20px;
            font-size: 1rem;
        }
        .header-section.compact .email-display {
        font-size: 1rem;
    }
        .email-display {
            font-size: 0.8rem;
            letter-spacing: 0.3px;
        }

        .dynamic-email.preview .email-display {
            font-size: 1rem;
        }
        .message-list-wrapper {
            max-width: 100%;
        }
    }

    @media (max-width: 480px) {
        .message-list-wrapper {
            margin-top: -40px;
            padding: 12px;
        } 

        .message-list-wrapper:has(> :global(.message-detail)) {
            margin-top: -60px;
            padding: 8px;
        }

        .dynamic-email {
            font-size: 0.7rem;
            padding: 10px 12px;
        }

        .email-display {
            font-size: 0.4rem;
            letter-spacing: 0.2px;
        }

        .copy-button {
            padding: 4px;
            margin-left: 8px;
        }

        .copy-button i {
            font-size: 0.9rem;
            width: 0.9rem;
            height: 0.9rem;
        }

        .action-btn {
            flex: 1 1 100%;
            font-size: 0.8rem;
        }

        .action-buttons { 
            width: 100%;
        }

        .main-container {
            padding: 0 8px;
            top: -18px;
        }

        .dynamic-email.preview {
            padding: 8px 12px;
            margin: 0.75rem auto;
        }

        .dynamic-email.preview .email-display {
            font-size: 1rem;
        }
        .header-section.compact .email-display {
        font-size: 1rem;
    }
    }

    .add-inbox-content,
    .delete-confirm-content {
        text-align: center;
    }

    .modal-buttons {
        display: flex;
        flex-direction: column;
        gap: 16px;
    }

    .modal-btn {
        flex: 1;
        padding: 12px 24px;
        border-radius: 8px;
        border: 1px solid var(--border-color);
        background: var(--bg-secondary);
        color: var(--text-primary);
        cursor: pointer;
        transition: all 0.2s ease;
    }

    .modal-btn:hover {
        background: var(--bg-hover);
    }

    .modal-btn.primary {
        background: var(--primary);
        color: white;
        border: none;
    }

    .modal-btn.danger {
        background: #dc3545;
        color: white;
        border: none;
    }

    .delete-email {
        font-family: monospace;
        font-size: 1.1rem;
        color: var(--text-primary);
        margin: 16px 0;
        padding: 8px;
        background: var(--bg-secondary);
        border-radius: 4px;
    }

    .or-divider {
        text-align: center;
        color: var(--text-muted);
        margin: 16px 0;
    }

    .custom-input-group {
        display: flex;
        align-items: center;
        gap: 8px;
        background: var(--bg-hover);
        border: 1px solid var(--border-color);
        border-radius: 8px;
        padding: 4px;
        transition: all 0.2s ease;
    }

    .custom-input-group:focus-within {
        border-color: var(--primary);
        box-shadow: 0 0 0 1px var(--primary);
    }

    .custom-input {
        border: none;
        background: none;
        color: var(--text-primary);
        font-size: 0.95rem;
        padding: 8px;
        outline: none;
        width: 50%;
        min-width: 0;
        transition: color 0.2s ease;
    }

    .custom-input::placeholder {
        color: var(--text-muted);
    }

    .separator {
        color: var(--text-muted);
        opacity: 0.7;
    }

    .domain-select {
        appearance: none;
        background: var(--bg-secondary);
        border: none;
        color: var(--text-primary);
        padding: 8px;
        font-size: 0.95rem;
        border-radius: 4px;
        cursor: pointer;
        outline: none;
        min-width: 140px;
        transition: all 0.2s ease;
    }

    .domain-select:hover {
        background: var(--bg-hover);
    }

    .domain-select option {
        background: var(--bg-primary);
        color: var(--text-primary);
        padding: 8px;
    }

    .create-btn {
        background: var(--primary);
        color: white;
        border: none;
        padding: 8px;
        width: 30%;
        border-radius: 6px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
        font-weight: 500;
    }

    .create-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        background: var(--text-muted);
    }

    .create-btn:not(:disabled):hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(var(--primary-rgb), 0.2);
    }

    .option-btn {
        width: 100%;
        padding: 12px;
        border: none;
        border-radius: 8px;
        font-size: 0.95rem;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        cursor: pointer;
        transition: all 0.2s ease;
        font-weight: 500;
    }

    .random-btn {
        background: var(--primary);
        color: white;
        border: 1px solid transparent;
    }

    .random-btn:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(var(--primary-rgb), 0.3);
        border-color: rgba(var(--primary-rgb), 0.5);
    }

    :global([data-theme="dark"]) {
        .custom-input-group {
            background: var(--bg-secondary);
            border-color: var(--border-color);
        }

        .domain-select {
            background: var(--bg-tertiary);
        }

        .domain-select:hover {
            background: var(--bg-hover);
        }

        .domain-select option {
            background: var(--bg-tertiary);
        }

        .create-btn:disabled {
            background: var(--bg-tertiary);
            color: var(--text-muted);
        }

        .random-btn {
            background: var(--primary);
            border-color: transparent;
        }

        .random-btn:hover {
            border-color: var(--primary);
            background: var(--primary-dark);
        }
    }

    .delete-confirm-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        padding: 1rem;
        gap: 0.5rem;
    }

    .warning-icon {
        font-size: 2.5rem;
        color: #dc3545;
        margin-bottom: 1rem;
    }
 
    .modal-actions {
        display: flex;
        gap: 1rem;
        justify-content: center;
        width: 100%;
    }

    @media (max-width: 768px) {
        .delete-confirm-content {
            padding: 0.5rem;
        }

        .warning-icon {
            font-size: 2rem;
        }

        
    }
 
    :global([data-theme="dark"]) .email-display {
        background: var(--bg-tertiary);
    }

    .delete-confirm-title,
    .delete-confirm-subtitle {
        color: var(--text-primary);
    }
 
</style>