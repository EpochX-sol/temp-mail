<script>
    import { FOOTER_CONFIG } from '$lib/utils/constants'; 

    const currentYear = new Date().getFullYear();
</script>

<footer class="footer">
    <div class="container">
        <div class="footer-content">
            <div class="footer-brand">
                <a href="/" class="logo">
                    <i class="bi bi-envelope-paper-fill"></i>
                    <span>Temp Mail</span>
                </a>
                <p class="footer-description">
                    Your privacy is our priority. We provide temporary email services to keep you safe from spam.
                </p> 
            </div>

            <div class="footer-links">
                <div class="link-group">
                    <h3>Product</h3>
                    <ul>
                        {#each FOOTER_CONFIG.product as link}
                            <li>
                                <a href={link.href}>{link.name}</a>
                            </li>
                        {/each}
                    </ul>
                </div>

                <div class="link-group">
                    <h3>Support</h3>
                    <ul>
                        {#each FOOTER_CONFIG.support as link}
                            <li>
                                <a href={link.href}>{link.name}</a>
                            </li>
                        {/each}
                    </ul>
                </div>

                <div class="link-group">
                    <h3>Legal</h3>
                    <ul>
                        <li><a href="/privacy">Privacy Policy</a></li>
                        <li><a href="/terms">Terms & Conditions</a></li>
                    </ul>
                </div>
            </div>
        </div>

        <div class="footer-bottom">
            <p class="copyright">
                © {currentYear} Temp Email. All rights reserved.
            </p>
        </div>
    </div>
</footer>

<style>
    .footer {
        background: var(--bg-primary);
        color: var(--text-secondary);
        padding: 40px 0;
        border-top: 1px solid var(--border-color);
    }

    .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 20px;
    }

    .footer-content {
        display: grid;
        grid-template-columns: 1fr 2fr;
        gap: 30px;
    }

    .footer-brand {
        display: flex;
        flex-direction: column;
    }

    .logo {
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 1.2rem;
        font-weight: 600;
        color: var(--text-primary);
        text-decoration: none;
        margin-bottom: 15px;
    }

    .logo i {
        color: var(--primary);
        font-size: 1.5rem;
    }

    .footer-description {
        font-size: 0.9rem;
        line-height: 1.6;
        margin-bottom: 20px;
    }

    .social-links {
        display: flex;
        gap: 10px;
    }

    .social-link {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background: var(--bg-secondary);
        color: var(--text-secondary);
        transition: all 0.2s ease;
        font-size: 1rem;
    }

    .social-link:hover {
        background: var(--primary);
        color: white;
        transform: translateY(-2px);
    }

    .footer-links {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 20px;
    }

    .link-group h3 {
        font-size: 1rem;
        font-weight: 600;
        color: var(--text-primary);
        margin-bottom: 15px;
    }

    .link-group ul {
        list-style: none;
        padding: 0;
        margin: 0;
    }

    .link-group li {
        margin-bottom: 8px;
    }

    .link-group a {
        color: var(--text-secondary);
        text-decoration: none;
        font-size: 0.9rem;
        transition: color 0.2s ease;
        display: block;
    }

    .link-group a:hover {
        color: var(--primary);
    }

    .footer-bottom {
        margin-top: 40px;
        padding-top: 20px;
        border-top: 1px solid var(--border-color);
        text-align: center;
    }

    .copyright {
        font-size: 0.8rem;
    }

    @media (max-width: 768px) {
        .footer {
            padding: 20px 0;
        }

        .container {
            padding: 0 10px;
        }

        .footer-content {
            grid-template-columns: 1fr;
            gap: 20px;
        }

        .footer-brand {
            margin-bottom: 20px;
        }

        .logo {
            font-size: 1rem;
            margin-bottom: 10px;
        }

        .logo i {
            font-size: 1.2rem;
        }

        .footer-description {
            font-size: 0.8rem;
            margin-bottom: 15px;
        }

        .social-links {
            gap: 5px;
        }

        .social-link {
            width: 28px;
            height: 28px;
            font-size: 0.9rem;
        }

        .footer-links {
            grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
            gap: 10px;
        }

        .link-group h3 {
            font-size: 0.9rem;
            margin-bottom: 10px;
        }

        .link-group li {
            margin-bottom: 5px;
        }

        .link-group a {
            font-size: 0.8rem;
        }

        .footer-bottom {
            margin-top: 20px;
            padding-top: 10px;
        }

        .copyright {
            font-size: 0.7rem;
        }
    }
</style>