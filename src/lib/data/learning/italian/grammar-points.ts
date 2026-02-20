import type { GrammarPointData } from '$lib/learning/types';

export const GRAMMAR_A1: GrammarPointData[] = [
	{
		key: 'it.grammar.essere-present',
		titleEn: 'Essere (present)',
		titleDe: 'Essere (Präsens)',
		explanationEn:
			'Essere means to be and is used for identity, origin, and characteristics. It is highly irregular, so all forms must be memorized early. It is one of the most frequent verbs in Italian.',
		explanationDe:
			'Essere bedeutet sein und wird für Identität, Herkunft und Eigenschaften verwendet. Das Verb ist stark unregelmäßig, daher sollte man die Formen früh auswendig lernen. Es gehört zu den häufigsten Verben im Italienischen.',
		pattern: 'io sono, tu sei, lui/lei e, noi siamo, voi siete, loro sono',
		examples: [
			{ target: 'Io sono italiano.', en: 'I am Italian.', de: 'Ich bin Italiener.' },
			{ target: 'Lei e stanca.', en: 'She is tired.', de: 'Sie ist müde.' },
			{ target: 'Noi siamo amici.', en: 'We are friends.', de: 'Wir sind Freunde.' }
		],
		cefrLevel: 'A1',
		order: 1
	},
	{
		key: 'it.grammar.avere-present',
		titleEn: 'Avere (present)',
		titleDe: 'Avere (Präsens)',
		explanationEn:
			'Avere means to have and appears in possession, age, and many fixed expressions. It is also an auxiliary verb for many past forms. Mastering it is essential from the start.',
		explanationDe:
			'Avere bedeutet haben und kommt bei Besitz, Alter und vielen festen Wendungen vor. Außerdem dient es oft als Hilfsverb für Vergangenheitsformen. Deshalb ist es von Anfang an zentral.',
		pattern: 'io ho, tu hai, lui/lei ha, noi abbiamo, voi avete, loro hanno',
		examples: [
			{ target: 'Ho due fratelli.', en: 'I have two brothers.', de: 'Ich habe zwei Brüder.' },
			{
				target: 'Lei ha venti anni.',
				en: 'She is twenty years old.',
				de: 'Sie ist zwanzig Jahre alt.'
			},
			{ target: 'Abbiamo tempo.', en: 'We have time.', de: 'Wir haben Zeit.' }
		],
		cefrLevel: 'A1',
		order: 2
	},
	{
		key: 'it.grammar.present-are',
		titleEn: 'Regular -are verbs (present)',
		titleDe: 'Regelmäßige -are-Verben (Präsens)',
		explanationEn:
			'Regular -are verbs remove -are and use predictable present endings. This pattern covers many everyday actions. Typical examples are parlare and mangiare.',
		explanationDe:
			'Regelmäßige -are-Verben verlieren -are und bekommen feste Präsensendungen. Dieses Muster deckt viele Alltagsverben ab. Typische Beispiele sind parlare und mangiare.',
		pattern: '-are -> o, i, a, iamo, ate, ano',
		examples: [
			{ target: 'Io parlo italiano.', en: 'I speak Italian.', de: 'Ich spreche Italienisch.' },
			{ target: 'Tu mangi una pizza.', en: 'You eat a pizza.', de: 'Du isst eine Pizza.' },
			{ target: 'Noi studiamo molto.', en: 'We study a lot.', de: 'Wir lernen viel.' }
		],
		cefrLevel: 'A1',
		order: 3
	},
	{
		key: 'it.grammar.present-ere',
		titleEn: 'Regular -ere verbs (present)',
		titleDe: 'Regelmäßige -ere-Verben (Präsens)',
		explanationEn:
			'Regular -ere verbs follow a stable present-tense pattern after dropping -ere. They are very common in basic communication. Examples include scrivere and leggere.',
		explanationDe:
			'Regelmäßige -ere-Verben folgen nach dem Wegfall von -ere einem festen Präsensmuster. Sie kommen in der Grundkommunikation sehr häufig vor. Beispiele sind scrivere und leggere.',
		pattern: '-ere -> o, i, e, iamo, ete, ono',
		examples: [
			{ target: 'Io scrivo una mail.', en: 'I write an email.', de: 'Ich schreibe eine E-Mail.' },
			{ target: 'Tu leggi il libro.', en: 'You read the book.', de: 'Du liest das Buch.' },
			{ target: 'Loro vendono frutta.', en: 'They sell fruit.', de: 'Sie verkaufen Obst.' }
		],
		cefrLevel: 'A1',
		order: 4
	},
	{
		key: 'it.grammar.present-ire',
		titleEn: 'Regular -ire verbs (present)',
		titleDe: 'Regelmäßige -ire-Verben (Präsens)',
		explanationEn:
			'Basic -ire verbs use regular endings and are essential for common routines. At A1, focus on clear core verbs like dormire and partire. Some other -ire verbs have an extra -isc- pattern at higher levels.',
		explanationDe:
			'Grundlegende -ire-Verben verwenden regelmäßige Endungen und sind für Alltagshandlungen wichtig. Auf A1 konzentriert man sich auf klare Kernverben wie dormire und partire. Andere -ire-Verben zeigen später ein zusätzliches -isc--Muster.',
		pattern: '-ire -> o, i, e, iamo, ite, ono',
		examples: [
			{ target: 'Io dormo bene.', en: 'I sleep well.', de: 'Ich schlafe gut.' },
			{ target: 'Noi partiamo domani.', en: 'We leave tomorrow.', de: 'Wir fahren morgen ab.' },
			{ target: 'Loro aprono la porta.', en: 'They open the door.', de: 'Sie offnen die Tur.' }
		],
		cefrLevel: 'A1',
		order: 5
	},
	{
		key: 'it.grammar.definite-articles',
		titleEn: 'Definite articles (il/lo/la/i/gli/le)',
		titleDe: 'Bestimmte Artikel (il/lo/la/i/gli/le)',
		explanationEn:
			'Italian definite articles vary by gender, number, and sound of the following noun. Use il/lo/la in singular and i/gli/le in plural. Choosing the right form is fundamental for correct noun phrases.',
		explanationDe:
			'Bestimmte Artikel im Italienischen hängen von Genus, Numerus und dem Anlaut des folgenden Nomens ab. Im Singular stehen il/lo/la, im Plural i/gli/le. Die richtige Form ist grundlegend für korrekte Nominalgruppen.',
		pattern: 'il libro, lo studente, la casa, i libri, gli studenti, le case',
		examples: [
			{ target: 'Il ragazzo e alto.', en: 'The boy is tall.', de: 'Der Junge ist groß.' },
			{ target: 'Lo zaino e nuovo.', en: 'The backpack is new.', de: 'Der Rucksack ist neu.' },
			{
				target: 'Le ragazze sono pronte.',
				en: 'The girls are ready.',
				de: 'Die Mädchen sind bereit.'
			}
		],
		cefrLevel: 'A1',
		order: 6
	},
	{
		key: 'it.grammar.indefinite-articles',
		titleEn: 'Indefinite articles (un/uno/una)',
		titleDe: 'Unbestimmte Artikel (un/uno/una)',
		explanationEn:
			'Indefinite articles introduce non-specific singular nouns. The form depends on gender and initial sound: un, uno, or una. They correspond to a or an in English.',
		explanationDe:
			'Unbestimmte Artikel führen nicht näher bestimmte Nomen im Singular ein. Die Form richtet sich nach Genus und Anlaut: un, uno oder una. Im Deutschen entsprechen sie ein bzw. eine.',
		pattern: 'un libro, uno studente, una casa',
		examples: [
			{ target: 'Ho un cane.', en: 'I have a dog.', de: 'Ich habe einen Hund.' },
			{ target: 'Vedo uno studente.', en: 'I see a student.', de: 'Ich sehe einen Studenten.' },
			{ target: 'Lei compra una macchina.', en: 'She buys a car.', de: 'Sie kauft ein Auto.' }
		],
		cefrLevel: 'A1',
		order: 7
	},
	{
		key: 'it.grammar.adjective-agreement',
		titleEn: 'Adjective agreement',
		titleDe: 'Adjektivkongruenz',
		explanationEn:
			'Italian adjectives agree with nouns in gender and number. Common endings are -o/-a in singular and -i/-e in plural. Agreement is required for natural and correct sentences.',
		explanationDe:
			'Italienische Adjektive stimmen in Genus und Numerus mit dem Nomen überein. Häufige Endungen sind -o/-a im Singular und -i/-e im Plural. Diese Übereinstimmung ist für korrektes Italienisch notwendig.',
		pattern: 'ragazzo alto, ragazza alta, ragazzi alti, ragazze alte',
		examples: [
			{ target: 'Una casa grande', en: 'A big house', de: 'Ein großes Haus' },
			{ target: 'I libri nuovi', en: 'The new books', de: 'Die neuen Bücher' },
			{ target: 'Le strade lunghe', en: 'The long streets', de: 'Die langen Straßen' }
		],
		cefrLevel: 'A1',
		order: 8
	},
	{
		key: 'it.grammar.negation-non',
		titleEn: 'Negation (non + verb)',
		titleDe: 'Verneinung (non + Verb)',
		explanationEn:
			'Italian basic negation uses non before the conjugated verb. This is the standard way to say not in simple statements. Keep non directly in front of the verb.',
		explanationDe:
			'Die einfache Verneinung im Italienischen verwendet non vor dem konjugierten Verb. Das ist das Grundmuster für nicht in einfachen Aussagesätzen. Non steht dabei direkt vor dem Verb.',
		pattern: 'non + [conjugated verb]',
		examples: [
			{
				target: 'Non parlo tedesco.',
				en: 'I do not speak German.',
				de: 'Ich spreche kein Deutsch.'
			},
			{ target: 'Lui non mangia carne.', en: 'He does not eat meat.', de: 'Er isst kein Fleisch.' },
			{ target: 'Non siamo pronti.', en: 'We are not ready.', de: 'Wir sind nicht bereit.' }
		],
		cefrLevel: 'A1',
		order: 9
	},
	{
		key: 'it.grammar.question-words',
		titleEn: 'Question words',
		titleDe: 'Fragewörter',
		explanationEn:
			'Question words help you ask for specific information in Italian. Core forms include che, dove, quando, come, quanto, and chi. They are essential for everyday conversations.',
		explanationDe:
			'Mit Fragewörtern fragt man im Italienischen gezielt nach Informationen. Zentrale Formen sind che, dove, quando, come, quanto und chi. Sie sind für Alltagsgespräche unverzichtbar.',
		pattern: 'Che, dove, quando, come, quanto, chi + ...?',
		examples: [
			{ target: 'Che fai?', en: 'What are you doing?', de: 'Was machst du?' },
			{ target: 'Dove abiti?', en: 'Where do you live?', de: 'Wo wohnst du?' },
			{
				target: 'Quando arriva il treno?',
				en: 'When does the train arrive?',
				de: 'Wann kommt der Zug an?'
			}
		],
		cefrLevel: 'A1',
		order: 10
	},
	{
		key: 'it.grammar.ce-ci-sono',
		titleEn: "C'e / Ci sono",
		titleDe: "C'e / Ci sono",
		explanationEn:
			"C'e means there is and ci sono means there are. Use these forms to express existence and presence. They are among the most practical structures at beginner level.",
		explanationDe:
			"C'è bedeutet es gibt (Singular), ci sono bedeutet es gibt (Plural). Mit diesen Formen drückt man Existenz und Vorhandensein aus. Sie gehören zu den nützlichsten Strukturen auf Anfängerniveau.",
		pattern: "c'e + singular noun / ci sono + plural noun",
		examples: [
			{
				target: "C'e un supermercato qui.",
				en: 'There is a supermarket here.',
				de: 'Hier gibt es einen Supermarkt.'
			},
			{
				target: 'Ci sono molti studenti.',
				en: 'There are many students.',
				de: 'Es gibt viele Studenten.'
			},
			{ target: "Non c'e tempo.", en: 'There is no time.', de: 'Es gibt keine Zeit.' }
		],
		cefrLevel: 'A1',
		order: 11
	},
	{
		key: 'it.grammar.piacere',
		titleEn: 'Piacere',
		titleDe: 'Piacere',
		explanationEn:
			'Piacere works like gustar in Spanish: the liked thing is the grammatical subject. Use object pronouns like mi, ti, gli, ci, vi, or loro. Use piace for singular/verbs and piacciono for plurals.',
		explanationDe:
			'Piacere funktioniert wie gustar im Spanischen: Das, was gefällt, ist grammatisches Subjekt. Dazu verwendet man Objektpronomen wie mi, ti, gli, ci, vi oder loro. Piace steht bei Singular und Verben, piacciono bei Plural.',
		pattern: 'mi/ti/gli/ci/vi/loro + piace/piacciono + noun/infinitive',
		examples: [
			{ target: 'Mi piace la musica.', en: 'I like music.', de: 'Ich mag Musik.' },
			{ target: 'Ti piacciono i libri.', en: 'You like books.', de: 'Du magst Bücher.' },
			{ target: 'Ci piace viaggiare.', en: 'We like to travel.', de: 'Wir reisen gern.' }
		],
		cefrLevel: 'A1',
		order: 12
	},
	{
		key: 'it.grammar.possessives',
		titleEn: 'Possessives',
		titleDe: 'Possessivbegleiter',
		explanationEn:
			'Possessives such as mio, tuo, suo, nostro, and vostro agree with the possessed noun. In many cases, they are used together with an article in Italian. They are key for talking about family and belongings.',
		explanationDe:
			'Possessivformen wie mio, tuo, suo, nostro und vostro richten sich nach dem Bezugsnomen. Im Italienischen stehen sie oft zusammen mit einem Artikel. Sie sind wichtig für Familie und Besitzangaben.',
		pattern: 'il mio libro, la tua casa, i nostri amici',
		examples: [
			{
				target: 'Il mio amico e simpatico.',
				en: 'My friend is nice.',
				de: 'Mein Freund ist nett.'
			},
			{
				target: 'La tua macchina e veloce.',
				en: 'Your car is fast.',
				de: 'Dein Auto ist schnell.'
			},
			{
				target: 'I nostri genitori lavorano.',
				en: 'Our parents work.',
				de: 'Unsere Eltern arbeiten.'
			}
		],
		cefrLevel: 'A1',
		order: 13
	},
	{
		key: 'it.grammar.andare-present',
		titleEn: 'Andare (present)',
		titleDe: 'Andare (Präsens)',
		explanationEn:
			'Andare means to go and is irregular in the present tense. It is used for movement and destination with a + place. It is an essential everyday verb.',
		explanationDe:
			'Andare bedeutet gehen/fahren und ist im Präsens unregelmäßig. Es wird für Bewegung und Ziele mit a + Ort verwendet. Dieses Verb ist im Alltag unverzichtbar.',
		pattern: 'io vado, tu vai, lui/lei va, noi andiamo, voi andate, loro vanno',
		examples: [
			{ target: 'Vado a Roma.', en: 'I am going to Rome.', de: 'Ich fahre nach Rom.' },
			{ target: 'Andiamo a scuola.', en: 'We are going to school.', de: 'Wir gehen zur Schule.' },
			{ target: 'Loro vanno al lavoro.', en: 'They go to work.', de: 'Sie gehen zur Arbeit.' }
		],
		cefrLevel: 'A1',
		order: 14
	},
	{
		key: 'it.grammar.fare-present',
		titleEn: 'Fare (present)',
		titleDe: 'Fare (Präsens)',
		explanationEn:
			'Fare means to do or make and is irregular in the present tense. It is used in many daily expressions such as fare colazione or fare sport. Learners need it very early for natural communication.',
		explanationDe:
			'Fare bedeutet tun oder machen und ist im Präsens unregelmäßig. Es erscheint in vielen alltäglichen Wendungen wie fare colazione oder fare sport. Für natürliche Kommunikation braucht man es sehr früh.',
		pattern: 'io faccio, tu fai, lui/lei fa, noi facciamo, voi fate, loro fanno',
		examples: [
			{
				target: 'Faccio colazione alle sette.',
				en: 'I have breakfast at seven.',
				de: 'Ich frühstücke um sieben.'
			},
			{ target: 'Cosa fai oggi?', en: 'What are you doing today?', de: 'Was machst du heute?' },
			{ target: 'Noi facciamo sport.', en: 'We do sports.', de: 'Wir treiben Sport.' }
		],
		cefrLevel: 'A1',
		order: 15
	}
];
