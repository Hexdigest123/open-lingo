# UI COMPONENTS

Svelte 5 components using runes syntax. Tailwind CSS v4 for styling.

## STRUCTURE

```
components/
├── lessons/           # One component per question type (8 total)
│   ├── MultipleChoiceQuestion.svelte
│   ├── FillBlankQuestion.svelte
│   ├── TranslationQuestion.svelte
│   ├── MatchingQuestion.svelte
│   ├── WordOrderQuestion.svelte
│   ├── SpeakingQuestion.svelte
│   ├── ListeningQuestion.svelte
│   └── AiExplanation.svelte
├── chat/              # AI chat interface components
│   ├── ChatMessage.svelte
│   ├── ChatInput.svelte
│   ├── VoiceRecorder.svelte
│   └── ModeToggle.svelte
├── admin/
│   └── questions/     # Admin question editing modal
├── ui/                # Shared UI primitives
└── ConfirmModal.svelte
```

## QUESTION COMPONENTS

Each question type component in `lessons/` follows a consistent contract:

- Receives question data via props (content from `questions.content` JSONB column)
- Emits answer via callback prop or form action
- Handles its own UI state (selected option, input text, drag state, etc.)
- `AiExplanation.svelte` is standalone - fetches explanation from `/api/ai/explain`

Question types map to `question_type` enum: `fill_blank`, `multiple_choice`, `translation`, `matching`, `speaking`, `listening`, `word_order`

The parent route (`src/routes/(protected)/lessons/[lessonId]/+page.svelte`) renders the correct component based on `question.type`.

## CONVENTIONS

- **Svelte 5 runes** - Use `$state()`, `$derived()`, `$effect()`. No legacy `$:` reactive declarations
- **Props** - Use `let { prop1, prop2 }: Props = $props()` pattern
- **Events** - Callback props, not `createEventDispatcher`
- **Styling** - Tailwind utility classes inline. Global theme in `src/routes/layout.css`
- **i18n** - Import `* as m` from `$lib/paraglide/messages.js` and use `m["key"]()` for all user-facing text

## ANTI-PATTERNS

- Do NOT use Svelte 4 store syntax (`$storeName`) - this project uses Svelte 5 runes exclusively
- Do NOT import server modules (`$lib/server/*`) from components
- Do NOT hardcode English strings - use `m["key"]()` from Paraglide for all UI text
- `ListeningQuestion.svelte` (301 lines) is the most complex component - audio playback + answer input + TTS integration
