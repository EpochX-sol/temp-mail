<script>
    import { apiService } from '$lib/services/api';
    import { formatDate, truncateText } from '$lib/utils/helpers';
    
    /** @type {import('../../types').EmailMessage} */
    export let message;

    async function toggleStar() {
        try {
            const response = await apiService.toggleStar(message.uid);
            message.is_starred = response.is_starred;
        } catch (error) {
            console.error('Failed to toggle star:', error);
        }
    }
</script>

<tr class={`
    transition-colors hover:bg-gray-50 dark:hover:bg-gray-700
    ${!message.is_read ? 'bg-blue-50 dark:bg-blue-900/20' : ''}
`}>
    <td class="px-4 py-3">
        <input type="checkbox" class="form-checkbox h-4 w-4 text-primary-600 rounded border-gray-300 dark:border-gray-600 focus:ring-primary-500">
    </td>
    <td class="px-4 py-3">
        <div class="flex items-center space-x-3">
            <button 
                class={`flex-shrink-0 text-yellow-400 hover:text-yellow-500 focus:outline-none`}
                on:click={toggleStar}
            >
                <i class={`bi ${message.is_starred ? 'bi-star-fill' : 'bi-star'}`}></i>
            </button>
            <div class="min-w-0">
                <a 
                    href="/inbox/{message.uid}" 
                    class="text-sm font-medium text-gray-900 dark:text-white truncate block"
                >
                    {message.from.name}
                </a>
                <span class="text-xs text-gray-500 dark:text-gray-400 truncate block">
                    {message.from.address}
                </span>
            </div>
        </div>
    </td>
    <td class="px-4 py-3">
        <a 
            href="/inbox/{message.uid}" 
            class="text-sm text-gray-900 dark:text-white truncate block max-w-md"
        >
            {message.subject}
        </a>
    </td>
    <td class="px-4 py-3">
        <span class="text-sm text-gray-500 dark:text-gray-400">
            {formatDate(message.timestamp)}
        </span>
    </td>
    <td class="px-4 py-3 text-right">
        <button 
            class="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 focus:outline-none"
            title="Delete message"
        >
            <i class="bi bi-trash"></i>
        </button>
    </td>
</tr>

<style>
    .email-item {
        display: flex;
        padding: 1rem;
        border-bottom: 1px solid var(--kt-border-color);
        transition: background-color 0.3s;
    }

    .email-item:hover {
        background-color: var(--kt-gray-100);
    }

    .email-item.unread {
        background-color: var(--kt-primary-light);
    }

    .email-star button {
        background: none;
        border: none;
        cursor: pointer;
        color: var(--kt-warning);
    }

    .email-content {
        flex: 1;
        text-decoration: none;
        color: inherit;
        margin-left: 1rem;
    }

    .email-sender {
        font-weight: 600;
        margin-bottom: 0.25rem;
    }

    .email-subject {
        color: var(--kt-text-primary);
        margin-bottom: 0.25rem;
    }

    .email-preview {
        color: var(--kt-text-muted);
        font-size: 0.875rem;
    }

    .email-date {
        font-size: 0.75rem;
        color: var(--kt-text-muted);
        margin-top: 0.5rem;
    }
</style> 