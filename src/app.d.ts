// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: {
				id: number;
				email: string;
				displayName: string;
				role: 'user' | 'admin';
			} | null;
			newAccessToken?: string;
		}
		interface PageData {
			user?: App.Locals['user'];
		}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
