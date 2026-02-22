# UI COMPONENTS

Svelte 5 components using runes syntax. Tailwind CSS v4 for styling.

## STRUCTURE

```
components/
├── lessons/           # Question type components + centralized renderer
│   ├── QuestionRenderer.svelte        # Centralized switch for all 17 question types
│   ├── MultipleChoiceQuestion.svelte
│   ├── FillBlankQuestion.svelte
│   ├── TranslationQuestion.svelte
│   ├── MatchingQuestion.svelte
│   ├── WordOrderQuestion.svelte
│   ├── SpeakingQuestion.svelte
│   ├── ListeningQuestion.svelte
│   ├── CharacterRecognitionQuestion.svelte
│   ├── CharacterWritingQuestion.svelte
│   ├── ScriptTransliterationQuestion.svelte
│   └── AiExplanation.svelte
├── learning/
│   └── question-types/  # Additional question type components (skill tree)
│       ├── CharacterRecognitionQuestion.svelte
│       ├── CharacterWritingQuestion.svelte
│       ├── ConjugationClozeQuestion.svelte
│       ├── GrammarTransformationQuestion.svelte
│       ├── KanjiCompositionQuestion.svelte
│       ├── MinimalPairQuestion.svelte
│       └── ParticleSelectionQuestion.svelte
├── chat/              # AI chat interface components
│   ├── ChatMessage.svelte
│   ├── ChatInput.svelte
│   ├── VoiceRecorder.svelte
│   └── ModeToggle.svelte
├── admin/
│   └── questions/     # Admin question editing modal (QuestionModal.svelte)
├── ui/                # Shared UI primitives
└── ConfirmModal.svelte
```

## QUESTION TYPES

The `question_type` DB enum defines 17 types, split into two groups:

### Legacy types (7) — used in `legacy_quiz` mode lessons:

`fill_blank`, `multiple_choice`, `translation`, `matching`, `speaking`, `listening`, `word_order`

### Skill tree types (10) — used in `guided_skill` mode lessons:

`character_recognition`, `character_writing`, `script_transliteration`, `conjugation_cloze`, `particle_selection`, `grammar_transformation`, `kanji_composition`, `minimal_pair_discrimination`, `dictation`, `guided_composition`

### QuestionRenderer (centralized)

`QuestionRenderer.svelte` is the single source of truth for rendering any question type. All consumer pages import this component instead of individual question components. It handles:

- Mapping `question.type` to the correct component
- Graceful fallback for unsupported types (shows type name + optional skip)
- Props: `question`, `onAnswer`, `disabled`

**Consumers:** lessons page, review page, placement page, DrillBlock, ReviewBlock

### Component contract

Each question type component in `lessons/` and `learning/question-types/` follows a consistent contract:

- Receives question data via props (content from `questions.content` JSONB column)
- Emits answer via callback prop
- Handles its own UI state (selected option, input text, drag state, etc.)
- `AiExplanation.svelte` is standalone — fetches explanation from `/api/ai/explain`

### Content validation

Server-side content validation for all 17 types lives in `$lib/server/validation/question-validation.ts`. Each type has a specific content shape (interfaces defined there).

## CONVENTIONS

- **Svelte 5 runes** — Use `$state()`, `$derived()`, `$effect()`. No legacy `$:` reactive declarations
- **Props** — Use `let { prop1, prop2 }: Props = $props()` pattern
- **Events** — Callback props, not `createEventDispatcher`
- **Styling** — Tailwind utility classes inline. Global theme in `src/routes/layout.css`
- **i18n** — Import `* as m` from `$lib/paraglide/messages.js` and use `m["key"]()` for all user-facing text

## ANTI-PATTERNS

- Do NOT use Svelte 4 store syntax (`$storeName`) — this project uses Svelte 5 runes exclusively
- Do NOT import server modules (`$lib/server/*`) from components
- Do NOT hardcode English strings — use `m["key"]()` from Paraglide for all UI text
- Do NOT add new question type rendering in consumer pages — add to `QuestionRenderer.svelte` instead
- `ListeningQuestion.svelte` (301 lines) is the most complex component — audio playback + answer input + TTS integration
