<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import { enhance } from '$app/forms';
	import type { QuestionType } from '$lib/server/db/schema';
type Question = {
		id: number;
		type: QuestionType;
		content: Record<string, unknown>;
		correctAnswer: string;
	};

	interface Props {
		mode: 'add' | 'edit';
		question?: Question | null;
		lessonId: number;
		onClose: () => void;
	}

	const QUESTION_TYPES: { value: QuestionType; label: string }[] = [
		{ value: 'multiple_choice', label: 'admin.questions.types.multipleChoice' },
		{ value: 'fill_blank', label: 'admin.questions.types.fillBlank' },
		{ value: 'translation', label: 'admin.questions.types.translation' },
		{ value: 'matching', label: 'admin.questions.types.matching' },
		{ value: 'word_order', label: 'admin.questions.types.wordOrder' },
		{ value: 'speaking', label: 'admin.questions.types.speaking' },
		{ value: 'listening', label: 'admin.questions.types.listening' },
		{ value: 'character_recognition', label: 'admin.questions.types.characterRecognition' },
		{ value: 'character_writing', label: 'admin.questions.types.characterWriting' },
		{ value: 'script_transliteration', label: 'admin.questions.types.scriptTransliteration' },
		{ value: 'conjugation_cloze', label: 'admin.questions.types.conjugationCloze' },
		{ value: 'particle_selection', label: 'admin.questions.types.particleSelection' },
		{ value: 'grammar_transformation', label: 'admin.questions.types.grammarTransformation' },
		{ value: 'kanji_composition', label: 'admin.questions.types.kanjiComposition' },
		{ value: 'minimal_pair_discrimination', label: 'admin.questions.types.minimalPair' },
		{ value: 'dictation', label: 'admin.questions.types.dictation' },
		{ value: 'guided_composition', label: 'admin.questions.types.guidedComposition' }
	];

	let { mode, question, lessonId, onClose }: Props = $props();

	// Form state
	let selectedType = $state<QuestionType>(question?.type || 'multiple_choice');
	let correctAnswer = $state(question?.correctAnswer || '');
	let isSubmitting = $state(false);
	let formError = $state<string | null>(null);

	// Multiple choice
	let mcQuestionEn = $state((question?.content?.questionEn as string) || '');
	let mcQuestionDe = $state((question?.content?.questionDe as string) || '');
	let mcOptions = $state<string[]>((question?.content?.options as string[]) || ['', '', '', '']);

	// Fill blank
	let fbSentenceEn = $state(
		(question?.content?.sentenceEn as string) || (question?.content?.sentence as string) || ''
	);
	let fbSentenceDe = $state((question?.content?.sentenceDe as string) || '');
	let fbHintEn = $state(
		(question?.content?.hintEn as string) || (question?.content?.hint as string) || ''
	);
	let fbHintDe = $state((question?.content?.hintDe as string) || '');

	// Translation
	const initialTransDirection = (() => {
		const direction = question?.content?.direction as string | undefined;
		if (direction === 'target_to_native' || direction === 'es_to_native') {
			return 'target_to_native';
		}
		return 'native_to_target';
	})();
	let transDirection = $state<'native_to_target' | 'target_to_native'>(initialTransDirection);
	let transTextEn = $state((question?.content?.textEn as string) || '');
	let transTextDe = $state((question?.content?.textDe as string) || '');
	let transText = $state((question?.content?.text as string) || '');

	// Matching
	let matchingPairs = $state<
		Array<{ target: string; english: string; german: string; spanish?: string }>
	>(
		(
			question?.content?.pairs as Array<{
				target?: string;
				spanish?: string;
				english: string;
				german?: string;
			}>
		)?.map((p) => ({
			target: p.target || p.spanish || '',
			spanish: p.spanish,
			english: p.english || '',
			german: p.german || ''
		})) || [
			{ target: '', english: '', german: '' },
			{ target: '', english: '', german: '' },
			{ target: '', english: '', german: '' },
			{ target: '', english: '', german: '' }
		]
	);

	// Word order
	let woWords = $state<string[]>((question?.content?.words as string[]) || ['', '', '', '']);
	let woInstructionEn = $state((question?.content?.instructionEn as string) || '');
	let woInstructionDe = $state((question?.content?.instructionDe as string) || '');

	// Speaking
	let spTextToSpeak = $state((question?.content?.textToSpeak as string) || '');
	let spHintEn = $state((question?.content?.hintEn as string) || '');
	let spHintDe = $state((question?.content?.hintDe as string) || '');

	// Listening
	let liTextToHear = $state((question?.content?.textToHear as string) || '');
	let liAnswerType = $state<'type' | 'multiple_choice'>(
		(question?.content?.answerType as 'type' | 'multiple_choice') || 'type'
	);
	let liOptions = $state<string[]>((question?.content?.options as string[]) || ['', '', '', '']);

	// Character recognition
	let crCharacter = $state((question?.content?.character as string) || '');
	let crOptions = $state<string[]>((question?.content?.options as string[]) || ['', '', '', '']);
	let crCharacterType = $state<'hiragana' | 'katakana' | 'kanji'>(
		(question?.content?.characterType as 'hiragana' | 'katakana' | 'kanji') || 'hiragana'
	);

	// Character writing
	let cwReading = $state((question?.content?.reading as string) || '');
	let cwCharacterType = $state<'hiragana' | 'katakana' | 'kanji'>(
		(question?.content?.characterType as 'hiragana' | 'katakana' | 'kanji') || 'hiragana'
	);

	// Script transliteration
	let stSourceText = $state((question?.content?.sourceText as string) || '');
	let stSourceScript = $state<'romaji' | 'hiragana' | 'katakana' | 'kanji'>(
		(question?.content?.sourceScript as 'romaji' | 'hiragana' | 'katakana' | 'kanji') || 'romaji'
	);
	let stTargetScript = $state<'romaji' | 'hiragana' | 'katakana'>(
		(question?.content?.targetScript as 'romaji' | 'hiragana' | 'katakana') || 'hiragana'
	);

	// Conjugation cloze
	let ccSentence = $state((question?.content?.sentence as string) || '');
	let ccInfinitive = $state((question?.content?.infinitive as string) || '');
	let ccTargetTense = $state((question?.content?.targetTense as string) || '');

	// Particle selection
	let psSentence = $state((question?.content?.sentence as string) || '');
	let psOptions = $state<string[]>((question?.content?.options as string[]) || ['', '', '', '']);

	// Grammar transformation
	let gtSourceSentence = $state((question?.content?.sourceSentence as string) || '');
	let gtTransformationType = $state((question?.content?.transformationType as string) || '');

	// Kanji composition
	let kcTargetKanji = $state((question?.content?.targetKanji as string) || '');
	let kcRadicals = $state<string[]>((question?.content?.radicals as string[]) || ['', '']);
	let kcDistractorRadicals = $state<string[]>(
		(question?.content?.distractorRadicals as string[]) || ['', '']
	);

	// Minimal pair discrimination
	let mpAudioText = $state((question?.content?.audioText as string) || '');
	let mpOptions = $state<Array<{ text: string; isCorrect: boolean }>>(
		(question?.content?.options as Array<{ text: string; isCorrect: boolean }>) || [
			{ text: '', isCorrect: true },
			{ text: '', isCorrect: false }
		]
	);

	// Dictation
	let diTextToHear = $state((question?.content?.textToHear as string) || '');
	let diSpeed = $state<'normal' | 'slow'>(
		(question?.content?.speed as 'normal' | 'slow') || 'normal'
	);

	// Guided composition
	let gcVocabularyHints = $state<string[]>(
		(question?.content?.vocabularyHints as string[]) || ['', '', '']
	);

	function buildContent(): Record<string, unknown> {
		switch (selectedType) {
			case 'multiple_choice':
				return {
					questionEn: mcQuestionEn,
					questionDe: mcQuestionDe || undefined,
					options: mcOptions.filter((o) => o.trim())
				};

			case 'fill_blank':
				return {
					sentenceEn: fbSentenceEn,
					sentenceDe: fbSentenceDe || undefined,
					hintEn: fbHintEn || undefined,
					hintDe: fbHintDe || undefined
				};

			case 'translation':
				if (transDirection === 'native_to_target') {
					return {
						textEn: transTextEn,
						textDe: transTextDe || undefined,
						direction: transDirection
					};
				} else {
					return {
						text: transText,
						direction: transDirection
					};
				}

			case 'matching':
				return {
					pairs: matchingPairs
						.filter((p) => (p.target || p.spanish || '').trim() && p.english.trim())
						.map((p) => ({
							target: p.target || p.spanish,
							spanish: p.target || p.spanish,
							english: p.english,
							german: p.german || undefined
						}))
				};

			case 'word_order':
				return {
					words: woWords.filter((w) => w.trim()),
					instructionEn: woInstructionEn,
					instructionDe: woInstructionDe || undefined
				};

			case 'speaking':
				return {
					textToSpeak: spTextToSpeak,
					hintEn: spHintEn || undefined,
					hintDe: spHintDe || undefined
				};

			case 'listening':
				return {
					textToHear: liTextToHear,
					answerType: liAnswerType,
					options:
						liAnswerType === 'multiple_choice' ? liOptions.filter((o) => o.trim()) : undefined
				};


			case 'character_recognition':
				return {
					character: crCharacter,
					options: crOptions.filter((o) => o.trim()),
					characterType: crCharacterType
				};

			case 'character_writing':
				return {
					reading: cwReading,
					characterType: cwCharacterType
				};

			case 'script_transliteration':
				return {
					sourceText: stSourceText,
					sourceScript: stSourceScript,
					targetScript: stTargetScript
				};

			case 'conjugation_cloze':
				return {
					sentence: ccSentence,
					infinitive: ccInfinitive,
					targetTense: ccTargetTense
				};

			case 'particle_selection':
				return {
					sentence: psSentence,
					options: psOptions.filter((o) => o.trim())
				};

			case 'grammar_transformation':
				return {
					sourceSentence: gtSourceSentence,
					transformationType: gtTransformationType
				};

			case 'kanji_composition':
				return {
					targetKanji: kcTargetKanji,
					radicals: kcRadicals.filter((r) => r.trim()),
					distractorRadicals: kcDistractorRadicals.filter((r) => r.trim())
				};

			case 'minimal_pair_discrimination':
				return {
					audioText: mpAudioText,
					options: mpOptions.filter((o) => o.text.trim())
				};

			case 'dictation':
				return {
					textToHear: diTextToHear,
					speed: diSpeed
				};

			case 'guided_composition':
				return {
					vocabularyHints: gcVocabularyHints.filter((h) => h.trim())
				};
			default:
				return {};
		}
	}

	function addOption(arr: string[], setter: (v: string[]) => void) {
		setter([...arr, '']);
	}

	function removeOption(arr: string[], index: number, setter: (v: string[]) => void) {
		setter(arr.filter((_, i) => i !== index));
	}

	function addPair() {
		matchingPairs = [...matchingPairs, { target: '', english: '', german: '' }];
	}

	function removePair(index: number) {
		matchingPairs = matchingPairs.filter((_, i) => i !== index);
	}

	function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		formError = null;

		const content = buildContent();
		const form = e.target as HTMLFormElement;
		const formData = new FormData(form);

		// For matching questions, always use 'all_matched' as correct answer
		const finalCorrectAnswer = selectedType === 'matching' ? 'all_matched' : correctAnswer;

		formData.set('type', selectedType);
		formData.set('content', JSON.stringify(content));
		formData.set('correctAnswer', finalCorrectAnswer);

		if (mode === 'edit' && question) {
			formData.set('questionId', question.id.toString());
		}

		isSubmitting = true;

		fetch(form.action, {
			method: 'POST',
			body: formData
		})
			.then((res) => res.text())
			.then((text) => {
				// Check for success
				if (text.includes('"success":true') || text.includes('success')) {
					onClose();
					window.location.reload();
				} else {
					// Try to extract error
					const match = text.match(/"error":"([^"]+)"/);
					formError = match ? match[1] : m["admin.questions.errors.generic"]();
				}
			})
			.catch(() => {
				formError = m["admin.questions.errors.network"]();
			})
			.finally(() => {
				isSubmitting = false;
			});
	}
