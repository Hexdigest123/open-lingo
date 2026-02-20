import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { encryptApiKey } from '$lib/server/auth/encryption';
import { hasGlobalApiKey, setGlobalApiKey, removeGlobalApiKey } from '$lib/server/openai/getApiKey';
import {
	getSignupMode,
	setSignupMode,
	getAllowedDomains,
	setAllowedDomains,
	isHeartsDisabledGlobal,
	setHeartsDisabledGlobal,
	type SignupMode
} from '$lib/server/settings/appSettings';
import { isEmailConfigured, testEmailConfiguration } from '$lib/server/email/mailer';

export const load: PageServerLoad = async () => {
	const [hasKey, signupMode, allowedDomains, heartsDisabled] = await Promise.all([
		hasGlobalApiKey(),
		getSignupMode(),
		getAllowedDomains(),
		isHeartsDisabledGlobal()
	]);

	return {
		hasGlobalApiKey: hasKey,
		signupMode,
		allowedDomains,
		heartsDisabledGlobal: heartsDisabled,
		emailConfigured: isEmailConfigured()
	};
};

export const actions: Actions = {
	saveGlobalKey: async ({ request }) => {
		const data = await request.formData();
		const apiKey = data.get('apiKey')?.toString().trim();

		if (!apiKey) {
			return fail(400, { error: 'API key is required', action: 'saveGlobalKey' });
		}

		// Validate API key format (starts with sk-)
		if (!apiKey.startsWith('sk-')) {
			return fail(400, {
				error: 'Invalid API key format. Key should start with sk-',
				action: 'saveGlobalKey'
			});
		}

		try {
			const encrypted = encryptApiKey(apiKey);
			await setGlobalApiKey(encrypted);

			return {
				success: true,
				message: 'Global API key saved successfully',
				action: 'saveGlobalKey'
			};
		} catch (error) {
			console.error('Failed to save global API key:', error);
			return fail(500, { error: 'Failed to save global API key', action: 'saveGlobalKey' });
		}
	},

	removeGlobalKey: async () => {
		try {
			await removeGlobalApiKey();
			return { success: true, message: 'Global API key removed', action: 'removeGlobalKey' };
		} catch (error) {
			console.error('Failed to remove global API key:', error);
			return fail(500, { error: 'Failed to remove global API key', action: 'removeGlobalKey' });
		}
	},

	updateSignupMode: async ({ request }) => {
		const data = await request.formData();
		const mode = data.get('signupMode')?.toString() as SignupMode;

		if (!mode || !['open', 'invitation', 'approval'].includes(mode)) {
			return fail(400, { error: 'Invalid signup mode', action: 'updateSignupMode' });
		}

		try {
			await setSignupMode(mode);
			return {
				success: true,
				message: `Signup mode updated to "${mode}"`,
				action: 'updateSignupMode'
			};
		} catch (error) {
			console.error('Failed to update signup mode:', error);
			return fail(500, { error: 'Failed to update signup mode', action: 'updateSignupMode' });
		}
	},

	updateAllowedDomains: async ({ request }) => {
		const data = await request.formData();
		const domainsInput = data.get('allowedDomains')?.toString() || '';

		// Parse domains from comma-separated string
		const domains = domainsInput
			.split(',')
			.map((d) => d.trim().toLowerCase())
			.filter((d) => d.length > 0);

		try {
			await setAllowedDomains(domains);
			if (domains.length === 0) {
				return {
					success: true,
					message: 'Domain restriction removed. All email domains are now allowed.',
					action: 'updateAllowedDomains'
				};
			}
			return {
				success: true,
				message: `Allowed domains updated: ${domains.join(', ')}`,
				action: 'updateAllowedDomains'
			};
		} catch (error) {
			console.error('Failed to update allowed domains:', error);
			return fail(500, {
				error: 'Failed to update allowed domains',
				action: 'updateAllowedDomains'
			});
		}
	},

	toggleGlobalHearts: async ({ request }) => {
		const data = await request.formData();
		const disabled = data.get('heartsDisabled')?.toString() === 'true';

		try {
			await setHeartsDisabledGlobal(disabled);
			return {
				success: true,
				message: disabled ? 'Hearts system disabled globally' : 'Hearts system enabled globally',
				action: 'toggleGlobalHearts'
			};
		} catch (error) {
			console.error('Failed to toggle global hearts:', error);
			return fail(500, { error: 'Failed to toggle hearts system', action: 'toggleGlobalHearts' });
		}
	},

	testEmail: async () => {
		const result = await testEmailConfiguration();
		if (result.success) {
			return {
				success: true,
				message: 'Email configuration is working correctly',
				action: 'testEmail'
			};
		} else {
			return fail(500, { error: result.error || 'Email test failed', action: 'testEmail' });
		}
	}
};
