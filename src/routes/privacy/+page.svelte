<script> 

    const sections = [
        {
            title: "Information We Collect",
            content: [ 
                {
                    subtitle: "Email Service Information",
                    items: [
                        "Temporary email addresses generated",
                        "Message metadata (sender, subject, timestamp)",
                        "Email content for temporary storage",
                        "Usage patterns and frequency"
                    ]
                }
            ]
        },
        {
            title: "How We Use Your Information",
            content: [
                {
                    items: [
                        "To provide and maintain our temporary email service",
                        "To prevent abuse and ensure platform security",
                        "To analyze usage patterns and improve our service",
                        "To comply with legal obligations",
                        "To respond to user support requests"
                    ]
                }
            ]
        },
        {
            title: "Data Retention",
            content: [
                {
                    items: [
                        "Temporary emails are automatically deleted after 24 hours",
                        "Usage logs are retained for 30 days",
                        "Account information is deleted upon account closure",
                        "Backup data is encrypted and purged every 7 days"
                    ]
                }
            ]
        },
        {
            title: "Security Measures",
            content: [
                {
                    items: [
                        "End-to-end encryption for all email content",
                        "Regular security audits and penetration testing",
                        "Secure data centers with physical access controls",
                        "Regular software updates and vulnerability patching",
                        "Employee access controls and security training"
                    ]
                }
            ]
        },
        {
            title: "Your Rights",
            content: [
                {
                    items: [
                        "Right to access your personal data",
                        "Right to delete your data",
                        "Right to object to data processing",
                        "Right to data portability",
                        "Right to withdraw consent"
                    ]
                }
            ]
        },
        {
            title: "Third-Party Services",
            content: [
                {
                    items: [
                        "We do not sell your data to third parties",
                        "Limited data sharing with essential service providers",
                        "Third-party services are bound by strict data protection agreements",
                        "Regular audits of third-party compliance"
                    ]
                }
            ]
        }
    ];
</script>

<div class="privacy-page">
    <header class="privacy-header">
        <div class="header-content">
            <h1>Privacy Policy</h1>
            <p class="subtitle">Your privacy is our priority</p> 
        </div>
    </header>

    <main class="privacy-content">
        <div class="content-wrapper">
            <section class="intro-section">
                <p>
                    At Temp Emails, we take your privacy seriously. This Privacy Policy explains how we collect, 
                    use, and protect your personal information when you use our temporary email service.
                </p>
            </section>

            {#each sections as section}
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

    .last-updated {
        font-size: 0.9rem;
        color: var(--text-muted);
        margin-top: 8px;
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