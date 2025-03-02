<script>
    import { onMount } from 'svelte';
    import { themeStore } from '$lib/stores/themeStore';
    import Header from '$lib/components/layout/Header.svelte';
    import { browser } from '$app/environment';
    import '../app.css';
    import Footer from '$lib/components/layout/Footer.svelte';
    import { page } from '$app/stores';
    
    let lastScrollY = 0;
    let headerVisible = true;
    let loading = true;
    let mounted = false;
    
    onMount(() => {
        mounted = true;
        if (browser) {
            const savedTheme = localStorage.getItem('theme');
            const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            themeStore.setTheme(savedTheme || systemTheme);
            
            setTimeout(() => {
                loading = false;
                document.documentElement.classList.add('transitions-enabled');
            }, 1);
        }
        
        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            headerVisible = lastScrollY > currentScrollY || currentScrollY < 50;
            lastScrollY = currentScrollY;
        });
        
        document.documentElement.classList.add($themeStore);
    });
    
    $: if (mounted && browser) {
        document.documentElement.setAttribute('data-theme', $themeStore);
    }
</script>

<div class="app-container" class:loading={loading} class:loaded={!loading} data-theme={$themeStore}>
    <div class="app-layout">
        {#if !($page.url.pathname.startsWith('/message/'))}
            <Header />
        {/if}
        <main class="main-content">
            <div class="content-container">
                <slot />
            </div>
        </main>
        {#if !($page.url.pathname.startsWith('/message/'))}
            <Footer />
        {/if}
    </div>
    <div class="loading-screen"></div>
</div>

<style>
    .app-container {
        width: 100%;
        height: 100%;
        position: relative;
    }
    
    .loading-screen {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #0b0c10;
        z-index: 9999;
    }
     
    .loaded .loading-screen {
        display: none;
    }
     
    .loading .app-layout {
        visibility: hidden;
    }
    
    .main-content {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        background-color: var(--bg-page);
    }
    
    .content-container {
        flex: 1;
        width: 100%;
        height: 100%;
    }
    
    :global(body) {
        margin: 0;
        padding: 0;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
                    'Helvetica Neue', Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        background-color: var(--bg-page);
    }
</style>

<svelte:head>
    <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
</svelte:head>