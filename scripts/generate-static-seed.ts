import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import {
	A1_UNITS as ES_A1,
	A2_UNITS as ES_A2,
	B1_UNITS as ES_B1,
	B2_UNITS as ES_B2,
	C1_UNITS as ES_C1,
	C2_UNITS as ES_C2,
	type VocabItem,
	type UnitVocab
} from '../src/lib/data/spanish-vocabulary';
import {
	A1_UNITS as JA_A1,
	A2_UNITS as JA_A2,
	B1_UNITS as JA_B1,
	B2_UNITS as JA_B2,
	C1_UNITS as JA_C1,
	C2_UNITS as JA_C2
} from '../src/lib/data/japanese-vocabulary';
import {
	A1_UNITS as IT_A1,
	A2_UNITS as IT_A2,
	B1_UNITS as IT_B1,
	B2_UNITS as IT_B2,
	C1_UNITS as IT_C1,
	C2_UNITS as IT_C2
} from '../src/lib/data/italian-vocabulary';
import {
	A1_UNITS as EN_A1,
	A2_UNITS as EN_A2,
	B1_UNITS as EN_B1,
	B2_UNITS as EN_B2,
	C1_UNITS as EN_C1,
	C2_UNITS as EN_C2
} from '../src/lib/data/english-vocabulary';

interface LanguageConfig {
	code: string;
	name: string;
	nativeName: string;
	flagEmoji: string;
	whisperCode: string;
	tutorName: string;
	tutorGreeting: string;
	order: number;
	units: Record<string, UnitVocab[]>;
}

const LANGUAGES: LanguageConfig[] = [
	{
		code: 'es',
		name: 'Spanish',
		nativeName: 'Español',
		flagEmoji: '🇪🇸',
		whisperCode: 'es',
		tutorName: 'Profesora Ana',
		tutorGreeting: '¡Hola',
		order: 1,
		units: { A1: ES_A1, A2: ES_A2, B1: ES_B1, B2: ES_B2, C1: ES_C1, C2: ES_C2 }
	},
	{
		code: 'ja',
		name: 'Japanese',
		nativeName: '日本語',
		flagEmoji: '🇯🇵',
		whisperCode: 'ja',
		tutorName: 'Tanaka-sensei',
		tutorGreeting: 'こんにちは',
		order: 2,
		units: { A1: JA_A1, A2: JA_A2, B1: JA_B1, B2: JA_B2, C1: JA_C1, C2: JA_C2 }
	},
	{
		code: 'it',
		name: 'Italian',
		nativeName: 'Italiano',
		flagEmoji: '🇮🇹',
		whisperCode: 'it',
		tutorName: 'Professore Marco',
		tutorGreeting: 'Ciao',
		order: 3,
		units: { A1: IT_A1, A2: IT_A2, B1: IT_B1, B2: IT_B2, C1: IT_C1, C2: IT_C2 }
	},
	{
		code: 'en',
		name: 'English',
		nativeName: 'English',
		flagEmoji: '🇬🇧',
		whisperCode: 'en',
		tutorName: 'Teacher Emma',
		tutorGreeting: 'Hello',
		order: 4,
		units: { A1: EN_A1, A2: EN_A2, B1: EN_B1, B2: EN_B2, C1: EN_C1, C2: EN_C2 }
	}
];

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to shuffle an array
function shuffle<T>(array: T[]): T[] {
	const arr = [...array];
	for (let i = arr.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[arr[i], arr[j]] = [arr[j], arr[i]];
	}
	return arr;
}

// Helper to get random items from an array
function getRandomItems<T>(array: T[], count: number): T[] {
	const shuffled = shuffle(array);
	return shuffled.slice(0, Math.min(count, array.length));
}

// Generate multiple choice questions (bilingual - store both English and German)
function generateMultipleChoiceQuestions(
	vocabItems: VocabItem[],
	startOrder: number,
	count: number,
	langName: string = 'Spanish'
): any[] {
	const questions: any[] = [];
	const shuffledVocab = shuffle(vocabItems);
	const langNameDe: Record<string, string> = {
		Spanish: 'Spanisch',
		Japanese: 'Japanisch',
		Italian: 'Italienisch',
		English: 'Englisch'
	};
	const deLabel = langNameDe[langName] || langName;

	for (let i = 0; i < count && i < shuffledVocab.length; i++) {
		const item = shuffledVocab[i];
		const otherItems = vocabItems.filter((v) => v.target !== item.target);
		const wrongAnswers = getRandomItems(otherItems, 3).map((v) => v.target);
		const options = shuffle([item.target, ...wrongAnswers]);

		questions.push({
			type: 'multiple_choice',
			content: {
				questionEn: `How do you say "${item.en}" in ${langName}?`,
				questionDe: `Wie sagt man "${item.de}" auf ${deLabel}?`,
				options
			},
			correctAnswer: item.target,
			audioUrl: null,
			order: startOrder + i
		});
	}

	return questions;
}

