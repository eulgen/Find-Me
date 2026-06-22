<!--
  @file app/components/dashboard/AddressManager.vue
  @description Onglet "Mes Adresses" — affichage, création, modification et
  suppression des adresses de l'utilisateur. Calqué sur la maquette "mes adresses.png".
  Intègre le formulaire multi-étapes existant ainsi que la grille de cartes.
  Max 4 adresses par utilisateur.
-->

<script setup lang="ts">
import {
	MapPin, Plus, Map, Share2, FileDown, Edit, Trash2, Trash,
	Check, X, ArrowLeft, ArrowRight, Locate, Upload, Camera, Sparkles, List,
} from "lucide-vue-next";
import ButtonUI from "~/components/ui/ButtonUI.vue";
import { useCitizenSpacePage } from "~/composables/useCitizenSpacePage";

// ─── Composable principal adresses ────────────────────────────────────────
const {
	addressesList, MAX_ADDRESSES, canAddMore,
	openAddressDetails, downloadAddressPDF, confirmDeleteAddress, executeDeleteAddress, showDeleteConfirm,
	localTab, isFormOpen, formStep, editIndex, formState, formErrors,
	countries, availableCities, markerPos, handleMapClick, geolocateUser,
	handlePhotoUpload, openCreateForm, openEditForm, cancelForm, nextStep, prevStep, submitForm,
} = useCitizenSpacePage();

/** Labels des étapes du formulaire */
const stepLabels = ["Localisation", "Détails", "Photo & Recap"];

/** Filtre actif pour les catégories d'adresses */
const activeFilter = ref<"all" | "home" | "work" | "family">("all");

/** Adresses filtrées selon la catégorie sélectionnée */
const filteredAddresses = computed(() => {
	if (activeFilter.value === "all") return addressesList.value;
	return addressesList.value.filter((a) => (a.type || "home") === activeFilter.value);
});

/** Configuration des filtres de catégorie */
const filters = [
	{ key: "all", label: "Toutes" },
	{ key: "home", label: "Maison" },
	{ key: "work", label: "Travail" },
	{ key: "family", label: "Favoris" },
] as const;

/** Ferme la modale de confirmation de suppression */
const closeDeleteModal = () => { showDeleteConfirm.value = false; };
</script>

