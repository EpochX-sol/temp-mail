<script>
    import { fade, scale } from 'svelte/transition';
    export let show = false;
    export let title = '';
    export let onClose = () => {};

    function handleBackdropClick(e) {
        if (e.target === e.currentTarget) {
            onClose();
        }
    }
</script>

{#if show}
    <div 
        class="modal-backdrop" 
        on:click={handleBackdropClick}
        transition:fade={{ duration: 200 }}
    >
        <div 
            class="modal-content"
            transition:scale={{ duration: 200, start: 0.95 }}
        >
            <div class="modal-header">
                <h2>{title}</h2>
                <button class="close-btn" on:click={onClose}>
                    <i class="bi bi-x-lg"></i>
                </button>
            </div>
            <div class="modal-body">
                <slot />
            </div>
        </div>
    </div>
{/if}

<style>
    .modal-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(4px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    }

    .modal-content {
        background: var(--bg-primary);
        border-radius: 16px;
        width: 90%;
        max-width: 700px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
        border: 1px solid var(--border-color);
    }

    .modal-header {
        padding: 20px 24px;
        border-bottom: 1px solid var(--border-color);
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .modal-header h2 {
        margin: 0;
        font-size: 1.25rem;
        font-weight: 500;
        color: var(--text-primary);
    }

    .close-btn {
        background: none;
        border: none;
        color: var(--text-muted);
        cursor: pointer;
        padding: 8px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
    }

    .close-btn:hover {
        background: var(--bg-hover);
        color: var(--text-primary);
    }

    .modal-body {
        padding: 24px;
    }
</style> 