// Generate fill in the blank questions (bilingual - store both English and German)
function generateFillBlankQuestions(
	vocabItems: VocabItem[],
	sentences: { target: string; en: string; de: string }[],
	startOrder: number,
	count: number,
	langName: string = 'Spanish'
): any[] {
	const questions: any[] = [];
	const shuffledSentences = shuffle(sentences);
	const shuffledVocab = shuffle(vocabItems);
	const langNameDe: Record<string, string> = {
		Spanish: 'spanische',
		Japanese: 'japanische',
		Italian: 'italienische',
		English: 'englische'
	};
	const deLabel = langNameDe[langName] || langName;

	let added = 0;
	for (const sentence of shuffledSentences) {
		if (added >= count) break;

		for (const vocab of vocabItems) {
			if (sentence.target.toLowerCase().includes(vocab.target.toLowerCase())) {
				const blankSentence = sentence.target.replace(new RegExp(vocab.target, 'i'), '_____');
				questions.push({
					type: 'fill_blank',
					content: {
						sentence: blankSentence,
						hintEn: vocab.en,
						hintDe: vocab.de
					},
					correctAnswer: vocab.target,
					audioUrl: null,
					order: startOrder + added
				});
				added++;
				break;
			}
		}
	}

	for (let i = 0; added < count && i < shuffledVocab.length; i++) {
		const item = shuffledVocab[i];

		questions.push({
			type: 'fill_blank',
			content: {
				sentenceEn: `The ${langName} word for "${item.en}" is _____.`,
				sentenceDe: `Das ${deLabel} Wort für "${item.de}" ist _____.`,
				hintEn: `Starts with "${item.target.charAt(0)}"`,
				hintDe: `Beginnt mit "${item.target.charAt(0)}"`
			},
			correctAnswer: item.target,
			audioUrl: null,
			order: startOrder + added
		});
		added++;
	}

	return questions;
}

// Generate translation questions (unified directions - adapts to user's locale)
function generateTranslationQuestions(
	vocabItems: VocabItem[],
	sentences: { target: string; en: string; de: string }[],
	startOrder: number,
	count: number
): any[] {
	const questions: any[] = [];
	const halfCount = Math.ceil(count / 2);

	const nativeToTargetItems = getRandomItems(vocabItems, halfCount);
	for (let i = 0; i < nativeToTargetItems.length; i++) {
		const item = nativeToTargetItems[i];
		questions.push({
			type: 'translation',
			content: {
				textEn: item.en,
				textDe: item.de,
				direction: 'native_to_target'
			},
			correctAnswer: item.target,
			audioUrl: null,
			order: startOrder + i
		});
	}

	const remainingVocab = vocabItems.filter((v) => !nativeToTargetItems.includes(v));
	const targetToNativeItems = getRandomItems(remainingVocab, count - halfCount);
	for (let i = 0; i < targetToNativeItems.length; i++) {
		const item = targetToNativeItems[i];
		questions.push({
			type: 'translation',
			content: {
				text: item.target,
				direction: 'target_to_native'
			},
			correctAnswer: `${item.en}|${item.de}`,
			audioUrl: null,
			order: startOrder + halfCount + i
		});
	}

	return questions;
}

// Generate matching questions (bilingual - store both English and German)
function generateMatchingQuestions(
	vocabItems: VocabItem[],
	startOrder: number,
	count: number
): any[] {
	const questions: any[] = [];

	const pairsPerQuestion = 4;
	const questionsToCreate = Math.min(count, Math.floor(vocabItems.length / pairsPerQuestion));

	for (let i = 0; i < questionsToCreate; i++) {
		const startIdx = (i * pairsPerQuestion) % vocabItems.length;
		const selectedVocab: VocabItem[] = [];

		for (let j = 0; j < pairsPerQuestion; j++) {
			selectedVocab.push(vocabItems[(startIdx + j) % vocabItems.length]);
		}

		const pairs = selectedVocab.map((v) => ({
			target: v.target,
			english: v.en,
			german: v.de
		}));

		questions.push({
			type: 'matching',
			content: { pairs },
			correctAnswer: 'all_matched',
			audioUrl: null,
			order: startOrder + i
		});
	}

	return questions;
}

