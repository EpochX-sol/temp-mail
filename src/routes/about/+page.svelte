<script>
    const features = [
        {
            icon: "bi-shield-check",
            title: "Privacy First",
            description: "We prioritize your privacy with end-to-end encryption and a zero-log policy."
        },
        {
            icon: "bi-lightning",
            title: "Lightning Fast",
            description: "Instant email generation and real-time message delivery."
        },
        {
            icon: "bi-gear",
            title: "Advanced Features",
            description: "Custom domains, API access, and enterprise solutions."
        },
        {
            icon: "bi-person-check",
            title: "User-Centric Design",
            description: "Intuitive interface designed for seamless user experience."
        }
    ];

    const testimonials = [
        {
            name: "Emily Carter",
            feedback: "Temp email has transformed the way I manage my emails. I feel secure and in control!"
        },
        {
            name: "Michael Brown",
            feedback: "The service is incredibly fast and reliable. I love the privacy features!"
        },
        {
            name: "Sarah Johnson",
            feedback: "Finally, a solution that respects my privacy. Highly recommend Temp email!"
        }
    ];
</script>

<div class="about-page">
    <header class="about-header">
        <div class="header-content">
            <h1>About Temp Emails</h1>
            <p class="mission">Protecting your privacy in the digital age.</p>
        </div>
    </header>

    <main class="about-content">
        <section class="story-section">
            <h2>Our Story</h2>
            <p>Temp mail emerged from a vision to empower individuals with the tools they need to protect their privacy online. In a world where personal information is often exploited, we believe that everyone deserves a safe space to communicate without fear of surveillance or data breaches.</p>
            <p>Our journey began with a simple idea: to create a temporary email service that not only provides anonymity but also ensures that users have complete control over their digital footprint. We understand the challenges of navigating the online landscape, and our mission is to simplify that experience while prioritizing user privacy.</p>
            <p>At Inboxes, we are committed to innovation and excellence. Our team of dedicated professionals works tirelessly to enhance our platform, ensuring that it remains user-friendly, secure, and efficient. We envision a future where privacy is a fundamental right, and we are proud to lead the charge in making that a reality.</p>
        </section>

        <section class="values-section">
            <h2>Our Values</h2>
            <div class="values-grid">
                {#each features as feature}
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
                {#each testimonials as testimonial}
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
        font-family: 'Arial', sans-serif;
        color: var(--text-primary);  
    }

    .about-header {
        background: var(--bg-primary); 
        padding-top: 40px;
        text-align: center; 
    }

    .header-content h1 {
        font-size: 2.5rem;
        margin: 0;
        color: var(--highlight-color);
    }

    .mission {
        font-size: 1.2rem;
        color: var(--text-secondary);
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
        font-size: 2rem;
        color: var(--highlight-color);
        margin-bottom: 20px;
        border-bottom: 2px solid var(--highlight-color);
        padding-bottom: 10px;
    }

    p {
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
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }

    .value-card:hover, .testimonial-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    }

    .value-card i {
        font-size: 2rem;
        color: var(--highlight-color);
        margin-bottom: 10px;
    }

    .testimonial-card p {
        font-style: italic;
        color: var(--text-secondary);
    }

    .testimonial-name {
        font-weight: bold;
        margin-top: 10px;
        color: var(--text-primary);
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