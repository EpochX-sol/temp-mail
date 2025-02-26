<script>
    import { warningStore } from '$lib/stores/warningStore';
    import { fade } from 'svelte/transition';

    let timeoutId;

    $: if ($warningStore.show) {
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            warningStore.set({ show: false, message: '', type: '' });
        }, 5000);
    }
</script>

{#if $warningStore.show}
    <div 
        class="warning-container" 
        class:warning={$warningStore.type === 'warning'}
        transition:fade
    >
        <i class="bi bi-exclamation-triangle"></i>
        <span>{$warningStore.message}</span>
    </div>
{/if}

<style>
    .warning-container {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 1000;
        padding: 16px 24px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        gap: 12px;
        background: var(--bg-warning);
        color: var(--warning);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        font-weight: 500;
    }

    .warning-container i {
        font-size: 1.2em;
    }

    @media (max-width: 768px) {
        .warning-container {
            left: 20px;
            right: 20px;
            text-align: center;
            justify-content: center;
        }
    }
</style> 