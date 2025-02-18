export interface EmailMessage {
    uid: string;
    from: {
        name: string;
        address: string;
    };
    subject: string;
    msg: {
        text: string;
        html?: string;
    };
    timestamp: string;
    is_read: boolean;
    is_starred: boolean;
} 