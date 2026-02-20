import { drizzle } from 'drizzle-orm/postgres-js';
import { and, eq, inArray } from 'drizzle-orm';
import postgres from 'postgres';
import * as schema from '../src/lib/server/db/schema';
import { GRAMMAR_A1 as SPANISH_GRAMMAR_A1 } from '../src/lib/data/learning/spanish/grammar-points';
import { SPANISH_SKILL_GRAPH } from '../src/lib/data/learning/spanish/skill-graph';
import { GRAMMAR_A1 as ITALIAN_GRAMMAR_A1 } from '../src/lib/data/learning/italian/grammar-points';
import { ITALIAN_SKILL_GRAPH } from '../src/lib/data/learning/italian/skill-graph';
import { GRAMMAR_N5 as JAPANESE_GRAMMAR_N5 } from '../src/lib/data/learning/japanese/grammar-points';
import { JAPANESE_SKILL_GRAPH } from '../src/lib/data/learning/japanese/skill-graph';
import { HIRAGANA_BASE } from '../src/lib/data/learning/japanese/hiragana';
import { KATAKANA_BASE } from '../src/lib/data/learning/japanese/katakana';
import { KANJI_N5 } from '../src/lib/data/learning/japanese/kanji-n5';
import 'dotenv/config';

import type { SkillGraphDefinition, GrammarPointData } from '../src/lib/learning/types';
import type { ConceptType, SkillType } from '../src/lib/server/db/schema';

const { concepts, skills, skillConcepts, skillPrerequisites } = schema;

type SeedConcept = {
	key: string;
	type: ConceptType;
	titleEn: string;
	titleDe: string;
	descriptionEn: string;
	descriptionDe: string;
	cefrLevel: 'A1' | 'A2';
	order: number;
	data?: Record<string, unknown>;
};

type SeedLanguage = {
	code: 'es' | 'it' | 'ja';
	grammarPoints: GrammarPointData[];
	skillGraph: SkillGraphDefinition;
	vocabConcepts: SeedConcept[];
	extraConcepts: SeedConcept[];
};

const SPANISH_VOCAB_CONCEPTS: SeedConcept[] = [
	{
		key: 'es.vocab.hola',
		type: 'vocab',
		titleEn: 'hola',
		titleDe: 'hallo',
		descriptionEn: 'Common informal greeting.',
		descriptionDe: 'Haufige informelle Begrussung.',
		cefrLevel: 'A1',
		order: 1001
	},
	{
		key: 'es.vocab.buenos-dias',
		type: 'vocab',
		titleEn: 'buenos dias',
		titleDe: 'guten Morgen',
		descriptionEn: 'Polite morning greeting.',
		descriptionDe: 'Hofliche Begrussung am Morgen.',
		cefrLevel: 'A1',
		order: 1002
	},
	{
		key: 'es.vocab.adios',
		type: 'vocab',
		titleEn: 'adios',
		titleDe: 'auf Wiedersehen',
		descriptionEn: 'Standard farewell.',
		descriptionDe: 'Ubliche Verabschiedung.',
		cefrLevel: 'A1',
		order: 1003
	},
	{
		key: 'es.vocab.uno',
		type: 'vocab',
		titleEn: 'uno',
		titleDe: 'eins',
		descriptionEn: 'Number one.',
		descriptionDe: 'Die Zahl eins.',
		cefrLevel: 'A1',
		order: 1004
	},
	{
		key: 'es.vocab.dos',
		type: 'vocab',
		titleEn: 'dos',
		titleDe: 'zwei',
		descriptionEn: 'Number two.',
		descriptionDe: 'Die Zahl zwei.',
		cefrLevel: 'A1',
		order: 1005
	},
	{
		key: 'es.vocab.tres',
		type: 'vocab',
		titleEn: 'tres',
		titleDe: 'drei',
		descriptionEn: 'Number three.',
		descriptionDe: 'Die Zahl drei.',
		cefrLevel: 'A1',
		order: 1006
	},
	{
		key: 'es.vocab.madre',
		type: 'vocab',
		titleEn: 'madre',
		titleDe: 'Mutter',
		descriptionEn: 'Mother.',
		descriptionDe: 'Mutter.',
		cefrLevel: 'A1',
		order: 1007
	},
	{
		key: 'es.vocab.padre',
		type: 'vocab',
		titleEn: 'padre',
		titleDe: 'Vater',
		descriptionEn: 'Father.',
		descriptionDe: 'Vater.',
		cefrLevel: 'A1',
		order: 1008
	},
	{
		key: 'es.vocab.hermano',
		type: 'vocab',
		titleEn: 'hermano',
		titleDe: 'Bruder',
		descriptionEn: 'Brother.',
		descriptionDe: 'Bruder.',
		cefrLevel: 'A1',
		order: 1009
	},
	{
		key: 'es.vocab.pan',
		type: 'vocab',
		titleEn: 'pan',
		titleDe: 'Brot',
		descriptionEn: 'Bread.',
		descriptionDe: 'Brot.',
		cefrLevel: 'A1',
		order: 1010
	},
	{
		key: 'es.vocab.agua',
		type: 'vocab',
		titleEn: 'agua',
		titleDe: 'Wasser',
		descriptionEn: 'Water.',
		descriptionDe: 'Wasser.',
		cefrLevel: 'A1',
		order: 1011
	},
	{
		key: 'es.vocab.manzana',
		type: 'vocab',
		titleEn: 'manzana',
		titleDe: 'Apfel',
		descriptionEn: 'Apple.',
		descriptionDe: 'Apfel.',
		cefrLevel: 'A1',
		order: 1012
	}
];

