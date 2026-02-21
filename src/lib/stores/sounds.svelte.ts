let soundEnabled = $state(true);
let audioContext: AudioContext | null = null;

interface ToneOptions {
	frequency: number;
	start: number;
	duration: number;
	gain: number;
	type?: OscillatorType;
	detune?: number;
	attack?: number;
	release?: number;
}

function isBrowser(): boolean {
	return typeof window !== 'undefined';
}

async function ensureAudioContext(): Promise<AudioContext | null> {
	if (!isBrowser()) {
		return null;
	}

	if (!audioContext) {
		audioContext = new AudioContext();
	}

	if (audioContext.state === 'suspended') {
		try {
			await audioContext.resume();
		} catch {
			return null;
		}
	}

	return audioContext;
}

function scheduleTone(context: AudioContext, options: ToneOptions): void {
	const oscillator = context.createOscillator();
	const gainNode = context.createGain();

	const attack = options.attack ?? 0.01;
	const release = options.release ?? 0.03;
	const end = options.start + options.duration;
	const safeAttackEnd = Math.min(options.start + attack, end);
	const safeReleaseStart = Math.max(options.start, end - release);

	oscillator.type = options.type ?? 'sine';
	oscillator.frequency.setValueAtTime(options.frequency, options.start);

	if (typeof options.detune === 'number') {
		oscillator.detune.setValueAtTime(options.detune, options.start);
	}

	gainNode.gain.setValueAtTime(0.0001, options.start);
	gainNode.gain.exponentialRampToValueAtTime(options.gain, safeAttackEnd);
	gainNode.gain.setValueAtTime(options.gain, safeReleaseStart);
	gainNode.gain.exponentialRampToValueAtTime(0.0001, end);

	oscillator.connect(gainNode);
	gainNode.connect(context.destination);

	oscillator.start(options.start);
	oscillator.stop(end + 0.01);
}

function playIfEnabled(callback: (context: AudioContext) => void): void {
	if (!soundEnabled) {
		return;
	}

	void (async () => {
		const context = await ensureAudioContext();
		if (!context || context.state !== 'running') {
			return;
		}

		callback(context);
	})();
}

function scheduleAscending(
	context: AudioContext,
	start: number,
	notes: number[],
	gain: number,
	duration = 0.08,
	gap = 0.02
): void {
	notes.forEach((frequency, index) => {
		scheduleTone(context, {
			frequency,
			start: start + index * (duration + gap),
			duration,
			gain,
			type: 'sine',
			attack: 0.006,
			release: 0.03
		});
	});
}

export function setSoundEnabled(enabled: boolean): void {
	soundEnabled = enabled;
}

export function isSoundEnabled(): boolean {
	return soundEnabled;
}

export function playCorrect(): void {
	playIfEnabled((context) => {
		const start = context.currentTime + 0.001;
		scheduleTone(context, { frequency: 740, start, duration: 0.07, gain: 0.07, type: 'sine' });
		scheduleTone(context, {
			frequency: 932,
			start: start + 0.05,
			duration: 0.11,
			gain: 0.09,
			type: 'triangle'
		});
	});
}

export function playIncorrect(): void {
	playIfEnabled((context) => {
		const start = context.currentTime + 0.001;
		const duration = 0.16;
		const oscillator = context.createOscillator();
		const gainNode = context.createGain();

		oscillator.type = 'sawtooth';
		oscillator.frequency.setValueAtTime(280, start);
		oscillator.frequency.exponentialRampToValueAtTime(160, start + duration);

		gainNode.gain.setValueAtTime(0.0001, start);
		gainNode.gain.exponentialRampToValueAtTime(0.06, start + 0.01);
		gainNode.gain.exponentialRampToValueAtTime(0.0001, start + duration);

		oscillator.connect(gainNode);
		gainNode.connect(context.destination);

		oscillator.start(start);
		oscillator.stop(start + duration + 0.01);
	});
}

export function playCombo(multiplier: number): void {
	playIfEnabled((context) => {
		const start = context.currentTime + 0.001;
		const clamped = Math.max(1, Math.min(multiplier, 10));
		const base = 660 + clamped * 22;
		scheduleTone(context, { frequency: base, start, duration: 0.06, gain: 0.06, type: 'triangle' });
		scheduleTone(context, {
			frequency: base * 1.26,
			start: start + 0.045,
			duration: 0.08,
			gain: 0.075,
			type: 'triangle'
		});
		scheduleTone(context, {
			frequency: base * 1.5,
			start: start + 0.095,
			duration: 0.1,
			gain: 0.085,
			type: 'sine'
		});
	});
}

export function playAchievement(): void {
	playIfEnabled((context) => {
		const start = context.currentTime + 0.001;
		scheduleAscending(context, start, [523.25, 659.25, 783.99], 0.08, 0.065, 0.012);
	});
}

export function playStreak(): void {
	playIfEnabled((context) => {
		const start = context.currentTime + 0.001;
		scheduleAscending(context, start, [587.33, 739.99], 0.075, 0.06, 0.01);
	});
}

export function playLevelUp(): void {
	playIfEnabled((context) => {
		const start = context.currentTime + 0.001;
		scheduleAscending(context, start, [440, 554.37, 659.25, 880], 0.075, 0.05, 0.01);
	});
}

export function playStreakMilestone(): void {
	playIfEnabled((context) => {
		const start = context.currentTime + 0.001;
		scheduleAscending(context, start, [392, 523.25, 659.25], 0.07, 0.05, 0.01);
		scheduleTone(context, {
			frequency: 1046.5,
			start: start + 0.17,
			duration: 0.12,
			gain: 0.1,
			type: 'triangle',
			attack: 0.008,
			release: 0.06
		});
		scheduleTone(context, {
			frequency: 1318.51,
			start: start + 0.17,
			duration: 0.12,
			gain: 0.06,
			type: 'sine',
			detune: 6,
			attack: 0.008,
			release: 0.06
		});
	});
}

export function playPurchase(): void {
	playIfEnabled((context) => {
		const start = context.currentTime + 0.001;
		scheduleTone(context, {
			frequency: 1318.51,
			start,
			duration: 0.08,
			gain: 0.07,
			type: 'triangle',
			attack: 0.003,
			release: 0.04
		});
		scheduleTone(context, {
			frequency: 2093,
			start: start + 0.012,
			duration: 0.06,
			gain: 0.035,
			type: 'square',
			detune: 5,
			attack: 0.003,
			release: 0.035
		});
	});
}
