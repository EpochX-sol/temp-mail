<script>
    import { CONTACT_PAGE_CONFIG } from '$lib/utils/constants';
    import SEO from '$lib/components/common/SEO.svelte';
    import Button from '$lib/components/common/Button.svelte';

    let formData = {
        name: '',
        email: '',
        subject: '',
        message: ''
    };

    let isSubmitting = false;
    let submissionResult = null;

    async function handleSubmit(e) {
        e.preventDefault();
        isSubmitting = true;
        submissionResult = null;
        await new Promise(resolve => setTimeout(resolve, 2000));
        try {
            if (formData.name && formData.email && formData.subject && formData.message) {
                submissionResult = 'success';
                formData = { name: '', email: '', subject: '', message: '' };
            } else {
                submissionResult = 'error';
            }
        } catch (error) {
            console.error("Form submission error:", error);
            submissionResult = 'error';
        } finally {
            isSubmitting = false;
        }
    }
</script>

<SEO page="CONTACT" />

<div class="contact-page">
    <header class="contact-header">
        <div class="header-content">
            <h1>{CONTACT_PAGE_CONFIG.HEADER.TITLE}</h1>
            <p class="subtitle">{CONTACT_PAGE_CONFIG.HEADER.SUBTITLE}</p>
        </div>
    </header>

    <main class="contact-content">
        <div class="content-wrapper">
            <div class="contact-grid">
                <div class="contact-info">
                    {#each CONTACT_PAGE_CONFIG.CONTACT_INFO as info}
                        <div class="info-card">
                            <i class="bi {info.icon}"></i>
                            <h3>{info.title}</h3>
                            {#if info.type === 'email' || info.type === 'phone'}
                                <p><a href={info.link}>{info.content}</a></p>
                            {:else}
                                <p>{info.content}</p>
                            {/if}
                        </div>
                    {/each}
                </div>

                <form class="contact-form" on:submit={handleSubmit}>
                    {#each Object.entries(CONTACT_PAGE_CONFIG.FORM.FIELDS) as [field, config]}
                        <div class="form-group">
                            <label for={field.toLowerCase()}>{config.label}</label>
                            {#if field === 'MESSAGE'}
                                <textarea
                                    id={field.toLowerCase()}
                                    bind:value={formData[field.toLowerCase()]}
                                    required
                                    placeholder={config.placeholder}
                                ></textarea>
                            {:else}
                                <input
                                    type={field === 'EMAIL' ? 'email' : 'text'}
                                    id={field.toLowerCase()}
                                    bind:value={formData[field.toLowerCase()]}
                                    required
                                    placeholder={config.placeholder}
                                />
                            {/if}
                        </div>
                    {/each}
                    <Button 
                        variant="info"
                        icon="bi-envelope-paper"
                        type="submit"
                        loading={isSubmitting}
                        disabled={isSubmitting}
                        fullWidth
                    >
                        {CONTACT_PAGE_CONFIG.FORM.SUBMIT.text}
                    </Button>

                    {#if submissionResult === 'success'}
                        <div class="success-message">
                            <i class="bi bi-check-circle"></i> {CONTACT_PAGE_CONFIG.FORM.MESSAGES.SUCCESS}
                        </div>
                    {/if}

                    {#if submissionResult === 'error'}
                        <div class="error-message">
                            <i class="bi bi-exclamation-circle"></i> {CONTACT_PAGE_CONFIG.FORM.MESSAGES.ERROR}
                        </div>
                    {/if}
                </form>
            </div>
        </div>
    </main>
</div>

<style>
    .contact-page {
        min-height: 100vh;
        background: var(--bg-page);
        font-family: var(--font-family);
        color: var(--text-primary);
        display: flex;
        padding-bottom: 20px;
        flex-direction: column;
        align-items: center;
    }

    .contact-header {
        padding: 60px 20px;
        text-align: center;
        width: 100%;
    }

    .header-content {
        max-width: 800px;
        margin: 0 auto;
    }

    .header-content h1 {
        font-size: 2.5rem;
        margin: 0;
        color: var(--text-primary);
        font-weight: 600;
    }

    .subtitle {
        color: var(--text-secondary);
        font-size: 1.1rem;
        margin-top: 12px;
    }

    .contact-content {
        width: 100%;
        max-width: 1200px;
        margin-top: 40px;
    }

    .contact-grid {
        display: grid;
        grid-template-columns: 1fr 2fr;
        gap: 40px;
    }

    .contact-info {
        display: flex;
        flex-direction: column;
        gap: 20px;
    }

    .info-card {
        background: var(--bg-primary);
        border: 1px solid var(--border-color);
        border-radius: 8px;
        padding: 20px;
        text-align: center;
        transition: transform 0.2s; 
    }

    .info-card:hover {
        transform: translateY(-5px); 
    }

    .info-card i {
        font-size: 2rem;
        color: var(--icon-color);
        margin-bottom: 10px;
    }

    .info-card h3 {
        font-size: 1.25rem;
        margin: 0;
        color: var(--text-primary);
    }

    .info-card p {
        line-height: 1.6;
        margin-bottom: 20px;
        color: var(--text-secondary);
    }

    .info-card a {
        color: var(--text-primary);
        text-decoration: none;
        transition: color 0.2s;
    }

    .info-card a:hover {
        text-decoration: underline;
    }

    .contact-form {
        background: var(--bg-primary);
        border: 1px solid var(--border-color);
        border-radius: 8px;
        padding: 24px; 
    }

    .form-group {
        margin-bottom: 20px;
    }

    .form-group label {
        display: block;
        font-size: 1.1rem;
        color: var(--text-primary);
        margin-bottom: 8px;
    }

    .form-group input,
    .form-group textarea {
        width: 100%;
        padding: 12px;
        border: 1px solid var(--border-color);
        border-radius: 6px;
        font-size: 0.95rem;
        color: var(--text-primary);
        background: var(--bg-secondary);
        outline: none;
        transition: all 0.2s ease;
    }

    .form-group input:focus,
    .form-group textarea:focus {
        border-color: var(--highlight-color); 
    }

    .form-group textarea {
        resize: vertical;
        min-height: 120px;
    }

    .success-message,
    .error-message {
        margin-top: 20px;
        padding: 12px;
        border-radius: 6px;
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .success-message {
        background-color: var(--success-bg);
        border: 1px solid var(--success-border);
        color: var(--success-text);
    }

    .error-message {
        background-color: var(--error-bg);
        border: 1px solid var(--error-border);
        color: var(--error-text);
    }

    @media (max-width: 768px) {
        .contact-header {
            padding: 40px 16px;
        }

        .header-content h1 {
            font-size: 2rem;
            line-height: 1.2;
        }

        .subtitle {
            font-size: 1rem;
            margin-top: 8px;
        }

        .contact-content {
            padding: 0 16px;
            margin-top: 24px;
        }

        .contact-grid {
            grid-template-columns: 1fr;
            gap: 24px;
        }

        .info-card {
            padding: 16px;
            text-align: left;
            display: flex;
            align-items: center;
            gap: 16px;
            border: none;
        }

        .info-card i {
            font-size: 1.5rem;
            margin-bottom: 0;
        }

        .info-card h3 {
            font-size: 1.1rem;
        }

        .info-card p {
            margin-bottom: 0;
            font-size: 0.95rem;
        }

        .contact-form {
            padding: 20px;
        }

        .form-group {
            margin-bottom: 16px;
        }

        .form-group label {
            font-size: 1rem;
        }

        .form-group input,
        .form-group textarea {
            padding: 10px;
            font-size: 0.9rem;
        }

        .form-group textarea {
            min-height: 100px;
        }

        .success-message,
        .error-message {
            margin-top: 16px;
            padding: 10px;
            font-size: 0.9rem;
        }
    }

    @media (max-width: 480px) {
        .contact-header {
            padding: 32px 12px;
        }

        .header-content h1 {
            font-size: 1.8rem;
        }

        .info-card {
            padding: 12px;
            gap: 12px;
            border: none;
        }

        .info-card i {
            font-size: 1.2rem;
        }

        .info-card h3 {
            font-size: 1rem;
        }

        .info-card p {
            font-size: 0.9rem;
        }

        .contact-form {
            padding: 16px;
        }

        .form-group {
            margin-bottom: 12px;
        }

        .form-group label {
            font-size: 0.95rem;
        }

        .form-group input,
        .form-group textarea {
            padding: 8px;
            font-size: 0.85rem;
        }

        .form-group textarea {
            min-height: 80px;
        }
    }
</style>