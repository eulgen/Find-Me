<!--
  @file GoogleButtonUI.vue
  @description Composant de bouton Google Sign-In avec état de chargement.
-->

<script setup lang="ts">
	import { Loader2 } from "lucide-vue-next";

	const props = withDefaults(
		defineProps<{
			variant?: "primary" | "secondary" | "outline" | "danger";
			loading?: boolean;
			disabled?: boolean;
			type?: "button" | "submit" | "reset";
		}>(),
		{
			variant: "primary",
			loading: false,
			disabled: false,
			type: "button",
		},
	);

	const emit = defineEmits<{
		(e: "success"): void;
		(e: "error"): void;
	}>();
</script>

<template>
	<div class="relative">
		<GoogleSignInButton
			@success="emit('success')"
			@error="emit('error')"
			:type="type"
			:disabled="disabled || loading"
			class="relative inline-flex items-center justify-center font-extrabold tracking-wide rounded-full px-5 py-2.5 transition-all duration-200 select-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-98 disabled:opacity-50 disabled:pointer-events-none gap-2 font-mono text-xs uppercase"
			:class="[
				// Variant primary: Green
				variant === 'primary'
					? 'bg-[#2E7D32] hover:bg-[#2E7D32]/90 text-white border-2 border-[#2E7D32] shadow-[4px_4px_0px_0px_#1A237E] active:shadow-none active:translate-y-0.5 focus:ring-[#2E7D32]'
					: '',
				// Variant secondary: Blue
				variant === 'secondary'
					? 'bg-[#1A237E] hover:bg-[#1A237E]/90 text-white border-2 border-[#1A237E] shadow-[4px_4px_0px_0px_#2E7D32] active:shadow-none active:translate-y-0.5 focus:ring-[#1A237E]'
					: '',
				// Variant outline
				variant === 'outline'
					? 'bg-transparent hover:bg-slate-50 dark:hover:bg-slate-900 border-2 border-[#1A237E]/20 text-[#1A237E] dark:text-[#E2E8F0] shadow-sm focus:ring-[#1A237E]'
					: '',
				// Variant danger
				variant === 'danger'
					? 'bg-rose-600 hover:bg-rose-700 text-white border-2 border-rose-600 shadow-[4px_4px_0px_0px_#1A237E] active:shadow-none active:translate-y-0.5 focus:ring-rose-600'
					: '',
			]"
		>
			<slot />
		</GoogleSignInButton>

		<!-- Overlay de chargement -->
		<transition name="fade-overlay">
			<div
				v-if="loading"
				class="absolute inset-0 flex items-center justify-center rounded-full pointer-events-none"
				:class="[
					variant === 'primary' ? 'bg-[#2E7D32]/80' : '',
					variant === 'secondary' ? 'bg-[#1A237E]/80' : '',
					variant === 'outline' ? 'bg-white/80 dark:bg-slate-900/80' : '',
					variant === 'danger' ? 'bg-rose-600/80' : '',
				]"
			>
				<Loader2 class="w-5 h-5 animate-spin text-white" />
			</div>
		</transition>
	</div>
</template>

<style scoped>
	.fade-overlay-enter-active,
	.fade-overlay-leave-active {
		transition: opacity 0.2s ease;
	}
	.fade-overlay-enter-from,
	.fade-overlay-leave-to {
		opacity: 0;
	}
</style>
