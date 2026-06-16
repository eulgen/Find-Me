<!--
  @file Hero.vue
  @description Section d'accueil principale de findMe Cameroun.
  Présente la proposition de valeur majeure et dirige l'utilisateur
  soit vers la démonstration interactive soit vers la création d'adresse.
-->

<script setup lang="ts">
	import { ref } from "vue";
	import { ArrowRight, Video, CheckCircle2 } from "lucide-vue-next";
	import ButtonUI from "./ButtonUI.vue";

	const emit = defineEmits<{
		(e: "scroll-to-step", stepId: string): void;
		(e: "create-address-click"): void;
	}>();

	const isPrimaryLoading = ref(false);
	const isSecondaryLoading = ref(false);

	const handlePrimaryClick = () => {
		isPrimaryLoading.value = true;
		setTimeout(() => {
			isPrimaryLoading.value = false;
			// emit("create-address-click");
			navigateTo("/creer-mon-adresse");
		}, 700);
	};

	const handleSecondaryClick = () => {
		isSecondaryLoading.value = true;
		setTimeout(() => {
			isSecondaryLoading.value = false;
			emit("scroll-to-step", "comment-ca-marche");
		}, 1000);
	};
</script>

<template>
	<section
		class="relative px-6 md:px-12 py-16 md:py-24 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-14 bg-white"
		id="app-hero"
	>
		<!-- Partie texte & Actions Majeures -->
		<div
			class="flex-1 space-y-8 text-center lg:text-left"
			id="hero-left-contents"
		>
			<!-- Indicateur de mission locale -->
			<div
				class="inline-flex items-center space-x-2 bg-[#2E7D32]/10 border-2 border-[#2E7D32]/20 px-3.5 py-1.5 rounded-full"
				id="cameroon-flag-header"
			>
				<span class="w-2.5 h-2.5 bg-red-600 rounded-full animate-ping" />
				<span
					class="text-[10px] md:text-xs font-black uppercase tracking-wider text-[#2E7D32]"
				>
					L’initiative civique d’adressage camerounais
				</span>
			</div>

			<!-- Titre principal -->
			<h1
				class="text-4xl md:text-6xl font-black text-[#1A237E] leading-[1.1] tracking-tight"
				id="hero-display-title"
			>
				Créez une
				<span class="text-[#2E7D32] underline decoration-4 underline-offset-4"
					>adresse précise</span
				>, partageable et officielle.
			</h1>

			<!-- Description contextuelle -->
			<p
				class="text-base md:text-lg text-[#1A237E]/80 max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed"
				id="hero-subtitle"
			>
				Fini le flou des "à l'arrière de la boutique, deux portes jaunes".
				Générez un positionnement précis, partagez un QR code et recevez vos
				livraisons facilement à Douala, Yaoundé et dans tout le Cameroun.
			</p>

			<!-- Puces d'atouts certifiés -->
			<div
				class="flex flex-wrap items-center justify-center lg:justify-start gap-4 md:gap-5 text-xs text-[#1A237E]/90 font-bold"
				id="hero-value-markers"
			>
				<div
					class="flex items-center space-x-2 bg-white px-3.5 py-2 rounded-xl border border-[#1A237E]/10 shadow-sm"
					id="marker-norm"
				>
					<CheckCircle2 class="w-4 h-4 text-[#2E7D32]" />
					<span>Norme Municipale</span>
				</div>
				<div
					class="flex items-center space-x-2 bg-white px-3.5 py-2 rounded-xl border border-[#1A237E]/10 shadow-sm"
					id="marker-gps"
				>
					<CheckCircle2 class="w-4 h-4 text-[#2E7D32]" />
					<span>Géolocalisation Satellite</span>
				</div>
				<div
					class="flex items-center space-x-2 bg-white px-3.5 py-2 rounded-xl border border-[#1A237E]/10 shadow-sm"
					id="marker-qr"
				>
					<CheckCircle2 class="w-4 h-4 text-[#2E7D32]" />
					<span>QR Code Standard</span>
				</div>
			</div>

			<!-- Boutons de redirection CTA -->
			<div
				class="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2"
				id="hero-cta-buttons"
			>
				<ButtonUI
					variant="primary"
					:loading="isPrimaryLoading"
					:disabled="isPrimaryLoading || isSecondaryLoading"
					:icon="ArrowRight"
					@click="handlePrimaryClick"
					class="w-full sm:w-auto"
					id="hero-primary-cta"
				>
					Créer mon adresse
				</ButtonUI>

				<ButtonUI
					variant="secondary"
					:loading="isSecondaryLoading"
					:disabled="isSecondaryLoading || isPrimaryLoading"
					:icon="Video"
					@click="handleSecondaryClick"
					class="w-full sm:w-auto"
					id="hero-secondary-cta"
				>
					Faire un test
				</ButtonUI>
			</div>
		</div>

		<!-- Graphisme d'illustration de droite -->
		<div
			class="flex-1 w-full max-w-2xl lg:max-w-none flex justify-center items-center relative"
			id="hero-right-contents"
		>
			<div
				class="relative w-full max-w-lg lg:max-w-2xl mx-auto"
				id="hero-illustration-wrapper"
			>
				<div
					class="absolute -inset-4 bg-gradient-to-tr from-[#2E7D32]/10 to-[#1A237E]/10 rounded-[40px] blur-3xl opacity-70 pointer-events-none"
				/>

				<!-- Étiquettes de points géodésiques d'échantillon -->
				<div
					class="absolute -top-4 -left-4 bg-white/95 backdrop-blur-sm border border-[#1A237E]/15 px-4 py-2 rounded-2xl shadow-lg z-10 flex items-center space-x-2 transform -rotate-2"
					id="hero-badge-1"
				>
					<div class="w-2.5 h-2.5 rounded-full bg-[#2E7D32] animate-pulse" />
					<span
						class="font-mono text-[10px] font-black text-[#1A237E] tracking-wider"
						>DOUALA: DEIDO 4A</span
					>
				</div>

				<div
					class="absolute -bottom-4 -right-4 bg-white/95 backdrop-blur-sm border border-[#1A237E]/15 px-4 py-2 rounded-2xl shadow-lg z-10 flex items-center space-x-2 transform rotate-2"
					id="hero-badge-2"
				>
					<div class="w-2.5 h-2.5 rounded-full bg-[#4CAF50] animate-pulse" />
					<span
						class="font-mono text-[10px] font-black text-[#1A237E] tracking-wider"
						>YAOUNDÉ: BASTOS 28B</span
					>
				</div>

				<NuxtImg
					src="http://localhost:3000/assets/images/creer_une_adresse.png"
					alt="findMe créer une adresse"
					class="w-full h-auto object-cover transition-transform duration-500 hover:scale-[1.01]"
					referrerpolicy="no-referrer"
					id="hero-primary-illustration"
				/>
			</div>
		</div>
	</section>
</template>
