import type { GrammarPointData } from '$lib/learning/types';

export const GRAMMAR_N5: GrammarPointData[] = [
	{
		key: 'ja.grammar.desu',
		titleEn: 'です (desu)',
		titleDe: 'です (desu)',
		explanationEn:
			"です is the polite copula in Japanese. It links a noun or na-adjective to the speaker's statement. Use it often in beginner conversations to sound polite.",
		explanationDe:
			'です ist die hoefliche Kopula im Japanischen. Sie verbindet ein Nomen oder ein Na-Adjektiv mit der Aussage des Sprechers. In Anfaengerdialogen nutzt man sie sehr haeufig, um hoeflich zu klingen.',
		pattern: '[noun] です',
		examples: [
			{ target: 'わたしは学生です。', en: 'I am a student.', de: 'Ich bin Student.' },
			{ target: 'これは本です。', en: 'This is a book.', de: 'Das ist ein Buch.' },
			{
				target: '田中さんは先生です。',
				en: 'Mr. Tanaka is a teacher.',
				de: 'Herr Tanaka ist Lehrer.'
			}
		],
		cefrLevel: 'A1',
		order: 1
	},
	{
		key: 'ja.grammar.wa-topic',
		titleEn: 'は (wa) topic marker',
		titleDe: 'は (wa) Themenpartikel',
		explanationEn:
			'は marks the topic of the sentence and is pronounced wa. It tells the listener what the sentence is about. It often contrasts one topic with another.',
		explanationDe:
			'は markiert das Thema des Satzes und wird wa ausgesprochen. Es zeigt, worueber der Satz spricht. Oft setzt es auch einen Kontrast zu einem anderen Thema.',
		pattern: '[topic] は [comment]',
		examples: [
			{
				target: 'わたしは日本人です。',
				en: 'As for me, I am Japanese.',
				de: 'Was mich betrifft: Ich bin Japaner.'
			},
			{ target: 'この店は安いです。', en: 'This shop is cheap.', de: 'Dieser Laden ist guenstig.' },
			{ target: '今日は寒いです。', en: 'Today is cold.', de: 'Heute ist es kalt.' }
		],
		cefrLevel: 'A1',
		order: 2
	},
	{
		key: 'ja.grammar.ga-subject',
		titleEn: 'が (ga) subject marker',
		titleDe: 'が (ga) Subjektpartikel',
		explanationEn:
			'が marks the grammatical subject, especially when introducing new information. It highlights who or what performs or has something. It is common with existence and ability expressions.',
		explanationDe:
			'が markiert das grammatische Subjekt, besonders bei neuer Information. Es hebt hervor, wer oder was etwas tut oder hat. Bei Existenz- und Faehigkeitsausdruecken kommt es sehr haeufig vor.',
		pattern: '[subject] が [predicate]',
		examples: [
			{ target: '猫がいます。', en: 'There is a cat.', de: 'Es gibt eine Katze.' },
			{ target: 'だれが来ますか。', en: 'Who is coming?', de: 'Wer kommt?' },
			{ target: '雨が降っています。', en: 'It is raining.', de: 'Es regnet.' }
		],
		cefrLevel: 'A1',
		order: 3
	},
	{
		key: 'ja.grammar.wo-object',
		titleEn: 'を (wo) object marker',
		titleDe: 'を (wo) Objektpartikel',
		explanationEn:
			'を marks the direct object of an action verb. It is pronounced o in modern Japanese. Use it to show what is being eaten, read, seen, or done.',
		explanationDe:
			'を markiert das direkte Objekt eines Handlungsverbs. Im heutigen Japanisch wird es o ausgesprochen. Damit zeigt man, was gegessen, gelesen, gesehen oder getan wird.',
		pattern: '[object] を [verb]',
		examples: [
			{ target: '水を飲みます。', en: 'I drink water.', de: 'Ich trinke Wasser.' },
			{ target: '本を読みます。', en: 'I read a book.', de: 'Ich lese ein Buch.' },
			{ target: '映画を見ます。', en: 'I watch a movie.', de: 'Ich schaue einen Film.' }
		],
		cefrLevel: 'A1',
		order: 4
	},
	{
		key: 'ja.grammar.ni-marker',
		titleEn: 'に (ni) marker',
		titleDe: 'に (ni) Partikel',
		explanationEn:
			'に can mark time, destination, or a target location. It often answers when or where to. It also marks recipients in giving verbs.',
		explanationDe:
			'に kann Zeit, Ziel oder Zielort markieren. Es beantwortet oft wann oder wohin. Ausserdem markiert es den Empfaenger bei Verben des Gebens.',
		pattern: '[time/place/person] に [verb]',
		examples: [
			{ target: '七時に起きます。', en: 'I wake up at seven.', de: 'Ich stehe um sieben Uhr auf.' },
			{ target: '学校に行きます。', en: 'I go to school.', de: 'Ich gehe zur Schule.' },
			{
				target: '友だちに手紙を書きます。',
				en: 'I write a letter to a friend.',
				de: 'Ich schreibe einem Freund einen Brief.'
			}
		],
		cefrLevel: 'A1',
		order: 5
	},
	{
		key: 'ja.grammar.de-marker',
		titleEn: 'で (de) marker',
		titleDe: 'で (de) Partikel',
		explanationEn:
			'で marks the place where an action happens. It also marks means or tools, like by bus or with chopsticks. It does not mark destination; use に for that.',
		explanationDe:
			'で markiert den Ort, an dem eine Handlung stattfindet. Es markiert auch Mittel oder Werkzeuge, zum Beispiel mit dem Bus oder mit Staebchen. Ein Ziel markiert es nicht; dafuer nutzt man に.',
		pattern: '[place/tool] で [verb]',
		examples: [
			{
				target: '図書館で勉強します。',
				en: 'I study at the library.',
				de: 'Ich lerne in der Bibliothek.'
			},
			{
				target: 'バスで会社へ行きます。',
				en: 'I go to the office by bus.',
				de: 'Ich fahre mit dem Bus zur Firma.'
			},
			{ target: 'はしで食べます。', en: 'I eat with chopsticks.', de: 'Ich esse mit Staebchen.' }
		],
		cefrLevel: 'A1',
		order: 6
	},
	{
		key: 'ja.grammar.to-and-with',
		titleEn: 'と (to) and/with/quotation',
		titleDe: 'と (to) und/mit/Zitat',
		explanationEn:
			'と connects nouns as and and marks companions as with. It also introduces direct quotations before verbs like say or think. The exact meaning depends on context.',
		explanationDe:
			'と verbindet Nomen als und und markiert Begleiter als mit. Es leitet auch direkte Zitate vor Verben wie sagen oder denken ein. Die genaue Bedeutung ergibt sich aus dem Kontext.',
		pattern: '[noun] と [noun] / [quote] と [verb]',
		examples: [
			{
				target: 'パンと牛乳を買います。',
				en: 'I buy bread and milk.',
				de: 'Ich kaufe Brot und Milch.'
			},
			{
				target: '友だちと話します。',
				en: 'I talk with a friend.',
				de: 'Ich spreche mit einem Freund.'
			},
			{ target: '「はい」と言いました。', en: 'I said yes.', de: 'Ich habe ja gesagt.' }
		],
		cefrLevel: 'A1',
		order: 7
	},
	{
		key: 'ja.grammar.mo-also',
		titleEn: 'も (mo) also/too',
		titleDe: 'も (mo) auch',
		explanationEn:
			'も means also or too and replaces particles like は or が in many cases. It adds a similar item to what was said before. It is very common in simple conversation.',
		explanationDe:
			'も bedeutet auch und ersetzt oft Partikeln wie は oder が. Es fuegt etwas Aehnliches zu einer vorherigen Aussage hinzu. In einfachen Gespraechen kommt es sehr haeufig vor.',
		pattern: '[noun] も [predicate]',
		examples: [
			{ target: 'わたしも学生です。', en: 'I am also a student.', de: 'Ich bin auch Student.' },
			{ target: 'これもおいしいです。', en: 'This is tasty too.', de: 'Das ist auch lecker.' },
			{
				target: '田中さんも来ます。',
				en: 'Mr. Tanaka will come too.',
				de: 'Herr Tanaka kommt auch.'
			}
		],
		cefrLevel: 'A1',
		order: 8
	},
	{
		key: 'ja.grammar.no-possessive',
		titleEn: 'の (no) possessive/modifier',
		titleDe: 'の (no) Genitiv/Modifikator',
		explanationEn:
			'の links two nouns, often showing possession or belonging. It can also turn one noun into a modifier for another noun. Think of it like of or apostrophe s.',
		explanationDe:
			'の verbindet zwei Nomen und zeigt oft Besitz oder Zugehoerigkeit. Es kann auch ein Nomen als Modifikator fuer ein anderes Nomen verwenden. Man kann es haeufig wie von oder Apostroph-s verstehen.',
		pattern: '[noun 1] の [noun 2]',
		examples: [
			{ target: 'わたしの本です。', en: 'It is my book.', de: 'Es ist mein Buch.' },
			{ target: '日本の車です。', en: 'It is a Japanese car.', de: 'Es ist ein japanisches Auto.' },
			{
				target: '先生の名前は田中です。',
				en: "The teacher's name is Tanaka.",
				de: 'Der Name des Lehrers ist Tanaka.'
			}
		],
		cefrLevel: 'A1',
		order: 9
	},
	{
		key: 'ja.grammar.ka-question',
		titleEn: 'か (ka) question marker',
		titleDe: 'か (ka) Fragepartikel',
		explanationEn:
			'か turns a polite statement into a question. It is placed at the end of the sentence. In casual speech, rising intonation can replace it, but beginners should use か.',
		explanationDe:
			'か macht aus einer hoeflichen Aussage eine Frage. Es steht am Satzende. In lockerer Sprache kann steigende Intonation es ersetzen, aber fuer Anfaenger ist か der sichere Standard.',
		pattern: '[sentence] か',
		examples: [
			{ target: '元気ですか。', en: 'Are you well?', de: 'Geht es dir gut?' },
			{ target: 'これは何ですか。', en: 'What is this?', de: 'Was ist das?' },
			{ target: '日本人ですか。', en: 'Are you Japanese?', de: 'Sind Sie Japaner?' }
		],
		cefrLevel: 'A1',
		order: 10
	},
	{
		key: 'ja.grammar.kara-from-because',
		titleEn: 'から (kara) from/because',
		titleDe: 'から (kara) von/weil',
		explanationEn:
			'から means from for places and times. It also means because when linking reason and result. Context shows which meaning is intended.',
		explanationDe:
			'から bedeutet von bei Orten und Zeiten. Es bedeutet auch weil, wenn Grund und Folge verbunden werden. Der Kontext zeigt, welche Bedeutung gemeint ist.',
		pattern: '[noun/time] から / [reason] から [result]',
		examples: [
			{
				target: '九時から勉強します。',
				en: "I study from nine o'clock.",
				de: 'Ich lerne ab neun Uhr.'
			},
			{
				target: '駅から歩きます。',
				en: 'I walk from the station.',
				de: 'Ich gehe vom Bahnhof zu Fuss.'
			},
			{
				target: '雨ですから、家にいます。',
				en: 'Because it is raining, I stay home.',
				de: 'Weil es regnet, bleibe ich zu Hause.'
			}
		],
		cefrLevel: 'A1',
		order: 11
	},
	{
		key: 'ja.grammar.made-until',
		titleEn: 'まで (made) until/to',
		titleDe: 'まで (made) bis',
		explanationEn:
			'まで marks an end point in time or space. It often pairs with から to show a full range from to. Use it after times and destinations.',
		explanationDe:
			'まで markiert einen Endpunkt in Zeit oder Raum. Es steht oft zusammen mit から, um einen Bereich von bis zu zeigen. Man benutzt es nach Zeiten und Zielorten.',
		pattern: '[time/place] まで',
		examples: [
			{ target: '五時まで働きます。', en: 'I work until five.', de: 'Ich arbeite bis fuenf Uhr.' },
			{ target: '東京まで行きます。', en: 'I go as far as Tokyo.', de: 'Ich fahre bis Tokio.' },
			{
				target: '月曜日から金曜日まで学校です。',
				en: 'School is from Monday to Friday.',
				de: 'Schule ist von Montag bis Freitag.'
			}
		],
		cefrLevel: 'A1',
		order: 12
	},
	{
		key: 'ja.grammar.masu-polite',
		titleEn: 'ます (masu) polite verb ending',
		titleDe: 'ます (masu) hoefliche Verbendung',
		explanationEn:
			'ます is the polite present-future ending for verbs. It is used in neutral polite speech at school, work, and with strangers. Dictionary-form verbs are converted to their ます stem before adding ます.',
		explanationDe:
			'ます ist die hoefliche Verbgendung fuer Gegenwart und Zukunft. Man nutzt sie in neutral-hoeflicher Sprache in Schule, Arbeit und mit Unbekannten. Woerterbuchformen werden zuerst zum ます-Stamm umgeformt.',
		pattern: '[verb stem] ます',
		examples: [
			{
				target: '毎日日本語を勉強します。',
				en: 'I study Japanese every day.',
				de: 'Ich lerne jeden Tag Japanisch.'
			},
			{ target: '水を飲みます。', en: 'I drink water.', de: 'Ich trinke Wasser.' },
			{
				target: '七時に寝ます。',
				en: 'I go to bed at seven.',
				de: 'Ich gehe um sieben Uhr schlafen.'
			}
		],
		cefrLevel: 'A1',
		order: 13
	},
	{
		key: 'ja.grammar.masen-negative',
		titleEn: 'ません (masen) polite negative',
		titleDe: 'ません (masen) hoefliche Verneinung',
		explanationEn:
			'ません is the polite negative form of ます verbs. It means do not or does not in present-future contexts. Use the same verb stem as ます and replace the ending.',
		explanationDe:
			'ません ist die hoefliche Verneinung von ます-Formen. Es bedeutet in Gegenwart und Zukunft nicht tun. Man benutzt denselben Stamm wie bei ます und ersetzt nur die Endung.',
		pattern: '[verb stem] ません',
		examples: [
			{ target: '肉を食べません。', en: 'I do not eat meat.', de: 'Ich esse kein Fleisch.' },
			{
				target: '今日は学校へ行きません。',
				en: 'I will not go to school today.',
				de: 'Ich gehe heute nicht zur Schule.'
			},
			{
				target: 'コーヒーを飲みません。',
				en: 'I do not drink coffee.',
				de: 'Ich trinke keinen Kaffee.'
			}
		],
		cefrLevel: 'A1',
		order: 14
	},
	{
		key: 'ja.grammar.mashita-past',
		titleEn: 'ました (mashita) polite past',
		titleDe: 'ました (mashita) hoefliche Vergangenheit',
		explanationEn:
			'ました is the polite past form of verbs. It expresses completed actions in the past. Build it from the same stem as ます and attach ました.',
		explanationDe:
			'ました ist die hoefliche Vergangenheitsform von Verben. Sie drueckt abgeschlossene Handlungen in der Vergangenheit aus. Man bildet sie mit demselben Stamm wie bei ます und haengt ました an.',
		pattern: '[verb stem] ました',
		examples: [
			{
				target: '昨日映画を見ました。',
				en: 'I watched a movie yesterday.',
				de: 'Ich habe gestern einen Film gesehen.'
			},
			{ target: '朝ご飯を食べました。', en: 'I ate breakfast.', de: 'Ich habe gefruehstueckt.' },
			{
				target: '日曜日に京都へ行きました。',
				en: 'I went to Kyoto on Sunday.',
				de: 'Ich bin am Sonntag nach Kyoto gefahren.'
			}
		],
		cefrLevel: 'A1',
		order: 15
	}
];
