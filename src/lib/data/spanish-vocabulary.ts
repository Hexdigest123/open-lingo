// Spanish vocabulary data organized by level and topic
// Each entry has Spanish word, English translation, and category

export interface VocabItem {
	es: string;
	en: string;
	de: string;
}

export interface UnitVocab {
	title: string;
	description: string;
	themeColor: string;
	vocab: VocabItem[];
	sentences: { es: string; en: string }[];
}

export const A1_UNITS: UnitVocab[] = [
	{
		title: 'Greetings & Introductions',
		description: 'Learn basic greetings and how to introduce yourself',
		themeColor: '#58CC02',
		vocab: [
			{ es: 'hola', en: 'hello', de: 'hallo' },
			{ es: 'adiós', en: 'goodbye', de: 'auf Wiedersehen' },
			{ es: 'buenos días', en: 'good morning', de: 'guten Morgen' },
			{ es: 'buenas tardes', en: 'good afternoon', de: 'guten Tag' },
			{ es: 'buenas noches', en: 'good night', de: 'gute Nacht' },
			{ es: 'hasta luego', en: 'see you later', de: 'bis später' },
			{ es: 'hasta mañana', en: 'see you tomorrow', de: 'bis morgen' },
			{ es: 'por favor', en: 'please', de: 'bitte' },
			{ es: 'gracias', en: 'thank you', de: 'danke' },
			{ es: 'de nada', en: 'you are welcome', de: 'bitte schön' },
			{ es: 'perdón', en: 'sorry', de: 'Entschuldigung' },
			{ es: 'disculpe', en: 'excuse me', de: 'Verzeihung' },
			{ es: 'sí', en: 'yes', de: 'ja' },
			{ es: 'no', en: 'no', de: 'nein' },
			{ es: 'yo', en: 'I', de: 'ich' },
			{ es: 'tú', en: 'you', de: 'du' },
			{ es: 'usted', en: 'you (formal)', de: 'Sie' },
			{ es: 'señor', en: 'mister', de: 'Herr' },
			{ es: 'señora', en: 'mrs', de: 'Frau' },
			{ es: 'señorita', en: 'miss', de: 'Fräulein' }
		],
		sentences: [
			{ es: 'Hola, ¿cómo estás?', en: 'Hello, how are you?' },
			{ es: 'Me llamo Juan.', en: 'My name is Juan.' },
			{ es: 'Mucho gusto.', en: 'Nice to meet you.' },
			{ es: '¿Cómo te llamas?', en: 'What is your name?' },
			{ es: 'Buenos días, señor.', en: 'Good morning, sir.' }
		]
	},
	{
		title: 'Numbers 1-100',
		description: 'Learn to count and use numbers in Spanish',
		themeColor: '#1CB0F6',
		vocab: [
			{ es: 'uno', en: 'one', de: 'eins' },
			{ es: 'dos', en: 'two', de: 'zwei' },
			{ es: 'tres', en: 'three', de: 'drei' },
			{ es: 'cuatro', en: 'four', de: 'vier' },
			{ es: 'cinco', en: 'five', de: 'fünf' },
			{ es: 'seis', en: 'six', de: 'sechs' },
			{ es: 'siete', en: 'seven', de: 'sieben' },
			{ es: 'ocho', en: 'eight', de: 'acht' },
			{ es: 'nueve', en: 'nine', de: 'neun' },
			{ es: 'diez', en: 'ten', de: 'zehn' },
			{ es: 'once', en: 'eleven', de: 'elf' },
			{ es: 'doce', en: 'twelve', de: 'zwölf' },
			{ es: 'veinte', en: 'twenty', de: 'zwanzig' },
			{ es: 'treinta', en: 'thirty', de: 'dreißig' },
			{ es: 'cuarenta', en: 'forty', de: 'vierzig' },
			{ es: 'cincuenta', en: 'fifty', de: 'fünfzig' },
			{ es: 'cien', en: 'one hundred', de: 'hundert' },
			{ es: 'primero', en: 'first', de: 'erste' },
			{ es: 'segundo', en: 'second', de: 'zweite' },
			{ es: 'tercero', en: 'third', de: 'dritte' }
		],
		sentences: [
			{ es: 'Tengo tres hermanos.', en: 'I have three siblings.' },
			{ es: '¿Cuántos años tienes?', en: 'How old are you?' },
			{ es: 'Son las cinco.', en: 'It is five o clock.' },
			{ es: 'Hay diez manzanas.', en: 'There are ten apples.' },
			{ es: 'El número es veinte.', en: 'The number is twenty.' }
		]
	},
	{
		title: 'Family',
		description: 'Talk about your family members',
		themeColor: '#CE82FF',
		vocab: [
			{ es: 'familia', en: 'family', de: 'Familie' },
			{ es: 'madre', en: 'mother', de: 'Mutter' },
			{ es: 'padre', en: 'father', de: 'Vater' },
			{ es: 'hermano', en: 'brother', de: 'Bruder' },
			{ es: 'hermana', en: 'sister', de: 'Schwester' },
			{ es: 'hijo', en: 'son', de: 'Sohn' },
			{ es: 'hija', en: 'daughter', de: 'Tochter' },
			{ es: 'abuelo', en: 'grandfather', de: 'Großvater' },
			{ es: 'abuela', en: 'grandmother', de: 'Großmutter' },
			{ es: 'tío', en: 'uncle', de: 'Onkel' },
			{ es: 'tía', en: 'aunt', de: 'Tante' },
			{ es: 'primo', en: 'cousin (male)', de: 'Cousin' },
			{ es: 'prima', en: 'cousin (female)', de: 'Cousine' },
			{ es: 'esposo', en: 'husband', de: 'Ehemann' },
			{ es: 'esposa', en: 'wife', de: 'Ehefrau' },
			{ es: 'niño', en: 'child (boy)', de: 'Junge' },
			{ es: 'niña', en: 'child (girl)', de: 'Mädchen' },
			{ es: 'bebé', en: 'baby', de: 'Baby' },
			{ es: 'padres', en: 'parents', de: 'Eltern' },
			{ es: 'hijos', en: 'children', de: 'Kinder' }
		],
		sentences: [
			{ es: 'Mi madre es doctora.', en: 'My mother is a doctor.' },
			{ es: 'Tengo dos hermanas.', en: 'I have two sisters.' },
			{ es: 'Mi familia es grande.', en: 'My family is big.' },
			{ es: 'El abuelo está en casa.', en: 'Grandfather is at home.' },
			{ es: 'Ella es mi tía.', en: 'She is my aunt.' }
		]
	},
	{
		title: 'Colors',
		description: 'Learn the colors in Spanish',
		themeColor: '#FF9600',
		vocab: [
			{ es: 'rojo', en: 'red', de: 'rot' },
			{ es: 'azul', en: 'blue', de: 'blau' },
			{ es: 'verde', en: 'green', de: 'grün' },
			{ es: 'amarillo', en: 'yellow', de: 'gelb' },
			{ es: 'naranja', en: 'orange', de: 'orange' },
			{ es: 'morado', en: 'purple', de: 'lila' },
			{ es: 'rosa', en: 'pink', de: 'rosa' },
			{ es: 'negro', en: 'black', de: 'schwarz' },
			{ es: 'blanco', en: 'white', de: 'weiß' },
			{ es: 'gris', en: 'gray', de: 'grau' },
			{ es: 'marrón', en: 'brown', de: 'braun' },
			{ es: 'dorado', en: 'golden', de: 'golden' },
			{ es: 'plateado', en: 'silver', de: 'silbern' },
			{ es: 'claro', en: 'light', de: 'hell' },
			{ es: 'oscuro', en: 'dark', de: 'dunkel' },
			{ es: 'color', en: 'color', de: 'Farbe' },
			{ es: 'colorido', en: 'colorful', de: 'bunt' },
			{ es: 'brillante', en: 'bright', de: 'leuchtend' },
			{ es: 'pálido', en: 'pale', de: 'blass' },
			{ es: 'vivo', en: 'vivid', de: 'lebhaft' }
		],
		sentences: [
			{ es: 'El cielo es azul.', en: 'The sky is blue.' },
			{ es: 'La manzana es roja.', en: 'The apple is red.' },
			{ es: 'Mi carro es negro.', en: 'My car is black.' },
			{ es: 'Las flores son amarillas.', en: 'The flowers are yellow.' },
			{ es: '¿De qué color es?', en: 'What color is it?' }
		]
	},
	{
		title: 'Food & Drink',
		description: 'Order food and describe meals',
		themeColor: '#FF4B4B',
		vocab: [
			{ es: 'agua', en: 'water', de: 'Wasser' },
			{ es: 'pan', en: 'bread', de: 'Brot' },
			{ es: 'leche', en: 'milk', de: 'Milch' },
			{ es: 'café', en: 'coffee', de: 'Kaffee' },
			{ es: 'té', en: 'tea', de: 'Tee' },
			{ es: 'jugo', en: 'juice', de: 'Saft' },
			{ es: 'carne', en: 'meat', de: 'Fleisch' },
			{ es: 'pollo', en: 'chicken', de: 'Hähnchen' },
			{ es: 'pescado', en: 'fish', de: 'Fisch' },
			{ es: 'arroz', en: 'rice', de: 'Reis' },
			{ es: 'huevo', en: 'egg', de: 'Ei' },
			{ es: 'queso', en: 'cheese', de: 'Käse' },
			{ es: 'fruta', en: 'fruit', de: 'Obst' },
			{ es: 'manzana', en: 'apple', de: 'Apfel' },
			{ es: 'naranja', en: 'orange', de: 'Orange' },
			{ es: 'plátano', en: 'banana', de: 'Banane' },
			{ es: 'verdura', en: 'vegetable', de: 'Gemüse' },
			{ es: 'ensalada', en: 'salad', de: 'Salat' },
			{ es: 'sopa', en: 'soup', de: 'Suppe' },
			{ es: 'postre', en: 'dessert', de: 'Nachtisch' }
		],
		sentences: [
			{ es: 'Quiero agua, por favor.', en: 'I want water, please.' },
			{ es: 'El desayuno está listo.', en: 'Breakfast is ready.' },
			{ es: 'Me gusta el pollo.', en: 'I like chicken.' },
			{ es: '¿Qué quieres comer?', en: 'What do you want to eat?' },
			{ es: 'La sopa está caliente.', en: 'The soup is hot.' }
		]
	},
	{
		title: 'Days & Time',
		description: 'Learn days of the week and tell time',
		themeColor: '#00CD9C',
		vocab: [
			{ es: 'lunes', en: 'Monday', de: 'Montag' },
			{ es: 'martes', en: 'Tuesday', de: 'Dienstag' },
			{ es: 'miércoles', en: 'Wednesday', de: 'Mittwoch' },
			{ es: 'jueves', en: 'Thursday', de: 'Donnerstag' },
			{ es: 'viernes', en: 'Friday', de: 'Freitag' },
			{ es: 'sábado', en: 'Saturday', de: 'Samstag' },
			{ es: 'domingo', en: 'Sunday', de: 'Sonntag' },
			{ es: 'semana', en: 'week', de: 'Woche' },
			{ es: 'mes', en: 'month', de: 'Monat' },
			{ es: 'año', en: 'year', de: 'Jahr' },
			{ es: 'hoy', en: 'today', de: 'heute' },
			{ es: 'mañana', en: 'tomorrow', de: 'morgen' },
			{ es: 'ayer', en: 'yesterday', de: 'gestern' },
			{ es: 'hora', en: 'hour', de: 'Stunde' },
			{ es: 'minuto', en: 'minute', de: 'Minute' },
			{ es: 'segundo', en: 'second', de: 'Sekunde' },
			{ es: 'mediodía', en: 'noon', de: 'Mittag' },
			{ es: 'medianoche', en: 'midnight', de: 'Mitternacht' },
			{ es: 'temprano', en: 'early', de: 'früh' },
			{ es: 'tarde', en: 'late', de: 'spät' }
		],
		sentences: [
			{ es: 'Hoy es lunes.', en: 'Today is Monday.' },
			{ es: '¿Qué hora es?', en: 'What time is it?' },
			{ es: 'Son las tres.', en: 'It is three o clock.' },
			{ es: 'Mañana es viernes.', en: 'Tomorrow is Friday.' },
			{ es: 'La semana tiene siete días.', en: 'The week has seven days.' }
		]
	},
	{
		title: 'Body Parts',
		description: 'Learn the parts of the body',
		themeColor: '#FF86D0',
		vocab: [
			{ es: 'cabeza', en: 'head', de: 'Kopf' },
			{ es: 'ojo', en: 'eye', de: 'Auge' },
			{ es: 'oreja', en: 'ear', de: 'Ohr' },
			{ es: 'nariz', en: 'nose', de: 'Nase' },
			{ es: 'boca', en: 'mouth', de: 'Mund' },
			{ es: 'diente', en: 'tooth', de: 'Zahn' },
			{ es: 'lengua', en: 'tongue', de: 'Zunge' },
			{ es: 'cuello', en: 'neck', de: 'Hals' },
			{ es: 'brazo', en: 'arm', de: 'Arm' },
			{ es: 'mano', en: 'hand', de: 'Hand' },
			{ es: 'dedo', en: 'finger', de: 'Finger' },
			{ es: 'pierna', en: 'leg', de: 'Bein' },
			{ es: 'pie', en: 'foot', de: 'Fuß' },
			{ es: 'espalda', en: 'back', de: 'Rücken' },
			{ es: 'pecho', en: 'chest', de: 'Brust' },
			{ es: 'estómago', en: 'stomach', de: 'Magen' },
			{ es: 'corazón', en: 'heart', de: 'Herz' },
			{ es: 'pelo', en: 'hair', de: 'Haar' },
			{ es: 'cara', en: 'face', de: 'Gesicht' },
			{ es: 'cuerpo', en: 'body', de: 'Körper' }
		],
		sentences: [
			{ es: 'Me duele la cabeza.', en: 'My head hurts.' },
			{ es: 'Tengo dos ojos.', en: 'I have two eyes.' },
			{ es: 'Ella tiene pelo largo.', en: 'She has long hair.' },
			{ es: 'Lávate las manos.', en: 'Wash your hands.' },
			{ es: 'El corazón late rápido.', en: 'The heart beats fast.' }
		]
	},
	{
		title: 'Clothing',
		description: 'Learn about clothes and what to wear',
		themeColor: '#9069FF',
		vocab: [
			{ es: 'camisa', en: 'shirt', de: 'Hemd' },
			{ es: 'pantalón', en: 'pants', de: 'Hose' },
			{ es: 'vestido', en: 'dress', de: 'Kleid' },
			{ es: 'falda', en: 'skirt', de: 'Rock' },
			{ es: 'zapatos', en: 'shoes', de: 'Schuhe' },
			{ es: 'calcetines', en: 'socks', de: 'Socken' },
			{ es: 'chaqueta', en: 'jacket', de: 'Jacke' },
			{ es: 'abrigo', en: 'coat', de: 'Mantel' },
			{ es: 'sombrero', en: 'hat', de: 'Hut' },
			{ es: 'gorra', en: 'cap', de: 'Mütze' },
			{ es: 'bufanda', en: 'scarf', de: 'Schal' },
			{ es: 'guantes', en: 'gloves', de: 'Handschuhe' },
			{ es: 'cinturón', en: 'belt', de: 'Gürtel' },
			{ es: 'corbata', en: 'tie', de: 'Krawatte' },
			{ es: 'bolso', en: 'bag', de: 'Tasche' },
			{ es: 'ropa', en: 'clothes', de: 'Kleidung' },
			{ es: 'camiseta', en: 't-shirt', de: 'T-Shirt' },
			{ es: 'jeans', en: 'jeans', de: 'Jeans' },
			{ es: 'botas', en: 'boots', de: 'Stiefel' },
			{ es: 'pijama', en: 'pajamas', de: 'Schlafanzug' }
		],
		sentences: [
			{ es: 'Ella lleva un vestido rojo.', en: 'She wears a red dress.' },
			{ es: 'Necesito comprar zapatos.', en: 'I need to buy shoes.' },
			{ es: 'Hace frío, ponte la chaqueta.', en: 'It is cold, put on your jacket.' },
			{ es: '¿Dónde está mi camisa?', en: 'Where is my shirt?' },
			{ es: 'Los calcetines son blancos.', en: 'The socks are white.' }
		]
	},
	{
		title: 'House & Home',
		description: 'Learn about rooms and furniture',
		themeColor: '#4B87FF',
		vocab: [
			{ es: 'casa', en: 'house', de: 'Haus' },
			{ es: 'apartamento', en: 'apartment', de: 'Wohnung' },
			{ es: 'habitación', en: 'room', de: 'Zimmer' },
			{ es: 'cocina', en: 'kitchen', de: 'Küche' },
			{ es: 'baño', en: 'bathroom', de: 'Badezimmer' },
			{ es: 'dormitorio', en: 'bedroom', de: 'Schlafzimmer' },
			{ es: 'sala', en: 'living room', de: 'Wohnzimmer' },
			{ es: 'comedor', en: 'dining room', de: 'Esszimmer' },
			{ es: 'puerta', en: 'door', de: 'Tür' },
			{ es: 'ventana', en: 'window', de: 'Fenster' },
			{ es: 'mesa', en: 'table', de: 'Tisch' },
			{ es: 'silla', en: 'chair', de: 'Stuhl' },
			{ es: 'cama', en: 'bed', de: 'Bett' },
			{ es: 'sofá', en: 'sofa', de: 'Sofa' },
			{ es: 'lámpara', en: 'lamp', de: 'Lampe' },
			{ es: 'espejo', en: 'mirror', de: 'Spiegel' },
			{ es: 'escalera', en: 'stairs', de: 'Treppe' },
			{ es: 'jardín', en: 'garden', de: 'Garten' },
			{ es: 'garaje', en: 'garage', de: 'Garage' },
			{ es: 'techo', en: 'roof', de: 'Dach' }
		],
		sentences: [
			{ es: 'Mi casa es grande.', en: 'My house is big.' },
			{ es: 'La cocina está limpia.', en: 'The kitchen is clean.' },
			{ es: 'Hay una mesa en el comedor.', en: 'There is a table in the dining room.' },
			{ es: 'Duermo en mi cama.', en: 'I sleep in my bed.' },
			{ es: 'El jardín tiene flores.', en: 'The garden has flowers.' }
		]
	},
	{
		title: 'Common Verbs',
		description: 'Learn essential action words',
		themeColor: '#FF6B6B',
		vocab: [
			{ es: 'ser', en: 'to be', de: 'sein' },
			{ es: 'estar', en: 'to be', de: 'sein' },
			{ es: 'tener', en: 'to have', de: 'haben' },
			{ es: 'hacer', en: 'to do/make', de: 'machen' },
			{ es: 'ir', en: 'to go', de: 'gehen' },
			{ es: 'venir', en: 'to come', de: 'kommen' },
			{ es: 'ver', en: 'to see', de: 'sehen' },
			{ es: 'dar', en: 'to give', de: 'geben' },
			{ es: 'saber', en: 'to know', de: 'wissen' },
			{ es: 'poder', en: 'can/to be able', de: 'können' },
			{ es: 'querer', en: 'to want', de: 'wollen' },
			{ es: 'decir', en: 'to say', de: 'sagen' },
			{ es: 'hablar', en: 'to speak', de: 'sprechen' },
			{ es: 'comer', en: 'to eat', de: 'essen' },
			{ es: 'beber', en: 'to drink', de: 'trinken' },
			{ es: 'dormir', en: 'to sleep', de: 'schlafen' },
			{ es: 'vivir', en: 'to live', de: 'leben' },
			{ es: 'trabajar', en: 'to work', de: 'arbeiten' },
			{ es: 'estudiar', en: 'to study', de: 'studieren' },
			{ es: 'jugar', en: 'to play', de: 'spielen' }
		],
		sentences: [
			{ es: 'Yo soy estudiante.', en: 'I am a student.' },
			{ es: 'Ella tiene un perro.', en: 'She has a dog.' },
			{ es: 'Nosotros vamos al parque.', en: 'We go to the park.' },
			{ es: 'Quiero aprender español.', en: 'I want to learn Spanish.' },
			{ es: 'Ellos trabajan mucho.', en: 'They work a lot.' }
		]
	}
];

