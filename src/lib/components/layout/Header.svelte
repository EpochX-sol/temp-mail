<script>
    import { themeStore } from '$lib/stores/themeStore';
    import ThemeToggle from './ThemeToggle.svelte';

    function scrollToFaq(e) {
        e.preventDefault();
        const faqSection = document.getElementById('faq');
        if (faqSection) {
            faqSection.scrollIntoView({ behavior: 'smooth' });
        }
    }
</script>

<header class="main-header">
    <div class="header-container">
        <div class="left-section">
            <!-- <a href="/" class="logo">
                <span class="logo-temp">TEMP</span><span class="logo-email">EMAIL</span>
            </a> -->
        </div>

        <nav class="main-nav">
            <a href="/" class="nav-link active">Home</a>
            <button class="nav-link" on:click={scrollToFaq}>FAQ</button>
            <a href="/api" class="nav-link">API</a>

            <a href="/contact" class="nav-link">Contact Us</a>
            <a href="/about" class="nav-link">About Us</a>
        </nav>

        <div class="right-section">
            <ThemeToggle />
        </div>
    </div>
</header>

<style>
    .main-header {
        background-color: #0b0c10; 
        height: 60px;
        width: 100%;
    }

    .header-container {
        height: 100%;
        max-width: 1440px;
        margin: 0 auto;
        padding: 0 24px;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .left-section {
        width: 200px;
        display: flex;
        align-items: center;
    }

    .logo {
        text-decoration: none;
        font-size: 18px;
        font-weight: bold;
        letter-spacing: 0.05em;
    }

    .logo-temp {
        color: #F31260;
    }

    .logo-email {
        color: white;
    }

    .main-nav {
        flex: 1;
        display: none;
        align-items: center;
        justify-content: center;
        gap: 24px;
    }

    @media (min-width: 768px) {
        .main-nav {
            display: flex;
        }
    }

    .nav-link {
        font-size: 14px;
        color: #9ca3af;
        text-decoration: none;
        padding: 6px 12px;
        border-radius: 6px;
        position: relative;
        height: 60px;
        display: flex;
        align-items: center;
        background: none;
        border: none;
        cursor: pointer;
    }

    .nav-link:hover {
        color: white;
    }

    .nav-link.active {
        color: white;
        &::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 2px;
            background-color: #009ef7;
        }
    }

    .right-section {
        width: 200px;
        display: flex;
        align-items: center;
        justify-content: flex-end;
    }
</style> 