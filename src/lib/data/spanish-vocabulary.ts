// Spanish vocabulary data organized by level and topic
// Each entry has Spanish word, English translation, German translation

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
		themeColor: '#58CC02',
		vocab: [
			{ target: 'hola', en: 'hello', de: 'hallo' },
			{ target: 'adiós', en: 'goodbye', de: 'auf Wiedersehen' },
			{ target: 'buenos días', en: 'good morning', de: 'guten Morgen' },
			{ target: 'buenas tardes', en: 'good afternoon', de: 'guten Tag' },
			{ target: 'buenas noches', en: 'good night', de: 'gute Nacht' },
			{ target: 'hasta luego', en: 'see you later', de: 'bis später' },
			{ target: 'hasta mañana', en: 'see you tomorrow', de: 'bis morgen' },
			{ target: 'por favor', en: 'please', de: 'bitte' },
			{ target: 'gracias', en: 'thank you', de: 'danke' },
			{ target: 'de nada', en: 'you are welcome', de: 'bitte schön' },
			{ target: 'perdón', en: 'sorry', de: 'Entschuldigung' },
			{ target: 'disculpe', en: 'excuse me', de: 'Verzeihung' },
			{ target: 'sí', en: 'yes', de: 'ja' },
			{ target: 'no', en: 'no', de: 'nein' },
			{ target: 'yo', en: 'I', de: 'ich' },
			{ target: 'tú', en: 'you', de: 'du' },
			{ target: 'usted', en: 'you (formal)', de: 'Sie' },
			{ target: 'señor', en: 'mister', de: 'Herr' },
			{ target: 'señora', en: 'mrs', de: 'Frau' },
			{ target: 'señorita', en: 'miss', de: 'Fräulein' }
		],
		sentences: [
			{ target: 'Hola, ¿cómo estás?', en: 'Hello, how are you?', de: 'Hallo, wie geht es dir?' },
			{ target: 'Me llamo Juan.', en: 'My name is Juan.', de: 'Ich heiße Juan.' },
			{ target: 'Mucho gusto.', en: 'Nice to meet you.', de: 'Freut mich.' },
			{ target: '¿Cómo te llamas?', en: 'What is your name?', de: 'Wie heißt du?' },
			{ target: 'Buenos días, señor.', en: 'Good morning, sir.', de: 'Guten Morgen, mein Herr.' }
		]
	},
	{
		titleEn: 'Numbers 1-100',
		titleDe: 'Zahlen 1-100',
		descriptionEn: 'Learn to count and use numbers in Spanish',
		descriptionDe: 'Lerne auf Spanisch zu zählen und Zahlen zu benutzen',
		themeColor: '#1CB0F6',
		vocab: [
			{ target: 'uno', en: 'one', de: 'eins' },
			{ target: 'dos', en: 'two', de: 'zwei' },
			{ target: 'tres', en: 'three', de: 'drei' },
			{ target: 'cuatro', en: 'four', de: 'vier' },
			{ target: 'cinco', en: 'five', de: 'fünf' },
			{ target: 'seis', en: 'six', de: 'sechs' },
			{ target: 'siete', en: 'seven', de: 'sieben' },
			{ target: 'ocho', en: 'eight', de: 'acht' },
			{ target: 'nueve', en: 'nine', de: 'neun' },
			{ target: 'diez', en: 'ten', de: 'zehn' },
			{ target: 'once', en: 'eleven', de: 'elf' },
			{ target: 'doce', en: 'twelve', de: 'zwölf' },
			{ target: 'veinte', en: 'twenty', de: 'zwanzig' },
			{ target: 'treinta', en: 'thirty', de: 'dreißig' },
			{ target: 'cuarenta', en: 'forty', de: 'vierzig' },
			{ target: 'cincuenta', en: 'fifty', de: 'fünfzig' },
			{ target: 'cien', en: 'one hundred', de: 'hundert' },
			{ target: 'primero', en: 'first', de: 'erste' },
			{ target: 'segundo', en: 'second', de: 'zweite' },
			{ target: 'tercero', en: 'third', de: 'dritte' }
		],
		sentences: [
			{
				target: 'Tengo tres hermanos.',
				en: 'I have three siblings.',
				de: 'Ich habe drei Geschwister.'
			},
			{ target: '¿Cuántos años tienes?', en: 'How old are you?', de: 'Wie alt bist du?' },
			{ target: 'Son las cinco.', en: 'It is five o clock.', de: 'Es ist fünf Uhr.' },
			{ target: 'Hay diez manzanas.', en: 'There are ten apples.', de: 'Es gibt zehn Äpfel.' },
			{ target: 'El número es veinte.', en: 'The number is twenty.', de: 'Die Zahl ist zwanzig.' }
		]
	},
	{
		titleEn: 'Family',
		titleDe: 'Familie',
		descriptionEn: 'Talk about your family members',
		descriptionDe: 'Sprich über deine Familienmitglieder',
		themeColor: '#CE82FF',
		vocab: [
			{ target: 'familia', en: 'family', de: 'Familie' },
			{ target: 'madre', en: 'mother', de: 'Mutter' },
			{ target: 'padre', en: 'father', de: 'Vater' },
			{ target: 'hermano', en: 'brother', de: 'Bruder' },
			{ target: 'hermana', en: 'sister', de: 'Schwester' },
			{ target: 'hijo', en: 'son', de: 'Sohn' },
			{ target: 'hija', en: 'daughter', de: 'Tochter' },
			{ target: 'abuelo', en: 'grandfather', de: 'Großvater' },
			{ target: 'abuela', en: 'grandmother', de: 'Großmutter' },
			{ target: 'tío', en: 'uncle', de: 'Onkel' },
			{ target: 'tía', en: 'aunt', de: 'Tante' },
			{ target: 'primo', en: 'cousin (male)', de: 'Cousin' },
			{ target: 'prima', en: 'cousin (female)', de: 'Cousine' },
			{ target: 'esposo', en: 'husband', de: 'Ehemann' },
			{ target: 'esposa', en: 'wife', de: 'Ehefrau' },
			{ target: 'niño', en: 'child (boy)', de: 'Junge' },
			{ target: 'niña', en: 'child (girl)', de: 'Mädchen' },
			{ target: 'bebé', en: 'baby', de: 'Baby' },
			{ target: 'padres', en: 'parents', de: 'Eltern' },
			{ target: 'hijos', en: 'children', de: 'Kinder' }
		],
		sentences: [
			{
				target: 'Mi madre es doctora.',
				en: 'My mother is a doctor.',
				de: 'Meine Mutter ist Ärztin.'
			},
			{ target: 'Tengo dos hermanas.', en: 'I have two sisters.', de: 'Ich habe zwei Schwestern.' },
			{ target: 'Mi familia es grande.', en: 'My family is big.', de: 'Meine Familie ist groß.' },
			{
				target: 'El abuelo está en casa.',
				en: 'Grandfather is at home.',
				de: 'Der Großvater ist zu Hause.'
			},
			{ target: 'Ella es mi tía.', en: 'She is my aunt.', de: 'Sie ist meine Tante.' }
		]
	},
	{
		titleEn: 'Colors',
		titleDe: 'Farben',
		descriptionEn: 'Learn the colors in Spanish',
		descriptionDe: 'Lerne die Farben auf Spanisch',
		themeColor: '#FF9600',
		vocab: [
			{ target: 'rojo', en: 'red', de: 'rot' },
			{ target: 'azul', en: 'blue', de: 'blau' },
			{ target: 'verde', en: 'green', de: 'grün' },
			{ target: 'amarillo', en: 'yellow', de: 'gelb' },
			{ target: 'naranja', en: 'orange', de: 'orange' },
			{ target: 'morado', en: 'purple', de: 'lila' },
			{ target: 'rosa', en: 'pink', de: 'rosa' },
			{ target: 'negro', en: 'black', de: 'schwarz' },
			{ target: 'blanco', en: 'white', de: 'weiß' },
			{ target: 'gris', en: 'gray', de: 'grau' },
			{ target: 'marrón', en: 'brown', de: 'braun' },
			{ target: 'dorado', en: 'golden', de: 'golden' },
			{ target: 'plateado', en: 'silver', de: 'silbern' },
			{ target: 'claro', en: 'light', de: 'hell' },
			{ target: 'oscuro', en: 'dark', de: 'dunkel' },
			{ target: 'color', en: 'color', de: 'Farbe' },
			{ target: 'colorido', en: 'colorful', de: 'bunt' },
			{ target: 'brillante', en: 'bright', de: 'leuchtend' },
			{ target: 'pálido', en: 'pale', de: 'blass' },
			{ target: 'vivo', en: 'vivid', de: 'lebhaft' }
		],
		sentences: [
			{ target: 'El cielo es azul.', en: 'The sky is blue.', de: 'Der Himmel ist blau.' },
			{ target: 'La manzana es roja.', en: 'The apple is red.', de: 'Der Apfel ist rot.' },
			{ target: 'Mi carro es negro.', en: 'My car is black.', de: 'Mein Auto ist schwarz.' },
			{
				target: 'Las flores son amarillas.',
				en: 'The flowers are yellow.',
				de: 'Die Blumen sind gelb.'
			},
			{ target: '¿De qué color es?', en: 'What color is it?', de: 'Welche Farbe hat es?' }
		]
	},
	{
		titleEn: 'Food & Drink',
		titleDe: 'Essen & Trinken',
		descriptionEn: 'Order food and describe meals',
		descriptionDe: 'Bestelle Essen und beschreibe Mahlzeiten',
		themeColor: '#FF4B4B',
		vocab: [
			{ target: 'agua', en: 'water', de: 'Wasser' },
			{ target: 'pan', en: 'bread', de: 'Brot' },
			{ target: 'leche', en: 'milk', de: 'Milch' },
			{ target: 'café', en: 'coffee', de: 'Kaffee' },
			{ target: 'té', en: 'tea', de: 'Tee' },
			{ target: 'jugo', en: 'juice', de: 'Saft' },
			{ target: 'carne', en: 'meat', de: 'Fleisch' },
			{ target: 'pollo', en: 'chicken', de: 'Hähnchen' },
			{ target: 'pescado', en: 'fish', de: 'Fisch' },
			{ target: 'arroz', en: 'rice', de: 'Reis' },
			{ target: 'huevo', en: 'egg', de: 'Ei' },
			{ target: 'queso', en: 'cheese', de: 'Käse' },
			{ target: 'fruta', en: 'fruit', de: 'Obst' },
			{ target: 'manzana', en: 'apple', de: 'Apfel' },
			{ target: 'naranja', en: 'orange', de: 'Orange' },
			{ target: 'plátano', en: 'banana', de: 'Banane' },
			{ target: 'verdura', en: 'vegetable', de: 'Gemüse' },
			{ target: 'ensalada', en: 'salad', de: 'Salat' },
			{ target: 'sopa', en: 'soup', de: 'Suppe' },
			{ target: 'postre', en: 'dessert', de: 'Nachtisch' }
		],
		sentences: [
			{
				target: 'Quiero agua, por favor.',
				en: 'I want water, please.',
				de: 'Ich möchte Wasser, bitte.'
			},
			{
				target: 'El desayuno está listo.',
				en: 'Breakfast is ready.',
				de: 'Das Frühstück ist fertig.'
			},
			{ target: 'Me gusta el pollo.', en: 'I like chicken.', de: 'Ich mag Hähnchen.' },
			{
				target: '¿Qué quieres comer?',
				en: 'What do you want to eat?',
				de: 'Was möchtest du essen?'
			},
			{ target: 'La sopa está caliente.', en: 'The soup is hot.', de: 'Die Suppe ist heiß.' }
		]
	},
	{
		titleEn: 'Days & Time',
		titleDe: 'Tage & Zeit',
		descriptionEn: 'Learn days of the week and tell time',
		descriptionDe: 'Lerne die Wochentage und die Uhrzeit',
		themeColor: '#00CD9C',
		vocab: [
			{ target: 'lunes', en: 'Monday', de: 'Montag' },
			{ target: 'martes', en: 'Tuesday', de: 'Dienstag' },
			{ target: 'miércoles', en: 'Wednesday', de: 'Mittwoch' },
			{ target: 'jueves', en: 'Thursday', de: 'Donnerstag' },
			{ target: 'viernes', en: 'Friday', de: 'Freitag' },
			{ target: 'sábado', en: 'Saturday', de: 'Samstag' },
			{ target: 'domingo', en: 'Sunday', de: 'Sonntag' },
			{ target: 'semana', en: 'week', de: 'Woche' },
			{ target: 'mes', en: 'month', de: 'Monat' },
			{ target: 'año', en: 'year', de: 'Jahr' },
			{ target: 'hoy', en: 'today', de: 'heute' },
			{ target: 'mañana', en: 'tomorrow', de: 'morgen' },
			{ target: 'ayer', en: 'yesterday', de: 'gestern' },
			{ target: 'hora', en: 'hour', de: 'Stunde' },
			{ target: 'minuto', en: 'minute', de: 'Minute' },
			{ target: 'segundo', en: 'second', de: 'Sekunde' },
			{ target: 'mediodía', en: 'noon', de: 'Mittag' },
			{ target: 'medianoche', en: 'midnight', de: 'Mitternacht' },
			{ target: 'temprano', en: 'early', de: 'früh' },
			{ target: 'tarde', en: 'late', de: 'spät' }
		],
		sentences: [
			{ target: 'Hoy es lunes.', en: 'Today is Monday.', de: 'Heute ist Montag.' },
			{ target: '¿Qué hora es?', en: 'What time is it?', de: 'Wie spät ist es?' },
			{ target: 'Son las tres.', en: 'It is three o clock.', de: 'Es ist drei Uhr.' },
			{ target: 'Mañana es viernes.', en: 'Tomorrow is Friday.', de: 'Morgen ist Freitag.' },
			{
				target: 'La semana tiene siete días.',
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
		themeColor: '#FF86D0',
		vocab: [
			{ target: 'cabeza', en: 'head', de: 'Kopf' },
			{ target: 'ojo', en: 'eye', de: 'Auge' },
			{ target: 'oreja', en: 'ear', de: 'Ohr' },
			{ target: 'nariz', en: 'nose', de: 'Nase' },
			{ target: 'boca', en: 'mouth', de: 'Mund' },
			{ target: 'diente', en: 'tooth', de: 'Zahn' },
			{ target: 'lengua', en: 'tongue', de: 'Zunge' },
			{ target: 'cuello', en: 'neck', de: 'Hals' },
			{ target: 'brazo', en: 'arm', de: 'Arm' },
			{ target: 'mano', en: 'hand', de: 'Hand' },
			{ target: 'dedo', en: 'finger', de: 'Finger' },
			{ target: 'pierna', en: 'leg', de: 'Bein' },
			{ target: 'pie', en: 'foot', de: 'Fuß' },
			{ target: 'espalda', en: 'back', de: 'Rücken' },
			{ target: 'pecho', en: 'chest', de: 'Brust' },
			{ target: 'estómago', en: 'stomach', de: 'Magen' },
			{ target: 'corazón', en: 'heart', de: 'Herz' },
			{ target: 'pelo', en: 'hair', de: 'Haar' },
			{ target: 'cara', en: 'face', de: 'Gesicht' },
			{ target: 'cuerpo', en: 'body', de: 'Körper' }
		],
		sentences: [
			{ target: 'Me duele la cabeza.', en: 'My head hurts.', de: 'Mir tut der Kopf weh.' },
			{ target: 'Tengo dos ojos.', en: 'I have two eyes.', de: 'Ich habe zwei Augen.' },
			{ target: 'Ella tiene pelo largo.', en: 'She has long hair.', de: 'Sie hat lange Haare.' },
			{ target: 'Lávate las manos.', en: 'Wash your hands.', de: 'Wasch dir die Hände.' },
			{
				target: 'El corazón late rápido.',
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
		themeColor: '#9069FF',
		vocab: [
			{ target: 'camisa', en: 'shirt', de: 'Hemd' },
			{ target: 'pantalón', en: 'pants', de: 'Hose' },
			{ target: 'vestido', en: 'dress', de: 'Kleid' },
			{ target: 'falda', en: 'skirt', de: 'Rock' },
			{ target: 'zapatos', en: 'shoes', de: 'Schuhe' },
			{ target: 'calcetines', en: 'socks', de: 'Socken' },
			{ target: 'chaqueta', en: 'jacket', de: 'Jacke' },
			{ target: 'abrigo', en: 'coat', de: 'Mantel' },
			{ target: 'sombrero', en: 'hat', de: 'Hut' },
			{ target: 'gorra', en: 'cap', de: 'Mütze' },
			{ target: 'bufanda', en: 'scarf', de: 'Schal' },
			{ target: 'guantes', en: 'gloves', de: 'Handschuhe' },
			{ target: 'cinturón', en: 'belt', de: 'Gürtel' },
			{ target: 'corbata', en: 'tie', de: 'Krawatte' },
			{ target: 'bolso', en: 'bag', de: 'Tasche' },
			{ target: 'ropa', en: 'clothes', de: 'Kleidung' },
			{ target: 'camiseta', en: 't-shirt', de: 'T-Shirt' },
			{ target: 'jeans', en: 'jeans', de: 'Jeans' },
			{ target: 'botas', en: 'boots', de: 'Stiefel' },
			{ target: 'pijama', en: 'pajamas', de: 'Schlafanzug' }
		],
		sentences: [
			{
				target: 'Ella lleva un vestido rojo.',
				en: 'She wears a red dress.',
				de: 'Sie trägt ein rotes Kleid.'
			},
			{
				target: 'Necesito comprar zapatos.',
				en: 'I need to buy shoes.',
				de: 'Ich muss Schuhe kaufen.'
			},
			{
				target: 'Hace frío, ponte la chaqueta.',
				en: 'It is cold, put on your jacket.',
				de: 'Es ist kalt, zieh deine Jacke an.'
			},
			{ target: '¿Dónde está mi camisa?', en: 'Where is my shirt?', de: 'Wo ist mein Hemd?' },
			{
				target: 'Los calcetines son blancos.',
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
		themeColor: '#4B87FF',
		vocab: [
			{ target: 'casa', en: 'house', de: 'Haus' },
			{ target: 'apartamento', en: 'apartment', de: 'Wohnung' },
			{ target: 'habitación', en: 'room', de: 'Zimmer' },
			{ target: 'cocina', en: 'kitchen', de: 'Küche' },
			{ target: 'baño', en: 'bathroom', de: 'Badezimmer' },
			{ target: 'dormitorio', en: 'bedroom', de: 'Schlafzimmer' },
			{ target: 'sala', en: 'living room', de: 'Wohnzimmer' },
			{ target: 'comedor', en: 'dining room', de: 'Esszimmer' },
			{ target: 'puerta', en: 'door', de: 'Tür' },
			{ target: 'ventana', en: 'window', de: 'Fenster' },
			{ target: 'mesa', en: 'table', de: 'Tisch' },
			{ target: 'silla', en: 'chair', de: 'Stuhl' },
			{ target: 'cama', en: 'bed', de: 'Bett' },
			{ target: 'sofá', en: 'sofa', de: 'Sofa' },
			{ target: 'lámpara', en: 'lamp', de: 'Lampe' },
			{ target: 'espejo', en: 'mirror', de: 'Spiegel' },
			{ target: 'escalera', en: 'stairs', de: 'Treppe' },
			{ target: 'jardín', en: 'garden', de: 'Garten' },
			{ target: 'garaje', en: 'garage', de: 'Garage' },
			{ target: 'techo', en: 'roof', de: 'Dach' }
		],
		sentences: [
			{ target: 'Mi casa es grande.', en: 'My house is big.', de: 'Mein Haus ist groß.' },
			{
				target: 'La cocina está limpia.',
				en: 'The kitchen is clean.',
				de: 'Die Küche ist sauber.'
			},
			{
				target: 'Hay una mesa en el comedor.',
				en: 'There is a table in the dining room.',
				de: 'Es gibt einen Tisch im Esszimmer.'
			},
			{ target: 'Duermo en mi cama.', en: 'I sleep in my bed.', de: 'Ich schlafe in meinem Bett.' },
			{
				target: 'El jardín tiene flores.',
				en: 'The garden has flowers.',
				de: 'Der Garten hat Blumen.'
			}
		]
	},
	{
		titleEn: 'Common Verbs',
		titleDe: 'Häufige Verben',
		descriptionEn: 'Learn essential action words',
		descriptionDe: 'Lerne wichtige Tätigkeitswörter',
		themeColor: '#FF6B6B',
		vocab: [
			{ target: 'ser', en: 'to be', de: 'sein' },
			{ target: 'estar', en: 'to be', de: 'sein' },
			{ target: 'tener', en: 'to have', de: 'haben' },
			{ target: 'hacer', en: 'to do/make', de: 'machen' },
			{ target: 'ir', en: 'to go', de: 'gehen' },
			{ target: 'venir', en: 'to come', de: 'kommen' },
			{ target: 'ver', en: 'to see', de: 'sehen' },
			{ target: 'dar', en: 'to give', de: 'geben' },
			{ target: 'saber', en: 'to know', de: 'wissen' },
			{ target: 'poder', en: 'can/to be able', de: 'können' },
			{ target: 'querer', en: 'to want', de: 'wollen' },
			{ target: 'decir', en: 'to say', de: 'sagen' },
			{ target: 'hablar', en: 'to speak', de: 'sprechen' },
			{ target: 'comer', en: 'to eat', de: 'essen' },
			{ target: 'beber', en: 'to drink', de: 'trinken' },
			{ target: 'dormir', en: 'to sleep', de: 'schlafen' },
			{ target: 'vivir', en: 'to live', de: 'leben' },
			{ target: 'trabajar', en: 'to work', de: 'arbeiten' },
			{ target: 'estudiar', en: 'to study', de: 'studieren' },
			{ target: 'jugar', en: 'to play', de: 'spielen' }
		],
		sentences: [
			{ target: 'Yo soy estudiante.', en: 'I am a student.', de: 'Ich bin Student.' },
			{ target: 'Ella tiene un perro.', en: 'She has a dog.', de: 'Sie hat einen Hund.' },
			{
				target: 'Nosotros vamos al parque.',
				en: 'We go to the park.',
				de: 'Wir gehen in den Park.'
			},
			{
				target: 'Quiero aprender español.',
				en: 'I want to learn Spanish.',
				de: 'Ich möchte Spanisch lernen.'
			},
			{ target: 'Ellos trabajan mucho.', en: 'They work a lot.', de: 'Sie arbeiten viel.' }
		]
	}
];

export const A2_UNITS: UnitVocab[] = [
	{
		titleEn: 'Weather & Seasons',
		titleDe: 'Wetter & Jahreszeiten',
		descriptionEn: 'Talk about the weather and seasons',
		descriptionDe: 'Sprich über das Wetter und die Jahreszeiten',
		themeColor: '#00BCD4',
		vocab: [
			{ target: 'tiempo', en: 'weather', de: 'Wetter' },
			{ target: 'sol', en: 'sun', de: 'Sonne' },
			{ target: 'lluvia', en: 'rain', de: 'Regen' },
			{ target: 'nieve', en: 'snow', de: 'Schnee' },
			{ target: 'viento', en: 'wind', de: 'Wind' },
			{ target: 'nube', en: 'cloud', de: 'Wolke' },
			{ target: 'tormenta', en: 'storm', de: 'Sturm' },
			{ target: 'calor', en: 'heat', de: 'Hitze' },
			{ target: 'frío', en: 'cold', de: 'Kälte' },
			{ target: 'primavera', en: 'spring', de: 'Frühling' },
			{ target: 'verano', en: 'summer', de: 'Sommer' },
			{ target: 'otoño', en: 'autumn', de: 'Herbst' },
			{ target: 'invierno', en: 'winter', de: 'Winter' },
			{ target: 'temperatura', en: 'temperature', de: 'Temperatur' },
			{ target: 'grado', en: 'degree', de: 'Grad' },
			{ target: 'húmedo', en: 'humid', de: 'feucht' },
			{ target: 'seco', en: 'dry', de: 'trocken' },
			{ target: 'nublado', en: 'cloudy', de: 'bewölkt' },
			{ target: 'soleado', en: 'sunny', de: 'sonnig' },
			{ target: 'lluvioso', en: 'rainy', de: 'regnerisch' }
		],
		sentences: [
			{ target: 'Hoy hace calor.', en: 'It is hot today.', de: 'Heute ist es heiß.' },
			{ target: 'Está lloviendo.', en: 'It is raining.', de: 'Es regnet.' },
			{ target: 'El invierno es frío.', en: 'Winter is cold.', de: 'Der Winter ist kalt.' },
			{ target: '¿Qué tiempo hace?', en: 'What is the weather like?', de: 'Wie ist das Wetter?' },
			{ target: 'Me gusta la primavera.', en: 'I like spring.', de: 'Ich mag den Frühling.' }
		]
	},
	{
		titleEn: 'Travel & Transport',
		titleDe: 'Reisen & Verkehr',
		descriptionEn: 'Learn vocabulary for traveling',
		descriptionDe: 'Lerne Vokabeln zum Reisen',
		themeColor: '#FF5722',
		vocab: [
			{ target: 'avión', en: 'airplane', de: 'Flugzeug' },
			{ target: 'tren', en: 'train', de: 'Zug' },
			{ target: 'autobús', en: 'bus', de: 'Bus' },
			{ target: 'carro', en: 'car', de: 'Auto' },
			{ target: 'bicicleta', en: 'bicycle', de: 'Fahrrad' },
			{ target: 'barco', en: 'boat', de: 'Boot' },
			{ target: 'taxi', en: 'taxi', de: 'Taxi' },
			{ target: 'metro', en: 'subway', de: 'U-Bahn' },
			{ target: 'aeropuerto', en: 'airport', de: 'Flughafen' },
			{ target: 'estación', en: 'station', de: 'Bahnhof' },
			{ target: 'boleto', en: 'ticket', de: 'Fahrkarte' },
			{ target: 'pasaporte', en: 'passport', de: 'Reisepass' },
			{ target: 'maleta', en: 'suitcase', de: 'Koffer' },
			{ target: 'viaje', en: 'trip', de: 'Reise' },
			{ target: 'destino', en: 'destination', de: 'Ziel' },
			{ target: 'llegada', en: 'arrival', de: 'Ankunft' },
			{ target: 'salida', en: 'departure', de: 'Abfahrt' },
			{ target: 'equipaje', en: 'luggage', de: 'Gepäck' },
			{ target: 'reservación', en: 'reservation', de: 'Reservierung' },
			{ target: 'turista', en: 'tourist', de: 'Tourist' }
		],
		sentences: [
			{
				target: 'El tren sale a las ocho.',
				en: 'The train leaves at eight.',
				de: 'Der Zug fährt um acht ab.'
			},
			{ target: 'Necesito un boleto.', en: 'I need a ticket.', de: 'Ich brauche eine Fahrkarte.' },
			{
				target: 'El aeropuerto está lejos.',
				en: 'The airport is far.',
				de: 'Der Flughafen ist weit weg.'
			},
			{
				target: '¿Dónde está la estación?',
				en: 'Where is the station?',
				de: 'Wo ist der Bahnhof?'
			},
			{ target: 'Viajo en avión.', en: 'I travel by plane.', de: 'Ich reise mit dem Flugzeug.' }
		]
	},
	{
		titleEn: 'Shopping',
		titleDe: 'Einkaufen',
		descriptionEn: 'Learn to shop and talk about prices',
		descriptionDe: 'Lerne einzukaufen und über Preise zu sprechen',
		themeColor: '#E91E63',
		vocab: [
			{ target: 'tienda', en: 'store', de: 'Geschäft' },
			{ target: 'mercado', en: 'market', de: 'Markt' },
			{ target: 'precio', en: 'price', de: 'Preis' },
			{ target: 'dinero', en: 'money', de: 'Geld' },
			{ target: 'tarjeta', en: 'card', de: 'Karte' },
			{ target: 'efectivo', en: 'cash', de: 'Bargeld' },
			{ target: 'cuenta', en: 'bill', de: 'Rechnung' },
			{ target: 'cambio', en: 'change', de: 'Wechselgeld' },
			{ target: 'descuento', en: 'discount', de: 'Rabatt' },
			{ target: 'oferta', en: 'sale', de: 'Angebot' },
			{ target: 'barato', en: 'cheap', de: 'billig' },
			{ target: 'caro', en: 'expensive', de: 'teuer' },
			{ target: 'comprar', en: 'to buy', de: 'kaufen' },
			{ target: 'vender', en: 'to sell', de: 'verkaufen' },
			{ target: 'pagar', en: 'to pay', de: 'bezahlen' },
			{ target: 'cliente', en: 'customer', de: 'Kunde' },
			{ target: 'vendedor', en: 'salesperson', de: 'Verkäufer' },
			{ target: 'recibo', en: 'receipt', de: 'Quittung' },
			{ target: 'caja', en: 'cashier', de: 'Kasse' },
			{ target: 'bolsa', en: 'bag', de: 'Tüte' }
		],
		sentences: [
			{ target: '¿Cuánto cuesta?', en: 'How much does it cost?', de: 'Wie viel kostet das?' },
			{ target: 'Es muy caro.', en: 'It is very expensive.', de: 'Es ist sehr teuer.' },
			{ target: '¿Aceptan tarjeta?', en: 'Do you accept cards?', de: 'Akzeptieren Sie Karten?' },
			{ target: 'Quiero comprar esto.', en: 'I want to buy this.', de: 'Ich möchte das kaufen.' },
			{
				target: 'Hay un descuento del veinte por ciento.',
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
		themeColor: '#4CAF50',
		vocab: [
			{ target: 'médico', en: 'doctor', de: 'Arzt' },
			{ target: 'hospital', en: 'hospital', de: 'Krankenhaus' },
			{ target: 'enfermera', en: 'nurse', de: 'Krankenschwester' },
			{ target: 'medicina', en: 'medicine', de: 'Medizin' },
			{ target: 'enfermo', en: 'sick', de: 'krank' },
			{ target: 'sano', en: 'healthy', de: 'gesund' },
			{ target: 'dolor', en: 'pain', de: 'Schmerz' },
			{ target: 'fiebre', en: 'fever', de: 'Fieber' },
			{ target: 'gripe', en: 'flu', de: 'Grippe' },
			{ target: 'tos', en: 'cough', de: 'Husten' },
			{ target: 'resfriado', en: 'cold', de: 'Erkältung' },
			{ target: 'alergia', en: 'allergy', de: 'Allergie' },
			{ target: 'cita', en: 'appointment', de: 'Termin' },
			{ target: 'receta', en: 'prescription', de: 'Rezept' },
			{ target: 'pastilla', en: 'pill', de: 'Tablette' },
			{ target: 'farmacia', en: 'pharmacy', de: 'Apotheke' },
			{ target: 'emergencia', en: 'emergency', de: 'Notfall' },
			{ target: 'ambulancia', en: 'ambulance', de: 'Krankenwagen' },
			{ target: 'sangre', en: 'blood', de: 'Blut' },
			{ target: 'herida', en: 'wound', de: 'Wunde' }
		],
		sentences: [
			{ target: 'Me siento enfermo.', en: 'I feel sick.', de: 'Ich fühle mich krank.' },
			{
				target: 'Necesito ver al médico.',
				en: 'I need to see the doctor.',
				de: 'Ich muss zum Arzt.'
			},
			{ target: 'Tengo dolor de cabeza.', en: 'I have a headache.', de: 'Ich habe Kopfschmerzen.' },
			{
				target: '¿Dónde está la farmacia?',
				en: 'Where is the pharmacy?',
				de: 'Wo ist die Apotheke?'
			},
			{ target: 'Toma esta medicina.', en: 'Take this medicine.', de: 'Nimm diese Medizin.' }
		]
	},
	{
		titleEn: 'Work & Professions',
		titleDe: 'Arbeit & Berufe',
		descriptionEn: 'Learn about jobs and the workplace',
		descriptionDe: 'Lerne über Berufe und den Arbeitsplatz',
		themeColor: '#795548',
		vocab: [
			{ target: 'trabajo', en: 'work/job', de: 'Arbeit' },
			{ target: 'oficina', en: 'office', de: 'Büro' },
			{ target: 'jefe', en: 'boss', de: 'Chef' },
			{ target: 'empleado', en: 'employee', de: 'Angestellter' },
			{ target: 'profesor', en: 'teacher', de: 'Lehrer' },
			{ target: 'abogado', en: 'lawyer', de: 'Anwalt' },
			{ target: 'ingeniero', en: 'engineer', de: 'Ingenieur' },
			{ target: 'cocinero', en: 'cook', de: 'Koch' },
			{ target: 'policía', en: 'police', de: 'Polizist' },
			{ target: 'bombero', en: 'firefighter', de: 'Feuerwehrmann' },
			{ target: 'escritor', en: 'writer', de: 'Schriftsteller' },
			{ target: 'artista', en: 'artist', de: 'Künstler' },
			{ target: 'músico', en: 'musician', de: 'Musiker' },
			{ target: 'salario', en: 'salary', de: 'Gehalt' },
			{ target: 'reunión', en: 'meeting', de: 'Besprechung' },
			{ target: 'computadora', en: 'computer', de: 'Computer' },
			{ target: 'correo', en: 'email', de: 'E-Mail' },
			{ target: 'proyecto', en: 'project', de: 'Projekt' },
			{ target: 'empresa', en: 'company', de: 'Unternehmen' },
			{ target: 'carrera', en: 'career', de: 'Karriere' }
		],
		sentences: [
			{
				target: 'Trabajo en una oficina.',
				en: 'I work in an office.',
				de: 'Ich arbeite in einem Büro.'
			},
			{
				target: 'Mi hermano es ingeniero.',
				en: 'My brother is an engineer.',
				de: 'Mein Bruder ist Ingenieur.'
			},
			{
				target: 'Tengo una reunión mañana.',
				en: 'I have a meeting tomorrow.',
				de: 'Ich habe morgen eine Besprechung.'
			},
			{
				target: '¿Cuál es tu profesión?',
				en: 'What is your profession?',
				de: 'Was ist dein Beruf?'
			},
			{ target: 'El jefe está ocupado.', en: 'The boss is busy.', de: 'Der Chef ist beschäftigt.' }
		]
	},
	{
		titleEn: 'Education',
		titleDe: 'Bildung',
		descriptionEn: 'School and learning vocabulary',
		descriptionDe: 'Schul- und Lernvokabular',
		themeColor: '#3F51B5',
		vocab: [
			{ target: 'escuela', en: 'school', de: 'Schule' },
			{ target: 'universidad', en: 'university', de: 'Universität' },
			{ target: 'clase', en: 'class', de: 'Klasse' },
			{ target: 'estudiante', en: 'student', de: 'Student' },
			{ target: 'maestro', en: 'teacher', de: 'Lehrer' },
			{ target: 'libro', en: 'book', de: 'Buch' },
			{ target: 'cuaderno', en: 'notebook', de: 'Heft' },
			{ target: 'lápiz', en: 'pencil', de: 'Bleistift' },
			{ target: 'bolígrafo', en: 'pen', de: 'Kugelschreiber' },
			{ target: 'examen', en: 'exam', de: 'Prüfung' },
			{ target: 'tarea', en: 'homework', de: 'Hausaufgaben' },
			{ target: 'nota', en: 'grade', de: 'Note' },
			{ target: 'pizarra', en: 'blackboard', de: 'Tafel' },
			{ target: 'biblioteca', en: 'library', de: 'Bibliothek' },
			{ target: 'idioma', en: 'language', de: 'Sprache' },
			{ target: 'matemáticas', en: 'mathematics', de: 'Mathematik' },
			{ target: 'ciencia', en: 'science', de: 'Wissenschaft' },
			{ target: 'historia', en: 'history', de: 'Geschichte' },
			{ target: 'geografía', en: 'geography', de: 'Geografie' },
			{ target: 'arte', en: 'art', de: 'Kunst' }
		],
		sentences: [
			{ target: 'Estudio español.', en: 'I study Spanish.', de: 'Ich lerne Spanisch.' },
			{
				target: 'La clase empieza a las nueve.',
				en: 'The class starts at nine.',
				de: 'Der Unterricht beginnt um neun.'
			},
			{
				target: 'Tengo mucha tarea.',
				en: 'I have a lot of homework.',
				de: 'Ich habe viele Hausaufgaben.'
			},
			{
				target: '¿Dónde está la biblioteca?',
				en: 'Where is the library?',
				de: 'Wo ist die Bibliothek?'
			},
			{
				target: 'El examen es difícil.',
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
		themeColor: '#009688',
		vocab: [
			{ target: 'deporte', en: 'sport', de: 'Sport' },
			{ target: 'fútbol', en: 'soccer', de: 'Fußball' },
			{ target: 'baloncesto', en: 'basketball', de: 'Basketball' },
			{ target: 'tenis', en: 'tennis', de: 'Tennis' },
			{ target: 'natación', en: 'swimming', de: 'Schwimmen' },
			{ target: 'correr', en: 'to run', de: 'laufen' },
			{ target: 'caminar', en: 'to walk', de: 'gehen' },
			{ target: 'equipo', en: 'team', de: 'Mannschaft' },
			{ target: 'pelota', en: 'ball', de: 'Ball' },
			{ target: 'partido', en: 'game/match', de: 'Spiel' },
			{ target: 'ganar', en: 'to win', de: 'gewinnen' },
			{ target: 'perder', en: 'to lose', de: 'verlieren' },
			{ target: 'música', en: 'music', de: 'Musik' },
			{ target: 'película', en: 'movie', de: 'Film' },
			{ target: 'leer', en: 'to read', de: 'lesen' },
			{ target: 'cocinar', en: 'to cook', de: 'kochen' },
			{ target: 'bailar', en: 'to dance', de: 'tanzen' },
			{ target: 'cantar', en: 'to sing', de: 'singen' },
			{ target: 'pintar', en: 'to paint', de: 'malen' },
			{ target: 'fotografía', en: 'photography', de: 'Fotografie' }
		],
		sentences: [
			{
				target: 'Me gusta jugar fútbol.',
				en: 'I like to play soccer.',
				de: 'Ich spiele gern Fußball.'
			},
			{ target: 'Ella nada muy bien.', en: 'She swims very well.', de: 'Sie schwimmt sehr gut.' },
			{
				target: 'El equipo ganó el partido.',
				en: 'The team won the game.',
				de: 'Die Mannschaft hat das Spiel gewonnen.'
			},
			{ target: '¿Cuál es tu hobby?', en: 'What is your hobby?', de: 'Was ist dein Hobby?' },
			{
				target: 'Leo libros todos los días.',
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
		themeColor: '#607D8B',
		vocab: [
			{ target: 'ciudad', en: 'city', de: 'Stadt' },
			{ target: 'pueblo', en: 'town', de: 'Dorf' },
			{ target: 'calle', en: 'street', de: 'Straße' },
			{ target: 'plaza', en: 'square', de: 'Platz' },
			{ target: 'parque', en: 'park', de: 'Park' },
			{ target: 'banco', en: 'bank', de: 'Bank' },
			{ target: 'restaurante', en: 'restaurant', de: 'Restaurant' },
			{ target: 'supermercado', en: 'supermarket', de: 'Supermarkt' },
			{ target: 'museo', en: 'museum', de: 'Museum' },
			{ target: 'teatro', en: 'theater', de: 'Theater' },
			{ target: 'iglesia', en: 'church', de: 'Kirche' },
			{ target: 'hotel', en: 'hotel', de: 'Hotel' },
			{ target: 'centro', en: 'downtown', de: 'Innenstadt' },
			{ target: 'esquina', en: 'corner', de: 'Ecke' },
			{ target: 'derecha', en: 'right', de: 'rechts' },
			{ target: 'izquierda', en: 'left', de: 'links' },
			{ target: 'recto', en: 'straight', de: 'geradeaus' },
			{ target: 'cerca', en: 'near', de: 'nah' },
			{ target: 'lejos', en: 'far', de: 'weit' },
			{ target: 'dirección', en: 'direction', de: 'Richtung' }
		],
		sentences: [
			{
				target: 'El banco está a la derecha.',
				en: 'The bank is on the right.',
				de: 'Die Bank ist rechts.'
			},
			{
				target: 'Vamos al centro.',
				en: 'Let us go downtown.',
				de: 'Lass uns in die Innenstadt gehen.'
			},
			{
				target: 'El museo está cerca.',
				en: 'The museum is nearby.',
				de: 'Das Museum ist in der Nähe.'
			},
			{
				target: '¿Cómo llego al parque?',
				en: 'How do I get to the park?',
				de: 'Wie komme ich zum Park?'
			},
			{
				target: 'Sigue recto dos calles.',
				en: 'Go straight two blocks.',
				de: 'Geh zwei Straßen geradeaus.'
			}
		]
	},
	{
		titleEn: 'Nature & Animals',
		titleDe: 'Natur & Tiere',
		descriptionEn: 'Learn about nature and animals',
		descriptionDe: 'Lerne über Natur und Tiere',
		themeColor: '#8BC34A',
		vocab: [
			{ target: 'perro', en: 'dog', de: 'Hund' },
			{ target: 'gato', en: 'cat', de: 'Katze' },
			{ target: 'pájaro', en: 'bird', de: 'Vogel' },
			{ target: 'pez', en: 'fish', de: 'Fisch' },
			{ target: 'caballo', en: 'horse', de: 'Pferd' },
			{ target: 'vaca', en: 'cow', de: 'Kuh' },
			{ target: 'cerdo', en: 'pig', de: 'Schwein' },
			{ target: 'árbol', en: 'tree', de: 'Baum' },
			{ target: 'flor', en: 'flower', de: 'Blume' },
			{ target: 'planta', en: 'plant', de: 'Pflanze' },
			{ target: 'río', en: 'river', de: 'Fluss' },
			{ target: 'mar', en: 'sea', de: 'Meer' },
			{ target: 'montaña', en: 'mountain', de: 'Berg' },
			{ target: 'bosque', en: 'forest', de: 'Wald' },
			{ target: 'playa', en: 'beach', de: 'Strand' },
			{ target: 'lago', en: 'lake', de: 'See' },
			{ target: 'cielo', en: 'sky', de: 'Himmel' },
			{ target: 'estrella', en: 'star', de: 'Stern' },
			{ target: 'luna', en: 'moon', de: 'Mond' },
			{ target: 'tierra', en: 'earth', de: 'Erde' }
		],
		sentences: [
			{
				target: 'Mi perro es muy amigable.',
				en: 'My dog is very friendly.',
				de: 'Mein Hund ist sehr freundlich.'
			},
			{
				target: 'Las flores son hermosas.',
				en: 'The flowers are beautiful.',
				de: 'Die Blumen sind wunderschön.'
			},
			{ target: 'El río está limpio.', en: 'The river is clean.', de: 'Der Fluss ist sauber.' },
			{
				target: 'Hay muchos árboles en el bosque.',
				en: 'There are many trees in the forest.',
				de: 'Es gibt viele Bäume im Wald.'
			},
			{
				target: 'Las estrellas brillan en el cielo.',
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
		themeColor: '#FF6B6B',
		vocab: [
			{ target: 'feliz', en: 'happy', de: 'glücklich' },
			{ target: 'triste', en: 'sad', de: 'traurig' },
			{ target: 'enojado', en: 'angry', de: 'wütend' },
			{ target: 'cansado', en: 'tired', de: 'müde' },
			{ target: 'nervioso', en: 'nervous', de: 'nervös' },
			{ target: 'preocupado', en: 'worried', de: 'besorgt' },
			{ target: 'sorprendido', en: 'surprised', de: 'überrascht' },
			{ target: 'emocionado', en: 'excited', de: 'aufgeregt' },
			{ target: 'aburrido', en: 'bored', de: 'gelangweilt' },
			{ target: 'asustado', en: 'scared', de: 'verängstigt' },
			{ target: 'tranquilo', en: 'calm', de: 'ruhig' },
			{ target: 'contento', en: 'content', de: 'zufrieden' },
			{ target: 'amor', en: 'love', de: 'Liebe' },
			{ target: 'odio', en: 'hate', de: 'Hass' },
			{ target: 'miedo', en: 'fear', de: 'Angst' },
			{ target: 'alegría', en: 'joy', de: 'Freude' },
			{ target: 'tristeza', en: 'sadness', de: 'Traurigkeit' },
			{ target: 'esperanza', en: 'hope', de: 'Hoffnung' },
			{ target: 'confusión', en: 'confusion', de: 'Verwirrung' },
			{ target: 'orgullo', en: 'pride', de: 'Stolz' }
		],
		sentences: [
			{
				target: 'Estoy muy feliz hoy.',
				en: 'I am very happy today.',
				de: 'Ich bin heute sehr glücklich.'
			},
			{ target: 'Ella está triste.', en: 'She is sad.', de: 'Sie ist traurig.' },
			{ target: 'Me siento cansado.', en: 'I feel tired.', de: 'Ich fühle mich müde.' },
			{ target: 'No estés nervioso.', en: 'Do not be nervous.', de: 'Sei nicht nervös.' },
			{
				target: 'Tengo miedo de la oscuridad.',
				en: 'I am afraid of the dark.',
				de: 'Ich habe Angst vor der Dunkelheit.'
			}
		]
	}
];

// Additional units for B1, B2, C1, C2 (abbreviated for brevity but following same pattern)
export const B1_UNITS: UnitVocab[] = [
	{
		titleEn: 'Past Tense Verbs',
		titleDe: 'Vergangenheitsformen',
		descriptionEn: 'Learn to talk about past events',
		descriptionDe: 'Lerne über vergangene Ereignisse zu sprechen',
		themeColor: '#673AB7',
		vocab: [
			{ target: 'fue', en: 'was/went', de: 'war/ging' },
			{ target: 'estuvo', en: 'was (state)', de: 'war (Zustand)' },
			{ target: 'tuvo', en: 'had', de: 'hatte' },
			{ target: 'hizo', en: 'did/made', de: 'machte' },
			{ target: 'dijo', en: 'said', de: 'sagte' },
			{ target: 'vino', en: 'came', de: 'kam' },
			{ target: 'vio', en: 'saw', de: 'sah' },
			{ target: 'dio', en: 'gave', de: 'gab' },
			{ target: 'supo', en: 'knew', de: 'wusste' },
			{ target: 'pudo', en: 'could', de: 'konnte' },
			{ target: 'quiso', en: 'wanted', de: 'wollte' },
			{ target: 'comió', en: 'ate', de: 'aß' },
			{ target: 'bebió', en: 'drank', de: 'trank' },
			{ target: 'durmió', en: 'slept', de: 'schlief' },
			{ target: 'escribió', en: 'wrote', de: 'schrieb' },
			{ target: 'leyó', en: 'read', de: 'las' },
			{ target: 'oyó', en: 'heard', de: 'hörte' },
			{ target: 'sintió', en: 'felt', de: 'fühlte' },
			{ target: 'pidió', en: 'asked for', de: 'bat um' },
			{ target: 'murió', en: 'died', de: 'starb' }
		],
		sentences: [
			{
				target: 'Ayer fui al cine.',
				en: 'Yesterday I went to the movies.',
				de: 'Gestern ging ich ins Kino.'
			},
			{ target: 'Ella comió pizza.', en: 'She ate pizza.', de: 'Sie aß Pizza.' },
			{
				target: 'Él me dijo la verdad.',
				en: 'He told me the truth.',
				de: 'Er sagte mir die Wahrheit.'
			},
			{
				target: '¿Qué hiciste ayer?',
				en: 'What did you do yesterday?',
				de: 'Was hast du gestern gemacht?'
			},
			{
				target: 'No pude dormir anoche.',
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
		themeColor: '#2196F3',
		vocab: [
			{ target: 'será', en: 'will be', de: 'wird sein' },
			{ target: 'estará', en: 'will be (location)', de: 'wird sein (Ort)' },
			{ target: 'tendrá', en: 'will have', de: 'wird haben' },
			{ target: 'hará', en: 'will do/make', de: 'wird machen' },
			{ target: 'irá', en: 'will go', de: 'wird gehen' },
			{ target: 'vendrá', en: 'will come', de: 'wird kommen' },
			{ target: 'podrá', en: 'will be able to', de: 'wird können' },
			{ target: 'querrá', en: 'will want', de: 'wird wollen' },
			{ target: 'sabrá', en: 'will know', de: 'wird wissen' },
			{ target: 'dirá', en: 'will say', de: 'wird sagen' },
			{ target: 'pronto', en: 'soon', de: 'bald' },
			{ target: 'después', en: 'after', de: 'danach' },
			{ target: 'luego', en: 'later', de: 'später' },
			{ target: 'algún día', en: 'someday', de: 'eines Tages' },
			{ target: 'próximo', en: 'next', de: 'nächste' },
			{ target: 'futuro', en: 'future', de: 'Zukunft' },
			{ target: 'planear', en: 'to plan', de: 'planen' },
			{ target: 'esperar', en: 'to hope/wait', de: 'hoffen/warten' },
			{ target: 'pensar', en: 'to think/plan', de: 'denken/planen' },
			{ target: 'decidir', en: 'to decide', de: 'entscheiden' }
		],
		sentences: [
			{
				target: 'Mañana iré al doctor.',
				en: 'Tomorrow I will go to the doctor.',
				de: 'Morgen werde ich zum Arzt gehen.'
			},
			{
				target: 'El próximo año viajaré a España.',
				en: 'Next year I will travel to Spain.',
				de: 'Nächstes Jahr werde ich nach Spanien reisen.'
			},
			{
				target: '¿Qué harás este fin de semana?',
				en: 'What will you do this weekend?',
				de: 'Was wirst du dieses Wochenende machen?'
			},
			{
				target: 'Ella vendrá a la fiesta.',
				en: 'She will come to the party.',
				de: 'Sie wird zur Party kommen.'
			},
			{
				target: 'Pronto sabremos los resultados.',
				en: 'Soon we will know the results.',
				de: 'Bald werden wir die Ergebnisse wissen.'
			}
		]
	},
	{
		titleEn: 'Technology',
		titleDe: 'Technologie',
		descriptionEn: 'Digital world vocabulary',
		descriptionDe: 'Vokabular der digitalen Welt',
		themeColor: '#00BCD4',
		vocab: [
			{ target: 'internet', en: 'internet', de: 'Internet' },
			{ target: 'teléfono', en: 'phone', de: 'Telefon' },
			{ target: 'aplicación', en: 'app', de: 'App' },
			{ target: 'mensaje', en: 'message', de: 'Nachricht' },
			{ target: 'llamada', en: 'call', de: 'Anruf' },
			{ target: 'pantalla', en: 'screen', de: 'Bildschirm' },
			{ target: 'batería', en: 'battery', de: 'Batterie' },
			{ target: 'cargador', en: 'charger', de: 'Ladegerät' },
			{ target: 'contraseña', en: 'password', de: 'Passwort' },
			{ target: 'cuenta', en: 'account', de: 'Konto' },
			{ target: 'descargar', en: 'to download', de: 'herunterladen' },
			{ target: 'subir', en: 'to upload', de: 'hochladen' },
			{ target: 'buscar', en: 'to search', de: 'suchen' },
			{ target: 'conectar', en: 'to connect', de: 'verbinden' },
			{ target: 'red', en: 'network', de: 'Netzwerk' },
			{ target: 'sitio web', en: 'website', de: 'Webseite' },
			{ target: 'video', en: 'video', de: 'Video' },
			{ target: 'foto', en: 'photo', de: 'Foto' },
			{ target: 'usuario', en: 'user', de: 'Benutzer' },
			{ target: 'datos', en: 'data', de: 'Daten' }
		],
		sentences: [
			{
				target: 'No tengo internet.',
				en: 'I do not have internet.',
				de: 'Ich habe kein Internet.'
			},
			{
				target: 'Descarga esta aplicación.',
				en: 'Download this app.',
				de: 'Lade diese App herunter.'
			},
			{
				target: 'Mi batería está baja.',
				en: 'My battery is low.',
				de: 'Meine Batterie ist schwach.'
			},
			{
				target: '¿Cuál es la contraseña?',
				en: 'What is the password?',
				de: 'Wie lautet das Passwort?'
			},
			{
				target: 'Subí una foto nueva.',
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
		themeColor: '#4CAF50',
		vocab: [
			{ target: 'ambiente', en: 'environment', de: 'Umwelt' },
			{ target: 'contaminación', en: 'pollution', de: 'Verschmutzung' },
			{ target: 'reciclar', en: 'to recycle', de: 'recyceln' },
			{ target: 'basura', en: 'trash', de: 'Müll' },
			{ target: 'energía', en: 'energy', de: 'Energie' },
			{ target: 'solar', en: 'solar', de: 'Solar' },
			{ target: 'clima', en: 'climate', de: 'Klima' },
			{ target: 'calentamiento', en: 'warming', de: 'Erwärmung' },
			{ target: 'proteger', en: 'to protect', de: 'schützen' },
			{ target: 'conservar', en: 'to conserve', de: 'bewahren' },
			{ target: 'naturaleza', en: 'nature', de: 'Natur' },
			{ target: 'recursos', en: 'resources', de: 'Ressourcen' },
			{ target: 'renovable', en: 'renewable', de: 'erneuerbar' },
			{ target: 'ecológico', en: 'ecological', de: 'ökologisch' },
			{ target: 'sostenible', en: 'sustainable', de: 'nachhaltig' },
			{ target: 'deforestación', en: 'deforestation', de: 'Abholzung' },
			{ target: 'extinción', en: 'extinction', de: 'Aussterben' },
			{ target: 'especie', en: 'species', de: 'Art' },
			{ target: 'peligro', en: 'danger', de: 'Gefahr' },
			{ target: 'planeta', en: 'planet', de: 'Planet' }
		],
		sentences: [
			{
				target: 'Debemos reciclar más.',
				en: 'We should recycle more.',
				de: 'Wir sollten mehr recyceln.'
			},
			{
				target: 'La contaminación es un problema grave.',
				en: 'Pollution is a serious problem.',
				de: 'Verschmutzung ist ein ernstes Problem.'
			},
			{
				target: 'El clima está cambiando.',
				en: 'The climate is changing.',
				de: 'Das Klima verändert sich.'
			},
			{
				target: 'Hay que proteger el planeta.',
				en: 'We must protect the planet.',
				de: 'Wir müssen den Planeten schützen.'
			},
			{
				target: 'Muchas especies están en peligro.',
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
		themeColor: '#9C27B0',
		vocab: [
			{ target: 'gobierno', en: 'government', de: 'Regierung' },
			{ target: 'política', en: 'politics', de: 'Politik' },
			{ target: 'elección', en: 'election', de: 'Wahl' },
			{ target: 'votar', en: 'to vote', de: 'wählen' },
			{ target: 'democracia', en: 'democracy', de: 'Demokratie' },
			{ target: 'ley', en: 'law', de: 'Gesetz' },
			{ target: 'derecho', en: 'right', de: 'Recht' },
			{ target: 'libertad', en: 'freedom', de: 'Freiheit' },
			{ target: 'igualdad', en: 'equality', de: 'Gleichheit' },
			{ target: 'justicia', en: 'justice', de: 'Gerechtigkeit' },
			{ target: 'ciudadano', en: 'citizen', de: 'Bürger' },
			{ target: 'presidente', en: 'president', de: 'Präsident' },
			{ target: 'partido', en: 'party', de: 'Partei' },
			{ target: 'congreso', en: 'congress', de: 'Kongress' },
			{ target: 'constitución', en: 'constitution', de: 'Verfassung' },
			{ target: 'protesta', en: 'protest', de: 'Protest' },
			{ target: 'manifestación', en: 'demonstration', de: 'Demonstration' },
			{ target: 'reforma', en: 'reform', de: 'Reform' },
			{ target: 'corrupción', en: 'corruption', de: 'Korruption' },
			{ target: 'economía', en: 'economy', de: 'Wirtschaft' }
		],
		sentences: [
			{
				target: 'Las elecciones son el próximo mes.',
				en: 'Elections are next month.',
				de: 'Die Wahlen sind nächsten Monat.'
			},
			{
				target: 'Todos tenemos el derecho de votar.',
				en: 'We all have the right to vote.',
				de: 'Wir alle haben das Recht zu wählen.'
			},
			{
				target: 'El gobierno anunció nuevas reformas.',
				en: 'The government announced new reforms.',
				de: 'Die Regierung hat neue Reformen angekündigt.'
			},
			{
				target: 'La democracia es importante.',
				en: 'Democracy is important.',
				de: 'Demokratie ist wichtig.'
			},
			{
				target: 'Hay una manifestación en la plaza.',
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
		themeColor: '#FF9800',
		vocab: [
			{ target: 'negocio', en: 'business', de: 'Geschäft' },
			{ target: 'inversión', en: 'investment', de: 'Investition' },
			{ target: 'mercado', en: 'market', de: 'Markt' },
			{ target: 'acción', en: 'stock', de: 'Aktie' },
			{ target: 'presupuesto', en: 'budget', de: 'Budget' },
			{ target: 'beneficio', en: 'profit', de: 'Gewinn' },
			{ target: 'pérdida', en: 'loss', de: 'Verlust' },
			{ target: 'impuesto', en: 'tax', de: 'Steuer' },
			{ target: 'préstamo', en: 'loan', de: 'Kredit' },
			{ target: 'deuda', en: 'debt', de: 'Schulden' },
			{ target: 'contrato', en: 'contract', de: 'Vertrag' },
			{ target: 'socio', en: 'partner', de: 'Partner' },
			{ target: 'competencia', en: 'competition', de: 'Wettbewerb' },
			{ target: 'estrategia', en: 'strategy', de: 'Strategie' },
			{ target: 'marketing', en: 'marketing', de: 'Marketing' },
			{ target: 'cliente', en: 'client', de: 'Kunde' },
			{ target: 'proveedor', en: 'supplier', de: 'Lieferant' },
			{ target: 'producto', en: 'product', de: 'Produkt' },
			{ target: 'servicio', en: 'service', de: 'Dienstleistung' },
			{ target: 'éxito', en: 'success', de: 'Erfolg' }
		],
		sentences: [
			{
				target: 'El negocio está creciendo.',
				en: 'The business is growing.',
				de: 'Das Geschäft wächst.'
			},
			{
				target: 'Necesitamos revisar el presupuesto.',
				en: 'We need to review the budget.',
				de: 'Wir müssen das Budget überprüfen.'
			},
			{
				target: 'La inversión fue exitosa.',
				en: 'The investment was successful.',
				de: 'Die Investition war erfolgreich.'
			},
			{
				target: 'Firmamos el contrato ayer.',
				en: 'We signed the contract yesterday.',
				de: 'Wir haben gestern den Vertrag unterschrieben.'
			},
			{
				target: 'La competencia es muy fuerte.',
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
		themeColor: '#3F51B5',
		vocab: [
			{ target: 'hipótesis', en: 'hypothesis', de: 'Hypothese' },
			{ target: 'argumento', en: 'argument', de: 'Argument' },
			{ target: 'conclusión', en: 'conclusion', de: 'Schlussfolgerung' },
			{ target: 'análisis', en: 'analysis', de: 'Analyse' },
			{ target: 'metodología', en: 'methodology', de: 'Methodologie' },
			{ target: 'investigación', en: 'research', de: 'Forschung' },
			{ target: 'evidencia', en: 'evidence', de: 'Beweis' },
			{ target: 'teoría', en: 'theory', de: 'Theorie' },
			{ target: 'referencia', en: 'reference', de: 'Referenz' },
			{ target: 'citar', en: 'to cite', de: 'zitieren' },
			{ target: 'fuente', en: 'source', de: 'Quelle' },
			{ target: 'objetivo', en: 'objective', de: 'objektiv' },
			{ target: 'subjetivo', en: 'subjective', de: 'subjektiv' },
			{ target: 'perspectiva', en: 'perspective', de: 'Perspektive' },
			{ target: 'contexto', en: 'context', de: 'Kontext' },
			{ target: 'síntesis', en: 'synthesis', de: 'Synthese' },
			{ target: 'crítica', en: 'critique', de: 'Kritik' },
			{ target: 'evaluar', en: 'to evaluate', de: 'bewerten' },
			{ target: 'inferir', en: 'to infer', de: 'folgern' },
			{ target: 'implicar', en: 'to imply', de: 'implizieren' }
		],
		sentences: [
			{
				target: 'La hipótesis fue confirmada.',
				en: 'The hypothesis was confirmed.',
				de: 'Die Hypothese wurde bestätigt.'
			},
			{
				target: 'Según la investigación...',
				en: 'According to the research...',
				de: 'Laut der Forschung...'
			},
			{
				target: 'La evidencia sugiere que...',
				en: 'The evidence suggests that...',
				de: 'Die Beweise deuten darauf hin, dass...'
			},
			{
				target: 'En conclusión, podemos afirmar...',
				en: 'In conclusion, we can affirm...',
				de: 'Abschließend können wir feststellen...'
			},
			{
				target: 'Es necesario analizar el contexto.',
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
		themeColor: '#E91E63',
		vocab: [
			{ target: 'pan comido', en: 'piece of cake', de: 'ein Kinderspiel' },
			{ target: 'meter la pata', en: 'to put your foot in it', de: 'ins Fettnäpfchen treten' },
			{ target: 'tomar el pelo', en: "to pull someone's leg", de: 'jemanden auf den Arm nehmen' },
			{
				target: 'estar en las nubes',
				en: 'to have your head in the clouds',
				de: 'mit den Gedanken woanders sein'
			},
			{
				target: 'costar un ojo de la cara',
				en: 'to cost an arm and a leg',
				de: 'ein Vermögen kosten'
			},
			{
				target: 'ser uña y carne',
				en: 'to be thick as thieves',
				de: 'ein Herz und eine Seele sein'
			},
			{
				target: 'no tener pelos en la lengua',
				en: 'to not mince words',
				de: 'kein Blatt vor den Mund nehmen'
			},
			{
				target: 'estar como pez en el agua',
				en: "to be in one's element",
				de: 'sich wie ein Fisch im Wasser fühlen'
			},
			{ target: 'llover a cántaros', en: 'to rain cats and dogs', de: 'in Strömen regnen' },
			{
				target: 'dar en el clavo',
				en: 'to hit the nail on the head',
				de: 'den Nagel auf den Kopf treffen'
			},
			{ target: 'ponerse las pilas', en: "to get one's act together", de: 'in die Gänge kommen' },
			{ target: 'ser pan comido', en: 'to be a piece of cake', de: 'ein Kinderspiel sein' },
			{ target: 'echar una mano', en: 'to lend a hand', de: 'unter die Arme greifen' },
			{ target: 'tener mala leche', en: 'to be in a bad mood', de: 'schlechte Laune haben' },
			{ target: 'quedarse de piedra', en: 'to be stunned', de: 'wie versteinert sein' },
			{ target: 'tirar la toalla', en: 'to throw in the towel', de: 'das Handtuch werfen' },
			{ target: 'dormir como un tronco', en: 'to sleep like a log', de: 'wie ein Stein schlafen' },
			{ target: 'estar hecho polvo', en: 'to be exhausted', de: 'völlig fertig sein' },
			{
				target: 'no dar pie con bola',
				en: 'to not get anything right',
				de: 'nichts auf die Reihe kriegen'
			},
			{ target: 'pillar el toro', en: 'to be too late', de: 'zu spät kommen' }
		],
		sentences: [
			{
				target: 'Este examen fue pan comido.',
				en: 'This exam was a piece of cake.',
				de: 'Diese Prüfung war ein Kinderspiel.'
			},
			{
				target: 'Metí la pata en la reunión.',
				en: 'I put my foot in it at the meeting.',
				de: 'Ich bin bei der Besprechung ins Fettnäpfchen getreten.'
			},
			{
				target: 'No me tomes el pelo.',
				en: "Don't pull my leg.",
				de: 'Nimm mich nicht auf den Arm.'
			},
			{
				target: 'Siempre estás en las nubes.',
				en: 'You always have your head in the clouds.',
				de: 'Du bist immer mit den Gedanken woanders.'
			},
			{
				target: 'El carro me costó un ojo de la cara.',
				en: 'The car cost me an arm and a leg.',
				de: 'Das Auto hat mich ein Vermögen gekostet.'
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
