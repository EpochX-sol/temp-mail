<script>
    /** @type {"button" | "submit" | "reset"} */
    export let type = "button";
    export let variant = 'primary';
    export let disabled = false;
    export let loading = false;
    export let size = 'md';
</script>

<button
    {type}
    class="btn btn-{variant} btn-{size}"
    class:disabled
    disabled={disabled || loading}
    on:click|preventDefault
>
    {#if loading}
        <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
        <span>Loading...</span>
    {:else}
        <slot />
    {/if}
</button>

<style>
    .btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-weight: 500;
        transition: all 0.2s;
    }

    .btn:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }

    .btn-primary {
        background: var(--kt-primary);
        color: white;
    }

    .btn-primary:hover:not(:disabled) {
        background: var(--kt-primary-dark);
    }

    .btn-secondary {
        background: var(--kt-secondary);
        color: white;
    }

    .btn-md {
        padding: 0.5rem 1rem;
        font-size: 1rem;
    }

    .btn-lg {
        padding: 0.75rem 1.5rem;
        font-size: 1.125rem;
    }

    .spinning {
        animation: spin 1s linear infinite;
    }

    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }

    .spinner-border {
        display: inline-block;
        width: 1rem;
        height: 1rem;
        border: 0.2em solid currentColor;
        border-right-color: transparent;
        border-radius: 50%;
        animation: spinner-border .75s linear infinite;
    }

    @keyframes spinner-border {
        to { transform: rotate(360deg); }
    }
</style> 