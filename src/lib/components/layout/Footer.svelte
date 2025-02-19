<script>
    const currentYear = new Date().getFullYear();
</script>

<footer class="footer">
    <div class="footer-content">
        <div class="footer-brand"> 
            <p class="description">
                Inboxes is a free temporary email service. Use our inboxes to get a disposable email and protect your real email from spam.
            </p>
        </div>

        <div class="footer-links">
            <div class="footer-section">
                <h4>HELP & SUPPORT</h4>
                <ul>
                    <li><a href="/faq">FAQ</a></li>
                    <li><a href="/api">API</a></li>
                    <li><a href="/contact">Contact Us</a></li>
                </ul>
            </div>

            <div class="footer-section">
                <h4>FOLLOW US</h4>
                <ul>
                    <li><a href="/blog">Blog</a></li>
                </ul>
            </div>

            <div class="footer-section">
                <h4>LEGAL</h4>
                <ul>
                    <li><a href="/terms">Terms & Conditions</a></li>
                    <li><a href="/privacy">Privacy Policy</a></li>
                </ul>
            </div>
        </div>
    </div>
    <div class="footer-bottom">
        <p>© {currentYear} Inboxes™ All Rights Reserved.</p>
    </div>
</footer>

<style>
    .footer {
        background: var(--kt-gray-100);
        padding: 4rem 0 1rem;
        margin-top: 4rem;
    }

    .footer-content {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 2rem;
        display: grid;
        grid-template-columns: 1fr 2fr;
        gap: 4rem;
    }

    .footer-brand .logo {
        margin-bottom: 1rem;
    }

    .footer-brand .logo img {
        height: 40px;
    }

    .footer-brand .description {
        color: var(--kt-text-muted);
        line-height: 1.6;
    }

    .footer-links {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 2rem;
    }

    .footer-section h4 {
        color: var(--kt-text-primary);
        margin-bottom: 1rem;
        font-size: 0.9rem;
        font-weight: 600;
    }

    .footer-section ul {
        list-style: none;
        padding: 0;
        margin: 0;
    }

    .footer-section ul li {
        margin-bottom: 0.5rem;
    }

    .footer-section ul li a {
        color: var(--kt-text-muted);
        text-decoration: none;
        transition: color 0.3s;
    }

    .footer-section ul li a:hover {
        color: var(--kt-primary);
    }

    .footer-bottom {
        text-align: center;
        padding-top: 2rem;
        margin-top: 2rem;
        border-top: 1px solid var(--kt-border-color);
    }

    .footer-bottom p {
        color: var(--kt-text-muted);
        font-size: 0.9rem;
    }

    @media (max-width: 768px) {
        .footer-content {
            grid-template-columns: 1fr;
            gap: 2rem;
        }

        .footer-links {
            grid-template-columns: 1fr;
        }
    }
</style> 