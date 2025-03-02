<script>
    import { page } from '$app/stores';
    import SEO from '$lib/components/common/SEO.svelte';
 
    $: status = $page.status;
    $: message = $page.error?.message || 'An unexpected error occurred.';
     
    const errorDescriptions = {
        404: "The page you're looking for doesn't exist.",
        500: "Our server encountered an issue. Please try again later.",
        403: "You don't have permission to access this resource.",
        401: "Authentication is required to access this page.",
        400: "The request couldn't be processed due to bad syntax."
    };
     
    $: friendlyDescription = errorDescriptions[status] || message;
</script>

<SEO 
    title="{status} Error - Temp Mail"
    description={friendlyDescription}
/>

<div class="error-page">
    <div class="error-container">
        <div class="error-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
        </div>
        
        <h1 class="error-title">Error <span class="error-code">{status}</span></h1>
        <p class="error-message">{friendlyDescription}</p>

        <div class="actions">
            <a href="/" class="back-home-btn">Back to Home</a> 
        </div>
    </div>
</div>

<style>
    .error-page {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center; 
        padding: 2rem;
        background: var(--bg-page);
        color: var(--text-primary);
    }

    .error-container {
        max-width: 500px;
        background: var(--bg-card);
        border-radius: 16px; 
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        text-align: center;
        animation: fadeIn 0.5s ease;
        margin-top: 5%;
    }
    
    .error-icon {
        color: var(--primary);
        margin-bottom: 1.5rem;
    }
    
    .error-title {
        font-size: 2.2rem;
        font-weight: 700;
        margin-bottom: 1rem;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
    }
    
    .error-code {
        color: var(--primary);
    }

    .error-message {
        margin-bottom: 2rem;
        font-size: 1.1rem;
        line-height: 1.6;
        color: var(--text-secondary);
    }

    .actions {
        display: flex;
        gap: 1rem;
        justify-content: center;
        flex-wrap: wrap;
    }

    .back-home-btn, .reload-btn {
        text-decoration: none;
        font-weight: 500; 
        border-radius: 8px;
        transition: all 0.2s ease;
        cursor: pointer;
        font-size: 1.3rem;
    }
    
    .back-home-btn {
        color: var(--primary);  
    }
    
    .reload-btn {
        background: var(--bg-tertiary);
        color: var(--text-primary);
        border: 1px solid var(--border-color);
    }

    .back-home-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
    
    .reload-btn:hover {
        background: var(--bg-secondary);
    }
    
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @media (max-width: 600px) {
        .error-container {
            padding: 2rem 1.5rem;
        }
        
        .actions {
            flex-direction: column;
        }
        
        .back-home-btn, .reload-btn {
            width: 100%;
        }
    }
</style>