<script>
    import { onMount } from 'svelte'; 
    import MessageList from '$lib/components/email/MessageList.svelte'; 
    import { storageService } from '$lib/services/storage';
    import { emailStore } from '$lib/stores/emailStore';
    import { apiService } from '$lib/services/api';
    import FAQ from '$lib/components/common/FAQ.svelte';

    let hasEmail = false;
    let loading = false;
    let emailCount = 0;
    let generatedEmail = '';
    let storedEmail = '';
    let isCopied = false;
    const randomDomains = () => {
        const randomChars = Math.random().toString(36).substring(2, 6);
        return `@${randomChars}.com`;
    };

    onMount(() => {
        const emails = storageService.getEmails();
        hasEmail = emails.length > 0;
        if (hasEmail) {
            const currentEmail = emails[0];
            emailStore.setCurrentEmail(currentEmail);
            storedEmail = currentEmail;
        }
        generateRandomEmail();
        setInterval(generateRandomEmail, 5000);
    });

    async function handleGetEmail() {
        loading = true;
        try {
            const response = await apiService.getRandomEmail();
            const newEmail = response.email;
            emailStore.setCurrentEmail(newEmail);
            storedEmail = newEmail;
            hasEmail = true;
            storageService.addEmail(newEmail);
        } catch (error) {
            console.error('Failed to get email:', error);
        } finally {
            loading = false;
        }
    }

    function generateRandomEmail() {
        const randomString = Math.random().toString(36).substring(2, 8);
        generatedEmail = randomString + randomDomains();
        emailCount += 1;
    }

    function copyEmail() {
        navigator.clipboard.writeText(displayEmail).then(() => {
            isCopied = true;
            setTimeout(() => isCopied = false, 2000); 
        });
    }

    $: displayEmail = hasEmail ? storedEmail : generatedEmail;
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
                {:else if generatedEmail}
                    <h2 class="dynamic-email preview">
                        <span class="email-display">{generatedEmail}</span>
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
            <div class=" ">
                <section class="message-list-wrapper">
                    <MessageList />
                </section>
            </div>
        </main>
        {#if !hasEmail}
            <FAQ />
        {/if}
</div>

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
        font-size: 1.3rem; /* Slightly larger for better visibility */
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

 
</style>