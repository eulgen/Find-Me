<!--
  @file GlobalCitizenMap.vue
  @description Tableau de bord cartographique interactif de l'Espace Citoyen findMe.
  Il assemble les modules de recherche par filtres, liste des parcelles et la grille satellite géodésique,
  avec une ergonomie optimisée sur mobile et ordinateur.
-->

<script setup lang="ts">
	import { ref, computed } from "vue";
	import {
		Map,
		List,
		Grid,
		ShieldCheck,
		Sparkles,
		AlertTriangle,
	} from "lucide-vue-next";
	import { useAddresses } from "../../composables/useAddresses";
	import { useAddressExporter } from "../../composables/useAddressExporter";
	import { useShare } from "../../composables/useShare";
	import MapFilterSearch from "../citizen-map/MapFilterSearch.vue";
	import AddressItemsList from "../citizen-map/AddressItemsList.vue";
	import MapGridSatelLite from "../citizen-map/MapGridSatelLite.vue";

	const {
		addressesList,
		openAddressDetails,
		confirmDeleteAddress,
		showDeleteConfirm,
		executeDeleteAddress,
		addressToDeleteIndex,
	} = useAddresses();

	const { downloadAddressFile } = useAddressExporter();
	const { handleShareLink } = useShare();

	// États d'exploration locaux
	const searchQuery = ref("");
	const selectedCity = ref("All");
	const mobileTab = ref<"list" | "map">("list");

	// Filtrage logique des adresses enregistrées
	const filteredAddresses = computed(() => {
		return addressesList.value.filter((addr) => {
			const q = searchQuery.value.toLowerCase().trim();
			const matchesQuery =
				!q ||
				addr.fullName.toLowerCase().includes(q) ||
				addr.addressCode.toLowerCase().includes(q) ||
				(addr.landmark && addr.landmark.toLowerCase().includes(q)) ||
				addr.neighborhood.toLowerCase().includes(q);

			const matchesCity =
				selectedCity.value === "All" || addr.city === selectedCity.value;

			return matchesQuery && matchesCity;
		});
	});

	const handleSelectIndex = (idx: number) => {
		const globalIdx = addressesList.value.indexOf(filteredAddresses.value[idx]);
		if (globalIdx !== -1) {
			openAddressDetails(globalIdx);
		}
	};

	const handleDeleteIndex = (idx: number) => {
		const globalIdx = addressesList.value.indexOf(filteredAddresses.value[idx]);
		if (globalIdx !== -1) {
			confirmDeleteAddress(globalIdx);
		}
	};
</script>

<template>
	<div class="space-y-6" id="global-citizen-map-dashboard">
		<!-- Barre de filtrage unifiée -->
		<MapFilterSearch
			v-model:searchQuery="searchQuery"
			v-model:selectedCity="selectedCity"
		/>

		<!-- Multi-onglets mobile uniquement -->
		<div
			class="flex md:hidden border-2 border-[#1A237E] rounded-xl overflow-hidden shadow-sm"
			id="mobile-views-selector"
		>
			<button
				@click="mobileTab = 'list'"
				class="flex-1 py-3 text-xs font-black uppercase text-[#1A237E] flex items-center justify-center space-x-1.5 transition-all outline-none"
				:class="mobileTab === 'list' ? 'bg-[#1A237E] text-white' : 'bg-white'"
			>
				<List class="w-4 h-4" />
				<span>Liste ({{ filteredAddresses.length }})</span>
			</button>
			<button
				@click="mobileTab = 'map'"
				class="flex-1 py-3 text-xs font-black uppercase text-[#1A237E] flex items-center justify-center space-x-1.5 transition-all outline-none"
				:class="mobileTab === 'map' ? 'bg-[#1A237E] text-white' : 'bg-white'"
			>
				<Map class="w-4 h-4" />
				<span>Carte interactive</span>
			</button>
		</div>

		<!-- Section d'affichage principale (Dual-pane sur Desktop) -->
		<div
			class="grid grid-cols-1 md:grid-cols-12 gap-6 items-start"
			id="main-geographic-desktop-split"
		>
			<!-- Liste des certificats à gauche (visible si tab mobile ='list' ou sur Desktop) -->
			<div
				class="md:col-span-5 space-y-4"
				:class="mobileTab === 'list' ? 'block' : 'hidden md:block'"
				id="citizen-left-sidebar"
			>
				<AddressItemsList
					:addresses="filteredAddresses"
					@select="handleSelectIndex"
					@download="downloadAddressFile"
					@share="handleShareLink"
					@delete="handleDeleteIndex"
				/>
			</div>

			<!-- Grille satellite à droite (visible si tab mobile ='map' ou sur Desktop) -->
			<div
				class="md:col-span-7"
				:class="mobileTab === 'map' ? 'block' : 'hidden md:block'"
				id="citizen-right-viewport"
			>
				<MapGridSatelLite
					:addresses="filteredAddresses"
					:selected-city="selectedCity"
					@select-address="handleSelectIndex"
				/>
			</div>
		</div>

		<!-- Bannière d'alerte de suppression confirmée -->
		<div
			v-if="showDeleteConfirm"
			class="fixed inset-0 z-50 bg-[#1A237E]/20 backdrop-blur-xs flex items-center justify-center p-4"
			id="delete-confirm-overlay"
		>
			<div
				class="bg-white border-4 border-rose-600 rounded-3xl p-6 max-w-sm w-full space-y-4 text-center shadow-2xl"
			>
				<AlertTriangle class="w-12 h-12 text-rose-600 mx-auto animate-bounce" />
				<h3 class="text-lg font-black text-[#1A237E]">
					Confirmer le retrait ?
				</h3>
				<p class="text-xs text-[#1A237E]/75 font-normal leading-relaxed">
					Êtes-vous certain d'effacer définitivement cette adresse civique ?
					Cette action est irréversible.
				</p>
				<div class="flex justify-center space-x-3 pt-2">
					<button
						@click="showDeleteConfirm = false"
						class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-black rounded-lg cursor-pointer"
					>
						Annuler
					</button>
					<button
						@click="executeDeleteAddress"
						class="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-black rounded-lg cursor-pointer"
					>
						Supprimer
					</button>
				</div>
			</div>
		</div>
	</div>
</template>
