<script>
    import { createEventDispatcher, onMount } from 'svelte';
    import { UI_CONFIG } from '$lib/utils/constants';
    import { emailStore } from '$lib/stores/emailStore';
    
    export let hasEmail = false;
    export let loading = false;
    
    const dispatch = createEventDispatcher();
    let isCopied = false;
    let iterationCount = 0;
    let generatedEmail = '';
    const maxIterations = UI_CONFIG.ANIMATION.MAX_ITERATIONS;
    let iterationInterval;
    let restartTimeout;
    let errorMessage = '';
 
    $: displayEmail = hasEmail ? $emailStore.currentEmail : generatedEmail;

    function truncateEmail(email, maxLength = 24) {
        if (email.length <= maxLength) return email;
        const atIndex = email.indexOf('@');
        if (atIndex === -1) return email;
        
        const domain = email.substring(atIndex);
        const name = email.substring(0, atIndex);
        
        const maxUsernameLength = 12;
        if (name.length > maxUsernameLength) {
            return `${name.substring(0, maxUsernameLength)}...${domain}`;
        }
        
        return email;
    }

    onMount(() => {
        if (!hasEmail) {
            startEmailAnimation();
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
            generatedEmail = generateRandomString() + '@ultrambox.com';
            iterationCount++;
        }, 50);
    }

    function generateRandomString() {
        const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < 8; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    function copyEmail() {
        navigator.clipboard.writeText(hasEmail ? $emailStore.currentEmail : generatedEmail).then(() => {
            isCopied = true;
            setTimeout(() => isCopied = false, UI_CONFIG.ANIMATION.COPY_FEEDBACK_DURATION);
        });
    }

    function handleAddEmail() {
        dispatch('addEmail');
    }

    $: if (!hasEmail) {
        startEmailAnimation();
    }
</script>

<div class="email-manager">
    {#if errorMessage}
        <div class="error-message">{errorMessage}</div>
    {/if}
    {#if hasEmail}
        <h2 class="dynamic-email">
            <span class="email-display" title={hasEmail ? $emailStore.currentEmail : generatedEmail}>{displayEmail}</span>
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
            <button class="action-btn primary" on:click={handleAddEmail}>
                <i class="bi bi-plus-circle action-btn-icon"></i>
                Add Email
            </button>
            <button class="action-btn danger" on:click={() => dispatch('deleteInbox', { email: $emailStore.currentEmail })}>
                <i class="bi bi-trash action-btn-icon"></i>
                Delete<span class="delete-email">Email</span>
            </button>
            <button class="action-btn" on:click={() => dispatch('showEmails')}>
                <i class="bi bi-list action-btn-icon"></i>
                Your Emails
            </button>
        </div>
    {:else}
        <h2 class="dynamic-email preview">
            <span class="email-display {iterationCount >= maxIterations ? 'final' : 'animating'}">{generatedEmail}</span>
        </h2>
    {/if}
</div>

<style>
    .dynamic-email {
        display: flex;
        justify-content: center;
        align-items: center;
        background: rgba(255, 255, 255, 0.1);
        padding: 10px 20px;
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
        font-size: 1.2rem;
        font-weight: 600;
        letter-spacing: 0.5px;
        color: #ffffff;
        text-align: center;
        max-width: 400px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
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
    .delete-email{
        position: relative;
            left:-4px;
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
        .dynamic-email {
            padding: 12px;
            margin: 1rem 0;
            font-size: 1rem;
        }
        .delete-email{
            display: none;
        }

        .action-buttons {
            flex-wrap: nowrap; 
            margin: 24px auto;
        }
 
        .action-btn { 
            min-width: 120px;
            font-size: 0.7rem; 
            white-space: nowrap; 
            justify-content: center;

        }

        .action-btn i {
            font-size: .8rem;
        }

        .email-display {
            font-size: 1rem;
            letter-spacing: 0.3px;
            max-width: 280px;
        }

        .dynamic-email.preview .email-display {
            font-size: 1rem;
        }
    }

    @media (max-width: 480px) {
        .dynamic-email {
            font-size: 1rem;
            padding: 10px 12px;
        }

        .email-display {
            font-size: 1rem;
            letter-spacing: 0.2px;
        }
        .delete-email{
            display: none;
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
            flex: 0 1 auto;
            min-width: 110px;
            font-size: 0.85rem;
            padding: 8px 14px;
            white-space: nowrap; 
            justify-content: center;

        }

        .action-buttons {
            gap: 10px;
            padding: 0 8px;
        }
    }

    .email-display.animating {
        animation: pulse 0.5s infinite;
    }

    .email-display.final {
        animation: none;
        color: #3b82f6;
    }

    @keyframes pulse {
        0% { opacity: 1; }
        50% { opacity: 0.7; }
        100% { opacity: 1; }
    }

    .error-message {
        color: red;
        margin: 1rem 0;
        text-align: center;
    }
</style> 