import type { ConjugationPatternData } from '$lib/learning/types';

export const CONJUGATION_PRESENT: ConjugationPatternData[] = [
	{
		infinitive: 'hablar',
		infinitiveEn: 'to speak',
		infinitiveDe: 'sprechen',
		group: '-ar',
		isIrregular: false,
		forms: {
			present: {
				yo: 'hablo',
				tu: 'hablas',
				el: 'habla',
				nosotros: 'hablamos',
				vosotros: 'hablais',
				ellos: 'hablan'
			}
		}
	},
	{
		infinitive: 'comer',
		infinitiveEn: 'to eat',
		infinitiveDe: 'essen',
		group: '-er',
		isIrregular: false,
		forms: {
			present: {
				yo: 'como',
				tu: 'comes',
				el: 'come',
				nosotros: 'comemos',
				vosotros: 'comeis',
				ellos: 'comen'
			}
		}
	},
	{
		infinitive: 'vivir',
		infinitiveEn: 'to live',
		infinitiveDe: 'leben',
		group: '-ir',
		isIrregular: false,
		forms: {
			present: {
				yo: 'vivo',
				tu: 'vives',
				el: 'vive',
				nosotros: 'vivimos',
				vosotros: 'vivis',
				ellos: 'viven'
			}
		}
	},
	{
		infinitive: 'ser',
		infinitiveEn: 'to be',
		infinitiveDe: 'sein',
		group: 'irregular',
		isIrregular: true,
		forms: {
			present: {
				yo: 'soy',
				tu: 'eres',
				el: 'es',
				nosotros: 'somos',
				vosotros: 'sois',
				ellos: 'son'
			}
		}
	},
	{
		infinitive: 'estar',
		infinitiveEn: 'to be',
		infinitiveDe: 'sein',
		group: 'irregular',
		isIrregular: true,
		forms: {
			present: {
				yo: 'estoy',
				tu: 'estas',
				el: 'esta',
				nosotros: 'estamos',
				vosotros: 'estais',
				ellos: 'estan'
			}
		}
	},
	{
		infinitive: 'tener',
		infinitiveEn: 'to have',
		infinitiveDe: 'haben',
		group: 'irregular',
		isIrregular: true,
		forms: {
			present: {
				yo: 'tengo',
				tu: 'tienes',
				el: 'tiene',
				nosotros: 'tenemos',
				vosotros: 'teneis',
				ellos: 'tienen'
			}
		}
	},
	{
		infinitive: 'ir',
		infinitiveEn: 'to go',
		infinitiveDe: 'gehen',
		group: 'irregular',
		isIrregular: true,
		forms: {
			present: {
				yo: 'voy',
				tu: 'vas',
				el: 'va',
				nosotros: 'vamos',
				vosotros: 'vais',
				ellos: 'van'
			}
		}
	},
	{
		infinitive: 'hacer',
		infinitiveEn: 'to do / to make',
		infinitiveDe: 'machen / tun',
		group: 'irregular',
		isIrregular: true,
		forms: {
			present: {
				yo: 'hago',
				tu: 'haces',
				el: 'hace',
				nosotros: 'hacemos',
				vosotros: 'haceis',
				ellos: 'hacen'
			}
		}
	},
	{
		infinitive: 'poder',
		infinitiveEn: 'to be able to',
		infinitiveDe: 'konnen',
		group: 'irregular',
		isIrregular: true,
		forms: {
			present: {
				yo: 'puedo',
				tu: 'puedes',
				el: 'puede',
				nosotros: 'podemos',
				vosotros: 'podeis',
				ellos: 'pueden'
			}
		}
	},
	{
		infinitive: 'querer',
		infinitiveEn: 'to want',
		infinitiveDe: 'wollen',
		group: 'irregular',
		isIrregular: true,
		forms: {
			present: {
				yo: 'quiero',
				tu: 'quieres',
				el: 'quiere',
				nosotros: 'queremos',
				vosotros: 'quereis',
				ellos: 'quieren'
			}
		}
	}
];
