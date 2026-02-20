import type { GrammarPointData } from '$lib/learning/types';

export const GRAMMAR_A1: GrammarPointData[] = [
	{
		key: 'es.grammar.ser-present',
		titleEn: 'Ser (present)',
		titleDe: 'Ser (Präsens)',
		explanationEn:
			'Use ser for identity, origin, profession, and other lasting characteristics. It answers what something or someone is by nature. Typical clues are names, nationalities, and occupations.',
		explanationDe:
			'Mit ser drückt man Identität, Herkunft, Beruf und andere dauerhafte Eigenschaften aus. Es beantwortet, was jemand oder etwas seinem Wesen nach ist. Typische Hinweise sind Namen, Nationalitäten und Berufe.',
		pattern: 'yo soy, tu eres, el/ella es, nosotros somos, vosotros sois, ellos son',
		examples: [
			{ target: 'Yo soy estudiante.', en: 'I am a student.', de: 'Ich bin Student.' },
			{ target: 'Ella es de Mexico.', en: 'She is from Mexico.', de: 'Sie kommt aus Mexiko.' },
			{ target: 'Nosotros somos amigos.', en: 'We are friends.', de: 'Wir sind Freunde.' }
		],
		cefrLevel: 'A1',
		order: 1
	},
	{
		key: 'es.grammar.estar-present',
		titleEn: 'Estar (present)',
		titleDe: 'Estar (Präsens)',
		explanationEn:
			'Use estar for temporary states and location. It often describes how someone feels right now or where people and things are. Many adjectives change meaning depending on ser or estar.',
		explanationDe:
			'Mit estar drückt man vorübergehende Zustände und Orte aus. Es beschreibt oft, wie sich jemand gerade fühlt oder wo sich Personen und Dinge befinden. Viele Adjektive ändern ihre Bedeutung je nach ser oder estar.',
		pattern: 'yo estoy, tu estas, el/ella esta, nosotros estamos, vosotros estais, ellos estan',
		examples: [
			{ target: 'Estoy cansado.', en: 'I am tired.', de: 'Ich bin müde.' },
			{
				target: 'Madrid esta en Espana.',
				en: 'Madrid is in Spain.',
				de: 'Madrid liegt in Spanien.'
			},
			{ target: 'Ellos estan en casa.', en: 'They are at home.', de: 'Sie sind zu Hause.' }
		],
		cefrLevel: 'A1',
		order: 2
	},
	{
		key: 'es.grammar.present-ar',
		titleEn: 'Regular -ar verbs (present)',
		titleDe: 'Regelmäßige -ar-Verben (Präsens)',
		explanationEn:
			'Regular -ar verbs drop -ar and add standard endings in the present tense. This pattern is highly frequent and helps you build many basic sentences. Common verbs include hablar and caminar.',
		explanationDe:
			'Regelmäßige -ar-Verben verlieren im Präsens die Endung -ar und bekommen feste Endungen. Dieses Muster ist sehr häufig und hilft beim Aufbau vieler einfacher Sätze. Typische Verben sind hablar und caminar.',
		pattern: '-ar -> o, as, a, amos, ais, an',
		examples: [
			{ target: 'Yo hablo espanol.', en: 'I speak Spanish.', de: 'Ich spreche Spanisch.' },
			{ target: 'Tu caminas rapido.', en: 'You walk fast.', de: 'Du gehst schnell.' },
			{ target: 'Nosotros trabajamos aqui.', en: 'We work here.', de: 'Wir arbeiten hier.' }
		],
		cefrLevel: 'A1',
		order: 3
	},
	{
		key: 'es.grammar.present-er',
		titleEn: 'Regular -er verbs (present)',
		titleDe: 'Regelmäßige -er-Verben (Präsens)',
		explanationEn:
			'Regular -er verbs use a stable set of present-tense endings after removing -er. Learn this pattern early to understand many daily actions. Typical examples are comer and beber.',
		explanationDe:
			'Regelmäßige -er-Verben nutzen nach Wegfall von -er feste Präsensendungen. Dieses Muster sollte man früh lernen, weil es viele Alltagsverben abdeckt. Typische Beispiele sind comer und beber.',
		pattern: '-er -> o, es, e, emos, eis, en',
		examples: [
			{ target: 'Ella come pan.', en: 'She eats bread.', de: 'Sie isst Brot.' },
			{ target: 'Yo bebo agua.', en: 'I drink water.', de: 'Ich trinke Wasser.' },
			{ target: 'Vosotros aprendeis mucho.', en: 'You all learn a lot.', de: 'Ihr lernt viel.' }
		],
		cefrLevel: 'A1',
		order: 4
	},
	{
		key: 'es.grammar.present-ir',
		titleEn: 'Regular -ir verbs (present)',
		titleDe: 'Regelmäßige -ir-Verben (Präsens)',
		explanationEn:
			'Regular -ir verbs follow endings close to -er verbs, but with nosotros and vosotros forms in -imos and -is. This group is common in everyday language. Examples include vivir and escribir.',
		explanationDe:
			'Regelmäßige -ir-Verben haben Endungen ähnlich wie -er-Verben, aber mit nosotros und vosotros in -imos und -is. Diese Gruppe ist im Alltag sehr verbreitet. Beispiele sind vivir und escribir.',
		pattern: '-ir -> o, es, e, imos, is, en',
		examples: [
			{ target: 'Yo vivo en Berlin.', en: 'I live in Berlin.', de: 'Ich wohne in Berlin.' },
			{
				target: 'Tu escribes una carta.',
				en: 'You write a letter.',
				de: 'Du schreibst einen Brief.'
			},
			{ target: 'Ellos abren la puerta.', en: 'They open the door.', de: 'Sie öffnen die Tür.' }
		],
		cefrLevel: 'A1',
		order: 5
	},
	{
		key: 'es.grammar.definite-articles',
		titleEn: 'Definite articles (el/la/los/las)',
		titleDe: 'Bestimmte Artikel (el/la/los/las)',
		explanationEn:
			'Definite articles point to specific nouns and must agree in gender and number. Use el/la for singular and los/las for plural. The noun determines which article is correct.',
		explanationDe:
			'Bestimmte Artikel beziehen sich auf konkrete Nomen und müssen in Genus und Numerus übereinstimmen. Man verwendet el/la im Singular und los/las im Plural. Das Nomen bestimmt den passenden Artikel.',
		pattern: 'el libro, la casa, los libros, las casas',
		examples: [
			{ target: 'El coche es nuevo.', en: 'The car is new.', de: 'Das Auto ist neu.' },
			{ target: 'La mesa es grande.', en: 'The table is big.', de: 'Der Tisch ist groß.' },
			{
				target: 'Las flores son bonitas.',
				en: 'The flowers are pretty.',
				de: 'Die Blumen sind schön.'
			}
		],
		cefrLevel: 'A1',
		order: 6
	},
	{
		key: 'es.grammar.indefinite-articles',
		titleEn: 'Indefinite articles (un/una/unos/unas)',
		titleDe: 'Unbestimmte Artikel (un/una/unos/unas)',
		explanationEn:
			'Indefinite articles introduce non-specific nouns. They also change for gender and number: un/una in singular, unos/unas in plural. They correspond to a, an, or some in English.',
		explanationDe:
			'Unbestimmte Artikel führen nicht näher bestimmte Nomen ein. Sie passen sich ebenfalls an Genus und Numerus an: un/una im Singular, unos/unas im Plural. Im Deutschen entsprechen sie ein/eine bzw. einige.',
		pattern: 'un libro, una casa, unos libros, unas casas',
		examples: [
			{ target: 'Tengo un perro.', en: 'I have a dog.', de: 'Ich habe einen Hund.' },
			{ target: 'Ella compra una falda.', en: 'She buys a skirt.', de: 'Sie kauft einen Rock.' },
			{
				target: 'Necesitamos unas sillas.',
				en: 'We need some chairs.',
				de: 'Wir brauchen ein paar Stühle.'
			}
		],
		cefrLevel: 'A1',
		order: 7
	},
	{
		key: 'es.grammar.adjective-agreement',
		titleEn: 'Adjective agreement',
		titleDe: 'Adjektivkongruenz',
		explanationEn:
			'Adjectives usually agree with the noun in gender and number. Many adjectives ending in -o change to -a, -os, -as. This agreement is essential for natural and correct Spanish.',
		explanationDe:
			'Adjektive stimmen im Spanischen meist in Genus und Numerus mit dem Nomen überein. Viele Adjektive auf -o werden zu -a, -os oder -as. Diese Kongruenz ist für korrektes Spanisch zentral.',
		pattern: 'chico alto, chica alta, chicos altos, chicas altas',
		examples: [
			{ target: 'La casa blanca', en: 'The white house', de: 'Das weiße Haus' },
			{ target: 'Los ninos pequenos', en: 'The small boys', de: 'Die kleinen Jungen' },
			{ target: 'Las camisetas rojas', en: 'The red T-shirts', de: 'Die roten T-Shirts' }
		],
		cefrLevel: 'A1',
		order: 8
	},
	{
		key: 'es.grammar.negation-no',
		titleEn: 'Negation (no + verb)',
		titleDe: 'Negation (no + Verb)',
		explanationEn:
			'Basic negation is formed by putting no directly before the conjugated verb. This is the standard pattern for saying not in simple sentences. Keep no close to the verb for clarity.',
		explanationDe:
			'Die einfache Verneinung bildet man mit no direkt vor dem konjugierten Verb. Das ist das Grundmuster für nicht in einfachen Sätzen. No steht dabei unmittelbar beim Verb.',
		pattern: 'no + [conjugated verb]',
		examples: [
			{
				target: 'No hablo ingles.',
				en: 'I do not speak English.',
				de: 'Ich spreche kein Englisch.'
			},
			{ target: 'Ella no come carne.', en: 'She does not eat meat.', de: 'Sie isst kein Fleisch.' },
			{ target: 'No estamos listos.', en: 'We are not ready.', de: 'Wir sind nicht bereit.' }
		],
		cefrLevel: 'A1',
		order: 9
	},
	{
		key: 'es.grammar.question-words',
		titleEn: 'Question words',
		titleDe: 'Fragewörter',
		explanationEn:
			'Spanish question words introduce information questions and usually carry written accents. Core words are que, donde, cuando, como, cuanto, and quien. They help you ask for details naturally.',
		explanationDe:
			'Spanische Fragewörter leiten Ergänzungsfragen ein und tragen in der Regel Akzente. Zentrale Formen sind que, donde, cuando, como, cuanto und quien. Damit fragt man gezielt nach Informationen.',
		pattern: 'Que, donde, cuando, como, cuanto, quien + ...?',
		examples: [
			{ target: 'Que haces?', en: 'What are you doing?', de: 'Was machst du?' },
			{ target: 'Donde vives?', en: 'Where do you live?', de: 'Wo wohnst du?' },
			{
				target: 'Cuando empieza la clase?',
				en: 'When does the class start?',
				de: 'Wann beginnt der Unterricht?'
			}
		],
		cefrLevel: 'A1',
		order: 10
	},
	{
		key: 'es.grammar.hay',
		titleEn: 'Hay (there is / there are)',
		titleDe: 'Hay (es gibt)',
		explanationEn:
			'Hay is an impersonal form meaning there is or there are. It does not change between singular and plural. Use it to indicate existence, often with indefinite articles.',
		explanationDe:
			'Hay ist eine unpersönliche Form im Sinn von es gibt. Sie bleibt im Singular und Plural gleich. Man verwendet sie, um die Existenz von Dingen oder Personen auszudrücken, oft mit unbestimmtem Artikel.',
		pattern: 'hay + noun',
		examples: [
			{
				target: 'Hay un libro en la mesa.',
				en: 'There is a book on the table.',
				de: 'Es gibt ein Buch auf dem Tisch.'
			},
			{
				target: 'Hay dos cafes aqui.',
				en: 'There are two cafes here.',
				de: 'Hier gibt es zwei Cafes.'
			},
			{ target: 'No hay problema.', en: 'There is no problem.', de: 'Es gibt kein Problem.' }
		],
		cefrLevel: 'A1',
		order: 11
	},
	{
		key: 'es.grammar.gustar',
		titleEn: 'Gustar',
		titleDe: 'Gustar',
		explanationEn:
			'Gustar uses an inverted structure: the thing liked is the grammatical subject. You normally add an indirect object pronoun like me, te, or le. Use gusta with singular nouns/verbs and gustan with plurals.',
		explanationDe:
			'Gustar hat eine umgekehrte Struktur: Das, was gefällt, ist das grammatische Subjekt. Dazu kommt meist ein indirektes Objektpronomen wie me, te oder le. Man verwendet gusta bei Singular und Verben, gustan bei Plural.',
		pattern: 'me/te/le/nos/os/les + gusta(n) + noun/infinitive',
		examples: [
			{ target: 'Me gusta la musica.', en: 'I like music.', de: 'Ich mag Musik.' },
			{ target: 'Te gustan los libros.', en: 'You like books.', de: 'Du magst Bücher.' },
			{ target: 'Nos gusta viajar.', en: 'We like to travel.', de: 'Wir reisen gern.' }
		],
		cefrLevel: 'A1',
		order: 12
	},
	{
		key: 'es.grammar.possessives',
		titleEn: 'Possessives',
		titleDe: 'Possessivbegleiter',
		explanationEn:
			'Possessive determiners show ownership and usually come before the noun. Basic forms are mi, tu, su, nuestro, and vuestro, with plural variants. They agree mainly in number with the possessed noun.',
		explanationDe:
			'Possessivbegleiter zeigen Besitz an und stehen meist vor dem Nomen. Wichtige Grundformen sind mi, tu, su, nuestro und vuestro mit ihren Pluralformen. Sie richten sich vor allem im Numerus nach dem Bezugsnomen.',
		pattern: 'mi/mis, tu/tus, su/sus, nuestro/-a/-os/-as, vuestro/-a/-os/-as',
		examples: [
			{
				target: 'Mi hermano vive aqui.',
				en: 'My brother lives here.',
				de: 'Mein Bruder wohnt hier.'
			},
			{
				target: 'Nuestra casa es pequena.',
				en: 'Our house is small.',
				de: 'Unser Haus ist klein.'
			},
			{
				target: 'Sus amigos son simpaticos.',
				en: 'His/Her/Their friends are nice.',
				de: 'Seine/Ihre Freunde sind nett.'
			}
		],
		cefrLevel: 'A1',
		order: 13
	},
	{
		key: 'es.grammar.tener-present',
		titleEn: 'Tener (present)',
		titleDe: 'Tener (Präsens)',
		explanationEn:
			'Tener means to have and is irregular in the yo form (tengo). It is also used in many common expressions such as age and physical states. Learn it early because it appears in daily conversation constantly.',
		explanationDe:
			'Tener bedeutet haben und ist in der yo-Form unregelmäßig (tengo). Es steht außerdem in vielen festen Ausdrücken, etwa für Alter und Befinden. Deshalb gehört es zu den wichtigsten Verben im Alltag.',
		pattern: 'yo tengo, tu tienes, el/ella tiene, nosotros tenemos, vosotros teneis, ellos tienen',
		examples: [
			{ target: 'Tengo dos hermanas.', en: 'I have two sisters.', de: 'Ich habe zwei Schwestern.' },
			{
				target: 'Ella tiene veinte anos.',
				en: 'She is twenty years old.',
				de: 'Sie ist zwanzig Jahre alt.'
			},
			{ target: 'Tenemos hambre.', en: 'We are hungry.', de: 'Wir haben Hunger.' }
		],
		cefrLevel: 'A1',
		order: 14
	},
	{
		key: 'es.grammar.ir-present',
		titleEn: 'Ir (present)',
		titleDe: 'Ir (Präsens)',
		explanationEn:
			'Ir means to go and has fully irregular present forms. It is essential for talking about movement and near future plans with ir + a + infinitive. Memorizing all forms is necessary at A1.',
		explanationDe:
			'Ir bedeutet gehen/fahren und hat völlig unregelmäßige Präsensformen. Es ist zentral für Bewegung und nahe Zukunft mit ir + a + Infinitiv. Für A1 sollte man alle Formen sicher beherrschen.',
		pattern: 'yo voy, tu vas, el/ella va, nosotros vamos, vosotros vais, ellos van',
		examples: [
			{ target: 'Voy al mercado.', en: 'I am going to the market.', de: 'Ich gehe zum Markt.' },
			{ target: 'Vamos a estudiar.', en: 'We are going to study.', de: 'Wir werden lernen.' },
			{
				target: 'Ellos van a Madrid.',
				en: 'They are going to Madrid.',
				de: 'Sie fahren nach Madrid.'
			}
		],
		cefrLevel: 'A1',
		order: 15
	}
];