const ITALIAN_VOCAB_CONCEPTS: SeedConcept[] = [
	{
		key: 'it.vocab.ciao',
		type: 'vocab',
		titleEn: 'ciao',
		titleDe: 'hallo/tschuss',
		descriptionEn: 'Informal hello or bye.',
		descriptionDe: 'Informelles Hallo oder Tschuss.',
		cefrLevel: 'A1',
		order: 1001
	},
	{
		key: 'it.vocab.buongiorno',
		type: 'vocab',
		titleEn: 'buongiorno',
		titleDe: 'guten Tag',
		descriptionEn: 'Polite daytime greeting.',
		descriptionDe: 'Hofliche Begrussung tagsuber.',
		cefrLevel: 'A1',
		order: 1002
	},
	{
		key: 'it.vocab.arrivederci',
		type: 'vocab',
		titleEn: 'arrivederci',
		titleDe: 'auf Wiedersehen',
		descriptionEn: 'Polite farewell.',
		descriptionDe: 'Hofliche Verabschiedung.',
		cefrLevel: 'A1',
		order: 1003
	},
	{
		key: 'it.vocab.uno',
		type: 'vocab',
		titleEn: 'uno',
		titleDe: 'eins',
		descriptionEn: 'Number one.',
		descriptionDe: 'Die Zahl eins.',
		cefrLevel: 'A1',
		order: 1004
	},
	{
		key: 'it.vocab.due',
		type: 'vocab',
		titleEn: 'due',
		titleDe: 'zwei',
		descriptionEn: 'Number two.',
		descriptionDe: 'Die Zahl zwei.',
		cefrLevel: 'A1',
		order: 1005
	},
	{
		key: 'it.vocab.tre',
		type: 'vocab',
		titleEn: 'tre',
		titleDe: 'drei',
		descriptionEn: 'Number three.',
		descriptionDe: 'Die Zahl drei.',
		cefrLevel: 'A1',
		order: 1006
	},
	{
		key: 'it.vocab.madre',
		type: 'vocab',
		titleEn: 'madre',
		titleDe: 'Mutter',
		descriptionEn: 'Mother.',
		descriptionDe: 'Mutter.',
		cefrLevel: 'A1',
		order: 1007
	},
	{
		key: 'it.vocab.padre',
		type: 'vocab',
		titleEn: 'padre',
		titleDe: 'Vater',
		descriptionEn: 'Father.',
		descriptionDe: 'Vater.',
		cefrLevel: 'A1',
		order: 1008
	},
	{
		key: 'it.vocab.fratello',
		type: 'vocab',
		titleEn: 'fratello',
		titleDe: 'Bruder',
		descriptionEn: 'Brother.',
		descriptionDe: 'Bruder.',
		cefrLevel: 'A1',
		order: 1009
	},
	{
		key: 'it.vocab.pane',
		type: 'vocab',
		titleEn: 'pane',
		titleDe: 'Brot',
		descriptionEn: 'Bread.',
		descriptionDe: 'Brot.',
		cefrLevel: 'A1',
		order: 1010
	},
	{
		key: 'it.vocab.acqua',
		type: 'vocab',
		titleEn: 'acqua',
		titleDe: 'Wasser',
		descriptionEn: 'Water.',
		descriptionDe: 'Wasser.',
		cefrLevel: 'A1',
		order: 1011
	},
	{
		key: 'it.vocab.mela',
		type: 'vocab',
		titleEn: 'mela',
		titleDe: 'Apfel',
		descriptionEn: 'Apple.',
		descriptionDe: 'Apfel.',
		cefrLevel: 'A1',
		order: 1012
	}
];

