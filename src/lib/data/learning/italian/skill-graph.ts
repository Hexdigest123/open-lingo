import type { SkillGraphDefinition } from '$lib/learning/types';

export const ITALIAN_SKILL_GRAPH: SkillGraphDefinition = {
	skills: [
		{
			key: 'it.pronunciation.basics',
			type: 'pronunciation',
			titleEn: 'Pronunciation Basics',
			titleDe: 'Aussprache-Grundlagen',
			descriptionEn: 'Italian vowels, stress, and clear syllable timing.',
			descriptionDe: 'Italienische Vokale, Betonung und klare Silbenrhythmen.',
			cefrLevel: 'A1',
			iconName: 'volume-2',
			order: 1,
			conceptKeys: ['it.phonetics.vowels-basic']
		},
		{
			key: 'it.vocab.greetings',
			type: 'vocabulary',
			titleEn: 'Greetings',
			titleDe: 'Begrussungen',
			descriptionEn: 'Basic greetings and polite expressions in Italian.',
			descriptionDe: 'Grundlegende Begrussungen und hofliche Wendungen auf Italienisch.',
			cefrLevel: 'A1',
			iconName: 'handshake',
			order: 2,
			conceptKeys: ['it.vocab.ciao', 'it.vocab.buongiorno', 'it.vocab.arrivederci']
		},
		{
			key: 'it.vocab.numbers',
			type: 'vocabulary',
			titleEn: 'Numbers',
			titleDe: 'Zahlen',
			descriptionEn: 'Essential numbers for counting and everyday use.',
			descriptionDe: 'Wichtige Zahlen fur Zahlenangaben und den Alltag.',
			cefrLevel: 'A1',
			iconName: 'hash',
			order: 3,
			conceptKeys: ['it.vocab.uno', 'it.vocab.due', 'it.vocab.tre']
		},
		{
			key: 'it.grammar.articles',
			type: 'grammar',
			titleEn: 'Articles',
			titleDe: 'Artikel',
			descriptionEn: 'Definite and indefinite articles with core usage patterns.',
			descriptionDe: 'Bestimmte und unbestimmte Artikel mit zentralen Gebrauchsmustern.',
			cefrLevel: 'A1',
			iconName: 'book-open',
			order: 4,
			conceptKeys: ['it.grammar.definite-articles', 'it.grammar.indefinite-articles']
		},
		{
			key: 'it.grammar.essere-avere',
			type: 'grammar',
			titleEn: 'Essere and Avere',
			titleDe: 'Essere und Avere',
			descriptionEn: 'Core irregular verbs for being and having.',
			descriptionDe: 'Zentrale unregelmassige Verben fur sein und haben.',
			cefrLevel: 'A1',
			iconName: 'split',
			order: 5,
			conceptKeys: ['it.grammar.essere-present', 'it.grammar.avere-present']
		},
		{
			key: 'it.grammar.present-regular',
			type: 'grammar',
			titleEn: 'Regular Present Tense',
			titleDe: 'Regelmassiges Prasens',
			descriptionEn: 'Present endings for regular -are, -ere, and -ire verbs.',
			descriptionDe: 'Prasensendungen fur regelmassige -are-, -ere- und -ire-Verben.',
			cefrLevel: 'A1',
			iconName: 'repeat',
			order: 6,
			conceptKeys: ['it.grammar.present-are', 'it.grammar.present-ere', 'it.grammar.present-ire']
		},
		{
			key: 'it.grammar.negation',
			type: 'grammar',
			titleEn: 'Negation',
			titleDe: 'Verneinung',
			descriptionEn: 'Build clear negative statements with non + verb.',
			descriptionDe: 'Klare Verneinung mit non + Verb bilden.',
			cefrLevel: 'A1',
			iconName: 'ban',
			order: 7,
			conceptKeys: ['it.grammar.negation-non']
		},
		{
			key: 'it.grammar.questions',
			type: 'grammar',
			titleEn: 'Questions',
			titleDe: 'Fragen',
			descriptionEn: 'Question words for asking about people, places, and time.',
			descriptionDe: 'Frageworter fur Personen, Orte und Zeitangaben.',
			cefrLevel: 'A1',
			iconName: 'help-circle',
			order: 8,
			conceptKeys: ['it.grammar.question-words']
		},
		{
			key: 'it.vocab.family',
			type: 'vocabulary',
			titleEn: 'Family',
			titleDe: 'Familie',
			descriptionEn: 'Vocabulary for close family members.',
			descriptionDe: 'Wortschatz fur nahe Familienmitglieder.',
			cefrLevel: 'A1',
			iconName: 'users',
			order: 9,
			conceptKeys: ['it.vocab.madre', 'it.vocab.padre', 'it.vocab.fratello']
		},
		{
			key: 'it.vocab.food',
			type: 'vocabulary',
			titleEn: 'Food',
			titleDe: 'Essen',
			descriptionEn: 'Basic words for food and drinks in daily contexts.',
			descriptionDe: 'Grundwortschatz fur Essen und Trinken im Alltag.',
			cefrLevel: 'A1',
			iconName: 'utensils',
			order: 10,
			conceptKeys: ['it.vocab.pane', 'it.vocab.acqua', 'it.vocab.mela']
		},
		{
			key: 'it.grammar.adjectives',
			type: 'grammar',
			titleEn: 'Adjectives',
			titleDe: 'Adjektive',
			descriptionEn: 'Agreement of adjective endings by gender and number.',
			descriptionDe: 'Ubereinstimmung von Adjektivendungen in Genus und Numerus.',
			cefrLevel: 'A1',
			iconName: 'align-left',
			order: 11,
			conceptKeys: ['it.grammar.adjective-agreement']
		},
		{
			key: 'it.grammar.piacere',
			type: 'grammar',
			titleEn: 'Piacere Structure',
			titleDe: 'Piacere-Struktur',
			descriptionEn: 'Use object pronouns with piace and piacciono.',
			descriptionDe: 'Objektpronomen mit piace und piacciono verwenden.',
			cefrLevel: 'A2',
			iconName: 'heart',
			order: 12,
			conceptKeys: ['it.grammar.piacere']
		},
		{
			key: 'it.grammar.andare-fare',
			type: 'grammar',
			titleEn: 'Andare and Fare',
			titleDe: 'Andare und Fare',
			descriptionEn: 'Irregular present forms for movement and daily actions.',
			descriptionDe: 'Unregelmassige Prasensformen fur Bewegung und Alltagshandlungen.',
			cefrLevel: 'A1',
			iconName: 'navigation',
			order: 13,
			conceptKeys: ['it.grammar.andare-present', 'it.grammar.fare-present']
		},
		{
			key: 'it.grammar.past-passato-prossimo',
			type: 'grammar',
			titleEn: 'Past: Passato Prossimo',
			titleDe: 'Vergangenheit: Passato Prossimo',
			descriptionEn: 'Completed past events with auxiliary + participle.',
			descriptionDe: 'Abgeschlossene Vergangenheitsereignisse mit Hilfsverb + Partizip.',
			cefrLevel: 'A2',
			iconName: 'history',
			order: 14,
			conceptKeys: ['it.grammar.past-passato-prossimo']
		},
		{
			key: 'it.grammar.past-imperfetto',
			type: 'grammar',
			titleEn: 'Past: Imperfetto',
			titleDe: 'Vergangenheit: Imperfetto',
			descriptionEn: 'Past background, habits, and ongoing states.',
			descriptionDe: 'Vergangenheit fur Hintergrunde, Gewohnheiten und andauernde Zustande.',
			cefrLevel: 'A2',
			iconName: 'clock-3',
			order: 15,
			conceptKeys: ['it.grammar.past-imperfetto']
		}
	],
	prerequisites: [
		{ skillKey: 'it.vocab.greetings', prerequisiteKey: 'it.pronunciation.basics' },
		{ skillKey: 'it.vocab.numbers', prerequisiteKey: 'it.pronunciation.basics' },
		{ skillKey: 'it.grammar.articles', prerequisiteKey: 'it.vocab.greetings' },
		{ skillKey: 'it.grammar.essere-avere', prerequisiteKey: 'it.grammar.articles' },
		{ skillKey: 'it.grammar.present-regular', prerequisiteKey: 'it.grammar.essere-avere' },
		{ skillKey: 'it.grammar.negation', prerequisiteKey: 'it.grammar.present-regular' },
		{ skillKey: 'it.grammar.questions', prerequisiteKey: 'it.grammar.present-regular' },
		{ skillKey: 'it.vocab.family', prerequisiteKey: 'it.grammar.articles' },
		{ skillKey: 'it.vocab.food', prerequisiteKey: 'it.grammar.articles' },
		{ skillKey: 'it.grammar.adjectives', prerequisiteKey: 'it.grammar.articles' },
		{ skillKey: 'it.grammar.piacere', prerequisiteKey: 'it.grammar.present-regular' },
		{ skillKey: 'it.grammar.andare-fare', prerequisiteKey: 'it.grammar.present-regular' },
		{
			skillKey: 'it.grammar.past-passato-prossimo',
			prerequisiteKey: 'it.grammar.andare-fare'
		},
		{ skillKey: 'it.grammar.past-imperfetto', prerequisiteKey: 'it.grammar.past-passato-prossimo' }
	]
};
