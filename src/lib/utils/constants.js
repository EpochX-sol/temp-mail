export const API_CONFIG = {
    BASE_URL: 'https://api.snapinbox.net/api/v1',
    REFRESH_INTERVAL: 10000,
    RATE_LIMIT_THRESHOLD: 10,
    RATE_LIMIT_INTERVAL: 10000,
};



export const REFRESH_INTERVAL = 10000;



export const API_ENDPOINTS = {
    RANDOM_INBOX: '/inboxes/random',
    INBOX_MESSAGES: (email) => `/inboxes/${encodeURIComponent(email)}`,
    MESSAGE: (uid) => `/messages/${uid}`,
    DELETE_MESSAGE: (uid) => `/messages/${uid}/delete`,
    DELETE_INBOX: (email) => `/inboxes/${encodeURIComponent(email)}/delete`,
    STAR_MESSAGE: (uid) => `/messages/${uid}/star`,
    READ_MESSAGE: (uid) => `/messages/${uid}/read`,
    UNREAD_MESSAGE: (uid) => `/messages/${uid}/unread`,
    DOMAINS: '/domains',
    BULK_DELETE: '/messages/bulk',
};



export const MAX_API_CALLS = 10;
export const API_WINDOW = 10000;



export const UI_CONFIG = {
    PAGINATION: {
        DEFAULT_PAGE: 1,
        DEFAULT_ROWS_PER_PAGE: 10,
        PAGE_SIZES: [
            { value: 5, label: '5' },
            { value: 10, label: '10' },
            { value: 20, label: '20' },
            { value: 50, label: '50' },
            { value: 100, label: '100' }
        ]
    },
    ANIMATION: {
        MAX_ITERATIONS: 10,
        REFRESH_ANIMATION_DURATION: 500,
        COPY_FEEDBACK_DURATION: 2000
    },
    DEMO_MESSAGES: [
        {
            uid: '1',
            name: 'us@gmail.com',
            subject: 'Welcome to our service - Welcome to the inboxes.com temporary email service',
            time: 'A few seconds ago',
            from: {
                name: 'Welcome Bot',
                address: 'us@gmail.com'
            },
            is_starred: false,
            is_read: false,
            avatarColor: '#FFE2E5',
            avatarTextColor: '#F1416C'
        },
        {
            uid: '2',
            name: 'support@gmail.com',
            subject: 'Have questions? - you can contact us for help',
            time: '39 seconds ago',
            from: {
                name: 'Support Team',
                address: 'support@gmail.com'
            },
            is_starred: false,
            is_read: false,
            avatarColor: '#E8FFF3',
            avatarTextColor: '#50CD89'
        },
        {
            uid: '3',
            name: 'security@gmail.com',
            subject: 'Your privacy is our priority - Learn about our security features',
            time: '1 minute ago',
            from: {
                name: 'Security Team',
                address: 'security@gmail.com'
            },
            is_starred: false,
            is_read: false,
            avatarColor: '#FFF8DD',
            avatarTextColor: '#FFA800'
        },
        {
            uid: '4',
            name: 'tips@gmail.com',
            subject: 'Pro tips for using temporary email - Get the most out of our service',
            time: '2 minutes ago',
            from: {
                name: 'Tips & Tricks',
                address: 'tips@gmail.com'
            },
            is_starred: false,
            is_read: false,
            avatarColor: '#EEE5FF',
            avatarTextColor: '#7239EA'
        }
    ],
    LOCAL_STORAGE_KEYS: {
        PAGE_SIZE: 'preferredPageSize',
        CURRENT_EMAIL: 'currentEmail',
        THEME: 'theme'
    },
    FEATURES: [
        {
            title: "Your Privacy Matters.",
            subtitle: "We Make It Simple.",
            description: "SECURE & INSTANT",
            items: [
                {
                    title: "Smart Protection",
                    description: "Shield your personal inbox from unwanted emails. Our temporary email service acts as your digital guardian, keeping your real email address private and spam-free.",
                    icon: "bi-shield-check"
                },
                {
                    title: "Instant Access",
                    description: "No sign-up, no waiting. Get a secure temporary email address in seconds. Perfect for quick verifications, downloads, or testing - ready when you are.",
                    icon: "bi-lightning"
                },
                {
                    title: "Zero Traces",
                    description: "Complete privacy with our self-destructing inboxes. Use them when you need them, forget them when you're done. No data stored, no traces left behind.",
                    icon: "bi-trash"
                }
            ]
        }
    ],
    FAQS: [
        {
            question: "What is a Disposable Temporary Email?",
            answer: "A disposable temporary email is a temporary email address that you can use to protect your privacy online. It allows you to receive emails without revealing your personal email address.",
            icon: "bi-shield-check"
        },
        {
            question: "How does it work?",
            answer: "Our service generates a unique email address that forwards all incoming messages to our secure servers. You can view these messages through our web interface without downloading anything.",
            icon: "bi-gear"
        },
        {
            question: "Is it really free?",
            answer: "Yes, our service is completely free to use with no hidden charges. We believe in providing accessible privacy tools for everyone.",
            icon: "bi-currency-dollar"
        },
        {
            question: "Is it secure?",
            answer: "We use industry-standard encryption and security measures to protect your data. We never store personal information and automatically delete all emails after 24 hours.",
            icon: "bi-lock"
        }
    ]
};



