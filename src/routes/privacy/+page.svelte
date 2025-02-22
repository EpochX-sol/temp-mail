<script>
    import { PRIVACY_POLICY } from '$lib/utils/constants'; // Import the privacy policy constants

</script>

<div class="privacy-page">
    <header class="privacy-header">
        <div class="header-content">
            <h1>{PRIVACY_POLICY.TITLE}</h1>
            <p class="subtitle">{PRIVACY_POLICY.SUBTITLE}</p> 
        </div>
    </header>

    <main class="privacy-content">
        <div class="content-wrapper">
            <section class="intro-section">
                <p>{PRIVACY_POLICY.INTRO}</p>
            </section>

            {#each PRIVACY_POLICY.SECTIONS as section}
                <section class="policy-section">
                    <h2>{section.title}</h2>
                    {#each section.content as subsection}
                        {#if subsection.subtitle}
                            <h3>{subsection.subtitle}</h3>
                        {/if}
                        <ul>
                            {#each subsection.items as item}
                                <li>{item}</li>
                            {/each}
                        </ul>
                    {/each}
                </section>
            {/each}

            <section class="contact-section">
                <h2>Contact Us</h2>
                <p>
                    If you have any questions about this Privacy Policy, please contact us at:
                    <a href="mailto:privacy@tempemails.com">privacy@tempemails.com</a>
                </p>
            </section>
        </div>
    </main>
</div>

<style>
    .privacy-page {
        min-height: 100vh;
        background: var(--bg-page);
        color: var(--text-primary);
    }

    .privacy-header {
        background: var(--bg-primary);
        padding: 48px 0;
        text-align: center;
        border-bottom: 1px solid var(--border-color);
    }

    .header-content {
        max-width: 800px;
        margin: 0 auto;
        padding: 0 20px;
    }

    .header-content h1 {
        font-size: 2.5rem;
        margin: 0;
        color: var(--highlight-color);
    }

    .subtitle {
        font-size: 1.2rem;
        color: var(--text-secondary);
        margin: 8px 0;
    }

    .privacy-content {
        max-width: 800px;
        margin: 0 auto;
        padding: 40px 20px;
    }

    .intro-section {
        font-size: 1.1rem;
        line-height: 1.6;
        margin-bottom: 40px;
        padding: 20px;
        background: var(--bg-primary);
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .policy-section {
        margin-bottom: 40px;
        padding: 24px;
        background: var(--bg-primary);
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .policy-section h2 {
        color: var(--highlight-color);
        font-size: 1.5rem;
        margin: 0 0 20px 0;
        padding-bottom: 10px;
        border-bottom: 2px solid var(--border-color);
    }

    .policy-section h3 {
        color: var(--text-primary);
        font-size: 1.2rem;
        margin: 20px 0 10px 0;
    }

    .policy-section ul {
        list-style-type: none;
        padding: 0;
        margin: 0;
    }

    .policy-section li {
        position: relative;
        padding-left: 24px;
        margin-bottom: 12px;
        line-height: 1.5;
    }

    .policy-section li::before {
        content: "•";
        color: var(--highlight-color);
        position: absolute;
        left: 8px;
    }

    .contact-section {
        margin-top: 60px;
        padding: 24px;
        background: var(--bg-primary);
        border-radius: 8px;
        text-align: center;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .contact-section h2 {
        color: var(--highlight-color);
        margin-bottom: 16px;
    }

    .contact-section a {
        color: var(--highlight-color);
        text-decoration: none;
        font-weight: 500;
    }

    .contact-section a:hover {
        text-decoration: underline;
    }

    @media (max-width: 768px) {
        .privacy-header {
            padding: 32px 0;
        }

        .header-content h1 {
            font-size: 2rem;
        }

        .policy-section {
            padding: 16px;
        }

        .policy-section h2 {
            font-size: 1.3rem;
        }

        .policy-section h3 {
            font-size: 1.1rem;
        }
    }
</style> 