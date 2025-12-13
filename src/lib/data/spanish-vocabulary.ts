// Spanish vocabulary data organized by level and topic
// Each entry has Spanish word, English translation, and category

export interface VocabItem {
	es: string;
	en: string;
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
			{ es: 'hola', en: 'hello' },
			{ es: 'adiós', en: 'goodbye' },
			{ es: 'buenos días', en: 'good morning' },
			{ es: 'buenas tardes', en: 'good afternoon' },
			{ es: 'buenas noches', en: 'good night' },
			{ es: 'hasta luego', en: 'see you later' },
			{ es: 'hasta mañana', en: 'see you tomorrow' },
			{ es: 'por favor', en: 'please' },
			{ es: 'gracias', en: 'thank you' },
			{ es: 'de nada', en: 'you are welcome' },
			{ es: 'perdón', en: 'sorry' },
			{ es: 'disculpe', en: 'excuse me' },
			{ es: 'sí', en: 'yes' },
			{ es: 'no', en: 'no' },
			{ es: 'yo', en: 'I' },
			{ es: 'tú', en: 'you' },
			{ es: 'usted', en: 'you (formal)' },
			{ es: 'señor', en: 'mister' },
			{ es: 'señora', en: 'mrs' },
			{ es: 'señorita', en: 'miss' }
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
			{ es: 'uno', en: 'one' },
			{ es: 'dos', en: 'two' },
			{ es: 'tres', en: 'three' },
			{ es: 'cuatro', en: 'four' },
			{ es: 'cinco', en: 'five' },
			{ es: 'seis', en: 'six' },
			{ es: 'siete', en: 'seven' },
			{ es: 'ocho', en: 'eight' },
			{ es: 'nueve', en: 'nine' },
			{ es: 'diez', en: 'ten' },
			{ es: 'once', en: 'eleven' },
			{ es: 'doce', en: 'twelve' },
			{ es: 'veinte', en: 'twenty' },
			{ es: 'treinta', en: 'thirty' },
			{ es: 'cuarenta', en: 'forty' },
			{ es: 'cincuenta', en: 'fifty' },
			{ es: 'cien', en: 'one hundred' },
			{ es: 'primero', en: 'first' },
			{ es: 'segundo', en: 'second' },
			{ es: 'tercero', en: 'third' }
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
			{ es: 'familia', en: 'family' },
			{ es: 'madre', en: 'mother' },
			{ es: 'padre', en: 'father' },
			{ es: 'hermano', en: 'brother' },
			{ es: 'hermana', en: 'sister' },
			{ es: 'hijo', en: 'son' },
			{ es: 'hija', en: 'daughter' },
			{ es: 'abuelo', en: 'grandfather' },
			{ es: 'abuela', en: 'grandmother' },
			{ es: 'tío', en: 'uncle' },
			{ es: 'tía', en: 'aunt' },
			{ es: 'primo', en: 'cousin (male)' },
			{ es: 'prima', en: 'cousin (female)' },
			{ es: 'esposo', en: 'husband' },
			{ es: 'esposa', en: 'wife' },
			{ es: 'niño', en: 'child (boy)' },
			{ es: 'niña', en: 'child (girl)' },
			{ es: 'bebé', en: 'baby' },
			{ es: 'padres', en: 'parents' },
			{ es: 'hijos', en: 'children' }
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
			{ es: 'rojo', en: 'red' },
			{ es: 'azul', en: 'blue' },
			{ es: 'verde', en: 'green' },
			{ es: 'amarillo', en: 'yellow' },
			{ es: 'naranja', en: 'orange' },
			{ es: 'morado', en: 'purple' },
			{ es: 'rosa', en: 'pink' },
			{ es: 'negro', en: 'black' },
			{ es: 'blanco', en: 'white' },
			{ es: 'gris', en: 'gray' },
			{ es: 'marrón', en: 'brown' },
			{ es: 'dorado', en: 'golden' },
			{ es: 'plateado', en: 'silver' },
			{ es: 'claro', en: 'light' },
			{ es: 'oscuro', en: 'dark' },
			{ es: 'color', en: 'color' },
			{ es: 'colorido', en: 'colorful' },
			{ es: 'brillante', en: 'bright' },
			{ es: 'pálido', en: 'pale' },
			{ es: 'vivo', en: 'vivid' }
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
			{ es: 'agua', en: 'water' },
			{ es: 'pan', en: 'bread' },
			{ es: 'leche', en: 'milk' },
			{ es: 'café', en: 'coffee' },
			{ es: 'té', en: 'tea' },
			{ es: 'jugo', en: 'juice' },
			{ es: 'carne', en: 'meat' },
			{ es: 'pollo', en: 'chicken' },
			{ es: 'pescado', en: 'fish' },
			{ es: 'arroz', en: 'rice' },
			{ es: 'huevo', en: 'egg' },
			{ es: 'queso', en: 'cheese' },
			{ es: 'fruta', en: 'fruit' },
			{ es: 'manzana', en: 'apple' },
			{ es: 'naranja', en: 'orange' },
			{ es: 'plátano', en: 'banana' },
			{ es: 'verdura', en: 'vegetable' },
			{ es: 'ensalada', en: 'salad' },
			{ es: 'sopa', en: 'soup' },
			{ es: 'postre', en: 'dessert' }
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
			{ es: 'lunes', en: 'Monday' },
			{ es: 'martes', en: 'Tuesday' },
			{ es: 'miércoles', en: 'Wednesday' },
			{ es: 'jueves', en: 'Thursday' },
			{ es: 'viernes', en: 'Friday' },
			{ es: 'sábado', en: 'Saturday' },
			{ es: 'domingo', en: 'Sunday' },
			{ es: 'semana', en: 'week' },
			{ es: 'mes', en: 'month' },
			{ es: 'año', en: 'year' },
			{ es: 'hoy', en: 'today' },
			{ es: 'mañana', en: 'tomorrow' },
			{ es: 'ayer', en: 'yesterday' },
			{ es: 'hora', en: 'hour' },
			{ es: 'minuto', en: 'minute' },
			{ es: 'segundo', en: 'second' },
			{ es: 'mediodía', en: 'noon' },
			{ es: 'medianoche', en: 'midnight' },
			{ es: 'temprano', en: 'early' },
			{ es: 'tarde', en: 'late' }
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
			{ es: 'cabeza', en: 'head' },
			{ es: 'ojo', en: 'eye' },
			{ es: 'oreja', en: 'ear' },
			{ es: 'nariz', en: 'nose' },
			{ es: 'boca', en: 'mouth' },
			{ es: 'diente', en: 'tooth' },
			{ es: 'lengua', en: 'tongue' },
			{ es: 'cuello', en: 'neck' },
			{ es: 'brazo', en: 'arm' },
			{ es: 'mano', en: 'hand' },
			{ es: 'dedo', en: 'finger' },
			{ es: 'pierna', en: 'leg' },
			{ es: 'pie', en: 'foot' },
			{ es: 'espalda', en: 'back' },
			{ es: 'pecho', en: 'chest' },
			{ es: 'estómago', en: 'stomach' },
			{ es: 'corazón', en: 'heart' },
			{ es: 'pelo', en: 'hair' },
			{ es: 'cara', en: 'face' },
			{ es: 'cuerpo', en: 'body' }
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
			{ es: 'camisa', en: 'shirt' },
			{ es: 'pantalón', en: 'pants' },
			{ es: 'vestido', en: 'dress' },
			{ es: 'falda', en: 'skirt' },
			{ es: 'zapatos', en: 'shoes' },
			{ es: 'calcetines', en: 'socks' },
			{ es: 'chaqueta', en: 'jacket' },
			{ es: 'abrigo', en: 'coat' },
			{ es: 'sombrero', en: 'hat' },
			{ es: 'gorra', en: 'cap' },
			{ es: 'bufanda', en: 'scarf' },
			{ es: 'guantes', en: 'gloves' },
			{ es: 'cinturón', en: 'belt' },
			{ es: 'corbata', en: 'tie' },
			{ es: 'bolso', en: 'bag' },
			{ es: 'ropa', en: 'clothes' },
			{ es: 'camiseta', en: 't-shirt' },
			{ es: 'jeans', en: 'jeans' },
			{ es: 'botas', en: 'boots' },
			{ es: 'pijama', en: 'pajamas' }
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
			{ es: 'casa', en: 'house' },
			{ es: 'apartamento', en: 'apartment' },
			{ es: 'habitación', en: 'room' },
			{ es: 'cocina', en: 'kitchen' },
			{ es: 'baño', en: 'bathroom' },
			{ es: 'dormitorio', en: 'bedroom' },
			{ es: 'sala', en: 'living room' },
			{ es: 'comedor', en: 'dining room' },
			{ es: 'puerta', en: 'door' },
			{ es: 'ventana', en: 'window' },
			{ es: 'mesa', en: 'table' },
			{ es: 'silla', en: 'chair' },
			{ es: 'cama', en: 'bed' },
			{ es: 'sofá', en: 'sofa' },
			{ es: 'lámpara', en: 'lamp' },
			{ es: 'espejo', en: 'mirror' },
			{ es: 'escalera', en: 'stairs' },
			{ es: 'jardín', en: 'garden' },
			{ es: 'garaje', en: 'garage' },
			{ es: 'techo', en: 'roof' }
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
			{ es: 'ser', en: 'to be' },
			{ es: 'estar', en: 'to be' },
			{ es: 'tener', en: 'to have' },
			{ es: 'hacer', en: 'to do/make' },
			{ es: 'ir', en: 'to go' },
			{ es: 'venir', en: 'to come' },
			{ es: 'ver', en: 'to see' },
			{ es: 'dar', en: 'to give' },
			{ es: 'saber', en: 'to know' },
			{ es: 'poder', en: 'can/to be able' },
			{ es: 'querer', en: 'to want' },
			{ es: 'decir', en: 'to say' },
			{ es: 'hablar', en: 'to speak' },
			{ es: 'comer', en: 'to eat' },
			{ es: 'beber', en: 'to drink' },
			{ es: 'dormir', en: 'to sleep' },
			{ es: 'vivir', en: 'to live' },
			{ es: 'trabajar', en: 'to work' },
			{ es: 'estudiar', en: 'to study' },
			{ es: 'jugar', en: 'to play' }
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
			{ es: 'tiempo', en: 'weather' },
			{ es: 'sol', en: 'sun' },
			{ es: 'lluvia', en: 'rain' },
			{ es: 'nieve', en: 'snow' },
			{ es: 'viento', en: 'wind' },
			{ es: 'nube', en: 'cloud' },
			{ es: 'tormenta', en: 'storm' },
			{ es: 'calor', en: 'heat' },
			{ es: 'frío', en: 'cold' },
			{ es: 'primavera', en: 'spring' },
			{ es: 'verano', en: 'summer' },
			{ es: 'otoño', en: 'autumn' },
			{ es: 'invierno', en: 'winter' },
			{ es: 'temperatura', en: 'temperature' },
			{ es: 'grado', en: 'degree' },
			{ es: 'húmedo', en: 'humid' },
			{ es: 'seco', en: 'dry' },
			{ es: 'nublado', en: 'cloudy' },
			{ es: 'soleado', en: 'sunny' },
			{ es: 'lluvioso', en: 'rainy' }
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
			{ es: 'avión', en: 'airplane' },
			{ es: 'tren', en: 'train' },
			{ es: 'autobús', en: 'bus' },
			{ es: 'carro', en: 'car' },
			{ es: 'bicicleta', en: 'bicycle' },
			{ es: 'barco', en: 'boat' },
			{ es: 'taxi', en: 'taxi' },
			{ es: 'metro', en: 'subway' },
			{ es: 'aeropuerto', en: 'airport' },
			{ es: 'estación', en: 'station' },
			{ es: 'boleto', en: 'ticket' },
			{ es: 'pasaporte', en: 'passport' },
			{ es: 'maleta', en: 'suitcase' },
			{ es: 'viaje', en: 'trip' },
			{ es: 'destino', en: 'destination' },
			{ es: 'llegada', en: 'arrival' },
			{ es: 'salida', en: 'departure' },
			{ es: 'equipaje', en: 'luggage' },
			{ es: 'reservación', en: 'reservation' },
			{ es: 'turista', en: 'tourist' }
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
			{ es: 'tienda', en: 'store' },
			{ es: 'mercado', en: 'market' },
			{ es: 'precio', en: 'price' },
			{ es: 'dinero', en: 'money' },
			{ es: 'tarjeta', en: 'card' },
			{ es: 'efectivo', en: 'cash' },
			{ es: 'cuenta', en: 'bill' },
			{ es: 'cambio', en: 'change' },
			{ es: 'descuento', en: 'discount' },
			{ es: 'oferta', en: 'sale' },
			{ es: 'barato', en: 'cheap' },
			{ es: 'caro', en: 'expensive' },
			{ es: 'comprar', en: 'to buy' },
			{ es: 'vender', en: 'to sell' },
			{ es: 'pagar', en: 'to pay' },
			{ es: 'cliente', en: 'customer' },
			{ es: 'vendedor', en: 'salesperson' },
			{ es: 'recibo', en: 'receipt' },
			{ es: 'caja', en: 'cashier' },
			{ es: 'bolsa', en: 'bag' }
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
			{ es: 'médico', en: 'doctor' },
			{ es: 'hospital', en: 'hospital' },
			{ es: 'enfermera', en: 'nurse' },
			{ es: 'medicina', en: 'medicine' },
			{ es: 'enfermo', en: 'sick' },
			{ es: 'sano', en: 'healthy' },
			{ es: 'dolor', en: 'pain' },
			{ es: 'fiebre', en: 'fever' },
			{ es: 'gripe', en: 'flu' },
			{ es: 'tos', en: 'cough' },
			{ es: 'resfriado', en: 'cold' },
			{ es: 'alergia', en: 'allergy' },
			{ es: 'cita', en: 'appointment' },
			{ es: 'receta', en: 'prescription' },
			{ es: 'pastilla', en: 'pill' },
			{ es: 'farmacia', en: 'pharmacy' },
			{ es: 'emergencia', en: 'emergency' },
			{ es: 'ambulancia', en: 'ambulance' },
			{ es: 'sangre', en: 'blood' },
			{ es: 'herida', en: 'wound' }
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
			{ es: 'trabajo', en: 'work/job' },
			{ es: 'oficina', en: 'office' },
			{ es: 'jefe', en: 'boss' },
			{ es: 'empleado', en: 'employee' },
			{ es: 'profesor', en: 'teacher' },
			{ es: 'abogado', en: 'lawyer' },
			{ es: 'ingeniero', en: 'engineer' },
			{ es: 'cocinero', en: 'cook' },
			{ es: 'policía', en: 'police' },
			{ es: 'bombero', en: 'firefighter' },
			{ es: 'escritor', en: 'writer' },
			{ es: 'artista', en: 'artist' },
			{ es: 'músico', en: 'musician' },
			{ es: 'salario', en: 'salary' },
			{ es: 'reunión', en: 'meeting' },
			{ es: 'computadora', en: 'computer' },
			{ es: 'correo', en: 'email' },
			{ es: 'proyecto', en: 'project' },
			{ es: 'empresa', en: 'company' },
			{ es: 'carrera', en: 'career' }
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
			{ es: 'escuela', en: 'school' },
			{ es: 'universidad', en: 'university' },
			{ es: 'clase', en: 'class' },
			{ es: 'estudiante', en: 'student' },
			{ es: 'maestro', en: 'teacher' },
			{ es: 'libro', en: 'book' },
			{ es: 'cuaderno', en: 'notebook' },
			{ es: 'lápiz', en: 'pencil' },
			{ es: 'bolígrafo', en: 'pen' },
			{ es: 'examen', en: 'exam' },
			{ es: 'tarea', en: 'homework' },
			{ es: 'nota', en: 'grade' },
			{ es: 'pizarra', en: 'blackboard' },
			{ es: 'biblioteca', en: 'library' },
			{ es: 'idioma', en: 'language' },
			{ es: 'matemáticas', en: 'mathematics' },
			{ es: 'ciencia', en: 'science' },
			{ es: 'historia', en: 'history' },
			{ es: 'geografía', en: 'geography' },
			{ es: 'arte', en: 'art' }
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
			{ es: 'deporte', en: 'sport' },
			{ es: 'fútbol', en: 'soccer' },
			{ es: 'baloncesto', en: 'basketball' },
			{ es: 'tenis', en: 'tennis' },
			{ es: 'natación', en: 'swimming' },
			{ es: 'correr', en: 'to run' },
			{ es: 'caminar', en: 'to walk' },
			{ es: 'equipo', en: 'team' },
			{ es: 'pelota', en: 'ball' },
			{ es: 'partido', en: 'game/match' },
			{ es: 'ganar', en: 'to win' },
			{ es: 'perder', en: 'to lose' },
			{ es: 'música', en: 'music' },
			{ es: 'película', en: 'movie' },
			{ es: 'leer', en: 'to read' },
			{ es: 'cocinar', en: 'to cook' },
			{ es: 'bailar', en: 'to dance' },
			{ es: 'cantar', en: 'to sing' },
			{ es: 'pintar', en: 'to paint' },
			{ es: 'fotografía', en: 'photography' }
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
			{ es: 'ciudad', en: 'city' },
			{ es: 'pueblo', en: 'town' },
			{ es: 'calle', en: 'street' },
			{ es: 'plaza', en: 'square' },
			{ es: 'parque', en: 'park' },
			{ es: 'banco', en: 'bank' },
			{ es: 'restaurante', en: 'restaurant' },
			{ es: 'supermercado', en: 'supermarket' },
			{ es: 'museo', en: 'museum' },
			{ es: 'teatro', en: 'theater' },
			{ es: 'iglesia', en: 'church' },
			{ es: 'hotel', en: 'hotel' },
			{ es: 'centro', en: 'downtown' },
			{ es: 'esquina', en: 'corner' },
			{ es: 'derecha', en: 'right' },
			{ es: 'izquierda', en: 'left' },
			{ es: 'recto', en: 'straight' },
			{ es: 'cerca', en: 'near' },
			{ es: 'lejos', en: 'far' },
			{ es: 'dirección', en: 'direction' }
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
			{ es: 'perro', en: 'dog' },
			{ es: 'gato', en: 'cat' },
			{ es: 'pájaro', en: 'bird' },
			{ es: 'pez', en: 'fish' },
			{ es: 'caballo', en: 'horse' },
			{ es: 'vaca', en: 'cow' },
			{ es: 'cerdo', en: 'pig' },
			{ es: 'árbol', en: 'tree' },
			{ es: 'flor', en: 'flower' },
			{ es: 'planta', en: 'plant' },
			{ es: 'río', en: 'river' },
			{ es: 'mar', en: 'sea' },
			{ es: 'montaña', en: 'mountain' },
			{ es: 'bosque', en: 'forest' },
			{ es: 'playa', en: 'beach' },
			{ es: 'lago', en: 'lake' },
			{ es: 'cielo', en: 'sky' },
			{ es: 'estrella', en: 'star' },
			{ es: 'luna', en: 'moon' },
			{ es: 'tierra', en: 'earth' }
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
			{ es: 'feliz', en: 'happy' },
			{ es: 'triste', en: 'sad' },
			{ es: 'enojado', en: 'angry' },
			{ es: 'cansado', en: 'tired' },
			{ es: 'nervioso', en: 'nervous' },
			{ es: 'preocupado', en: 'worried' },
			{ es: 'sorprendido', en: 'surprised' },
			{ es: 'emocionado', en: 'excited' },
			{ es: 'aburrido', en: 'bored' },
			{ es: 'asustado', en: 'scared' },
			{ es: 'tranquilo', en: 'calm' },
			{ es: 'contento', en: 'content' },
			{ es: 'amor', en: 'love' },
			{ es: 'odio', en: 'hate' },
			{ es: 'miedo', en: 'fear' },
			{ es: 'alegría', en: 'joy' },
			{ es: 'tristeza', en: 'sadness' },
			{ es: 'esperanza', en: 'hope' },
			{ es: 'confusión', en: 'confusion' },
			{ es: 'orgullo', en: 'pride' }
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
			{ es: 'fue', en: 'was/went' },
			{ es: 'estuvo', en: 'was (state)' },
			{ es: 'tuvo', en: 'had' },
			{ es: 'hizo', en: 'did/made' },
			{ es: 'dijo', en: 'said' },
			{ es: 'vino', en: 'came' },
			{ es: 'vio', en: 'saw' },
			{ es: 'dio', en: 'gave' },
			{ es: 'supo', en: 'knew' },
			{ es: 'pudo', en: 'could' },
			{ es: 'quiso', en: 'wanted' },
			{ es: 'comió', en: 'ate' },
			{ es: 'bebió', en: 'drank' },
			{ es: 'durmió', en: 'slept' },
			{ es: 'escribió', en: 'wrote' },
			{ es: 'leyó', en: 'read' },
			{ es: 'oyó', en: 'heard' },
			{ es: 'sintió', en: 'felt' },
			{ es: 'pidió', en: 'asked for' },
			{ es: 'murió', en: 'died' }
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
			{ es: 'será', en: 'will be' },
			{ es: 'estará', en: 'will be (location)' },
			{ es: 'tendrá', en: 'will have' },
			{ es: 'hará', en: 'will do/make' },
			{ es: 'irá', en: 'will go' },
			{ es: 'vendrá', en: 'will come' },
			{ es: 'podrá', en: 'will be able to' },
			{ es: 'querrá', en: 'will want' },
			{ es: 'sabrá', en: 'will know' },
			{ es: 'dirá', en: 'will say' },
			{ es: 'pronto', en: 'soon' },
			{ es: 'después', en: 'after' },
			{ es: 'luego', en: 'later' },
			{ es: 'algún día', en: 'someday' },
			{ es: 'próximo', en: 'next' },
			{ es: 'futuro', en: 'future' },
			{ es: 'planear', en: 'to plan' },
			{ es: 'esperar', en: 'to hope/wait' },
			{ es: 'pensar', en: 'to think/plan' },
			{ es: 'decidir', en: 'to decide' }
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
			{ es: 'internet', en: 'internet' },
			{ es: 'teléfono', en: 'phone' },
			{ es: 'aplicación', en: 'app' },
			{ es: 'mensaje', en: 'message' },
			{ es: 'llamada', en: 'call' },
			{ es: 'pantalla', en: 'screen' },
			{ es: 'batería', en: 'battery' },
			{ es: 'cargador', en: 'charger' },
			{ es: 'contraseña', en: 'password' },
			{ es: 'cuenta', en: 'account' },
			{ es: 'descargar', en: 'to download' },
			{ es: 'subir', en: 'to upload' },
			{ es: 'buscar', en: 'to search' },
			{ es: 'conectar', en: 'to connect' },
			{ es: 'red', en: 'network' },
			{ es: 'sitio web', en: 'website' },
			{ es: 'video', en: 'video' },
			{ es: 'foto', en: 'photo' },
			{ es: 'usuario', en: 'user' },
			{ es: 'datos', en: 'data' }
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
			{ es: 'ambiente', en: 'environment' },
			{ es: 'contaminación', en: 'pollution' },
			{ es: 'reciclar', en: 'to recycle' },
			{ es: 'basura', en: 'trash' },
			{ es: 'energía', en: 'energy' },
			{ es: 'solar', en: 'solar' },
			{ es: 'clima', en: 'climate' },
			{ es: 'calentamiento', en: 'warming' },
			{ es: 'proteger', en: 'to protect' },
			{ es: 'conservar', en: 'to conserve' },
			{ es: 'naturaleza', en: 'nature' },
			{ es: 'recursos', en: 'resources' },
			{ es: 'renovable', en: 'renewable' },
			{ es: 'ecológico', en: 'ecological' },
			{ es: 'sostenible', en: 'sustainable' },
			{ es: 'deforestación', en: 'deforestation' },
			{ es: 'extinción', en: 'extinction' },
			{ es: 'especie', en: 'species' },
			{ es: 'peligro', en: 'danger' },
			{ es: 'planeta', en: 'planet' }
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
			{ es: 'gobierno', en: 'government' },
			{ es: 'política', en: 'politics' },
			{ es: 'elección', en: 'election' },
			{ es: 'votar', en: 'to vote' },
			{ es: 'democracia', en: 'democracy' },
			{ es: 'ley', en: 'law' },
			{ es: 'derecho', en: 'right' },
			{ es: 'libertad', en: 'freedom' },
			{ es: 'igualdad', en: 'equality' },
			{ es: 'justicia', en: 'justice' },
			{ es: 'ciudadano', en: 'citizen' },
			{ es: 'presidente', en: 'president' },
			{ es: 'partido', en: 'party' },
			{ es: 'congreso', en: 'congress' },
			{ es: 'constitución', en: 'constitution' },
			{ es: 'protesta', en: 'protest' },
			{ es: 'manifestación', en: 'demonstration' },
			{ es: 'reforma', en: 'reform' },
			{ es: 'corrupción', en: 'corruption' },
			{ es: 'economía', en: 'economy' }
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
			{ es: 'negocio', en: 'business' },
			{ es: 'inversión', en: 'investment' },
			{ es: 'mercado', en: 'market' },
			{ es: 'acción', en: 'stock' },
			{ es: 'presupuesto', en: 'budget' },
			{ es: 'beneficio', en: 'profit' },
			{ es: 'pérdida', en: 'loss' },
			{ es: 'impuesto', en: 'tax' },
			{ es: 'préstamo', en: 'loan' },
			{ es: 'deuda', en: 'debt' },
			{ es: 'contrato', en: 'contract' },
			{ es: 'socio', en: 'partner' },
			{ es: 'competencia', en: 'competition' },
			{ es: 'estrategia', en: 'strategy' },
			{ es: 'marketing', en: 'marketing' },
			{ es: 'cliente', en: 'client' },
			{ es: 'proveedor', en: 'supplier' },
			{ es: 'producto', en: 'product' },
			{ es: 'servicio', en: 'service' },
			{ es: 'éxito', en: 'success' }
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
			{ es: 'hipótesis', en: 'hypothesis' },
			{ es: 'argumento', en: 'argument' },
			{ es: 'conclusión', en: 'conclusion' },
			{ es: 'análisis', en: 'analysis' },
			{ es: 'metodología', en: 'methodology' },
			{ es: 'investigación', en: 'research' },
			{ es: 'evidencia', en: 'evidence' },
			{ es: 'teoría', en: 'theory' },
			{ es: 'referencia', en: 'reference' },
			{ es: 'citar', en: 'to cite' },
			{ es: 'fuente', en: 'source' },
			{ es: 'objetivo', en: 'objective' },
			{ es: 'subjetivo', en: 'subjective' },
			{ es: 'perspectiva', en: 'perspective' },
			{ es: 'contexto', en: 'context' },
			{ es: 'síntesis', en: 'synthesis' },
			{ es: 'crítica', en: 'critique' },
			{ es: 'evaluar', en: 'to evaluate' },
			{ es: 'inferir', en: 'to infer' },
			{ es: 'implicar', en: 'to imply' }
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
			{ es: 'pan comido', en: 'piece of cake' },
			{ es: 'meter la pata', en: 'to put your foot in it' },
			{ es: 'tomar el pelo', en: 'to pull someone\'s leg' },
			{ es: 'estar en las nubes', en: 'to have your head in the clouds' },
			{ es: 'costar un ojo de la cara', en: 'to cost an arm and a leg' },
			{ es: 'ser uña y carne', en: 'to be thick as thieves' },
			{ es: 'no tener pelos en la lengua', en: 'to not mince words' },
			{ es: 'estar como pez en el agua', en: 'to be in one\'s element' },
			{ es: 'llover a cántaros', en: 'to rain cats and dogs' },
			{ es: 'dar en el clavo', en: 'to hit the nail on the head' },
			{ es: 'ponerse las pilas', en: 'to get one\'s act together' },
			{ es: 'ser pan comido', en: 'to be a piece of cake' },
			{ es: 'echar una mano', en: 'to lend a hand' },
			{ es: 'tener mala leche', en: 'to be in a bad mood' },
			{ es: 'quedarse de piedra', en: 'to be stunned' },
			{ es: 'tirar la toalla', en: 'to throw in the towel' },
			{ es: 'dormir como un tronco', en: 'to sleep like a log' },
			{ es: 'estar hecho polvo', en: 'to be exhausted' },
			{ es: 'no dar pie con bola', en: 'to not get anything right' },
			{ es: 'pillar el toro', en: 'to be too late' }
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