const SPANISH_EXTRA_CONCEPTS: SeedConcept[] = [
	{
		key: 'es.phonetics.vowels-basic',
		type: 'phonetic_sound',
		titleEn: 'Spanish vowels',
		titleDe: 'Spanische Vokale',
		descriptionEn: 'Five pure vowels: a, e, i, o, u with stable pronunciation.',
		descriptionDe: 'Funf reine Vokale: a, e, i, o, u mit stabiler Aussprache.',
		cefrLevel: 'A1',
		order: 1200
	},
	{
		key: 'es.grammar.past-preterite',
		type: 'grammar_rule',
		titleEn: 'Preterite basics',
		titleDe: 'Grundlagen Pretorito',
		descriptionEn: 'Completed actions in the past with clear time boundaries.',
		descriptionDe: 'Abgeschlossene Handlungen in der Vergangenheit mit klarem Zeitrahmen.',
		cefrLevel: 'A2',
		order: 1201
	},
	{
		key: 'es.grammar.past-imperfect',
		type: 'grammar_rule',
		titleEn: 'Imperfect basics',
		titleDe: 'Grundlagen Imperfekt',
		descriptionEn: 'Background situations, habitual actions, and descriptions in the past.',
		descriptionDe: 'Hintergrunde, Gewohnheiten und Beschreibungen in der Vergangenheit.',
		cefrLevel: 'A2',
		order: 1202
	}
];

const ITALIAN_EXTRA_CONCEPTS: SeedConcept[] = [
	{
		key: 'it.phonetics.vowels-basic',
		type: 'phonetic_sound',
		titleEn: 'Italian vowels',
		titleDe: 'Italienische Vokale',
		descriptionEn: 'Clear vowels a, e, i, o, u with strong syllable rhythm.',
		descriptionDe: 'Klare Vokale a, e, i, o, u mit deutlichem Silbenrhythmus.',
		cefrLevel: 'A1',
		order: 1200
	},
	{
		key: 'it.grammar.past-passato-prossimo',
		type: 'grammar_rule',
		titleEn: 'Passato prossimo basics',
		titleDe: 'Grundlagen Passato Prossimo',
		descriptionEn: 'Completed past events with avere/essere plus participle.',
		descriptionDe: 'Abgeschlossene Vergangenheit mit avere/essere und Partizip.',
		cefrLevel: 'A2',
		order: 1201
	},
	{
		key: 'it.grammar.past-imperfetto',
		type: 'grammar_rule',
		titleEn: 'Imperfetto basics',
		titleDe: 'Grundlagen Imperfetto',
		descriptionEn: 'Past background, repeated actions, and ongoing situations.',
		descriptionDe: 'Vergangenes Hintergrundgeschehen, Wiederholungen und andauernde Zustande.',
		cefrLevel: 'A2',
		order: 1202
	}
];

// --- Japanese concept builders ---

function buildHiraganaConcepts(): SeedConcept[] {
	return HIRAGANA_BASE.map((h) => ({
		key: `ja.hira.${h.romaji}`,
		type: 'writing_char' as ConceptType,
		titleEn: `${h.char} (${h.romaji})`,
		titleDe: `${h.char} (${h.romaji})`,
		descriptionEn: h.mnemonicEn,
		descriptionDe: h.mnemonicDe,
		cefrLevel: 'A1' as const,
		order: h.order,
		data: { char: h.char, romaji: h.romaji, strokeCount: h.strokeCount, row: h.row }
	}));
}

function buildKatakanaConcepts(): SeedConcept[] {
	return KATAKANA_BASE.map((k) => ({
		key: `ja.kata.${k.romaji}`,
		type: 'writing_char' as ConceptType,
		titleEn: `${k.char} (${k.romaji})`,
		titleDe: `${k.char} (${k.romaji})`,
		descriptionEn: k.mnemonicEn,
		descriptionDe: k.mnemonicDe,
		cefrLevel: 'A1' as const,
		order: 100 + k.order,
		data: { char: k.char, romaji: k.romaji, strokeCount: k.strokeCount, row: k.row }
	}));
}

