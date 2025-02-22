<script>
    /** @type {"button" | "submit" | "reset"} */
    export let type = "button";
    export let variant = 'primary';
    export let disabled = false;
    export let loading = false;
    export let size = 'md';
    export let fullWidth = false;
    export let icon = '';
</script>

<button
    {type}
    class="btn btn-{variant} btn-{size}"
    class:disabled
    class:full-width={fullWidth}
    disabled={disabled || loading}
    on:click
>
    {#if loading}
        <span class="spinner"></span>
        <span>Loading...</span>
    {:else}
        {#if icon}
            <i class="bi {icon}"></i>
        {/if}
        <slot />
    {/if}
</button>

<style>
    .btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 500;
        transition: all 0.2s ease;
        padding: 0.75rem 1.5rem;
        font-size: 0.95rem;
        margin-top: 10px;
    }

    .btn:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }

    .btn-primary {
        background: #009ef7; /* Blue */
        color: white;
    }

    .btn-primary:hover:not(:disabled) {
        background: #0095e8;
        transform: translateY(-1px);
    }

    .btn-secondary {
        background: var(--bg-tertiary);
        color: var(--text-primary);
        border: 1px solid var(--border-color);
    }

    .btn-secondary:hover:not(:disabled) {
        background: var(--bg-hover);
    }

    .btn-success {
        background: #7239ea; 
        color: white;
    }

    .btn-success:hover:not(:disabled) {
        background: #6029d5;
    }

    .btn-info {
        background: #0d6efd; /* Different Blue */
        color: white;
    }

    .btn-info:hover:not(:disabled) {
        background: #0b5ed7;
    }

    .btn-warning {
        background: #ffc700; /* Yellow */
        color: #1b1b29;
    }

    .btn-warning:hover:not(:disabled) {
        background: #f1bc00;
    }

    .btn-danger {
        background: #dc3545;
        color: white;
    }

    .btn-danger:hover:not(:disabled) {
        background: #bb2d3b;
    }

    .btn-sm {
        padding: 0.5rem 1rem;
        font-size: 0.875rem;
    }

    .btn-lg {
        padding: 1rem 2rem;
        font-size: 1.1rem;
    }

    .full-width {
        width: 100%;
    }

    .spinner {
        width: 1rem;
        height: 1rem;
        border: 2px solid currentColor;
        border-right-color: transparent;
        border-radius: 50%;
        animation: spin 0.75s linear infinite;
    }

    @keyframes spin {
        to { transform: rotate(360deg); }
    }

    i {
        font-size: 1.1em;
    }
</style> 