export const A2_UNITS: UnitVocab[] = [
	{
		title: 'Weather & Seasons',
		description: 'Talk about the weather and seasons',
		themeColor: '#00BCD4',
		vocab: [
			{ es: 'tiempo', en: 'weather', de: 'Wetter' },
			{ es: 'sol', en: 'sun', de: 'Sonne' },
			{ es: 'lluvia', en: 'rain', de: 'Regen' },
			{ es: 'nieve', en: 'snow', de: 'Schnee' },
			{ es: 'viento', en: 'wind', de: 'Wind' },
			{ es: 'nube', en: 'cloud', de: 'Wolke' },
			{ es: 'tormenta', en: 'storm', de: 'Sturm' },
			{ es: 'calor', en: 'heat', de: 'Hitze' },
			{ es: 'frío', en: 'cold', de: 'Kälte' },
			{ es: 'primavera', en: 'spring', de: 'Frühling' },
			{ es: 'verano', en: 'summer', de: 'Sommer' },
			{ es: 'otoño', en: 'autumn', de: 'Herbst' },
			{ es: 'invierno', en: 'winter', de: 'Winter' },
			{ es: 'temperatura', en: 'temperature', de: 'Temperatur' },
			{ es: 'grado', en: 'degree', de: 'Grad' },
			{ es: 'húmedo', en: 'humid', de: 'feucht' },
			{ es: 'seco', en: 'dry', de: 'trocken' },
			{ es: 'nublado', en: 'cloudy', de: 'bewölkt' },
			{ es: 'soleado', en: 'sunny', de: 'sonnig' },
			{ es: 'lluvioso', en: 'rainy', de: 'regnerisch' }
		],
		sentences: [
			{ es: 'Hoy hace calor.', en: 'It is hot today.' },
			{ es: 'Está lloviendo.', en: 'It is raining.' },
			{ es: 'El invierno es frío.', en: 'Winter is cold.' },
			{ es: '¿Qué tiempo hace?', en: 'What is the weather like?' },
			{ es: 'Me gusta la primavera.', en: 'I like spring.' }
		]
	},
	{
		title: 'Travel & Transport',
		description: 'Learn vocabulary for traveling',
		themeColor: '#FF5722',
		vocab: [
			{ es: 'avión', en: 'airplane', de: 'Flugzeug' },
			{ es: 'tren', en: 'train', de: 'Zug' },
			{ es: 'autobús', en: 'bus', de: 'Bus' },
			{ es: 'carro', en: 'car', de: 'Auto' },
			{ es: 'bicicleta', en: 'bicycle', de: 'Fahrrad' },
			{ es: 'barco', en: 'boat', de: 'Boot' },
			{ es: 'taxi', en: 'taxi', de: 'Taxi' },
			{ es: 'metro', en: 'subway', de: 'U-Bahn' },
			{ es: 'aeropuerto', en: 'airport', de: 'Flughafen' },
			{ es: 'estación', en: 'station', de: 'Bahnhof' },
			{ es: 'boleto', en: 'ticket', de: 'Fahrkarte' },
			{ es: 'pasaporte', en: 'passport', de: 'Reisepass' },
			{ es: 'maleta', en: 'suitcase', de: 'Koffer' },
			{ es: 'viaje', en: 'trip', de: 'Reise' },
			{ es: 'destino', en: 'destination', de: 'Ziel' },
			{ es: 'llegada', en: 'arrival', de: 'Ankunft' },
			{ es: 'salida', en: 'departure', de: 'Abfahrt' },
			{ es: 'equipaje', en: 'luggage', de: 'Gepäck' },
			{ es: 'reservación', en: 'reservation', de: 'Reservierung' },
			{ es: 'turista', en: 'tourist', de: 'Tourist' }
		],
		sentences: [
			{ es: 'El tren sale a las ocho.', en: 'The train leaves at eight.' },
			{ es: 'Necesito un boleto.', en: 'I need a ticket.' },
			{ es: 'El aeropuerto está lejos.', en: 'The airport is far.' },
			{ es: '¿Dónde está la estación?', en: 'Where is the station?' },
			{ es: 'Viajo en avión.', en: 'I travel by plane.' }
		]
	},
	{
		title: 'Shopping',
		description: 'Learn to shop and talk about prices',
		themeColor: '#E91E63',
		vocab: [
			{ es: 'tienda', en: 'store', de: 'Geschäft' },
			{ es: 'mercado', en: 'market', de: 'Markt' },
			{ es: 'precio', en: 'price', de: 'Preis' },
			{ es: 'dinero', en: 'money', de: 'Geld' },
			{ es: 'tarjeta', en: 'card', de: 'Karte' },
			{ es: 'efectivo', en: 'cash', de: 'Bargeld' },
			{ es: 'cuenta', en: 'bill', de: 'Rechnung' },
			{ es: 'cambio', en: 'change', de: 'Wechselgeld' },
			{ es: 'descuento', en: 'discount', de: 'Rabatt' },
			{ es: 'oferta', en: 'sale', de: 'Angebot' },
			{ es: 'barato', en: 'cheap', de: 'billig' },
			{ es: 'caro', en: 'expensive', de: 'teuer' },
			{ es: 'comprar', en: 'to buy', de: 'kaufen' },
			{ es: 'vender', en: 'to sell', de: 'verkaufen' },
			{ es: 'pagar', en: 'to pay', de: 'bezahlen' },
			{ es: 'cliente', en: 'customer', de: 'Kunde' },
			{ es: 'vendedor', en: 'salesperson', de: 'Verkäufer' },
			{ es: 'recibo', en: 'receipt', de: 'Quittung' },
			{ es: 'caja', en: 'cashier', de: 'Kasse' },
			{ es: 'bolsa', en: 'bag', de: 'Tüte' }
		],
		sentences: [
			{ es: '¿Cuánto cuesta?', en: 'How much does it cost?' },
			{ es: 'Es muy caro.', en: 'It is very expensive.' },
			{ es: '¿Aceptan tarjeta?', en: 'Do you accept cards?' },
			{ es: 'Quiero comprar esto.', en: 'I want to buy this.' },
			{ es: 'Hay un descuento del veinte por ciento.', en: 'There is a twenty percent discount.' }
		]
	},
	{
		title: 'Health & Body',
		description: 'Talk about health and medical needs',
		themeColor: '#4CAF50',
		vocab: [
			{ es: 'médico', en: 'doctor', de: 'Arzt' },
			{ es: 'hospital', en: 'hospital', de: 'Krankenhaus' },
			{ es: 'enfermera', en: 'nurse', de: 'Krankenschwester' },
			{ es: 'medicina', en: 'medicine', de: 'Medizin' },
			{ es: 'enfermo', en: 'sick', de: 'krank' },
			{ es: 'sano', en: 'healthy', de: 'gesund' },
			{ es: 'dolor', en: 'pain', de: 'Schmerz' },
			{ es: 'fiebre', en: 'fever', de: 'Fieber' },
			{ es: 'gripe', en: 'flu', de: 'Grippe' },
			{ es: 'tos', en: 'cough', de: 'Husten' },
			{ es: 'resfriado', en: 'cold', de: 'Erkältung' },
			{ es: 'alergia', en: 'allergy', de: 'Allergie' },
			{ es: 'cita', en: 'appointment', de: 'Termin' },
			{ es: 'receta', en: 'prescription', de: 'Rezept' },
			{ es: 'pastilla', en: 'pill', de: 'Tablette' },
			{ es: 'farmacia', en: 'pharmacy', de: 'Apotheke' },
			{ es: 'emergencia', en: 'emergency', de: 'Notfall' },
			{ es: 'ambulancia', en: 'ambulance', de: 'Krankenwagen' },
			{ es: 'sangre', en: 'blood', de: 'Blut' },
			{ es: 'herida', en: 'wound', de: 'Wunde' }
		],
		sentences: [
			{ es: 'Me siento enfermo.', en: 'I feel sick.' },
			{ es: 'Necesito ver al médico.', en: 'I need to see the doctor.' },
			{ es: 'Tengo dolor de cabeza.', en: 'I have a headache.' },
			{ es: '¿Dónde está la farmacia?', en: 'Where is the pharmacy?' },
			{ es: 'Toma esta medicina.', en: 'Take this medicine.' }
		]
	},
	{
		title: 'Work & Professions',
		description: 'Learn about jobs and the workplace',
		themeColor: '#795548',
		vocab: [
			{ es: 'trabajo', en: 'work/job', de: 'Arbeit' },
			{ es: 'oficina', en: 'office', de: 'Büro' },
			{ es: 'jefe', en: 'boss', de: 'Chef' },
			{ es: 'empleado', en: 'employee', de: 'Angestellter' },
			{ es: 'profesor', en: 'teacher', de: 'Lehrer' },
			{ es: 'abogado', en: 'lawyer', de: 'Anwalt' },
			{ es: 'ingeniero', en: 'engineer', de: 'Ingenieur' },
			{ es: 'cocinero', en: 'cook', de: 'Koch' },
			{ es: 'policía', en: 'police', de: 'Polizist' },
			{ es: 'bombero', en: 'firefighter', de: 'Feuerwehrmann' },
			{ es: 'escritor', en: 'writer', de: 'Schriftsteller' },
			{ es: 'artista', en: 'artist', de: 'Künstler' },
			{ es: 'músico', en: 'musician', de: 'Musiker' },
			{ es: 'salario', en: 'salary', de: 'Gehalt' },
			{ es: 'reunión', en: 'meeting', de: 'Besprechung' },
			{ es: 'computadora', en: 'computer', de: 'Computer' },
			{ es: 'correo', en: 'email', de: 'E-Mail' },
			{ es: 'proyecto', en: 'project', de: 'Projekt' },
			{ es: 'empresa', en: 'company', de: 'Unternehmen' },
			{ es: 'carrera', en: 'career', de: 'Karriere' }
		],
		sentences: [
			{ es: 'Trabajo en una oficina.', en: 'I work in an office.' },
			{ es: 'Mi hermano es ingeniero.', en: 'My brother is an engineer.' },
			{ es: 'Tengo una reunión mañana.', en: 'I have a meeting tomorrow.' },
			{ es: '¿Cuál es tu profesión?', en: 'What is your profession?' },
			{ es: 'El jefe está ocupado.', en: 'The boss is busy.' }
		]
	},
	{
		title: 'Education',
		description: 'School and learning vocabulary',
		themeColor: '#3F51B5',
		vocab: [
			{ es: 'escuela', en: 'school', de: 'Schule' },
			{ es: 'universidad', en: 'university', de: 'Universität' },
			{ es: 'clase', en: 'class', de: 'Klasse' },
			{ es: 'estudiante', en: 'student', de: 'Student' },
			{ es: 'maestro', en: 'teacher', de: 'Lehrer' },
			{ es: 'libro', en: 'book', de: 'Buch' },
			{ es: 'cuaderno', en: 'notebook', de: 'Heft' },
			{ es: 'lápiz', en: 'pencil', de: 'Bleistift' },
			{ es: 'bolígrafo', en: 'pen', de: 'Kugelschreiber' },
			{ es: 'examen', en: 'exam', de: 'Prüfung' },
			{ es: 'tarea', en: 'homework', de: 'Hausaufgaben' },
			{ es: 'nota', en: 'grade', de: 'Note' },
			{ es: 'pizarra', en: 'blackboard', de: 'Tafel' },
			{ es: 'biblioteca', en: 'library', de: 'Bibliothek' },
			{ es: 'idioma', en: 'language', de: 'Sprache' },
			{ es: 'matemáticas', en: 'mathematics', de: 'Mathematik' },
			{ es: 'ciencia', en: 'science', de: 'Wissenschaft' },
			{ es: 'historia', en: 'history', de: 'Geschichte' },
			{ es: 'geografía', en: 'geography', de: 'Geografie' },
			{ es: 'arte', en: 'art', de: 'Kunst' }
		],
		sentences: [
			{ es: 'Estudio español.', en: 'I study Spanish.' },
			{ es: 'La clase empieza a las nueve.', en: 'The class starts at nine.' },
			{ es: 'Tengo mucha tarea.', en: 'I have a lot of homework.' },
			{ es: '¿Dónde está la biblioteca?', en: 'Where is the library?' },
			{ es: 'El examen es difícil.', en: 'The exam is difficult.' }
		]
	},
	{
		title: 'Sports & Hobbies',
		description: 'Learn about sports and free time activities',
		themeColor: '#009688',
		vocab: [
			{ es: 'deporte', en: 'sport', de: 'Sport' },
			{ es: 'fútbol', en: 'soccer', de: 'Fußball' },
			{ es: 'baloncesto', en: 'basketball', de: 'Basketball' },
			{ es: 'tenis', en: 'tennis', de: 'Tennis' },
			{ es: 'natación', en: 'swimming', de: 'Schwimmen' },
			{ es: 'correr', en: 'to run', de: 'laufen' },
			{ es: 'caminar', en: 'to walk', de: 'gehen' },
			{ es: 'equipo', en: 'team', de: 'Mannschaft' },
			{ es: 'pelota', en: 'ball', de: 'Ball' },
			{ es: 'partido', en: 'game/match', de: 'Spiel' },
			{ es: 'ganar', en: 'to win', de: 'gewinnen' },
			{ es: 'perder', en: 'to lose', de: 'verlieren' },
			{ es: 'música', en: 'music', de: 'Musik' },
			{ es: 'película', en: 'movie', de: 'Film' },
			{ es: 'leer', en: 'to read', de: 'lesen' },
			{ es: 'cocinar', en: 'to cook', de: 'kochen' },
			{ es: 'bailar', en: 'to dance', de: 'tanzen' },
			{ es: 'cantar', en: 'to sing', de: 'singen' },
			{ es: 'pintar', en: 'to paint', de: 'malen' },
			{ es: 'fotografía', en: 'photography', de: 'Fotografie' }
		],
		sentences: [
			{ es: 'Me gusta jugar fútbol.', en: 'I like to play soccer.' },
			{ es: 'Ella nada muy bien.', en: 'She swims very well.' },
			{ es: 'El equipo ganó el partido.', en: 'The team won the game.' },
			{ es: '¿Cuál es tu hobby?', en: 'What is your hobby?' },
			{ es: 'Leo libros todos los días.', en: 'I read books every day.' }
		]
	},
	{
		title: 'City & Places',
		description: 'Navigate the city and describe places',
		themeColor: '#607D8B',
		vocab: [
			{ es: 'ciudad', en: 'city', de: 'Stadt' },
			{ es: 'pueblo', en: 'town', de: 'Dorf' },
			{ es: 'calle', en: 'street', de: 'Straße' },
			{ es: 'plaza', en: 'square', de: 'Platz' },
			{ es: 'parque', en: 'park', de: 'Park' },
			{ es: 'banco', en: 'bank', de: 'Bank' },
			{ es: 'restaurante', en: 'restaurant', de: 'Restaurant' },
			{ es: 'supermercado', en: 'supermarket', de: 'Supermarkt' },
			{ es: 'museo', en: 'museum', de: 'Museum' },
			{ es: 'teatro', en: 'theater', de: 'Theater' },
			{ es: 'iglesia', en: 'church', de: 'Kirche' },
			{ es: 'hotel', en: 'hotel', de: 'Hotel' },
			{ es: 'centro', en: 'downtown', de: 'Innenstadt' },
			{ es: 'esquina', en: 'corner', de: 'Ecke' },
			{ es: 'derecha', en: 'right', de: 'rechts' },
			{ es: 'izquierda', en: 'left', de: 'links' },
			{ es: 'recto', en: 'straight', de: 'geradeaus' },
			{ es: 'cerca', en: 'near', de: 'nah' },
			{ es: 'lejos', en: 'far', de: 'weit' },
			{ es: 'dirección', en: 'direction', de: 'Richtung' }
		],
		sentences: [
			{ es: 'El banco está a la derecha.', en: 'The bank is on the right.' },
			{ es: 'Vamos al centro.', en: 'Let us go downtown.' },
			{ es: 'El museo está cerca.', en: 'The museum is nearby.' },
			{ es: '¿Cómo llego al parque?', en: 'How do I get to the park?' },
			{ es: 'Sigue recto dos calles.', en: 'Go straight two blocks.' }
		]
	},
	{
		title: 'Nature & Animals',
		description: 'Learn about nature and animals',
		themeColor: '#8BC34A',
		vocab: [
			{ es: 'perro', en: 'dog', de: 'Hund' },
			{ es: 'gato', en: 'cat', de: 'Katze' },
			{ es: 'pájaro', en: 'bird', de: 'Vogel' },
			{ es: 'pez', en: 'fish', de: 'Fisch' },
			{ es: 'caballo', en: 'horse', de: 'Pferd' },
			{ es: 'vaca', en: 'cow', de: 'Kuh' },
			{ es: 'cerdo', en: 'pig', de: 'Schwein' },
			{ es: 'árbol', en: 'tree', de: 'Baum' },
			{ es: 'flor', en: 'flower', de: 'Blume' },
			{ es: 'planta', en: 'plant', de: 'Pflanze' },
			{ es: 'río', en: 'river', de: 'Fluss' },
			{ es: 'mar', en: 'sea', de: 'Meer' },
			{ es: 'montaña', en: 'mountain', de: 'Berg' },
			{ es: 'bosque', en: 'forest', de: 'Wald' },
			{ es: 'playa', en: 'beach', de: 'Strand' },
			{ es: 'lago', en: 'lake', de: 'See' },
			{ es: 'cielo', en: 'sky', de: 'Himmel' },
			{ es: 'estrella', en: 'star', de: 'Stern' },
			{ es: 'luna', en: 'moon', de: 'Mond' },
			{ es: 'tierra', en: 'earth', de: 'Erde' }
		],
		sentences: [
			{ es: 'Mi perro es muy amigable.', en: 'My dog is very friendly.' },
			{ es: 'Las flores son hermosas.', en: 'The flowers are beautiful.' },
			{ es: 'El río está limpio.', en: 'The river is clean.' },
			{ es: 'Hay muchos árboles en el bosque.', en: 'There are many trees in the forest.' },
			{ es: 'Las estrellas brillan en el cielo.', en: 'The stars shine in the sky.' }
		]
	},
	{
		title: 'Emotions & Feelings',
		description: 'Express how you feel',
		themeColor: '#FF6B6B',
		vocab: [
			{ es: 'feliz', en: 'happy', de: 'glücklich' },
			{ es: 'triste', en: 'sad', de: 'traurig' },
			{ es: 'enojado', en: 'angry', de: 'wütend' },
			{ es: 'cansado', en: 'tired', de: 'müde' },
			{ es: 'nervioso', en: 'nervous', de: 'nervös' },
			{ es: 'preocupado', en: 'worried', de: 'besorgt' },
			{ es: 'sorprendido', en: 'surprised', de: 'überrascht' },
			{ es: 'emocionado', en: 'excited', de: 'aufgeregt' },
			{ es: 'aburrido', en: 'bored', de: 'gelangweilt' },
			{ es: 'asustado', en: 'scared', de: 'verängstigt' },
			{ es: 'tranquilo', en: 'calm', de: 'ruhig' },
			{ es: 'contento', en: 'content', de: 'zufrieden' },
			{ es: 'amor', en: 'love', de: 'Liebe' },
			{ es: 'odio', en: 'hate', de: 'Hass' },
			{ es: 'miedo', en: 'fear', de: 'Angst' },
			{ es: 'alegría', en: 'joy', de: 'Freude' },
			{ es: 'tristeza', en: 'sadness', de: 'Traurigkeit' },
			{ es: 'esperanza', en: 'hope', de: 'Hoffnung' },
			{ es: 'confusión', en: 'confusion', de: 'Verwirrung' },
			{ es: 'orgullo', en: 'pride', de: 'Stolz' }
		],
		sentences: [
			{ es: 'Estoy muy feliz hoy.', en: 'I am very happy today.' },
			{ es: 'Ella está triste.', en: 'She is sad.' },
			{ es: 'Me siento cansado.', en: 'I feel tired.' },
			{ es: 'No estés nervioso.', en: 'Do not be nervous.' },
			{ es: 'Tengo miedo de la oscuridad.', en: 'I am afraid of the dark.' }
		]
	}
];

