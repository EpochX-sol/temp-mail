<script>
    import { onMount } from 'svelte';
    import { themeStore } from '$lib/stores/themeStore';
    import Header from '$lib/components/layout/Header.svelte';
    import { browser } from '$app/environment';
    import '../app.css';

    let lastScrollY = 0;
    let headerVisible = true;

    onMount(() => {
        if (browser) {
            themeStore.setTheme($themeStore);
            
            window.addEventListener('scroll', () => {
                const currentScrollY = window.scrollY;
                headerVisible = lastScrollY > currentScrollY || currentScrollY < 50;
                lastScrollY = currentScrollY;
            });
        }
    });
</script>

<div class="app-wrapper">
    <div class="header-wrapper" class:hidden={!headerVisible}>
        <Header />
    </div>
    
    <main class="content-wrapper">
        <div class="content-container">
            <slot />
        </div>
    </main>
</div>

<style>
    .app-wrapper {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        background-color: #f8f9fa;
    }
 

    .content-wrapper {
        flex: 1;
        width: 100%;
    }

    .content-container {
        height: 100%;
        width: 100%;
    }

    :global(body) {
        margin: 0;
        padding: 0;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 
                     'Helvetica Neue', Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }
</style> 