<template>
	<div class="flex-1 w-full animate-in fade-in duration-300" id="address-manager-section">

		<!-- ════════════════════════════════════════════════════════ -->
		<!-- VUE LISTE : Affichage des adresses                     -->
		<!-- ════════════════════════════════════════════════════════ -->
		<div class="space-y-6">

			<!-- ── Banner Hero ── -->
			<div class="bg-white dark:bg-slate-900 rounded-[24px] border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden">
				<div class="p-6 flex flex-col-reverse sm:flex-row items-center sm:items-center justify-between gap-6 text-center sm:text-left">
					<div class="flex-1 flex flex-col items-center sm:items-start">
						<p class="text-[10px] font-black text-[#2E7D32] uppercase tracking-widest mb-1">Bienvenue sur FindMe</p>
						<h1 class="text-2xl font-black text-gray-800 dark:text-white leading-tight mb-2">
							Votre monde est désormais<br>
							<span class="text-[#2E7D32]">parfaitement localisé.</span>
						</h1>
						<p class="text-sm text-gray-400 dark:text-slate-500 mb-4 leading-relaxed max-w-sm mx-auto sm:mx-0">
							Gérez vos points d'intérêt avec une précision chirurgicale grâce à notre système d'adressage numérique.
						</p>
						<div class="flex flex-wrap justify-center sm:justify-start gap-3">
							<ButtonUI @click="openCreateForm" :disabled="!canAddMore" variant="secondary" size="sm">
								Tutoriel rapide
							</ButtonUI>
							<ButtonUI variant="outline" size="sm" class="border-gray-200 dark:border-slate-700">
								En savoir plus
							</ButtonUI>
						</div>
					</div>
					<!-- Illustration -->
					<div class="shrink-0 w-32 h-32 bg-gradient-to-br from-[#2E7D32]/10 to-[#1A237E]/10 rounded-2xl flex items-center justify-center">
						<MapPin class="w-16 h-16 text-[#2E7D32]/30" />
					</div>
				</div>
			</div>

			<!-- ── Barre de filtres + Actions ── -->
			<div class="flex items-center justify-between flex-wrap gap-4">
				<!-- Filtres catégories -->
				<div class="flex items-center gap-2 flex-wrap">
					<button
						v-for="f in filters"
						:key="f.key"
						@click="activeFilter = f.key"
						class="px-4 py-2 rounded-full text-sm font-bold transition-all duration-200"
						:class="activeFilter === f.key
							? 'bg-gray-800 dark:bg-white text-white dark:text-gray-800 shadow-sm'
							: 'bg-white dark:bg-slate-900 text-gray-500 dark:text-slate-400 border border-gray-200 dark:border-slate-700 hover:border-gray-300'"
					>
						{{ f.label }}
					</button>
				</div>

				<div class="flex items-center gap-3">
					<!-- Toggle vue liste/compacte -->
					<div class="flex items-center bg-gray-100 dark:bg-slate-800 rounded-xl p-1">
						<button @click="localTab = 'list'" class="p-2 rounded-lg transition-all duration-200" :class="localTab === 'list' ? 'bg-white dark:bg-slate-700 shadow-sm text-[#1A237E] dark:text-white' : 'text-gray-400 hover:text-gray-600'">
							<List class="w-4 h-4" />
						</button>
						<button @click="localTab = 'map'" class="p-2 rounded-lg transition-all duration-200" :class="localTab === 'map' ? 'bg-white dark:bg-slate-700 shadow-sm text-[#2E7D32]' : 'text-gray-400 hover:text-gray-600'">
							<Map class="w-4 h-4" />
						</button>
					</div>
					<!-- Trier par -->
					<span class="text-xs text-gray-400 font-semibold hidden sm:inline">Trier par: Date d'ajout</span>
				</div>
			</div>

			<!-- ── Grille de cartes ── -->
			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

				<!-- Cartes d'adresses existantes -->
				<div v-for="(addr, idx) in filteredAddresses" :key="idx"
					class="bg-white dark:bg-slate-900 rounded-[20px] border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-md overflow-hidden group hover:-translate-y-1 transition-all duration-300"
					:id="'addr-card-' + idx"
				>
					<!-- Image -->
					<div class="h-36 relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50 dark:from-slate-800 dark:to-slate-700">
						<img v-if="addr.photoRaw" :src="addr.photoRaw" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
						<div v-else class="w-full h-full flex items-center justify-center">
							<MapPin class="w-10 h-10 text-gray-300 dark:text-slate-600" />
						</div>
						<!-- Badge type -->
						<div class="absolute top-2.5 left-2.5 px-2 py-0.5 bg-[#2E7D32]/90 text-white text-[9px] font-black uppercase tracking-wider rounded-lg backdrop-blur-sm">
							DOMICILE
						</div>
					</div>

					<!-- Corps de la carte -->
					<div class="p-4">
						<div class="flex items-center gap-2 mb-1">
							<div class="w-6 h-6 bg-[#2E7D32]/10 rounded-lg flex items-center justify-center shrink-0">
								<MapPin class="w-3.5 h-3.5 text-[#2E7D32]" />
							</div>
							<h4 class="text-sm font-black text-gray-800 dark:text-white truncate">
								{{ addr.neighborhood }}, {{ addr.city }}
							</h4>
						</div>
						<p class="text-xs text-gray-400 dark:text-slate-500 mb-3 leading-snug pl-8">
							{{ addr.streetName }}, {{ addr.housePlateNumber }}
						</p>

						<!-- Code digital -->
						<div class="flex items-center justify-between bg-gray-50 dark:bg-slate-800 rounded-xl px-3 py-2 mb-3">
							<div>
								<p class="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Code Digital</p>
								<p class="text-sm font-mono font-black text-[#1A237E] dark:text-blue-400">{{ addr.addressCode }}</p>
							</div>
							<button class="text-gray-400 hover:text-[#2E7D32] transition-colors p-1">
								<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"/></svg>
							</button>
						</div>

						<!-- Actions -->
						<div class="flex items-center gap-1.5">
							<ButtonUI @click="openAddressDetails(addr)" variant="primary" size="sm" :icon="Map" class="flex-1 text-[11px]">
								Voir sur la carte
							</ButtonUI>
							<ButtonUI @click="openEditForm(idx)" variant="outline" size="sm" :icon="Edit" class="w-8 px-0 border-gray-200 dark:border-slate-700" />
							<ButtonUI @click="downloadAddressPDF(addr)" variant="outline" size="sm" :icon="FileDown" class="w-8 px-0 border-gray-200 dark:border-slate-700" />
							<ButtonUI @click="confirmDeleteAddress(idx)" variant="outline" size="sm" :icon="Trash2" class="w-8 px-0 border-rose-200 dark:border-rose-500/20 text-rose-500 hover:bg-rose-50" />
						</div>
					</div>
				</div>

				<!-- Card "Nouvelle adresse" si quota non atteint -->
				<button
					v-if="canAddMore"
					@click="openCreateForm"
					class="bg-white dark:bg-slate-900 rounded-[20px] border-2 border-dashed border-gray-200 dark:border-slate-700 hover:border-[#2E7D32] hover:bg-[#2E7D32]/5 dark:hover:bg-[#2E7D32]/5 flex flex-col items-center justify-center gap-3 p-8 transition-all duration-300 group min-h-[240px]"
					id="create-new-address-card"
				>
					<div class="w-14 h-14 bg-gray-100 dark:bg-slate-800 group-hover:bg-[#2E7D32]/10 rounded-2xl flex items-center justify-center transition-colors">
						<MapPin class="w-7 h-7 text-gray-300 dark:text-slate-600 group-hover:text-[#2E7D32] transition-colors" />
					</div>
					<div class="text-center">
						<p class="text-sm font-black text-gray-500 dark:text-slate-400 group-hover:text-[#2E7D32] transition-colors">Nouvelle adresse</p>
						<p class="text-xs text-gray-400 dark:text-slate-500 mt-0.5">Enregistrez un nouveau lieu pour obtenir un code unique.</p>
					</div>
				</button>

				<!-- Card "Partagez facilement" -->
				<div class="bg-gradient-to-br from-[#2E7D32]/10 to-[#1B5E20]/5 border-2 border-dashed border-[#2E7D32]/20 rounded-[20px] p-6 flex flex-col justify-between min-h-[240px]">
					<div>
						<p class="text-sm font-black text-[#1A237E] dark:text-white mb-2">Partagez facilement</p>
						<p class="text-xs text-gray-500 dark:text-slate-400 leading-relaxed">
							Saviez-vous que vous pouvez envoyer votre code digital par SMS ? Un clic suffit pour guider vos livreurs.
						</p>
					</div>
					<ButtonUI variant="outline" size="sm" class="mt-4 border-[#2E7D32]/30 text-[#2E7D32] hover:bg-[#2E7D32]/5">
						Découvrir les astuces
					</ButtonUI>
				</div>

			</div>

			<!-- ── État vide ── -->
			<div v-if="addressesList.length === 0" class="bg-white dark:bg-slate-900 rounded-[24px] border border-gray-100 dark:border-slate-800 p-16 text-center shadow-sm">
				<div class="w-20 h-20 bg-gray-50 dark:bg-slate-800 rounded-3xl flex items-center justify-center mx-auto mb-5">
					<MapPin class="w-10 h-10 text-gray-300 dark:text-slate-600" />
				</div>
				<h3 class="text-lg font-black text-gray-800 dark:text-white mb-2">Aucune adresse enregistrée</h3>
				<p class="text-sm text-gray-400 dark:text-slate-500 mb-6 max-w-sm mx-auto">
					Créez votre première adresse pour obtenir votre code FindMe unique.
				</p>
				<ButtonUI @click="openCreateForm" variant="primary" :icon="Plus" class="shadow-lg shadow-[#2E7D32]/25">
					Créer ma première adresse
				</ButtonUI>
			</div>
		</div>

		<!-- ════════════════════════════════════════════════════════ -->
		<!-- MODALE DE CONFIRMATION DE SUPPRESSION                  -->
		<!-- ════════════════════════════════════════════════════════ -->
		<Transition
			enter-active-class="transition-all duration-300 ease-out"
			enter-from-class="opacity-0 scale-90"
			enter-to-class="opacity-100 scale-100"
			leave-active-class="transition-all duration-200 ease-in"
			leave-from-class="opacity-100 scale-100"
			leave-to-class="opacity-0 scale-90"
		>
			<div v-if="showDeleteConfirm" class="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" @click.self="closeDeleteModal">
				<div class="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl">
					<div class="w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center mx-auto mb-5">
						<Trash class="w-8 h-8 text-rose-500 animate-bounce" />
					</div>
					<h3 class="text-lg font-black text-gray-800 dark:text-white mb-2">Confirmer la suppression ?</h3>
					<p class="text-sm text-gray-500 dark:text-slate-400 leading-relaxed mb-6">
						Cette action est irréversible. L'adresse et son code unique seront définitivement supprimés.
					</p>
					<div class="flex gap-3">
						<ButtonUI @click="closeDeleteModal" variant="outline" class="flex-1 border-gray-200 dark:border-slate-700">Annuler</ButtonUI>
						<ButtonUI @click="executeDeleteAddress" variant="danger" class="flex-1" :icon="Trash2">Supprimer</ButtonUI>
					</div>
				</div>
			</div>
		</Transition>

	</div>
</template>
