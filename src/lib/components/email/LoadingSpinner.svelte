 
<script>
    export let size = "40px";
    export let color = "#3B82F6";
    export let borderWidth = "3px";
</script>

<div 
    class="spinner" 
    style="--size: {size}; --color: {color}; --border-width: {borderWidth};"
>
</div>

<style>
    .spinner {
        width: var(--size);
        height: var(--size);
        border: var(--border-width) solid #f3f3f3;
        border-radius: 50%;
        border-top: var(--border-width) solid var(--color);
        animation: spin 1.4s linear infinite;
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
</style>