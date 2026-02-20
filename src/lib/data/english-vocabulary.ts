export interface VocabItem {
	target: string;
	en: string;
	de: string;
}

export interface UnitVocab {
	titleEn: string;
	titleDe: string;
	descriptionEn: string;
	descriptionDe: string;
	themeColor: string;
	vocab: VocabItem[];
	sentences: { target: string; en: string; de: string }[];
}

export const A1_UNITS: UnitVocab[] = [
	{
		titleEn: 'Greetings & Introductions',
		titleDe: 'Begrüßungen & Vorstellungen',
		descriptionEn: 'Learn basic greetings and how to introduce yourself',
		descriptionDe: 'Lerne grundlegende Begrüßungen und stelle dich vor',
		themeColor: '#3B82F6',
		vocab: [
			{ target: 'hello', en: 'hello', de: 'hallo' },
			{ target: 'goodbye', en: 'goodbye', de: 'auf Wiedersehen' },
			{ target: 'good morning', en: 'good morning', de: 'guten Morgen' },
			{ target: 'good afternoon', en: 'good afternoon', de: 'guten Nachmittag' },
			{ target: 'good evening', en: 'good evening', de: 'guten Abend' },
			{ target: 'good night', en: 'good night', de: 'gute Nacht' },
			{ target: 'see you later', en: 'see you later', de: 'bis später' },
			{ target: 'see you tomorrow', en: 'see you tomorrow', de: 'bis morgen' },
			{ target: 'please', en: 'please', de: 'bitte' },
			{ target: 'thank you', en: 'thank you', de: 'danke' },
			{ target: 'you are welcome', en: 'you are welcome', de: 'bitte schön' },
			{ target: 'sorry', en: 'sorry', de: 'Entschuldigung' },
			{ target: 'excuse me', en: 'excuse me', de: 'Verzeihung' },
			{ target: 'yes', en: 'yes', de: 'ja' },
			{ target: 'no', en: 'no', de: 'nein' },
			{ target: 'I', en: 'I', de: 'ich' },
			{ target: 'you', en: 'you', de: 'du' },
			{ target: 'you (formal)', en: 'you (formal)', de: 'Sie' },
			{ target: 'mister', en: 'mister', de: 'Herr' },
			{ target: 'mrs', en: 'mrs', de: 'Frau' }
		],
		sentences: [
			{ target: 'Hello, how are you?', en: 'Hello, how are you?', de: 'Hallo, wie geht es dir?' },
			{ target: 'My name is Anna.', en: 'My name is Anna.', de: 'Ich heiße Anna.' },
			{
				target: 'Nice to meet you.',
				en: 'Nice to meet you.',
				de: 'Freut mich, dich kennenzulernen.'
			},
			{
				target: 'Good morning, sir.',
				en: 'Good morning, sir.',
				de: 'Guten Morgen, mein Herr.'
			},
			{ target: 'Thank you very much.', en: 'Thank you very much.', de: 'Vielen Dank.' }
		]
	},
	{
		titleEn: 'Numbers 1-100',
		titleDe: 'Zahlen 1-100',
		descriptionEn: 'Learn to count and use numbers in English',
		descriptionDe: 'Lerne auf Englisch zu zählen und Zahlen zu benutzen',
		themeColor: '#8B5CF6',
		vocab: [
			{ target: 'one', en: 'one', de: 'eins' },
			{ target: 'two', en: 'two', de: 'zwei' },
			{ target: 'three', en: 'three', de: 'drei' },
			{ target: 'four', en: 'four', de: 'vier' },
			{ target: 'five', en: 'five', de: 'fünf' },
			{ target: 'six', en: 'six', de: 'sechs' },
			{ target: 'seven', en: 'seven', de: 'sieben' },
			{ target: 'eight', en: 'eight', de: 'acht' },
			{ target: 'nine', en: 'nine', de: 'neun' },
			{ target: 'ten', en: 'ten', de: 'zehn' },
			{ target: 'eleven', en: 'eleven', de: 'elf' },
			{ target: 'twelve', en: 'twelve', de: 'zwölf' },
			{ target: 'twenty', en: 'twenty', de: 'zwanzig' },
			{ target: 'thirty', en: 'thirty', de: 'dreißig' },
			{ target: 'forty', en: 'forty', de: 'vierzig' },
			{ target: 'fifty', en: 'fifty', de: 'fünfzig' },
			{ target: 'one hundred', en: 'one hundred', de: 'hundert' },
			{ target: 'first', en: 'first', de: 'erste' },
			{ target: 'second', en: 'second', de: 'zweite' },
			{ target: 'third', en: 'third', de: 'dritte' }
		],
		sentences: [
			{
				target: 'I have three brothers.',
				en: 'I have three brothers.',
				de: 'Ich habe drei Brüder.'
			},
			{ target: 'How old are you?', en: 'How old are you?', de: 'Wie alt bist du?' },
			{
				target: "It is five o'clock.",
				en: "It is five o'clock.",
				de: 'Es ist fünf Uhr.'
			},
			{
				target: 'There are ten apples.',
				en: 'There are ten apples.',
				de: 'Es gibt zehn Äpfel.'
			},
			{
				target: 'The number is twenty.',
				en: 'The number is twenty.',
				de: 'Die Zahl ist zwanzig.'
			}
		]
	},
	{
		titleEn: 'Family',
		titleDe: 'Familie',
		descriptionEn: 'Talk about your family members',
		descriptionDe: 'Sprich über deine Familienmitglieder',
		themeColor: '#EC4899',
		vocab: [
			{ target: 'family', en: 'family', de: 'Familie' },
			{ target: 'mother', en: 'mother', de: 'Mutter' },
			{ target: 'father', en: 'father', de: 'Vater' },
			{ target: 'brother', en: 'brother', de: 'Bruder' },
			{ target: 'sister', en: 'sister', de: 'Schwester' },
			{ target: 'son', en: 'son', de: 'Sohn' },
			{ target: 'daughter', en: 'daughter', de: 'Tochter' },
			{ target: 'grandfather', en: 'grandfather', de: 'Großvater' },
			{ target: 'grandmother', en: 'grandmother', de: 'Großmutter' },
			{ target: 'uncle', en: 'uncle', de: 'Onkel' },
			{ target: 'aunt', en: 'aunt', de: 'Tante' },
			{ target: 'cousin (male)', en: 'cousin (male)', de: 'Cousin' },
			{ target: 'cousin (female)', en: 'cousin (female)', de: 'Cousine' },
			{ target: 'husband', en: 'husband', de: 'Ehemann' },
			{ target: 'wife', en: 'wife', de: 'Ehefrau' },
			{ target: 'boy', en: 'boy', de: 'Junge' },
			{ target: 'girl', en: 'girl', de: 'Mädchen' },
			{ target: 'baby', en: 'baby', de: 'Baby' },
			{ target: 'parents', en: 'parents', de: 'Eltern' },
			{ target: 'children', en: 'children', de: 'Kinder' }
		],
		sentences: [
			{
				target: 'My mother is a doctor.',
				en: 'My mother is a doctor.',
				de: 'Meine Mutter ist Ärztin.'
			},
			{ target: 'I have two sisters.', en: 'I have two sisters.', de: 'Ich habe zwei Schwestern.' },
			{
				target: 'My family is big.',
				en: 'My family is big.',
				de: 'Meine Familie ist groß.'
			},
			{
				target: 'Grandfather is at home.',
				en: 'Grandfather is at home.',
				de: 'Der Großvater ist zu Hause.'
			},
			{ target: 'She is my aunt.', en: 'She is my aunt.', de: 'Sie ist meine Tante.' }
		]
	},
	{
		titleEn: 'Colors',
		titleDe: 'Farben',
		descriptionEn: 'Learn the colors in English',
		descriptionDe: 'Lerne die Farben auf Englisch',
		themeColor: '#F59E0B',
		vocab: [
			{ target: 'red', en: 'red', de: 'rot' },
			{ target: 'blue', en: 'blue', de: 'blau' },
			{ target: 'green', en: 'green', de: 'grün' },
			{ target: 'yellow', en: 'yellow', de: 'gelb' },
			{ target: 'orange', en: 'orange', de: 'orange' },
			{ target: 'purple', en: 'purple', de: 'lila' },
			{ target: 'pink', en: 'pink', de: 'rosa' },
			{ target: 'black', en: 'black', de: 'schwarz' },
			{ target: 'white', en: 'white', de: 'weiß' },
			{ target: 'gray', en: 'gray', de: 'grau' },
			{ target: 'brown', en: 'brown', de: 'braun' },
			{ target: 'golden', en: 'golden', de: 'golden' },
			{ target: 'silver', en: 'silver', de: 'silbern' },
			{ target: 'light', en: 'light', de: 'hell' },
			{ target: 'dark', en: 'dark', de: 'dunkel' },
			{ target: 'color', en: 'color', de: 'Farbe' },
			{ target: 'colorful', en: 'colorful', de: 'bunt' },
			{ target: 'bright', en: 'bright', de: 'leuchtend' },
			{ target: 'pale', en: 'pale', de: 'blass' },
			{ target: 'vivid', en: 'vivid', de: 'lebhaft' }
		],
		sentences: [
			{ target: 'The sky is blue.', en: 'The sky is blue.', de: 'Der Himmel ist blau.' },
			{ target: 'The apple is red.', en: 'The apple is red.', de: 'Der Apfel ist rot.' },
			{ target: 'My car is black.', en: 'My car is black.', de: 'Mein Auto ist schwarz.' },
			{
				target: 'The flowers are yellow.',
				en: 'The flowers are yellow.',
				de: 'Die Blumen sind gelb.'
			},
			{ target: 'What color is it?', en: 'What color is it?', de: 'Welche Farbe hat es?' }
		]
	},
	{
		titleEn: 'Food & Drink',
		titleDe: 'Essen & Trinken',
		descriptionEn: 'Order food and describe meals',
		descriptionDe: 'Bestelle Essen und beschreibe Mahlzeiten',
		themeColor: '#10B981',
		vocab: [
			{ target: 'water', en: 'water', de: 'Wasser' },
			{ target: 'bread', en: 'bread', de: 'Brot' },
			{ target: 'milk', en: 'milk', de: 'Milch' },
			{ target: 'coffee', en: 'coffee', de: 'Kaffee' },
			{ target: 'tea', en: 'tea', de: 'Tee' },
			{ target: 'juice', en: 'juice', de: 'Saft' },
			{ target: 'meat', en: 'meat', de: 'Fleisch' },
			{ target: 'chicken', en: 'chicken', de: 'Hähnchen' },
			{ target: 'fish', en: 'fish', de: 'Fisch' },
			{ target: 'rice', en: 'rice', de: 'Reis' },
			{ target: 'egg', en: 'egg', de: 'Ei' },
			{ target: 'cheese', en: 'cheese', de: 'Käse' },
			{ target: 'fruit', en: 'fruit', de: 'Obst' },
			{ target: 'apple', en: 'apple', de: 'Apfel' },
			{ target: 'orange (fruit)', en: 'orange (fruit)', de: 'Orange' },
			{ target: 'banana', en: 'banana', de: 'Banane' },
			{ target: 'vegetable', en: 'vegetable', de: 'Gemüse' },
			{ target: 'salad', en: 'salad', de: 'Salat' },
			{ target: 'soup', en: 'soup', de: 'Suppe' },
			{ target: 'dessert', en: 'dessert', de: 'Nachtisch' }
		],
		sentences: [
			{
				target: 'I would like water, please.',
				en: 'I would like water, please.',
				de: 'Ich hätte gern Wasser, bitte.'
			},
			{
				target: 'Breakfast is ready.',
				en: 'Breakfast is ready.',
				de: 'Das Frühstück ist fertig.'
			},
			{ target: 'I like chicken.', en: 'I like chicken.', de: 'Ich mag Hähnchen.' },
			{
				target: 'What do you want to eat?',
				en: 'What do you want to eat?',
				de: 'Was möchtest du essen?'
			},
			{ target: 'The soup is hot.', en: 'The soup is hot.', de: 'Die Suppe ist heiß.' }
		]
	},
	{
		titleEn: 'Days & Time',
		titleDe: 'Tage & Zeit',
		descriptionEn: 'Learn days of the week and tell time',
		descriptionDe: 'Lerne die Wochentage und die Uhrzeit',
		themeColor: '#6366F1',
		vocab: [
			{ target: 'Monday', en: 'Monday', de: 'Montag' },
			{ target: 'Tuesday', en: 'Tuesday', de: 'Dienstag' },
			{ target: 'Wednesday', en: 'Wednesday', de: 'Mittwoch' },
			{ target: 'Thursday', en: 'Thursday', de: 'Donnerstag' },
			{ target: 'Friday', en: 'Friday', de: 'Freitag' },
			{ target: 'Saturday', en: 'Saturday', de: 'Samstag' },
			{ target: 'Sunday', en: 'Sunday', de: 'Sonntag' },
			{ target: 'week', en: 'week', de: 'Woche' },
			{ target: 'month', en: 'month', de: 'Monat' },
			{ target: 'year', en: 'year', de: 'Jahr' },
			{ target: 'today', en: 'today', de: 'heute' },
			{ target: 'tomorrow', en: 'tomorrow', de: 'morgen' },
			{ target: 'yesterday', en: 'yesterday', de: 'gestern' },
			{ target: 'hour', en: 'hour', de: 'Stunde' },
			{ target: 'minute', en: 'minute', de: 'Minute' },
			{ target: 'second', en: 'second', de: 'Sekunde' },
			{ target: 'noon', en: 'noon', de: 'Mittag' },
			{ target: 'midnight', en: 'midnight', de: 'Mitternacht' },
			{ target: 'early', en: 'early', de: 'früh' },
			{ target: 'late', en: 'late', de: 'spät' }
		],
		sentences: [
			{ target: 'Today is Monday.', en: 'Today is Monday.', de: 'Heute ist Montag.' },
			{ target: 'What time is it?', en: 'What time is it?', de: 'Wie spät ist es?' },
			{
				target: "It is three o'clock.",
				en: "It is three o'clock.",
				de: 'Es ist drei Uhr.'
			},
			{ target: 'Tomorrow is Friday.', en: 'Tomorrow is Friday.', de: 'Morgen ist Freitag.' },
			{
				target: 'The week has seven days.',
				en: 'The week has seven days.',
				de: 'Die Woche hat sieben Tage.'
			}
		]
	},
	{
		titleEn: 'Body Parts',
		titleDe: 'Körperteile',
		descriptionEn: 'Learn the parts of the body',
		descriptionDe: 'Lerne die Körperteile',
		themeColor: '#EF4444',
		vocab: [
			{ target: 'head', en: 'head', de: 'Kopf' },
			{ target: 'eye', en: 'eye', de: 'Auge' },
			{ target: 'ear', en: 'ear', de: 'Ohr' },
			{ target: 'nose', en: 'nose', de: 'Nase' },
			{ target: 'mouth', en: 'mouth', de: 'Mund' },
			{ target: 'tooth', en: 'tooth', de: 'Zahn' },
			{ target: 'tongue', en: 'tongue', de: 'Zunge' },
			{ target: 'neck', en: 'neck', de: 'Hals' },
			{ target: 'arm', en: 'arm', de: 'Arm' },
			{ target: 'hand', en: 'hand', de: 'Hand' },
			{ target: 'finger', en: 'finger', de: 'Finger' },
			{ target: 'leg', en: 'leg', de: 'Bein' },
			{ target: 'foot', en: 'foot', de: 'Fuß' },
			{ target: 'back', en: 'back', de: 'Rücken' },
			{ target: 'chest', en: 'chest', de: 'Brust' },
			{ target: 'stomach', en: 'stomach', de: 'Magen' },
			{ target: 'heart', en: 'heart', de: 'Herz' },
			{ target: 'hair', en: 'hair', de: 'Haare' },
			{ target: 'face', en: 'face', de: 'Gesicht' },
			{ target: 'body', en: 'body', de: 'Körper' }
		],
		sentences: [
			{ target: 'My head hurts.', en: 'My head hurts.', de: 'Mir tut der Kopf weh.' },
			{ target: 'I have two eyes.', en: 'I have two eyes.', de: 'Ich habe zwei Augen.' },
			{ target: 'She has long hair.', en: 'She has long hair.', de: 'Sie hat lange Haare.' },
			{ target: 'Wash your hands.', en: 'Wash your hands.', de: 'Wasch dir die Hände.' },
			{
				target: 'The heart beats fast.',
				en: 'The heart beats fast.',
				de: 'Das Herz schlägt schnell.'
			}
		]
	},
	{
		titleEn: 'Clothing',
		titleDe: 'Kleidung',
		descriptionEn: 'Learn about clothes and what to wear',
		descriptionDe: 'Lerne über Kleidung und was man trägt',
		themeColor: '#14B8A6',
		vocab: [
			{ target: 'shirt', en: 'shirt', de: 'Hemd' },
			{ target: 'pants', en: 'pants', de: 'Hose' },
			{ target: 'dress', en: 'dress', de: 'Kleid' },
			{ target: 'skirt', en: 'skirt', de: 'Rock' },
			{ target: 'shoes', en: 'shoes', de: 'Schuhe' },
			{ target: 'socks', en: 'socks', de: 'Socken' },
			{ target: 'jacket', en: 'jacket', de: 'Jacke' },
			{ target: 'coat', en: 'coat', de: 'Mantel' },
			{ target: 'hat', en: 'hat', de: 'Hut' },
			{ target: 'cap', en: 'cap', de: 'Mütze' },
			{ target: 'scarf', en: 'scarf', de: 'Schal' },
			{ target: 'gloves', en: 'gloves', de: 'Handschuhe' },
			{ target: 'belt', en: 'belt', de: 'Gürtel' },
			{ target: 'tie', en: 'tie', de: 'Krawatte' },
			{ target: 'bag', en: 'bag', de: 'Tasche' },
			{ target: 'clothes', en: 'clothes', de: 'Kleidung' },
			{ target: 't-shirt', en: 't-shirt', de: 'T-Shirt' },
			{ target: 'jeans', en: 'jeans', de: 'Jeans' },
			{ target: 'boots', en: 'boots', de: 'Stiefel' },
			{ target: 'pajamas', en: 'pajamas', de: 'Schlafanzug' }
		],
		sentences: [
			{
				target: 'She wears a red dress.',
				en: 'She wears a red dress.',
				de: 'Sie trägt ein rotes Kleid.'
			},
			{
				target: 'I need to buy shoes.',
				en: 'I need to buy shoes.',
				de: 'Ich muss Schuhe kaufen.'
			},
			{
				target: 'It is cold, put on your jacket.',
				en: 'It is cold, put on your jacket.',
				de: 'Es ist kalt, zieh deine Jacke an.'
			},
			{ target: 'Where is my shirt?', en: 'Where is my shirt?', de: 'Wo ist mein Hemd?' },
			{
				target: 'The socks are white.',
				en: 'The socks are white.',
				de: 'Die Socken sind weiß.'
			}
		]
	},
	{
		titleEn: 'House & Home',
		titleDe: 'Haus & Zuhause',
		descriptionEn: 'Learn about rooms and furniture',
		descriptionDe: 'Lerne über Räume und Möbel',
		themeColor: '#F97316',
		vocab: [
			{ target: 'house', en: 'house', de: 'Haus' },
			{ target: 'apartment', en: 'apartment', de: 'Wohnung' },
			{ target: 'room', en: 'room', de: 'Zimmer' },
			{ target: 'kitchen', en: 'kitchen', de: 'Küche' },
			{ target: 'bathroom', en: 'bathroom', de: 'Badezimmer' },
			{ target: 'bedroom', en: 'bedroom', de: 'Schlafzimmer' },
			{ target: 'living room', en: 'living room', de: 'Wohnzimmer' },
			{ target: 'dining room', en: 'dining room', de: 'Esszimmer' },
			{ target: 'door', en: 'door', de: 'Tür' },
			{ target: 'window', en: 'window', de: 'Fenster' },
			{ target: 'table', en: 'table', de: 'Tisch' },
			{ target: 'chair', en: 'chair', de: 'Stuhl' },
			{ target: 'bed', en: 'bed', de: 'Bett' },
			{ target: 'sofa', en: 'sofa', de: 'Sofa' },
			{ target: 'lamp', en: 'lamp', de: 'Lampe' },
			{ target: 'mirror', en: 'mirror', de: 'Spiegel' },
			{ target: 'stairs', en: 'stairs', de: 'Treppe' },
			{ target: 'garden', en: 'garden', de: 'Garten' },
			{ target: 'garage', en: 'garage', de: 'Garage' },
			{ target: 'roof', en: 'roof', de: 'Dach' }
		],
		sentences: [
			{ target: 'My house is big.', en: 'My house is big.', de: 'Mein Haus ist groß.' },
			{
				target: 'The kitchen is clean.',
				en: 'The kitchen is clean.',
				de: 'Die Küche ist sauber.'
			},
			{
				target: 'There is a table in the dining room.',
				en: 'There is a table in the dining room.',
				de: 'Es gibt einen Tisch im Esszimmer.'
			},
			{
				target: 'I sleep in my bed.',
				en: 'I sleep in my bed.',
				de: 'Ich schlafe in meinem Bett.'
			},
			{
				target: 'The garden has many flowers.',
				en: 'The garden has many flowers.',
				de: 'Der Garten hat viele Blumen.'
			}
		]
	},
	{
		titleEn: 'Common Verbs',
		titleDe: 'Häufige Verben',
		descriptionEn: 'Learn essential action words',
		descriptionDe: 'Lerne wichtige Tätigkeitswörter',
		themeColor: '#A855F7',
		vocab: [
			{ target: 'to be', en: 'to be', de: 'sein' },
			{ target: 'to have', en: 'to have', de: 'haben' },
			{ target: 'to do', en: 'to do', de: 'tun' },
			{ target: 'to go', en: 'to go', de: 'gehen' },
			{ target: 'to come', en: 'to come', de: 'kommen' },
			{ target: 'to see', en: 'to see', de: 'sehen' },
			{ target: 'to give', en: 'to give', de: 'geben' },
			{ target: 'to know', en: 'to know', de: 'wissen' },
			{ target: 'can', en: 'can', de: 'können' },
			{ target: 'to want', en: 'to want', de: 'wollen' },
			{ target: 'to say', en: 'to say', de: 'sagen' },
			{ target: 'to speak', en: 'to speak', de: 'sprechen' },
			{ target: 'to eat', en: 'to eat', de: 'essen' },
			{ target: 'to drink', en: 'to drink', de: 'trinken' },
			{ target: 'to sleep', en: 'to sleep', de: 'schlafen' },
			{ target: 'to live', en: 'to live', de: 'leben' },
			{ target: 'to work', en: 'to work', de: 'arbeiten' },
			{ target: 'to study', en: 'to study', de: 'lernen' },
			{ target: 'to play', en: 'to play', de: 'spielen' },
			{ target: 'to make', en: 'to make', de: 'machen' }
		],
		sentences: [
			{ target: 'I am a student.', en: 'I am a student.', de: 'Ich bin Student.' },
			{ target: 'She has a dog.', en: 'She has a dog.', de: 'Sie hat einen Hund.' },
			{ target: 'We go to the park.', en: 'We go to the park.', de: 'Wir gehen in den Park.' },
			{
				target: 'I want to learn English.',
				en: 'I want to learn English.',
				de: 'Ich möchte Englisch lernen.'
			},
			{ target: 'They work a lot.', en: 'They work a lot.', de: 'Sie arbeiten viel.' }
		]
	}
];

