<!-- @ts-ignore -->
<script>
    import { onMount } from 'svelte';
    import { themeStore } from '$lib/stores/themeStore';
    import { emailStore } from '$lib/stores/emailStore';
    import Header from '$lib/components/layout/Header.svelte';
    import { browser } from '$app/environment'; 
    import '../app.css';
    import Footer from '$lib/components/layout/Footer.svelte';
    let lastScrollY = 0;
    let headerVisible = true;
    let isLoading = true;

    onMount(() => {
        if (browser) {
            const storedTheme = localStorage.getItem('theme');
            if (storedTheme) {
                themeStore.setTheme(storedTheme);
            }
            
            // Set loading to false after theme is applied
            setTimeout(() => {
                isLoading = false;
            }, 0);
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

        // Ensure theme is applied on initial load
        const theme = $themeStore;
        document.documentElement.classList.add(theme);
    });
</script>

{#if isLoading}
    <div class="initial-loading"> 
    </div>
{:else}
    <div class="app-wrapper">
        <div class="header-wrapper" class:hidden={!headerVisible}>
            <Header />
        </div>
        
        <main class="content-wrapper">
            <div class="content-container">
                <slot />
            </div>
        </main>
        <Footer />
    </div>
{/if}

<style>
    .app-wrapper {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        background-color: var(--bg-page);
    }
 

    .content-wrapper {
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