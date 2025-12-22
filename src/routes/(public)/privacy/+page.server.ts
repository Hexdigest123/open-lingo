import { env } from '$env/dynamic/private';

export function load() {
	return {
		companyName: env.LEGAL_COMPANY_NAME || '',
		address: env.LEGAL_ADDRESS || '',
		email: env.LEGAL_EMAIL || '',
		phone: env.LEGAL_PHONE || ''
	};
}