export const A2_UNITS: UnitVocab[] = [
	{
		titleEn: 'Weather & Seasons',
		titleDe: 'Wetter & Jahreszeiten',
		descriptionEn: 'Talk about the weather and seasons',
		descriptionDe: 'Sprich über das Wetter und die Jahreszeiten',
		themeColor: '#0EA5E9',
		vocab: [
			{ target: 'weather', en: 'weather', de: 'Wetter' },
			{ target: 'sun', en: 'sun', de: 'Sonne' },
			{ target: 'rain', en: 'rain', de: 'Regen' },
			{ target: 'snow', en: 'snow', de: 'Schnee' },
			{ target: 'wind', en: 'wind', de: 'Wind' },
			{ target: 'cloud', en: 'cloud', de: 'Wolke' },
			{ target: 'storm', en: 'storm', de: 'Sturm' },
			{ target: 'heat', en: 'heat', de: 'Hitze' },
			{ target: 'cold', en: 'cold', de: 'Kälte' },
			{ target: 'spring', en: 'spring', de: 'Frühling' },
			{ target: 'summer', en: 'summer', de: 'Sommer' },
			{ target: 'autumn', en: 'autumn', de: 'Herbst' },
			{ target: 'winter', en: 'winter', de: 'Winter' },
			{ target: 'temperature', en: 'temperature', de: 'Temperatur' },
			{ target: 'degree', en: 'degree', de: 'Grad' },
			{ target: 'humid', en: 'humid', de: 'feucht' },
			{ target: 'dry', en: 'dry', de: 'trocken' },
			{ target: 'cloudy', en: 'cloudy', de: 'bewölkt' },
			{ target: 'sunny', en: 'sunny', de: 'sonnig' },
			{ target: 'rainy', en: 'rainy', de: 'regnerisch' }
		],
		sentences: [
			{ target: 'It is hot today.', en: 'It is hot today.', de: 'Heute ist es heiß.' },
			{ target: 'It is raining.', en: 'It is raining.', de: 'Es regnet.' },
			{ target: 'Winter is cold.', en: 'Winter is cold.', de: 'Der Winter ist kalt.' },
			{
				target: 'What is the weather like?',
				en: 'What is the weather like?',
				de: 'Wie ist das Wetter?'
			},
			{ target: 'I like spring.', en: 'I like spring.', de: 'Ich mag den Frühling.' }
		]
	},
	{
		titleEn: 'Travel & Transport',
		titleDe: 'Reisen & Verkehr',
		descriptionEn: 'Learn vocabulary for traveling',
		descriptionDe: 'Lerne Vokabeln zum Reisen',
		themeColor: '#D946EF',
		vocab: [
			{ target: 'airplane', en: 'airplane', de: 'Flugzeug' },
			{ target: 'train', en: 'train', de: 'Zug' },
			{ target: 'bus', en: 'bus', de: 'Bus' },
			{ target: 'car', en: 'car', de: 'Auto' },
			{ target: 'bicycle', en: 'bicycle', de: 'Fahrrad' },
			{ target: 'boat', en: 'boat', de: 'Boot' },
			{ target: 'taxi', en: 'taxi', de: 'Taxi' },
			{ target: 'subway', en: 'subway', de: 'U-Bahn' },
			{ target: 'airport', en: 'airport', de: 'Flughafen' },
			{ target: 'station', en: 'station', de: 'Bahnhof' },
			{ target: 'ticket', en: 'ticket', de: 'Fahrkarte' },
			{ target: 'passport', en: 'passport', de: 'Reisepass' },
			{ target: 'suitcase', en: 'suitcase', de: 'Koffer' },
			{ target: 'trip', en: 'trip', de: 'Reise' },
			{ target: 'destination', en: 'destination', de: 'Ziel' },
			{ target: 'arrival', en: 'arrival', de: 'Ankunft' },
			{ target: 'departure', en: 'departure', de: 'Abfahrt' },
			{ target: 'luggage', en: 'luggage', de: 'Gepäck' },
			{ target: 'reservation', en: 'reservation', de: 'Reservierung' },
			{ target: 'tourist', en: 'tourist', de: 'Tourist' }
		],
		sentences: [
			{
				target: 'The train leaves at eight.',
				en: 'The train leaves at eight.',
				de: 'Der Zug fährt um acht ab.'
			},
			{
				target: 'I need a ticket.',
				en: 'I need a ticket.',
				de: 'Ich brauche eine Fahrkarte.'
			},
			{
				target: 'The airport is far away.',
				en: 'The airport is far away.',
				de: 'Der Flughafen ist weit weg.'
			},
			{ target: 'Where is the station?', en: 'Where is the station?', de: 'Wo ist der Bahnhof?' },
			{
				target: 'I travel by plane.',
				en: 'I travel by plane.',
				de: 'Ich reise mit dem Flugzeug.'
			}
		]
	},
	{
		titleEn: 'Shopping',
		titleDe: 'Einkaufen',
		descriptionEn: 'Learn to shop and talk about prices',
		descriptionDe: 'Lerne einzukaufen und über Preise zu sprechen',
		themeColor: '#84CC16',
		vocab: [
			{ target: 'store', en: 'store', de: 'Geschäft' },
			{ target: 'market', en: 'market', de: 'Markt' },
			{ target: 'price', en: 'price', de: 'Preis' },
			{ target: 'money', en: 'money', de: 'Geld' },
			{ target: 'card', en: 'card', de: 'Karte' },
			{ target: 'cash', en: 'cash', de: 'Bargeld' },
			{ target: 'bill', en: 'bill', de: 'Rechnung' },
			{ target: 'change', en: 'change', de: 'Wechselgeld' },
			{ target: 'discount', en: 'discount', de: 'Rabatt' },
			{ target: 'sale', en: 'sale', de: 'Angebot' },
			{ target: 'cheap', en: 'cheap', de: 'günstig' },
			{ target: 'expensive', en: 'expensive', de: 'teuer' },
			{ target: 'to buy', en: 'to buy', de: 'kaufen' },
			{ target: 'to sell', en: 'to sell', de: 'verkaufen' },
			{ target: 'to pay', en: 'to pay', de: 'bezahlen' },
			{ target: 'customer', en: 'customer', de: 'Kunde' },
			{ target: 'salesperson', en: 'salesperson', de: 'Verkäufer' },
			{ target: 'receipt', en: 'receipt', de: 'Kassenbon' },
			{ target: 'cash register', en: 'cash register', de: 'Kasse' },
			{ target: 'shopping bag', en: 'shopping bag', de: 'Einkaufstüte' }
		],
		sentences: [
			{
				target: 'How much does it cost?',
				en: 'How much does it cost?',
				de: 'Wie viel kostet das?'
			},
			{ target: 'It is very expensive.', en: 'It is very expensive.', de: 'Es ist sehr teuer.' },
			{
				target: 'Do you accept cards?',
				en: 'Do you accept cards?',
				de: 'Akzeptieren Sie Karten?'
			},
			{
				target: 'I want to buy this.',
				en: 'I want to buy this.',
				de: 'Ich möchte das kaufen.'
			},
			{
				target: 'There is a twenty percent discount.',
				en: 'There is a twenty percent discount.',
				de: 'Es gibt zwanzig Prozent Rabatt.'
			}
		]
	},
	{
		titleEn: 'Health & Body',
		titleDe: 'Gesundheit & Körper',
		descriptionEn: 'Talk about health and medical needs',
		descriptionDe: 'Sprich über Gesundheit und medizinische Bedürfnisse',
		themeColor: '#F43F5E',
		vocab: [
			{ target: 'doctor', en: 'doctor', de: 'Arzt' },
			{ target: 'hospital', en: 'hospital', de: 'Krankenhaus' },
			{ target: 'nurse', en: 'nurse', de: 'Krankenschwester' },
			{ target: 'medicine', en: 'medicine', de: 'Medizin' },
			{ target: 'sick', en: 'sick', de: 'krank' },
			{ target: 'healthy', en: 'healthy', de: 'gesund' },
			{ target: 'pain', en: 'pain', de: 'Schmerz' },
			{ target: 'fever', en: 'fever', de: 'Fieber' },
			{ target: 'flu', en: 'flu', de: 'Grippe' },
			{ target: 'cough', en: 'cough', de: 'Husten' },
			{ target: 'a cold', en: 'a cold', de: 'Erkältung' },
			{ target: 'allergy', en: 'allergy', de: 'Allergie' },
			{ target: 'appointment', en: 'appointment', de: 'Termin' },
			{ target: 'prescription', en: 'prescription', de: 'Rezept' },
			{ target: 'pill', en: 'pill', de: 'Tablette' },
			{ target: 'pharmacy', en: 'pharmacy', de: 'Apotheke' },
			{ target: 'emergency', en: 'emergency', de: 'Notfall' },
			{ target: 'ambulance', en: 'ambulance', de: 'Krankenwagen' },
			{ target: 'blood', en: 'blood', de: 'Blut' },
			{ target: 'wound', en: 'wound', de: 'Wunde' }
		],
		sentences: [
			{ target: 'I feel sick.', en: 'I feel sick.', de: 'Ich fühle mich krank.' },
			{
				target: 'I need to see the doctor.',
				en: 'I need to see the doctor.',
				de: 'Ich muss zum Arzt.'
			},
			{ target: 'I have a headache.', en: 'I have a headache.', de: 'Ich habe Kopfschmerzen.' },
			{
				target: 'Where is the pharmacy?',
				en: 'Where is the pharmacy?',
				de: 'Wo ist die Apotheke?'
			},
			{
				target: 'Take this medicine.',
				en: 'Take this medicine.',
				de: 'Nimm diese Medizin.'
			}
		]
	},
	{
		titleEn: 'Work & Professions',
		titleDe: 'Arbeit & Berufe',
		descriptionEn: 'Learn about jobs and the workplace',
		descriptionDe: 'Lerne über Berufe und den Arbeitsplatz',
		themeColor: '#06B6D4',
		vocab: [
			{ target: 'work', en: 'work', de: 'Arbeit' },
			{ target: 'office', en: 'office', de: 'Büro' },
			{ target: 'boss', en: 'boss', de: 'Chef' },
			{ target: 'employee', en: 'employee', de: 'Angestellter' },
			{ target: 'teacher', en: 'teacher', de: 'Lehrer' },
			{ target: 'lawyer', en: 'lawyer', de: 'Anwalt' },
			{ target: 'engineer', en: 'engineer', de: 'Ingenieur' },
			{ target: 'cook', en: 'cook', de: 'Koch' },
			{ target: 'police officer', en: 'police officer', de: 'Polizist' },
			{ target: 'firefighter', en: 'firefighter', de: 'Feuerwehrmann' },
			{ target: 'writer', en: 'writer', de: 'Schriftsteller' },
			{ target: 'artist', en: 'artist', de: 'Künstler' },
			{ target: 'musician', en: 'musician', de: 'Musiker' },
			{ target: 'salary', en: 'salary', de: 'Gehalt' },
			{ target: 'meeting', en: 'meeting', de: 'Besprechung' },
			{ target: 'computer', en: 'computer', de: 'Computer' },
			{ target: 'email', en: 'email', de: 'E-Mail' },
			{ target: 'project', en: 'project', de: 'Projekt' },
			{ target: 'company', en: 'company', de: 'Unternehmen' },
			{ target: 'career', en: 'career', de: 'Karriere' }
		],
		sentences: [
			{
				target: 'I work in an office.',
				en: 'I work in an office.',
				de: 'Ich arbeite in einem Büro.'
			},
			{
				target: 'My brother is an engineer.',
				en: 'My brother is an engineer.',
				de: 'Mein Bruder ist Ingenieur.'
			},
			{
				target: 'I have a meeting tomorrow.',
				en: 'I have a meeting tomorrow.',
				de: 'Ich habe morgen eine Besprechung.'
			},
			{
				target: 'What is your profession?',
				en: 'What is your profession?',
				de: 'Was ist dein Beruf?'
			},
			{ target: 'The boss is busy.', en: 'The boss is busy.', de: 'Der Chef ist beschäftigt.' }
		]
	},
	{
		titleEn: 'Education',
		titleDe: 'Bildung',
		descriptionEn: 'School and learning vocabulary',
		descriptionDe: 'Schul- und Lernvokabular',
		themeColor: '#7C3AED',
		vocab: [
			{ target: 'school', en: 'school', de: 'Schule' },
			{ target: 'university', en: 'university', de: 'Universität' },
			{ target: 'class', en: 'class', de: 'Unterricht' },
			{ target: 'student', en: 'student', de: 'Student' },
			{ target: 'professor', en: 'professor', de: 'Professor' },
			{ target: 'book', en: 'book', de: 'Buch' },
			{ target: 'notebook', en: 'notebook', de: 'Heft' },
			{ target: 'pencil', en: 'pencil', de: 'Bleistift' },
			{ target: 'pen', en: 'pen', de: 'Kugelschreiber' },
			{ target: 'exam', en: 'exam', de: 'Prüfung' },
			{ target: 'homework', en: 'homework', de: 'Hausaufgaben' },
			{ target: 'grade', en: 'grade', de: 'Note' },
			{ target: 'blackboard', en: 'blackboard', de: 'Tafel' },
			{ target: 'library', en: 'library', de: 'Bibliothek' },
			{ target: 'language', en: 'language', de: 'Sprache' },
			{ target: 'mathematics', en: 'mathematics', de: 'Mathematik' },
			{ target: 'science', en: 'science', de: 'Wissenschaft' },
			{ target: 'history', en: 'history', de: 'Geschichte' },
			{ target: 'geography', en: 'geography', de: 'Geografie' },
			{ target: 'art', en: 'art', de: 'Kunst' }
		],
		sentences: [
			{ target: 'I study English.', en: 'I study English.', de: 'Ich lerne Englisch.' },
			{
				target: 'The class starts at nine.',
				en: 'The class starts at nine.',
				de: 'Der Unterricht beginnt um neun.'
			},
			{
				target: 'I have a lot of homework.',
				en: 'I have a lot of homework.',
				de: 'Ich habe viele Hausaufgaben.'
			},
			{
				target: 'Where is the library?',
				en: 'Where is the library?',
				de: 'Wo ist die Bibliothek?'
			},
			{
				target: 'The exam is difficult.',
				en: 'The exam is difficult.',
				de: 'Die Prüfung ist schwer.'
			}
		]
	},
	{
		titleEn: 'Sports & Hobbies',
		titleDe: 'Sport & Hobbys',
		descriptionEn: 'Learn about sports and free time activities',
		descriptionDe: 'Lerne über Sport und Freizeitaktivitäten',
		themeColor: '#22C55E',
		vocab: [
			{ target: 'sport', en: 'sport', de: 'Sport' },
			{ target: 'soccer', en: 'soccer', de: 'Fußball' },
			{ target: 'basketball', en: 'basketball', de: 'Basketball' },
			{ target: 'tennis', en: 'tennis', de: 'Tennis' },
			{ target: 'swimming', en: 'swimming', de: 'Schwimmen' },
			{ target: 'to run', en: 'to run', de: 'laufen' },
			{ target: 'to walk', en: 'to walk', de: 'gehen' },
			{ target: 'team', en: 'team', de: 'Mannschaft' },
			{ target: 'ball', en: 'ball', de: 'Ball' },
			{ target: 'game', en: 'game', de: 'Spiel' },
			{ target: 'to win', en: 'to win', de: 'gewinnen' },
			{ target: 'to lose', en: 'to lose', de: 'verlieren' },
			{ target: 'music', en: 'music', de: 'Musik' },
			{ target: 'movie', en: 'movie', de: 'Film' },
			{ target: 'to read', en: 'to read', de: 'lesen' },
			{ target: 'to cook', en: 'to cook', de: 'kochen' },
			{ target: 'to dance', en: 'to dance', de: 'tanzen' },
			{ target: 'to sing', en: 'to sing', de: 'singen' },
			{ target: 'to paint', en: 'to paint', de: 'malen' },
			{ target: 'photography', en: 'photography', de: 'Fotografie' }
		],
		sentences: [
			{
				target: 'I like to play soccer.',
				en: 'I like to play soccer.',
				de: 'Ich spiele gern Fußball.'
			},
			{ target: 'She swims very well.', en: 'She swims very well.', de: 'Sie schwimmt sehr gut.' },
			{
				target: 'The team won the game.',
				en: 'The team won the game.',
				de: 'Die Mannschaft hat das Spiel gewonnen.'
			},
			{ target: 'What is your hobby?', en: 'What is your hobby?', de: 'Was ist dein Hobby?' },
			{
				target: 'I read books every day.',
				en: 'I read books every day.',
				de: 'Ich lese jeden Tag Bücher.'
			}
		]
	},
	{
		titleEn: 'City & Places',
		titleDe: 'Stadt & Orte',
		descriptionEn: 'Navigate the city and describe places',
		descriptionDe: 'Navigiere durch die Stadt und beschreibe Orte',
		themeColor: '#E11D48',
		vocab: [
			{ target: 'city', en: 'city', de: 'Stadt' },
			{ target: 'town', en: 'town', de: 'Kleinstadt' },
			{ target: 'street', en: 'street', de: 'Straße' },
			{ target: 'square', en: 'square', de: 'Platz' },
			{ target: 'park', en: 'park', de: 'Park' },
			{ target: 'bank', en: 'bank', de: 'Bank' },
			{ target: 'restaurant', en: 'restaurant', de: 'Restaurant' },
			{ target: 'supermarket', en: 'supermarket', de: 'Supermarkt' },
			{ target: 'museum', en: 'museum', de: 'Museum' },
			{ target: 'theater', en: 'theater', de: 'Theater' },
			{ target: 'church', en: 'church', de: 'Kirche' },
			{ target: 'hotel', en: 'hotel', de: 'Hotel' },
			{ target: 'downtown', en: 'downtown', de: 'Innenstadt' },
			{ target: 'corner', en: 'corner', de: 'Ecke' },
			{ target: 'right', en: 'right', de: 'rechts' },
			{ target: 'left', en: 'left', de: 'links' },
			{ target: 'straight', en: 'straight', de: 'geradeaus' },
			{ target: 'near', en: 'near', de: 'nah' },
			{ target: 'far', en: 'far', de: 'weit' },
			{ target: 'direction', en: 'direction', de: 'Richtung' }
		],
		sentences: [
			{
				target: 'The bank is on the right.',
				en: 'The bank is on the right.',
				de: 'Die Bank ist rechts.'
			},
			{
				target: 'Let us go downtown.',
				en: 'Let us go downtown.',
				de: 'Lass uns in die Innenstadt gehen.'
			},
			{
				target: 'The museum is nearby.',
				en: 'The museum is nearby.',
				de: 'Das Museum ist in der Nähe.'
			},
			{
				target: 'How do I get to the park?',
				en: 'How do I get to the park?',
				de: 'Wie komme ich zum Park?'
			},
			{
				target: 'Go straight for two blocks.',
				en: 'Go straight for two blocks.',
				de: 'Geh zwei Blocks geradeaus.'
			}
		]
	},
	{
		titleEn: 'Nature & Animals',
		titleDe: 'Natur & Tiere',
		descriptionEn: 'Learn about nature and animals',
		descriptionDe: 'Lerne über Natur und Tiere',
		themeColor: '#0891B2',
		vocab: [
			{ target: 'dog', en: 'dog', de: 'Hund' },
			{ target: 'cat', en: 'cat', de: 'Katze' },
			{ target: 'bird', en: 'bird', de: 'Vogel' },
			{ target: 'fish', en: 'fish', de: 'Fisch' },
			{ target: 'horse', en: 'horse', de: 'Pferd' },
			{ target: 'cow', en: 'cow', de: 'Kuh' },
			{ target: 'pig', en: 'pig', de: 'Schwein' },
			{ target: 'tree', en: 'tree', de: 'Baum' },
			{ target: 'flower', en: 'flower', de: 'Blume' },
			{ target: 'plant', en: 'plant', de: 'Pflanze' },
			{ target: 'river', en: 'river', de: 'Fluss' },
			{ target: 'sea', en: 'sea', de: 'Meer' },
			{ target: 'mountain', en: 'mountain', de: 'Berg' },
			{ target: 'forest', en: 'forest', de: 'Wald' },
			{ target: 'beach', en: 'beach', de: 'Strand' },
			{ target: 'lake', en: 'lake', de: 'See' },
			{ target: 'sky', en: 'sky', de: 'Himmel' },
			{ target: 'star', en: 'star', de: 'Stern' },
			{ target: 'moon', en: 'moon', de: 'Mond' },
			{ target: 'earth', en: 'earth', de: 'Erde' }
		],
		sentences: [
			{
				target: 'My dog is very friendly.',
				en: 'My dog is very friendly.',
				de: 'Mein Hund ist sehr freundlich.'
			},
			{
				target: 'The flowers are beautiful.',
				en: 'The flowers are beautiful.',
				de: 'Die Blumen sind wunderschön.'
			},
			{ target: 'The river is clean.', en: 'The river is clean.', de: 'Der Fluss ist sauber.' },
			{
				target: 'There are many trees in the forest.',
				en: 'There are many trees in the forest.',
				de: 'Es gibt viele Bäume im Wald.'
			},
			{
				target: 'The stars shine in the sky.',
				en: 'The stars shine in the sky.',
				de: 'Die Sterne leuchten am Himmel.'
			}
		]
	},
	{
		titleEn: 'Emotions & Feelings',
		titleDe: 'Emotionen & Gefühle',
		descriptionEn: 'Express how you feel',
		descriptionDe: 'Drücke aus, wie du dich fühlst',
		themeColor: '#DB2777',
		vocab: [
			{ target: 'happy', en: 'happy', de: 'glücklich' },
			{ target: 'sad', en: 'sad', de: 'traurig' },
			{ target: 'angry', en: 'angry', de: 'wütend' },
			{ target: 'tired', en: 'tired', de: 'müde' },
			{ target: 'nervous', en: 'nervous', de: 'nervös' },
			{ target: 'worried', en: 'worried', de: 'besorgt' },
			{ target: 'surprised', en: 'surprised', de: 'überrascht' },
			{ target: 'excited', en: 'excited', de: 'aufgeregt' },
			{ target: 'bored', en: 'bored', de: 'gelangweilt' },
			{ target: 'scared', en: 'scared', de: 'verängstigt' },
			{ target: 'calm', en: 'calm', de: 'ruhig' },
			{ target: 'content', en: 'content', de: 'zufrieden' },
			{ target: 'love', en: 'love', de: 'Liebe' },
			{ target: 'hate', en: 'hate', de: 'Hass' },
			{ target: 'fear', en: 'fear', de: 'Angst' },
			{ target: 'joy', en: 'joy', de: 'Freude' },
			{ target: 'sadness', en: 'sadness', de: 'Traurigkeit' },
			{ target: 'hope', en: 'hope', de: 'Hoffnung' },
			{ target: 'confusion', en: 'confusion', de: 'Verwirrung' },
			{ target: 'pride', en: 'pride', de: 'Stolz' }
		],
		sentences: [
			{
				target: 'I am very happy today.',
				en: 'I am very happy today.',
				de: 'Ich bin heute sehr glücklich.'
			},
			{ target: 'She is sad.', en: 'She is sad.', de: 'Sie ist traurig.' },
			{ target: 'I feel tired.', en: 'I feel tired.', de: 'Ich fühle mich müde.' },
			{ target: 'Do not be nervous.', en: 'Do not be nervous.', de: 'Sei nicht nervös.' },
			{
				target: 'I am afraid of the dark.',
				en: 'I am afraid of the dark.',
				de: 'Ich habe Angst vor der Dunkelheit.'
			}
		]
	}
];