const KANJI_KEY_MAP: Record<string, string> = {
	一: 'ichi',
	二: 'ni',
	三: 'san',
	四: 'yon',
	五: 'go',
	六: 'rok',
	七: 'nana',
	八: 'hachi',
	九: 'kyuu',
	十: 'juu',
	百: 'hyaku',
	千: 'sen',
	万: 'man',
	円: 'en',
	日: 'nichi',
	月: 'getsu',
	火: 'ka',
	水: 'sui',
	木: 'moku',
	金: 'kin'
};

function buildKanjiConcepts(): SeedConcept[] {
	return KANJI_N5.slice(0, 20).map((k) => {
		const slug = KANJI_KEY_MAP[k.char] ?? k.meanings[0].toLowerCase().replace(/\s+/g, '-');
		return {
			key: `ja.kanji.${slug}`,
			type: 'kanji' as ConceptType,
			titleEn: `${k.char} (${k.meanings.join(', ')})`,
			titleDe: `${k.char} (${k.meanings.join(', ')})`,
			descriptionEn: `Kanji for ${k.meanings.join('/')} with ${k.strokeCount} strokes.`,
			descriptionDe: `Kanji fuer ${k.meanings.join('/')} mit ${k.strokeCount} Strichen.`,
			cefrLevel: 'A2' as const,
			order: 200 + k.order,
			data: {
				char: k.char,
				meanings: k.meanings,
				readingsOn: k.readingsOn,
				readingsKun: k.readingsKun,
				strokeCount: k.strokeCount,
				radicals: k.radicals
			}
		};
	});
}

const JAPANESE_VOCAB_CONCEPTS: SeedConcept[] = [
	{
		key: 'ja.vocab.ohayou',
		type: 'vocab',
		titleEn: 'ohayou gozaimasu',
		titleDe: 'guten Morgen',
		descriptionEn: 'Polite morning greeting.',
		descriptionDe: 'Hoefliche Morgenbegrussung.',
		cefrLevel: 'A1',
		order: 1001
	},
	{
		key: 'ja.vocab.konnichiwa',
		type: 'vocab',
		titleEn: 'konnichiwa',
		titleDe: 'guten Tag',
		descriptionEn: 'Standard daytime greeting.',
		descriptionDe: 'Standardbegrussung tagsueber.',
		cefrLevel: 'A1',
		order: 1002
	},
	{
		key: 'ja.vocab.konbanwa',
		type: 'vocab',
		titleEn: 'konbanwa',
		titleDe: 'guten Abend',
		descriptionEn: 'Evening greeting.',
		descriptionDe: 'Abendbegrussung.',
		cefrLevel: 'A1',
		order: 1003
	},
	{
		key: 'ja.vocab.arigatou',
		type: 'vocab',
		titleEn: 'arigatou gozaimasu',
		titleDe: 'vielen Dank',
		descriptionEn: 'Polite thank you.',
		descriptionDe: 'Hoefliches Dankeschoen.',
		cefrLevel: 'A1',
		order: 1004
	}
];

