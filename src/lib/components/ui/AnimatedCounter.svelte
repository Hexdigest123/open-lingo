<script lang="ts">
	import { untrack } from 'svelte';

	type Props = {
		value: number;
		duration?: number;
		class?: string;
		format?: (n: number) => string;
	};

	let { value, duration = 600, class: className = '', format }: Props = $props();

	let animatedValue = $state(value);
	let animationFrameId: number | null = null;

	function easeOutCubic(t: number): number {
		return 1 - (1 - t) ** 3;
	}

	function formatValue(inputValue: number): string {
		const rounded = Math.round(inputValue);
		if (format) {
			return format(rounded);
		}
		return String(rounded);
	}

	$effect(() => {
		const end = value;
		const start = untrack(() => animatedValue);
		const durationMs = duration <= 0 ? 0 : duration;

		if (start === end) {
			animatedValue = end;
			return;
		}

		if (durationMs === 0) {
			animatedValue = end;
			return;
		}

		if (animationFrameId !== null) {
			cancelAnimationFrame(animationFrameId);
			animationFrameId = null;
		}

		const startedAt = performance.now();

		function step(timestamp: number): void {
			const elapsed = timestamp - startedAt;
			const progress = Math.min(1, elapsed / durationMs);
			const eased = easeOutCubic(progress);
			animatedValue = start + (end - start) * eased;

			if (progress < 1) {
				animationFrameId = requestAnimationFrame(step);
			} else {
				animatedValue = end;
				animationFrameId = null;
			}
		}

		animationFrameId = requestAnimationFrame(step);

		return () => {
			if (animationFrameId !== null) {
				cancelAnimationFrame(animationFrameId);
				animationFrameId = null;
			}
		};
	});
</script>

<span class={className}>{formatValue(animatedValue)}</span>
