<script lang="ts">
	import { onMount } from 'svelte';
	import { t } from '$lib/i18n/index.svelte';
	import {
		getActiveCelebration,
		dismissCelebration,
		type Celebration
	} from '$lib/stores/celebrations.svelte';
	import { Trophy, Sparkles } from 'lucide-svelte';

	const celebration = $derived(getActiveCelebration());
	let phase = $state<'enter' | 'visible' | 'exit'>('enter');
	let dismissTimer: ReturnType<typeof setTimeout> | null = null;
	let currentId = $state<string | null>(null);

	$effect(() => {
		if (celebration && celebration.id !== currentId) {
			currentId = celebration.id;
			phase = 'enter';

			requestAnimationFrame(() => {
				phase = 'visible';
			});

			if (dismissTimer) clearTimeout(dismissTimer);
			dismissTimer = setTimeout(() => {
				handleDismiss();
			}, 4000);
		}

		if (!celebration) {
			currentId = null;
			phase = 'enter';
		}
	});

	function handleDismiss() {
		if (dismissTimer) {
			clearTimeout(dismissTimer);
			dismissTimer = null;
		}
		phase = 'exit';
		setTimeout(() => {
			dismissCelebration();
		}, 400);
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
			handleDismiss();
		}
	}

	const CONFETTI_COUNT = 50;
	const CONFETTI_COLORS = [
		'#58cc02', '#ffc800', '#ff9600', '#1cb0f6', '#ce82ff',
		'#ff4b4b', '#89e219', '#49c0f8', '#ffd633', '#dda0ff'
	];

	function randomBetween(min: number, max: number): number {
		return Math.random() * (max - min) + min;
	}

	type ConfettiPiece = {
		left: string;
		delay: string;
		duration: string;
		color: string;
		size: string;
		shape: 'circle' | 'rect' | 'star';
		rotation: string;
		drift: string;
	};

	function generateConfetti(): ConfettiPiece[] {
		return Array.from({ length: CONFETTI_COUNT }, () => ({
			left: `${randomBetween(0, 100)}%`,
			delay: `${randomBetween(0, 0.6)}s`,
			duration: `${randomBetween(1.2, 2.8)}s`,
			color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
			size: `${randomBetween(6, 14)}px`,
			shape: (['circle', 'rect', 'star'] as const)[Math.floor(Math.random() * 3)],
			rotation: `${randomBetween(0, 360)}deg`,
			drift: `${randomBetween(-60, 60)}px`
		}));
	}

	const confettiPieces = generateConfetti();
</script>

