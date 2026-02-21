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
import type { ConceptType, SkillType, QuestionType } from '../src/lib/server/db/schema';

const {
	concepts,
	skills,
	skillConcepts,
	skillPrerequisites,
	levels,
	units,
	lessons,
	questions,
	questionConcepts,
	lessonSkills
} = schema;

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
		descriptionDe: 'Häufige informelle Begrüßung.',
		cefrLevel: 'A1',
		order: 1001
	},
	{
		key: 'es.vocab.buenos-dias',
		type: 'vocab',
		titleEn: 'buenos dias',
		titleDe: 'guten Morgen',
		descriptionEn: 'Polite morning greeting.',
		descriptionDe: 'Höfliche Begrüßung am Morgen.',
		cefrLevel: 'A1',
		order: 1002
	},
	{
		key: 'es.vocab.adios',
		type: 'vocab',
		titleEn: 'adios',
		titleDe: 'auf Wiedersehen',
		descriptionEn: 'Standard farewell.',
		descriptionDe: 'Übliche Verabschiedung.',
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
		titleDe: 'hallo/tschüss',
		descriptionEn: 'Informal hello or bye.',
		descriptionDe: 'Informelles Hallo oder Tschüss.',
		cefrLevel: 'A1',
		order: 1001
	},
	{
		key: 'it.vocab.buongiorno',
		type: 'vocab',
		titleEn: 'buongiorno',
		titleDe: 'guten Tag',
		descriptionEn: 'Polite daytime greeting.',
		descriptionDe: 'Höfliche Begrüßung tagsüber.',
		cefrLevel: 'A1',
		order: 1002
	},
	{
		key: 'it.vocab.arrivederci',
		type: 'vocab',
		titleEn: 'arrivederci',
		titleDe: 'auf Wiedersehen',
		descriptionEn: 'Polite farewell.',
		descriptionDe: 'Höfliche Verabschiedung.',
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
		descriptionDe: 'Fünf reine Vokale: a, e, i, o, u mit stabiler Aussprache.',
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
		descriptionDe: 'Hintergründe, Gewohnheiten und Beschreibungen in der Vergangenheit.',
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
		descriptionDe: 'Vergangenes Hintergrundgeschehen, Wiederholungen und andauernde Zustände.',
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
			descriptionDe: `Kanji für ${k.meanings.join('/')} mit ${k.strokeCount} Strichen.`,
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
		descriptionDe: 'Höfliche Morgenbegrüßung.',
		cefrLevel: 'A1',
		order: 1001
	},
	{
		key: 'ja.vocab.konnichiwa',
		type: 'vocab',
		titleEn: 'konnichiwa',
		titleDe: 'guten Tag',
		descriptionEn: 'Standard daytime greeting.',
		descriptionDe: 'Standardbegrüßung tagsüber.',
		cefrLevel: 'A1',
		order: 1002
	},
	{
		key: 'ja.vocab.konbanwa',
		type: 'vocab',
		titleEn: 'konbanwa',
		titleDe: 'guten Abend',
		descriptionEn: 'Evening greeting.',
		descriptionDe: 'Abendbegrüßung.',
		cefrLevel: 'A1',
		order: 1003
	},
	{
		key: 'ja.vocab.arigatou',
		type: 'vocab',
		titleEn: 'arigatou gozaimasu',
		titleDe: 'vielen Dank',
		descriptionEn: 'Polite thank you.',
		descriptionDe: 'Höfliches Dankeschön.',
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
		descriptionDe: 'Die Zahl fünf.',
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

type SupportedDrillQuestionType = Extract<
	QuestionType,
	'multiple_choice' | 'fill_blank' | 'translation' | 'matching' | 'word_order'
>;

type QuestionDraft = {
	type: SupportedDrillQuestionType;
	content: Record<string, unknown>;
	correctAnswer: string;
};

type SeedableConceptRow = {
	id: number;
	key: string;
	titleEn: string;
	titleDe: string;
	data: Record<string, unknown>;
};

const LANGUAGE_NAMES: Record<'es' | 'it', string> = {
	es: 'Spanish',
	it: 'Italian'
};

const LANGUAGE_UNIT_COPY: Record<'es' | 'it', { title: string; description: string }> = {
	es: {
		title: 'Spanish Skill Tree A1',
		description: 'Guided skill drills for Spanish A1 concepts'
	},
	it: {
		title: 'Italian Skill Tree A1',
		description: 'Guided skill drills for Italian A1 concepts'
	}
};

function selectDistractors(correct: string, pool: string[], count: number): string[] {
	const unique: string[] = [];
	for (const candidate of pool) {
		if (candidate === correct || unique.includes(candidate)) {
			continue;
		}
		unique.push(candidate);
		if (unique.length >= count) {
			break;
		}
	}
	return unique;
}

function parseGrammarData(concept: SeedableConceptRow): {
	pattern: string;
	examples: GrammarPointData['examples'];
} {
	const rawPattern = concept.data.pattern;
	const pattern = typeof rawPattern === 'string' ? rawPattern : concept.titleEn;

	const rawExamples = concept.data.examples;
	if (!Array.isArray(rawExamples)) {
		return { pattern, examples: [] };
	}

	const examples: GrammarPointData['examples'] = rawExamples
		.filter(
			(example): example is { target: string; en: string; de: string } =>
				typeof example === 'object' &&
				example !== null &&
				typeof (example as { target?: unknown }).target === 'string' &&
				typeof (example as { en?: unknown }).en === 'string' &&
				typeof (example as { de?: unknown }).de === 'string'
		)
		.map((example) => ({
			target: example.target,
			en: example.en,
			de: example.de
		}));

	return { pattern, examples };
}

function buildVocabQuestionDrafts(
	concept: SeedableConceptRow,
	languageCode: 'es' | 'it',
	vocabPool: SeedableConceptRow[]
): QuestionDraft[] {
	const languageName = LANGUAGE_NAMES[languageCode];
	const targetWord = concept.titleEn;
	const nativeWord = concept.titleDe;
	const distractorWords = selectDistractors(
		targetWord,
		vocabPool.map((c) => c.titleEn),
		3
	);
	const options = [targetWord, ...distractorWords];

	return [
		{
			type: 'multiple_choice',
			content: {
				questionEn: `Choose the ${languageName} word for "${nativeWord}".`,
				questionDe: `Wähle das ${languageName}-Wort für „${nativeWord}".`,
				options
			},
			correctAnswer: targetWord
		},
		{
			type: 'translation',
			content: {
				text: targetWord,
				direction: 'target_to_native',
				targetLanguageName: languageName
			},
			correctAnswer: `${nativeWord}|${targetWord}`
		},
		{
			type: 'translation',
			content: {
				textEn: nativeWord,
				textDe: nativeWord,
				direction: 'native_to_target',
				targetLanguageName: languageName
			},
			correctAnswer: targetWord
		},
		{
			type: 'fill_blank',
			content: {
				sentenceEn: `Complete the ${languageName} word: _____ = "${nativeWord}".`,
				sentenceDe: `Ergänze das ${languageName}-Wort: _____ = „${nativeWord}".`,
				hintEn: `Use the ${languageName} translation for "${nativeWord}".`,
				hintDe: `Nutze die ${languageName}-Übersetzung für „${nativeWord}".`
			},
			correctAnswer: targetWord
		}
	];
}

function buildGrammarQuestionDrafts(
	concept: SeedableConceptRow,
	languageCode: 'es' | 'it',
	grammarPool: SeedableConceptRow[]
): QuestionDraft[] {
	const languageName = LANGUAGE_NAMES[languageCode];
	const { pattern, examples } = parseGrammarData(concept);
	const primaryExample =
		examples[0] ??
		({
			target: concept.titleEn,
			en: concept.titleEn,
			de: concept.titleDe
		} as const);

	const exampleDistractors = selectDistractors(
		primaryExample.target,
		grammarPool.flatMap((g) => parseGrammarData(g).examples.map((ex) => ex.target)),
		3
	);
	const grammarTitleDistractors = selectDistractors(
		concept.titleEn,
		grammarPool.map((g) => g.titleEn),
		3
	);

	const blankAnswer = primaryExample.target.split(/\s+/)[0] ?? concept.titleEn;
	const blankSentence = primaryExample.target.replace(blankAnswer, '_____');

	return [
		{
			type: 'multiple_choice',
			content: {
				questionEn: `Which ${languageName} sentence means "${primaryExample.en}"?`,
				questionDe: `Welcher ${languageName}-Satz bedeutet „${primaryExample.de}"?`,
				options:
					exampleDistractors.length >= 2
						? [primaryExample.target, ...exampleDistractors]
						: [concept.titleEn, ...grammarTitleDistractors]
			},
			correctAnswer: exampleDistractors.length >= 2 ? primaryExample.target : concept.titleEn
		},
		{
			type: 'fill_blank',
			content: {
				sentenceEn: blankSentence.includes('_____')
					? blankSentence
					: '_____ ' + primaryExample.target,
				sentenceDe: blankSentence.includes('_____')
					? blankSentence
					: '_____ ' + primaryExample.target,
				hintEn: `Pattern: ${pattern}`,
				hintDe: `Muster: ${pattern}`
			},
			correctAnswer: blankAnswer
		},
		{
			type: 'translation',
			content: {
				textEn: primaryExample.en,
				textDe: primaryExample.de,
				direction: 'native_to_target',
				targetLanguageName: languageName
			},
			correctAnswer: primaryExample.target
		}
	];
}

function buildPhoneticQuestionDrafts(
	concept: SeedableConceptRow,
	languageCode: 'es' | 'it'
): QuestionDraft[] {
	const languageName = LANGUAGE_NAMES[languageCode];

	return [
		{
			type: 'multiple_choice',
			content: {
				questionEn: `Which option is a core ${languageName} vowel sound?`,
				questionDe: `Welche Option ist ein zentraler ${languageName}-Vokal?`,
				options: ['a', 'b', 'd', 'g']
			},
			correctAnswer: 'a'
		},
		{
			type: 'multiple_choice',
			content: {
				questionEn: `Which group matches the basic vowels for ${concept.titleEn}?`,
				questionDe: `Welche Gruppe passt zu den Grundvokalen für ${concept.titleDe}?`,
				options: ['a, e, i, o, u', 'a, e, i, o, y', 'a, e, o, b, u', 'a, i, o, u, n']
			},
			correctAnswer: 'a, e, i, o, u'
		},
		{
			type: 'multiple_choice',
			content: {
				questionEn: `Which letter gives the close back vowel in beginner ${languageName}?`,
				questionDe: `Welcher Buchstabe gibt den hinteren geschlossenen Vokal im ${languageName}-Einstieg?`,
				options: ['u', 'j', 'c', 'r']
			},
			correctAnswer: 'u'
		}
	];
}

async function ensureLanguageQuestionUnit(
	db: ReturnType<typeof drizzle>,
	languageCode: 'es' | 'it'
) {
	const [existingLevel] = await db
		.select({ id: levels.id })
		.from(levels)
		.where(and(eq(levels.languageCode, languageCode), eq(levels.code, 'A1')))
		.limit(1);

	let levelId: number;
	if (existingLevel) {
		levelId = existingLevel.id;
	} else {
		const [inserted] = await db
			.insert(levels)
			.values({ code: 'A1', languageCode, name: 'Beginner', order: 1 })
			.onConflictDoNothing()
			.returning();

		if (inserted) {
			levelId = inserted.id;
		} else {
			const [fallback] = await db
				.select({ id: levels.id })
				.from(levels)
				.where(and(eq(levels.languageCode, languageCode), eq(levels.code, 'A1')))
				.limit(1);
			levelId = fallback.id;
		}
	}

	const [existingUnit] = await db
		.select({ id: units.id })
		.from(units)
		.where(and(eq(units.levelId, levelId), eq(units.order, 1)))
		.limit(1);

	if (existingUnit) {
		return existingUnit.id;
	}

	const unitCopy = LANGUAGE_UNIT_COPY[languageCode];
	const [insertedUnit] = await db
		.insert(units)
		.values({
			levelId,
			title: unitCopy.title,
			description: unitCopy.description,
			order: 1
		})
		.returning();

	return insertedUnit.id;
}

async function seedLanguageQuestions(
	db: ReturnType<typeof drizzle>,
	languageCode: 'es' | 'it',
	skillGraph: SkillGraphDefinition
) {
	console.log(`\n🌱 Seeding ${languageCode.toUpperCase()} guided-skill questions...`);

	const unitId = await ensureLanguageQuestionUnit(db, languageCode);

	const [dbSkills, dbConcepts] = await Promise.all([
		db
			.select({ id: skills.id, key: skills.key })
			.from(skills)
			.where(eq(skills.languageCode, languageCode)),
		db
			.select({
				id: concepts.id,
				key: concepts.key,
				titleEn: concepts.titleEn,
				titleDe: concepts.titleDe,
				data: concepts.data
			})
			.from(concepts)
			.where(eq(concepts.languageCode, languageCode))
	]);

	const conceptRows: SeedableConceptRow[] = dbConcepts.map((concept) => ({
		id: concept.id,
		key: concept.key,
		titleEn: concept.titleEn,
		titleDe: concept.titleDe,
		data:
			typeof concept.data === 'object' && concept.data !== null
				? (concept.data as Record<string, unknown>)
				: {}
	}));

	const skillIdByKey = new Map(dbSkills.map((skill) => [skill.key, skill.id]));
	const conceptByKey = new Map(conceptRows.map((concept) => [concept.key, concept]));
	const allVocabConcepts = conceptRows.filter((concept) =>
		concept.key.startsWith(`${languageCode}.vocab.`)
	);
	const allGrammarConcepts = conceptRows.filter((concept) =>
		concept.key.startsWith(`${languageCode}.grammar.`)
	);

	let totalQuestions = 0;
	let totalLinks = 0;

	for (const skill of skillGraph.skills) {
		const skillId = skillIdByKey.get(skill.key);
		if (!skillId) {
			console.warn(`   ⚠ Skill not found in DB: ${skill.key}`);
			continue;
		}

		const [existingLesson] = await db
			.select({ id: lessons.id })
			.from(lessons)
			.innerJoin(lessonSkills, eq(lessonSkills.lessonId, lessons.id))
			.where(eq(lessonSkills.skillId, skillId))
			.limit(1);

		let lessonId: number;
		if (existingLesson) {
			lessonId = existingLesson.id;
		} else {
			const [insertedLesson] = await db
				.insert(lessons)
				.values({
					unitId,
					title: JSON.stringify({ en: skill.titleEn, de: skill.titleDe }),
					description: JSON.stringify({ en: skill.descriptionEn, de: skill.descriptionDe }),
					xpReward: 15,
					order: skill.order,
					isPublished: true,
					mode: 'guided_skill'
				})
				.returning();
			lessonId = insertedLesson.id;

			await db
				.insert(lessonSkills)
				.values({ lessonId, skillId, role: 'primary' })
				.onConflictDoNothing();
		}

		const existingLessonQuestions = await db
			.select({ order: questions.order })
			.from(questions)
			.where(eq(questions.lessonId, lessonId));

		let nextQuestionOrder =
			existingLessonQuestions.length > 0
				? Math.max(...existingLessonQuestions.map((question) => question.order)) + 1
				: 1;

		const skillConcepts = skill.conceptKeys
			.map((conceptKey) => conceptByKey.get(conceptKey))
			.filter((concept): concept is SeedableConceptRow => !!concept);
		const skillVocabPool = skillConcepts.filter((concept) =>
			concept.key.startsWith(`${languageCode}.vocab.`)
		);

		for (const concept of skillConcepts) {
			const [existingForConcept] = await db
				.select({ id: questions.id })
				.from(questions)
				.innerJoin(questionConcepts, eq(questionConcepts.questionId, questions.id))
				.where(eq(questionConcepts.conceptId, concept.id))
				.limit(1);

			if (existingForConcept) {
				continue;
			}

			const questionDrafts = concept.key.startsWith(`${languageCode}.vocab.`)
				? buildVocabQuestionDrafts(
						concept,
						languageCode,
						skillVocabPool.length >= 2 ? skillVocabPool : allVocabConcepts
					)
				: concept.key.startsWith(`${languageCode}.grammar.`)
					? buildGrammarQuestionDrafts(concept, languageCode, allGrammarConcepts)
					: concept.key.startsWith(`${languageCode}.phonetics.`)
						? buildPhoneticQuestionDrafts(concept, languageCode)
						: [];

			for (const draft of questionDrafts) {
				const [insertedQuestion] = await db
					.insert(questions)
					.values({
						lessonId,
						type: draft.type,
						content: draft.content,
						correctAnswer: draft.correctAnswer,
						order: nextQuestionOrder
					})
					.returning();

				nextQuestionOrder += 1;

				await db
					.insert(questionConcepts)
					.values({ questionId: insertedQuestion.id, conceptId: concept.id })
					.onConflictDoNothing();

				totalQuestions += 1;
				totalLinks += 1;
			}
		}
	}

	console.log(`   ✓ Questions inserted: ${totalQuestions}`);
	console.log(`   ✓ Question-concept links: ${totalLinks}`);
}

async function seedSpanishQuestions(db: ReturnType<typeof drizzle>) {
	await seedLanguageQuestions(db, 'es', SPANISH_SKILL_GRAPH);
}

async function seedItalianQuestions(db: ReturnType<typeof drizzle>) {
	await seedLanguageQuestions(db, 'it', ITALIAN_SKILL_GRAPH);
}

type HiraganaChar = {
	char: string;
	romaji: string;
	row: string;
	mnemonicEn: string;
	mnemonicDe: string;
};

function buildQuestionsForChar(
	char: HiraganaChar,
	allCharsInRow: HiraganaChar[],
	allHiragana: HiraganaChar[]
): Array<{ type: string; content: Record<string, unknown>; correctAnswer: string; order: number }> {
	const distractors = allHiragana
		.filter((h) => h.romaji !== char.romaji)
		.sort(() => Math.random() - 0.5)
		.slice(0, 3)
		.map((h) => h.romaji);

	const charDistractors = allHiragana
		.filter((h) => h.char !== char.char)
		.sort(() => Math.random() - 0.5)
		.slice(0, 3)
		.map((h) => h.char);

	const options = [char.romaji, ...distractors].sort(() => Math.random() - 0.5);
	const charOptions = [char.char, ...charDistractors].sort(() => Math.random() - 0.5);

	return [
		{
			type: 'character_recognition',
			content: {
				character: char.char,
				characterType: 'hiragana',
				options
			},
			correctAnswer: char.romaji,
			order: 1
		},
		{
			type: 'character_recognition',
			content: {
				character: char.char,
				characterType: 'hiragana',
				options: options.slice().reverse()
			},
			correctAnswer: char.romaji,
			order: 2
		},
		{
			type: 'character_writing',
			content: {
				reading: char.romaji,
				characterType: 'hiragana',
				hintEn: char.mnemonicEn,
				hintDe: char.mnemonicDe
			},
			correctAnswer: char.char,
			order: 3
		},
		{
			type: 'script_transliteration',
			content: {
				sourceText: char.char,
				sourceScript: 'hiragana',
				targetScript: 'romaji'
			},
			correctAnswer: char.romaji,
			order: 4
		},
		{
			type: 'script_transliteration',
			content: {
				sourceText: char.romaji,
				sourceScript: 'romaji',
				targetScript: 'hiragana'
			},
			correctAnswer: char.char,
			order: 5
		},
		{
			type: 'multiple_choice',
			content: {
				questionEn: `Which hiragana represents "${char.romaji}"?`,
				questionDe: `Welches Hiragana steht für „${char.romaji}"?`,
				options: charOptions
			},
			correctAnswer: char.char,
			order: 6
		}
	];
}

async function seedJapaneseQuestions(db: ReturnType<typeof drizzle>) {
	console.log('\n🇯🇵 Seeding Japanese questions...');

	const [existingLevel] = await db
		.select({ id: levels.id })
		.from(levels)
		.where(and(eq(levels.languageCode, 'ja'), eq(levels.code, 'A1')))
		.limit(1);

	let levelId: number;
	if (existingLevel) {
		levelId = existingLevel.id;
	} else {
		const [inserted] = await db
			.insert(levels)
			.values({ code: 'A1', languageCode: 'ja', name: 'Beginner', order: 1 })
			.onConflictDoNothing()
			.returning();
		if (!inserted) {
			const [fallback] = await db
				.select({ id: levels.id })
				.from(levels)
				.where(and(eq(levels.languageCode, 'ja'), eq(levels.code, 'A1')))
				.limit(1);
			levelId = fallback.id;
		} else {
			levelId = inserted.id;
		}
	}

	const [existingUnit] = await db
		.select({ id: units.id })
		.from(units)
		.where(eq(units.levelId, levelId))
		.limit(1);

	let unitId: number;
	if (existingUnit) {
		unitId = existingUnit.id;
	} else {
		const [inserted] = await db
			.insert(units)
			.values({ levelId, title: 'Hiragana', description: 'Learn hiragana characters', order: 1 })
			.returning();
		unitId = inserted.id;
	}

	const skillGraph = JAPANESE_SKILL_GRAPH;
	const writingSkills = skillGraph.skills.filter((s) => s.type === 'writing');

	const HIRAGANA_ROW_MAP: Record<string, string[]> = {
		'ja.writing.hiragana-vowels': ['a', 'i', 'u', 'e', 'o'],
		'ja.writing.hiragana-k': ['ka', 'ki', 'ku', 'ke', 'ko'],
		'ja.writing.hiragana-s': ['sa', 'shi', 'su', 'se', 'so'],
		'ja.writing.hiragana-t': ['ta', 'chi', 'tsu', 'te', 'to'],
		'ja.writing.hiragana-n': ['na', 'ni', 'nu', 'ne', 'no'],
		'ja.writing.hiragana-h': ['ha', 'hi', 'fu', 'he', 'ho'],
		'ja.writing.hiragana-m': ['ma', 'mi', 'mu', 'me', 'mo'],
		'ja.writing.hiragana-y': ['ya', 'yu', 'yo'],
		'ja.writing.hiragana-r': ['ra', 'ri', 'ru', 're', 'ro'],
		'ja.writing.hiragana-w': ['wa', 'wo', 'n']
	};

	const dbSkills = await db
		.select({ id: skills.id, key: skills.key })
		.from(skills)
		.where(eq(skills.languageCode, 'ja'));
	const skillIdByKey = new Map(dbSkills.map((s) => [s.key, s.id]));

	const dbConcepts = await db
		.select({ id: concepts.id, key: concepts.key })
		.from(concepts)
		.where(eq(concepts.languageCode, 'ja'));
	const conceptIdByKey = new Map(dbConcepts.map((c) => [c.key, c.id]));

	let totalQuestions = 0;
	let totalLinks = 0;

	for (const skill of writingSkills) {
		const romajiList = HIRAGANA_ROW_MAP[skill.key];
		if (!romajiList) continue;

		const skillId = skillIdByKey.get(skill.key);
		if (!skillId) {
			console.warn(`   ⚠ Skill not found in DB: ${skill.key}`);
			continue;
		}

		const [existingLesson] = await db
			.select({ id: lessons.id })
			.from(lessons)
			.innerJoin(schema.lessonSkills, eq(schema.lessonSkills.lessonId, lessons.id))
			.where(eq(schema.lessonSkills.skillId, skillId))
			.limit(1);

		let lessonId: number;
		if (existingLesson) {
			lessonId = existingLesson.id;
		} else {
			const [inserted] = await db
				.insert(lessons)
				.values({
					unitId,
					title: JSON.stringify({ en: skill.titleEn, de: skill.titleDe }),
					description: JSON.stringify({ en: skill.descriptionEn, de: skill.descriptionDe }),
					xpReward: 15,
					order: skill.order,
					isPublished: true,
					mode: 'guided_skill'
				})
				.returning();
			lessonId = inserted.id;

			await db
				.insert(lessonSkills)
				.values({ lessonId, skillId, role: 'primary' })
				.onConflictDoNothing();
		}

		const charsInRow = romajiList
			.map((r) => HIRAGANA_BASE.find((h) => h.romaji === r))
			.filter((h): h is HiraganaChar => !!h);

		for (const charData of charsInRow) {
			const conceptKey = `ja.hira.${charData.romaji}`;
			const conceptId = conceptIdByKey.get(conceptKey);
			if (!conceptId) {
				console.warn(`   ⚠ Concept not found: ${conceptKey}`);
				continue;
			}

			const existingQs = await db
				.select({ id: questions.id })
				.from(questions)
				.innerJoin(questionConcepts, eq(questionConcepts.questionId, questions.id))
				.where(eq(questionConcepts.conceptId, conceptId))
				.limit(1);

			if (existingQs.length > 0) continue;

			const questionData = buildQuestionsForChar(charData, charsInRow, HIRAGANA_BASE);

			for (const qd of questionData) {
				const [inserted] = await db
					.insert(questions)
					.values({
						lessonId,
						type: qd.type as any,
						content: qd.content,
						correctAnswer: qd.correctAnswer,
						order: qd.order
					})
					.returning();

				await db
					.insert(questionConcepts)
					.values({ questionId: inserted.id, conceptId })
					.onConflictDoNothing();

				totalLinks++;
				totalQuestions++;
			}
		}
	}

	console.log(`   ✓ Questions inserted: ${totalQuestions}`);
	console.log(`   ✓ Question-concept links: ${totalLinks}`);
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

	await seedJapaneseQuestions(db);
	await seedSpanishQuestions(db);
	await seedItalianQuestions(db);

	console.log('\n🎉 Learning content seed finished (additive, idempotent).');
	await client.end();
	process.exit(0);
}

seed().catch((error) => {
	console.error('❌ Learning-content seed failed:', error);
	process.exit(1);
});