export const B1_UNITS: UnitVocab[] = [
	{
		titleEn: 'Past Tense Verbs',
		titleDe: 'Vergangenheitsformen',
		descriptionEn: 'Learn to talk about past events',
		descriptionDe: 'Lerne über vergangene Ereignisse zu sprechen',
		themeColor: '#2563EB',
		vocab: [
			{ target: 'went', en: 'went', de: 'ging' },
			{ target: 'came', en: 'came', de: 'kam' },
			{ target: 'saw', en: 'saw', de: 'sah' },
			{ target: 'gave', en: 'gave', de: 'gab' },
			{ target: 'took', en: 'took', de: 'nahm' },
			{ target: 'made', en: 'made', de: 'machte' },
			{ target: 'said', en: 'said', de: 'sagte' },
			{ target: 'told', en: 'told', de: 'erzählte' },
			{ target: 'knew', en: 'knew', de: 'wusste' },
			{ target: 'thought', en: 'thought', de: 'dachte' },
			{ target: 'found', en: 'found', de: 'fand' },
			{ target: 'wrote', en: 'wrote', de: 'schrieb' },
			{ target: 'ran', en: 'ran', de: 'rannte' },
			{ target: 'ate', en: 'ate', de: 'aß' },
			{ target: 'drank', en: 'drank', de: 'trank' },
			{ target: 'slept', en: 'slept', de: 'schlief' },
			{ target: 'bought', en: 'bought', de: 'kaufte' },
			{ target: 'brought', en: 'brought', de: 'brachte' },
			{ target: 'left', en: 'left', de: 'verließ' },
			{ target: 'stood', en: 'stood', de: 'stand' }
		],
		sentences: [
			{
				target: 'I went to the cinema yesterday.',
				en: 'I went to the cinema yesterday.',
				de: 'Ich ging gestern ins Kino.'
			},
			{
				target: 'She ate pizza for dinner.',
				en: 'She ate pizza for dinner.',
				de: 'Sie aß Pizza zum Abendessen.'
			},
			{
				target: 'He told me the truth.',
				en: 'He told me the truth.',
				de: 'Er sagte mir die Wahrheit.'
			},
			{
				target: 'What did you do yesterday?',
				en: 'What did you do yesterday?',
				de: 'Was hast du gestern gemacht?'
			},
			{
				target: 'I could not sleep last night.',
				en: 'I could not sleep last night.',
				de: 'Ich konnte letzte Nacht nicht schlafen.'
			}
		]
	},
	{
		titleEn: 'Future Plans',
		titleDe: 'Zukunftspläne',
		descriptionEn: 'Talk about what will happen',
		descriptionDe: 'Sprich über das, was passieren wird',
		themeColor: '#059669',
		vocab: [
			{ target: 'will', en: 'will', de: 'werden' },
			{ target: 'going to', en: 'going to', de: 'vorhaben' },
			{ target: 'shall', en: 'shall', de: 'sollen' },
			{ target: 'might', en: 'might', de: 'könnte' },
			{ target: 'soon', en: 'soon', de: 'bald' },
			{ target: 'later', en: 'later', de: 'später' },
			{ target: 'eventually', en: 'eventually', de: 'schließlich' },
			{ target: 'someday', en: 'someday', de: 'eines Tages' },
			{ target: 'next', en: 'next', de: 'nächste' },
			{ target: 'future', en: 'future', de: 'Zukunft' },
			{ target: 'to plan', en: 'to plan', de: 'planen' },
			{ target: 'to hope', en: 'to hope', de: 'hoffen' },
			{ target: 'to expect', en: 'to expect', de: 'erwarten' },
			{ target: 'to intend', en: 'to intend', de: 'beabsichtigen' },
			{ target: 'to promise', en: 'to promise', de: 'versprechen' },
			{ target: 'to predict', en: 'to predict', de: 'vorhersagen' },
			{ target: 'to schedule', en: 'to schedule', de: 'terminieren' },
			{ target: 'to prepare', en: 'to prepare', de: 'vorbereiten' },
			{ target: 'goal', en: 'goal', de: 'Ziel' },
			{ target: 'to decide', en: 'to decide', de: 'entscheiden' }
		],
		sentences: [
			{
				target: 'I will go to the doctor tomorrow.',
				en: 'I will go to the doctor tomorrow.',
				de: 'Ich werde morgen zum Arzt gehen.'
			},
			{
				target: 'Next year I will travel to England.',
				en: 'Next year I will travel to England.',
				de: 'Nächstes Jahr werde ich nach England reisen.'
			},
			{
				target: 'What will you do this weekend?',
				en: 'What will you do this weekend?',
				de: 'Was wirst du dieses Wochenende machen?'
			},
			{
				target: 'She will come to the party.',
				en: 'She will come to the party.',
				de: 'Sie wird zur Party kommen.'
			},
			{
				target: 'Soon we will know the results.',
				en: 'Soon we will know the results.',
				de: 'Bald werden wir die Ergebnisse kennen.'
			}
		]
	},
	{
		titleEn: 'Technology',
		titleDe: 'Technologie',
		descriptionEn: 'Digital world vocabulary',
		descriptionDe: 'Vokabular der digitalen Welt',
		themeColor: '#7E22CE',
		vocab: [
			{ target: 'internet', en: 'internet', de: 'Internet' },
			{ target: 'phone', en: 'phone', de: 'Telefon' },
			{ target: 'app', en: 'app', de: 'App' },
			{ target: 'message', en: 'message', de: 'Nachricht' },
			{ target: 'call', en: 'call', de: 'Anruf' },
			{ target: 'screen', en: 'screen', de: 'Bildschirm' },
			{ target: 'battery', en: 'battery', de: 'Akku' },
			{ target: 'charger', en: 'charger', de: 'Ladegerät' },
			{ target: 'password', en: 'password', de: 'Passwort' },
			{ target: 'account', en: 'account', de: 'Konto' },
			{ target: 'to download', en: 'to download', de: 'herunterladen' },
			{ target: 'to upload', en: 'to upload', de: 'hochladen' },
			{ target: 'to search', en: 'to search', de: 'suchen' },
			{ target: 'to connect', en: 'to connect', de: 'verbinden' },
			{ target: 'network', en: 'network', de: 'Netzwerk' },
			{ target: 'website', en: 'website', de: 'Webseite' },
			{ target: 'software', en: 'software', de: 'Software' },
			{ target: 'hardware', en: 'hardware', de: 'Hardware' },
			{ target: 'data', en: 'data', de: 'Daten' },
			{ target: 'to update', en: 'to update', de: 'aktualisieren' }
		],
		sentences: [
			{
				target: 'I do not have internet.',
				en: 'I do not have internet.',
				de: 'Ich habe kein Internet.'
			},
			{
				target: 'Download this app.',
				en: 'Download this app.',
				de: 'Lade diese App herunter.'
			},
			{
				target: 'My phone battery is almost empty.',
				en: 'My phone battery is almost empty.',
				de: 'Der Akku meines Handys ist fast leer.'
			},
			{
				target: 'What is the password?',
				en: 'What is the password?',
				de: 'Wie lautet das Passwort?'
			},
			{
				target: 'I uploaded a new photo.',
				en: 'I uploaded a new photo.',
				de: 'Ich habe ein neues Foto hochgeladen.'
			}
		]
	},
	{
		titleEn: 'Environment',
		titleDe: 'Umwelt',
		descriptionEn: 'Talk about environmental topics',
		descriptionDe: 'Sprich über Umweltthemen',
		themeColor: '#CA8A04',
		vocab: [
			{ target: 'environment', en: 'environment', de: 'Umwelt' },
			{ target: 'pollution', en: 'pollution', de: 'Verschmutzung' },
			{ target: 'to recycle', en: 'to recycle', de: 'recyceln' },
			{ target: 'trash', en: 'trash', de: 'Müll' },
			{ target: 'energy', en: 'energy', de: 'Energie' },
			{ target: 'solar', en: 'solar', de: 'Solar' },
			{ target: 'climate', en: 'climate', de: 'Klima' },
			{ target: 'global warming', en: 'global warming', de: 'Erderwärmung' },
			{ target: 'to protect', en: 'to protect', de: 'schützen' },
			{ target: 'to conserve', en: 'to conserve', de: 'bewahren' },
			{ target: 'nature', en: 'nature', de: 'Natur' },
			{ target: 'resources', en: 'resources', de: 'Ressourcen' },
			{ target: 'renewable', en: 'renewable', de: 'erneuerbar' },
			{ target: 'ecological', en: 'ecological', de: 'ökologisch' },
			{ target: 'sustainable', en: 'sustainable', de: 'nachhaltig' },
			{ target: 'deforestation', en: 'deforestation', de: 'Abholzung' },
			{ target: 'extinction', en: 'extinction', de: 'Aussterben' },
			{ target: 'species', en: 'species', de: 'Art' },
			{ target: 'danger', en: 'danger', de: 'Gefahr' },
			{ target: 'planet', en: 'planet', de: 'Planet' }
		],
		sentences: [
			{
				target: 'We should recycle more.',
				en: 'We should recycle more.',
				de: 'Wir sollten mehr recyceln.'
			},
			{
				target: 'Pollution is a serious problem.',
				en: 'Pollution is a serious problem.',
				de: 'Verschmutzung ist ein ernstes Problem.'
			},
			{
				target: 'The climate is changing.',
				en: 'The climate is changing.',
				de: 'Das Klima verändert sich.'
			},
			{
				target: 'We must protect the planet.',
				en: 'We must protect the planet.',
				de: 'Wir müssen den Planeten schützen.'
			},
			{
				target: 'Many species are in danger.',
				en: 'Many species are in danger.',
				de: 'Viele Arten sind in Gefahr.'
			}
		]
	}
];

