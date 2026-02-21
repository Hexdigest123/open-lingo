import type { ConjugationPatternData } from '$lib/learning/types';

export const CONJUGATION_PRESENT: ConjugationPatternData[] = [
	{
		infinitive: 'parlare',
		infinitiveEn: 'to speak',
		infinitiveDe: 'sprechen',
		group: '-are',
		isIrregular: false,
		forms: {
			present: {
				io: 'parlo',
				tu: 'parli',
				lui: 'parla',
				noi: 'parliamo',
				voi: 'parlate',
				loro: 'parlano'
			}
		}
	},
	{
		infinitive: 'scrivere',
		infinitiveEn: 'to write',
		infinitiveDe: 'schreiben',
		group: '-ere',
		isIrregular: false,
		forms: {
			present: {
				io: 'scrivo',
				tu: 'scrivi',
				lui: 'scrive',
				noi: 'scriviamo',
				voi: 'scrivete',
				loro: 'scrivono'
			}
		}
	},
	{
		infinitive: 'dormire',
		infinitiveEn: 'to sleep',
		infinitiveDe: 'schlafen',
		group: '-ire',
		isIrregular: false,
		forms: {
			present: {
				io: 'dormo',
				tu: 'dormi',
				lui: 'dorme',
				noi: 'dormiamo',
				voi: 'dormite',
				loro: 'dormono'
			}
		}
	},
	{
		infinitive: 'essere',
		infinitiveEn: 'to be',
		infinitiveDe: 'sein',
		group: 'irregular',
		isIrregular: true,
		forms: {
			present: {
				io: 'sono',
				tu: 'sei',
				lui: 'e',
				noi: 'siamo',
				voi: 'siete',
				loro: 'sono'
			}
		}
	},
	{
		infinitive: 'avere',
		infinitiveEn: 'to have',
		infinitiveDe: 'haben',
		group: 'irregular',
		isIrregular: true,
		forms: {
			present: {
				io: 'ho',
				tu: 'hai',
				lui: 'ha',
				noi: 'abbiamo',
				voi: 'avete',
				loro: 'hanno'
			}
		}
	},
	{
		infinitive: 'andare',
		infinitiveEn: 'to go',
		infinitiveDe: 'gehen',
		group: 'irregular',
		isIrregular: true,
		forms: {
			present: {
				io: 'vado',
				tu: 'vai',
				lui: 'va',
				noi: 'andiamo',
				voi: 'andate',
				loro: 'vanno'
			}
		}
	},
	{
		infinitive: 'fare',
		infinitiveEn: 'to do / to make',
		infinitiveDe: 'tun / machen',
		group: 'irregular',
		isIrregular: true,
		forms: {
			present: {
				io: 'faccio',
				tu: 'fai',
				lui: 'fa',
				noi: 'facciamo',
				voi: 'fate',
				loro: 'fanno'
			}
		}
	},
	{
		infinitive: 'potere',
		infinitiveEn: 'to be able to',
		infinitiveDe: 'können',
		group: 'irregular',
		isIrregular: true,
		forms: {
			present: {
				io: 'posso',
				tu: 'puoi',
				lui: 'puo',
				noi: 'possiamo',
				voi: 'potete',
				loro: 'possono'
			}
		}
	},
	{
		infinitive: 'volere',
		infinitiveEn: 'to want',
		infinitiveDe: 'wollen',
		group: 'irregular',
		isIrregular: true,
		forms: {
			present: {
				io: 'voglio',
				tu: 'vuoi',
				lui: 'vuole',
				noi: 'vogliamo',
				voi: 'volete',
				loro: 'vogliono'
			}
		}
	},
	{
		infinitive: 'dovere',
		infinitiveEn: 'to have to / must',
		infinitiveDe: 'müssen / sollen',
		group: 'irregular',
		isIrregular: true,
		forms: {
			present: {
				io: 'devo',
				tu: 'devi',
				lui: 'deve',
				noi: 'dobbiamo',
				voi: 'dovete',
				loro: 'devono'
			}
		}
	}
];
