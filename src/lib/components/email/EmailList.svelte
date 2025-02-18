<script>
    import { onMount, onDestroy } from 'svelte';
    import { emailStore } from '$lib/stores/emailStore';
    import EmailItem from './EmailItem.svelte';
    import LoadingSpinner from './LoadingSpinner.svelte';
    import { REFRESH_INTERVAL } from '$lib/utils/constants';

    export let email;

    onMount(() => {
        emailStore.fetchMessages(email);
        emailStore.startAutoRefresh(email);
    });

    onDestroy(() => {
        emailStore.stopAutoRefresh();
    });

    $: if ($emailStore.refreshInterval) {
        emailStore.fetchMessages(email);
    }

    $: messages = $emailStore.messages;
    $: loading = $emailStore.loading;
    $: error = $emailStore.error;
    $: initialLoad = $emailStore.initialLoad;
</script>

<div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
    <div class="border-b border-gray-200 dark:border-gray-700 p-4">
        <div class="flex items-center space-x-4">
            <div class="relative inline-block">
                <input type="checkbox" class="form-checkbox h-4 w-4 text-primary-600 rounded border-gray-300 dark:border-gray-600 focus:ring-primary-500">
            </div>
            <button class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <i class="bi bi-arrow-clockwise text-gray-600 dark:text-gray-400"></i>
            </button>
        </div>
    </div>

    <div class="divide-y divide-gray-200 dark:divide-gray-700">
        {#if initialLoad}
            <div class="flex flex-col items-center justify-center py-16 px-4">
                <LoadingSpinner />
                <p class="mt-4 text-gray-600 dark:text-gray-400">
                    Waiting for incoming messages for {email}...
                </p>
            </div>
        {:else if loading && messages.length === 0}
            <div class="flex justify-center py-16">
                <LoadingSpinner />
            </div>
        {:else if error}
            <div class="flex items-center justify-center py-16 px-4">
                <div class="text-red-500 dark:text-red-400">
                    <p>{error}</p>
                </div>
            </div>
        {:else if messages.length === 0}
            <div class="flex flex-col items-center justify-center py-16 px-4">
                <i class="bi bi-inbox-fill text-5xl text-gray-400 dark:text-gray-600 mb-4"></i>
                <p class="text-lg font-medium text-gray-900 dark:text-white">Your inbox is empty!</p>
                <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    Waiting for incoming messages for {email}
                </p>
            </div>
        {:else}
            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead class="bg-gray-50 dark:bg-gray-900">
                        <tr>
                            <th scope="col" class="w-12 px-4 py-3">
                                <input type="checkbox" class="form-checkbox h-4 w-4 text-primary-600 rounded border-gray-300 dark:border-gray-600 focus:ring-primary-500">
                            </th>
                            <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                From
                            </th>
                            <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Subject
                            </th>
                            <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Date
                            </th>
                            <th scope="col" class="relative px-4 py-3">
                                <span class="sr-only">Actions</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {#each messages as message (message.uid)}
                            <EmailItem {message} />
                        {/each}
                    </tbody>
                </table>
            </div>
        {/if}
    </div>

    {#if loading && messages.length > 0}
        <div class="fixed bottom-4 right-4">
            <div class="bg-white dark:bg-gray-800 rounded-full shadow-lg p-2">
                <LoadingSpinner size="small" />
            </div>
        </div>
    {/if}
</div>

<style>
    .email-list {
        background: var(--kt-body-bg);
        border-radius: 8px;
        overflow: hidden;
    }

    .email-list-header {
        padding: 1rem;
        border-bottom: 1px solid var(--kt-border-color);
    }

    .toolbar {
        display: flex;
        gap: 1rem;
        align-items: center;
    }

    .loading-state, .empty-state, .error-state {
        text-align: center;
        padding: 4rem 2rem;
        color: var(--kt-text-muted);
    }

    .empty-state i {
        font-size: 3rem;
        margin-bottom: 1rem;
        color: var(--kt-gray-400);
    }

    .text-muted {
        color: var(--kt-text-muted);
        font-size: 0.9rem;
    }

    .background-refresh {
        position: fixed;
        bottom: 1rem;
        right: 1rem;
        background: var(--kt-body-bg);
        border-radius: 50%;
        padding: 0.5rem;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .error-state {
        color: var(--kt-danger);
    }
</style> 