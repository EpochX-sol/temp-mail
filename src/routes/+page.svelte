<!-- @ts-ignore -->

<script>
    import { onMount } from 'svelte'; 
    import MessageList from '$lib/components/email/MessageList.svelte';
    import MessageDetail from '$lib/components/email/MessageDetail.svelte';
    import { storageService } from '$lib/services/storage';
    import { emailStore } from '$lib/stores/emailStore';
    import { apiService } from '$lib/services/api';
    import FAQ from '$lib/components/common/FAQ.svelte';
    import Features from '$lib/components/common/Features.svelte';
    import { UI_CONFIG } from '$lib/utils/constants';
    import Modal from '$lib/components/common/Modal.svelte';
    import EmailSelectorModal from '$lib/components/email/EmailSelectorModal.svelte';

    let hasEmail = false;
    let loading = false;
    let emailCount = 0;
    let generatedEmail = '';
    let storedEmail = '';
    let isCopied = false;
    let iterationCount = 0;
    const maxIterations = UI_CONFIG.ANIMATION.MAX_ITERATIONS;
    let iterationInterval;
    let restartTimeout;
    let selectedMessage = null;
    let showAddInboxModal = false;
    let showEmailSelectorModal = false;
    let showDeleteConfirmModal = false;
    let emailToDelete = '';
    let customUsername = '';
    let availableDomains = [];
    let selectedDomain = '';

    const randomDomains = () => {
        return '@ultrambox.com';
    };

    const generateRandomString = () => {
        const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < 8; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    };

    onMount(async () => {
        const emails = storageService.getEmails();
        hasEmail = emails.length > 0;
        if (hasEmail) {
            const currentEmail = emails[0];
            emailStore.setCurrentEmail(currentEmail);
            storedEmail = currentEmail;
        }
        startEmailAnimation();
        
        try {
            const domains = await apiService.getDomains();
            if (domains.code === 200 && domains.domains) {
                availableDomains = domains.domains;
                selectedDomain = domains.domains[0];
            }
        } catch (error) {
            console.error('Failed to fetch domains:', error);
        }
        
        return () => {
            clearInterval(iterationInterval);
            clearTimeout(restartTimeout);
        };
    });

    function startEmailAnimation() {
        iterationCount = 0;
        clearInterval(iterationInterval);
        clearTimeout(restartTimeout);
        
        iterationInterval = setInterval(() => {
            if (iterationCount >= maxIterations) {
                clearInterval(iterationInterval);
                restartTimeout = setTimeout(() => {
                    if (!hasEmail) {
                        startEmailAnimation();
                    }
                }, 3000);
                return;
            }
            generatedEmail = generateRandomString() + randomDomains();
            iterationCount++;
        }, 50);
    }

    async function handleGetEmail() {
        loading = true;
        try {
            const response = await apiService.getRandomEmail();
            if (response.code === 200 && response.email) {
                const newEmail = response.email;
                emailStore.setCurrentEmail(newEmail);
                storedEmail = newEmail;
                hasEmail = true;
                storageService.addEmail(newEmail);
                showAddInboxModal = false;
            } else {
                throw new Error('Failed to generate email');
            }
        } catch (error) {
            console.error('Failed to get email:', error);
        } finally {
            loading = false;
        }
    }

    function copyEmail() {
        navigator.clipboard.writeText(displayEmail).then(() => {
            isCopied = true;
            setTimeout(() => isCopied = false, UI_CONFIG.ANIMATION.COPY_FEEDBACK_DURATION);
        });
    }

    function handleMessageSelect(event) {
        selectedMessage = event.detail;
    }

    function handleBack() {
        selectedMessage = null;
    }

    $: displayEmail = hasEmail ? storedEmail : generatedEmail;

    $: {
        if ($emailStore.currentEmail) {
            storedEmail = $emailStore.currentEmail;
            hasEmail = true;
        }
    }

    async function handleDeleteInbox() {
        if (confirm('Are you sure you want to delete this inbox?')) {
            try {
                await emailStore.deleteInbox(storedEmail);
                hasEmail = false;
                storedEmail = '';
                selectedMessage = null;
                startEmailAnimation();
            } catch (error) {
                console.error('Failed to delete inbox:', error);
            }
        }
    }

    async function handleRefresh() {
        if (!storedEmail) return;
        try {
            await emailStore.refreshMessages(true);
        } catch (error) {
            console.error('Failed to refresh messages:', error);
        }
    }

    function handleAddInbox() {
        showAddInboxModal = true;
    }

    function handleYourInbox() {
        showEmailSelectorModal = true;
    }

    function handleDeleteInboxClick(email) {
        emailToDelete = email;
        showDeleteConfirmModal = true;
    }

    async function confirmDeleteInbox() {
        try {
            await emailStore.deleteInbox(emailToDelete);
            showDeleteConfirmModal = false;
            const remainingEmails = storageService.getEmails();
            if (remainingEmails.length === 0) {
                hasEmail = false;
                storedEmail = '';
                selectedMessage = null;
                startEmailAnimation();
            } else {
                storedEmail = remainingEmails[0];
                hasEmail = true;
            }
        } catch (error) {
            console.error('Failed to delete inbox:', error);
        }
    }

    async function handleCustomEmail() {
        if (!customUsername || !selectedDomain) return;
        
        const email = customUsername + '@' + selectedDomain;
        try {
            emailStore.setCurrentEmail(email);
            storedEmail = email;
            hasEmail = true;
            storageService.addEmail(email);
            showAddInboxModal = false;
            customUsername = ''; // Reset input
        } catch (error) {
            console.error('Failed to add custom email:', error);
        }
    }
