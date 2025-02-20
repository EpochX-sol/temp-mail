<script>
    let formData = {
        name: '',
        email: '',
        subject: '',
        message: ''
    };

    let isSubmitting = false;
    let submissionResult = null; // 'success' or 'error'

    async function handleSubmit(e) {
        e.preventDefault();
        isSubmitting = true;
        submissionResult = null; // Reset result

        // Simulate form submission (replace with actual API call)
        await new Promise(resolve => setTimeout(resolve, 2000)); // 2 seconds delay

        try {
            // Simulate success
            if (formData.name && formData.email && formData.subject && formData.message) {
                submissionResult = 'success';
                formData = { name: '', email: '', subject: '', message: '' }; // Clear form
            } else {
                submissionResult = 'error';
            }
        } catch (error) {
            console.error("Form submission error:", error);
            submissionResult = 'error';
        } finally {
            isSubmitting = false;
        }
    }
</script>

<div class="contact-page">
    <header class="contact-header">
        <div class="header-content">
            <h1>Contact Us</h1>
            <p class="subtitle">We're here to help</p>
        </div>
    </header>

    <main class="contact-content">
        <div class="content-wrapper">
            <div class="contact-grid">
                <div class="contact-info">
                    <div class="info-card">
                        <i class="bi bi-envelope"></i>
                        <h3>Email Us</h3>
                        <p><a href="mailto:support@inboxes.com">support@gmail.com</a></p>
                    </div> 
                    <div class="info-card">
                        <i class="bi bi-question-circle"></i>
                        <h3>FAQ</h3>
                        <p>Check our <a href="/">help center</a></p>
                    </div>
                </div>

                <form class="contact-form" on:submit={handleSubmit}>
                    <div class="form-group">
                        <label for="name">Name</label>
                        <input
                            type="text"
                            id="name"
                            bind:value={formData.name}
                            required
                            placeholder="Your Name"
                        />
                    </div>
                    <div class="form-group">
                        <label for="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            bind:value={formData.email}
                            required
                            placeholder="Your Email"
                        />
                    </div>
                    <div class="form-group">
                        <label for="subject">Subject</label>
                        <input
                            type="text"
                            id="subject"
                            bind:value={formData.subject}
                            placeholder="Subject"
                        />
                    </div>
                    <div class="form-group">
                        <label for="message">Message</label>
                        <textarea
                            id="message"
                            bind:value={formData.message}
                            rows="5"
                            required
                            placeholder="Your Message"
                        ></textarea>
                    </div>
                    <button type="submit" class="submit-btn" disabled={isSubmitting}>
                        {#if isSubmitting}
                            <span class="spinner"></span> Sending...
                        {:else}
                            Send Message
                        {/if}
                    </button>

                    {#if submissionResult === 'success'}
                        <div class="success-message">
                            Thank you! Your message has been sent.
                        </div>
                    {/if}

                    {#if submissionResult === 'error'}
                        <div class="error-message">
                            Oops! There was an error sending your message. Please try again.
                        </div>
                    {/if}
                </form>
            </div>
        </div>
    </main>
</div>

<style>
    .contact-page {
        min-height: 100vh;
        background: var(--bg-page);
        font-family: 'Arial', sans-serif;
        color: var(--text-primary);
        padding: 20px;
        display: flex;
        flex-direction: column;
    }

    .contact-header {
        background: var(--bg-primary); 
        padding: 64px 0;
        text-align: center; 
    }

    .header-content h1 {
        font-size: 2.5rem;
        margin: 0;
        color: var(--highlight-color);
    }

    .subtitle {
        font-size: 1.2rem;
        color: var(--text-secondary);
    }

    .contact-content {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 40px 20px;
    }

    .content-wrapper {
        max-width: 900px;
        width: 100%;
    }

    .contact-grid {
        display: grid;
        grid-template-columns: 1fr 1.5fr;
        gap: 30px;
    }

    .contact-info {
        display: flex;
        flex-direction: column;
        gap: 20px;
    }

    .info-card {
        background: var(--bg-primary);
        border: 1px solid var(--border-color);
        border-radius: 8px;
        padding: 20px;
        text-align: left;
        transition: transform 0.2s;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }

    .info-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    }

    .info-card i {
        font-size: 2rem;
        color: var(--highlight-color);
        margin-bottom: 10px;
    }

    .info-card h3 {
        font-size: 1.5rem;
        margin: 0;
        color: var(--text-primary);
    }

    .info-card p {
        color: var(--text-secondary);
        margin: 0;
    }

    .contact-form {
        background: var(--bg-primary);
        border: 1px solid var(--border-color);
        border-radius: 8px;
        padding: 30px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }

    .form-group {
        margin-bottom: 20px;
    }

    .form-group label {
        display: block;
        font-size: 1.1rem;
        color: var(--text-primary);
        margin-bottom: 5px;
    }

    .form-group input,
    .form-group textarea {
        width: 100%;
        padding: 12px;
        border: 1px solid var(--border-color);
        border-radius: 6px;
        font-size: 1rem;
        color: var(--text-primary);
        background: var(--bg-page);
        outline: none;
        transition: border-color 0.2s;
    }

    .form-group input:focus,
    .form-group textarea:focus {
        border-color: var(--highlight-color);
    }

    .form-group textarea {
        resize: vertical;
    }

    .submit-btn {
        background-color: #094ab5;
        color: white;
        padding: 12px 24px;
        border: none;
        border-radius: 6px;
        font-size: 1.1rem;
        cursor: pointer;
        transition: background-color 0.2s;
    }

 

    .submit-btn:disabled {
        background-color: #6c757d;
        cursor: not-allowed;
    }

    .success-message {
        color: green;
        margin-top: 20px;
        padding: 10px;
        background-color: #d4edda;
        border: 1px solid #c3e6cb;
        border-radius: 6px;
    }

    .error-message {
        color: red;
        margin-top: 20px;
        padding: 10px;
        background-color: #f8d7da;
        border: 1px solid #f5c6cb;
        border-radius: 6px;
    }

    .spinner {
        display: inline-block;
        width: 20px;
        height: 20px;
        border: 3px solid rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        border-top-color: #fff;
        animation: spin 1s linear infinite;
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }

    @media (max-width: 768px) {
        .contact-grid {
            grid-template-columns: 1fr;
        }

        .contact-info {
            gap: 15px;
        }

        .info-card {
            text-align: center;
        }
    }
</style>