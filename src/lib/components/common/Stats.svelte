 

<div class="stats-container">
    <div class="stat-item">
        <i class="bi bi-envelope"></i>
        <span>Unique Emails</span>
    </div>
    <div class="stat-item">
        <i class="bi bi-lightning"></i>
        <span>Instant Delivery</span>
    </div>
    <div class="stat-item">
        <i class="bi bi-shield-lock"></i>
        <span>100% Secure</span>
    </div>
</div>

<style>
    .stats-container {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 24px;
        margin: 2.5rem 0;
    }

    .stat-item {
        background: rgba(255, 255, 255, 0.05);
        color: #ffffff;
        border: 1px solid rgba(255, 255, 255, 0.1);
        padding: 16px;
        border-radius: 12px;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .stat-item:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    }

    .stat-item i {
        color: #60a5fa;
        font-size: 1.5rem;
        margin-bottom: 8px;
        display: block;
    }

    .stat-item span {
        font-weight: 500;
        display: block;
        font-size: 1.1rem;
    }

    @media (max-width: 768px) {
        .stats-container {
            grid-template-columns: 1fr;
            gap: 12px;
            margin: 1.5rem 0;
        }

        .stat-item {
            padding: 12px;
        }

        .stat-item i {
            font-size: 1.2rem;
            margin-bottom: 4px;
        }

        .stat-item span {
            font-size: 0.95rem;
        }
    }
</style> 