<!--
  @file PlaygroundStepCertificate.vue
  @description Ã‰tape 3 du simulateur: Visualisation et impression/partage de la plaque rÃ©glementaire.
-->

<script setup lang="ts">
	import { ref } from "vue";
	import { type AddressData } from "../../types/types";
	import { Printer, Share2, Check, Smartphone, Monitor } from "lucide-vue-next";

	const props = defineProps<{
		address: AddressData;
	}>();

	const emit = defineEmits<{
		(e: "print"): void;
		(e: "share"): void;
	}>();

	const devicePreview = ref<"mobile" | "desktop">("mobile");
</script>

<template>
	<div class="space-y-6" id="playground-step2-certificate">
		<!-- Basculeur d'affichage d'appareil -->
		<div
			class="flex items-center justify-center space-x-2 bg-[#155dfc]/5 p-1 rounded-xl w-fit mx-auto"
			id="playground-device-adjuster"
		>
			<button
				@click="devicePreview = 'mobile'"
				class="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all text-[#155dfc]"
				:class="
					devicePreview === 'mobile'
						? 'bg-white shadow-sm ring-1 ring-[#155dfc]/10'
						: 'opacity-60'
				"
				title="Vue sur TÃ©lÃ©phone"
			>
				<Smartphone class="w-3.5 h-3.5" />
				<span>Mobile</span>
			</button>
			<button
				@click="devicePreview = 'desktop'"
				class="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all text-[#155dfc]"
				:class="
					devicePreview === 'desktop'
						? 'bg-white shadow-sm ring-1 ring-[#155dfc]/10'
						: 'opacity-60'
				"
				title="Vue sur Ã‰cran d'Orientation"
			>
				<Monitor class="w-3.5 h-3.5" />
				<span>Ordinateur</span>
			</button>
		</div>

		<!-- Rendu de la Plaque Municipale d'Habitation -->
		<div
			class="border-4 border-[#155dfc] rounded-[24px] bg-white overflow-hidden shadow-[6px_6px_0px_0px_#155dfc] transition-all max-w-sm mx-auto p-6 text-center space-y-4"
			id="mock-house-plate-rendering"
		>
			<div
				class="bg-[#155dfc] text-white p-2.5 rounded-xl font-black text-[10px] tracking-widest uppercase"
			>
				PLAQUE HOMOLOGUÃ‰E FINDME
			</div>

			<div class="space-y-1">
				<span
					class="text-[9px] font-black uppercase text-[#00bc7d] tracking-wider"
					>{{ address.neighborhood }} â€¢ {{ address.city }}</span
				>
				<h2 class="text-3xl font-black text-[#155dfc]">
					NÂ° {{ address.housePlateNumber || "28B" }}
				</h2>
				<span
					class="text-[10px] text-[#155dfc]/60 font-semibold block italic"
					>{{ address.fullName }}</span
				>
			</div>

			<!-- Code d'adressage unifiÃ© code-barres -->
			<div
				class="bg-[#FAF8FD] border-2 border-dashed border-[#155dfc]/15 py-3 rounded-2xl"
			>
				<span
					class="text-[8px] font-black tracking-widest text-[#00bc7d] uppercase block mb-1"
					>CODE D'ADRESSAGE NUMÃ‰RIQUE</span
				>
				<span
					class="font-mono font-black text-sm text-[#155dfc] tracking-wider uppercase block"
					>{{ address.addressCode }}</span
				>
			</div>

			<!-- Actions de dÃ©monstration -->
			<div class="grid grid-cols-2 gap-3 pt-2">
				<button
					@click="emit('print')"
					class="flex items-center justify-center space-x-1 border border-[#155dfc] hover:bg-[#F5F2FB] text-[#155dfc] text-xs font-black py-2.5 px-3 rounded-xl transition-all cursor-pointer"
				>
					<Printer class="w-3.5 h-3.5" />
					<span>Fiche PDF</span>
				</button>
				<button
					@click="emit('share')"
					class="flex items-center justify-center space-x-1 bg-[#00bc7d] hover:bg-[#00bc7d]/90 text-white text-xs font-black py-2.5 px-3 rounded-xl transition-all cursor-pointer"
				>
					<Share2 class="w-3.5 h-3.5" />
					<span>Partager</span>
				</button>
			</div>
		</div>
	</div>
</template>
