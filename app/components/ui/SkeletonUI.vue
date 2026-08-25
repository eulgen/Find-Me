<!--
  @file app/components/ui/SkeletonUI.vue
  @description Composant réutilisable de squelette de chargement (Skeleton Screen) — animation d'impulsion fluide et élégante pour tous les états d'attente réseau.
-->

<script setup lang="ts">
interface Props {
	width?: string;
	height?: string;
	rounded?: string;
	class?: string;
}

withDefaults(defineProps<Props>(), {
	width: "w-full",
	height: "h-4",
	rounded: "rounded-xl",
	class: "",
});
</script>

<template>
	<div
		class="animate-pulse bg-slate-200/80 dark:bg-slate-800/80 shrink-0"
		:class="[width, height, rounded, $props.class]"
		aria-hidden="true"
	></div>
</template>
