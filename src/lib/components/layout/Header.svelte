<script> 
    import ThemeToggle from './ThemeToggle.svelte';
    import { onMount } from 'svelte';
    import { slide } from 'svelte/transition';
    import { page } from '$app/stores';

    let isMenuOpen = false;

    $: currentPath = $page.url.pathname;

    function toggleMenu() {
        isMenuOpen = !isMenuOpen;
    }

    function closeMenu() {
        isMenuOpen = false;
    }

    function handleClickOutside(event) {
        if (isMenuOpen && !event.target.closest('.mobile-menu') && !event.target.closest('.hamburger')) {
            isMenuOpen = false;
        }
    }

    onMount(() => {
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    });

    function scrollToFaq(e) {
        e.preventDefault();
        const faqSection = document.getElementById('faq');
        if (faqSection) {
            faqSection.scrollIntoView({ behavior: 'smooth' });
            closeMenu();
        }
    }

    function handleNavClick() {
        closeMenu();
    }
</script>

<header class="main-header">
    <div class="header-container">
        <div class="left-section">
            <a href="/" class="logo" on:click={handleNavClick}>
                <span class="logo-temp">TEMP</span><span class="logo-email">EMAIL</span>
            </a>
        </div>

        <nav class="main-nav desktop-nav">
            <a href="/" class="nav-link" class:active={currentPath === '/'}>Home</a>
            <button class="nav-link" on:click={scrollToFaq}>FAQ</button>
            <a href="/api" class="nav-link" class:active={currentPath === '/api'}>API</a>
            <a href="/contact" class="nav-link" class:active={currentPath === '/contact'}>Contact Us</a>
            <a href="/about" class="nav-link" class:active={currentPath === '/about'}>About Us</a>
        </nav>

        <div class="right-section">
            <ThemeToggle />
            <button 
                class="hamburger" 
                on:click={toggleMenu} 
                aria-label="Toggle menu"
                class:active={isMenuOpen}
            >
                <i class="bi {isMenuOpen ? 'bi-x-lg' : 'bi-list'}"></i>
            </button>
        </div>
    </div>

    {#if isMenuOpen}
        <nav class="mobile-menu" transition:slide>
            <ul>
                <li><a href="/" class="mobile-link" on:click={handleNavClick}>Home</a></li> 
                <li><button class="mobile-link" on:click={scrollToFaq}>FAQ</button></li>
                <li><a href="/api" class="mobile-link" on:click={handleNavClick}>API</a></li>
                <li><a href="/contact" class="mobile-link" on:click={handleNavClick}>Contact Us</a></li>
                <li><a href="/about" class="mobile-link" on:click={handleNavClick}>About Us</a></li>
            </ul>
        </nav>
    {/if}
</header>

<style>
    .main-header {
        background-color: #0b0c10; 
        height: 60px;
        width: 100%; 
        top: 0;
        left: 0;
        z-index: 100;
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
        flex: 0 0 auto;
        display: flex;
        align-items: center;
    }

    .logo {
        text-decoration: none;
        font-size: 18px;
        font-weight: bold;
        letter-spacing: 0.05em;
        display: flex;
        align-items: center;
        gap: 2px;
    }

    .logo-temp {
        color: #0084ff;
    }

    .logo-email {
        color: white;
    }

    .main-nav {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 24px;
    }

    .desktop-nav {
        display: flex;
    }

    @media (max-width: 768px) {
        .desktop-nav {
            display: none;
        }

        .main-nav {
            display: none;
        }
    }

    .nav-link {
        font-size: 14px;
        color: #9ca3af;
        text-decoration: none;
        padding: 0 12px;
        border-radius: 6px;
        position: relative;
        height: 60px;
        display: flex;
        align-items: center;
        background: none;
        border: none;
        cursor: pointer;
        transition: color 0.2s ease;
    }

    .nav-link:hover {
        color: white;
    }

    .nav-link.active {
        color: white;
    }

    .nav-link::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 2px;
        background-color: #009ef7;
        transform: scaleX(0);
        transition: transform 0.2s ease;
    }

    .nav-link:hover::after {
        transform: scaleX(1);
    }

    .nav-link.active::after {
        transform: scaleX(1);
    }

    .right-section {
        flex: 0 0 auto;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 16px;
    }

    .hamburger {
        background: none;
        border: none;
        color: #9ca3af;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 4px;
        border-radius: 4px;
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        display: none;
    }

    @media (max-width: 768px) {
        .hamburger {
            display: flex;
        }
    }

    .hamburger:hover,
    .hamburger.active {
        color: white;
        background: rgba(255, 255, 255, 0.1);
    }

    .hamburger i {
        transition: transform 0.2s ease;
    }

    .hamburger.active i {
        transform: rotate(90deg);
    }

    .mobile-menu {
        display: flex;
        flex-direction: column;
        background-color: #0b0c10;
        position: absolute;
        top: 60px;
        left: 0;
        right: 0;
        padding: 16px;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2);
        z-index: 50;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    .mobile-menu ul {
        list-style: none;
        padding: 0;
        margin: 0;
        width: 100%;
        max-width: 1440px;
        margin: 0 auto;
    }

    .mobile-menu li {
        border-bottom: 1px solid rgba(156, 163, 175, 0.1);
        &:last-child {
            border-bottom: none;
        }
    }

    .mobile-link {
        display: block;
        color: #9ca3af;
        text-decoration: none;
        font-size: 0.95rem;
        padding: 12px 16px;
        width: 100%;
        text-align: left;
        background: none;
        border: none;
        cursor: pointer;
        transition: all 0.2s ease;
        &:hover {
            color: white;
            background: rgba(255, 255, 255, 0.05);
        }
    }
</style> 