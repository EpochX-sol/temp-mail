<script>
    const faqs = [
        {
            question: "What is a Disposable Temporary Email?",
            answer: "A disposable temporary email is a temporary email address that you can use to protect your privacy online. It allows you to receive emails without revealing your personal email address.",
            icon: "bi-shield-check"
        },
        {
            question: "How does it work?",
            answer: "Our service generates a unique email address that forwards all incoming messages to our secure servers. You can view these messages through our web interface without downloading anything.",
            icon: "bi-gear"
        },
        {
            question: "Is it really free?",
            answer: "Yes, our service is completely free to use with no hidden charges. We believe in providing accessible privacy tools for everyone.",
            icon: "bi-currency-dollar"
        },
        {
            question: "How long do emails stay in my inbox?",
            answer: "Emails in your temporary inbox are automatically deleted after 24 hours to maintain privacy and security. Make sure to save any important information before it expires.",
            icon: "bi-clock-history"
        },
        {
            question: "Is it secure?",
            answer: "We use industry-standard encryption and security measures to protect your data. We never store personal information and automatically delete all emails after 24 hours.",
            icon: "bi-lock"
        }
    ];
    
    let activeIndex = -1;
</script>

<section class="faq-section">
    <div class="faq-container">
        <h2 class="faq-title">Frequently Asked Questions</h2>
        <div class="faq-list">
            {#each faqs as faq, index}
                <div 
                    class="faq-item {activeIndex === index ? 'active' : ''}"
                    on:click={() => activeIndex = activeIndex === index ? -1 : index}
                >
                    <div class="faq-header">
                        <div class="faq-icon">
                            <i class="bi {faq.icon}"></i>
                        </div>
                        <h3 class="faq-question">{faq.question}</h3>
                        <div class="faq-arrow">
                            <i class="bi bi-chevron-down"></i>
                        </div>
                    </div>
                    <div class="faq-answer">
                        <p>{faq.answer}</p>
                    </div>
                </div>
            {/each}
        </div>
    </div>
</section>

<style>
    .faq-section {
        padding: 80px 0;
        background: var(--bg-page);
    }

    .faq-container {
        max-width: 800px;
        margin: 0 auto;
        padding: 0 24px;
    }

    .faq-title {
        text-align: center;
        margin-bottom: 48px;
        font-size: 32px;
        font-weight: 600;
        color: var(--text-primary);
    }

    .faq-list {
        display: flex;
        flex-direction: column;
        gap: 16px;
    }

    .faq-item {
        background: var(--bg-primary);
        border-radius: 12px;
        overflow: hidden;
        transition: all 0.3s ease;
        cursor: pointer;
    }

    .faq-header {
        display: flex;
        align-items: center;
        padding: 24px;
        gap: 16px;
    }

    .faq-icon {
        width: 40px;
        height: 40px;
        border-radius: 8px;
        background: var(--bg-hover);
        display: flex;
        align-items: center;
        justify-content: center;
        color: #0D6EFD;
    }

    .faq-question {
        flex: 1;
        font-size: 16px;
        font-weight: 500;
        color: var(--text-primary);
        margin: 0;
    }

    .faq-arrow {
        color: var(--text-muted);
        transition: transform 0.3s ease;
    }

    .faq-item.active .faq-arrow {
        transform: rotate(180deg);
    }

    .faq-answer {
        padding: 0 24px 24px 80px;
        color: var(--text-secondary);
        font-size: 14px;
        line-height: 1.6;
        max-height: 0;
        overflow: hidden;
        transition: all 0.3s ease;
    }

    .faq-item.active .faq-answer {
        max-height: 200px;
    }

    .faq-item:hover {
        transform: translateY(-2px);
        box-shadow: var(--shadow-md);
    }
</style> 