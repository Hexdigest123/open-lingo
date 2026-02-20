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
		themeColor: '#2A9D8F',
		vocab: [
			{ target: 'ciao', en: 'hello', de: 'hallo' },
			{ target: 'arrivederci', en: 'goodbye', de: 'auf Wiedersehen' },
			{ target: 'buongiorno', en: 'good morning', de: 'guten Morgen' },
			{ target: 'buon pomeriggio', en: 'good afternoon', de: 'guten Nachmittag' },
			{ target: 'buonasera', en: 'good evening', de: 'guten Abend' },
			{ target: 'buonanotte', en: 'good night', de: 'gute Nacht' },
			{ target: 'a presto', en: 'see you soon', de: 'bis bald' },
			{ target: 'a domani', en: 'see you tomorrow', de: 'bis morgen' },
			{ target: 'per favore', en: 'please', de: 'bitte' },
			{ target: 'grazie', en: 'thank you', de: 'danke' },
			{ target: 'prego', en: 'you are welcome', de: 'bitte schön' },
			{ target: 'scusa', en: 'sorry (informal)', de: 'entschuldige' },
			{ target: 'mi scusi', en: 'excuse me (formal)', de: 'entschuldigen Sie' },
			{ target: 'sì', en: 'yes', de: 'ja' },
			{ target: 'no', en: 'no', de: 'nein' },
			{ target: 'io', en: 'I', de: 'ich' },
			{ target: 'tu', en: 'you', de: 'du' },
			{ target: 'Lei', en: 'you (formal)', de: 'Sie' },
			{ target: 'signore', en: 'mister', de: 'Herr' },
			{ target: 'signora', en: 'mrs', de: 'Frau' }
		],
		sentences: [
			{ target: 'Ciao, come stai?', en: 'Hello, how are you?', de: 'Hallo, wie geht es dir?' },
			{ target: 'Mi chiamo Luca.', en: 'My name is Luca.', de: 'Ich heiße Luca.' },
			{
				target: 'Piacere di conoscerti.',
				en: 'Nice to meet you.',
				de: 'Freut mich, dich kennenzulernen.'
			},
			{ target: 'Come si chiama?', en: 'What is your name? (formal)', de: 'Wie heißen Sie?' },
			{
				target: 'Buongiorno, signora Rossi.',
				en: 'Good morning, Mrs. Rossi.',
				de: 'Guten Morgen, Frau Rossi.'
			}
		]
	},
	{
		titleEn: 'Numbers 1-100',
		titleDe: 'Zahlen 1-100',
		descriptionEn: 'Learn to count and use numbers in Italian',
		descriptionDe: 'Lerne auf Italienisch zu zählen und Zahlen zu benutzen',
		themeColor: '#E76F51',
		vocab: [
			{ target: 'uno', en: 'one', de: 'eins' },
			{ target: 'due', en: 'two', de: 'zwei' },
			{ target: 'tre', en: 'three', de: 'drei' },
			{ target: 'quattro', en: 'four', de: 'vier' },
			{ target: 'cinque', en: 'five', de: 'fünf' },
			{ target: 'sei', en: 'six', de: 'sechs' },
			{ target: 'sette', en: 'seven', de: 'sieben' },
			{ target: 'otto', en: 'eight', de: 'acht' },
			{ target: 'nove', en: 'nine', de: 'neun' },
			{ target: 'dieci', en: 'ten', de: 'zehn' },
			{ target: 'undici', en: 'eleven', de: 'elf' },
			{ target: 'dodici', en: 'twelve', de: 'zwölf' },
			{ target: 'venti', en: 'twenty', de: 'zwanzig' },
			{ target: 'trenta', en: 'thirty', de: 'dreißig' },
			{ target: 'quaranta', en: 'forty', de: 'vierzig' },
			{ target: 'cinquanta', en: 'fifty', de: 'fünfzig' },
			{ target: 'cento', en: 'one hundred', de: 'hundert' },
			{ target: 'primo', en: 'first', de: 'erste' },
			{ target: 'secondo', en: 'second', de: 'zweite' },
			{ target: 'terzo', en: 'third', de: 'dritte' }
		],
		sentences: [
			{
				target: 'Ho tre fratelli.',
				en: 'I have three siblings.',
				de: 'Ich habe drei Geschwister.'
			},
			{ target: 'Quanti anni hai?', en: 'How old are you?', de: 'Wie alt bist du?' },
			{ target: 'Sono le cinque.', en: 'It is five o clock.', de: 'Es ist fünf Uhr.' },
			{
				target: 'Ci sono dieci mele.',
				en: 'There are ten apples.',
				de: 'Es gibt zehn Äpfel.'
			},
			{ target: 'Il numero è venti.', en: 'The number is twenty.', de: 'Die Zahl ist zwanzig.' }
		]
	},
	{
		titleEn: 'Family',
		titleDe: 'Familie',
		descriptionEn: 'Talk about your family members',
		descriptionDe: 'Sprich über deine Familienmitglieder',
		themeColor: '#F4A261',
		vocab: [
			{ target: 'la famiglia', en: 'family', de: 'Familie' },
			{ target: 'la madre', en: 'mother', de: 'Mutter' },
			{ target: 'il padre', en: 'father', de: 'Vater' },
			{ target: 'il fratello', en: 'brother', de: 'Bruder' },
			{ target: 'la sorella', en: 'sister', de: 'Schwester' },
			{ target: 'il figlio', en: 'son', de: 'Sohn' },
			{ target: 'la figlia', en: 'daughter', de: 'Tochter' },
			{ target: 'il nonno', en: 'grandfather', de: 'Großvater' },
			{ target: 'la nonna', en: 'grandmother', de: 'Großmutter' },
			{ target: 'lo zio', en: 'uncle', de: 'Onkel' },
			{ target: 'la zia', en: 'aunt', de: 'Tante' },
			{ target: 'il cugino', en: 'cousin (male)', de: 'Cousin' },
			{ target: 'la cugina', en: 'cousin (female)', de: 'Cousine' },
			{ target: 'il marito', en: 'husband', de: 'Ehemann' },
			{ target: 'la moglie', en: 'wife', de: 'Ehefrau' },
			{ target: 'il bambino', en: 'child (boy)', de: 'Junge' },
			{ target: 'la bambina', en: 'child (girl)', de: 'Mädchen' },
			{ target: 'il neonato', en: 'baby', de: 'Neugeborenes' },
			{ target: 'i genitori', en: 'parents', de: 'Eltern' },
			{ target: 'i figli', en: 'children', de: 'Kinder' }
		],
		sentences: [
			{
				target: 'Mia madre è dottoressa.',
				en: 'My mother is a doctor.',
				de: 'Meine Mutter ist Ärztin.'
			},
			{ target: 'Ho due sorelle.', en: 'I have two sisters.', de: 'Ich habe zwei Schwestern.' },
			{
				target: 'La mia famiglia è grande.',
				en: 'My family is big.',
				de: 'Meine Familie ist groß.'
			},
			{
				target: 'Il nonno è a casa.',
				en: 'Grandfather is at home.',
				de: 'Der Großvater ist zu Hause.'
			},
			{ target: 'Lei è mia zia.', en: 'She is my aunt.', de: 'Sie ist meine Tante.' }
		]
	},
	{
		titleEn: 'Colors',
		titleDe: 'Farben',
		descriptionEn: 'Learn the colors in Italian',
		descriptionDe: 'Lerne die Farben auf Italienisch',
		themeColor: '#264653',
		vocab: [
			{ target: 'rosso', en: 'red', de: 'rot' },
			{ target: 'blu', en: 'blue', de: 'blau' },
			{ target: 'verde', en: 'green', de: 'grün' },
			{ target: 'giallo', en: 'yellow', de: 'gelb' },
			{ target: 'arancione', en: 'orange', de: 'orange' },
			{ target: 'viola', en: 'purple', de: 'lila' },
			{ target: 'rosa', en: 'pink', de: 'rosa' },
			{ target: 'nero', en: 'black', de: 'schwarz' },
			{ target: 'bianco', en: 'white', de: 'weiß' },
			{ target: 'grigio', en: 'gray', de: 'grau' },
			{ target: 'marrone', en: 'brown', de: 'braun' },
			{ target: 'dorato', en: 'golden', de: 'golden' },
			{ target: 'argentato', en: 'silver', de: 'silbern' },
			{ target: 'chiaro', en: 'light', de: 'hell' },
			{ target: 'scuro', en: 'dark', de: 'dunkel' },
			{ target: 'il colore', en: 'color', de: 'Farbe' },
			{ target: 'colorato', en: 'colorful', de: 'bunt' },
			{ target: 'brillante', en: 'bright', de: 'leuchtend' },
			{ target: 'pallido', en: 'pale', de: 'blass' },
			{ target: 'vivace', en: 'vivid', de: 'lebhaft' }
		],
		sentences: [
			{ target: 'Il cielo è blu.', en: 'The sky is blue.', de: 'Der Himmel ist blau.' },
			{ target: 'La mela è rossa.', en: 'The apple is red.', de: 'Der Apfel ist rot.' },
			{ target: 'La mia macchina è nera.', en: 'My car is black.', de: 'Mein Auto ist schwarz.' },
			{
				target: 'I fiori sono gialli.',
				en: 'The flowers are yellow.',
				de: 'Die Blumen sind gelb.'
			},
			{ target: 'Di che colore è?', en: 'What color is it?', de: 'Welche Farbe hat es?' }
		]
	},
	{
		titleEn: 'Food & Drink',
		titleDe: 'Essen & Trinken',
		descriptionEn: 'Order food and describe meals',
		descriptionDe: 'Bestelle Essen und beschreibe Mahlzeiten',
		themeColor: '#D62828',
		vocab: [
			{ target: "l'acqua", en: 'water', de: 'Wasser' },
			{ target: 'il pane', en: 'bread', de: 'Brot' },
			{ target: 'il latte', en: 'milk', de: 'Milch' },
			{ target: 'il caffè', en: 'coffee', de: 'Kaffee' },
			{ target: 'il tè', en: 'tea', de: 'Tee' },
			{ target: 'il succo', en: 'juice', de: 'Saft' },
			{ target: 'la carne', en: 'meat', de: 'Fleisch' },
			{ target: 'il pollo', en: 'chicken', de: 'Hähnchen' },
			{ target: 'il pesce', en: 'fish', de: 'Fisch' },
			{ target: 'il riso', en: 'rice', de: 'Reis' },
			{ target: "l'uovo", en: 'egg', de: 'Ei' },
			{ target: 'il formaggio', en: 'cheese', de: 'Käse' },
			{ target: 'la frutta', en: 'fruit', de: 'Obst' },
			{ target: 'la mela', en: 'apple', de: 'Apfel' },
			{ target: "l'arancia", en: 'orange', de: 'Orange' },
			{ target: 'la banana', en: 'banana', de: 'Banane' },
			{ target: 'la verdura', en: 'vegetable', de: 'Gemüse' },
			{ target: "l'insalata", en: 'salad', de: 'Salat' },
			{ target: 'la zuppa', en: 'soup', de: 'Suppe' },
			{ target: 'il dolce', en: 'dessert', de: 'Nachtisch' }
		],
		sentences: [
			{
				target: "Vorrei dell'acqua, per favore.",
				en: 'I would like water, please.',
				de: 'Ich hätte gern Wasser, bitte.'
			},
			{
				target: 'La colazione è pronta.',
				en: 'Breakfast is ready.',
				de: 'Das Frühstück ist fertig.'
			},
			{ target: 'Mi piace il pollo.', en: 'I like chicken.', de: 'Ich mag Hähnchen.' },
			{
				target: 'Che cosa vuoi mangiare?',
				en: 'What do you want to eat?',
				de: 'Was möchtest du essen?'
			},
			{ target: 'La zuppa è calda.', en: 'The soup is hot.', de: 'Die Suppe ist heiß.' }
		]
	},
	{
		titleEn: 'Days & Time',
		titleDe: 'Tage & Zeit',
		descriptionEn: 'Learn days of the week and tell time',
		descriptionDe: 'Lerne die Wochentage und die Uhrzeit',
		themeColor: '#457B9D',
		vocab: [
			{ target: 'lunedì', en: 'Monday', de: 'Montag' },
			{ target: 'martedì', en: 'Tuesday', de: 'Dienstag' },
			{ target: 'mercoledì', en: 'Wednesday', de: 'Mittwoch' },
			{ target: 'giovedì', en: 'Thursday', de: 'Donnerstag' },
			{ target: 'venerdì', en: 'Friday', de: 'Freitag' },
			{ target: 'sabato', en: 'Saturday', de: 'Samstag' },
			{ target: 'domenica', en: 'Sunday', de: 'Sonntag' },
			{ target: 'la settimana', en: 'week', de: 'Woche' },
			{ target: 'il mese', en: 'month', de: 'Monat' },
			{ target: "l'anno", en: 'year', de: 'Jahr' },
			{ target: 'oggi', en: 'today', de: 'heute' },
			{ target: 'domani', en: 'tomorrow', de: 'morgen' },
			{ target: 'ieri', en: 'yesterday', de: 'gestern' },
			{ target: "l'ora", en: 'hour', de: 'Stunde' },
			{ target: 'il minuto', en: 'minute', de: 'Minute' },
			{ target: 'il secondo', en: 'second', de: 'Sekunde' },
			{ target: 'mezzogiorno', en: 'noon', de: 'Mittag' },
			{ target: 'mezzanotte', en: 'midnight', de: 'Mitternacht' },
			{ target: 'presto', en: 'early', de: 'früh' },
			{ target: 'tardi', en: 'late', de: 'spät' }
		],
		sentences: [
			{ target: 'Oggi è lunedì.', en: 'Today is Monday.', de: 'Heute ist Montag.' },
			{ target: 'Che ora è?', en: 'What time is it?', de: 'Wie spät ist es?' },
			{ target: 'Sono le tre.', en: 'It is three o clock.', de: 'Es ist drei Uhr.' },
			{ target: 'Domani è venerdì.', en: 'Tomorrow is Friday.', de: 'Morgen ist Freitag.' },
			{
				target: 'La settimana ha sette giorni.',
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
		themeColor: '#A8DADC',
		vocab: [
			{ target: 'la testa', en: 'head', de: 'Kopf' },
			{ target: "l'occhio", en: 'eye', de: 'Auge' },
			{ target: "l'orecchio", en: 'ear', de: 'Ohr' },
			{ target: 'il naso', en: 'nose', de: 'Nase' },
			{ target: 'la bocca', en: 'mouth', de: 'Mund' },
			{ target: 'il dente', en: 'tooth', de: 'Zahn' },
			{ target: 'la lingua', en: 'tongue', de: 'Zunge' },
			{ target: 'il collo', en: 'neck', de: 'Hals' },
			{ target: 'il braccio', en: 'arm', de: 'Arm' },
			{ target: 'la mano', en: 'hand', de: 'Hand' },
			{ target: 'il dito', en: 'finger', de: 'Finger' },
			{ target: 'la gamba', en: 'leg', de: 'Bein' },
			{ target: 'il piede', en: 'foot', de: 'Fuß' },
			{ target: 'la schiena', en: 'back', de: 'Rücken' },
			{ target: 'il petto', en: 'chest', de: 'Brust' },
			{ target: 'lo stomaco', en: 'stomach', de: 'Magen' },
			{ target: 'il cuore', en: 'heart', de: 'Herz' },
			{ target: 'i capelli', en: 'hair', de: 'Haare' },
			{ target: 'il viso', en: 'face', de: 'Gesicht' },
			{ target: 'il corpo', en: 'body', de: 'Körper' }
		],
		sentences: [
			{ target: 'Mi fa male la testa.', en: 'My head hurts.', de: 'Mir tut der Kopf weh.' },
			{ target: 'Ho due occhi.', en: 'I have two eyes.', de: 'Ich habe zwei Augen.' },
			{ target: 'Lei ha i capelli lunghi.', en: 'She has long hair.', de: 'Sie hat lange Haare.' },
			{ target: 'Lavati le mani.', en: 'Wash your hands.', de: 'Wasch dir die Hände.' },
			{
				target: 'Il cuore batte velocemente.',
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
		themeColor: '#8E7DBE',
		vocab: [
			{ target: 'la camicia', en: 'shirt', de: 'Hemd' },
			{ target: 'i pantaloni', en: 'pants', de: 'Hose' },
			{ target: 'il vestito', en: 'dress', de: 'Kleid' },
			{ target: 'la gonna', en: 'skirt', de: 'Rock' },
			{ target: 'le scarpe', en: 'shoes', de: 'Schuhe' },
			{ target: 'i calzini', en: 'socks', de: 'Socken' },
			{ target: 'la giacca', en: 'jacket', de: 'Jacke' },
			{ target: 'il cappotto', en: 'coat', de: 'Mantel' },
			{ target: 'il cappello', en: 'hat', de: 'Hut' },
			{ target: 'il berretto', en: 'cap', de: 'Mütze' },
			{ target: 'la sciarpa', en: 'scarf', de: 'Schal' },
			{ target: 'i guanti', en: 'gloves', de: 'Handschuhe' },
			{ target: 'la cintura', en: 'belt', de: 'Gürtel' },
			{ target: 'la cravatta', en: 'tie', de: 'Krawatte' },
			{ target: 'la borsa', en: 'bag', de: 'Tasche' },
			{ target: 'i vestiti', en: 'clothes', de: 'Kleidung' },
			{ target: 'la maglietta', en: 't-shirt', de: 'T-Shirt' },
			{ target: 'i jeans', en: 'jeans', de: 'Jeans' },
			{ target: 'gli stivali', en: 'boots', de: 'Stiefel' },
			{ target: 'il pigiama', en: 'pajamas', de: 'Schlafanzug' }
		],
		sentences: [
			{
				target: 'Lei indossa un vestito rosso.',
				en: 'She wears a red dress.',
				de: 'Sie trägt ein rotes Kleid.'
			},
			{
				target: 'Devo comprare le scarpe.',
				en: 'I need to buy shoes.',
				de: 'Ich muss Schuhe kaufen.'
			},
			{
				target: 'Fa freddo, metti la giacca.',
				en: 'It is cold, put on your jacket.',
				de: 'Es ist kalt, zieh deine Jacke an.'
			},
			{ target: "Dov'è la mia camicia?", en: 'Where is my shirt?', de: 'Wo ist mein Hemd?' },
			{ target: 'I calzini sono bianchi.', en: 'The socks are white.', de: 'Die Socken sind weiß.' }
		]
	},
	{
		titleEn: 'House & Home',
		titleDe: 'Haus & Zuhause',
		descriptionEn: 'Learn about rooms and furniture',
		descriptionDe: 'Lerne über Räume und Möbel',
		themeColor: '#6D597A',
		vocab: [
			{ target: 'la casa', en: 'house', de: 'Haus' },
			{ target: "l'appartamento", en: 'apartment', de: 'Wohnung' },
			{ target: 'la stanza', en: 'room', de: 'Zimmer' },
			{ target: 'la cucina', en: 'kitchen', de: 'Küche' },
			{ target: 'il bagno', en: 'bathroom', de: 'Badezimmer' },
			{ target: 'la camera da letto', en: 'bedroom', de: 'Schlafzimmer' },
			{ target: 'il soggiorno', en: 'living room', de: 'Wohnzimmer' },
			{ target: 'la sala da pranzo', en: 'dining room', de: 'Esszimmer' },
			{ target: 'la porta', en: 'door', de: 'Tür' },
			{ target: 'la finestra', en: 'window', de: 'Fenster' },
			{ target: 'il tavolo', en: 'table', de: 'Tisch' },
			{ target: 'la sedia', en: 'chair', de: 'Stuhl' },
			{ target: 'il letto', en: 'bed', de: 'Bett' },
			{ target: 'il divano', en: 'sofa', de: 'Sofa' },
			{ target: 'la lampada', en: 'lamp', de: 'Lampe' },
			{ target: 'lo specchio', en: 'mirror', de: 'Spiegel' },
			{ target: 'le scale', en: 'stairs', de: 'Treppe' },
			{ target: 'il giardino', en: 'garden', de: 'Garten' },
			{ target: 'il garage', en: 'garage', de: 'Garage' },
			{ target: 'il tetto', en: 'roof', de: 'Dach' }
		],
		sentences: [
			{ target: 'La mia casa è grande.', en: 'My house is big.', de: 'Mein Haus ist groß.' },
			{ target: 'La cucina è pulita.', en: 'The kitchen is clean.', de: 'Die Küche ist sauber.' },
			{
				target: "C'è un tavolo nella sala da pranzo.",
				en: 'There is a table in the dining room.',
				de: 'Es gibt einen Tisch im Esszimmer.'
			},
			{
				target: 'Dormo nel mio letto.',
				en: 'I sleep in my bed.',
				de: 'Ich schlafe in meinem Bett.'
			},
			{
				target: 'Il giardino ha molti fiori.',
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
		themeColor: '#B56576',
		vocab: [
			{ target: 'essere', en: 'to be', de: 'sein' },
			{ target: 'stare', en: 'to be', de: 'sein' },
			{ target: 'avere', en: 'to have', de: 'haben' },
			{ target: 'fare', en: 'to do/make', de: 'machen' },
			{ target: 'andare', en: 'to go', de: 'gehen' },
			{ target: 'venire', en: 'to come', de: 'kommen' },
			{ target: 'vedere', en: 'to see', de: 'sehen' },
			{ target: 'dare', en: 'to give', de: 'geben' },
			{ target: 'sapere', en: 'to know', de: 'wissen' },
			{ target: 'potere', en: 'can/to be able', de: 'können' },
			{ target: 'volere', en: 'to want', de: 'wollen' },
			{ target: 'dire', en: 'to say', de: 'sagen' },
			{ target: 'parlare', en: 'to speak', de: 'sprechen' },
			{ target: 'mangiare', en: 'to eat', de: 'essen' },
			{ target: 'bere', en: 'to drink', de: 'trinken' },
			{ target: 'dormire', en: 'to sleep', de: 'schlafen' },
			{ target: 'vivere', en: 'to live', de: 'leben' },
			{ target: 'lavorare', en: 'to work', de: 'arbeiten' },
			{ target: 'studiare', en: 'to study', de: 'studieren' },
			{ target: 'giocare', en: 'to play', de: 'spielen' }
		],
		sentences: [
			{ target: 'Io sono uno studente.', en: 'I am a student.', de: 'Ich bin Student.' },
			{ target: 'Lei ha un cane.', en: 'She has a dog.', de: 'Sie hat einen Hund.' },
			{ target: 'Noi andiamo al parco.', en: 'We go to the park.', de: 'Wir gehen in den Park.' },
			{
				target: "Voglio imparare l'italiano.",
				en: 'I want to learn Italian.',
				de: 'Ich möchte Italienisch lernen.'
			},
			{ target: 'Loro lavorano molto.', en: 'They work a lot.', de: 'Sie arbeiten viel.' }
		]
	}
];

export const A2_UNITS: UnitVocab[] = [
	{
		titleEn: 'Weather & Seasons',
		titleDe: 'Wetter & Jahreszeiten',
		descriptionEn: 'Talk about the weather and seasons',
		descriptionDe: 'Sprich über das Wetter und die Jahreszeiten',
		themeColor: '#2F6D8A',
		vocab: [
			{ target: 'il tempo', en: 'weather', de: 'Wetter' },
			{ target: 'il sole', en: 'sun', de: 'Sonne' },
			{ target: 'la pioggia', en: 'rain', de: 'Regen' },
			{ target: 'la neve', en: 'snow', de: 'Schnee' },
			{ target: 'il vento', en: 'wind', de: 'Wind' },
			{ target: 'la nuvola', en: 'cloud', de: 'Wolke' },
			{ target: 'il temporale', en: 'storm', de: 'Sturm' },
			{ target: 'il caldo', en: 'heat', de: 'Hitze' },
			{ target: 'il freddo', en: 'cold', de: 'Kälte' },
			{ target: 'la primavera', en: 'spring', de: 'Frühling' },
			{ target: "l'estate", en: 'summer', de: 'Sommer' },
			{ target: "l'autunno", en: 'autumn', de: 'Herbst' },
			{ target: "l'inverno", en: 'winter', de: 'Winter' },
			{ target: 'la temperatura', en: 'temperature', de: 'Temperatur' },
			{ target: 'il grado', en: 'degree', de: 'Grad' },
			{ target: 'umido', en: 'humid', de: 'feucht' },
			{ target: 'secco', en: 'dry', de: 'trocken' },
			{ target: 'nuvoloso', en: 'cloudy', de: 'bewölkt' },
			{ target: 'soleggiato', en: 'sunny', de: 'sonnig' },
			{ target: 'piovoso', en: 'rainy', de: 'regnerisch' }
		],
		sentences: [
			{ target: 'Oggi fa caldo.', en: 'It is hot today.', de: 'Heute ist es heiß.' },
			{ target: 'Sta piovendo.', en: 'It is raining.', de: 'Es regnet.' },
			{ target: "L'inverno è freddo.", en: 'Winter is cold.', de: 'Der Winter ist kalt.' },
			{ target: 'Che tempo fa?', en: 'What is the weather like?', de: 'Wie ist das Wetter?' },
			{ target: 'Mi piace la primavera.', en: 'I like spring.', de: 'Ich mag den Frühling.' }
		]
	},
	{
		titleEn: 'Travel & Transport',
		titleDe: 'Reisen & Verkehr',
		descriptionEn: 'Learn vocabulary for traveling',
		descriptionDe: 'Lerne Vokabeln zum Reisen',
		themeColor: '#C44536',
		vocab: [
			{ target: "l'aereo", en: 'airplane', de: 'Flugzeug' },
			{ target: 'il treno', en: 'train', de: 'Zug' },
			{ target: "l'autobus", en: 'bus', de: 'Bus' },
			{ target: 'la macchina', en: 'car', de: 'Auto' },
			{ target: 'la bicicletta', en: 'bicycle', de: 'Fahrrad' },
			{ target: 'la nave', en: 'boat', de: 'Boot' },
			{ target: 'il taxi', en: 'taxi', de: 'Taxi' },
			{ target: 'la metropolitana', en: 'subway', de: 'U-Bahn' },
			{ target: "l'aeroporto", en: 'airport', de: 'Flughafen' },
			{ target: 'la stazione', en: 'station', de: 'Bahnhof' },
			{ target: 'il biglietto', en: 'ticket', de: 'Fahrkarte' },
			{ target: 'il passaporto', en: 'passport', de: 'Reisepass' },
			{ target: 'la valigia', en: 'suitcase', de: 'Koffer' },
			{ target: 'il viaggio', en: 'trip', de: 'Reise' },
			{ target: 'la destinazione', en: 'destination', de: 'Ziel' },
			{ target: "l'arrivo", en: 'arrival', de: 'Ankunft' },
			{ target: 'la partenza', en: 'departure', de: 'Abfahrt' },
			{ target: 'il bagaglio', en: 'luggage', de: 'Gepäck' },
			{ target: 'la prenotazione', en: 'reservation', de: 'Reservierung' },
			{ target: 'il turista', en: 'tourist', de: 'Tourist' }
		],
		sentences: [
			{
				target: 'Il treno parte alle otto.',
				en: 'The train leaves at eight.',
				de: 'Der Zug fährt um acht ab.'
			},
			{
				target: 'Ho bisogno di un biglietto.',
				en: 'I need a ticket.',
				de: 'Ich brauche eine Fahrkarte.'
			},
			{
				target: "L'aeroporto è lontano.",
				en: 'The airport is far.',
				de: 'Der Flughafen ist weit weg.'
			},
			{ target: "Dov'è la stazione?", en: 'Where is the station?', de: 'Wo ist der Bahnhof?' },
			{ target: 'Viaggio in aereo.', en: 'I travel by plane.', de: 'Ich reise mit dem Flugzeug.' }
		]
	},
	{
		titleEn: 'Shopping',
		titleDe: 'Einkaufen',
		descriptionEn: 'Learn to shop and talk about prices',
		descriptionDe: 'Lerne einzukaufen und über Preise zu sprechen',
		themeColor: '#3A86FF',
		vocab: [
			{ target: 'il negozio', en: 'store', de: 'Geschäft' },
			{ target: 'il mercato', en: 'market', de: 'Markt' },
			{ target: 'il prezzo', en: 'price', de: 'Preis' },
			{ target: 'i soldi', en: 'money', de: 'Geld' },
			{ target: 'la carta', en: 'card', de: 'Karte' },
			{ target: 'il contante', en: 'cash', de: 'Bargeld' },
			{ target: 'il conto', en: 'bill', de: 'Rechnung' },
			{ target: 'il resto', en: 'change', de: 'Wechselgeld' },
			{ target: 'lo sconto', en: 'discount', de: 'Rabatt' },
			{ target: "l'offerta", en: 'sale', de: 'Angebot' },
			{ target: 'economico', en: 'cheap', de: 'günstig' },
			{ target: 'caro', en: 'expensive', de: 'teuer' },
			{ target: 'comprare', en: 'to buy', de: 'kaufen' },
			{ target: 'vendere', en: 'to sell', de: 'verkaufen' },
			{ target: 'pagare', en: 'to pay', de: 'bezahlen' },
			{ target: 'il cliente', en: 'customer', de: 'Kunde' },
			{ target: 'il commesso', en: 'salesperson', de: 'Verkäufer' },
			{ target: 'lo scontrino', en: 'receipt', de: 'Kassenbon' },
			{ target: 'la cassa', en: 'cash register', de: 'Kasse' },
			{ target: 'il sacchetto', en: 'bag', de: 'Tüte' }
		],
		sentences: [
			{ target: 'Quanto costa?', en: 'How much does it cost?', de: 'Wie viel kostet das?' },
			{ target: 'È molto caro.', en: 'It is very expensive.', de: 'Es ist sehr teuer.' },
			{ target: 'Accettate la carta?', en: 'Do you accept cards?', de: 'Akzeptieren Sie Karten?' },
			{
				target: 'Voglio comprare questo.',
				en: 'I want to buy this.',
				de: 'Ich möchte das kaufen.'
			},
			{
				target: "C'è uno sconto del venti per cento.",
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
		themeColor: '#2B9348',
		vocab: [
			{ target: 'il medico', en: 'doctor', de: 'Arzt' },
			{ target: "l'ospedale", en: 'hospital', de: 'Krankenhaus' },
			{ target: "l'infermiera", en: 'nurse', de: 'Krankenschwester' },
			{ target: 'la medicina', en: 'medicine', de: 'Medizin' },
			{ target: 'malato', en: 'sick', de: 'krank' },
			{ target: 'sano', en: 'healthy', de: 'gesund' },
			{ target: 'il dolore', en: 'pain', de: 'Schmerz' },
			{ target: 'la febbre', en: 'fever', de: 'Fieber' },
			{ target: "l'influenza", en: 'flu', de: 'Grippe' },
			{ target: 'la tosse', en: 'cough', de: 'Husten' },
			{ target: 'il raffreddore', en: 'cold', de: 'Erkältung' },
			{ target: "l'allergia", en: 'allergy', de: 'Allergie' },
			{ target: "l'appuntamento", en: 'appointment', de: 'Termin' },
			{ target: 'la prescrizione', en: 'prescription', de: 'Rezept' },
			{ target: 'la compressa', en: 'pill', de: 'Tablette' },
			{ target: 'la farmacia', en: 'pharmacy', de: 'Apotheke' },
			{ target: "l'emergenza", en: 'emergency', de: 'Notfall' },
			{ target: "l'ambulanza", en: 'ambulance', de: 'Krankenwagen' },
			{ target: 'il sangue', en: 'blood', de: 'Blut' },
			{ target: 'la ferita', en: 'wound', de: 'Wunde' }
		],
		sentences: [
			{ target: 'Mi sento male.', en: 'I feel sick.', de: 'Ich fühle mich krank.' },
			{
				target: 'Devo andare dal medico.',
				en: 'I need to see the doctor.',
				de: 'Ich muss zum Arzt.'
			},
			{ target: 'Ho mal di testa.', en: 'I have a headache.', de: 'Ich habe Kopfschmerzen.' },
			{ target: "Dov'è la farmacia?", en: 'Where is the pharmacy?', de: 'Wo ist die Apotheke?' },
			{ target: 'Prendi questa medicina.', en: 'Take this medicine.', de: 'Nimm diese Medizin.' }
		]
	},
	{
		titleEn: 'Work & Professions',
		titleDe: 'Arbeit & Berufe',
		descriptionEn: 'Learn about jobs and the workplace',
		descriptionDe: 'Lerne über Berufe und den Arbeitsplatz',
		themeColor: '#6C584C',
		vocab: [
			{ target: 'il lavoro', en: 'work/job', de: 'Arbeit' },
			{ target: "l'ufficio", en: 'office', de: 'Büro' },
			{ target: 'il capo', en: 'boss', de: 'Chef' },
			{ target: "l'impiegato", en: 'employee', de: 'Angestellter' },
			{ target: "l'insegnante", en: 'teacher', de: 'Lehrer' },
			{ target: "l'avvocato", en: 'lawyer', de: 'Anwalt' },
			{ target: "l'ingegnere", en: 'engineer', de: 'Ingenieur' },
			{ target: 'il cuoco', en: 'cook', de: 'Koch' },
			{ target: 'il poliziotto', en: 'police officer', de: 'Polizist' },
			{ target: 'il pompiere', en: 'firefighter', de: 'Feuerwehrmann' },
			{ target: 'lo scrittore', en: 'writer', de: 'Schriftsteller' },
			{ target: "l'artista", en: 'artist', de: 'Künstler' },
			{ target: 'il musicista', en: 'musician', de: 'Musiker' },
			{ target: 'lo stipendio', en: 'salary', de: 'Gehalt' },
			{ target: 'la riunione', en: 'meeting', de: 'Besprechung' },
			{ target: 'il computer', en: 'computer', de: 'Computer' },
			{ target: "l'email", en: 'email', de: 'E-Mail' },
			{ target: 'il progetto', en: 'project', de: 'Projekt' },
			{ target: "l'azienda", en: 'company', de: 'Unternehmen' },
			{ target: 'la carriera', en: 'career', de: 'Karriere' }
		],
		sentences: [
			{
				target: 'Lavoro in un ufficio.',
				en: 'I work in an office.',
				de: 'Ich arbeite in einem Büro.'
			},
			{
				target: 'Mio fratello è ingegnere.',
				en: 'My brother is an engineer.',
				de: 'Mein Bruder ist Ingenieur.'
			},
			{
				target: 'Ho una riunione domani.',
				en: 'I have a meeting tomorrow.',
				de: 'Ich habe morgen eine Besprechung.'
			},
			{
				target: 'Qual è la tua professione?',
				en: 'What is your profession?',
				de: 'Was ist dein Beruf?'
			},
			{ target: 'Il capo è occupato.', en: 'The boss is busy.', de: 'Der Chef ist beschäftigt.' }
		]
	},
	{
		titleEn: 'Education',
		titleDe: 'Bildung',
		descriptionEn: 'School and learning vocabulary',
		descriptionDe: 'Schul- und Lernvokabular',
		themeColor: '#4361EE',
		vocab: [
			{ target: 'la scuola', en: 'school', de: 'Schule' },
			{ target: "l'università", en: 'university', de: 'Universität' },
			{ target: 'la lezione', en: 'class', de: 'Unterricht' },
			{ target: 'lo studente', en: 'student', de: 'Student' },
			{ target: 'il professore', en: 'teacher', de: 'Lehrer' },
			{ target: 'il libro', en: 'book', de: 'Buch' },
			{ target: 'il quaderno', en: 'notebook', de: 'Heft' },
			{ target: 'la matita', en: 'pencil', de: 'Bleistift' },
			{ target: 'la penna', en: 'pen', de: 'Kugelschreiber' },
			{ target: "l'esame", en: 'exam', de: 'Prüfung' },
			{ target: 'i compiti', en: 'homework', de: 'Hausaufgaben' },
			{ target: 'il voto', en: 'grade', de: 'Note' },
			{ target: 'la lavagna', en: 'blackboard', de: 'Tafel' },
			{ target: 'la biblioteca', en: 'library', de: 'Bibliothek' },
			{ target: 'la lingua', en: 'language', de: 'Sprache' },
			{ target: 'la matematica', en: 'mathematics', de: 'Mathematik' },
			{ target: 'la scienza', en: 'science', de: 'Wissenschaft' },
			{ target: 'la storia', en: 'history', de: 'Geschichte' },
			{ target: 'la geografia', en: 'geography', de: 'Geografie' },
			{ target: "l'arte", en: 'art', de: 'Kunst' }
		],
		sentences: [
			{ target: 'Studio italiano.', en: 'I study Italian.', de: 'Ich lerne Italienisch.' },
			{
				target: 'La lezione comincia alle nove.',
				en: 'The class starts at nine.',
				de: 'Der Unterricht beginnt um neun.'
			},
			{
				target: 'Ho molti compiti.',
				en: 'I have a lot of homework.',
				de: 'Ich habe viele Hausaufgaben.'
			},
			{ target: "Dov'è la biblioteca?", en: 'Where is the library?', de: 'Wo ist die Bibliothek?' },
			{
				target: "L'esame è difficile.",
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
		themeColor: '#0A9396',
		vocab: [
			{ target: 'lo sport', en: 'sport', de: 'Sport' },
			{ target: 'il calcio', en: 'soccer', de: 'Fußball' },
			{ target: 'la pallacanestro', en: 'basketball', de: 'Basketball' },
			{ target: 'il tennis', en: 'tennis', de: 'Tennis' },
			{ target: 'il nuoto', en: 'swimming', de: 'Schwimmen' },
			{ target: 'correre', en: 'to run', de: 'laufen' },
			{ target: 'camminare', en: 'to walk', de: 'gehen' },
			{ target: 'la squadra', en: 'team', de: 'Mannschaft' },
			{ target: 'la palla', en: 'ball', de: 'Ball' },
			{ target: 'la partita', en: 'game/match', de: 'Spiel' },
			{ target: 'vincere', en: 'to win', de: 'gewinnen' },
			{ target: 'perdere', en: 'to lose', de: 'verlieren' },
			{ target: 'la musica', en: 'music', de: 'Musik' },
			{ target: 'il film', en: 'movie', de: 'Film' },
			{ target: 'leggere', en: 'to read', de: 'lesen' },
			{ target: 'cucinare', en: 'to cook', de: 'kochen' },
			{ target: 'ballare', en: 'to dance', de: 'tanzen' },
			{ target: 'cantare', en: 'to sing', de: 'singen' },
			{ target: 'dipingere', en: 'to paint', de: 'malen' },
			{ target: 'la fotografia', en: 'photography', de: 'Fotografie' }
		],
		sentences: [
			{
				target: 'Mi piace giocare a calcio.',
				en: 'I like to play soccer.',
				de: 'Ich spiele gern Fußball.'
			},
			{ target: 'Lei nuota molto bene.', en: 'She swims very well.', de: 'Sie schwimmt sehr gut.' },
			{
				target: 'La squadra ha vinto la partita.',
				en: 'The team won the game.',
				de: 'Die Mannschaft hat das Spiel gewonnen.'
			},
			{ target: 'Qual è il tuo hobby?', en: 'What is your hobby?', de: 'Was ist dein Hobby?' },
			{
				target: 'Leggo libri ogni giorno.',
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
		themeColor: '#495057',
		vocab: [
			{ target: 'la città', en: 'city', de: 'Stadt' },
			{ target: 'il paese', en: 'town', de: 'Kleinstadt' },
			{ target: 'la strada', en: 'street', de: 'Straße' },
			{ target: 'la piazza', en: 'square', de: 'Platz' },
			{ target: 'il parco', en: 'park', de: 'Park' },
			{ target: 'la banca', en: 'bank', de: 'Bank' },
			{ target: 'il ristorante', en: 'restaurant', de: 'Restaurant' },
			{ target: 'il supermercato', en: 'supermarket', de: 'Supermarkt' },
			{ target: 'il museo', en: 'museum', de: 'Museum' },
			{ target: 'il teatro', en: 'theater', de: 'Theater' },
			{ target: 'la chiesa', en: 'church', de: 'Kirche' },
			{ target: "l'hotel", en: 'hotel', de: 'Hotel' },
			{ target: 'il centro', en: 'downtown', de: 'Innenstadt' },
			{ target: "l'angolo", en: 'corner', de: 'Ecke' },
			{ target: 'a destra', en: 'right', de: 'rechts' },
			{ target: 'a sinistra', en: 'left', de: 'links' },
			{ target: 'dritto', en: 'straight', de: 'geradeaus' },
			{ target: 'vicino', en: 'near', de: 'nah' },
			{ target: 'lontano', en: 'far', de: 'weit' },
			{ target: 'la direzione', en: 'direction', de: 'Richtung' }
		],
		sentences: [
			{
				target: 'La banca è a destra.',
				en: 'The bank is on the right.',
				de: 'Die Bank ist rechts.'
			},
			{
				target: 'Andiamo in centro.',
				en: 'Let us go downtown.',
				de: 'Lass uns in die Innenstadt gehen.'
			},
			{
				target: 'Il museo è vicino.',
				en: 'The museum is nearby.',
				de: 'Das Museum ist in der Nähe.'
			},
			{
				target: 'Come arrivo al parco?',
				en: 'How do I get to the park?',
				de: 'Wie komme ich zum Park?'
			},
			{
				target: 'Vai dritto per due isolati.',
				en: 'Go straight two blocks.',
				de: 'Geh zwei Blocks geradeaus.'
			}
		]
	},
	{
		titleEn: 'Nature & Animals',
		titleDe: 'Natur & Tiere',
		descriptionEn: 'Learn about nature and animals',
		descriptionDe: 'Lerne über Natur und Tiere',
		themeColor: '#7CB518',
		vocab: [
			{ target: 'il cane', en: 'dog', de: 'Hund' },
			{ target: 'il gatto', en: 'cat', de: 'Katze' },
			{ target: "l'uccello", en: 'bird', de: 'Vogel' },
			{ target: 'il pesce', en: 'fish', de: 'Fisch' },
			{ target: 'il cavallo', en: 'horse', de: 'Pferd' },
			{ target: 'la mucca', en: 'cow', de: 'Kuh' },
			{ target: 'il maiale', en: 'pig', de: 'Schwein' },
			{ target: "l'albero", en: 'tree', de: 'Baum' },
			{ target: 'il fiore', en: 'flower', de: 'Blume' },
			{ target: 'la pianta', en: 'plant', de: 'Pflanze' },
			{ target: 'il fiume', en: 'river', de: 'Fluss' },
			{ target: 'il mare', en: 'sea', de: 'Meer' },
			{ target: 'la montagna', en: 'mountain', de: 'Berg' },
			{ target: 'il bosco', en: 'forest', de: 'Wald' },
			{ target: 'la spiaggia', en: 'beach', de: 'Strand' },
			{ target: 'il lago', en: 'lake', de: 'See' },
			{ target: 'il cielo', en: 'sky', de: 'Himmel' },
			{ target: 'la stella', en: 'star', de: 'Stern' },
			{ target: 'la luna', en: 'moon', de: 'Mond' },
			{ target: 'la terra', en: 'earth', de: 'Erde' }
		],
		sentences: [
			{
				target: 'Il mio cane è molto amichevole.',
				en: 'My dog is very friendly.',
				de: 'Mein Hund ist sehr freundlich.'
			},
			{
				target: 'I fiori sono bellissimi.',
				en: 'The flowers are beautiful.',
				de: 'Die Blumen sind wunderschön.'
			},
			{ target: 'Il fiume è pulito.', en: 'The river is clean.', de: 'Der Fluss ist sauber.' },
			{
				target: 'Ci sono molti alberi nel bosco.',
				en: 'There are many trees in the forest.',
				de: 'Es gibt viele Bäume im Wald.'
			},
			{
				target: 'Le stelle brillano nel cielo.',
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
		themeColor: '#BC4749',
		vocab: [
			{ target: 'felice', en: 'happy', de: 'glücklich' },
			{ target: 'triste', en: 'sad', de: 'traurig' },
			{ target: 'arrabbiato', en: 'angry', de: 'wütend' },
			{ target: 'stanco', en: 'tired', de: 'müde' },
			{ target: 'nervoso', en: 'nervous', de: 'nervös' },
			{ target: 'preoccupato', en: 'worried', de: 'besorgt' },
			{ target: 'sorpreso', en: 'surprised', de: 'überrascht' },
			{ target: 'emozionato', en: 'excited', de: 'aufgeregt' },
			{ target: 'annoiato', en: 'bored', de: 'gelangweilt' },
			{ target: 'spaventato', en: 'scared', de: 'verängstigt' },
			{ target: 'calmo', en: 'calm', de: 'ruhig' },
			{ target: 'contento', en: 'content', de: 'zufrieden' },
			{ target: "l'amore", en: 'love', de: 'Liebe' },
			{ target: "l'odio", en: 'hate', de: 'Hass' },
			{ target: 'la paura', en: 'fear', de: 'Angst' },
			{ target: 'la gioia', en: 'joy', de: 'Freude' },
			{ target: 'la tristezza', en: 'sadness', de: 'Traurigkeit' },
			{ target: 'la speranza', en: 'hope', de: 'Hoffnung' },
			{ target: 'la confusione', en: 'confusion', de: 'Verwirrung' },
			{ target: "l'orgoglio", en: 'pride', de: 'Stolz' }
		],
		sentences: [
			{
				target: 'Oggi sono molto felice.',
				en: 'I am very happy today.',
				de: 'Ich bin heute sehr glücklich.'
			},
			{ target: 'Lei è triste.', en: 'She is sad.', de: 'Sie ist traurig.' },
			{ target: 'Mi sento stanco.', en: 'I feel tired.', de: 'Ich fühle mich müde.' },
			{ target: 'Non essere nervoso.', en: 'Do not be nervous.', de: 'Sei nicht nervös.' },
			{
				target: 'Ho paura del buio.',
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
		themeColor: '#5E548E',
		vocab: [
			{ target: 'sono stato', en: 'was/have been', de: 'war/bin gewesen' },
			{ target: 'ero', en: 'was (state)', de: 'war (Zustand)' },
			{ target: 'ho avuto', en: 'had', de: 'hatte' },
			{ target: 'ho fatto', en: 'did/made', de: 'machte' },
			{ target: 'ho detto', en: 'said', de: 'sagte' },
			{ target: 'sono venuto', en: 'came', de: 'kam' },
			{ target: 'ho visto', en: 'saw', de: 'sah' },
			{ target: 'ho dato', en: 'gave', de: 'gab' },
			{ target: 'ho saputo', en: 'knew', de: 'wusste' },
			{ target: 'ho potuto', en: 'could', de: 'konnte' },
			{ target: 'ho voluto', en: 'wanted', de: 'wollte' },
			{ target: 'ho mangiato', en: 'ate', de: 'aß' },
			{ target: 'ho bevuto', en: 'drank', de: 'trank' },
			{ target: 'ho dormito', en: 'slept', de: 'schlief' },
			{ target: 'ho scritto', en: 'wrote', de: 'schrieb' },
			{ target: 'ho letto', en: 'read', de: 'las' },
			{ target: 'ho sentito', en: 'heard/felt', de: 'hörte/fühlte' },
			{ target: 'ho chiesto', en: 'asked for', de: 'bat um' },
			{ target: 'sono partito', en: 'left/departed', de: 'ging weg' },
			{ target: 'sono morto', en: 'died', de: 'ist gestorben' }
		],
		sentences: [
			{
				target: 'Ieri sono andato al cinema.',
				en: 'Yesterday I went to the movies.',
				de: 'Gestern ging ich ins Kino.'
			},
			{ target: 'Lei ha mangiato la pizza.', en: 'She ate pizza.', de: 'Sie hat Pizza gegessen.' },
			{
				target: 'Lui mi ha detto la verità.',
				en: 'He told me the truth.',
				de: 'Er hat mir die Wahrheit gesagt.'
			},
			{
				target: 'Che cosa hai fatto ieri?',
				en: 'What did you do yesterday?',
				de: 'Was hast du gestern gemacht?'
			},
			{
				target: 'Non ho potuto dormire stanotte.',
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
		themeColor: '#4C956C',
		vocab: [
			{ target: 'sarò', en: 'will be', de: 'werde sein' },
			{ target: 'starò', en: 'will be (location/state)', de: 'werde sein (Ort/Zustand)' },
			{ target: 'avrò', en: 'will have', de: 'werde haben' },
			{ target: 'farò', en: 'will do/make', de: 'werde machen' },
			{ target: 'andrò', en: 'will go', de: 'werde gehen' },
			{ target: 'verrò', en: 'will come', de: 'werde kommen' },
			{ target: 'potrò', en: 'will be able to', de: 'werde können' },
			{ target: 'vorrò', en: 'will want', de: 'werde wollen' },
			{ target: 'saprò', en: 'will know', de: 'werde wissen' },
			{ target: 'dirò', en: 'will say', de: 'werde sagen' },
			{ target: 'presto', en: 'soon', de: 'bald' },
			{ target: 'dopo', en: 'after', de: 'danach' },
			{ target: 'più tardi', en: 'later', de: 'später' },
			{ target: 'un giorno', en: 'someday', de: 'eines Tages' },
			{ target: 'prossimo', en: 'next', de: 'nächste' },
			{ target: 'il futuro', en: 'future', de: 'Zukunft' },
			{ target: 'pianificare', en: 'to plan', de: 'planen' },
			{ target: 'sperare', en: 'to hope', de: 'hoffen' },
			{ target: 'pensare di', en: 'to intend', de: 'vorhaben' },
			{ target: 'decidere', en: 'to decide', de: 'entscheiden' }
		],
		sentences: [
			{
				target: 'Domani andrò dal medico.',
				en: 'Tomorrow I will go to the doctor.',
				de: 'Morgen werde ich zum Arzt gehen.'
			},
			{
				target: "L'anno prossimo viaggerò in Italia.",
				en: 'Next year I will travel to Italy.',
				de: 'Nächstes Jahr werde ich nach Italien reisen.'
			},
			{
				target: 'Che cosa farai questo fine settimana?',
				en: 'What will you do this weekend?',
				de: 'Was wirst du dieses Wochenende machen?'
			},
			{
				target: 'Lei verrà alla festa.',
				en: 'She will come to the party.',
				de: 'Sie wird zur Party kommen.'
			},
			{
				target: 'Presto sapremo i risultati.',
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
		themeColor: '#277DA1',
		vocab: [
			{ target: 'internet', en: 'internet', de: 'Internet' },
			{ target: 'il telefono', en: 'phone', de: 'Telefon' },
			{ target: "l'applicazione", en: 'app', de: 'App' },
			{ target: 'il messaggio', en: 'message', de: 'Nachricht' },
			{ target: 'la chiamata', en: 'call', de: 'Anruf' },
			{ target: 'lo schermo', en: 'screen', de: 'Bildschirm' },
			{ target: 'la batteria', en: 'battery', de: 'Akku' },
			{ target: 'il caricatore', en: 'charger', de: 'Ladegerät' },
			{ target: 'la password', en: 'password', de: 'Passwort' },
			{ target: "l'account", en: 'account', de: 'Konto' },
			{ target: 'scaricare', en: 'to download', de: 'herunterladen' },
			{ target: 'caricare', en: 'to upload', de: 'hochladen' },
			{ target: 'cercare', en: 'to search', de: 'suchen' },
			{ target: 'connettere', en: 'to connect', de: 'verbinden' },
			{ target: 'la rete', en: 'network', de: 'Netzwerk' },
			{ target: 'il sito web', en: 'website', de: 'Webseite' },
			{ target: 'il video', en: 'video', de: 'Video' },
			{ target: 'la foto', en: 'photo', de: 'Foto' },
			{ target: "l'utente", en: 'user', de: 'Benutzer' },
			{ target: 'i dati', en: 'data', de: 'Daten' }
		],
		sentences: [
			{ target: 'Non ho internet.', en: 'I do not have internet.', de: 'Ich habe kein Internet.' },
			{
				target: 'Scarica questa applicazione.',
				en: 'Download this app.',
				de: 'Lade diese App herunter.'
			},
			{
				target: 'La batteria del mio telefono è quasi scarica.',
				en: 'My phone battery is almost empty.',
				de: 'Der Akku meines Handys ist fast leer.'
			},
			{
				target: 'Qual è la password?',
				en: 'What is the password?',
				de: 'Wie lautet das Passwort?'
			},
			{
				target: 'Ho caricato una foto nuova.',
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
		themeColor: '#588157',
		vocab: [
			{ target: "l'ambiente", en: 'environment', de: 'Umwelt' },
			{ target: "l'inquinamento", en: 'pollution', de: 'Verschmutzung' },
			{ target: 'riciclare', en: 'to recycle', de: 'recyceln' },
			{ target: 'la spazzatura', en: 'trash', de: 'Müll' },
			{ target: "l'energia", en: 'energy', de: 'Energie' },
			{ target: 'solare', en: 'solar', de: 'Solar' },
			{ target: 'il clima', en: 'climate', de: 'Klima' },
			{ target: 'il riscaldamento globale', en: 'global warming', de: 'Erderwärmung' },
			{ target: 'proteggere', en: 'to protect', de: 'schützen' },
			{ target: 'conservare', en: 'to conserve', de: 'bewahren' },
			{ target: 'la natura', en: 'nature', de: 'Natur' },
			{ target: 'le risorse', en: 'resources', de: 'Ressourcen' },
			{ target: 'rinnovabile', en: 'renewable', de: 'erneuerbar' },
			{ target: 'ecologico', en: 'ecological', de: 'ökologisch' },
			{ target: 'sostenibile', en: 'sustainable', de: 'nachhaltig' },
			{ target: 'la deforestazione', en: 'deforestation', de: 'Abholzung' },
			{ target: "l'estinzione", en: 'extinction', de: 'Aussterben' },
			{ target: 'la specie', en: 'species', de: 'Art' },
			{ target: 'il pericolo', en: 'danger', de: 'Gefahr' },
			{ target: 'il pianeta', en: 'planet', de: 'Planet' }
		],
		sentences: [
			{
				target: 'Dobbiamo riciclare di più.',
				en: 'We should recycle more.',
				de: 'Wir sollten mehr recyceln.'
			},
			{
				target: "L'inquinamento è un problema grave.",
				en: 'Pollution is a serious problem.',
				de: 'Verschmutzung ist ein ernstes Problem.'
			},
			{
				target: 'Il clima sta cambiando.',
				en: 'The climate is changing.',
				de: 'Das Klima verändert sich.'
			},
			{
				target: 'Bisogna proteggere il pianeta.',
				en: 'We must protect the planet.',
				de: 'Wir müssen den Planeten schützen.'
			},
			{
				target: 'Molte specie sono in pericolo.',
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
		themeColor: '#6A4C93',
		vocab: [
			{ target: 'il governo', en: 'government', de: 'Regierung' },
			{ target: 'la politica', en: 'politics', de: 'Politik' },
			{ target: "l'elezione", en: 'election', de: 'Wahl' },
			{ target: 'votare', en: 'to vote', de: 'wählen' },
			{ target: 'la democrazia', en: 'democracy', de: 'Demokratie' },
			{ target: 'la legge', en: 'law', de: 'Gesetz' },
			{ target: 'il diritto', en: 'right', de: 'Recht' },
			{ target: 'la libertà', en: 'freedom', de: 'Freiheit' },
			{ target: "l'uguaglianza", en: 'equality', de: 'Gleichheit' },
			{ target: 'la giustizia', en: 'justice', de: 'Gerechtigkeit' },
			{ target: 'il cittadino', en: 'citizen', de: 'Bürger' },
			{ target: 'il presidente', en: 'president', de: 'Präsident' },
			{ target: 'il partito', en: 'party', de: 'Partei' },
			{ target: 'il parlamento', en: 'parliament', de: 'Parlament' },
			{ target: 'la costituzione', en: 'constitution', de: 'Verfassung' },
			{ target: 'la protesta', en: 'protest', de: 'Protest' },
			{ target: 'la manifestazione', en: 'demonstration', de: 'Demonstration' },
			{ target: 'la riforma', en: 'reform', de: 'Reform' },
			{ target: 'la corruzione', en: 'corruption', de: 'Korruption' },
			{ target: "l'economia", en: 'economy', de: 'Wirtschaft' }
		],
		sentences: [
			{
				target: 'Le elezioni sono il mese prossimo.',
				en: 'Elections are next month.',
				de: 'Die Wahlen sind nächsten Monat.'
			},
			{
				target: 'Tutti abbiamo il diritto di votare.',
				en: 'We all have the right to vote.',
				de: 'Wir alle haben das Recht zu wählen.'
			},
			{
				target: 'Il governo ha annunciato nuove riforme.',
				en: 'The government announced new reforms.',
				de: 'Die Regierung hat neue Reformen angekündigt.'
			},
			{
				target: 'La democrazia è importante.',
				en: 'Democracy is important.',
				de: 'Demokratie ist wichtig.'
			},
			{
				target: "C'è una manifestazione in piazza.",
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
		themeColor: '#FF9F1C',
		vocab: [
			{ target: "l'impresa", en: 'business', de: 'Unternehmen' },
			{ target: "l'investimento", en: 'investment', de: 'Investition' },
			{ target: 'il mercato', en: 'market', de: 'Markt' },
			{ target: "l'azione", en: 'stock', de: 'Aktie' },
			{ target: 'il bilancio', en: 'budget', de: 'Budget' },
			{ target: 'il profitto', en: 'profit', de: 'Gewinn' },
			{ target: 'la perdita', en: 'loss', de: 'Verlust' },
			{ target: 'la tassa', en: 'tax', de: 'Steuer' },
			{ target: 'il prestito', en: 'loan', de: 'Kredit' },
			{ target: 'il debito', en: 'debt', de: 'Schulden' },
			{ target: 'il contratto', en: 'contract', de: 'Vertrag' },
			{ target: 'il socio', en: 'partner', de: 'Partner' },
			{ target: 'la concorrenza', en: 'competition', de: 'Wettbewerb' },
			{ target: 'la strategia', en: 'strategy', de: 'Strategie' },
			{ target: 'il marketing', en: 'marketing', de: 'Marketing' },
			{ target: 'il cliente', en: 'client', de: 'Kunde' },
			{ target: 'il fornitore', en: 'supplier', de: 'Lieferant' },
			{ target: 'il prodotto', en: 'product', de: 'Produkt' },
			{ target: 'il servizio', en: 'service', de: 'Dienstleistung' },
			{ target: 'il successo', en: 'success', de: 'Erfolg' }
		],
		sentences: [
			{
				target: "L'impresa sta crescendo.",
				en: 'The business is growing.',
				de: 'Das Unternehmen wächst.'
			},
			{
				target: 'Dobbiamo rivedere il bilancio.',
				en: 'We need to review the budget.',
				de: 'Wir müssen das Budget überprüfen.'
			},
			{
				target: "L'investimento è stato un successo.",
				en: 'The investment was successful.',
				de: 'Die Investition war erfolgreich.'
			},
			{
				target: 'Abbiamo firmato il contratto ieri.',
				en: 'We signed the contract yesterday.',
				de: 'Wir haben gestern den Vertrag unterschrieben.'
			},
			{
				target: 'La concorrenza è molto forte.',
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
		themeColor: '#1D3557',
		vocab: [
			{ target: "l'ipotesi", en: 'hypothesis', de: 'Hypothese' },
			{ target: "l'argomentazione", en: 'argument', de: 'Argumentation' },
			{ target: 'la conclusione', en: 'conclusion', de: 'Schlussfolgerung' },
			{ target: "l'analisi", en: 'analysis', de: 'Analyse' },
			{ target: 'la metodologia', en: 'methodology', de: 'Methodologie' },
			{ target: 'la ricerca', en: 'research', de: 'Forschung' },
			{ target: "l'evidenza", en: 'evidence', de: 'Beleg' },
			{ target: 'la teoria', en: 'theory', de: 'Theorie' },
			{ target: 'il riferimento', en: 'reference', de: 'Referenz' },
			{ target: 'citare', en: 'to cite', de: 'zitieren' },
			{ target: 'la fonte', en: 'source', de: 'Quelle' },
			{ target: 'oggettivo', en: 'objective', de: 'objektiv' },
			{ target: 'soggettivo', en: 'subjective', de: 'subjektiv' },
			{ target: 'la prospettiva', en: 'perspective', de: 'Perspektive' },
			{ target: 'il contesto', en: 'context', de: 'Kontext' },
			{ target: 'la sintesi', en: 'synthesis', de: 'Synthese' },
			{ target: 'la critica', en: 'critique', de: 'Kritik' },
			{ target: 'valutare', en: 'to evaluate', de: 'bewerten' },
			{ target: 'inferire', en: 'to infer', de: 'folgern' },
			{ target: 'implicare', en: 'to imply', de: 'implizieren' }
		],
		sentences: [
			{
				target: "L'ipotesi è stata confermata.",
				en: 'The hypothesis was confirmed.',
				de: 'Die Hypothese wurde bestätigt.'
			},
			{
				target: 'Secondo la ricerca...',
				en: 'According to the research...',
				de: 'Laut der Forschung...'
			},
			{
				target: "L'evidenza suggerisce che...",
				en: 'The evidence suggests that...',
				de: 'Die Belege deuten darauf hin, dass...'
			},
			{
				target: 'In conclusione, possiamo affermare che...',
				en: 'In conclusion, we can affirm that...',
				de: 'Abschließend können wir feststellen, dass...'
			},
			{
				target: 'È necessario analizzare il contesto.',
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
		themeColor: '#E07A5F',
		vocab: [
			{ target: 'in bocca al lupo', en: 'good luck', de: 'viel Glück' },
			{ target: 'essere al verde', en: 'to be broke', de: 'pleite sein' },
			{
				target: 'avere le mani bucate',
				en: 'to be a big spender',
				de: 'das Geld zum Fenster rauswerfen'
			},
			{
				target: 'prendere due piccioni con una fava',
				en: 'to kill two birds with one stone',
				de: 'zwei Fliegen mit einer Klappe schlagen'
			},
			{
				target: 'non avere peli sulla lingua',
				en: 'to speak bluntly',
				de: 'kein Blatt vor den Mund nehmen'
			},
			{ target: 'piove a catinelle', en: 'to rain cats and dogs', de: 'in Strömen regnen' },
			{ target: 'rompere il ghiaccio', en: 'to break the ice', de: 'das Eis brechen' },
			{
				target: 'avere la testa tra le nuvole',
				en: "to have one's head in the clouds",
				de: 'den Kopf in den Wolken haben'
			},
			{ target: 'essere in gamba', en: 'to be capable', de: 'fähig sein' },
			{ target: 'fare una figuraccia', en: 'to make a fool of oneself', de: 'sich blamieren' },
			{ target: 'acqua in bocca', en: 'keep it secret', de: 'kein Wort verraten' },
			{
				target: 'essere al settimo cielo',
				en: 'to be on cloud nine',
				de: 'im siebten Himmel sein'
			},
			{
				target: 'costare un occhio della testa',
				en: 'to cost an arm and a leg',
				de: 'ein Vermögen kosten'
			},
			{ target: "andare d'accordo", en: 'to get along', de: 'sich gut verstehen' },
			{ target: 'rimanere di sasso', en: 'to be stunned', de: 'wie versteinert sein' },
			{ target: 'tirare i remi in barca', en: 'to give up', de: 'die Ruder einziehen' },
			{ target: 'avere il dente avvelenato', en: 'to hold a grudge', de: 'nachtragend sein' },
			{
				target: 'fare orecchie da mercante',
				en: 'to turn a deaf ear',
				de: 'auf Durchzug schalten'
			},
			{
				target: 'mettere il dito nella piaga',
				en: 'to touch a sore spot',
				de: 'den Finger in die Wunde legen'
			},
			{ target: 'chiudere un occhio', en: 'to turn a blind eye', de: 'ein Auge zudrücken' }
		],
		sentences: [
			{
				target: "Per l'esame di domani, in bocca al lupo!",
				en: "Good luck for tomorrow's exam!",
				de: 'Viel Glück für die Prüfung morgen!'
			},
			{
				target: 'Dopo le vacanze sono al verde.',
				en: 'After the holidays I am broke.',
				de: 'Nach dem Urlaub bin ich pleite.'
			},
			{
				target: 'Con questo progetto prendiamo due piccioni con una fava.',
				en: 'With this project we kill two birds with one stone.',
				de: 'Mit diesem Projekt schlagen wir zwei Fliegen mit einer Klappe.'
			},
			{
				target: 'Quando ha sentito la notizia, è rimasto di sasso.',
				en: 'When he heard the news, he was stunned.',
				de: 'Als er die Nachricht hörte, war er wie versteinert.'
			},
			{
				target: 'Questo telefono costa un occhio della testa.',
				en: 'This phone costs an arm and a leg.',
				de: 'Dieses Handy kostet ein Vermögen.'
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
