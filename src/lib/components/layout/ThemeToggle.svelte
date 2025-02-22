<script>
    import { themeStore } from '$lib/stores/themeStore';
    import { onMount } from 'svelte';

    onMount(() => { 
        document.documentElement.classList.toggle('dark', $themeStore === 'dark');
    });
</script>

<button 
    class="theme-toggle" 
    on:click={() => themeStore.toggleTheme()}
    aria-label="Toggle theme"
>
    {#if $themeStore === 'dark'}
        <i class="bi bi-sun-fill"></i>
    {:else}
        <i class="bi bi-moon-fill"></i>
    {/if}
</button>

<style>
    .theme-toggle {
        background: none;
        border: none;
        color: var(--text-muted);
        font-size: 20px;
        cursor: pointer;
        padding: 8px;
        border-radius: 6px;
        transition: all 0.2s ease;
    }

 

    :global(.dark) .theme-toggle {
        color: #9ca3af;
    }

    :global(.dark) .theme-toggle:hover {
        color: white;
    }
</style> 