<script>
    const currentYear = new Date().getFullYear();

    const footerLinks = {
        product: [ 
            { name: 'Security', href: '#security' },
            { name: 'FAQ', href: '#faq' },
            { name: 'API', href: '/api' }
        ],
        support: [
            { name: 'Help Center', href: '#faq' },
            { name: 'Contact Us', href: '/contact' }, 
        ],
        social: [
            { name: 'Twitter', href: 'https://twitter.com', icon: 'bi-twitter-x' },
            { name: 'GitHub', href: 'https://github.com', icon: 'bi-github' },
            { name: 'Discord', href: 'https://discord.com', icon: 'bi-discord' },
        ]
    };
</script>

<footer class="footer">
    <div class="footer-content">
        <div class="footer-main">
            <div class="logo">
                <i class="bi bi-envelope-paper-fill"></i>
                <span>Temp Mail</span>
            </div>
            <p class="tagline">
                Secure, instant temporary email service for your privacy needs.
            </p>
        </div>

        <div class="footer-links">
            <div class="link-group">
                <h3>Product</h3>
                <ul>
                    {#each footerLinks.product as link}
                        <li>
                            <a href={link.href}>{link.name}</a>
                        </li>
                    {/each}
                </ul>
            </div>

            <div class="link-group">
                <h3>Support</h3>
                <ul>
                    {#each footerLinks.support as link}
                        <li>
                            <a href={link.href}>{link.name}</a>
                        </li>
                    {/each}
                </ul>
            </div>

            <div class="link-group">
                <h3>Connect</h3>
                <div class="social-links">
                    {#each footerLinks.social as link}
                        <a href={link.href} target="_blank" rel="noopener noreferrer" class="social-link">
                            <i class="bi {link.icon}"></i>
                        </a>
                    {/each}
                </div>
            </div>
        </div>
    </div>

    <div class="footer-bottom">
        <div class="footer-bottom-content">
            <p class="copyright">
                © {currentYear} Temp Email. All rights reserved.
            </p>
            <div class="legal-links">
                <a href="/privacy">Privacy Policy</a> 
            </div>
        </div>
    </div>
</footer>

<style>
    .footer {
        background: var(--bg-primary);
        border-top: 1px solid var(--border-color);
        padding-top: 48px;
    }

    .footer-content {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 24px;
        display: flex;
        flex-wrap: wrap;
        gap: 48px;
    }

    .footer-main {
        flex: 1;
        min-width: 300px;
        display: flex;
        flex-direction: column;
        gap: 24px;
    }

    .logo {
        display: flex;
        align-items: center;
        gap: 12px;
        font-size: 1.5rem;
        font-weight: 700;
        color: var(--text-primary);
    }

    .logo i {
        color: var(--primary);
        font-size: 1.8rem;
    }

    .tagline {
        color: var(--text-secondary);
        font-size: 1.1rem;
        line-height: 1.6;
        margin: 0;
    }

    .footer-links {
        display: flex;
        flex-wrap: wrap;
        gap: 64px;
    }

    .link-group {
        min-width: 160px;
    }

    .link-group h3 {
        color: var(--text-primary);
        font-size: 1.1rem;
        font-weight: 600;
        margin: 0 0 24px;
    }

    .link-group ul {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        flex-direction: column;
        gap: 12px;
    }

    .link-group a {
        color: var(--text-secondary);
        text-decoration: none;
        transition: color 0.2s ease;
    }

    .link-group a:hover {
        color: var(--primary);
    }

    .social-links {
        display: flex;
        gap: 12px;
        margin-top: 8px;
    }

    .social-link {
        width: 36px;
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 8px;
        background: var(--bg-secondary);
        color: var(--text-secondary);
        transition: all 0.2s ease;
    }

    .social-link:hover {
        background: var(--primary);
        color: white;
        transform: translateY(-2px);
    }

    .footer-bottom {
        margin-top: 48px;
        border-top: 1px solid var(--border-color);
        padding: 24px 0;
    }

    .footer-bottom-content {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 24px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .copyright {
        color: var(--text-secondary);
        font-size: 0.9rem;
        margin: 0;
    }

    .legal-links {
        display: flex;
        align-items: center;
        gap: 16px;
    }

    .legal-links a {
        color: var(--text-secondary);
        text-decoration: none;
        font-size: 0.9rem;
        transition: color 0.2s ease;
    }

    .legal-links a:hover {
        color: var(--primary);
    }

    .separator {
        color: var(--text-muted);
    }

    @media (max-width: 768px) {
        .footer-content {
            flex-direction: column;
            gap: 40px;
        }

        .footer-links {
            gap: 40px;
        }

        .footer-bottom-content {
            flex-direction: column;
            gap: 16px;
            text-align: center;
        }
    }
</style> 