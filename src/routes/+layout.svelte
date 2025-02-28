<script>
    import { onMount } from 'svelte';
    import { apiService } from '$lib/services/api';
    import { themeStore } from '$lib/stores/themeStore';
    import { emailStore } from '$lib/stores/emailStore';
    import Header from '$lib/components/layout/Header.svelte';
    import { browser } from '$app/environment'; 
    import '../app.css';
    import Footer from '$lib/components/layout/Footer.svelte';
    import { page } from '$app/stores'; 

    let lastScrollY = 0;
    let headerVisible = true;
    let isLoading = true;
    let mounted = false;

    async function loadDomains() {
        try {
            const response = await apiService.getDomains();
            if (response.code === 200 && response.domains) {
                localStorage.setItem('domains', JSON.stringify(response.domains));
                localStorage.setItem('domains_timestamp', Date.now().toString());
            }
        } catch (error) {
            console.error('Failed to fetch domains:', error);
        }
    }

    onMount(async () => {
        mounted = true;
        if (browser) {
            const savedTheme = localStorage.getItem('theme');
            const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            themeStore.setTheme(savedTheme || systemTheme);
             
            setTimeout(() => {
                isLoading = false;
                document.documentElement.classList.add('transitions-enabled');
            }, 500);

            await loadDomains();
        }

        const storedEmail = localStorage.getItem('currentEmail');
        if (storedEmail) {
            emailStore.setCurrentEmail(storedEmail);
        }

        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            headerVisible = lastScrollY > currentScrollY || currentScrollY < 50;
            lastScrollY = currentScrollY;
        });
 
        const theme = $themeStore;
        document.documentElement.classList.add(theme);
    });

    $: if (mounted && browser) {
        document.documentElement.setAttribute('data-theme', $themeStore);
    }
</script>
 

{#if isLoading}
    <div class="initial-loading"> 
    </div>
{:else}
    <div class="app-layout" data-theme={$themeStore}>
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
{/if}

<style>
    .main-content {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        background-color: var(--bg-page);
    }
 
    .content-container {
        flex: 1;
        width: 100%;
    }

    .content-container {
        height: 100%;
        width: 100%;
    }

    .initial-loading {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: var(--bg-page);
        z-index: 9999;
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