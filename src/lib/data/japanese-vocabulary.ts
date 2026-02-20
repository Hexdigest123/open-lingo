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
		titleDe: 'Begrüssungen & Vorstellungen',
		descriptionEn: 'Learn basic greetings and how to introduce yourself',
		descriptionDe: 'Lerne grundlegende Begrüssungen und stelle dich vor',
		themeColor: '#E60026',
		vocab: [
			{ target: 'こんにちは (konnichiwa)', en: 'hello', de: 'hallo' },
			{ target: 'さようなら (sayonara)', en: 'goodbye', de: 'auf Wiedersehen' },
			{ target: 'おはようございます (ohayo gozaimasu)', en: 'good morning', de: 'guten Morgen' },
			{ target: 'こんばんは (konbanwa)', en: 'good evening', de: 'guten Abend' },
			{ target: 'おやすみなさい (oyasuminasai)', en: 'good night', de: 'gute Nacht' },
			{ target: 'またね (matane)', en: 'see you', de: 'bis dann' },
			{ target: 'また明日 (mata ashita)', en: 'see you tomorrow', de: 'bis morgen' },
			{ target: 'お願いします (onegaishimasu)', en: 'please', de: 'bitte' },
			{ target: 'ありがとう (arigato)', en: 'thank you', de: 'danke' },
			{ target: 'どういたしまして (doitashimashite)', en: 'you are welcome', de: 'gern geschehen' },
			{ target: 'すみません (sumimasen)', en: 'excuse me', de: 'entschuldigung' },
			{ target: 'ごめんなさい (gomennasai)', en: 'sorry', de: 'es tut mir leid' },
			{ target: 'はい (hai)', en: 'yes', de: 'ja' },
			{ target: 'いいえ (iie)', en: 'no', de: 'nein' },
			{ target: 'わたし (watashi)', en: 'I', de: 'ich' },
			{ target: 'あなた (anata)', en: 'you', de: 'du' },
			{ target: '〜さん (san)', en: 'Mr./Ms.', de: 'Herr/Frau' },
			{ target: '先生 (sensei)', en: 'teacher', de: 'Lehrer' },
			{ target: 'はじめまして (hajimemashite)', en: 'nice to meet you', de: 'freut mich' },
			{
				target: 'よろしくお願いします (yoroshiku onegaishimasu)',
				en: 'please treat me well',
				de: 'ich freue mich auf die Zusammenarbeit'
			}
		],
		sentences: [
			{
				target: 'こんにちは、元気ですか。',
				en: 'Hello, how are you?',
				de: 'Hallo, wie geht es dir?'
			},
			{
				target: 'わたしはユキです。はじめまして。',
				en: 'My name is Yuki. Nice to meet you.',
				de: 'Ich heiße Yuki. Freut mich.'
			},
			{
				target: 'すみません、これは何ですか。',
				en: 'Excuse me, what is this?',
				de: 'Entschuldigung, was ist das?'
			},
			{ target: 'ありがとうございます。', en: 'Thank you very much.', de: 'Vielen Dank.' },
			{
				target: 'また明日、学校で会いましょう。',
				en: 'See you tomorrow at school.',
				de: 'Bis morgen in der Schule.'
			}
		]
	},
	{
		titleEn: 'Numbers 1-100',
		titleDe: 'Zahlen 1-100',
		descriptionEn: 'Learn to count and use numbers in Japanese',
		descriptionDe: 'Lerne auf Japanisch zu zählen und Zahlen zu benutzen',
		themeColor: '#2E4A7D',
		vocab: [
			{ target: '一 (ichi)', en: 'one', de: 'eins' },
			{ target: '二 (ni)', en: 'two', de: 'zwei' },
			{ target: '三 (san)', en: 'three', de: 'drei' },
			{ target: '四 (yon)', en: 'four', de: 'vier' },
			{ target: '五 (go)', en: 'five', de: 'fünf' },
			{ target: '六 (roku)', en: 'six', de: 'sechs' },
			{ target: '七 (nana)', en: 'seven', de: 'sieben' },
			{ target: '八 (hachi)', en: 'eight', de: 'acht' },
			{ target: '九 (kyuu)', en: 'nine', de: 'neun' },
			{ target: '十 (juu)', en: 'ten', de: 'zehn' },
			{ target: '十一 (juuichi)', en: 'eleven', de: 'elf' },
			{ target: '十二 (juuni)', en: 'twelve', de: 'zwölf' },
			{ target: '二十 (nijuu)', en: 'twenty', de: 'zwanzig' },
			{ target: '三十 (sanjuu)', en: 'thirty', de: 'dreißig' },
			{ target: '四十 (yonjuu)', en: 'forty', de: 'vierzig' },
			{ target: '五十 (gojuu)', en: 'fifty', de: 'fünfzig' },
			{ target: '百 (hyaku)', en: 'one hundred', de: 'hundert' },
			{ target: '一番 (ichiban)', en: 'first', de: 'erste' },
			{ target: '二番 (niban)', en: 'second', de: 'zweite' },
			{ target: '三番 (sanban)', en: 'third', de: 'dritte' }
		],
		sentences: [
			{
				target: 'わたしは二十歳です。',
				en: 'I am twenty years old.',
				de: 'Ich bin zwanzig Jahre alt.'
			},
			{
				target: 'りんごが三つあります。',
				en: 'There are three apples.',
				de: 'Es gibt drei Äpfel.'
			},
			{ target: '今は五時です。', en: 'It is five o clock now.', de: 'Es ist jetzt fünf Uhr.' },
			{
				target: '教室に十人います。',
				en: 'There are ten people in the classroom.',
				de: 'Im Klassenzimmer sind zehn Personen.'
			},
			{
				target: 'わたしの部屋は三番です。',
				en: 'My room is number three.',
				de: 'Mein Zimmer ist Nummer drei.'
			}
		]
	},
	{
		titleEn: 'Family',
		titleDe: 'Familie',
		descriptionEn: 'Talk about your family members',
		descriptionDe: 'Sprich über deine Familienmitglieder',
		themeColor: '#F4A7B9',
		vocab: [
			{ target: '家族 (kazoku)', en: 'family', de: 'Familie' },
			{ target: '母 (haha)', en: 'mother', de: 'Mutter' },
			{ target: '父 (chichi)', en: 'father', de: 'Vater' },
			{ target: 'お母さん (okaasan)', en: 'mother (polite)', de: 'Mutter (höflich)' },
			{ target: 'お父さん (otousan)', en: 'father (polite)', de: 'Vater (höflich)' },
			{ target: '兄 (ani)', en: 'older brother', de: 'älterer Bruder' },
			{ target: '姉 (ane)', en: 'older sister', de: 'ältere Schwester' },
			{ target: '弟 (otouto)', en: 'younger brother', de: 'jüngerer Bruder' },
			{ target: '妹 (imouto)', en: 'younger sister', de: 'jüngere Schwester' },
			{ target: '息子 (musuko)', en: 'son', de: 'Sohn' },
			{ target: '娘 (musume)', en: 'daughter', de: 'Tochter' },
			{ target: 'おじいさん (ojiisan)', en: 'grandfather', de: 'Großvater' },
			{ target: 'おばあさん (obaasan)', en: 'grandmother', de: 'Großmutter' },
			{ target: 'おじさん (ojisan)', en: 'uncle', de: 'Onkel' },
			{ target: 'おばさん (obasan)', en: 'aunt', de: 'Tante' },
			{ target: 'いとこ (itoko)', en: 'cousin', de: 'Cousin/Cousine' },
			{ target: '夫 (otto)', en: 'husband', de: 'Ehemann' },
			{ target: '妻 (tsuma)', en: 'wife', de: 'Ehefrau' },
			{ target: '両親 (ryoushin)', en: 'parents', de: 'Eltern' },
			{ target: '子ども (kodomo)', en: 'child', de: 'Kind' }
		],
		sentences: [
			{
				target: 'わたしの家族は四人です。',
				en: 'My family has four people.',
				de: 'Meine Familie besteht aus vier Personen.'
			},
			{ target: '母は医者です。', en: 'My mother is a doctor.', de: 'Meine Mutter ist Ärztin.' },
			{
				target: '弟は高校生です。',
				en: 'My younger brother is a high school student.',
				de: 'Mein jüngerer Bruder ist Schüler.'
			},
			{
				target: '祖母は大阪に住んでいます。',
				en: 'My grandmother lives in Osaka.',
				de: 'Meine Großmutter wohnt in Osaka.'
			},
			{
				target: 'きょうは家族で夕食を食べます。',
				en: 'Today I eat dinner with my family.',
				de: 'Heute esse ich mit meiner Familie zu Abend.'
			}
		]
	},
	{
		titleEn: 'Colors',
		titleDe: 'Farben',
		descriptionEn: 'Learn the colors in Japanese',
		descriptionDe: 'Lerne die Farben auf Japanisch',
		themeColor: '#3A7A57',
		vocab: [
			{ target: '赤 (aka)', en: 'red', de: 'rot' },
			{ target: '青 (ao)', en: 'blue', de: 'blau' },
			{ target: '緑 (midori)', en: 'green', de: 'grün' },
			{ target: '黄色 (kiiro)', en: 'yellow', de: 'gelb' },
			{ target: 'オレンジ (orenji)', en: 'orange', de: 'orange' },
			{ target: '紫 (murasaki)', en: 'purple', de: 'lila' },
			{ target: 'ピンク (pinku)', en: 'pink', de: 'rosa' },
			{ target: '黒 (kuro)', en: 'black', de: 'schwarz' },
			{ target: '白 (shiro)', en: 'white', de: 'weiß' },
			{ target: '灰色 (haiiro)', en: 'gray', de: 'grau' },
			{ target: '茶色 (chairo)', en: 'brown', de: 'braun' },
			{ target: '金色 (kiniro)', en: 'gold', de: 'gold' },
			{ target: '銀色 (giniro)', en: 'silver', de: 'silber' },
			{ target: '薄い (usui)', en: 'light/pale', de: 'hell/blass' },
			{ target: '濃い (koi)', en: 'dark/deep', de: 'dunkel/kräftig' },
			{ target: '色 (iro)', en: 'color', de: 'Farbe' },
			{ target: '鮮やか (azayaka)', en: 'vivid', de: 'kräftig' },
			{ target: '暗い (kurai)', en: 'dark', de: 'dunkel' },
			{ target: '明るい (akarui)', en: 'bright', de: 'hell' },
			{ target: '虹色 (nijiiro)', en: 'rainbow-colored', de: 'regenbogenfarben' }
		],
		sentences: [
			{ target: '空は青いです。', en: 'The sky is blue.', de: 'Der Himmel ist blau.' },
			{ target: 'りんごは赤いです。', en: 'The apple is red.', de: 'Der Apfel ist rot.' },
			{
				target: 'そのシャツは白と黒です。',
				en: 'That shirt is white and black.',
				de: 'Dieses Hemd ist weiß und schwarz.'
			},
			{
				target: '明るい黄色が好きです。',
				en: 'I like bright yellow.',
				de: 'Ich mag leuchtendes Gelb.'
			},
			{
				target: 'この花はとても鮮やかです。',
				en: 'This flower is very vivid.',
				de: 'Diese Blume ist sehr farbkräftig.'
			}
		]
	},
	{
		titleEn: 'Food & Drink',
		titleDe: 'Essen & Trinken',
		descriptionEn: 'Order food and describe meals',
		descriptionDe: 'Bestelle Essen und beschreibe Mahlzeiten',
		themeColor: '#C45A2A',
		vocab: [
			{ target: '水 (mizu)', en: 'water', de: 'Wasser' },
			{ target: 'パン (pan)', en: 'bread', de: 'Brot' },
			{ target: '牛乳 (gyuunyuu)', en: 'milk', de: 'Milch' },
			{ target: 'コーヒー (koohii)', en: 'coffee', de: 'Kaffee' },
			{ target: 'お茶 (ocha)', en: 'tea', de: 'Tee' },
			{ target: 'ジュース (juusu)', en: 'juice', de: 'Saft' },
			{ target: '肉 (niku)', en: 'meat', de: 'Fleisch' },
			{ target: '鶏肉 (toriniku)', en: 'chicken', de: 'Hähnchenfleisch' },
			{ target: '魚 (sakana)', en: 'fish', de: 'Fisch' },
			{ target: 'ご飯 (gohan)', en: 'rice', de: 'Reis' },
			{ target: '卵 (tamago)', en: 'egg', de: 'Ei' },
			{ target: 'チーズ (chiizu)', en: 'cheese', de: 'Käse' },
			{ target: '果物 (kudamono)', en: 'fruit', de: 'Obst' },
			{ target: 'りんご (ringo)', en: 'apple', de: 'Apfel' },
			{ target: 'みかん (mikan)', en: 'mandarin orange', de: 'Mandarine' },
			{ target: 'バナナ (banana)', en: 'banana', de: 'Banane' },
			{ target: '野菜 (yasai)', en: 'vegetable', de: 'Gemüse' },
			{ target: 'サラダ (sarada)', en: 'salad', de: 'Salat' },
			{ target: 'スープ (suupu)', en: 'soup', de: 'Suppe' },
			{ target: 'デザート (dezaato)', en: 'dessert', de: 'Nachtisch' }
		],
		sentences: [
			{ target: '水をください。', en: 'Water, please.', de: 'Wasser, bitte.' },
			{
				target: '朝ご飯の準備ができました。',
				en: 'Breakfast is ready.',
				de: 'Das Frühstück ist fertig.'
			},
			{ target: '鶏肉が好きです。', en: 'I like chicken.', de: 'Ich mag Hähnchenfleisch.' },
			{
				target: '何を食べたいですか。',
				en: 'What do you want to eat?',
				de: 'Was möchtest du essen?'
			},
			{ target: 'スープは熱いです。', en: 'The soup is hot.', de: 'Die Suppe ist heiß.' }
		]
	},
	{
		titleEn: 'Days & Time',
		titleDe: 'Tage & Zeit',
		descriptionEn: 'Learn days of the week and tell time',
		descriptionDe: 'Lerne die Wochentage und die Uhrzeit',
		themeColor: '#1F5C7A',
		vocab: [
			{ target: '月曜日 (getsuyoubi)', en: 'Monday', de: 'Montag' },
			{ target: '火曜日 (kayoubi)', en: 'Tuesday', de: 'Dienstag' },
			{ target: '水曜日 (suiyoubi)', en: 'Wednesday', de: 'Mittwoch' },
			{ target: '木曜日 (mokuyoubi)', en: 'Thursday', de: 'Donnerstag' },
			{ target: '金曜日 (kinyoubi)', en: 'Friday', de: 'Freitag' },
			{ target: '土曜日 (doyoubi)', en: 'Saturday', de: 'Samstag' },
			{ target: '日曜日 (nichiyoubi)', en: 'Sunday', de: 'Sonntag' },
			{ target: '週 (shuu)', en: 'week', de: 'Woche' },
			{ target: '月 (tsuki)', en: 'month', de: 'Monat' },
			{ target: '年 (toshi)', en: 'year', de: 'Jahr' },
			{ target: '今日 (kyou)', en: 'today', de: 'heute' },
			{ target: '明日 (ashita)', en: 'tomorrow', de: 'morgen' },
			{ target: '昨日 (kinou)', en: 'yesterday', de: 'gestern' },
			{ target: '時間 (jikan)', en: 'time/hour', de: 'Zeit/Stunde' },
			{ target: '分 (fun)', en: 'minute', de: 'Minute' },
			{ target: '秒 (byou)', en: 'second', de: 'Sekunde' },
			{ target: '正午 (shougo)', en: 'noon', de: 'Mittag' },
			{ target: '真夜中 (mayonaka)', en: 'midnight', de: 'Mitternacht' },
			{ target: '早い (hayai)', en: 'early', de: 'früh' },
			{ target: '遅い (osoi)', en: 'late', de: 'spät' }
		],
		sentences: [
			{ target: '今日は月曜日です。', en: 'Today is Monday.', de: 'Heute ist Montag.' },
			{ target: '今、何時ですか。', en: 'What time is it now?', de: 'Wie spät ist es jetzt?' },
			{ target: '三時です。', en: 'It is three o clock.', de: 'Es ist drei Uhr.' },
			{ target: '明日は金曜日です。', en: 'Tomorrow is Friday.', de: 'Morgen ist Freitag.' },
			{
				target: '一週間は七日です。',
				en: 'One week has seven days.',
				de: 'Eine Woche hat sieben Tage.'
			}
		]
	},
	{
		titleEn: 'Body Parts',
		titleDe: 'Körperteile',
		descriptionEn: 'Learn the parts of the body',
		descriptionDe: 'Lerne die Körperteile',
		themeColor: '#7A3E65',
		vocab: [
			{ target: '頭 (atama)', en: 'head', de: 'Kopf' },
			{ target: '目 (me)', en: 'eye', de: 'Auge' },
			{ target: '耳 (mimi)', en: 'ear', de: 'Ohr' },
			{ target: '鼻 (hana)', en: 'nose', de: 'Nase' },
			{ target: '口 (kuchi)', en: 'mouth', de: 'Mund' },
			{ target: '歯 (ha)', en: 'tooth', de: 'Zahn' },
			{ target: '舌 (shita)', en: 'tongue', de: 'Zunge' },
			{ target: '首 (kubi)', en: 'neck', de: 'Hals' },
			{ target: '腕 (ude)', en: 'arm', de: 'Arm' },
			{ target: '手 (te)', en: 'hand', de: 'Hand' },
			{ target: '指 (yubi)', en: 'finger', de: 'Finger' },
			{ target: '脚 (ashi)', en: 'leg', de: 'Bein' },
			{ target: '足 (ashi)', en: 'foot', de: 'Fuß' },
			{ target: '背中 (senaka)', en: 'back', de: 'Rücken' },
			{ target: '胸 (mune)', en: 'chest', de: 'Brust' },
			{ target: 'お腹 (onaka)', en: 'stomach', de: 'Bauch' },
			{ target: '心臓 (shinzou)', en: 'heart', de: 'Herz' },
			{ target: '髪 (kami)', en: 'hair', de: 'Haar' },
			{ target: '顔 (kao)', en: 'face', de: 'Gesicht' },
			{ target: '体 (karada)', en: 'body', de: 'Körper' }
		],
		sentences: [
			{ target: '頭が痛いです。', en: 'My head hurts.', de: 'Mein Kopf tut weh.' },
			{ target: '目が二つあります。', en: 'I have two eyes.', de: 'Ich habe zwei Augen.' },
			{ target: '彼女は髪が長いです。', en: 'She has long hair.', de: 'Sie hat lange Haare.' },
			{
				target: '手を洗ってください。',
				en: 'Please wash your hands.',
				de: 'Bitte wasch dir die Hände.'
			},
			{
				target: '体を大切にしてください。',
				en: 'Please take care of your body.',
				de: 'Bitte achte auf deinen Körper.'
			}
		]
	},
	{
		titleEn: 'Clothing',
		titleDe: 'Kleidung',
		descriptionEn: 'Learn about clothes and what to wear',
		descriptionDe: 'Lerne über Kleidung und was man trägt',
		themeColor: '#5B6C3D',
		vocab: [
			{ target: 'シャツ (shatsu)', en: 'shirt', de: 'Hemd' },
			{ target: 'ズボン (zubon)', en: 'pants', de: 'Hose' },
			{ target: 'ワンピース (wanpiisu)', en: 'dress', de: 'Kleid' },
			{ target: 'スカート (sukaato)', en: 'skirt', de: 'Rock' },
			{ target: '靴 (kutsu)', en: 'shoes', de: 'Schuhe' },
			{ target: '靴下 (kutsushita)', en: 'socks', de: 'Socken' },
			{ target: 'ジャケット (jaketto)', en: 'jacket', de: 'Jacke' },
			{ target: 'コート (kooto)', en: 'coat', de: 'Mantel' },
			{ target: '帽子 (boushi)', en: 'hat', de: 'Hut' },
			{ target: 'キャップ (kyappu)', en: 'cap', de: 'Kappe' },
			{ target: 'マフラー (mafuraa)', en: 'scarf', de: 'Schal' },
			{ target: '手袋 (tebukuro)', en: 'gloves', de: 'Handschuhe' },
			{ target: 'ベルト (beruto)', en: 'belt', de: 'Gürtel' },
			{ target: 'ネクタイ (nekutai)', en: 'tie', de: 'Krawatte' },
			{ target: 'かばん (kaban)', en: 'bag', de: 'Tasche' },
			{ target: '服 (fuku)', en: 'clothes', de: 'Kleidung' },
			{ target: 'Tシャツ (tii shatsu)', en: 't-shirt', de: 'T-Shirt' },
			{ target: 'ジーンズ (jiinzu)', en: 'jeans', de: 'Jeans' },
			{ target: 'ブーツ (buutsu)', en: 'boots', de: 'Stiefel' },
			{ target: 'パジャマ (pajama)', en: 'pajamas', de: 'Schlafanzug' }
		],
		sentences: [
			{
				target: '彼女は赤いワンピースを着ています。',
				en: 'She is wearing a red dress.',
				de: 'Sie trägt ein rotes Kleid.'
			},
			{
				target: '新しい靴を買いたいです。',
				en: 'I want to buy new shoes.',
				de: 'Ich möchte neue Schuhe kaufen.'
			},
			{
				target: '寒いのでジャケットを着てください。',
				en: 'It is cold, so please wear a jacket.',
				de: 'Es ist kalt, also zieh bitte eine Jacke an.'
			},
			{ target: 'わたしのシャツはどこですか。', en: 'Where is my shirt?', de: 'Wo ist mein Hemd?' },
			{
				target: '白い靴下をはいています。',
				en: 'I am wearing white socks.',
				de: 'Ich trage weiße Socken.'
			}
		]
	},
	{
		titleEn: 'House & Home',
		titleDe: 'Haus & Zuhause',
		descriptionEn: 'Learn about rooms and furniture',
		descriptionDe: 'Lerne über Räume und Möbel',
		themeColor: '#8A5A44',
		vocab: [
			{ target: '家 (ie)', en: 'house', de: 'Haus' },
			{ target: 'アパート (apaato)', en: 'apartment', de: 'Wohnung' },
			{ target: '部屋 (heya)', en: 'room', de: 'Zimmer' },
			{ target: 'キッチン (kicchin)', en: 'kitchen', de: 'Küche' },
			{ target: 'お風呂 (ofuro)', en: 'bathroom/bath', de: 'Bad' },
			{ target: '寝室 (shinshitsu)', en: 'bedroom', de: 'Schlafzimmer' },
			{ target: 'リビング (ribingu)', en: 'living room', de: 'Wohnzimmer' },
			{ target: 'ダイニング (dainingu)', en: 'dining room', de: 'Esszimmer' },
			{ target: 'ドア (doa)', en: 'door', de: 'Tür' },
			{ target: '窓 (mado)', en: 'window', de: 'Fenster' },
			{ target: 'テーブル (teeburu)', en: 'table', de: 'Tisch' },
			{ target: '椅子 (isu)', en: 'chair', de: 'Stuhl' },
			{ target: 'ベッド (beddo)', en: 'bed', de: 'Bett' },
			{ target: 'ソファ (sofa)', en: 'sofa', de: 'Sofa' },
			{ target: 'ランプ (ranpu)', en: 'lamp', de: 'Lampe' },
			{ target: '鏡 (kagami)', en: 'mirror', de: 'Spiegel' },
			{ target: '階段 (kaidan)', en: 'stairs', de: 'Treppe' },
			{ target: '庭 (niwa)', en: 'garden', de: 'Garten' },
			{ target: 'ガレージ (gareeji)', en: 'garage', de: 'Garage' },
			{ target: '屋根 (yane)', en: 'roof', de: 'Dach' }
		],
		sentences: [
			{ target: 'わたしの家は大きいです。', en: 'My house is big.', de: 'Mein Haus ist groß.' },
			{
				target: 'キッチンはきれいです。',
				en: 'The kitchen is clean.',
				de: 'Die Küche ist sauber.'
			},
			{
				target: 'ダイニングにテーブルがあります。',
				en: 'There is a table in the dining room.',
				de: 'Im Esszimmer steht ein Tisch.'
			},
			{ target: 'ベッドで寝ます。', en: 'I sleep in a bed.', de: 'Ich schlafe im Bett.' },
			{
				target: '庭に花があります。',
				en: 'There are flowers in the garden.',
				de: 'Im Garten gibt es Blumen.'
			}
		]
	},
	{
		titleEn: 'Common Verbs',
		titleDe: 'Häufige Verben',
		descriptionEn: 'Learn essential action words',
		descriptionDe: 'Lerne wichtige Tätigkeitswörter',
		themeColor: '#B33A3A',
		vocab: [
			{ target: 'いる (iru)', en: 'to be (animate)', de: 'sein (lebendig)' },
			{ target: 'ある (aru)', en: 'to be/have (inanimate)', de: 'sein/haben (sachlich)' },
			{ target: 'もつ (motsu)', en: 'to have', de: 'haben' },
			{ target: 'する (suru)', en: 'to do', de: 'machen' },
			{ target: 'いく (iku)', en: 'to go', de: 'gehen' },
			{ target: 'くる (kuru)', en: 'to come', de: 'kommen' },
			{ target: 'みる (miru)', en: 'to see/watch', de: 'sehen' },
			{ target: 'あげる (ageru)', en: 'to give', de: 'geben' },
			{ target: 'しる (shiru)', en: 'to know', de: 'wissen' },
			{ target: 'できる (dekiru)', en: 'can/to be able', de: 'können' },
			{ target: 'ほしい (hoshii)', en: 'to want', de: 'wollen' },
			{ target: 'いう (iu)', en: 'to say', de: 'sagen' },
			{ target: 'はなす (hanasu)', en: 'to speak', de: 'sprechen' },
			{ target: 'たべる (taberu)', en: 'to eat', de: 'essen' },
			{ target: 'のむ (nomu)', en: 'to drink', de: 'trinken' },
			{ target: 'ねる (neru)', en: 'to sleep', de: 'schlafen' },
			{ target: 'すむ (sumu)', en: 'to live', de: 'wohnen' },
			{ target: 'はたらく (hataraku)', en: 'to work', de: 'arbeiten' },
			{ target: 'べんきょうする (benkyou suru)', en: 'to study', de: 'lernen' },
			{ target: 'あそぶ (asobu)', en: 'to play', de: 'spielen' }
		],
		sentences: [
			{ target: 'わたしは学生です。', en: 'I am a student.', de: 'Ich bin Student.' },
			{ target: '彼は犬をもっています。', en: 'He has a dog.', de: 'Er hat einen Hund.' },
			{
				target: 'わたしたちは公園へ行きます。',
				en: 'We go to the park.',
				de: 'Wir gehen in den Park.'
			},
			{ target: '日本語を勉強します。', en: 'I study Japanese.', de: 'Ich lerne Japanisch.' },
			{ target: '彼らは毎日働きます。', en: 'They work every day.', de: 'Sie arbeiten jeden Tag.' }
		]
	}
];