// Generate word order questions (bilingual - arrange words to form sentences)
function generateWordOrderQuestions(
	vocabItems: VocabItem[],
	sentences: { target: string; en: string; de: string }[],
	startOrder: number,
	count: number
): any[] {
	const questions: any[] = [];
	const shuffledSentences = shuffle(sentences);

	for (let i = 0; i < count && i < shuffledSentences.length; i++) {
		const sentence = shuffledSentences[i];

		const words = sentence.target.split(/\s+/).filter(Boolean);
		if (words.length < 3) continue;

		const scrambledWords = shuffle(words);

		questions.push({
			type: 'word_order',
			content: {
				words: scrambledWords,
				instructionEn: `Arrange the words to form: "${sentence.en}"`,
				instructionDe: `Ordne die Wörter, um zu bilden: "${sentence.de}"`
			},
			correctAnswer: sentence.target,
			audioUrl: null,
			order: startOrder + i
		});
	}

	return questions;
}

// Generate speaking questions (pronunciation practice)
function generateSpeakingQuestions(
	vocabItems: VocabItem[],
	startOrder: number,
	count: number
): any[] {
	const questions: any[] = [];
	const shuffledVocab = shuffle(vocabItems);

	for (let i = 0; i < count && i < shuffledVocab.length; i++) {
		const item = shuffledVocab[i];

		questions.push({
			type: 'speaking',
			content: {
				textToSpeak: item.target,
				hintEn: item.en,
				hintDe: item.de
			},
			correctAnswer: item.target,
			audioUrl: null,
			order: startOrder + i
		});
	}

	return questions;
}

// Generate listening questions (hear and identify)
function generateListeningQuestions(
	vocabItems: VocabItem[],
	sentences: { target: string; en: string; de: string }[],
	startOrder: number,
	count: number
): any[] {
	const questions: any[] = [];

	const validSentences = sentences.filter((s) => s.target.split(/\s+/).length >= 3);

	const shuffledSentences = shuffle(validSentences);
	const shuffledVocab = shuffle(vocabItems);

	let added = 0;

	for (let i = 0; i < shuffledSentences.length && added < count; i++) {
		const sentence = shuffledSentences[i];

		const answerType = added % 2 === 0 ? 'type' : 'multiple_choice';

		let optionsEn: string[] | undefined;
		let optionsDe: string[] | undefined;
		if (answerType === 'multiple_choice') {
			const otherSentences = validSentences.filter((s) => s.target !== sentence.target);
			const wrongSentences = getRandomItems(otherSentences, 3);
			const wrongAnswersEn = wrongSentences.map((s) => s.en);
			const wrongAnswersDe = wrongSentences.map((s) => s.de);
			optionsEn = shuffle([sentence.en, ...wrongAnswersEn]);
			optionsDe = shuffle([sentence.de, ...wrongAnswersDe]);
		}

		questions.push({
			type: 'listening',
			content: {
				textToHear: sentence.target,
				answerType,
				optionsEn,
				optionsDe,
				correctAnswerEn: sentence.en,
				correctAnswerDe: sentence.de
			},
			correctAnswer: `${sentence.en}|${sentence.de}`,
			audioUrl: null,
			order: startOrder + added
		});
		added++;
	}

	const longVocab = shuffledVocab.filter((v) => v.target.split(/\s+/).length >= 3);
	for (let i = 0; i < longVocab.length && added < count; i++) {
		const item = longVocab[i];

		const answerType = added % 2 === 0 ? 'type' : 'multiple_choice';

		let optionsEn: string[] | undefined;
		let optionsDe: string[] | undefined;
		if (answerType === 'multiple_choice') {
			const otherItems = longVocab.filter((v) => v.target !== item.target);
			const wrongItems = getRandomItems(otherItems, 3);
			const wrongAnswersEn = wrongItems.map((v) => v.en);
			const wrongAnswersDe = wrongItems.map((v) => v.de);
			optionsEn = shuffle([item.en, ...wrongAnswersEn]);
			optionsDe = shuffle([item.de, ...wrongAnswersDe]);
		}

		questions.push({
			type: 'listening',
			content: {
				textToHear: item.target,
				answerType,
				optionsEn,
				optionsDe,
				correctAnswerEn: item.en,
				correctAnswerDe: item.de
			},
			correctAnswer: `${item.en}|${item.de}`,
			audioUrl: null,
			order: startOrder + added
		});
		added++;
	}

	return questions;
}