export const B2_UNITS: UnitVocab[] = [
	{
		titleEn: 'Politics & Society',
		titleDe: 'Politik & Gesellschaft',
		descriptionEn: 'Discuss political and social issues',
		descriptionDe: 'Diskutiere politische und gesellschaftliche Themen',
		themeColor: '#4338CA',
		vocab: [
			{ target: 'government', en: 'government', de: 'Regierung' },
			{ target: 'politics', en: 'politics', de: 'Politik' },
			{ target: 'election', en: 'election', de: 'Wahl' },
			{ target: 'to vote', en: 'to vote', de: 'wählen' },
			{ target: 'democracy', en: 'democracy', de: 'Demokratie' },
			{ target: 'law', en: 'law', de: 'Gesetz' },
			{ target: 'right', en: 'right', de: 'Recht' },
			{ target: 'freedom', en: 'freedom', de: 'Freiheit' },
			{ target: 'equality', en: 'equality', de: 'Gleichheit' },
			{ target: 'justice', en: 'justice', de: 'Gerechtigkeit' },
			{ target: 'citizen', en: 'citizen', de: 'Bürger' },
			{ target: 'president', en: 'president', de: 'Präsident' },
			{ target: 'party', en: 'party', de: 'Partei' },
			{ target: 'parliament', en: 'parliament', de: 'Parlament' },
			{ target: 'constitution', en: 'constitution', de: 'Verfassung' },
			{ target: 'protest', en: 'protest', de: 'Protest' },
			{ target: 'demonstration', en: 'demonstration', de: 'Demonstration' },
			{ target: 'reform', en: 'reform', de: 'Reform' },
			{ target: 'corruption', en: 'corruption', de: 'Korruption' },
			{ target: 'economy', en: 'economy', de: 'Wirtschaft' }
		],
		sentences: [
			{
				target: 'Elections are next month.',
				en: 'Elections are next month.',
				de: 'Die Wahlen sind nächsten Monat.'
			},
			{
				target: 'We all have the right to vote.',
				en: 'We all have the right to vote.',
				de: 'Wir alle haben das Recht zu wählen.'
			},
			{
				target: 'The government announced new reforms.',
				en: 'The government announced new reforms.',
				de: 'Die Regierung hat neue Reformen angekündigt.'
			},
			{
				target: 'Democracy is important.',
				en: 'Democracy is important.',
				de: 'Demokratie ist wichtig.'
			},
			{
				target: 'There is a demonstration in the square.',
				en: 'There is a demonstration in the square.',
				de: 'Es gibt eine Demonstration auf dem Platz.'
			}
		]
	},
	{
		titleEn: 'Business & Finance',
		titleDe: 'Wirtschaft & Finanzen',
		descriptionEn: 'Professional business vocabulary',
		descriptionDe: 'Professionelles Geschäftsvokabular',
		themeColor: '#BE185D',
		vocab: [
			{ target: 'business', en: 'business', de: 'Geschäft' },
			{ target: 'investment', en: 'investment', de: 'Investition' },
			{ target: 'market', en: 'market', de: 'Markt' },
			{ target: 'stock', en: 'stock', de: 'Aktie' },
			{ target: 'budget', en: 'budget', de: 'Budget' },
			{ target: 'profit', en: 'profit', de: 'Gewinn' },
			{ target: 'loss', en: 'loss', de: 'Verlust' },
			{ target: 'tax', en: 'tax', de: 'Steuer' },
			{ target: 'loan', en: 'loan', de: 'Kredit' },
			{ target: 'debt', en: 'debt', de: 'Schulden' },
			{ target: 'contract', en: 'contract', de: 'Vertrag' },
			{ target: 'partner', en: 'partner', de: 'Partner' },
			{ target: 'competition', en: 'competition', de: 'Wettbewerb' },
			{ target: 'strategy', en: 'strategy', de: 'Strategie' },
			{ target: 'marketing', en: 'marketing', de: 'Marketing' },
			{ target: 'client', en: 'client', de: 'Kunde' },
			{ target: 'supplier', en: 'supplier', de: 'Lieferant' },
			{ target: 'product', en: 'product', de: 'Produkt' },
			{ target: 'service', en: 'service', de: 'Dienstleistung' },
			{ target: 'success', en: 'success', de: 'Erfolg' }
		],
		sentences: [
			{
				target: 'The business is growing.',
				en: 'The business is growing.',
				de: 'Das Geschäft wächst.'
			},
			{
				target: 'We need to review the budget.',
				en: 'We need to review the budget.',
				de: 'Wir müssen das Budget überprüfen.'
			},
			{
				target: 'The investment was successful.',
				en: 'The investment was successful.',
				de: 'Die Investition war erfolgreich.'
			},
			{
				target: 'We signed the contract yesterday.',
				en: 'We signed the contract yesterday.',
				de: 'Wir haben gestern den Vertrag unterschrieben.'
			},
			{
				target: 'The competition is very strong.',
				en: 'The competition is very strong.',
				de: 'Der Wettbewerb ist sehr stark.'
			}
		]
	}
];

