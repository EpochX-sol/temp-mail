<script>
    import { createEventDispatcher } from 'svelte';
    
    export let title = '';
    export let open = false;
    
    const dispatch = createEventDispatcher();
    
    function close() {
        dispatch('close');
    }
</script>

{#if open}
    <div class="modal-backdrop" on:click={close}></div>
    <div class="modal" role="dialog" aria-modal="true">
        <div class="modal-content">
            <div class="modal-header">
                <h2>{title}</h2>
                <button class="close-btn" on:click={close}>
                    <i class="bi bi-x"></i>
                </button>
            </div>
            <div class="modal-body">
                <slot />
            </div>
            <div class="modal-footer">
                <slot name="footer" />
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
        z-index: 1000;
    }

    .modal {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: var(--kt-body-bg);
        border-radius: 8px;
        z-index: 1001;
        width: 90%;
        max-width: 500px;
        max-height: 90vh;
        overflow-y: auto;
    }

    .modal-content {
        padding: 1.5rem;
    }

    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
    }

    .modal-header h2 {
        margin: 0;
        font-size: 1.25rem;
        color: var(--kt-text-primary);
    }

    .close-btn {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: var(--kt-text-muted);
        padding: 0.25rem;
    }

    .close-btn:hover {
        color: var(--kt-text-primary);
    }

    .modal-footer {
        margin-top: 1.5rem;
        display: flex;
        justify-content: flex-end;
        gap: 1rem;
    }
</style> 