const JAPANESE_NUMBER_CONCEPTS: SeedConcept[] = [
	{
		key: 'ja.num.ichi',
		type: 'vocab',
		titleEn: 'ichi (1)',
		titleDe: 'ichi (1)',
		descriptionEn: 'Number one.',
		descriptionDe: 'Die Zahl eins.',
		cefrLevel: 'A1',
		order: 1010
	},
	{
		key: 'ja.num.ni',
		type: 'vocab',
		titleEn: 'ni (2)',
		titleDe: 'ni (2)',
		descriptionEn: 'Number two.',
		descriptionDe: 'Die Zahl zwei.',
		cefrLevel: 'A1',
		order: 1011
	},
	{
		key: 'ja.num.san',
		type: 'vocab',
		titleEn: 'san (3)',
		titleDe: 'san (3)',
		descriptionEn: 'Number three.',
		descriptionDe: 'Die Zahl drei.',
		cefrLevel: 'A1',
		order: 1012
	},
	{
		key: 'ja.num.yon',
		type: 'vocab',
		titleEn: 'yon (4)',
		titleDe: 'yon (4)',
		descriptionEn: 'Number four.',
		descriptionDe: 'Die Zahl vier.',
		cefrLevel: 'A1',
		order: 1013
	},
	{
		key: 'ja.num.go',
		type: 'vocab',
		titleEn: 'go (5)',
		titleDe: 'go (5)',
		descriptionEn: 'Number five.',
		descriptionDe: 'Die Zahl fuenf.',
		cefrLevel: 'A1',
		order: 1014
	},
	{
		key: 'ja.num.rok',
		type: 'vocab',
		titleEn: 'roku (6)',
		titleDe: 'roku (6)',
		descriptionEn: 'Number six.',
		descriptionDe: 'Die Zahl sechs.',
		cefrLevel: 'A1',
		order: 1015
	},
	{
		key: 'ja.num.nana',
		type: 'vocab',
		titleEn: 'nana (7)',
		titleDe: 'nana (7)',
		descriptionEn: 'Number seven.',
		descriptionDe: 'Die Zahl sieben.',
		cefrLevel: 'A1',
		order: 1016
	},
	{
		key: 'ja.num.hachi',
		type: 'vocab',
		titleEn: 'hachi (8)',
		titleDe: 'hachi (8)',
		descriptionEn: 'Number eight.',
		descriptionDe: 'Die Zahl acht.',
		cefrLevel: 'A1',
		order: 1017
	},
	{
		key: 'ja.num.kyuu',
		type: 'vocab',
		titleEn: 'kyuu (9)',
		titleDe: 'kyuu (9)',
		descriptionEn: 'Number nine.',
		descriptionDe: 'Die Zahl neun.',
		cefrLevel: 'A1',
		order: 1018
	},
	{
		key: 'ja.num.juu',
		type: 'vocab',
		titleEn: 'juu (10)',
		titleDe: 'juu (10)',
		descriptionEn: 'Number ten.',
		descriptionDe: 'Die Zahl zehn.',
		cefrLevel: 'A1',
		order: 1019
	}
];

const JAPANESE_EXTRA_CONCEPTS: SeedConcept[] = [];

const LANGUAGES: SeedLanguage[] = [
	{
		code: 'es',
		grammarPoints: SPANISH_GRAMMAR_A1,
		skillGraph: SPANISH_SKILL_GRAPH,
		vocabConcepts: SPANISH_VOCAB_CONCEPTS,
		extraConcepts: SPANISH_EXTRA_CONCEPTS
	},
	{
		code: 'it',
		grammarPoints: ITALIAN_GRAMMAR_A1,
		skillGraph: ITALIAN_SKILL_GRAPH,
		vocabConcepts: ITALIAN_VOCAB_CONCEPTS,
		extraConcepts: ITALIAN_EXTRA_CONCEPTS
	},
	{
		code: 'ja',
		grammarPoints: JAPANESE_GRAMMAR_N5,
		skillGraph: JAPANESE_SKILL_GRAPH,
		vocabConcepts: [...JAPANESE_VOCAB_CONCEPTS, ...JAPANESE_NUMBER_CONCEPTS],
		extraConcepts: [
			...buildHiraganaConcepts(),
			...buildKatakanaConcepts(),
			...buildKanjiConcepts(),
			...JAPANESE_EXTRA_CONCEPTS
		]
	}
];

function buildGrammarConcepts(grammarPoints: GrammarPointData[]): SeedConcept[] {
	return grammarPoints.map((point) => ({
		key: point.key,
		type: 'grammar_rule',
		titleEn: point.titleEn,
		titleDe: point.titleDe,
		descriptionEn: point.explanationEn,
		descriptionDe: point.explanationDe,
		cefrLevel: (point.cefrLevel === 'A2' ? 'A2' : 'A1') as 'A1' | 'A2',
		order: point.order,
		data: {
			pattern: point.pattern,
			examples: point.examples
		}
	}));
}

function uniqueByKey(items: SeedConcept[]): SeedConcept[] {
	const map = new Map<string, SeedConcept>();
	for (const item of items) {
		map.set(item.key, item);
	}
	return [...map.values()];
}

