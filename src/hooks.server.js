export function handleError({ error, status }) { 
    return {
        status: status || 500,
        message: error?.message || 'An unexpected error occurred.'
    };
} 