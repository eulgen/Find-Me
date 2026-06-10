<!--
  @file HowItWorks.vue
  @description Section de présentation interactive des 3 étapes de findMe Cameroun.
  Présente d'un côté la chronologie d'adressage et de l'autre l'illustration correspondante d'Afrique et du Cameroun.
-->

<script setup lang="ts">
	import { ref, computed } from "vue";
	import steps from "~/data/steps.json";
	import { ClipboardList, Send, Map, type LucideIcon } from "lucide-vue-next";
	import { type AddressData } from "../../types/types";

	const props = defineProps<{
		address: AddressData;
	}>();

	const emit = defineEmits<{
		(e: "update:address", value: AddressData): void;
	}>();

	const stepIcons = [ClipboardList, Send, Map] as LucideIcon[];

	// Étape d'illustration active
	const activeStep = ref<number>(0);

	const activeStepData = computed(() => {
		return (steps[activeStep.value] || steps[0]) as (typeof steps)[0];
	});
</script>

<template>
	<section
		class="py-24 px-6 bg-[#F5F2FB] dark:bg-[#11142A] border-t-4 border-b-4 border-[#1A237E] dark:border-[#2E7D32]"
		id="comment-ca-marche"
	>
		<div class="max-w-7xl mx-auto" id="comment-how-grid-container">
			<!-- En-tête -->
			<div class="text-center max-w-2xl mx-auto mb-16" id="wizard-heading-meta">
				<span
					class="bg-[#2E7D32]/10 text-[#2E7D32] text-xs font-extrabold uppercase tracking-widest px-4 py-1.5 rounded-full border border-[#2E7D32]/10 inline-block mb-3.5"
				>
					Accompagnement Citoyen
				</span>
				<h2
					class="text-3xl md:text-5xl font-black text-[#1A237E] dark:text-white tracking-tight"
				>
					Créez votre adresse en 3 étapes
				</h2>
				<p
					class="mt-4 text-sm md:text-base text-[#1A237E]/75 dark:text-slate-300 max-w-lg mx-auto font-medium"
				>
					Une procédure fluide et assistée de bout en bout pour géolocaliser
					votre barrière et obtenir votre certificat findMe.
				</p>
			</div>

			<!-- Rubrique d'interaction double volet -->
			<div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
				<!-- VOLET GAUCHE / LES 3 ÉTAPES INTERACTIVES -->
				<div class="lg:col-span-6 space-y-5" id="steps-selector-side">
					<div
						v-for="step in steps"
						:key="step.id"
						@click="activeStep = step.id"
						class="bg-white dark:bg-[#191D3C] border-3 rounded-[24px] p-6 transition-all duration-300 cursor-pointer text-left block"
						:class="
							activeStep === step.id
								? 'border-[#2E7D32] dark:border-[#2E7D32] shadow-[6px_6px_0px_0px_#1A237E] dark:shadow-[6px_6px_0px_0px_#2E7D32] translate-x-1.5'
								: 'border-[#1A237E]/10 dark:border-slate-800 hover:border-[#1A237E]/40 hover:-translate-y-0.5'
						"
						:id="`step-option-card-${step.id}`"
					>
						<div class="flex items-start space-x-4">
							<!-- Indicateur d'étape ou Icône -->
							<div
								class="w-12 h-12 rounded-2xl border-2 flex items-center justify-center shrink-0 transition-colors"
								:class="
									activeStep === step.id
										? 'bg-[#2E7D32] text-white border-[#2E7D32]'
										: 'bg-[#F5F2FB] dark:bg-slate-800 text-[#1A237E] dark:text-slate-200 border-[#1A237E]/10'
								"
							>
								<component :is="stepIcons[step.id]" class="w-5.5 h-5.5" />
							</div>

							<!-- Bloc Texte -->
							<div class="space-y-1">
								<div class="flex items-center space-x-2">
									<span
										class="text-[9px] font-black uppercase tracking-widest text-[#2E7D32] dark:text-emerald-400"
									>
										{{ step.badgeFr }}
									</span>
									<span
										v-if="activeStep === step.id"
										class="w-1.5 h-1.5 rounded-full bg-[#2E7D32] animate-ping"
									/>
								</div>

								<h3
									class="text-base md:text-lg font-black text-[#1A237E] dark:text-white leading-tight"
								>
									{{ step.titleFr }}
								</h3>

								<p
									class="text-xs md:text-sm text-[#1A237E]/75 dark:text-slate-300 leading-relaxed font-normal pt-1"
								>
									{{ step.descFr }}
								</p>
							</div>
						</div>
					</div>
				</div>

				<!-- VOLET DROIT / ILLUSTRATIONS CORRESPONDANTES DU CAMEROUN -->
				<div
					class="lg:col-span-6 flex flex-col justify-center relative"
					id="steps-illustrations-viewpanel"
				>
					<transition name="fade" mode="out-in">
						<NuxtImg
							:key="activeStep"
							:src="activeStepData.img"
							:alt="activeStepData.tagFr"
							class="w-full h-full object-cover transition-transform duration-500 hover:scale-[1.02]"
							referrerpolicy="no-referrer"
							:id="`step-active-img-${activeStep}`"
						/>
					</transition>
				</div>
			</div>
		</div>
	</section>
</template>

<style scoped>
	.fade-enter-active,
	.fade-leave-active {
		transition:
			opacity 0.25s ease,
			transform 0.25s ease;
	}
	.fade-enter-from {
		opacity: 0;
		transform: scale(0.98);
	}
	.fade-leave-to {
		opacity: 0;
		transform: scale(1.02);
	}
</style>
