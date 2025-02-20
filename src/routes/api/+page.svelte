<script>
    const endpoints = [
        {
            title: "Get Random Email",
            method: "GET",
            path: "/api/v1/email/generate",
            description: "Generates a random temporary email address for testing purposes",
            response: {
                status: "success",
                email: "test.user123@tempmail.com",
                created_at: "2024-01-20T10:30:00Z",
                expires_at: "2024-01-21T10:30:00Z"
            }
        },
        {
            title: "Check Messages",
            method: "GET",
            path: "/api/v1/messages/{email}",
            description: "Retrieve all messages for a specific email address",
            response: {
                status: "success",
                messages: [
                    {
                        id: "msg_123",
                        subject: "Welcome!",
                        from: "sender@example.com",
                        received_at: "2024-01-20T10:35:00Z",
                        has_attachments: false
                    }
                ]
            }
        },
        {
            title: "Get Message Content",
            method: "GET",
            path: "/api/v1/messages/{email}/{message_id}",
            description: "Retrieve full content of a specific message including attachments",
            response: {
                status: "success",
                message: {
                    id: "msg_123",
                    subject: "Welcome!",
                    from: "sender@example.com",
                    body: "Hello, welcome to our service...",
                    attachments: []
                }
            }
        }
    ];
</script>

<div class="api-page">
    <header class="api-header">
        <div class="header-content">
            <h1>Temp Email API</h1>
            <p class="subtitle">Support for high volume automated testing of email addresses</p>
        </div>
    </header>

    <main class="api-content">
        <div class="content-wrapper">
            <section class="intro-section">
                <h2>How It Works</h2>
                <p>The API is developer friendly and can be easily accessed on Rapid API web site. You can try the API for free for up to 200 requests per month and with a subscription go up to 100's of thousands of requests per month.</p>
                
                <div class="api-info">
                    <div class="info-card">
                        <i class="bi bi-rocket"></i>
                        <h3>Quick Start</h3>
                        <p>Get started in minutes with our simple API endpoints</p>
                    </div>
                    <div class="info-card">
                        <i class="bi bi-shield-check"></i>
                        <h3>Secure</h3>
                        <p>Enterprise-grade security for all API calls</p>
                    </div>
                    <div class="info-card">
                        <i class="bi bi-lightning"></i>
                        <h3>High Performance</h3>
                        <p>Fast and reliable email processing</p>
                    </div>
                </div>
            </section>

            <section class="endpoints-section">
                <h2>API Endpoints</h2>
                {#each endpoints as endpoint}
                    <div class="endpoint-card">
                        <div class="endpoint-header">
                            <span class="method {endpoint.method.toLowerCase()}">{endpoint.method}</span>
                            <code class="path">{endpoint.path}</code>
                        </div>
                        <div class="endpoint-content">
                            <h3>{endpoint.title}</h3>
                            <p>{endpoint.description}</p>
                            <div class="response">
                                <h4>Example Response</h4>
                                <pre><code>{JSON.stringify(endpoint.response, null, 2)}</code></pre>
                            </div>
                        </div>
                    </div>
                {/each}
            </section>

            <section class="cta-section">
                <h2>Ready to Get Started?</h2>
                <p>Get your API key and start building amazing applications</p>
                <a href="https://rapidapi.com" class="cta-button" target="_blank">
                    Get Free API Key
                </a>
            </section>
        </div>
    </main>
</div>

<style>
    .api-page {
        min-height: 100vh;
        background: var(--bg-page);
        color: var(--text-primary);
    }

    .api-header {
        background: var(--bg-primary);
        border-bottom: 1px solid var(--border-color);
        padding: 64px 0;
        text-align: center;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }

    .header-content {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 24px;
    }

    .header-content h1 {
        font-size: 2.5rem;
        margin: 0;
        color: var(--highlight-color);
    }

    .subtitle {
        font-size: 1.2rem;
        color: var(--text-secondary);
        margin-top: 1rem;
    }

    .api-content {
        max-width: 1200px;
        margin: 0 auto;
        padding: 48px 24px;
    }

    .intro-section {
        margin-bottom: 48px;
    }

    .api-info {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 24px;
        margin-top: 32px;
    }

    .info-card {
        background: var(--bg-primary);
        padding: 24px;
        border-radius: 8px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        transition: transform 0.2s;
    }

    .info-card:hover {
        transform: translateY(-5px);
    }

    .info-card i {
        font-size: 2rem;
        color: var(--highlight-color);
        margin-bottom: 16px;
    }

    .endpoint-card {
        background: var(--bg-primary);
        border-radius: 8px;
        margin-bottom: 24px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        overflow: hidden;
    }

    .endpoint-header {
        padding: 16px;
        background: var(--bg-secondary);
        display: flex;
        align-items: center;
        gap: 12px;
    }

    .method {
        padding: 4px 8px;
        border-radius: 4px;
        font-weight: bold;
        font-size: 0.9rem;
    }

    .method.get {
        background: #28a745;
        color: white;
    }

    .path {
        font-family: monospace;
        font-size: 1rem;
    }

    .endpoint-content {
        padding: 24px;
    }

    .response {
        margin-top: 16px;
        background: var(--bg-tertiary);
        border-radius: 4px;
        padding: 16px;
    }

    .response pre {
        margin: 0;
        overflow-x: auto;
    }

    .response code {
        font-family: monospace;
        font-size: 0.9rem;
    }

    .cta-section {
        text-align: center;
        margin-top: 64px;
        padding: 48px;
        background: var(--bg-primary);
        border-radius: 8px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }

    .cta-button {
        display: inline-block; 
        color: white;
        background: #0056b3;
        padding: 12px 24px;
        border-radius: 6px;
        text-decoration: none;
        font-weight: bold;
        margin-top: 24px;
        transition: background-color 0.2s;
    }
 
    @media (max-width: 768px) {
        .api-header {
            padding: 40px 0;
        }

        .header-content h1 {
            font-size: 2rem;
        }

        .api-content {
            padding: 24px;
        }

        .endpoint-header {
            flex-direction: column;
            align-items: flex-start;
        }

        .info-card {
            padding: 16px;
        }
    }
</style>