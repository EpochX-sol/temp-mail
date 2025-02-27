<script>
    import { fade, scale } from 'svelte/transition';
    import { onMount, onDestroy } from 'svelte';
    
    export let show = false;
    export let title = '';
    export let onClose = () => {};
    export let closeOnBackdrop = true;

    function handleBackdropClick(e) {
        if (e.target === e.currentTarget && closeOnBackdrop) {
            onClose();
        }
    }

    // Add body scroll lock when modal opens
    $: if (show) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }

    // Cleanup on component destroy
    onDestroy(() => {
        document.body.style.overflow = '';
    });
</script>

{#if show}
    <div 
        class="modal-backdrop" 
        on:click={handleBackdropClick}
        transition:fade={{ duration: 200 }}
    >
        <div 
            class="modal-container"
            transition:scale={{ duration: 200, start: 0.95 }}
        >
            <div class="modal-header">
                <h2>{title}</h2>
                <button class="close-btn" on:click={onClose}>
                    <i class="bi bi-x"></i>
                </button>
            </div>
            <div class="modal-content">
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
        background: rgba(0, 0, 0, 0.6);
        backdrop-filter: blur(4px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        padding: 16px;
    }

    .modal-container {
        background: var(--bg-primary);
        border-radius: 16px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
        width: 100%;
        max-width: 500px;
        max-height: 90vh;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        border: 1px solid var(--border-color);
    }

    .modal-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 20px 24px;
        border-bottom: 1px solid var(--border-color);
        background: var(--bg-secondary);
        position: relative;
        z-index: 1000;
    }

    .modal-header h2 {
        margin: 0;
        font-size: 1.25rem;
        font-weight: 600;
        color: var(--text-primary);
    }

    .close-btn {
        background: none;
        border: none;
        color: var(--text-muted);
        width: 32px;
        height: 32px;
        border-radius: 8px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
    }

    .close-btn:hover {
        background: var(--bg-hover);
        color: var(--text-primary);
    }

    .close-btn i {
        font-size: 1.8rem;
    }

    .modal-content {
        padding: 24px;
        overflow-y: auto;
    }

    @media (max-width: 768px) {
        .modal-backdrop {
            padding: 0;
            align-items: center;
        }

        .modal-container {
            max-height: 85vh;
            border-radius: 16px;
            animation: scaleIn 0.2s ease-out;
            margin: 16px;
        }

        .modal-header {
            padding: 16px 20px;
        }

        .modal-content {
            padding: 20px;
        }
    }

    @keyframes scaleIn {
        from { transform: scale(0.95); opacity: 0; }
        to { transform: scale(1); opacity: 1; }
    }
</style> 