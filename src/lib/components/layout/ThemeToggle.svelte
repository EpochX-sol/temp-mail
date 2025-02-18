<script>
    import { themeStore } from '$lib/stores/themeStore';
</script>

<button class="theme-toggle" on:click={() => themeStore.toggleTheme()}>
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
        color: #9ca3af;
        font-size: 20px;
        cursor: pointer;
        padding: 4px;
        transition: color 0.2s;
    }

    .theme-toggle:hover {
        color: white;
    }
</style> 