export const C1_UNITS: UnitVocab[] = [
	{
		titleEn: 'Academic Writing',
		titleDe: 'Akademisches Schreiben',
		descriptionEn: 'Formal and academic expressions',
		descriptionDe: 'Formelle und akademische Ausdrücke',
		themeColor: '#1E40AF',
		vocab: [
			{ target: 'hypothesis', en: 'hypothesis', de: 'Hypothese' },
			{ target: 'argument', en: 'argument', de: 'Argumentation' },
			{ target: 'conclusion', en: 'conclusion', de: 'Schlussfolgerung' },
			{ target: 'analysis', en: 'analysis', de: 'Analyse' },
			{ target: 'methodology', en: 'methodology', de: 'Methodologie' },
			{ target: 'research', en: 'research', de: 'Forschung' },
			{ target: 'evidence', en: 'evidence', de: 'Beleg' },
			{ target: 'theory', en: 'theory', de: 'Theorie' },
			{ target: 'reference', en: 'reference', de: 'Referenz' },
			{ target: 'to cite', en: 'to cite', de: 'zitieren' },
			{ target: 'source', en: 'source', de: 'Quelle' },
			{ target: 'objective', en: 'objective', de: 'objektiv' },
			{ target: 'subjective', en: 'subjective', de: 'subjektiv' },
			{ target: 'perspective', en: 'perspective', de: 'Perspektive' },
			{ target: 'context', en: 'context', de: 'Kontext' },
			{ target: 'synthesis', en: 'synthesis', de: 'Synthese' },
			{ target: 'critique', en: 'critique', de: 'Kritik' },
			{ target: 'to evaluate', en: 'to evaluate', de: 'bewerten' },
			{ target: 'to infer', en: 'to infer', de: 'folgern' },
			{ target: 'to imply', en: 'to imply', de: 'implizieren' }
		],
		sentences: [
			{
				target: 'The hypothesis was confirmed.',
				en: 'The hypothesis was confirmed.',
				de: 'Die Hypothese wurde bestätigt.'
			},
			{
				target: 'According to the research...',
				en: 'According to the research...',
				de: 'Laut der Forschung...'
			},
			{
				target: 'The evidence suggests that...',
				en: 'The evidence suggests that...',
				de: 'Die Belege deuten darauf hin, dass...'
			},
			{
				target: 'In conclusion, we can state that...',
				en: 'In conclusion, we can state that...',
				de: 'Abschließend können wir feststellen, dass...'
			},
			{
				target: 'It is necessary to analyze the context.',
				en: 'It is necessary to analyze the context.',
				de: 'Es ist notwendig, den Kontext zu analysieren.'
			}
		]
	}
];