</script>

<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
	<div class="max-h-[90vh] w-full max-w-2xl overflow-y-auto card">
		<div class="mb-4 flex items-center justify-between">
			<h2 class="text-xl font-bold text-text-light">
				{mode === 'add' ? m["admin.questions.addTitle"]() : m["admin.questions.editTitle"]()}
			</h2>
			<button onclick={onClose} class="text-2xl text-text-muted hover:text-text-light">
				&times;
			</button>
		</div>

		{#if formError}
			<div class="mb-4 rounded-xl bg-error/10 p-3 text-sm text-error">{formError}</div>
		{/if}

		<form
			method="POST"
			action={mode === 'add' ? '?/addQuestion' : '?/updateQuestion'}
			onsubmit={handleSubmit}
			class="space-y-4"
		>
			<!-- Question Type Selector -->
			<div>
				<label for="questionType" class="mb-1 block text-sm font-medium text-text-light">
					{m["admin.questions.questionType"]()}
				</label>
				<select
					id="questionType"
					bind:value={selectedType}
					disabled={mode === 'edit'}
					class="input"
				>
					{#each QUESTION_TYPES as qtype}
						<option value={qtype.value}>{(m[qtype.label as keyof typeof m] as unknown as (() => string))?.() ?? qtype.label}</option>
					{/each}
				</select>
			</div>

			<!-- Type-specific content -->
			{#if selectedType === 'multiple_choice'}
				<div class="space-y-3 rounded-xl bg-bg-light-secondary p-3">
					<h3 class="font-medium text-text-light">{m["admin.questions.section.multipleChoice"]()}</h3>
					<div>
						<label class="mb-1 block text-sm text-text-muted"
							>{m["admin.questions.labels.questionEn"]()}</label
						>
						<input
							type="text"
							bind:value={mcQuestionEn}
							class="input"
							placeholder="How do you say 'hello' in the target language?"
						/>
					</div>
					<div>
						<label class="mb-1 block text-sm text-text-muted"
							>{m["admin.questions.labels.questionDe"]()}</label
						>
						<input
							type="text"
							bind:value={mcQuestionDe}
							class="input"
							placeholder="Wie sagt man 'Hallo' in der Zielsprache?"
						/>
					</div>
					<div>
						<label class="mb-1 block text-sm text-text-muted"
							>{m["admin.questions.labels.options"]()}</label
						>
						{#each mcOptions as option, i}
							<div class="mb-2 flex gap-2">
								<input
									type="text"
									bind:value={mcOptions[i]}
									class="input flex-1"
									placeholder="Option {i + 1}"
								/>
								{#if mcOptions.length > 2}
									<button
										type="button"
										onclick={() => removeOption(mcOptions, i, (v) => (mcOptions = v))}
										class="text-error hover:text-error/80"
									>
										&times;
									</button>
								{/if}
							</div>
						{/each}
						{#if mcOptions.length < 6}
							<button
								type="button"
								onclick={() => addOption(mcOptions, (v) => (mcOptions = v))}
								class="text-sm text-primary hover:underline"
							>
								{m["admin.questions.buttons.addOption"]()}
							</button>
						{/if}
					</div>
				</div>
			{:else if selectedType === 'fill_blank'}
				<div class="space-y-3 rounded-xl bg-bg-light-secondary p-3">
					<h3 class="font-medium text-text-light">{m["admin.questions.section.fillBlank"]()}</h3>
					<div>
						<label class="mb-1 block text-sm text-text-muted"
							>{m["admin.questions.labels.sentenceEn"]()}</label
						>
						<input
							type="text"
							bind:value={fbSentenceEn}
							class="input"
							placeholder="The target language word for 'hello' is _____."
						/>
					</div>
					<div>
						<label class="mb-1 block text-sm text-text-muted"
							>{m["admin.questions.labels.sentenceDe"]()}</label
						>
						<input
							type="text"
							bind:value={fbSentenceDe}
							class="input"
							placeholder="Das Wort der Zielsprache für 'Hallo' ist _____."
						/>
					</div>
					<div class="grid grid-cols-2 gap-3">
						<div>
							<label class="mb-1 block text-sm text-text-muted"
								>{m["admin.questions.labels.hintEn"]()}</label
							>
							<input
								type="text"
								bind:value={fbHintEn}
								class="input"
								placeholder="Starts with 'H'"
							/>
						</div>
						<div>
							<label class="mb-1 block text-sm text-text-muted"
								>{m["admin.questions.labels.hintDe"]()}</label
							>
							<input
								type="text"
								bind:value={fbHintDe}
								class="input"
								placeholder="Beginnt mit 'H'"
							/>
						</div>
					</div>
				</div>
			{:else if selectedType === 'translation'}
				<div class="space-y-3 rounded-xl bg-bg-light-secondary p-3">
					<h3 class="font-medium text-text-light">{m["admin.questions.section.translation"]()}</h3>
					<div>
						<label class="mb-1 block text-sm text-text-muted"
							>{m["admin.questions.labels.direction"]()}</label
						>
						<select bind:value={transDirection} class="input">
							<option value="native_to_target">{m["admin.questions.labels.nativeToTarget"]()}</option>
							<option value="target_to_native">{m["admin.questions.labels.targetToNative"]()}</option>
						</select>
					</div>
					{#if transDirection === 'native_to_target'}
						<div>
							<label class="mb-1 block text-sm text-text-muted"
								>{m["admin.questions.labels.sourceTextEn"]()}</label
							>
							<input type="text" bind:value={transTextEn} class="input" placeholder="Hello" />
						</div>
						<div>
							<label class="mb-1 block text-sm text-text-muted"
								>{m["admin.questions.labels.sourceTextDe"]()}</label
							>
							<input type="text" bind:value={transTextDe} class="input" placeholder="Hallo" />
						</div>
					{:else}
						<div>
							<label class="mb-1 block text-sm text-text-muted"
								>{m["admin.questions.labels.targetLangText"]()}</label
							>
							<input type="text" bind:value={transText} class="input" placeholder="Hola" />
						</div>
					{/if}
				</div>
			{:else if selectedType === 'matching'}
				<div class="space-y-3 rounded-xl bg-bg-light-secondary p-3">
					<h3 class="font-medium text-text-light">{m["admin.questions.section.matching"]()}</h3>
					{#each matchingPairs as pair, i}
						<div class="flex items-start gap-2">
							<div class="grid flex-1 grid-cols-3 gap-2">
								<input
									type="text"
									bind:value={matchingPairs[i].target}
									class="input"
									placeholder="Target Language"
								/>
								<input
									type="text"
									bind:value={matchingPairs[i].english}
									class="input"
									placeholder="English"
								/>
								<input
									type="text"
									bind:value={matchingPairs[i].german}
									class="input"
									placeholder="German (opt)"
								/>
							</div>
							{#if matchingPairs.length > 2}
								<button
									type="button"
									onclick={() => removePair(i)}
									class="mt-2 text-error hover:text-error/80"
								>
									&times;
								</button>
							{/if}
						</div>
					{/each}
					{#if matchingPairs.length < 6}
						<button type="button" onclick={addPair} class="text-sm text-primary hover:underline">
							{m["admin.questions.buttons.addPair"]()}
						</button>
					{/if}
				</div>
			{:else if selectedType === 'word_order'}
				<div class="space-y-3 rounded-xl bg-bg-light-secondary p-3">
					<h3 class="font-medium text-text-light">{m["admin.questions.section.wordOrder"]()}</h3>
					<div>
						<label class="mb-1 block text-sm text-text-muted"
							>{m["admin.questions.labels.wordsScrambled"]()}</label
						>
						{#each woWords as word, i}
							<div class="mb-2 flex gap-2">
								<input
									type="text"
									bind:value={woWords[i]}
									class="input flex-1"
									placeholder="Word {i + 1}"
								/>
								{#if woWords.length > 2}
									<button
										type="button"
										onclick={() => removeOption(woWords, i, (v) => (woWords = v))}
										class="text-error hover:text-error/80"
									>
										&times;
									</button>
								{/if}
							</div>
						{/each}
						{#if woWords.length < 10}
							<button
								type="button"
								onclick={() => addOption(woWords, (v) => (woWords = v))}
								class="text-sm text-primary hover:underline"
							>
								+ Add Word
							</button>
						{/if}
					</div>
					<div>
						<label class="mb-1 block text-sm text-text-muted">Instruction (English)</label>
						<input
							type="text"
							bind:value={woInstructionEn}
							class="input"
							placeholder="Arrange: 'Hello, how are you?'"
						/>
					</div>
					<div>
						<label class="mb-1 block text-sm text-text-muted">Instruction (German) - optional</label
						>
						<input
							type="text"
							bind:value={woInstructionDe}
							class="input"
							placeholder="Ordne: 'Hallo, wie geht es dir?'"
						/>
					</div>
				</div>
			{:else if selectedType === 'speaking'}
				<div class="space-y-3 rounded-xl bg-bg-light-secondary p-3">
					<h3 class="font-medium text-text-light">Speaking Content</h3>
					<div>
						<label class="mb-1 block text-sm text-text-muted">Text to Speak (Target Language)</label
						>
						<input type="text" bind:value={spTextToSpeak} class="input" placeholder="Hola" />
					</div>
					<div class="grid grid-cols-2 gap-3">
						<div>
							<label class="mb-1 block text-sm text-text-muted">Hint (English)</label>
							<input type="text" bind:value={spHintEn} class="input" placeholder="Hello" />
						</div>
						<div>
							<label class="mb-1 block text-sm text-text-muted">Hint (German)</label>
							<input type="text" bind:value={spHintDe} class="input" placeholder="Hallo" />
						</div>
					</div>
				</div>
			{:else if selectedType === 'listening'}
				<div class="space-y-3 rounded-xl bg-bg-light-secondary p-3">
					<h3 class="font-medium text-text-light">Listening Content</h3>
					<div>
						<label class="mb-1 block text-sm text-text-muted">Text to Hear (Target Language)</label>
						<input type="text" bind:value={liTextToHear} class="input" placeholder="Hola" />
					</div>
					<div>
						<label class="mb-1 block text-sm text-text-muted">Answer Type</label>
						<select bind:value={liAnswerType} class="input">
							<option value="type">Type Answer</option>
							<option value="multiple_choice">Multiple Choice</option>
						</select>
					</div>
					{#if liAnswerType === 'multiple_choice'}
						<div>
							<label class="mb-1 block text-sm text-text-muted">Options</label>
							{#each liOptions as option, i}
								<div class="mb-2 flex gap-2">
									<input
										type="text"
										bind:value={liOptions[i]}
										class="input flex-1"
										placeholder="Option {i + 1}"
									/>
									{#if liOptions.length > 2}
										<button
											type="button"
											onclick={() => removeOption(liOptions, i, (v) => (liOptions = v))}
											class="text-error hover:text-error/80"
										>
											&times;
										</button>
									{/if}
								</div>
							{/each}
							{#if liOptions.length < 6}
								<button
									type="button"
									onclick={() => addOption(liOptions, (v) => (liOptions = v))}
									class="text-sm text-primary hover:underline"
								>
									+ Add Option
								</button>
							{/if}
						</div>
					{/if}
				</div>
			{:else if selectedType === 'character_recognition'}
				<div class="space-y-3 rounded-xl bg-bg-light-secondary p-3">
					<h3 class="font-medium text-text-light">{m["admin.questions.section.characterRecognition"]()}</h3>
					<div>
						<label class="mb-1 block text-sm text-text-muted">Character</label>
						<input type="text" bind:value={crCharacter} class="input" placeholder="あ" />
					</div>
					<div>
						<label class="mb-1 block text-sm text-text-muted">Character Type</label>
						<select bind:value={crCharacterType} class="input">
							<option value="hiragana">Hiragana</option>
							<option value="katakana">Katakana</option>
							<option value="kanji">Kanji</option>
						</select>
					</div>
					<div>
						<label class="mb-1 block text-sm text-text-muted">Answer Options</label>
						{#each crOptions as option, i}
							<div class="mb-2 flex gap-2">
								<input type="text" bind:value={crOptions[i]} class="input flex-1" placeholder="Option {i + 1}" />
								{#if crOptions.length > 2}
									<button type="button" onclick={() => removeOption(crOptions, i, (v) => (crOptions = v))} class="text-error hover:text-error/80">&times;</button>
								{/if}
							</div>
						{/each}
						{#if crOptions.length < 6}
							<button type="button" onclick={() => addOption(crOptions, (v) => (crOptions = v))} class="text-sm text-primary hover:underline">+ Add Option</button>
						{/if}
					</div>
				</div>
			{:else if selectedType === 'character_writing'}
				<div class="space-y-3 rounded-xl bg-bg-light-secondary p-3">
					<h3 class="font-medium text-text-light">{m["admin.questions.section.characterWriting"]()}</h3>
					<div>
						<label class="mb-1 block text-sm text-text-muted">Reading (Romaji)</label>
						<input type="text" bind:value={cwReading} class="input" placeholder="a" />
					</div>
					<div>
						<label class="mb-1 block text-sm text-text-muted">Character Type</label>
						<select bind:value={cwCharacterType} class="input">
							<option value="hiragana">Hiragana</option>
							<option value="katakana">Katakana</option>
							<option value="kanji">Kanji</option>
						</select>
					</div>
				</div>
			{:else if selectedType === 'script_transliteration'}
				<div class="space-y-3 rounded-xl bg-bg-light-secondary p-3">
					<h3 class="font-medium text-text-light">{m["admin.questions.section.scriptTransliteration"]()}</h3>
					<div>
						<label class="mb-1 block text-sm text-text-muted">Source Text</label>
						<input type="text" bind:value={stSourceText} class="input" placeholder="arigatou" />
					</div>
					<div class="grid grid-cols-2 gap-3">
						<div>
							<label class="mb-1 block text-sm text-text-muted">Source Script</label>
							<select bind:value={stSourceScript} class="input">
								<option value="romaji">Romaji</option>
								<option value="hiragana">Hiragana</option>
								<option value="katakana">Katakana</option>
								<option value="kanji">Kanji</option>
							</select>
						</div>
						<div>
							<label class="mb-1 block text-sm text-text-muted">Target Script</label>
							<select bind:value={stTargetScript} class="input">
								<option value="romaji">Romaji</option>
								<option value="hiragana">Hiragana</option>
								<option value="katakana">Katakana</option>
							</select>
						</div>
					</div>
				</div>
			{:else if selectedType === 'conjugation_cloze'}
				<div class="space-y-3 rounded-xl bg-bg-light-secondary p-3">
					<h3 class="font-medium text-text-light">{m["admin.questions.section.conjugationCloze"]()}</h3>
					<div>
						<label class="mb-1 block text-sm text-text-muted">Sentence (use _____ for blank)</label>
						<input type="text" bind:value={ccSentence} class="input" placeholder="Yesterday I _____ to the store." />
					</div>
					<div class="grid grid-cols-2 gap-3">
						<div>
							<label class="mb-1 block text-sm text-text-muted">Infinitive</label>
							<input type="text" bind:value={ccInfinitive} class="input" placeholder="to go" />
						</div>
						<div>
							<label class="mb-1 block text-sm text-text-muted">Target Tense</label>
							<input type="text" bind:value={ccTargetTense} class="input" placeholder="past simple" />
						</div>
					</div>
				</div>
			{:else if selectedType === 'particle_selection'}
				<div class="space-y-3 rounded-xl bg-bg-light-secondary p-3">
					<h3 class="font-medium text-text-light">{m["admin.questions.section.particleSelection"]()}</h3>
					<div>
						<label class="mb-1 block text-sm text-text-muted">Sentence</label>
						<input type="text" bind:value={psSentence} class="input" placeholder="watashi _____ gakusei desu" />
					</div>
					<div>
						<label class="mb-1 block text-sm text-text-muted">Particle Options</label>
						{#each psOptions as option, i}
							<div class="mb-2 flex gap-2">
								<input type="text" bind:value={psOptions[i]} class="input flex-1" placeholder="Option {i + 1}" />
								{#if psOptions.length > 2}
									<button type="button" onclick={() => removeOption(psOptions, i, (v) => (psOptions = v))} class="text-error hover:text-error/80">&times;</button>
								{/if}
							</div>
						{/each}
						{#if psOptions.length < 6}
							<button type="button" onclick={() => addOption(psOptions, (v) => (psOptions = v))} class="text-sm text-primary hover:underline">+ Add Option</button>
						{/if}
					</div>
				</div>
			{:else if selectedType === 'grammar_transformation'}
				<div class="space-y-3 rounded-xl bg-bg-light-secondary p-3">
					<h3 class="font-medium text-text-light">{m["admin.questions.section.grammarTransformation"]()}</h3>
					<div>
						<label class="mb-1 block text-sm text-text-muted">Source Sentence</label>
						<input type="text" bind:value={gtSourceSentence} class="input" placeholder="I eat sushi." />
					</div>
					<div>
						<label class="mb-1 block text-sm text-text-muted">Transformation Type</label>
						<input type="text" bind:value={gtTransformationType} class="input" placeholder="negative" />
					</div>
				</div>
			{:else if selectedType === 'kanji_composition'}
				<div class="space-y-3 rounded-xl bg-bg-light-secondary p-3">
					<h3 class="font-medium text-text-light">{m["admin.questions.section.kanjiComposition"]()}</h3>
					<div>
						<label class="mb-1 block text-sm text-text-muted">Target Kanji</label>
						<input type="text" bind:value={kcTargetKanji} class="input" placeholder="休" />
					</div>
					<div>
						<label class="mb-1 block text-sm text-text-muted">Radicals (correct components)</label>
						{#each kcRadicals as radical, i}
							<div class="mb-2 flex gap-2">
								<input type="text" bind:value={kcRadicals[i]} class="input flex-1" placeholder="Radical {i + 1}" />
								{#if kcRadicals.length > 1}
									<button type="button" onclick={() => removeOption(kcRadicals, i, (v) => (kcRadicals = v))} class="text-error hover:text-error/80">&times;</button>
								{/if}
							</div>
						{/each}
						{#if kcRadicals.length < 6}
							<button type="button" onclick={() => addOption(kcRadicals, (v) => (kcRadicals = v))} class="text-sm text-primary hover:underline">+ Add Radical</button>
						{/if}
					</div>
					<div>
						<label class="mb-1 block text-sm text-text-muted">Distractor Radicals</label>
						{#each kcDistractorRadicals as distractor, i}
							<div class="mb-2 flex gap-2">
								<input type="text" bind:value={kcDistractorRadicals[i]} class="input flex-1" placeholder="Distractor {i + 1}" />
								{#if kcDistractorRadicals.length > 1}
									<button type="button" onclick={() => removeOption(kcDistractorRadicals, i, (v) => (kcDistractorRadicals = v))} class="text-error hover:text-error/80">&times;</button>
								{/if}
							</div>
						{/each}
						{#if kcDistractorRadicals.length < 6}
							<button type="button" onclick={() => addOption(kcDistractorRadicals, (v) => (kcDistractorRadicals = v))} class="text-sm text-primary hover:underline">+ Add Distractor</button>
						{/if}
					</div>
				</div>
			{:else if selectedType === 'minimal_pair_discrimination'}
				<div class="space-y-3 rounded-xl bg-bg-light-secondary p-3">
					<h3 class="font-medium text-text-light">{m["admin.questions.section.minimalPair"]()}</h3>
					<div>
						<label class="mb-1 block text-sm text-text-muted">Audio Text</label>
						<input type="text" bind:value={mpAudioText} class="input" placeholder="きって" />
					</div>
					<div>
						<label class="mb-1 block text-sm text-text-muted">Options</label>
						{#each mpOptions as option, i}
							<div class="mb-2 flex items-center gap-2">
								<input type="text" bind:value={mpOptions[i].text} class="input flex-1" placeholder="Option {i + 1}" />
								<label class="flex items-center gap-1 text-sm text-text-muted">
									<input type="checkbox" bind:checked={mpOptions[i].isCorrect} class="h-4 w-4" />
									Correct
								</label>
								{#if mpOptions.length > 2}
									<button type="button" onclick={() => { mpOptions = mpOptions.filter((_, idx) => idx !== i); }} class="text-error hover:text-error/80">&times;</button>
								{/if}
							</div>
						{/each}
						{#if mpOptions.length < 6}
							<button type="button" onclick={() => { mpOptions = [...mpOptions, { text: '', isCorrect: false }]; }} class="text-sm text-primary hover:underline">+ Add Option</button>
						{/if}
					</div>
				</div>
			{:else if selectedType === 'dictation'}
				<div class="space-y-3 rounded-xl bg-bg-light-secondary p-3">
					<h3 class="font-medium text-text-light">{m["admin.questions.section.dictation"]()}</h3>
					<div>
						<label class="mb-1 block text-sm text-text-muted">Text to Hear</label>
						<input type="text" bind:value={diTextToHear} class="input" placeholder="おはようございます" />
					</div>
					<div>
						<label class="mb-1 block text-sm text-text-muted">Speed</label>
						<select bind:value={diSpeed} class="input">
							<option value="normal">Normal</option>
							<option value="slow">Slow</option>
						</select>
					</div>
				</div>
			{:else if selectedType === 'guided_composition'}
				<div class="space-y-3 rounded-xl bg-bg-light-secondary p-3">
					<h3 class="font-medium text-text-light">{m["admin.questions.section.guidedComposition"]()}</h3>
					<div>
						<label class="mb-1 block text-sm text-text-muted">Vocabulary Hints</label>
						{#each gcVocabularyHints as hint, i}
							<div class="mb-2 flex gap-2">
								<input type="text" bind:value={gcVocabularyHints[i]} class="input flex-1" placeholder="Hint {i + 1}" />
								{#if gcVocabularyHints.length > 1}
									<button type="button" onclick={() => removeOption(gcVocabularyHints, i, (v) => (gcVocabularyHints = v))} class="text-error hover:text-error/80">&times;</button>
								{/if}
							</div>
						{/each}
						{#if gcVocabularyHints.length < 10}
							<button type="button" onclick={() => addOption(gcVocabularyHints, (v) => (gcVocabularyHints = v))} class="text-sm text-primary hover:underline">+ Add Hint</button>
						{/if}
					</div>
				</div>
			{/if}

			<!-- Correct Answer -->
			<div>
				<label for="correctAnswer" class="mb-1 block text-sm font-medium text-text-light">
					Correct Answer
					{#if selectedType === 'matching'}
						<span class="font-normal text-text-muted">(auto-set to "all_matched")</span>
					{:else if selectedType === 'translation' && transDirection === 'target_to_native'}
						<span class="font-normal text-text-muted"
							>(use | to separate multiple valid answers: "Hello|Hallo")</span
						>
					{/if}
				</label>
				{#if selectedType === 'matching'}
					<input type="text" class="input bg-bg-light-secondary" value="all_matched" readonly />
				{:else}
					<input
						type="text"
						bind:value={correctAnswer}
						class="input"
						placeholder="The correct answer"
					/>
				{/if}
			</div>

			<!-- Form Actions -->
			<div class="flex justify-end gap-3 border-t border-border-light pt-4">
				<button type="button" onclick={onClose} class="btn btn-ghost btn-md"> Cancel </button>
				<button type="submit" disabled={isSubmitting} class="btn btn-success btn-md">
					{isSubmitting ? 'Saving...' : mode === 'add' ? 'Add Question' : 'Save Changes'}
				</button>
			</div>
		</form>
	</div>
</div>