export const API_PAGE_CONFIG = {
    ENDPOINTS: [
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
    ],
    INFO_CARDS: [
        {
            icon: "bi-rocket",
            title: "Quick Start",
            description: "Get started in minutes with our simple API endpoints"
        },
        {
            icon: "bi-shield-check",
            title: "Secure",
            description: "Enterprise-grade security for all API calls"
        },
        {
            icon: "bi-lightning",
            title: "High Performance",
            description: "Fast and reliable email processing"
        }
    ],
    TEXTS: {
        TITLE: "Temp Email API",
        SUBTITLE: "Support for high volume automated testing of email addresses",
        INTRO: "The API is developer friendly and can be easily accessed on Rapid API web site. You can try the API for free for up to 200 requests per month and with a subscription go up to 100's of thousands of requests per month.",
        CTA_TITLE: "Ready to Get Started?",
        CTA_SUBTITLE: "Get your API key and start building amazing applications",
        CTA_BUTTON_TEXT: "Get Free API Key",
        CTA_BUTTON_LINK: "https://rapidapi.com",
        RATE_LIMIT_ERROR: "Rate limit exceeded. Please consider upgrading your plan for higher limits."
    }
};



export const ABOUT_PAGE_CONFIG = {
    HEADER: {
        TITLE: "About Temp Emails",
        MISSION: "Protecting your privacy in the digital age."
    },
    STORY: {
        TITLE: "Our Story",
        PARAGRAPHS: [
            "Temp mail emerged from a vision to empower individuals with the tools they need to protect their privacy online. In a world where personal information is often exploited, we believe that everyone deserves a safe space to communicate without fear of surveillance or data breaches.",
            "Our journey began with a simple idea: to create a temporary email service that not only provides anonymity but also ensures that users have complete control over their digital footprint. We understand the challenges of navigating the online landscape, and our mission is to simplify that experience while prioritizing user privacy.",
            "At Inboxes, we are committed to innovation and excellence. Our team of dedicated professionals works tirelessly to enhance our platform, ensuring that it remains user-friendly, secure, and efficient. We envision a future where privacy is a fundamental right, and we are proud to lead the charge in making that a reality."
        ]
    },
    FEATURES: [
        {
            icon: "bi-shield-check",
            title: "Privacy First",
            description: "We prioritize your privacy with end-to-end encryption and a zero-log policy."
        },
        {
            icon: "bi-lightning",
            title: "Lightning Fast",
            description: "Instant email generation and real-time message delivery."
        },
        {
            icon: "bi-gear",
            title: "Advanced Features",
            description: "Custom domains, API access, and enterprise solutions."
        },
        {
            icon: "bi-person-check",
            title: "User-Centric Design",
            description: "Intuitive interface designed for seamless user experience."
        }
    ],
    TESTIMONIALS: [
        {
            name: "Emily Carter",
            feedback: "Temp email has transformed the way I manage my emails. I feel secure and in control!"
        },
        {
            name: "Michael Brown",
            feedback: "The service is incredibly fast and reliable. I love the privacy features!"
        },
        {
            name: "Sarah Johnson",
            feedback: "Finally, a solution that respects my privacy. Highly recommend Temp email!"
        },
        {
            name: "David Miller",
            feedback: "Easy to use and highly effective. This is my go-to service for temporary emails!"
        }
    ]
    
};

export const CONTACT_PAGE_CONFIG = {
    HEADER: {
        TITLE: "Get in Touch",
        SUBTITLE: "We'd love to hear from you. Whether you have a question, feedback, or just want to say hello, feel free to reach out."
    },
    CONTACT_INFO: [
        {
            icon: "bi-envelope",
            title: "Email Us",
            content: "support@yourcompany.com",
            link: "mailto:support@yourcompany.com",
            type: "email"
        },
        {
            icon: "bi-telephone",
            title: "Call Us",
            content: "+1 (234) 567-890",
            link: "tel:+1234567890",
            type: "phone"
        },
        {
            icon: "bi-geo-alt",
            title: "Visit Us",
            content: "123 Business Street, Suite 456\nCity, State, ZIP",
            type: "address"
        }
    ],
    FORM: {
        FIELDS: {
            NAME: {
                label: "Full Name",
                placeholder: "Enter your full name"
            },
            EMAIL: {
                label: "Email Address",
                placeholder: "Enter your email address"
            },
            SUBJECT: {
                label: "Subject",
                placeholder: "Enter the subject"
            },
            MESSAGE: {
                label: "Your Message",
                placeholder: "Type your message here..."
            }
        },
        SUBMIT: {
            text: "Send Message",
            sending: "Sending..."
        },
        MESSAGES: {
            SUCCESS: "Thank you! Your message has been sent.",
            ERROR: "Oops! There was an error sending your message. Please try again."
        }
    }
};

export const SHARED_STYLES = {
    HEADER: {
        BACKGROUND: "#0b0c10",
        TEXT_COLOR: "#ffffff",
        SUBTITLE_COLOR: "#9ca3af"
    }
};

export const FOOTER_CONFIG = {
    product: [ 
        { name: 'Security', href: '#security' },
        { name: 'FAQ', href: '#faq' },
        { name: 'API', href: '/api' }
    ],
    support: [
        { name: 'Help', href: '#faq' },
        { name: 'Contact', href: '/contact' }, 
    ],
    social: [
        { name: 'Twitter', href: 'https://twitter.com', icon: 'bi-twitter-x' },
        { name: 'GitHub', href: 'https://github.com', icon: 'bi-github' },
        { name: 'Discord', href: 'https://discord.com', icon: 'bi-discord' },
    ]
}; 