// Additional units for B1, B2, C1, C2 (abbreviated for brevity but following same pattern)
export const B1_UNITS: UnitVocab[] = [
	{
		title: 'Past Tense Verbs',
		description: 'Learn to talk about past events',
		themeColor: '#673AB7',
		vocab: [
			{ es: 'fue', en: 'was/went', de: 'war/ging' },
			{ es: 'estuvo', en: 'was (state)', de: 'war (Zustand)' },
			{ es: 'tuvo', en: 'had', de: 'hatte' },
			{ es: 'hizo', en: 'did/made', de: 'machte' },
			{ es: 'dijo', en: 'said', de: 'sagte' },
			{ es: 'vino', en: 'came', de: 'kam' },
			{ es: 'vio', en: 'saw', de: 'sah' },
			{ es: 'dio', en: 'gave', de: 'gab' },
			{ es: 'supo', en: 'knew', de: 'wusste' },
			{ es: 'pudo', en: 'could', de: 'konnte' },
			{ es: 'quiso', en: 'wanted', de: 'wollte' },
			{ es: 'comió', en: 'ate', de: 'aß' },
			{ es: 'bebió', en: 'drank', de: 'trank' },
			{ es: 'durmió', en: 'slept', de: 'schlief' },
			{ es: 'escribió', en: 'wrote', de: 'schrieb' },
			{ es: 'leyó', en: 'read', de: 'las' },
			{ es: 'oyó', en: 'heard', de: 'hörte' },
			{ es: 'sintió', en: 'felt', de: 'fühlte' },
			{ es: 'pidió', en: 'asked for', de: 'bat um' },
			{ es: 'murió', en: 'died', de: 'starb' }
		],
		sentences: [
			{ es: 'Ayer fui al cine.', en: 'Yesterday I went to the movies.' },
			{ es: 'Ella comió pizza.', en: 'She ate pizza.' },
			{ es: 'Él me dijo la verdad.', en: 'He told me the truth.' },
			{ es: '¿Qué hiciste ayer?', en: 'What did you do yesterday?' },
			{ es: 'No pude dormir anoche.', en: 'I could not sleep last night.' }
		]
	},
	{
		title: 'Future Plans',
		description: 'Talk about what will happen',
		themeColor: '#2196F3',
		vocab: [
			{ es: 'será', en: 'will be', de: 'wird sein' },
			{ es: 'estará', en: 'will be (location)', de: 'wird sein (Ort)' },
			{ es: 'tendrá', en: 'will have', de: 'wird haben' },
			{ es: 'hará', en: 'will do/make', de: 'wird machen' },
			{ es: 'irá', en: 'will go', de: 'wird gehen' },
			{ es: 'vendrá', en: 'will come', de: 'wird kommen' },
			{ es: 'podrá', en: 'will be able to', de: 'wird können' },
			{ es: 'querrá', en: 'will want', de: 'wird wollen' },
			{ es: 'sabrá', en: 'will know', de: 'wird wissen' },
			{ es: 'dirá', en: 'will say', de: 'wird sagen' },
			{ es: 'pronto', en: 'soon', de: 'bald' },
			{ es: 'después', en: 'after', de: 'danach' },
			{ es: 'luego', en: 'later', de: 'später' },
			{ es: 'algún día', en: 'someday', de: 'eines Tages' },
			{ es: 'próximo', en: 'next', de: 'nächste' },
			{ es: 'futuro', en: 'future', de: 'Zukunft' },
			{ es: 'planear', en: 'to plan', de: 'planen' },
			{ es: 'esperar', en: 'to hope/wait', de: 'hoffen/warten' },
			{ es: 'pensar', en: 'to think/plan', de: 'denken/planen' },
			{ es: 'decidir', en: 'to decide', de: 'entscheiden' }
		],
		sentences: [
			{ es: 'Mañana iré al doctor.', en: 'Tomorrow I will go to the doctor.' },
			{ es: 'El próximo año viajaré a España.', en: 'Next year I will travel to Spain.' },
			{ es: '¿Qué harás este fin de semana?', en: 'What will you do this weekend?' },
			{ es: 'Ella vendrá a la fiesta.', en: 'She will come to the party.' },
			{ es: 'Pronto sabremos los resultados.', en: 'Soon we will know the results.' }
		]
	},
	{
		title: 'Technology',
		description: 'Digital world vocabulary',
		themeColor: '#00BCD4',
		vocab: [
			{ es: 'internet', en: 'internet', de: 'Internet' },
			{ es: 'teléfono', en: 'phone', de: 'Telefon' },
			{ es: 'aplicación', en: 'app', de: 'App' },
			{ es: 'mensaje', en: 'message', de: 'Nachricht' },
			{ es: 'llamada', en: 'call', de: 'Anruf' },
			{ es: 'pantalla', en: 'screen', de: 'Bildschirm' },
			{ es: 'batería', en: 'battery', de: 'Batterie' },
			{ es: 'cargador', en: 'charger', de: 'Ladegerät' },
			{ es: 'contraseña', en: 'password', de: 'Passwort' },
			{ es: 'cuenta', en: 'account', de: 'Konto' },
			{ es: 'descargar', en: 'to download', de: 'herunterladen' },
			{ es: 'subir', en: 'to upload', de: 'hochladen' },
			{ es: 'buscar', en: 'to search', de: 'suchen' },
			{ es: 'conectar', en: 'to connect', de: 'verbinden' },
			{ es: 'red', en: 'network', de: 'Netzwerk' },
			{ es: 'sitio web', en: 'website', de: 'Webseite' },
			{ es: 'video', en: 'video', de: 'Video' },
			{ es: 'foto', en: 'photo', de: 'Foto' },
			{ es: 'usuario', en: 'user', de: 'Benutzer' },
			{ es: 'datos', en: 'data', de: 'Daten' }
		],
		sentences: [
			{ es: 'No tengo internet.', en: 'I do not have internet.' },
			{ es: 'Descarga esta aplicación.', en: 'Download this app.' },
			{ es: 'Mi batería está baja.', en: 'My battery is low.' },
			{ es: '¿Cuál es la contraseña?', en: 'What is the password?' },
			{ es: 'Subí una foto nueva.', en: 'I uploaded a new photo.' }
		]
	},
	// Add more B1 units...
	{
		title: 'Environment',
		description: 'Talk about environmental topics',
		themeColor: '#4CAF50',
		vocab: [
			{ es: 'ambiente', en: 'environment', de: 'Umwelt' },
			{ es: 'contaminación', en: 'pollution', de: 'Verschmutzung' },
			{ es: 'reciclar', en: 'to recycle', de: 'recyceln' },
			{ es: 'basura', en: 'trash', de: 'Müll' },
			{ es: 'energía', en: 'energy', de: 'Energie' },
			{ es: 'solar', en: 'solar', de: 'Solar' },
			{ es: 'clima', en: 'climate', de: 'Klima' },
			{ es: 'calentamiento', en: 'warming', de: 'Erwärmung' },
			{ es: 'proteger', en: 'to protect', de: 'schützen' },
			{ es: 'conservar', en: 'to conserve', de: 'bewahren' },
			{ es: 'naturaleza', en: 'nature', de: 'Natur' },
			{ es: 'recursos', en: 'resources', de: 'Ressourcen' },
			{ es: 'renovable', en: 'renewable', de: 'erneuerbar' },
			{ es: 'ecológico', en: 'ecological', de: 'ökologisch' },
			{ es: 'sostenible', en: 'sustainable', de: 'nachhaltig' },
			{ es: 'deforestación', en: 'deforestation', de: 'Abholzung' },
			{ es: 'extinción', en: 'extinction', de: 'Aussterben' },
			{ es: 'especie', en: 'species', de: 'Art' },
			{ es: 'peligro', en: 'danger', de: 'Gefahr' },
			{ es: 'planeta', en: 'planet', de: 'Planet' }
		],
		sentences: [
			{ es: 'Debemos reciclar más.', en: 'We should recycle more.' },
			{ es: 'La contaminación es un problema grave.', en: 'Pollution is a serious problem.' },
			{ es: 'El clima está cambiando.', en: 'The climate is changing.' },
			{ es: 'Hay que proteger el planeta.', en: 'We must protect the planet.' },
			{ es: 'Muchas especies están en peligro.', en: 'Many species are in danger.' }
		]
	}
];

