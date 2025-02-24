<script>
    import Modal from '$lib/components/common/Modal.svelte';
    import Button from '$lib/components/common/Button.svelte';
    import { emailStore } from '$lib/stores/emailStore';

    export let show = false;
    export let onClose = () => {};
    export let availableDomains = [];
    export let onRandomEmail = () => {};
    export let onCustomEmail = () => {};
    
    let customUsername = '';
    let showDomainSelect = false;
    let loading = false;
    let isValidEmail = true;
    let errorMessage = '';

    $: selectedDomain = availableDomains[0] || '';
    $: emailCount = emailStore.getAllEmails().length;

    function getRandomDomain() {
        const randomIndex = Math.floor(Math.random() * availableDomains.length);
        return availableDomains[randomIndex];
    }

    async function handleRandomEmail() {
        loading = true;
        try { 
            selectedDomain = getRandomDomain();
            await onRandomEmail();
            onClose();
        } catch (error) {
            console.error('Failed to create random email:', error);
        } finally {
            loading = false;
        }
    }

    function validateEmail(username) {
        isValidEmail = true;
        errorMessage = '';

        if (username.length < 4) {
            isValidEmail = false;
            errorMessage = 'Username must be at least 4 characters';
            return false;
        }
        if (username.length > 60) {
            isValidEmail = false;
            errorMessage = 'Username must be less than 60 characters';
            return false;
        }

        const validFormat = /^[a-zA-Z0-9._-]+$/.test(username);
        if (!validFormat) {
            isValidEmail = false;
            errorMessage = 'Username can only contain letters, numbers, dots, underscores, and hyphens';
            return false;
        }

        return true;
    }

    $: {
        if (customUsername) {
            validateEmail(customUsername);
        } else {
            isValidEmail = true;
            errorMessage = '';
        }
    }

    async function handleCustomSubmit() {
        const lowercaseUsername = customUsername.toLowerCase();
        if (validateEmail(lowercaseUsername)) {
            customUsername = lowercaseUsername;
            if (selectedDomain) {
                if (emailCount >= 10) {
                    errorMessage = 'Maximum limit of 10 emails exceeded.';
                    return;
                }
                loading = true;
                try {
                    await onCustomEmail(`${customUsername}@${selectedDomain}`);
                    customUsername = '';
                    errorMessage = '';
                    onClose();
                } catch (error) {
                    console.error('Failed to create email:', error);
                } finally {
                    loading = false;
                }
            }
        }
    }

    function toggleDomainSelect() {
        showDomainSelect = !showDomainSelect;
    }

    function handleDomainSelect(domain) {
        selectedDomain = domain;
        showDomainSelect = false;
    }

    function handleClickOutside(event) {
        const select = event.target.closest('.domain-select-wrapper');
        if (!select) {
            showDomainSelect = false;
        }
    }
</script>

<svelte:window on:click={handleClickOutside}/>

<Modal 
    {show} 
    title="Add Inbox" 
    {onClose}
    closeOnBackdrop={false}