export const A2_UNITS: UnitVocab[] = [
	{
		titleEn: 'Weather & Seasons',
		titleDe: 'Wetter & Jahreszeiten',
		descriptionEn: 'Talk about the weather and seasons',
		descriptionDe: 'Sprich über das Wetter und die Jahreszeiten',
		themeColor: '#4C7FA8',
		vocab: [
			{ target: '天気 (tenki)', en: 'weather', de: 'Wetter' },
			{ target: '太陽 (taiyou)', en: 'sun', de: 'Sonne' },
			{ target: '雨 (ame)', en: 'rain', de: 'Regen' },
			{ target: '雪 (yuki)', en: 'snow', de: 'Schnee' },
			{ target: '風 (kaze)', en: 'wind', de: 'Wind' },
			{ target: '雲 (kumo)', en: 'cloud', de: 'Wolke' },
			{ target: '嵐 (arashi)', en: 'storm', de: 'Sturm' },
			{ target: '暑さ (atsusa)', en: 'heat', de: 'Hitze' },
			{ target: '寒さ (samusa)', en: 'cold', de: 'Kälte' },
			{ target: '春 (haru)', en: 'spring', de: 'Frühling' },
			{ target: '夏 (natsu)', en: 'summer', de: 'Sommer' },
			{ target: '秋 (aki)', en: 'autumn', de: 'Herbst' },
			{ target: '冬 (fuyu)', en: 'winter', de: 'Winter' },
			{ target: '気温 (kion)', en: 'temperature', de: 'Temperatur' },
			{ target: '度 (do)', en: 'degree', de: 'Grad' },
			{ target: '湿度 (shitsudo)', en: 'humidity', de: 'Luftfeuchtigkeit' },
			{ target: '乾燥 (kansou)', en: 'dryness', de: 'Trockenheit' },
			{ target: '曇り (kumori)', en: 'cloudy', de: 'bewölkt' },
			{ target: '晴れ (hare)', en: 'sunny', de: 'sonnig' },
			{ target: '雨天 (uten)', en: 'rainy weather', de: 'Regenwetter' }
		],
		sentences: [
			{
				target: '今日はとても暑いです。',
				en: 'It is very hot today.',
				de: 'Heute ist es sehr heiß.'
			},
			{ target: '雨が降っています。', en: 'It is raining.', de: 'Es regnet.' },
			{ target: '冬は寒いです。', en: 'Winter is cold.', de: 'Der Winter ist kalt.' },
			{
				target: 'きょうの天気はどうですか。',
				en: 'How is the weather today?',
				de: 'Wie ist das Wetter heute?'
			},
			{
				target: '春がいちばん好きです。',
				en: 'I like spring the most.',
				de: 'Ich mag den Frühling am meisten.'
			}
		]
	},
	{
		titleEn: 'Travel & Transport',
		titleDe: 'Reisen & Verkehr',
		descriptionEn: 'Learn vocabulary for traveling',
		descriptionDe: 'Lerne Vokabeln zum Reisen',
		themeColor: '#D96B2B',
		vocab: [
			{ target: '飛行機 (hikouki)', en: 'airplane', de: 'Flugzeug' },
			{ target: '電車 (densha)', en: 'train', de: 'Zug' },
			{ target: 'バス (basu)', en: 'bus', de: 'Bus' },
			{ target: '車 (kuruma)', en: 'car', de: 'Auto' },
			{ target: '自転車 (jitensha)', en: 'bicycle', de: 'Fahrrad' },
			{ target: '船 (fune)', en: 'boat', de: 'Boot' },
			{ target: 'タクシー (takushii)', en: 'taxi', de: 'Taxi' },
			{ target: '地下鉄 (chikatetsu)', en: 'subway', de: 'U-Bahn' },
			{ target: '空港 (kuukou)', en: 'airport', de: 'Flughafen' },
			{ target: '駅 (eki)', en: 'station', de: 'Bahnhof' },
			{ target: '切符 (kippu)', en: 'ticket', de: 'Fahrkarte' },
			{ target: 'パスポート (pasupooto)', en: 'passport', de: 'Reisepass' },
			{ target: 'スーツケース (suutsukeesu)', en: 'suitcase', de: 'Koffer' },
			{ target: '旅行 (ryokou)', en: 'trip', de: 'Reise' },
			{ target: '目的地 (mokutekichi)', en: 'destination', de: 'Ziel' },
			{ target: '到着 (touchaku)', en: 'arrival', de: 'Ankunft' },
			{ target: '出発 (shuppatsu)', en: 'departure', de: 'Abfahrt' },
			{ target: '荷物 (nimotsu)', en: 'luggage', de: 'Gepäck' },
			{ target: '予約 (yoyaku)', en: 'reservation', de: 'Reservierung' },
			{ target: '観光客 (kankoukyaku)', en: 'tourist', de: 'Tourist' }
		],
		sentences: [
			{
				target: '電車は八時に出ます。',
				en: 'The train leaves at eight.',
				de: 'Der Zug fährt um acht ab.'
			},
			{
				target: '切符が一枚ほしいです。',
				en: 'I need one ticket.',
				de: 'Ich brauche eine Fahrkarte.'
			},
			{
				target: '空港は遠いです。',
				en: 'The airport is far away.',
				de: 'Der Flughafen ist weit weg.'
			},
			{ target: '駅はどこですか。', en: 'Where is the station?', de: 'Wo ist der Bahnhof?' },
			{
				target: '飛行機で旅行します。',
				en: 'I travel by airplane.',
				de: 'Ich reise mit dem Flugzeug.'
			}
		]
	},
	{
		titleEn: 'Shopping',
		titleDe: 'Einkaufen',
		descriptionEn: 'Learn to shop and talk about prices',
		descriptionDe: 'Lerne einzukaufen und über Preise zu sprechen',
		themeColor: '#C24C7A',
		vocab: [
			{ target: '店 (mise)', en: 'store', de: 'Geschäft' },
			{ target: '市場 (ichiba)', en: 'market', de: 'Markt' },
			{ target: '値段 (nedan)', en: 'price', de: 'Preis' },
			{ target: 'お金 (okane)', en: 'money', de: 'Geld' },
			{ target: 'カード (kaado)', en: 'card', de: 'Karte' },
			{ target: '現金 (genkin)', en: 'cash', de: 'Bargeld' },
			{ target: '請求書 (seikyuusho)', en: 'bill', de: 'Rechnung' },
			{ target: 'お釣り (otsuri)', en: 'change', de: 'Wechselgeld' },
			{ target: '割引 (waribiki)', en: 'discount', de: 'Rabatt' },
			{ target: 'セール (seeru)', en: 'sale', de: 'Angebot' },
			{ target: '安い (yasui)', en: 'cheap', de: 'billig' },
			{ target: '高い (takai)', en: 'expensive', de: 'teuer' },
			{ target: '買う (kau)', en: 'to buy', de: 'kaufen' },
			{ target: '売る (uru)', en: 'to sell', de: 'verkaufen' },
			{ target: '払う (harau)', en: 'to pay', de: 'bezahlen' },
			{ target: '客 (kyaku)', en: 'customer', de: 'Kunde' },
			{ target: '店員 (tenin)', en: 'shop assistant', de: 'Verkäufer' },
			{ target: 'レシート (reshiito)', en: 'receipt', de: 'Quittung' },
			{ target: 'レジ (reji)', en: 'cash register', de: 'Kasse' },
			{ target: '袋 (fukuro)', en: 'bag', de: 'Tüte' }
		],
		sentences: [
			{ target: 'これはいくらですか。', en: 'How much is this?', de: 'Wie viel kostet das?' },
			{ target: 'それは高すぎます。', en: 'That is too expensive.', de: 'Das ist zu teuer.' },
			{
				target: 'カードで払えますか。',
				en: 'Can I pay by card?',
				de: 'Kann ich mit Karte bezahlen?'
			},
			{ target: 'これを買いたいです。', en: 'I want to buy this.', de: 'Ich möchte das kaufen.' },
			{
				target: '二十パーセントの割引があります。',
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
		themeColor: '#5E8F61',
		vocab: [
			{ target: '医者 (isha)', en: 'doctor', de: 'Arzt' },
			{ target: '病院 (byouin)', en: 'hospital', de: 'Krankenhaus' },
			{ target: '看護師 (kangoshi)', en: 'nurse', de: 'Krankenpfleger' },
			{ target: '薬 (kusuri)', en: 'medicine', de: 'Medizin' },
			{ target: '病気 (byouki)', en: 'illness', de: 'Krankheit' },
			{ target: '健康 (kenkou)', en: 'health', de: 'Gesundheit' },
			{ target: '痛み (itami)', en: 'pain', de: 'Schmerz' },
			{ target: '熱 (netsu)', en: 'fever', de: 'Fieber' },
			{ target: 'インフルエンザ (infuruenza)', en: 'flu', de: 'Grippe' },
			{ target: '咳 (seki)', en: 'cough', de: 'Husten' },
			{ target: '風邪 (kaze)', en: 'cold', de: 'Erkältung' },
			{ target: 'アレルギー (arerugii)', en: 'allergy', de: 'Allergie' },
			{ target: '予約 (yoyaku)', en: 'appointment', de: 'Termin' },
			{ target: '処方箋 (shohousen)', en: 'prescription', de: 'Rezept' },
			{ target: '錠剤 (jouzai)', en: 'pill', de: 'Tablette' },
			{ target: '薬局 (yakkyoku)', en: 'pharmacy', de: 'Apotheke' },
			{ target: '救急 (kyuukyuu)', en: 'emergency', de: 'Notfall' },
			{ target: '救急車 (kyuukyuusha)', en: 'ambulance', de: 'Krankenwagen' },
			{ target: '血 (chi)', en: 'blood', de: 'Blut' },
			{ target: 'けが (kega)', en: 'injury', de: 'Verletzung' }
		],
		sentences: [
			{ target: '気分が悪いです。', en: 'I feel sick.', de: 'Ich fühle mich krank.' },
			{
				target: '医者に診てもらう必要があります。',
				en: 'I need to see a doctor.',
				de: 'Ich muss zum Arzt.'
			},
			{ target: '頭に痛みがあります。', en: 'I have a headache.', de: 'Ich habe Kopfschmerzen.' },
			{ target: '薬局はどこですか。', en: 'Where is the pharmacy?', de: 'Wo ist die Apotheke?' },
			{
				target: 'この薬を飲んでください。',
				en: 'Please take this medicine.',
				de: 'Bitte nimm dieses Medikament.'
			}
		]
	},
	{
		titleEn: 'Work & Professions',
		titleDe: 'Arbeit & Berufe',
		descriptionEn: 'Learn about jobs and the workplace',
		descriptionDe: 'Lerne über Berufe und den Arbeitsplatz',
		themeColor: '#6C4B8D',
		vocab: [
			{ target: '仕事 (shigoto)', en: 'work/job', de: 'Arbeit' },
			{ target: '事務所 (jimusho)', en: 'office', de: 'Büro' },
			{ target: '上司 (joushi)', en: 'boss', de: 'Vorgesetzter' },
			{ target: '社員 (shain)', en: 'employee', de: 'Angestellter' },
			{ target: '先生 (sensei)', en: 'teacher', de: 'Lehrer' },
			{ target: '弁護士 (bengoshi)', en: 'lawyer', de: 'Anwalt' },
			{ target: 'エンジニア (enjinia)', en: 'engineer', de: 'Ingenieur' },
			{ target: '料理人 (ryourinin)', en: 'cook/chef', de: 'Koch' },
			{ target: '警察官 (keisatsukan)', en: 'police officer', de: 'Polizist' },
			{ target: '消防士 (shouboushi)', en: 'firefighter', de: 'Feuerwehrmann' },
			{ target: '作家 (sakka)', en: 'writer', de: 'Schriftsteller' },
			{ target: '芸術家 (geijutsuka)', en: 'artist', de: 'Künstler' },
			{ target: '音楽家 (ongakuka)', en: 'musician', de: 'Musiker' },
			{ target: '給料 (kyuuryou)', en: 'salary', de: 'Gehalt' },
			{ target: '会議 (kaigi)', en: 'meeting', de: 'Besprechung' },
			{ target: 'パソコン (pasokon)', en: 'computer', de: 'Computer' },
			{ target: 'メール (meeru)', en: 'email', de: 'E-Mail' },
			{ target: 'プロジェクト (purojekuto)', en: 'project', de: 'Projekt' },
			{ target: '会社 (kaisha)', en: 'company', de: 'Unternehmen' },
			{ target: 'キャリア (kyaria)', en: 'career', de: 'Karriere' }
		],
		sentences: [
			{
				target: '会社で働いています。',
				en: 'I work at a company.',
				de: 'Ich arbeite in einer Firma.'
			},
			{
				target: '兄はエンジニアです。',
				en: 'My older brother is an engineer.',
				de: 'Mein älterer Bruder ist Ingenieur.'
			},
			{
				target: '明日会議があります。',
				en: 'I have a meeting tomorrow.',
				de: 'Ich habe morgen eine Besprechung.'
			},
			{
				target: 'あなたの仕事は何ですか。',
				en: 'What is your profession?',
				de: 'Was ist dein Beruf?'
			},
			{
				target: '上司は今忙しいです。',
				en: 'The boss is busy now.',
				de: 'Der Vorgesetzte ist gerade beschäftigt.'
			}
		]
	},
	{
		titleEn: 'Education',
		titleDe: 'Bildung',
		descriptionEn: 'School and learning vocabulary',
		descriptionDe: 'Schul- und Lernvokabular',
		themeColor: '#3F6BAA',
		vocab: [
			{ target: '学校 (gakkou)', en: 'school', de: 'Schule' },
			{ target: '大学 (daigaku)', en: 'university', de: 'Universität' },
			{ target: '授業 (jugyou)', en: 'class', de: 'Unterricht' },
			{ target: '学生 (gakusei)', en: 'student', de: 'Student' },
			{ target: '教師 (kyoushi)', en: 'teacher', de: 'Lehrer' },
			{ target: '本 (hon)', en: 'book', de: 'Buch' },
			{ target: 'ノート (nooto)', en: 'notebook', de: 'Heft' },
			{ target: '鉛筆 (enpitsu)', en: 'pencil', de: 'Bleistift' },
			{ target: 'ペン (pen)', en: 'pen', de: 'Kugelschreiber' },
			{ target: '試験 (shiken)', en: 'exam', de: 'Prüfung' },
			{ target: '宿題 (shukudai)', en: 'homework', de: 'Hausaufgaben' },
			{ target: '成績 (seiseki)', en: 'grade', de: 'Note' },
			{ target: '黒板 (kokuban)', en: 'blackboard', de: 'Tafel' },
			{ target: '図書館 (toshokan)', en: 'library', de: 'Bibliothek' },
			{ target: '言語 (gengo)', en: 'language', de: 'Sprache' },
			{ target: '数学 (suugaku)', en: 'mathematics', de: 'Mathematik' },
			{ target: '科学 (kagaku)', en: 'science', de: 'Wissenschaft' },
			{ target: '歴史 (rekishi)', en: 'history', de: 'Geschichte' },
			{ target: '地理 (chiri)', en: 'geography', de: 'Geografie' },
			{ target: '美術 (bijutsu)', en: 'art', de: 'Kunst' }
		],
		sentences: [
			{
				target: '日本語を勉強しています。',
				en: 'I am studying Japanese.',
				de: 'Ich lerne Japanisch.'
			},
			{
				target: '授業は九時に始まります。',
				en: 'Class starts at nine.',
				de: 'Der Unterricht beginnt um neun.'
			},
			{
				target: '宿題がたくさんあります。',
				en: 'I have a lot of homework.',
				de: 'Ich habe viele Hausaufgaben.'
			},
			{ target: '図書館はどこですか。', en: 'Where is the library?', de: 'Wo ist die Bibliothek?' },
			{
				target: '試験は難しかったです。',
				en: 'The exam was difficult.',
				de: 'Die Prüfung war schwierig.'
			}
		]
	},
	{
		titleEn: 'Sports & Hobbies',
		titleDe: 'Sport & Hobbys',
		descriptionEn: 'Learn about sports and free time activities',
		descriptionDe: 'Lerne über Sport und Freizeitaktivitäten',
		themeColor: '#2F8C84',
		vocab: [
			{ target: 'スポーツ (supootsu)', en: 'sport', de: 'Sport' },
			{ target: 'サッカー (sakkaa)', en: 'soccer', de: 'Fußball' },
			{ target: 'バスケットボール (basukettobooru)', en: 'basketball', de: 'Basketball' },
			{ target: 'テニス (tenisu)', en: 'tennis', de: 'Tennis' },
			{ target: '水泳 (suiei)', en: 'swimming', de: 'Schwimmen' },
			{ target: '走る (hashiru)', en: 'to run', de: 'laufen' },
			{ target: '歩く (aruku)', en: 'to walk', de: 'gehen' },
			{ target: 'チーム (chiimu)', en: 'team', de: 'Mannschaft' },
			{ target: 'ボール (booru)', en: 'ball', de: 'Ball' },
			{ target: '試合 (shiai)', en: 'game/match', de: 'Spiel' },
			{ target: '勝つ (katsu)', en: 'to win', de: 'gewinnen' },
			{ target: '負ける (makeru)', en: 'to lose', de: 'verlieren' },
			{ target: '音楽 (ongaku)', en: 'music', de: 'Musik' },
			{ target: '映画 (eiga)', en: 'movie', de: 'Film' },
			{ target: '読む (yomu)', en: 'to read', de: 'lesen' },
			{ target: '料理する (ryouri suru)', en: 'to cook', de: 'kochen' },
			{ target: '踊る (odoru)', en: 'to dance', de: 'tanzen' },
			{ target: '歌う (utau)', en: 'to sing', de: 'singen' },
			{ target: '絵を描く (e o kaku)', en: 'to paint/draw', de: 'malen' },
			{ target: '写真 (shashin)', en: 'photography/photo', de: 'Fotografie/Foto' }
		],
		sentences: [
			{
				target: 'サッカーをするのが好きです。',
				en: 'I like playing soccer.',
				de: 'Ich spiele gern Fußball.'
			},
			{
				target: '彼女は泳ぐのが上手です。',
				en: 'She swims very well.',
				de: 'Sie schwimmt sehr gut.'
			},
			{
				target: 'チームが試合に勝ちました。',
				en: 'The team won the match.',
				de: 'Die Mannschaft hat das Spiel gewonnen.'
			},
			{ target: '趣味は何ですか。', en: 'What is your hobby?', de: 'Was ist dein Hobby?' },
			{
				target: '毎日本を読みます。',
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
		themeColor: '#60707F',
		vocab: [
			{ target: '町 (machi)', en: 'city/town', de: 'Stadt' },
			{ target: '村 (mura)', en: 'village', de: 'Dorf' },
			{ target: '通り (toori)', en: 'street', de: 'Straße' },
			{ target: '広場 (hiroba)', en: 'square', de: 'Platz' },
			{ target: '公園 (kouen)', en: 'park', de: 'Park' },
			{ target: '銀行 (ginkou)', en: 'bank', de: 'Bank' },
			{ target: 'レストラン (resutoran)', en: 'restaurant', de: 'Restaurant' },
			{ target: 'スーパー (suupaa)', en: 'supermarket', de: 'Supermarkt' },
			{ target: '博物館 (hakubutsukan)', en: 'museum', de: 'Museum' },
			{ target: '劇場 (gekijou)', en: 'theater', de: 'Theater' },
			{ target: '教会 (kyoukai)', en: 'church', de: 'Kirche' },
			{ target: 'ホテル (hoteru)', en: 'hotel', de: 'Hotel' },
			{ target: '中心街 (chuushingai)', en: 'downtown', de: 'Innenstadt' },
			{ target: '角 (kado)', en: 'corner', de: 'Ecke' },
			{ target: '右 (migi)', en: 'right', de: 'rechts' },
			{ target: '左 (hidari)', en: 'left', de: 'links' },
			{ target: 'まっすぐ (massugu)', en: 'straight', de: 'geradeaus' },
			{ target: '近く (chikaku)', en: 'near', de: 'nah' },
			{ target: '遠い (tooi)', en: 'far', de: 'weit' },
			{ target: '方向 (houkou)', en: 'direction', de: 'Richtung' }
		],
		sentences: [
			{
				target: '銀行は右にあります。',
				en: 'The bank is on the right.',
				de: 'Die Bank ist rechts.'
			},
			{
				target: '町の中心へ行きましょう。',
				en: 'Let us go downtown.',
				de: 'Lass uns in die Innenstadt gehen.'
			},
			{
				target: '博物館は近いです。',
				en: 'The museum is nearby.',
				de: 'Das Museum ist in der Nähe.'
			},
			{
				target: '公園へはどう行きますか。',
				en: 'How do I get to the park?',
				de: 'Wie komme ich zum Park?'
			},
			{
				target: '二つ目の角をまっすぐ行ってください。',
				en: 'Go straight at the second corner.',
				de: 'Geh an der zweiten Ecke geradeaus.'
			}
		]
	},
	{
		titleEn: 'Nature & Animals',
		titleDe: 'Natur & Tiere',
		descriptionEn: 'Learn about nature and animals',
		descriptionDe: 'Lerne über Natur und Tiere',
		themeColor: '#6C9A3A',
		vocab: [
			{ target: '犬 (inu)', en: 'dog', de: 'Hund' },
			{ target: '猫 (neko)', en: 'cat', de: 'Katze' },
			{ target: '鳥 (tori)', en: 'bird', de: 'Vogel' },
			{ target: '魚 (sakana)', en: 'fish', de: 'Fisch' },
			{ target: '馬 (uma)', en: 'horse', de: 'Pferd' },
			{ target: '牛 (ushi)', en: 'cow', de: 'Kuh' },
			{ target: '豚 (buta)', en: 'pig', de: 'Schwein' },
			{ target: '木 (ki)', en: 'tree', de: 'Baum' },
			{ target: '花 (hana)', en: 'flower', de: 'Blume' },
			{ target: '植物 (shokubutsu)', en: 'plant', de: 'Pflanze' },
			{ target: '川 (kawa)', en: 'river', de: 'Fluss' },
			{ target: '海 (umi)', en: 'sea', de: 'Meer' },
			{ target: '山 (yama)', en: 'mountain', de: 'Berg' },
			{ target: '森 (mori)', en: 'forest', de: 'Wald' },
			{ target: '浜辺 (hamabe)', en: 'beach', de: 'Strand' },
			{ target: '湖 (mizuumi)', en: 'lake', de: 'See' },
			{ target: '空 (sora)', en: 'sky', de: 'Himmel' },
			{ target: '星 (hoshi)', en: 'star', de: 'Stern' },
			{ target: '月 (tsuki)', en: 'moon', de: 'Mond' },
			{ target: '地球 (chikyuu)', en: 'earth', de: 'Erde' }
		],
		sentences: [
			{
				target: 'うちの犬はとても人なつこいです。',
				en: 'My dog is very friendly.',
				de: 'Mein Hund ist sehr freundlich.'
			},
			{
				target: '花がとてもきれいです。',
				en: 'The flowers are very beautiful.',
				de: 'Die Blumen sind sehr schön.'
			},
			{
				target: '川の水は冷たいです。',
				en: 'The river water is cold.',
				de: 'Das Flusswasser ist kalt.'
			},
			{
				target: '森には木がたくさんあります。',
				en: 'There are many trees in the forest.',
				de: 'Im Wald gibt es viele Bäume.'
			},
			{
				target: '夜空に星が光っています。',
				en: 'Stars are shining in the night sky.',
				de: 'Am Nachthimmel leuchten Sterne.'
			}
		]
	},
	{
		titleEn: 'Emotions & Feelings',
		titleDe: 'Emotionen & Gefühle',
		descriptionEn: 'Express how you feel',
		descriptionDe: 'Drücke aus, wie du dich fühlst',
		themeColor: '#B65C5C',
		vocab: [
			{ target: '嬉しい (ureshii)', en: 'happy', de: 'glücklich' },
			{ target: '悲しい (kanashii)', en: 'sad', de: 'traurig' },
			{ target: '怒っている (okotte iru)', en: 'angry', de: 'wütend' },
			{ target: '疲れた (tsukareta)', en: 'tired', de: 'müde' },
			{ target: '緊張している (kinchou shite iru)', en: 'nervous', de: 'nervös' },
			{ target: '心配している (shinpai shite iru)', en: 'worried', de: 'besorgt' },
			{ target: '驚いた (odoroita)', en: 'surprised', de: 'überrascht' },
			{ target: 'わくわくしている (wakuwaku shite iru)', en: 'excited', de: 'aufgeregt' },
			{ target: '退屈 (taikutsu)', en: 'bored', de: 'gelangweilt' },
			{ target: '怖い (kowai)', en: 'scared', de: 'ängstlich' },
			{ target: '落ち着いた (ochitsuita)', en: 'calm', de: 'ruhig' },
			{ target: '満足した (manzoku shita)', en: 'content', de: 'zufrieden' },
			{ target: '愛 (ai)', en: 'love', de: 'Liebe' },
			{ target: '憎しみ (nikushimi)', en: 'hate', de: 'Hass' },
			{ target: '恐れ (osore)', en: 'fear', de: 'Angst' },
			{ target: '喜び (yorokobi)', en: 'joy', de: 'Freude' },
			{ target: '悲しみ (kanashimi)', en: 'sadness', de: 'Traurigkeit' },
			{ target: '希望 (kibou)', en: 'hope', de: 'Hoffnung' },
			{ target: '混乱 (konran)', en: 'confusion', de: 'Verwirrung' },
			{ target: '誇り (hokori)', en: 'pride', de: 'Stolz' }
		],
		sentences: [
			{
				target: '今日はとてもうれしいです。',
				en: 'I am very happy today.',
				de: 'Ich bin heute sehr glücklich.'
			},
			{
				target: '彼女は少し悲しそうです。',
				en: 'She looks a little sad.',
				de: 'Sie sieht ein bisschen traurig aus.'
			},
			{ target: 'とても疲れています。', en: 'I am very tired.', de: 'Ich bin sehr müde.' },
			{
				target: '緊張しなくても大丈夫です。',
				en: 'You do not need to be nervous.',
				de: 'Du musst nicht nervös sein.'
			},
			{
				target: '暗い場所が怖いです。',
				en: 'I am afraid of dark places.',
				de: 'Ich habe Angst vor dunklen Orten.'
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
		themeColor: '#5F4EA3',
		vocab: [
			{ target: 'だった', en: 'was (plain)', de: 'war (umgangssprachlich)' },
			{ target: 'でした', en: 'was (polite)', de: 'war (höflich)' },
			{ target: 'あった', en: 'was/existed', de: 'war/gab es' },
			{ target: 'いた', en: 'was/existed (animate)', de: 'war (bei Lebewesen)' },
			{ target: 'した', en: 'did', de: 'machte' },
			{ target: '行った', en: 'went', de: 'ging' },
			{ target: '来た', en: 'came', de: 'kam' },
			{ target: '見た', en: 'saw', de: 'sah' },
			{ target: '言った', en: 'said', de: 'sagte' },
			{ target: '食べた', en: 'ate', de: 'ass' },
			{ target: '飲んだ', en: 'drank', de: 'trank' },
			{ target: '寝た', en: 'slept', de: 'schlief' },
			{ target: '書いた', en: 'wrote', de: 'schrieb' },
			{ target: '読んだ', en: 'read', de: 'las' },
			{ target: '聞いた', en: 'heard/listened', de: 'hörte' },
			{ target: '感じた', en: 'felt', de: 'fühlte' },
			{ target: 'もらった', en: 'received', de: 'bekam' },
			{ target: '作った', en: 'made', de: 'stellte her' },
			{ target: '学んだ', en: 'learned', de: 'lernte' },
			{ target: '死んだ', en: 'died', de: 'starb' }
		],
		sentences: [
			{
				target: '昨日、映画館に行った。',
				en: 'Yesterday I went to the cinema.',
				de: 'Gestern ging ich ins Kino.'
			},
			{
				target: '彼女は昼ごはんに寿司を食べた。',
				en: 'She ate sushi for lunch.',
				de: 'Sie ass Sushi zum Mittagessen.'
			},
			{
				target: '先生は大切なことを言った。',
				en: 'The teacher said something important.',
				de: 'Der Lehrer sagte etwas Wichtiges.'
			},
			{
				target: '昨夜はあまり寝られなかった。',
				en: 'I could not sleep much last night.',
				de: 'Ich konnte letzte Nacht kaum schlafen.'
			},
			{
				target: '子どものころ、多くのことを学んだ。',
				en: 'I learned many things as a child.',
				de: 'Als Kind lernte ich viele Dinge.'
			}
		]
	},
	{
		titleEn: 'Future Plans',
		titleDe: 'Zukunftspläne',
		descriptionEn: 'Talk about what will happen',
		descriptionDe: 'Sprich über das, was passieren wird',
		themeColor: '#2F7CC2',
		vocab: [
			{ target: '予定', en: 'schedule/plan', de: 'Plan' },
			{ target: 'つもり', en: 'intention', de: 'Absicht' },
			{ target: '計画', en: 'plan', de: 'Planung' },
			{ target: '来週', en: 'next week', de: 'nächste Woche' },
			{ target: '来月', en: 'next month', de: 'nächster Monat' },
			{ target: '来年', en: 'next year', de: 'nächstes Jahr' },
			{ target: '将来', en: 'future', de: 'Zukunft' },
			{ target: '目標', en: 'goal', de: 'Ziel' },
			{ target: '予約する', en: 'to book', de: 'reservieren' },
			{ target: '申し込む', en: 'to apply', de: 'sich anmelden' },
			{ target: '始める', en: 'to start', de: 'beginnen' },
			{ target: '続ける', en: 'to continue', de: 'fortsetzen' },
			{ target: '挑戦する', en: 'to challenge', de: 'sich an etwas wagen' },
			{ target: '旅行する', en: 'to travel', de: 'reisen' },
			{ target: '留学する', en: 'to study abroad', de: 'im Ausland studieren' },
			{ target: '引っ越す', en: 'to move house', de: 'umziehen' },
			{ target: '就職する', en: 'to get a job', de: 'eine Stelle antreten' },
			{ target: '結婚する', en: 'to marry', de: 'heiraten' },
			{ target: '実現する', en: 'to realize', de: 'verwirklichen' },
			{ target: '準備する', en: 'to prepare', de: 'vorbereiten' }
		],
		sentences: [
			{
				target: '来年、日本へ留学するつもりです。',
				en: 'I plan to study in Japan next year.',
				de: 'Ich habe vor, nächstes Jahr in Japan zu studieren.'
			},
			{
				target: '週末に新しいプロジェクトを始めます。',
				en: 'I will start a new project this weekend.',
				de: 'Ich beginne dieses Wochenende ein neues Projekt.'
			},
			{
				target: '将来は医者になりたいです。',
				en: 'I want to become a doctor in the future.',
				de: 'Ich möchte in Zukunft Arzt werden.'
			},
			{
				target: '来月、引っ越す予定です。',
				en: 'I am planning to move next month.',
				de: 'Ich habe vor, nächsten Monat umzuziehen.'
			},
			{
				target: '目標を実現するために毎日勉強しています。',
				en: 'I study every day to achieve my goal.',
				de: 'Ich lerne jeden Tag, um mein Ziel zu erreichen.'
			}
		]
	},
	{
		titleEn: 'Technology',
		titleDe: 'Technologie',
		descriptionEn: 'Digital world vocabulary',
		descriptionDe: 'Vokabular der digitalen Welt',
		themeColor: '#2C8A8A',
		vocab: [
			{ target: 'インターネット', en: 'internet', de: 'Internet' },
			{ target: 'スマートフォン', en: 'smartphone', de: 'Smartphone' },
			{ target: 'アプリ', en: 'app', de: 'App' },
			{ target: 'メッセージ', en: 'message', de: 'Nachricht' },
			{ target: '通話', en: 'call', de: 'Anruf' },
			{ target: '画面', en: 'screen', de: 'Bildschirm' },
			{ target: 'バッテリー', en: 'battery', de: 'Batterie' },
			{ target: '充電器', en: 'charger', de: 'Ladegerät' },
			{ target: 'パスワード', en: 'password', de: 'Passwort' },
			{ target: 'アカウント', en: 'account', de: 'Konto' },
			{ target: 'ダウンロード', en: 'download', de: 'Download' },
			{ target: 'アップロード', en: 'upload', de: 'Upload' },
			{ target: '検索する', en: 'to search', de: 'suchen' },
			{ target: '接続する', en: 'to connect', de: 'verbinden' },
			{ target: 'ネットワーク', en: 'network', de: 'Netzwerk' },
			{ target: 'ウェブサイト', en: 'website', de: 'Webseite' },
			{ target: '動画', en: 'video', de: 'Video' },
			{ target: '写真', en: 'photo', de: 'Foto' },
			{ target: 'ユーザー', en: 'user', de: 'Benutzer' },
			{ target: 'データ', en: 'data', de: 'Daten' }
		],
		sentences: [
			{
				target: '家のインターネットが不安定です。',
				en: 'The internet at home is unstable.',
				de: 'Das Internet zu Hause ist instabil.'
			},
			{
				target: '新しいアプリをダウンロードしました。',
				en: 'I downloaded a new app.',
				de: 'Ich habe eine neue App heruntergeladen.'
			},
			{
				target: 'バッテリーがもう10%しかありません。',
				en: 'My battery only has ten percent left.',
				de: 'Mein Akku hat nur noch zehn Prozent.'
			},
			{
				target: 'パスワードは定期的に変更したほうがいい。',
				en: 'You should change passwords regularly.',
				de: 'Passwörter sollte man regelmäßig ändern.'
			},
			{
				target: '会議の資料をクラウドにアップロードした。',
				en: 'I uploaded the meeting files to the cloud.',
				de: 'Ich habe die Unterlagen in die Cloud hochgeladen.'
			}
		]
	},
	{
		titleEn: 'Environment',
		titleDe: 'Umwelt',
		descriptionEn: 'Talk about environmental topics',
		descriptionDe: 'Sprich über Umweltthemen',
		themeColor: '#4E8C4A',
		vocab: [
			{ target: '環境', en: 'environment', de: 'Umwelt' },
			{ target: '汚染', en: 'pollution', de: 'Verschmutzung' },
			{ target: 'リサイクル', en: 'recycling', de: 'Recycling' },
			{ target: 'ごみ', en: 'trash', de: 'Müll' },
			{ target: 'エネルギー', en: 'energy', de: 'Energie' },
			{ target: '太陽光', en: 'solar power', de: 'Solarenergie' },
			{ target: '気候', en: 'climate', de: 'Klima' },
			{ target: '温暖化', en: 'global warming', de: 'Erderwärmung' },
			{ target: '保護する', en: 'to protect', de: 'schützen' },
			{ target: '節約する', en: 'to save/conserve', de: 'sparen' },
			{ target: '自然', en: 'nature', de: 'Natur' },
			{ target: '資源', en: 'resources', de: 'Ressourcen' },
			{ target: '再生可能', en: 'renewable', de: 'erneuerbar' },
			{ target: '生態系', en: 'ecosystem', de: 'Ökosystem' },
			{ target: '持続可能', en: 'sustainable', de: 'nachhaltig' },
			{ target: '森林破壊', en: 'deforestation', de: 'Abholzung' },
			{ target: '絶滅', en: 'extinction', de: 'Aussterben' },
			{ target: '種', en: 'species', de: 'Art' },
			{ target: '危機', en: 'crisis/danger', de: 'Krise/Gefahr' },
			{ target: '地球', en: 'earth/planet', de: 'Erde/Planet' }
		],
		sentences: [
			{
				target: '環境問題は私たち全員に関係している。',
				en: 'Environmental issues concern all of us.',
				de: 'Umweltprobleme betreffen uns alle.'
			},
			{
				target: 'プラスチックごみを減らす必要がある。',
				en: 'We need to reduce plastic waste.',
				de: 'Wir müssen Plastikmüll reduzieren.'
			},
			{
				target: '再生可能エネルギーへの投資が増えている。',
				en: 'Investment in renewable energy is increasing.',
				de: 'Investitionen in erneuerbare Energie nehmen zu.'
			},
			{
				target: '多くの動物の種が絶滅の危機にある。',
				en: 'Many animal species are at risk of extinction.',
				de: 'Viele Tierarten sind vom Aussterben bedroht.'
			},
			{
				target: '地球を守るために行動しなければならない。',
				en: 'We must act to protect the planet.',
				de: 'Wir müssen handeln, um den Planeten zu schützen.'
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
		themeColor: '#7A3D8F',
		vocab: [
			{ target: '政府', en: 'government', de: 'Regierung' },
			{ target: '政治', en: 'politics', de: 'Politik' },
			{ target: '選挙', en: 'election', de: 'Wahl' },
			{ target: '投票する', en: 'to vote', de: 'wählen' },
			{ target: '民主主義', en: 'democracy', de: 'Demokratie' },
			{ target: '法律', en: 'law', de: 'Gesetz' },
			{ target: '権利', en: 'right', de: 'Recht' },
			{ target: '自由', en: 'freedom', de: 'Freiheit' },
			{ target: '平等', en: 'equality', de: 'Gleichheit' },
			{ target: '正義', en: 'justice', de: 'Gerechtigkeit' },
			{ target: '市民', en: 'citizen', de: 'Bürger' },
			{ target: '大統領', en: 'president', de: 'Präsident' },
			{ target: '政党', en: 'political party', de: 'Partei' },
			{ target: '国会', en: 'parliament', de: 'Parlament' },
			{ target: '憲法', en: 'constitution', de: 'Verfassung' },
			{ target: '抗議', en: 'protest', de: 'Protest' },
			{ target: 'デモ', en: 'demonstration', de: 'Demonstration' },
			{ target: '改革', en: 'reform', de: 'Reform' },
			{ target: '汚職', en: 'corruption', de: 'Korruption' },
			{ target: '世論', en: 'public opinion', de: 'öffentliche Meinung' }
		],
		sentences: [
			{
				target: '来月の選挙は社会に大きな影響を与える。',
				en: 'Next month elections will strongly impact society.',
				de: 'Die Wahlen nächsten Monat werden die Gesellschaft stark beeinflussen.'
			},
			{
				target: '市民には政治に参加する権利がある。',
				en: 'Citizens have the right to participate in politics.',
				de: 'Bürger haben das Recht, an der Politik teilzunehmen.'
			},
			{
				target: '政府は新しい改革案を発表した。',
				en: 'The government announced a new reform proposal.',
				de: 'Die Regierung hat einen neuen Reformvorschlag angekündigt.'
			},
			{
				target: '汚職を防ぐための透明性が求められている。',
				en: 'Transparency is required to prevent corruption.',
				de: 'Transparenz ist notwendig, um Korruption zu verhindern.'
			},
			{
				target: 'デモでは平等と正義が訴えられた。',
				en: 'Equality and justice were demanded in the demonstration.',
				de: 'Bei der Demonstration wurden Gleichheit und Gerechtigkeit gefordert.'
			}
		]
	},
	{
		titleEn: 'Business & Finance',
		titleDe: 'Wirtschaft & Finanzen',
		descriptionEn: 'Professional business vocabulary',
		descriptionDe: 'Professionelles Geschäftsvokabular',
		themeColor: '#C97A24',
		vocab: [
			{ target: 'ビジネス', en: 'business', de: 'Geschäft' },
			{ target: '投資', en: 'investment', de: 'Investition' },
			{ target: '市場', en: 'market', de: 'Markt' },
			{ target: '株式', en: 'stock', de: 'Aktie' },
			{ target: '予算', en: 'budget', de: 'Budget' },
			{ target: '利益', en: 'profit', de: 'Gewinn' },
			{ target: '損失', en: 'loss', de: 'Verlust' },
			{ target: '税金', en: 'tax', de: 'Steuer' },
			{ target: '融資', en: 'loan/financing', de: 'Kredit' },
			{ target: '負債', en: 'debt', de: 'Schulden' },
			{ target: '契約', en: 'contract', de: 'Vertrag' },
			{ target: '取引先', en: 'business partner/client', de: 'Geschäftspartner' },
			{ target: '競争', en: 'competition', de: 'Wettbewerb' },
			{ target: '戦略', en: 'strategy', de: 'Strategie' },
			{ target: 'マーケティング', en: 'marketing', de: 'Marketing' },
			{ target: '顧客', en: 'customer/client', de: 'Kunde' },
			{ target: '供給者', en: 'supplier', de: 'Lieferant' },
			{ target: '製品', en: 'product', de: 'Produkt' },
			{ target: 'サービス', en: 'service', de: 'Dienstleistung' },
			{ target: '収益', en: 'revenue', de: 'Umsatz' }
		],
		sentences: [
			{
				target: '今年の市場は非常に不安定だ。',
				en: 'The market is very unstable this year.',
				de: 'Der Markt ist dieses Jahr sehr instabil.'
			},
			{
				target: '予算を見直して無駄な支出を減らすべきだ。',
				en: 'We should review the budget and reduce unnecessary spending.',
				de: 'Wir sollten das Budget überprüfen und unnötige Ausgaben senken.'
			},
			{
				target: '新しい戦略によって利益が改善した。',
				en: 'Profit improved thanks to the new strategy.',
				de: 'Durch die neue Strategie hat sich der Gewinn verbessert.'
			},
			{
				target: '取引先と長期契約を結んだ。',
				en: 'We signed a long-term contract with a business partner.',
				de: 'Wir haben mit einem Geschäftspartner einen langfristigen Vertrag geschlossen.'
			},
			{
				target: '顧客満足度は企業の成長に直結する。',
				en: 'Customer satisfaction directly affects company growth.',
				de: 'Kundenzufriedenheit wirkt sich direkt auf das Wachstum eines Unternehmens aus.'
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
		themeColor: '#355C9A',
		vocab: [
			{ target: '仮説', en: 'hypothesis', de: 'Hypothese' },
			{ target: '論拠', en: 'argument basis', de: 'Argumentationsgrundlage' },
			{ target: '結論', en: 'conclusion', de: 'Schlussfolgerung' },
			{ target: '分析', en: 'analysis', de: 'Analyse' },
			{ target: '方法論', en: 'methodology', de: 'Methodologie' },
			{ target: '研究', en: 'research', de: 'Forschung' },
			{ target: '証拠', en: 'evidence', de: 'Beleg' },
			{ target: '理論', en: 'theory', de: 'Theorie' },
			{ target: '参考文献', en: 'references', de: 'Literaturverzeichnis' },
			{ target: '引用する', en: 'to cite', de: 'zitieren' },
			{ target: '資料', en: 'source material', de: 'Quelle' },
			{ target: '客観的', en: 'objective', de: 'objektiv' },
			{ target: '主観的', en: 'subjective', de: 'subjektiv' },
			{ target: '視点', en: 'perspective', de: 'Perspektive' },
			{ target: '文脈', en: 'context', de: 'Kontext' },
			{ target: '総合', en: 'synthesis', de: 'Synthese' },
			{ target: '批判的検討', en: 'critical review', de: 'kritische Betrachtung' },
			{ target: '評価する', en: 'to evaluate', de: 'bewerten' },
			{ target: '推論する', en: 'to infer', de: 'schlussfolgern' },
			{ target: '示唆する', en: 'to imply/suggest', de: 'nahelegen' }
		],
		sentences: [
			{
				target: '本研究の仮説は実験結果によって支持された。',
				en: 'The hypothesis of this study was supported by the experimental results.',
				de: 'Die Hypothese dieser Studie wurde durch die Versuchsergebnisse gestützt.'
			},
			{
				target: '先行研究を踏まえると、この理論には再検討の余地がある。',
				en: 'Considering prior studies, this theory leaves room for reconsideration.',
				de: 'Unter Berücksichtigung früherer Studien bietet diese Theorie Raum für eine erneute Prüfung.'
			},
			{
				target: '提示された証拠は結論を十分に裏づけている。',
				en: 'The presented evidence sufficiently supports the conclusion.',
				de: 'Die vorgelegten Belege stützen die Schlussfolgerung ausreichend.'
			},
			{
				target: '論文では複数の視点から問題を分析する必要がある。',
				en: 'In an academic paper, the issue must be analyzed from multiple perspectives.',
				de: 'In einer wissenschaftlichen Arbeit muss das Problem aus mehreren Perspektiven analysiert werden.'
			},
			{
				target: '最後に、研究の限界と今後の課題を示す。',
				en: 'Finally, the limitations of the study and future tasks are presented.',
				de: 'Abschließend werden die Grenzen der Studie und künftige Aufgaben aufgezeigt.'
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
		themeColor: '#A23C6F',
		vocab: [
			{
				target: '猫の手も借りたい',
				en: 'to be extremely busy',
				de: 'alle Hände voll zu tun haben'
			},
			{ target: '口が堅い', en: 'to be discreet', de: 'verschwiegen sein' },
			{ target: '顔が広い', en: 'to be well connected', de: 'gut vernetzt sein' },
			{ target: '頭が切れる', en: 'to be sharp-minded', de: 'sehr scharfsinnig sein' },
			{ target: '腹が立つ', en: 'to get angry', de: 'wutentbrannt sein' },
			{ target: '腰が重い', en: 'to be slow to act', de: 'schwerfällig sein' },
			{ target: '気が利く', en: 'to be considerate', de: 'aufmerksam sein' },
			{ target: '手を焼く', en: 'to have trouble handling', de: 'große Mühe mit etwas haben' },
			{ target: '骨が折れる', en: 'to require great effort', de: 'sehr anstrengend sein' },
			{ target: '目がない', en: 'to have a weakness for', de: 'schwach für etwas sein' },
			{
				target: '耳が痛い',
				en: 'to hear an uncomfortable truth',
				de: 'eine unangenehme Wahrheit hören'
			},
			{ target: '油を売る', en: 'to loaf around', de: 'trödeln' },
			{ target: '口を滑らせる', en: 'to let something slip', de: 'sich verplappern' },
			{ target: '水に流す', en: 'to forgive and forget', de: 'Gras über etwas wachsen lassen' },
			{ target: '足を引っ張る', en: 'to hold someone back', de: 'jemanden behindern' },
			{ target: '話がうまい', en: 'to be a smooth talker', de: 'wortgewandt sein' },
			{ target: '先手を打つ', en: 'to act preemptively', de: 'vorausschauend handeln' },
			{ target: '念には念を入れる', en: 'to be extra careful', de: 'äusserst sorgfältig sein' },
			{
				target: '石の上にも三年',
				en: 'perseverance wins in the end',
				de: 'Ausdauer zahlt sich aus'
			},
			{ target: '七転び八起き', en: 'never give up', de: 'immer wieder aufstehen' }
		],
		sentences: [
			{
				target: '年末は忙しくて、猫の手も借りたい。',
				en: 'At year end we are so busy that we need every possible help.',
				de: 'Zum Jahresende sind wir so beschäftigt, dass wir jede Hilfe brauchen.'
			},
			{
				target: '彼は口が堅いので、安心して相談できる。',
				en: 'He is discreet, so you can consult him with confidence.',
				de: 'Er ist verschwiegen, daher kann man sich vertrauensvoll an ihn wenden.'
			},
			{
				target: '失敗のことは水に流して、次へ進もう。',
				en: 'Let us forgive the mistake and move on.',
				de: 'Lass uns den Fehler vergessen und weitermachen.'
			},
			{
				target: 'この交渉は骨が折れるが、やる価値がある。',
				en: 'This negotiation is hard work but worth doing.',
				de: 'Diese Verhandlung ist mühsam, aber sie lohnt sich.'
			},
			{
				target: '七転び八起きの精神で挑戦し続けている。',
				en: 'I keep challenging myself with a never-give-up spirit.',
				de: 'Ich mache mit einem unbeugsamen Geist immer weiter.'
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