export const B2_UNITS: UnitVocab[] = [
	{
		title: 'Politics & Society',
		description: 'Discuss political and social issues',
		themeColor: '#9C27B0',
		vocab: [
			{ es: 'gobierno', en: 'government', de: 'Regierung' },
			{ es: 'política', en: 'politics', de: 'Politik' },
			{ es: 'elección', en: 'election', de: 'Wahl' },
			{ es: 'votar', en: 'to vote', de: 'wählen' },
			{ es: 'democracia', en: 'democracy', de: 'Demokratie' },
			{ es: 'ley', en: 'law', de: 'Gesetz' },
			{ es: 'derecho', en: 'right', de: 'Recht' },
			{ es: 'libertad', en: 'freedom', de: 'Freiheit' },
			{ es: 'igualdad', en: 'equality', de: 'Gleichheit' },
			{ es: 'justicia', en: 'justice', de: 'Gerechtigkeit' },
			{ es: 'ciudadano', en: 'citizen', de: 'Bürger' },
			{ es: 'presidente', en: 'president', de: 'Präsident' },
			{ es: 'partido', en: 'party', de: 'Partei' },
			{ es: 'congreso', en: 'congress', de: 'Kongress' },
			{ es: 'constitución', en: 'constitution', de: 'Verfassung' },
			{ es: 'protesta', en: 'protest', de: 'Protest' },
			{ es: 'manifestación', en: 'demonstration', de: 'Demonstration' },
			{ es: 'reforma', en: 'reform', de: 'Reform' },
			{ es: 'corrupción', en: 'corruption', de: 'Korruption' },
			{ es: 'economía', en: 'economy', de: 'Wirtschaft' }
		],
		sentences: [
			{ es: 'Las elecciones son el próximo mes.', en: 'Elections are next month.' },
			{ es: 'Todos tenemos el derecho de votar.', en: 'We all have the right to vote.' },
			{ es: 'El gobierno anunció nuevas reformas.', en: 'The government announced new reforms.' },
			{ es: 'La democracia es importante.', en: 'Democracy is important.' },
			{ es: 'Hay una manifestación en la plaza.', en: 'There is a demonstration in the square.' }
		]
	},
	{
		title: 'Business & Finance',
		description: 'Professional business vocabulary',
		themeColor: '#FF9800',
		vocab: [
			{ es: 'negocio', en: 'business', de: 'Geschäft' },
			{ es: 'inversión', en: 'investment', de: 'Investition' },
			{ es: 'mercado', en: 'market', de: 'Markt' },
			{ es: 'acción', en: 'stock', de: 'Aktie' },
			{ es: 'presupuesto', en: 'budget', de: 'Budget' },
			{ es: 'beneficio', en: 'profit', de: 'Gewinn' },
			{ es: 'pérdida', en: 'loss', de: 'Verlust' },
			{ es: 'impuesto', en: 'tax', de: 'Steuer' },
			{ es: 'préstamo', en: 'loan', de: 'Kredit' },
			{ es: 'deuda', en: 'debt', de: 'Schulden' },
			{ es: 'contrato', en: 'contract', de: 'Vertrag' },
			{ es: 'socio', en: 'partner', de: 'Partner' },
			{ es: 'competencia', en: 'competition', de: 'Wettbewerb' },
			{ es: 'estrategia', en: 'strategy', de: 'Strategie' },
			{ es: 'marketing', en: 'marketing', de: 'Marketing' },
			{ es: 'cliente', en: 'client', de: 'Kunde' },
			{ es: 'proveedor', en: 'supplier', de: 'Lieferant' },
			{ es: 'producto', en: 'product', de: 'Produkt' },
			{ es: 'servicio', en: 'service', de: 'Dienstleistung' },
			{ es: 'éxito', en: 'success', de: 'Erfolg' }
		],
		sentences: [
			{ es: 'El negocio está creciendo.', en: 'The business is growing.' },
			{ es: 'Necesitamos revisar el presupuesto.', en: 'We need to review the budget.' },
			{ es: 'La inversión fue exitosa.', en: 'The investment was successful.' },
			{ es: 'Firmamos el contrato ayer.', en: 'We signed the contract yesterday.' },
			{ es: 'La competencia es muy fuerte.', en: 'The competition is very strong.' }
		]
	}
];