async function seedLanguageContent(db: ReturnType<typeof drizzle>, language: SeedLanguage) {
	console.log(`\n🌍 Seeding learning content for ${language.code}...`);

	const conceptRows = uniqueByKey([
		...buildGrammarConcepts(language.grammarPoints),
		...language.vocabConcepts,
		...language.extraConcepts
	]);

	if (conceptRows.length > 0) {
		await db
			.insert(concepts)
			.values(
				conceptRows.map((concept) => ({
					languageCode: language.code,
					type: concept.type,
					key: concept.key,
					titleEn: concept.titleEn,
					titleDe: concept.titleDe,
					descriptionEn: concept.descriptionEn,
					descriptionDe: concept.descriptionDe,
					data: concept.data ?? {},
					cefrLevel: concept.cefrLevel,
					order: concept.order
				}))
			)
			.onConflictDoNothing();
	}
	console.log(`   ✓ Concepts upserted (insert-if-missing): ${conceptRows.length}`);

	const skillRows = language.skillGraph.skills;
	await db
		.insert(skills)
		.values(
			skillRows.map((skill) => ({
				languageCode: language.code,
				type: skill.type as SkillType,
				key: skill.key,
				titleEn: skill.titleEn,
				titleDe: skill.titleDe,
				descriptionEn: skill.descriptionEn,
				descriptionDe: skill.descriptionDe,
				cefrLevel: skill.cefrLevel as 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2',
				iconName: skill.iconName ?? null,
				order: skill.order
			}))
		)
		.onConflictDoNothing();
	console.log(`   ✓ Skills upserted (insert-if-missing): ${skillRows.length}`);

	const conceptKeySet = new Set(skillRows.flatMap((skill) => skill.conceptKeys));
	const skillKeySet = new Set(skillRows.map((skill) => skill.key));
	const prerequisiteKeys = new Set(language.skillGraph.prerequisites.map((p) => p.prerequisiteKey));

	const allSkillKeys = [...new Set([...skillKeySet, ...prerequisiteKeys])];

	const [dbSkills, dbConcepts] = await Promise.all([
		db
			.select()
			.from(skills)
			.where(and(eq(skills.languageCode, language.code), inArray(skills.key, allSkillKeys))),
		db
			.select()
			.from(concepts)
			.where(
				and(eq(concepts.languageCode, language.code), inArray(concepts.key, [...conceptKeySet]))
			)
	]);

	const skillIdByKey = new Map(dbSkills.map((s) => [s.key, s.id]));
	const conceptIdByKey = new Map(dbConcepts.map((c) => [c.key, c.id]));

	const skillConceptRows: Array<{
		skillId: number;
		conceptId: number;
		role: string;
		weight: number;
	}> = [];
	for (const skill of skillRows) {
		const skillId = skillIdByKey.get(skill.key);
		if (!skillId) {
			continue;
		}

		for (const conceptKey of skill.conceptKeys) {
			const conceptId = conceptIdByKey.get(conceptKey);
			if (!conceptId) {
				console.warn(`   ⚠ Missing concept key for link: ${conceptKey}`);
				continue;
			}

			skillConceptRows.push({ skillId, conceptId, role: 'core', weight: 1 });
		}
	}

	if (skillConceptRows.length > 0) {
		await db.insert(skillConcepts).values(skillConceptRows).onConflictDoNothing();
	}
	console.log(`   ✓ Skill-concept links upserted: ${skillConceptRows.length}`);

	const prerequisiteRows: Array<{
		skillId: number;
		prerequisiteSkillId: number;
		minMastery: number;
	}> = [];
	for (const prereq of language.skillGraph.prerequisites) {
		const skillId = skillIdByKey.get(prereq.skillKey);
		const prerequisiteSkillId = skillIdByKey.get(prereq.prerequisiteKey);

		if (!skillId || !prerequisiteSkillId) {
			console.warn(
				`   ⚠ Missing skill key for prerequisite link: ${prereq.skillKey} <- ${prereq.prerequisiteKey}`
			);
			continue;
		}

		prerequisiteRows.push({
			skillId,
			prerequisiteSkillId,
			minMastery: prereq.minMastery ?? 0.8
		});
	}

	if (prerequisiteRows.length > 0) {
		await db.insert(skillPrerequisites).values(prerequisiteRows).onConflictDoNothing();
	}
	console.log(`   ✓ Skill prerequisite links upserted: ${prerequisiteRows.length}`);
}

async function seed() {
	const databaseUrl = process.env.DATABASE_URL;
	if (!databaseUrl) {
		throw new Error('DATABASE_URL is not set');
	}

	const client = postgres(databaseUrl);
	const db = drizzle(client, { schema });

	console.log('🌱 Starting additive learning-content seed...');

	for (const language of LANGUAGES) {
		await seedLanguageContent(db, language);
	}

	console.log('\n🎉 Learning content seed finished (additive, idempotent).');
	await client.end();
	process.exit(0);
}

seed().catch((error) => {
	console.error('❌ Learning-content seed failed:', error);
	process.exit(1);
});
