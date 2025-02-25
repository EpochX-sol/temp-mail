<script>
    export let data; 
    const ABOUT_PAGE_CONFIG = data.about;
    import SEO from '$lib/components/common/SEO.svelte';
</script>

<SEO page="ABOUT" />

<div class="about-page">
    <header class="about-header">
        <div class="header-content">
            <h1>{ABOUT_PAGE_CONFIG.HEADER.TITLE}</h1>
            <p class="mission">{ABOUT_PAGE_CONFIG.HEADER.MISSION}</p>
        </div>
    </header>

    <main class="about-content">
        <section class="story-section">
            <h2>{ABOUT_PAGE_CONFIG.STORY.TITLE}</h2>
            {#each ABOUT_PAGE_CONFIG.STORY.PARAGRAPHS as paragraph}
                <p>{paragraph}</p>
            {/each}
        </section>

        <section class="values-section">
            <h2>Our Values</h2>
            <div class="values-grid">
                {#each ABOUT_PAGE_CONFIG.FEATURES as feature}
                    <div class="value-card">
                        <i class="bi {feature.icon}"></i>
                        <h3>{feature.title}</h3>
                        <p>{feature.description}</p>
                    </div>
                {/each}
            </div>
        </section>

        <section class="testimonials-section">
            <h2>User Testimonials</h2>
            <div class="testimonials-grid">
                {#each ABOUT_PAGE_CONFIG.TESTIMONIALS as testimonial}
                    <div class="testimonial-card">
                        <p>"{testimonial.feedback}"</p>
                        <p class="testimonial-name">- {testimonial.name}</p>
                    </div>
                {/each}
            </div>
        </section>
    </main>
</div>

<style>
    :root {
        --bg-page: #f9f9f9;
        --bg-primary: #ffffff;
        --border-color: #e0e0e0;
        --text-primary: #333;
        --text-secondary: #666;
        --highlight-color: #0D6EFD;
    }

    .about-page {
        min-height: 100vh;
        background: var(--bg-page);
        font-family: var(--font-family);
        color: var(--text-primary);
    }

    .about-header {
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

    .mission {
        color: var(--text-secondary);
        font-size: 1.1rem;
        margin-top: 12px;
    }

    .about-content {
        max-width: 800px;
        margin: 0 auto;
        padding: 40px 20px;
    }

    .story-section, .values-section, .testimonials-section {
        margin-bottom: 40px;
    }

    h2 {
        color: var(--text-primary);
        border-bottom: 2px solid var(--border-color);
        font-size: 2rem;
        margin-bottom: 20px;
        padding-bottom: 10px;
    }

    .story-section p {
        color: var(--text-secondary);
        line-height: 1.6;
        margin-bottom: 20px;
    }

    .values-grid, .testimonials-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 20px;
    }

    .value-card, .testimonial-card {
        background: var(--bg-primary);
        border: 1px solid var(--border-color);
        border-radius: 8px;
        padding: 20px;
        text-align: center;
        transition: transform 0.2s;
        box-shadow: var(--shadow-sm);
    }

    .value-card:hover, .testimonial-card:hover {
        transform: translateY(-5px);
        box-shadow: var(--shadow-md);
    }

    .value-card i {
        color: var(--icon-color);
        font-size: 2rem;
        margin-bottom: 10px;
    }

    .testimonial-card p {
        color: var(--text-secondary);
        font-style: italic;
    }

    .testimonial-name {
        color: var(--text-primary);
        font-weight: bold;
        margin-top: 10px;
    }

    @media (max-width: 768px) {
        .about-header {
            padding: 40px 0;
        }

        .header-content h1 {
            font-size: 2rem;
        }

        .about-content {
            padding: 20px;
        }

        h2 {
            font-size: 1.5rem;
        }
    }
</style>