export const C1_UNITS: UnitVocab[] = [
	{
		title: 'Academic Writing',
		description: 'Formal and academic expressions',
		themeColor: '#3F51B5',
		vocab: [
			{ es: 'hipótesis', en: 'hypothesis', de: 'Hypothese' },
			{ es: 'argumento', en: 'argument', de: 'Argument' },
			{ es: 'conclusión', en: 'conclusion', de: 'Schlussfolgerung' },
			{ es: 'análisis', en: 'analysis', de: 'Analyse' },
			{ es: 'metodología', en: 'methodology', de: 'Methodologie' },
			{ es: 'investigación', en: 'research', de: 'Forschung' },
			{ es: 'evidencia', en: 'evidence', de: 'Beweis' },
			{ es: 'teoría', en: 'theory', de: 'Theorie' },
			{ es: 'referencia', en: 'reference', de: 'Referenz' },
			{ es: 'citar', en: 'to cite', de: 'zitieren' },
			{ es: 'fuente', en: 'source', de: 'Quelle' },
			{ es: 'objetivo', en: 'objective', de: 'objektiv' },
			{ es: 'subjetivo', en: 'subjective', de: 'subjektiv' },
			{ es: 'perspectiva', en: 'perspective', de: 'Perspektive' },
			{ es: 'contexto', en: 'context', de: 'Kontext' },
			{ es: 'síntesis', en: 'synthesis', de: 'Synthese' },
			{ es: 'crítica', en: 'critique', de: 'Kritik' },
			{ es: 'evaluar', en: 'to evaluate', de: 'bewerten' },
			{ es: 'inferir', en: 'to infer', de: 'folgern' },
			{ es: 'implicar', en: 'to imply', de: 'implizieren' }
		],
		sentences: [
			{ es: 'La hipótesis fue confirmada.', en: 'The hypothesis was confirmed.' },
			{ es: 'Según la investigación...', en: 'According to the research...' },
			{ es: 'La evidencia sugiere que...', en: 'The evidence suggests that...' },
			{ es: 'En conclusión, podemos afirmar...', en: 'In conclusion, we can affirm...' },
			{ es: 'Es necesario analizar el contexto.', en: 'It is necessary to analyze the context.' }
		]
	}
];