// Generate all 50 questions for a lesson
function generateLessonQuestions(
	unitVocab: UnitVocab,
	lessonNumber: number,
	langName: string = 'Spanish'
): any[] {
	const vocab = unitVocab.vocab;
	const sentences = unitVocab.sentences;

	const offset = (lessonNumber - 1) * 3;
	const rotatedVocab = [
		...vocab.slice(offset % vocab.length),
		...vocab.slice(0, offset % vocab.length)
	];

	const allQuestions: any[] = [];
	let currentOrder = 1;

	const addQuestions = (qs: any[]) => {
		allQuestions.push(...qs);
		currentOrder += qs.length;
	};

	addQuestions(generateMultipleChoiceQuestions(rotatedVocab, currentOrder, 10, langName));
	addQuestions(generateFillBlankQuestions(rotatedVocab, sentences, currentOrder, 10, langName));
	addQuestions(generateTranslationQuestions(rotatedVocab, sentences, currentOrder, 8));
	addQuestions(generateMatchingQuestions(rotatedVocab, currentOrder, 6));
	addQuestions(generateWordOrderQuestions(rotatedVocab, sentences, currentOrder, 6));
	addQuestions(generateSpeakingQuestions(rotatedVocab, currentOrder, 5));
	addQuestions(generateListeningQuestions(rotatedVocab, sentences, currentOrder, 5));

	return allQuestions;
}

// Generate exam questions
function generateExamQuestions(unitVocab: UnitVocab, langName: string = 'Spanish'): any[] {
	const vocab = unitVocab.vocab;
	const sentences = unitVocab.sentences;
	const allQuestions: any[] = [];

	allQuestions.push(...generateMultipleChoiceQuestions(shuffle(vocab), 1, 2, langName));
	allQuestions.push(...generateFillBlankQuestions(shuffle(vocab), sentences, 3, 2, langName));
	allQuestions.push(...generateTranslationQuestions(shuffle(vocab), sentences, 5, 2));
	allQuestions.push(...generateMatchingQuestions(shuffle(vocab), 7, 2));
	allQuestions.push(...generateWordOrderQuestions(shuffle(vocab), sentences, 9, 2));

	return allQuestions;
}

// Lesson title templates
const LESSON_TITLES = [
	{ en: 'Introduction to {topic}', de: 'Einführung in {topic}' },
	{ en: 'Basic {topic}', de: 'Grundlagen {topic}' },
	{ en: '{topic} Practice', de: '{topic} Übung' },
	{ en: 'Learning {topic}', de: '{topic} Lernen' },
	{ en: '{topic} Vocabulary', de: '{topic} Vokabeln' },
	{ en: '{topic} Essentials', de: '{topic} Grundlagen' },
	{ en: '{topic} Fundamentals', de: '{topic} Grundprinzipien' },
	{ en: 'Mastering {topic}', de: '{topic} Meistern' },
	{ en: '{topic} Review', de: '{topic} Wiederholung' },
	{ en: '{topic} Challenge', de: '{topic} Herausforderung' },
	{ en: 'Advanced {topic}', de: 'Fortgeschrittene {topic}' },
	{ en: '{topic} in Context', de: '{topic} im Kontext' },
	{ en: '{topic} Phrases', de: '{topic} Ausdrücke' },
	{ en: '{topic} Expressions', de: '{topic} Redewendungen' },
	{ en: '{topic} Drill', de: '{topic} Training' },
	{ en: '{topic} Builder', de: '{topic} Aufbau' },
	{ en: '{topic} Workshop', de: '{topic} Workshop' },
	{ en: '{topic} Deep Dive', de: '{topic} Vertiefung' },
	{ en: '{topic} Skills', de: '{topic} Fähigkeiten' },
	{ en: '{topic} Mastery', de: '{topic} Beherrschung' }
];

// Helper to create bilingual JSON strings
function bilingual(en: string, de: string): string {
	return JSON.stringify({ en, de });
}