export const C2_UNITS: UnitVocab[] = [
	{
		titleEn: 'Idiomatic Expressions',
		titleDe: 'Idiomatische Ausdrücke',
		descriptionEn: 'Advanced idioms and expressions',
		descriptionDe: 'Fortgeschrittene Redewendungen und Ausdrücke',
		themeColor: '#9333EA',
		vocab: [
			{ target: 'break the ice', en: 'to initiate social interaction', de: 'das Eis brechen' },
			{
				target: 'hit the nail on the head',
				en: 'to be exactly right',
				de: 'den Nagel auf den Kopf treffen'
			},
			{ target: 'piece of cake', en: 'something very easy', de: 'ein Kinderspiel' },
			{
				target: 'let the cat out of the bag',
				en: 'to reveal a secret',
				de: 'die Katze aus dem Sack lassen'
			},
			{
				target: 'kill two birds with one stone',
				en: 'to achieve two goals at once',
				de: 'zwei Fliegen mit einer Klappe schlagen'
			},
			{
				target: 'bite the bullet',
				en: 'to endure something difficult',
				de: 'in den sauren Apfel beißen'
			},
			{
				target: 'cost an arm and a leg',
				en: 'to be very expensive',
				de: 'ein Vermögen kosten'
			},
			{ target: 'once in a blue moon', en: 'very rarely', de: 'alle Jubeljahre' },
			{
				target: 'the ball is in your court',
				en: 'it is your decision now',
				de: 'du bist am Zug'
			},
			{
				target: 'burn the midnight oil',
				en: 'to work late into the night',
				de: 'die Nacht durcharbeiten'
			},
			{
				target: 'spill the beans',
				en: 'to reveal secret information',
				de: 'etwas ausplaudern'
			},
			{ target: 'under the weather', en: 'feeling unwell', de: 'sich unwohl fühlen' },
			{
				target: 'barking up the wrong tree',
				en: 'pursuing a wrong approach',
				de: 'auf dem Holzweg sein'
			},
			{
				target: 'a blessing in disguise',
				en: 'something good from a bad situation',
				de: 'ein Glück im Unglück'
			},
			{
				target: 'the last straw',
				en: 'the final annoyance causing action',
				de: 'der Tropfen, der das Fass zum Überlaufen bringt'
			},
			{ target: 'sit on the fence', en: 'to not take a side', de: 'sich nicht entscheiden' },
			{
				target: 'add fuel to the fire',
				en: 'to make a problem worse',
				de: 'Öl ins Feuer gießen'
			},
			{
				target: 'beat around the bush',
				en: 'to avoid the main topic',
				de: 'um den heißen Brei herumreden'
			},
			{ target: 'when pigs fly', en: 'never', de: 'wenn Schweine fliegen' },
			{ target: 'on cloud nine', en: 'extremely happy', de: 'auf Wolke sieben' }
		],
		sentences: [
			{
				target: 'She broke the ice by telling a funny story.',
				en: 'She broke the ice by telling a funny story.',
				de: 'Sie brach das Eis, indem sie eine lustige Geschichte erzählte.'
			},
			{
				target: 'You really hit the nail on the head.',
				en: 'You really hit the nail on the head.',
				de: 'Du hast wirklich den Nagel auf den Kopf getroffen.'
			},
			{
				target: 'The exam was a piece of cake.',
				en: 'The exam was a piece of cake.',
				de: 'Die Prüfung war ein Kinderspiel.'
			},
			{
				target: 'He let the cat out of the bag about the surprise.',
				en: 'He let the cat out of the bag about the surprise.',
				de: 'Er hat das Geheimnis über die Überraschung verraten.'
			},
			{
				target: 'This phone cost an arm and a leg.',
				en: 'This phone cost an arm and a leg.',
				de: 'Dieses Handy hat ein Vermögen gekostet.'
			}
		]
	}
];

export const ALL_LEVELS = {
	A1: A1_UNITS,
	A2: A2_UNITS,
	B1: B1_UNITS,
	B2: B2_UNITS,
	C1: C1_UNITS,
	C2: C2_UNITS
};