export const C2_UNITS: UnitVocab[] = [
	{
		title: 'Idiomatic Expressions',
		description: 'Advanced idioms and expressions',
		themeColor: '#E91E63',
		vocab: [
			{ es: 'pan comido', en: 'piece of cake', de: 'ein Kinderspiel' },
			{ es: 'meter la pata', en: 'to put your foot in it', de: 'ins Fettnäpfchen treten' },
			{ es: 'tomar el pelo', en: 'to pull someone\'s leg', de: 'jemanden auf den Arm nehmen' },
			{ es: 'estar en las nubes', en: 'to have your head in the clouds', de: 'mit den Gedanken woanders sein' },
			{ es: 'costar un ojo de la cara', en: 'to cost an arm and a leg', de: 'ein Vermögen kosten' },
			{ es: 'ser uña y carne', en: 'to be thick as thieves', de: 'ein Herz und eine Seele sein' },
			{ es: 'no tener pelos en la lengua', en: 'to not mince words', de: 'kein Blatt vor den Mund nehmen' },
			{ es: 'estar como pez en el agua', en: 'to be in one\'s element', de: 'sich wie ein Fisch im Wasser fühlen' },
			{ es: 'llover a cántaros', en: 'to rain cats and dogs', de: 'in Strömen regnen' },
			{ es: 'dar en el clavo', en: 'to hit the nail on the head', de: 'den Nagel auf den Kopf treffen' },
			{ es: 'ponerse las pilas', en: 'to get one\'s act together', de: 'in die Gänge kommen' },
			{ es: 'ser pan comido', en: 'to be a piece of cake', de: 'ein Kinderspiel sein' },
			{ es: 'echar una mano', en: 'to lend a hand', de: 'unter die Arme greifen' },
			{ es: 'tener mala leche', en: 'to be in a bad mood', de: 'schlechte Laune haben' },
			{ es: 'quedarse de piedra', en: 'to be stunned', de: 'wie versteinert sein' },
			{ es: 'tirar la toalla', en: 'to throw in the towel', de: 'das Handtuch werfen' },
			{ es: 'dormir como un tronco', en: 'to sleep like a log', de: 'wie ein Stein schlafen' },
			{ es: 'estar hecho polvo', en: 'to be exhausted', de: 'völlig fertig sein' },
			{ es: 'no dar pie con bola', en: 'to not get anything right', de: 'nichts auf die Reihe kriegen' },
			{ es: 'pillar el toro', en: 'to be too late', de: 'zu spät kommen' }
		],
		sentences: [
			{ es: 'Este examen fue pan comido.', en: 'This exam was a piece of cake.' },
			{ es: 'Metí la pata en la reunión.', en: 'I put my foot in it at the meeting.' },
			{ es: 'No me tomes el pelo.', en: 'Don\'t pull my leg.' },
			{ es: 'Siempre estás en las nubes.', en: 'You always have your head in the clouds.' },
			{ es: 'El carro me costó un ojo de la cara.', en: 'The car cost me an arm and a leg.' }
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
