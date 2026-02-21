import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { shopItems } from '../src/lib/server/db/schema';
import 'dotenv/config';

async function seedShop() {
	const databaseUrl = process.env.DATABASE_URL;
	if (!databaseUrl) {
		throw new Error('DATABASE_URL is not set');
	}

	const client = postgres(databaseUrl);
	const db = drizzle(client);

	console.log('Seeding shop items...');

	const items = [
		{
			key: 'streak_freeze_1',
			titleEn: 'Streak Freeze',
			titleDe: 'Streak-Einfrierung',
			descriptionEn: 'Protect your streak for one missed day. Your streak stays safe!',
			descriptionDe: 'Schütze deinen Streak für einen verpassten Tag. Dein Streak bleibt sicher!',
			costGems: 50,
			effectType: 'streak_freeze',
			effectValue: 1,
			isActive: true
		},
		{
			key: 'streak_freeze_3',
			titleEn: 'Streak Freeze Bundle',
			titleDe: 'Streak-Einfrierungs-Paket',
			descriptionEn: 'Get 3 streak freezes at a discount. Be prepared for busy days!',
			descriptionDe:
				'Erhalte 3 Streak-Einfrierungen zum Vorteilspreis. Sei vorbereitet für stressige Tage!',
			costGems: 120,
			effectType: 'streak_freeze',
			effectValue: 3,
			isActive: true
		},
		{
			key: 'streak_freeze_5',
			titleEn: 'Streak Freeze Mega Pack',
			titleDe: 'Streak-Einfrierungs-Mega-Paket',
			descriptionEn: 'Stock up with 5 streak freezes. Maximum protection for your streak!',
			descriptionDe: 'Hol dir 5 Streak-Einfrierungen. Maximaler Schutz für deinen Streak!',
			costGems: 180,
			effectType: 'streak_freeze',
			effectValue: 5,
			isActive: true
		},
		{
			key: 'heart_refill',
			titleEn: 'Heart Refill',
			titleDe: 'Herzen auffüllen',
			descriptionEn: 'Instantly refill all your hearts to 10. Keep learning without waiting!',
			descriptionDe: 'Fülle sofort alle deine Herzen auf 10 auf. Lerne weiter ohne zu warten!',
			costGems: 30,
			effectType: 'heart_refill',
			effectValue: 10,
			isActive: true
		},
		{
			key: 'xp_boost',
			titleEn: 'XP Boost',
			titleDe: 'XP-Boost',
			descriptionEn: 'Earn double XP for the next hour. Make every answer count!',
			descriptionDe: 'Verdiene eine Stunde lang doppelte XP. Jede Antwort zählt doppelt!',
			costGems: 100,
			effectType: 'xp_boost',
			effectValue: 2,
			isActive: true
		}
	];

	for (const item of items) {
		await db.insert(shopItems).values(item).onConflictDoNothing({ target: shopItems.key });
	}

	const all = await db.select().from(shopItems);
	console.log(`Done. ${all.length} shop items in database.`);

	await client.end();
}

seedShop().catch(console.error);
