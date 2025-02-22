<script>
    import { UI_CONFIG } from '$lib/utils/constants'; 

    const faqs = UI_CONFIG.FAQS; 
</script>

<section class="faq-section" >
    <h2 class="section-title" id="faq">Frequently Asked Questions</h2>
    <div class="faq-list">
        {#each faqs as faq}
            <div class="faq-item" >
                <div class="faq-icon">
                    <i class="bi {faq.icon}"></i>
                </div>
                <div class="faq-content">
                    <h3 class="faq-question">{faq.question}</h3>
                    <p class="faq-answer">{faq.answer}</p>
                </div>
            </div>
        {/each}
    </div>
</section>

<style>
    .faq-section {
        padding: 100px 0;
        background: var(--bg-page);
        scroll-margin-top: 100px;
    }

    .section-title {
        color: var(--text-primary);
        font-size: 2.5rem;
        font-weight: 700;
        margin-bottom: 4rem;
        text-align: center;
        letter-spacing: -0.5px;
    }

    .faq-list {
        max-width: 1000px;
        margin: 0 auto;
        padding: 0 24px;
        display: grid;
        gap: 48px;
    }

    .faq-item {
        display: flex;
        gap: 24px;
        padding: 32px;
        background: var(--bg-primary);
        border-radius: 24px;
        transition: transform 0.3s ease;
    }

    .faq-item:hover {
        transform: translateY(-4px);
    }

    .faq-icon {
        flex-shrink: 0;
        width: 56px;
        height: 56px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--primary);
        border-radius: 16px;
    }

    .faq-icon i {
        font-size: 24px;
        color: white;
    }

    .faq-content {
        flex: 1;
    }

    .faq-question {
        font-size: 1.4rem;
        font-weight: 600;
        color: var(--text-primary);
        margin-bottom: 12px;
        line-height: 1.4;
    }

    .faq-answer {
        color: var(--text-secondary);
        font-size: 1.1rem;
        line-height: 1.6;
        margin: 0;
    }

    @media (max-width: 768px) {
        .faq-section {
            padding: 60px 0;
        }

        .section-title {
            font-size: 2rem;
            margin-bottom: 2.5rem;
        }

        .faq-list {
            gap: 24px;
        }

        .faq-item {
            padding: 24px;
        }

        .faq-icon {
            width: 48px;
            height: 48px;
        }

        .faq-question {
            font-size: 1.2rem;
        }

        .faq-answer {
            font-size: 1rem;
        }
    }
</style> 