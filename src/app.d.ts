/// <reference types="@sveltejs/kit" />

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface Platform {}
	}

	interface EmailMessage {
		uid: string;
		recipient: string;
		sender: string;
		subject: string;
		is_starred: boolean;
		is_read: boolean;
		from: {
			name: string;
			address: string;
		};
		msg: {
			text: string;
			text_formatted: string;
			html: string;
		};
		date: string;
		timestamp: number;
	}

	interface ApiResponse<T> {
		status: string;
		code: number;
		msg?: string;
		data?: T;
	}
}

export {};