</script>

<div class="page-container">
    <header class="header-section {hasEmail ? 'compact' : ''}">
        <div class="header-content">
            <div class="hero-content">
                <h1 class="compact-title">
                    {#if hasEmail}
                        Your Email
                    {:else}
                        Protect Your Privacy, Stay Anonymous
                    {/if}
                </h1>
                {#if hasEmail}
                    <h2 class="dynamic-email">
                        <span class="email-display">{storedEmail}</span>
                        <button 
                            class="copy-button" 
                            on:click={copyEmail}
                            aria-label="Copy email address"
                        >
                            {#if isCopied}
                                <i class="bi bi-check-circle-fill"></i>
                            {:else}
                                <i class="bi bi-clipboard"></i>
                            {/if}
                        </button>
                    </h2>
                    <div class="action-buttons">
                        <button class="action-btn primary" on:click={handleAddInbox}>
                            <i class="bi bi-plus-circle"></i>
                            Add Email
                        </button>
                        <button class="action-btn danger" on:click={() => handleDeleteInboxClick(storedEmail)}>
                            <i class="bi bi-trash"></i>
                            Delete Email
                        </button>
                        <button class="action-btn" on:click={handleYourInbox}>
                            <i class="bi bi-list"></i>
                            Your Emails
                        </button>
                    </div>
                {:else if generatedEmail}
                    <h2 class="dynamic-email preview">
                        <span class="email-display {iterationCount >= maxIterations ? 'final' : 'animating'}">{generatedEmail}</span>
                    </h2>
                {/if}
                {#if !hasEmail}
                    <div class="stats-container">
                        <div class="stat-item">
                            <i class="bi bi-envelope"></i>
                            <span>{emailCount}+ Emails Generated</span>
                        </div>
                        <div class="stat-item">
                            <i class="bi bi-lightning"></i>
                            <span>Instant Delivery</span>
                        </div>
                        <div class="stat-item">
                            <i class="bi bi-shield-lock"></i>
                            <span>100% Secure</span>
                        </div>
                    </div>
                    
                    <button class="cta-button" on:click={handleGetEmail} disabled={loading}>
                        {#if loading}
                            <i class="bi bi-arrow-clockwise spinning"></i>
                        {:else}
                            Get Your Email <i class="bi bi-arrow-right"></i>
                        {/if}
                    </button>
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
                <MessageList 
                    on:messageSelect={handleMessageSelect}
                />
            {/if}
        </div>
    </main> 
    <Features />
    <FAQ /> 
</div>

<Modal
    show={showAddInboxModal}
    title="Create New Email"
    onClose={() => showAddInboxModal = false}
>
    <div class="add-inbox-content">
        <div class="email-creation-options">
            <button class="option-btn random-btn" on:click={handleGetEmail}>
                <i class="bi bi-shuffle"></i>
                <span>Generate Random</span>
            </button>

            <div class="divider">
                <span>or</span>
            </div>

            <div class="custom-input-group">
                <input 
                    type="text" 
                    bind:value={customUsername}
                    placeholder="Enter username"
                    class="custom-input"
                >
                <span class="separator">@</span>
                <select bind:value={selectedDomain} class="domain-select">
                    {#each availableDomains as domain}
                        <option value={domain}>{domain}</option>
                    {/each}
                </select> 
                
                <button 
                    class="create-btn" 
                    on:click={handleCustomEmail}
                    disabled={!customUsername || !selectedDomain}
                >
                    Create
                </button>
            </div>
        </div>
    </div>
</Modal>

<EmailSelectorModal
    show={showEmailSelectorModal}
    onClose={() => showEmailSelectorModal = false}
/>

<Modal
    show={showDeleteConfirmModal}
    title="Delete Inbox"
    onClose={() => showDeleteConfirmModal = false}
>
    <div class="delete-confirm-content">
        <p>Are you sure you want to delete this inbox?</p>
        <p class="delete-email">{emailToDelete}</p>
        <div class="modal-buttons">
            <button class="modal-btn" on:click={() => showDeleteConfirmModal = false}>
                Cancel
            </button>
            <button class="modal-btn danger" on:click={confirmDeleteInbox}>
                Delete
            </button>
        </div>
    </div>
</Modal>

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

    .cta-button {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 16px 32px;
        font-size: 1.1rem;
        font-weight: 500;
        color: white;
        background: #2563eb;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s ease;
    }

    .cta-button:hover {
        background: #1d4ed8;
        transform: translateY(-2px);
    }

    .cta-button:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }

    .spinning {
        animation: spin 1s linear infinite;
    }

    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
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

        .hero-content {
            max-width: 100%;
        }

        h1 {
            font-size: 1.8rem;
            margin-bottom: 1rem;
        }

        .compact-title {
            font-size: 1.4rem;
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
            font-size: 0.7rem;
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
        }

        .dynamic-email.preview {
            padding: 8px 12px;
            margin: 0.75rem auto;
        }

        .dynamic-email.preview .email-display {
            font-size: 0.5rem;
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

    .custom-email-input {
        display: flex;
        align-items: center;
        background: var(--bg-secondary);
        border: 1px solid var(--border-color);
        border-radius: 8px;
        padding: 8px 16px;
        width: 100%;
    }

    .custom-email-input input {
        border: none;
        background: none;
        color: var(--text-primary);
        font-size: 1rem;
        outline: none;
        width: 100%;
        min-width: 0;
    }

    .custom-email-input .domain {
        color: var(--text-muted);
        font-size: 0.95rem;
        white-space: nowrap;
    }

    .domain-select {
        background: var(--bg-hover);
        border: 1px solid var(--border-color);
        color: var(--text-muted);
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 0.95rem;
        cursor: pointer;
        outline: none;
    }

    .domain-select:focus {
        border-color: var(--primary);
    }

    .add-btn {
        margin-top: 12px;
        background: var(--primary);
        color: white;
        border: none;
    }

    .add-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .email-creation-options {
        padding: 16px 0;
        display: flex;
        flex-direction: column;
        gap: 16px;
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
    }

    .random-btn {
        background: var(--primary);
        color: white;
    }

    .random-btn:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(var(--primary-rgb), 0.2);
    }

    .custom-input-group {
        display: flex;
        align-items: center;
        gap: 8px;
        background: var(--bg-secondary);
        border: 1px solid var(--border-color);
        border-radius: 8px;
        padding: 4px;
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
    }

    .separator {
        color: var(--text-muted);
    }

    .domain-select {
        appearance: none;
        background: var(--bg-hover);
        border: none;
        color: var(--text-primary);
        padding: 8px;
        font-size: 0.95rem;
        border-radius: 4px;
        cursor: pointer;
        outline: none;
        min-width: 140px;
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
    }

    .create-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .create-btn:not(:disabled):hover {
        transform: scale(1.05);
    }

    .divider {
        position: relative;
        text-align: center;
        margin: 8px 0;
    }

    .divider::before {
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        width: 100%;
        height: 1px;
        background: var(--border-color);
    }

    .divider span {
        background: var(--bg-primary);
        padding: 0 12px;
        color: var(--text-muted);
        font-size: 0.9rem;
        position: relative;
    }
</style>