>
    <div class="create-email-container"> 
        <div class="random-section">
            <div class="random-header">
                <i class="bi bi-shuffle"></i>
                <h3>Random Email</h3>
            </div> 
            <button 
                class="random-btn" 
                on:click={handleRandomEmail}
                disabled={loading || emailCount >= 10}
            >
                {#if loading}
                    <i class="bi bi-arrow-clockwise spinning"></i>
                {:else}
                    <i class="bi bi-magic"></i>
                {/if}
                Generate Random Email
            </button>
        </div>

        <div class="divider">
            <span>or</span>
        </div>

        <div class="custom-option">
            <div class="custom-header">
                <i class="bi bi-pencil-square"></i>
                <h3>Custom Email</h3>
            </div> 
            <div class="input-group">
                <input 
                    type="text" 
                    bind:value={customUsername}
                    placeholder="Enter username"
                    class="custom-input"
                    class:invalid={!isValidEmail}
                >
                {#if errorMessage}
                    <span class="error-hint">{errorMessage}</span>
                {/if}
                <span class="separator">@</span>
                <div class="domain-select-wrapper">
                    <button 
                        type="button"
                        class="domain-select"
                        on:click|stopPropagation={toggleDomainSelect}
                    >
                        <span>{selectedDomain}</span>
                        <i class="bi bi-chevron-down" class:open={showDomainSelect}></i>
                    </button>
                    {#if showDomainSelect}
                        <div class="domain-options" 
                            class:mobile={window.innerWidth <= 768}
                        >
                            {#each availableDomains as domain}
                                <button
                                    class="domain-option"
                                    class:selected={domain === selectedDomain}
                                    on:click|stopPropagation={() => handleDomainSelect(domain)}
                                >
                                    {domain}
                                </button>
                            {/each}
                        </div>
                    {/if}
                </div>
            </div>
            <div class="action-buttons">
                <Button 
                    variant="secondary"
                    size="sm"
                    on:click={onClose}
                >
                    Cancel
                </Button>
                <Button 
                    variant="primary"
                    size="sm"
                    disabled={!customUsername || !selectedDomain || emailCount >= 10 || !isValidEmail}
                    on:click={handleCustomSubmit}
                >
                    Add inbox
                </Button>
            </div>
        </div>
    </div>
</Modal>

<style>
    .create-email-container {
        display: flex;
        flex-direction: column;
        gap: 20px; 
    }
 

    .random-section {
        display: flex;
        flex-direction: column;
        align-items: center;   
        text-align: center;
    }

    .random-header {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 8px;
    }

    .random-header i {
        font-size: 1.4rem;
        color: var(--primary);
    }

    .random-header h3 {
        margin: 0;
        font-size: 1.1rem;
        color: var(--text-primary);
        font-weight: 600;
        font-family: 'Inter', sans-serif;
    }

     
    .random-btn {
        width: 100%;
        padding: 10px 16px;
        background: var(--primary);
        color: white;
        border: none;
        border-radius: 6px;
        font-size: 0.95rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
    }

    .random-btn:hover:not(:disabled) {
        background: var(--primary-dark);
        transform: translateY(-1px);
    }

    .random-btn:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }

    .random-btn i {
        font-size: 1.1rem;
    }

    .spinning {
        animation: spin 1s linear infinite;
    }

    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }

    .divider {
        display: flex;
        align-items: center;
        text-align: center;
        color: var(--text-muted);
        font-size: 0.9rem;
    }

    .divider::before,
    .divider::after {
        content: '';
        flex: 1;
        border-bottom: 1px solid var(--border-color);
    }

    .divider span {
        margin: 0 10px;
    } 

    .custom-header {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 8px;
        justify-content: center;
    }

    .custom-header i {
        font-size: 1.4rem;
        color: var(--primary);
    }

    .custom-header h3 {
        margin: 0;
        font-size: 1.1rem;
        color: var(--text-primary);
        font-weight: 600;
        font-family: 'Inter', sans-serif;
    }

 

    .input-group {
        position: relative;
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 32px;
    }

    .custom-input {
        flex: 1;
        padding: 8px 12px;
        border: 1px solid var(--border-color);
        border-radius: 4px;
        font-size: 0.95rem;
        transition: all 0.2s ease;
        color: var(--text-primary);
        min-width: 0;

    }

    .custom-input.invalid {
        border-color: var(--danger);
    }

    .error-hint {
        position: absolute;
        top: 100%;
        left: 0;
        font-size: 0.8rem;
        color: var(--danger);
        margin-top: 4px;
    }

    .separator {
        color: var(--text-muted);
    }

    .domain-select-wrapper {
        position: relative;
        width: 170px;
        z-index: 1001;
    }

    .domain-select {
        width: 100%;
        padding: 8px 12px;
        border: 1px solid var(--border-color);
        border-radius: 4px;
        background: var(--bg-secondary);
        color: var(--text-primary);
        font-size: 0.95rem;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        position: relative;
    }

    .domain-select i {
        transition: transform 0.2s ease;
    }

    .domain-select i.open {
        transform: rotate(380deg);
    }

    .domain-options { 
        position: absolute;
        bottom: calc(100% + 4px);
        left: 0;
        background: var(--bg-primary);
        border: 1px solid var(--border-color);
        border-radius: 8px;
        overflow-y: auto;
        box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.2);
        width: 100%;
        max-height: 250px;
        z-index: 1001;
    }

 
    .domain-option {
        width: 100%;
        padding: 8px 16px;
        text-align: left;
        border: none;
        background: none;
        color: var(--text-primary);
        cursor: pointer;
        font-size: 0.95rem;
        display: flex;
        align-items: center;
    }

    .domain-option:hover {
        background: var(--bg-hover);
    }

    .domain-option.selected {
        color: var(--primary);
        background: var(--bg-hover);
    }

    .action-buttons {
        display: flex;
        justify-content: flex-end;
        gap: 12px;
        margin-top: 24px;
    }

  
 
    @media (max-width: 768px) {
        .create-email-container {
            gap: 16px;
        }

        .input-group {
            gap: 4px;
            align-items: center;
        }

        .custom-input,
        .domain-select {
            flex: 1;
            height: 42px;
            font-size: 14px;
        }

        .domain-select-wrapper {
            width: 160px;
        }

        .custom-input {
            padding: 0 12px;
        }

 
        
        .action-buttons {
            flex-direction: column-reverse;
            gap: 8px;
            margin-top: 48px;
        }

        
        .domain-options {
            position: absolute;
            bottom: calc(100% + 4px);
            top: auto;
            left: 0;
            width: 100%;
            max-height: 180px;
            border-radius: 8px;
            margin-top: 0;
            box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.2);
            z-index: 1001;
        }

        .error-hint {
            font-size: 0.75rem;
        }
    }

 
    

    :global([data-theme="dark"]) .domain-options {
        background: var(--bg-tertiary);
        box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.2);
    }

    :global(.modal-content) {
        overflow: visible !important;
    }
</style>  