async function generateStaticSeed() {
	console.log('🌱 Generating static seed data...\n');

	const seedData: any = {
		languages: [],
		levels: [],
		units: [],
		lessons: [],
		questions: [],
		achievements: []
	};

	// Generate languages table data
	console.log('🌍 Creating languages...');
	seedData.languages = LANGUAGES.map((lang) => ({
		code: lang.code,
		name: lang.name,
		nativeName: lang.nativeName,
		flagEmoji: lang.flagEmoji,
		whisperCode: lang.whisperCode,
		tutorName: lang.tutorName,
		tutorGreeting: lang.tutorGreeting,
		isActive: true,
		order: lang.order
	}));
	console.log(`   ✓ Created ${seedData.languages.length} languages\n`);

	// CEFR level definitions (shared across all languages)
	const CEFR_LEVELS = [
		{
			code: 'A1',
			name: bilingual('Beginner', 'Anfänger'),
			description: bilingual(
				'Basic phrases and expressions for everyday situations',
				'Grundlegende Ausdrücke und Phrasen für alltägliche Situationen'
			),
			order: 1
		},
		{
			code: 'A2',
			name: bilingual('Elementary', 'Grundlegend'),
			description: bilingual(
				'Simple sentences about familiar topics',
				'Einfache Sätze zu vertrauten Themen'
			),
			order: 2
		},
		{
			code: 'B1',
			name: bilingual('Intermediate', 'Mittelstufe'),
			description: bilingual(
				'Main points on familiar matters regularly encountered',
				'Hauptpunkte zu vertrauten Themen, denen man regelmäßig begegnet'
			),
			order: 3
		},
		{
			code: 'B2',
			name: bilingual('Upper Intermediate', 'Obere Mittelstufe'),
			description: bilingual(
				'Complex texts on both concrete and abstract topics',
				'Komplexe Texte zu konkreten und abstrakten Themen'
			),
			order: 4
		},
		{
			code: 'C1',
			name: bilingual('Advanced', 'Fortgeschritten'),
			description: bilingual(
				'Demanding texts and implicit meaning recognition',
				'Anspruchsvolle Texte und Erkennung impliziter Bedeutungen'
			),
			order: 5
		},
		{
			code: 'C2',
			name: bilingual('Mastery', 'Beherrschung'),
			description: bilingual(
				'Near-native fluency and understanding',
				'Fast muttersprachliche Sprachgewandtheit und Verständnis'
			),
			order: 6
		}
	];

	let totalLessons = 0;
	let totalQuestions = 0;
	let unitIdCounter = 1;
	let lessonIdCounter = 1;
	let questionIdCounter = 1;

	// Process each language
	for (const lang of LANGUAGES) {
		console.log(`\n🌐 Processing language: ${lang.name} (${lang.code})...`);

		// Create CEFR levels for this language (each language gets its own A1-C2)
		const langLevels = CEFR_LEVELS.map((level) => ({
			...level,
			languageCode: lang.code
		}));
		seedData.levels.push(...langLevels);
		console.log(`   ✓ Created ${langLevels.length} levels for ${lang.name}`);

		// Process each level's units for this language
		for (const [levelCode, unitVocabs] of Object.entries(lang.units)) {
			console.log(`\n   📖 Processing ${lang.name} Level ${levelCode}...`);
			console.log(`      Units to create: ${unitVocabs.length}`);

			for (let unitIndex = 0; unitIndex < unitVocabs.length; unitIndex++) {
				const unitVocab = unitVocabs[unitIndex];

				const unit = {
					id: unitIdCounter,
					levelCode: levelCode,
					languageCode: lang.code,
					title: bilingual(unitVocab.titleEn, unitVocab.titleDe),
					description: bilingual(unitVocab.descriptionEn, unitVocab.descriptionDe),
					order: unitIndex + 1,
					themeColor: unitVocab.themeColor
				};

				seedData.units.push(unit);
				console.log(`      📁 Unit ${unitIndex + 1}: ${unitVocab.titleEn}`);

				// Create 20 lessons per unit
				const lessonsPerUnit = 20;

				for (let lessonNum = 1; lessonNum <= lessonsPerUnit; lessonNum++) {
					const titleTemplate = LESSON_TITLES[(lessonNum - 1) % LESSON_TITLES.length];
					const titleEn = titleTemplate.en.replace('{topic}', unitVocab.titleEn);
					const titleDe = titleTemplate.de.replace('{topic}', unitVocab.titleDe);

					const lesson = {
						id: lessonIdCounter,
						unitId: unitIdCounter,
						title: bilingual(`${lessonNum}. ${titleEn}`, `${lessonNum}. ${titleDe}`),
						description: bilingual(
							`Lesson ${lessonNum} of ${unitVocab.titleEn}`,
							`Lektion ${lessonNum} von ${unitVocab.titleDe}`
						),
						xpReward: 10 + Math.floor(lessonNum / 5) * 5,
						order: lessonNum,
						isPublished: true,
						isExam: false,
						examPassThreshold: null,
						requiredLessonId: null
					};

					seedData.lessons.push(lesson);

					// Generate questions for this lesson
					const lessonQuestions = generateLessonQuestions(unitVocab, lessonNum, lang.name);
					for (const question of lessonQuestions) {
						seedData.questions.push({
							id: questionIdCounter++,
							lessonId: lessonIdCounter,
							...question
						});
						totalQuestions++;
					}

					lessonIdCounter++;
					totalLessons++;
				}

				// Add exam at the end
				const examLesson = {
					id: lessonIdCounter,
					unitId: unitIdCounter,
					title: bilingual(`${unitVocab.titleEn} - Unit Exam`, `${unitVocab.titleDe} - Prüfung`),
					description: bilingual(
						`Final exam for ${unitVocab.titleEn}. Score 80% to pass.`,
						`Abschlussprüfung für ${unitVocab.titleDe}. 80% zum Bestehen.`
					),
					xpReward: 50,
					order: lessonsPerUnit + 1,
					isPublished: true,
					isExam: true,
					examPassThreshold: 80,
					requiredLessonId: null
				};

				seedData.lessons.push(examLesson);

				// Generate exam questions
				const examQuestions = generateExamQuestions(unitVocab, lang.name);
				for (const question of examQuestions) {
					seedData.questions.push({
						id: questionIdCounter++,
						lessonId: lessonIdCounter,
						...question
					});
					totalQuestions++;
				}

				lessonIdCounter++;
				totalLessons++;

				console.log(`         ✓ Created ${lessonsPerUnit + 1} lessons with questions`);

				unitIdCounter++;
			}
		}
	}

	// Generate achievements
	console.log('\n🏆 Creating achievements...');
	const achievementData = [
		{
			code: 'first_lesson',
			name: 'First Steps',
			description: 'Complete your first lesson',
			iconUrl: '/achievements/first-steps.svg',
			criteria: { type: 'lessons_completed', count: 1 }
		},
		{
			code: 'lessons_5',
			name: 'Getting Started',
			description: 'Complete 5 lessons',
			iconUrl: '/achievements/getting-started.svg',
			criteria: { type: 'lessons_completed', count: 5 }
		},
		{
			code: 'lessons_25',
			name: 'Committed Learner',
			description: 'Complete 25 lessons',
			iconUrl: '/achievements/committed-learner.svg',
			criteria: { type: 'lessons_completed', count: 25 }
		},
		{
			code: 'lessons_100',
			name: 'Lesson Master',
			description: 'Complete 100 lessons',
			iconUrl: '/achievements/lesson-master.svg',
			criteria: { type: 'lessons_completed', count: 100 }
		},
		{
			code: 'lessons_500',
			name: 'Language Scholar',
			description: 'Complete 500 lessons',
			iconUrl: '/achievements/language-scholar.svg',
			criteria: { type: 'lessons_completed', count: 500 }
		},
		{
			code: 'streak_7',
			name: 'Week Warrior',
			description: 'Maintain a 7-day streak',
			iconUrl: '/achievements/week-warrior.svg',
			criteria: { type: 'streak', count: 7 }
		},
		{
			code: 'streak_30',
			name: 'Month Master',
			description: 'Maintain a 30-day streak',
			iconUrl: '/achievements/month-master.svg',
			criteria: { type: 'streak', count: 30 }
		},
		{
			code: 'streak_100',
			name: 'Streak Legend',
			description: 'Maintain a 100-day streak',
			iconUrl: '/achievements/streak-legend.svg',
			criteria: { type: 'streak', count: 100 }
		},
		{
			code: 'xp_100',
			name: 'Century Club',
			description: 'Earn 100 XP',
			iconUrl: '/achievements/century-club.svg',
			criteria: { type: 'xp', count: 100 }
		},
		{
			code: 'xp_1000',
			name: 'XP Thousandaire',
			description: 'Earn 1,000 XP',
			iconUrl: '/achievements/xp-thousandaire.svg',
			criteria: { type: 'xp', count: 1000 }
		},
		{
			code: 'xp_5000',
			name: 'XP Champion',
			description: 'Earn 10,000 XP',
			iconUrl: '/achievements/xp-champion.svg',
			criteria: { type: 'xp', count: 10000 }
		},
		{
			code: 'perfect_lesson',
			name: 'Perfect Score',
			description: 'Complete a lesson with no mistakes',
			iconUrl: '/achievements/perfect-score.svg',
			criteria: { type: 'perfect_lesson', count: 1 }
		},
		{
			code: 'perfect_10',
			name: 'Perfectionist',
			description: 'Complete 10 lessons with no mistakes',
			iconUrl: '/achievements/perfectionist.svg',
			criteria: { type: 'perfect_lesson', count: 10 }
		},
		{
			code: 'exam_1',
			name: 'Exam Ace',
			description: 'Pass your first unit exam',
			iconUrl: '/achievements/exam-ace.svg',
			criteria: { type: 'exams_passed', count: 1 }
		},
		{
			code: 'exam_10',
			name: 'Exam Expert',
			description: 'Pass 10 unit exams',
			iconUrl: '/achievements/exam-expert.svg',
			criteria: { type: 'exams_passed', count: 10 }
		},
		{
			code: 'level_a1',
			name: 'A1 Complete',
			description: 'Complete all A1 lessons',
			iconUrl: '/achievements/a1-complete.svg',
			criteria: { type: 'level_complete', level: 'A1' }
		},
		{
			code: 'level_a2',
			name: 'A2 Complete',
			description: 'Complete all A2 lessons',
			iconUrl: '/achievements/a2-complete.svg',
			criteria: { type: 'level_complete', level: 'A2' }
		},
		{
			code: 'level_b1',
			name: 'B1 Complete',
			description: 'Complete all B1 lessons',
			iconUrl: '/achievements/b1-complete.svg',
			criteria: { type: 'level_complete', level: 'B1' }
		},
		{
			code: 'level_b2',
			name: 'B2 Complete',
			description: 'Complete all B2 lessons',
			iconUrl: '/achievements/b2-complete.svg',
			criteria: { type: 'level_complete', level: 'B2' }
		},
		{
			code: 'level_c1',
			name: 'C1 Complete',
			description: 'Complete all C1 lessons',
			iconUrl: '/achievements/c1-complete.svg',
			criteria: { type: 'level_complete', level: 'C1' }
		},
		{
			code: 'level_c2',
			name: 'C2 Complete',
			description: 'Complete all C2 lessons - You are a Language Master!',
			iconUrl: '/achievements/c2-complete.svg',
			criteria: { type: 'level_complete', level: 'C2' }
		},
		{
			code: 'freeze_master',
			name: 'Freeze Master',
			description: 'Earn 5 streak freezes',
			iconUrl: '/achievements/freeze-master.svg',
			criteria: { type: 'freezes_earned', count: 5 }
		},
		{
			code: 'correct_1000',
			name: 'Question Crusher',
			description: 'Answer 1,000 questions correctly',
			iconUrl: '/achievements/question-crusher.svg',
			criteria: { type: 'correct_answers', count: 1000 }
		}
	];

	seedData.achievements = achievementData;
	console.log(`   ✓ Created ${achievementData.length} achievements\n`);

	// Summary
	console.log('═══════════════════════════════════════════════');
	console.log('🎉 Static seed data generation complete!\n');
	console.log(`📊 Summary:`);
	console.log(`   • Languages: ${seedData.languages.length}`);
	console.log(`   • Levels: ${seedData.levels.length}`);
	console.log(`   • Units: ${seedData.units.length}`);
	console.log(`   • Lessons: ${totalLessons}`);
	console.log(`   • Questions: ${totalQuestions}`);
	console.log(`   • Achievements: ${seedData.achievements.length}`);
	console.log('═══════════════════════════════════════════════\n');

	// Write to file
	const outputPath = path.join(__dirname, 'static-seed-data.json');
	fs.writeFileSync(outputPath, JSON.stringify(seedData, null, 2));
	console.log(`✅ Static seed data written to: ${outputPath}\n`);
}

generateStaticSeed()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error('❌ Generation failed:', error);
		process.exit(1);
	});
