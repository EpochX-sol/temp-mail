<script>
    import { UI_CONFIG } from '$lib/utils/constants';

    const features = UI_CONFIG.FEATURES;
</script>

<section class="features-section">
    <div class="features-container">
        <div class="features-header">
            <span class="features-tag">{features[0].description}</span>
            <h2 class="features-title">
                {features[0].title}
                <span class="highlight">{features[0].subtitle}</span>
            </h2>
        </div>

        <div class="features-grid">
            {#each features[0].items as feature}
                <div class="feature-card">
                    <div class="feature-icon">
                        <i class="bi {feature.icon}"></i>
                    </div>
                    <h3 class="feature-title">{feature.title}</h3>
                    <p class="feature-description">{feature.description}</p>
                </div>
            {/each}
        </div>
    </div>
</section>

<style>
    .features-section {
        padding: 80px 0;
        background: linear-gradient(180deg, var(--bg-page) 0%, var(--bg-secondary) 100%);
    }

    .features-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 24px;
    }

    .features-header {
        text-align: center;
        margin-bottom: 64px;
    }

    .features-tag {
        display: inline-block;
        padding: 8px 16px;
        background: rgba(59, 130, 246, 0.1);
        color: var(--primary);
        border-radius: 20px;
        font-size: 0.875rem;
        font-weight: 500;
        margin-bottom: 16px;
    }

    .features-title {
        font-size: 2.5rem;
        font-weight: 800;
        color: var(--text-primary);
        margin: 0;
        line-height: 1.2;
        display: flex;
        flex-direction: column;
        gap: 8px;
        align-items: center;
    }

    .highlight {
        color: var(--primary);
    }

    .features-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 32px;
    }

    .feature-card {
        background: var(--bg-primary);
        border-radius: 24px;
        padding: 32px;
        text-align: center;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .feature-card:hover {
        transform: translateY(-8px);
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    }

    .feature-icon {
        width: 64px;
        height: 64px;
        background: var(--primary);
        border-radius: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 24px;
    }

    .feature-icon i {
        font-size: 28px;
        color: white;
    }

    .feature-title {
        font-size: 1.25rem;
        font-weight: 600;
        color: var(--text-primary);
        margin: 0 0 16px;
    }

    .feature-description {
        color: var(--text-secondary);
        line-height: 1.6;
        margin: 0;
        font-size: 1rem;
    }

    @media (max-width: 968px) {
        .features-grid {
            grid-template-columns: repeat(2, 1fr);
        }
    }

    @media (max-width: 640px) {
        .features-grid {
            grid-template-columns: 1fr;
        }

        .features-title {
            font-size: 2rem;
        }

        .features-section {
            padding: 60px 0;
        }
    }
</style> 