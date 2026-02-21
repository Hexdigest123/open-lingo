import type { Actions, PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';
import {
	getShopItems,
	getUserGems,
	getUserPurchases,
	purchaseItem
} from '$lib/server/learning/gems-service';

export const load: PageServerLoad = async ({ locals }) => {
	const userId = locals.user!.id;

	const [items, gems, purchases] = await Promise.all([
		getShopItems(),
		getUserGems(userId),
		getUserPurchases(userId)
	]);

	return {
		items,
		gems,
		purchases
	};
};

export const actions: Actions = {
	purchase: async ({ request, locals }) => {
		const userId = locals.user!.id;
		const data = await request.formData();
		const itemIdRaw = data.get('itemId')?.toString().trim();
		const itemId = Number.parseInt(itemIdRaw ?? '', 10);

		if (!itemIdRaw || Number.isNaN(itemId) || itemId <= 0) {
			return fail(400, { purchaseError: 'Invalid item' });
		}

		const result = await purchaseItem(userId, itemId);
		if (!result.success) {
			return fail(400, {
				purchaseError: result.error ?? 'Purchase failed'
			});
		}

		return {
			purchaseSuccess: true,
			itemId,
			cost: result.item?.costGems ?? 0
		};
	}
};