{#if celebration}
	<div
		class="celebration-overlay"
		class:celebration-enter={phase === 'enter'}
		class:celebration-visible={phase === 'visible'}
		class:celebration-exit={phase === 'exit'}
		role="dialog"
		aria-modal="true"
		aria-label={celebration.title}
		tabindex="-1"
		onclick={handleDismiss}
		onkeydown={handleKeydown}
	>
		<!-- Confetti Layer -->
		<div class="confetti-container" aria-hidden="true">
			{#each confettiPieces as piece}
				<div
					class="confetti-piece"
					class:confetti-circle={piece.shape === 'circle'}
					class:confetti-rect={piece.shape === 'rect'}
					class:confetti-star={piece.shape === 'star'}
					style="
						left: {piece.left};
						animation-delay: {piece.delay};
						animation-duration: {piece.duration};
						--confetti-color: {piece.color};
						--confetti-size: {piece.size};
						--confetti-rotation: {piece.rotation};
						--confetti-drift: {piece.drift};
					"
				></div>
			{/each}
		</div>

		<!-- Center Card -->
		<div
			class="celebration-card"
			onclick={(e) => e.stopPropagation()}
			onkeydown={handleKeydown}
			role="presentation"
		>
			<!-- Icon -->
			<div class="celebration-icon">
				{#if celebration.type === 'achievement'}
					<div class="celebration-icon-ring celebration-icon-ring-achievement">
						<Trophy size={48} class="text-yellow" />
					</div>
				{:else}
					<div class="celebration-icon-ring celebration-icon-ring-streak">
						<Sparkles size={48} class="text-yellow" />
					</div>
				{/if}
			</div>

			<!-- Text -->
			<h2 class="celebration-title">
				{#if celebration.type === 'achievement'}
					{t('celebration.achievementUnlocked')}
				{:else}
					{celebration.title}
				{/if}
			</h2>

			{#if celebration.type === 'achievement'}
				<p class="celebration-achievement-name">{celebration.title}</p>
			{/if}

			{#if celebration.message}
				<p class="celebration-message">{celebration.message}</p>
			{/if}

			<!-- Dismiss Button -->
			<button class="btn btn-success btn-lg mt-6 w-full" onclick={handleDismiss}>
				{t('celebration.awesome')}
			</button>
		</div>
	</div>
{/if}

<style>
	.celebration-overlay {
		position: fixed;
		inset: 0;
		z-index: 100;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1rem;
		background: rgba(0, 0, 0, 0.7);
		backdrop-filter: blur(4px);
		transition: opacity 400ms ease;
	}

	.celebration-enter {
		opacity: 0;
	}

	.celebration-visible {
		opacity: 1;
	}

	.celebration-exit {
		opacity: 0;
	}

	/* Confetti */
	.confetti-container {
		position: absolute;
		inset: 0;
		overflow: hidden;
		pointer-events: none;
	}

	.confetti-piece {
		position: absolute;
		top: -20px;
		width: var(--confetti-size);
		height: var(--confetti-size);
		animation: confetti-fall var(--duration, 2s) ease-out forwards;
		animation-delay: var(--delay, 0s);
		opacity: 0;
	}

	.confetti-circle {
		border-radius: 50%;
		background: var(--confetti-color);
	}

	.confetti-rect {
		border-radius: 2px;
		background: var(--confetti-color);
		width: var(--confetti-size);
		height: calc(var(--confetti-size) * 0.6);
	}

	.confetti-star {
		background: var(--confetti-color);
		clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
	}

	@keyframes confetti-fall {
		0% {
			opacity: 1;
			transform: translateY(0) translateX(0) rotate(0deg) scale(0);
		}
		10% {
			opacity: 1;
			transform: translateY(10vh) translateX(calc(var(--confetti-drift) * 0.3)) rotate(calc(var(--confetti-rotation) * 0.3)) scale(1);
		}
		100% {
			opacity: 0;
			transform: translateY(100vh) translateX(var(--confetti-drift)) rotate(var(--confetti-rotation)) scale(0.5);
		}
	}

	/* Card */
	.celebration-card {
		position: relative;
		z-index: 1;
		width: 100%;
		max-width: 360px;
		padding: 2rem;
		border-radius: 24px;
		background: white;
		text-align: center;
		box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
		animation: celebration-card-enter 600ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
	}

	.celebration-exit .celebration-card {
		animation: celebration-card-exit 300ms ease-in forwards;
	}

	@keyframes celebration-card-enter {
		0% {
			opacity: 0;
			transform: scale(0.3) translateY(40px);
		}
		100% {
			opacity: 1;
			transform: scale(1) translateY(0);
		}
	}

	@keyframes celebration-card-exit {
		0% {
			opacity: 1;
			transform: scale(1);
		}
		100% {
			opacity: 0;
			transform: scale(0.8) translateY(20px);
		}
	}

	/* Icon */
	.celebration-icon {
		display: flex;
		justify-content: center;
		margin-bottom: 1rem;
	}

	.celebration-icon-ring {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 96px;
		height: 96px;
		border-radius: 50%;
		animation: celebration-icon-pulse 1.5s ease-in-out infinite;
	}

	.celebration-icon-ring-achievement {
		background: linear-gradient(135deg, rgba(255, 200, 0, 0.15), rgba(255, 150, 0, 0.15));
		box-shadow: 0 0 0 0 rgba(255, 200, 0, 0.4);
	}

	.celebration-icon-ring-streak {
		background: linear-gradient(135deg, rgba(88, 204, 2, 0.15), rgba(28, 176, 246, 0.15));
		box-shadow: 0 0 0 0 rgba(88, 204, 2, 0.4);
	}

	@keyframes celebration-icon-pulse {
		0%, 100% {
			box-shadow: 0 0 0 0 rgba(255, 200, 0, 0.4);
			transform: scale(1);
		}
		50% {
			box-shadow: 0 0 0 16px rgba(255, 200, 0, 0);
			transform: scale(1.05);
		}
	}

	/* Text */
	.celebration-title {
		font-size: 1.5rem;
		font-weight: 800;
		color: #3c3c3c;
		line-height: 1.3;
	}

	.celebration-achievement-name {
		margin-top: 0.5rem;
		font-size: 1.125rem;
		font-weight: 600;
		color: #e5b400;
	}

	.celebration-message {
		margin-top: 0.5rem;
		font-size: 0.875rem;
		color: #6b7280;
	}
</style>
