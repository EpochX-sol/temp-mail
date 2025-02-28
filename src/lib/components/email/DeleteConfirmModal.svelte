<script>
    import Modal from '$lib/components/common/Modal.svelte';
    import Button from '$lib/components/common/Button.svelte';

    export let show = false;
    export let onClose = () => {};
    export let onConfirm;
    export let emailToDelete = '';

    let isDeleting = false;

    async function handleDelete() {
        isDeleting = true;
        try {
            await onConfirm();
            onClose();
        } catch (error) {
            throw error;
        } finally {
            isDeleting = false;
        }
    }
</script>

<Modal
    {show} 
    onClose={onClose}
    title='Delete Email'
>
    <div class="delete-confirm-content">
        <h3 class="delete-confirm-title">Are you sure you want to delete this inbox?</h3>
        <h4 class="delete-confirm-subtitle">You will not be able to access it or its messages in the future.</h4>
        <div class="email-to-delete">{emailToDelete}</div>

        <div class="modal-actions">
            <Button 
                variant="danger"
                size="sm" 
                on:click={handleDelete}
                loading={isDeleting}
            >
                {#if isDeleting}
                    <i class="bi bi-arrow-clockwise spinning"></i> Deleting...
                {:else}
                    Delete Email
                {/if}
            </Button>
            <Button 
                variant="secondary"
                size="sm"
                on:click={onClose}
                disabled={isDeleting}
            >
                Cancel
            </Button>
        </div>
    </div>
</Modal>

<style>
    .delete-confirm-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        padding: 1rem;
        gap: 0.5rem;
    }

    .delete-confirm-title {
        color: var(--text-primary);
        font-size: 1.2rem;
        margin: 0;
    }

    .delete-confirm-subtitle {
        color: var(--text-secondary);
        font-size: 0.95rem;
        font-weight: normal;
        margin: 0;
    }

    .email-to-delete {
        font-family: monospace;
        background: var(--bg-secondary);
        padding: 8px 16px;
        border-radius: 6px;
        margin: 16px 0;
        color: var(--text-primary);
    }

    .modal-actions {
        display: flex;
        gap: 1rem;
        justify-content: center;
        width: 100%;
        margin-top: 16px;
    }

    @media (max-width: 768px) {
        .delete-confirm-content {
            padding: 0.5rem;
        }

        .delete-confirm-title {
            font-size: 1.1rem;
        }

        .delete-confirm-subtitle {
            font-size: 0.9rem;
        }

        .modal-actions {
            flex-direction: column;
            gap: 0.5rem;
        }
    }
</style> 