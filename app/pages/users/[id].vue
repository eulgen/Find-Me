<!--
  @file app/pages/users/[id].vue
  @description Espace citoyen personnel sécurisé pour la gestion des adresses municipales findMe.
  Utilise le layout "dashboard" qui fournit le header, la sidebar et le footer.
-->

<script setup lang="ts">
import {
	MapPin,
	Sparkles,
	Trash2,
	Check,
	Locate,
	Upload,
	ArrowLeft,
	ArrowRight,
	FileDown,
	Edit,
	X,
	Trash,
	Plus,
	Map,
	List,
	Share2,
} from "lucide-vue-next";
import ButtonUI from "~/components/ui/ButtonUI.vue";
import GlobalCitizenMap from "~/components/ui/GlobalCitizenMap.vue";

definePageMeta({
	middleware: "auth",
	layout: "dashboard",
});

const {
	currentUser,
	handleGoHome,
	handleShareLink,
	addressesList,
	MAX_ADDRESSES,
	canAddMore,
	openAddressDetails,
	downloadAddressPDF,
	confirmDeleteAddress,
	executeDeleteAddress,
	showDeleteConfirm,
	localTab,
	isFormOpen,
	formStep,
	editIndex,
	formState,
	formErrors,
	countries,
	availableCities,
	markerPos,
	handleMapClick,
	geolocateUser,
	handlePhotoUpload,
	openCreateForm,
	openEditForm,
	cancelForm,
	nextStep,
	prevStep,
	submitForm,
} = useCitizenSpacePage();

// Sync sidebar "create" section with form state
const route = useRoute();
watch(
	() => route.query.section,
	(section) => {
		if (section === "create" && !isFormOpen.value) {
			openCreateForm();
		}
	},
	{ immediate: true }
);

// User display name
const userName = computed(() => {
	if (!currentUser.value) return "";
	return currentUser.value.username || currentUser.value.email.split("@")[0];
});

// Step labels
const stepLabels = ["Localisation", "Détails", "Photo & Recap"];
</script>

<template>
	<!-- Authenticated view -->
	<div
		v-if="currentUser"
		class="flex-1 flex flex-col"
		id="citizen-dashboard-root"
	>
		<!-- ---- FORM PANEL (Create / Edit address) ---- -->
		<div
			v-if="isFormOpen"
			class="flex-1 flex flex-col p-8 max-w-3xl w-full mx-auto"
			id="address-form-panel"
		>
			<!-- Form top bar -->
			<div class="flex items-center justify-between mb-6">
				<div>
					<h2 class="text-2xl font-black text-[#2E7D32]">
						{{ editIndex !== null ? "Modifier une adresse" : "Créer une adresse" }}
					</h2>
					<p class="text-sm text-gray-500 mt-0.5">
						Étape {{ formStep }} sur 3 :
						<span class="font-semibold text-gray-700 dark:text-gray-300">
							{{
								formStep === 1
									? "Définir la localisation précise"
									: formStep === 2
									? "Renseigner les coordonnées GPS"
									: "Ajouter une photo de façade"
							}}
						</span>
					</p>
				</div>
				<button
					@click="cancelForm"
					class="text-sm font-semibold text-gray-500 hover:text-gray-800 dark:hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800"
				>
					Annuler
				</button>
			</div>

			<!-- Step Progress -->
			<div class="flex items-center gap-0 mb-8">
				<div
					v-for="(label, i) in stepLabels"
					:key="i"
					class="flex items-center"
					:class="i < stepLabels.length - 1 ? 'flex-1' : ''"
				>
					<div class="flex flex-col items-center">
						<div
							class="w-9 h-9 rounded-full flex items-center justify-center text-sm font-black border-2 transition-all duration-300"
							:class="
								formStep > i + 1
									? 'bg-[#2E7D32] border-[#2E7D32] text-white'
									: formStep === i + 1
									? 'bg-[#2E7D32] border-[#2E7D32] text-white shadow-md shadow-[#2E7D32]/30'
									: 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-600 text-gray-400'
							"
						>
							<Check v-if="formStep > i + 1" class="w-4 h-4 stroke-[3]" />
							<span v-else>{{ i + 1 }}</span>
						</div>
						<span
							class="text-[10px] font-bold mt-1.5 uppercase tracking-wider"
							:class="formStep === i + 1 ? 'text-[#2E7D32]' : 'text-gray-400'"
						>
							{{ label }}
						</span>
					</div>
					<!-- Connector -->
					<div
						v-if="i < stepLabels.length - 1"
						class="flex-1 h-0.5 mx-3 mb-5 rounded-full transition-all duration-300"
						:class="formStep > i + 1 ? 'bg-[#2E7D32]' : 'bg-gray-200 dark:bg-slate-700'"
					/>
				</div>
			</div>

			<!-- Form Card -->
			<div
				class="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 p-6 flex-1"
				id="address-stepper-form-card"
			>
				<!-- Step 1: Physical Address -->
				<div v-if="formStep === 1" class="space-y-5">
					<div>
						<h3 class="text-base font-bold text-[#2E7D32] flex items-center gap-2 mb-1">
							<MapPin class="w-4 h-4" />
							Carte interactive (Glissez / Cliquez pour positionner)
						</h3>
						<p class="text-xs text-gray-400">
							Pour simuler, choisissez un repère ou cliquez sur un bouton de coordonnées.
						</p>
					</div>

					<!-- Map simulation -->
					<div
						class="relative w-full h-56 bg-sky-50 dark:bg-slate-950 border-2 border-gray-200 dark:border-slate-700 rounded-xl overflow-hidden cursor-crosshair"
						@click="handleMapClick"
						id="map-clickable-area"
					>
						<!-- Grid lines (road simulation) -->
						<svg class="absolute inset-0 w-full h-full opacity-20 pointer-events-none">
							<defs>
								<pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
									<path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1A237E" stroke-width="0.5" />
								</pattern>
							</defs>
							<rect width="100%" height="100%" fill="url(#grid)" />
							<path d="M 0,140 Q 200,100 400,140 T 800,140" stroke="#94a3b8" stroke-width="3" fill="none" opacity="0.5" />
							<path d="M 120,0 L 120,300" stroke="#94a3b8" stroke-width="2" fill="none" opacity="0.4" />
							<path d="M 320,0 L 320,300" stroke="#94a3b8" stroke-width="2" fill="none" opacity="0.4" />
						</svg>

						<!-- Map image overlay -->
						<img
							src="/assets/images/bastos_yaounde.jpg"
							alt="Carte de localisation"
							class="absolute inset-0 w-full h-full object-cover opacity-60"
							referrerpolicy="no-referrer"
						/>

						<!-- Interactive pin -->
						<div
							class="absolute -translate-x-1/2 -translate-y-full flex flex-col items-center pointer-events-none transition-all duration-300 z-10"
							:style="{ left: `${markerPos.x}%`, top: `${markerPos.y}%` }"
						>
							<div class="bg-[#2E7D32] rounded-full p-1.5 shadow-lg shadow-[#2E7D32]/40">
								<MapPin class="w-5 h-5 text-white stroke-[2.5]" />
							</div>
							<div class="w-2 h-2 bg-[#2E7D32] rotate-45 -mt-1 shadow-sm" />
							<div class="w-3 h-3 bg-[#4CAF50]/40 rounded-full animate-ping absolute -bottom-1" />
						</div>

						<!-- Watermark -->
						<div class="absolute bottom-2 right-2 text-[10px] text-gray-400 font-semibold">
							findMe Map • Caméron
						</div>
					</div>

					<!-- GPS readout -->
					<div class="flex items-center justify-between bg-gray-50 dark:bg-slate-800 rounded-xl px-4 py-3 border border-gray-100 dark:border-slate-700">
						<span class="text-[12px] font-semibold text-gray-500">
							<span class="font-mono font-bold text-[#2E7D32]">Latitude:</span>
							<span class="font-mono text-[#2E7D32] ml-1">{{ formState.lat }}</span>
							<span class="mx-2 text-gray-300">•</span>
							<span class="font-mono font-bold text-[#2E7D32]">Longitude:</span>
							<span class="font-mono text-[#2E7D32] ml-1">{{ formState.lng }}</span>
						</span>
						<span class="text-[11px] font-bold text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-lg">
							Cliquez sur la carte...
						</span>
					</div>

					<!-- Address fields -->
					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div class="space-y-1">
							<label class="block text-xs font-bold text-gray-600 dark:text-slate-300 uppercase tracking-wide">Pays</label>
							<select
								v-model="formState.country"
								class="w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-800 dark:text-white text-sm rounded-xl px-4 py-2.5 focus:border-[#2E7D32] focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/20 transition-all"
							>
								<option v-for="c in countries" :key="c" :value="c">{{ c }}</option>
							</select>
						</div>
						<div class="space-y-1">
							<label class="block text-xs font-bold text-gray-600 dark:text-slate-300 uppercase tracking-wide">Ville</label>
							<select
								v-model="formState.city"
								class="w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-800 dark:text-white text-sm rounded-xl px-4 py-2.5 focus:border-[#2E7D32] focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/20 transition-all"
							>
								<option v-for="v in availableCities" :key="v" :value="v">{{ v }}</option>
							</select>
						</div>
						<div class="space-y-1">
							<label class="block text-xs font-bold text-gray-600 dark:text-slate-300 uppercase tracking-wide">Quartier</label>
							<input
								v-model="formState.neighborhood"
								type="text"
								placeholder="Ex: Bastos, Bonapriso..."
								class="w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-800 dark:text-white text-sm rounded-xl px-4 py-2.5 focus:border-[#2E7D32] focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/20 transition-all"
							/>
							<p v-if="formErrors.neighborhood" class="text-rose-500 text-[11px] font-bold">{{ formErrors.neighborhood }}</p>
						</div>
						<div class="space-y-1">
							<label class="block text-xs font-bold text-gray-600 dark:text-slate-300 uppercase tracking-wide">Rue</label>
							<input
								v-model="formState.street"
								type="text"
								placeholder="Ex: Rue de la Joie..."
								class="w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-800 dark:text-white text-sm rounded-xl px-4 py-2.5 focus:border-[#2E7D32] focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/20 transition-all"
							/>
							<p v-if="formErrors.street" class="text-rose-500 text-[11px] font-bold">{{ formErrors.street }}</p>
						</div>
						<div class="space-y-1">
							<label class="block text-xs font-bold text-gray-600 dark:text-slate-300 uppercase tracking-wide">Numéro</label>
							<input
								v-model="formState.houseNumber"
								type="text"
								placeholder="Ex: 28B, 102..."
								class="w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-800 dark:text-white text-sm rounded-xl px-4 py-2.5 focus:border-[#2E7D32] focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/20 transition-all"
							/>
							<p v-if="formErrors.houseNumber" class="text-rose-500 text-[11px] font-bold">{{ formErrors.houseNumber }}</p>
						</div>
						<div class="space-y-1">
							<label class="block text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wide">Code postal (optionnel)</label>
							<input
								v-model="formState.postalCode"
								type="text"
								placeholder="Ex: 00237, BP 10..."
								class="w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-800 dark:text-white text-sm rounded-xl px-4 py-2.5 focus:border-[#2E7D32] focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/20 transition-all"
							/>
						</div>
					</div>

					<!-- CTA buttons -->
					<div class="space-y-3 pt-2">
						<button
							type="button"
							class="w-full py-3.5 rounded-xl font-bold text-sm bg-gray-900 hover:bg-gray-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white flex items-center justify-center gap-2 transition-all"
							@click="nextStep"
						>
							<MapPin class="w-4 h-4" />
							Valider la position choisie
						</button>
						<button
							type="button"
							class="w-full py-3.5 rounded-xl font-bold text-sm bg-[#2E7D32] hover:bg-[#1B5E20] text-white flex items-center justify-center gap-2 transition-all shadow-sm shadow-[#2E7D32]/30"
							@click="geolocateUser"
						>
							<Locate class="w-4 h-4" />
							Utiliser ma position actuelle
						</button>
					</div>
				</div>

				<!-- Step 2: GPS Coordinates -->
				<div v-if="formStep === 2" class="space-y-5">
					<div class="flex items-center justify-between">
						<div>
							<h3 class="text-base font-bold text-[#2E7D32]">Coordonnées GPS précises</h3>
							<p class="text-xs text-gray-400">Ajustez les coordonnées de géolocalisation satellite.</p>
						</div>
						<ButtonUI type="button" variant="outline" :icon="Locate" @click="geolocateUser" class="border-[#2E7D32] text-[#2E7D32]">
							Détecter ma position
						</ButtonUI>
					</div>

					<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
						<div class="space-y-4">
							<div class="space-y-1">
								<label class="block text-xs font-bold text-gray-600 dark:text-slate-300 uppercase tracking-wide">Latitude</label>
								<input
									v-model="formState.lat"
									type="text"
									class="w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-sm font-mono font-bold text-[#2E7D32] rounded-xl px-4 py-2.5 focus:border-[#2E7D32] focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/20 transition-all"
								/>
							</div>
							<div class="space-y-1">
								<label class="block text-xs font-bold text-gray-600 dark:text-slate-300 uppercase tracking-wide">Longitude</label>
								<input
									v-model="formState.lng"
									type="text"
									class="w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-sm font-mono font-bold text-[#2E7D32] rounded-xl px-4 py-2.5 focus:border-[#2E7D32] focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/20 transition-all"
								/>
							</div>
							<div class="p-3 bg-[#2E7D32]/5 border border-[#2E7D32]/20 rounded-xl flex items-center gap-3">
								<div class="w-3.5 h-3.5 bg-[#2E7D32] rounded-full animate-ping shrink-0" />
								<span class="text-[11px] font-semibold text-gray-600 dark:text-slate-300 leading-tight">
									Signal satellite actif — repère synchronisé en temps réel.
								</span>
							</div>
						</div>

						<!-- Map interactive pad -->
						<div class="space-y-2">
							<label class="block text-xs font-bold text-gray-600 dark:text-slate-300 uppercase tracking-wide">Ajuster sur la carte</label>
							<div
								class="relative w-full h-48 bg-sky-50 dark:bg-slate-950 border-2 border-gray-200 dark:border-slate-700 rounded-xl overflow-hidden cursor-crosshair"
								@click="handleMapClick"
							>
								<img
									src="/assets/images/bastos_yaounde.jpg"
									alt="Carte"
									class="absolute inset-0 w-full h-full object-cover opacity-50"
								/>
								<svg class="absolute inset-0 w-full h-full opacity-20 pointer-events-none">
									<path d="M 0,100 L 600,100 M 0,200 L 600,200" stroke="#1A237E" stroke-width="3" fill="none" />
									<path d="M 150,0 L 150,300 M 350,0 L 350,300" stroke="#1A237E" stroke-width="3" fill="none" />
								</svg>
								<div
									class="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-all duration-300"
									:style="{ left: `${markerPos.x}%`, top: `${markerPos.y}%` }"
								>
									<MapPin class="w-7 h-7 text-[#2E7D32] stroke-[2.5] drop-shadow-md" />
									<div class="w-2.5 h-2.5 bg-[#4CAF50] rounded-full animate-ping absolute bottom-0 left-1/2 -translate-x-1/2" />
								</div>
							</div>
							<p class="text-[10px] text-gray-400 font-semibold text-center italic">
								Cliquez sur le cadran pour repositionner le repère.
							</p>
						</div>
					</div>
				</div>

				<!-- Step 3: Photo + Recap -->
				<div v-if="formStep === 3" class="space-y-5">
					<div>
						<h3 class="text-base font-bold text-[#2E7D32]">Photo du bâtiment &amp; Récapitulatif</h3>
						<p class="text-xs text-gray-400">Fournissez un visuel net de la façade pour faciliter l'orientation.</p>
					</div>

					<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
						<!-- Upload zone -->
						<div class="space-y-3">
							<label class="block text-xs font-bold text-gray-600 dark:text-slate-300 uppercase tracking-wide">Façade du bâtiment</label>
							<div class="relative border-2 border-dashed border-gray-200 dark:border-slate-700 hover:border-[#2E7D32] rounded-2xl p-6 text-center bg-gray-50 dark:bg-slate-950 transition-colors cursor-pointer">
								<input
									type="file"
									accept="image/*"
									@change="handlePhotoUpload"
									class="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
								/>
								<div class="space-y-2 pointer-events-none">
									<div class="w-12 h-12 rounded-2xl bg-[#2E7D32]/10 border border-[#2E7D32]/20 flex items-center justify-center mx-auto text-[#2E7D32]">
										<Upload class="w-6 h-6" />
									</div>
									<p class="text-sm font-bold text-gray-700 dark:text-slate-300">Glissez-déposez ou cliquez</p>
									<p class="text-xs text-gray-400">Taille max : 10 Mo. Compression auto.</p>
								</div>
							</div>
							<p v-if="formErrors.photo" class="text-rose-500 text-[11px] font-bold">{{ formErrors.photo }}</p>
						</div>

						<!-- Preview -->
						<div class="space-y-3">
							<label class="block text-xs font-bold text-gray-600 dark:text-slate-300 uppercase tracking-wide">Aperçu</label>
							<div class="h-40 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-950 overflow-hidden relative flex items-center justify-center">
								<img
									v-if="formState.photo"
									:src="formState.photo"
									alt="Façade"
									class="w-full h-full object-cover"
								/>
								<div v-else class="flex flex-col items-center gap-2 text-gray-300">
									<img
										src="/assets/images/localisation_du_domicile.png"
										alt="Illustration"
										class="w-20 h-20 object-contain opacity-40"
									/>
									<span class="text-xs font-semibold text-gray-400">Aucune image chargée</span>
								</div>
								<div
									v-if="formState.photo && formState.photoStats"
									class="absolute bottom-2 left-2 right-2 bg-black/75 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-[10px] flex items-center justify-between"
								>
									<span>Optimisation findMe :</span>
									<span class="font-mono bg-[#2E7D32] px-2 py-0.5 rounded text-[9px] font-black">
										{{ formState.photoStats.compressed }} (-{{ formState.photoStats.ratio }}%)
									</span>
								</div>
							</div>
						</div>
					</div>

					<!-- Recap summary -->
					<div class="bg-[#2E7D32]/5 border border-[#2E7D32]/20 rounded-xl p-4 space-y-2">
						<h4 class="text-xs font-black text-[#2E7D32] uppercase tracking-widest">Récapitulatif</h4>
						<div class="grid grid-cols-2 gap-2 text-[12px]">
							<div><span class="text-gray-400">Ville :</span> <span class="font-bold text-gray-700 dark:text-slate-300">{{ formState.city }}</span></div>
							<div><span class="text-gray-400">Quartier :</span> <span class="font-bold text-gray-700 dark:text-slate-300">{{ formState.neighborhood || "—" }}</span></div>
							<div><span class="text-gray-400">Rue :</span> <span class="font-bold text-gray-700 dark:text-slate-300">{{ formState.street || "—" }}</span></div>
							<div><span class="text-gray-400">N° :</span> <span class="font-bold text-gray-700 dark:text-slate-300">{{ formState.houseNumber || "—" }}</span></div>
							<div><span class="text-gray-400">Lat :</span> <span class="font-mono font-bold text-[#2E7D32]">{{ formState.lat }}</span></div>
							<div><span class="text-gray-400">Lng :</span> <span class="font-mono font-bold text-[#2E7D32]">{{ formState.lng }}</span></div>
						</div>
					</div>

					<!-- Draft notice -->
					<div class="flex items-center gap-2 text-[11px] text-gray-400 font-semibold justify-end">
						<div class="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
						<span>Brouillon synchronisé automatiquement</span>
					</div>
				</div>
			</div>

			<!-- Form navigation footer -->
			<div class="flex items-center justify-between pt-5">
				<ButtonUI type="button" variant="outline" @click="cancelForm">Annuler</ButtonUI>
				<div class="flex items-center gap-3">
					<ButtonUI v-if="formStep > 1" type="button" variant="outline" :icon="ArrowLeft" @click="prevStep">
						Précédent
					</ButtonUI>
					<button
						v-if="formStep < 3"
						type="button"
						@click="nextStep"
						class="flex items-center gap-2 px-5 py-2.5 bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-bold text-sm rounded-xl transition-all shadow-sm shadow-[#2E7D32]/30"
						id="form-next-btn"
					>
						Suivant
						<ArrowRight class="w-4 h-4" />
					</button>
					<button
						v-else
						type="button"
						@click="submitForm"
						class="flex items-center gap-2 px-5 py-2.5 bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-bold text-sm rounded-xl transition-all shadow-sm shadow-[#2E7D32]/30"
						id="form-submit-btn"
					>
						<Check class="w-4 h-4 stroke-[2.5]" />
						Enregistrer l'adresse
					</button>
				</div>
			</div>
		</div>

		<!-- ---- DASHBOARD PANEL ---- -->
		<div
			v-else
			class="flex-1 p-6 md:p-8 space-y-8"
			id="dashboard-content-panel"
		>
			<!-- Page header -->
			<div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
				<div>
					<h1 class="text-2xl font-black text-gray-800 dark:text-white">
						Bonjour, {{ userName }} 👋
					</h1>
					<p class="text-sm text-gray-500 dark:text-slate-400 mt-1">
						Gérez vos adresses municipales et suivez leur statut en temps réel.
					</p>
				</div>
				<button
					@click="openCreateForm"
					:disabled="!canAddMore"
					class="flex items-center gap-2 px-5 py-2.5 bg-[#2E7D32] hover:bg-[#1B5E20] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm rounded-xl transition-all shadow-sm shadow-[#2E7D32]/30"
					id="dashboard-create-btn"
				>
					<Plus class="w-4 h-4" />
					Nouvelle adresse
				</button>
			</div>

			<!-- Stats cards -->
			<div class="grid grid-cols-1 sm:grid-cols-3 gap-4" id="dashboard-stats-row">
				<!-- Addresses count -->
				<div class="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-gray-100 dark:border-slate-800 shadow-sm">
					<div class="flex items-center justify-between mb-3">
						<span class="text-[11px] font-bold uppercase tracking-widest text-gray-400">Adresses</span>
						<div class="w-8 h-8 rounded-xl bg-[#2E7D32]/10 flex items-center justify-center">
							<MapPin class="w-4 h-4 text-[#2E7D32]" />
						</div>
					</div>
					<p class="text-3xl font-black text-gray-800 dark:text-white">{{ addressesList.length }}</p>
					<p class="text-xs text-gray-400 mt-1">sur {{ MAX_ADDRESSES }} autorisées</p>
					<div class="mt-3 w-full h-1.5 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
						<div
							class="h-full rounded-full transition-all duration-500"
							:class="addressesList.length >= MAX_ADDRESSES ? 'bg-rose-500' : 'bg-[#2E7D32]'"
							:style="{ width: `${(addressesList.length / MAX_ADDRESSES) * 100}%` }"
						/>
					</div>
				</div>

				<!-- Status card -->
				<div class="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-gray-100 dark:border-slate-800 shadow-sm">
					<div class="flex items-center justify-between mb-3">
						<span class="text-[11px] font-bold uppercase tracking-widest text-gray-400">Statut</span>
						<div class="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center">
							<Check class="w-4 h-4 text-amber-500" />
						</div>
					</div>
					<p class="text-3xl font-black text-gray-800 dark:text-white">Actif</p>
					<p class="text-xs text-gray-400 mt-1">Compte citoyen homologué</p>
					<div class="mt-3 flex items-center gap-1.5">
						<span class="w-2 h-2 rounded-full bg-[#2E7D32] animate-pulse inline-block" />
						<span class="text-[11px] text-[#2E7D32] font-semibold">Synchronisé</span>
					</div>
				</div>

				<!-- Illustration card -->
				<div class="bg-[#0D3B2E] rounded-2xl p-5 border border-[#2E7D32]/20 shadow-sm overflow-hidden relative">
					<div class="relative z-10">
						<span class="text-[11px] font-bold uppercase tracking-widest text-white/50">findMe</span>
						<p class="text-sm font-bold text-white mt-1 leading-tight">Adressage numérique officiel du Cameroun</p>
						<button
							@click="openCreateForm"
							:disabled="!canAddMore"
							class="mt-3 text-[11px] font-bold text-[#2E7D32] bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
						>
							Créer une adresse →
						</button>
					</div>
					<img
						src="/assets/images/votre_code_plaque_de_partage.png"
						alt="Illustration findMe"
						class="absolute right-0 bottom-0 w-24 h-24 object-contain opacity-30"
					/>
				</div>
			</div>

			<!-- Addresses section -->
			<div class="space-y-4" id="user-addresses-flow">
				<!-- Section header with view toggle -->
				<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
					<h2 class="text-base font-black text-gray-800 dark:text-white flex items-center gap-2">
						<MapPin class="w-4 h-4 text-[#2E7D32]" />
						Mes Adresses Actives
						<span class="text-xs font-bold text-gray-400 bg-gray-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
							{{ addressesList.length }}
						</span>
					</h2>
					<!-- Tab toggle -->
					<div class="flex items-center bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl p-1">
						<button
							@click="localTab = 'list'"
							class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all"
							:class="localTab === 'list' ? 'bg-[#1A237E] text-white' : 'text-gray-500 hover:text-gray-800'"
							id="tab-list"
						>
							<List class="w-3.5 h-3.5" />
							Liste
						</button>
						<button
							@click="localTab = 'map'"
							class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all"
							:class="localTab === 'map' ? 'bg-[#2E7D32] text-white' : 'text-gray-500 hover:text-gray-800'"
							id="tab-map"
						>
							<Map class="w-3.5 h-3.5" />
							Carte
						</button>
					</div>
				</div>

				<!-- Empty state -->
				<div
					v-if="addressesList.length === 0 && localTab === 'list'"
					class="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 p-12 text-center shadow-sm"
					id="empty-state-card"
				>
					<img
						src="/assets/images/localisation_du_domicile.png"
						alt="Aucune adresse"
						class="w-32 h-32 object-contain mx-auto mb-5 opacity-60"
					/>
					<h3 class="text-base font-black text-gray-700 dark:text-white mb-2">Aucune adresse enregistrée</h3>
					<p class="text-sm text-gray-400 max-w-sm mx-auto mb-5">
						Créez votre première adresse municipale findMe et obtenez votre code d'adressage officiel.
					</p>
					<button
						@click="openCreateForm"
						class="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-bold text-sm rounded-xl transition-all shadow-sm shadow-[#2E7D32]/30"
					>
						<Plus class="w-4 h-4" />
						Créer ma première adresse
					</button>
				</div>

				<!-- Address cards grid -->
				<div
					v-if="localTab === 'list' && addressesList.length > 0"
					class="grid grid-cols-1 lg:grid-cols-2 gap-5"
					id="addresses-cards-grid"
				>
					<div
						v-for="(addr, idx) in addressesList"
						:key="idx"
						class="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col group hover:shadow-md hover:border-[#2E7D32]/30 transition-all duration-200"
						:id="`user-addr-item-${idx}`"
					>
						<!-- Card image -->
						<div class="relative h-36 bg-gray-50 dark:bg-slate-950 overflow-hidden">
							<img
								v-if="addr.photoRaw"
								:src="addr.photoRaw"
								alt="Façade"
								class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
							/>
							<img
								v-else
								src="/assets/images/bastos_yaounde.jpg"
								alt="Localisation"
								class="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500"
							/>
							<!-- ID badge -->
							<div class="absolute top-2.5 left-2.5 bg-[#1A237E] text-white text-[9px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider">
								#{{ addressesList.length - idx }}
							</div>
							<!-- Code badge -->
							<div class="absolute top-2.5 right-2.5 bg-black/60 backdrop-blur-sm text-white text-[9px] font-mono font-black px-2.5 py-1 rounded-lg uppercase">
								{{ addr.addressCode }}
							</div>
							<!-- Photo stats -->
							<div
								v-if="addr.photoStats"
								class="absolute bottom-2 right-2 bg-[#2E7D32] text-white text-[9px] font-black px-2 py-0.5 rounded-lg"
							>
								{{ addr.photoStats.compressed }} (-{{ addr.photoStats.ratio }}%)
							</div>
						</div>

						<!-- Card body -->
						<div class="p-4 flex flex-col flex-1">
							<div class="flex-1">
								<span class="text-[9px] font-black uppercase tracking-widest text-gray-400">Propriétaire</span>
								<p class="text-sm font-black text-gray-800 dark:text-white mt-0.5">{{ addr.fullName }}</p>

								<div class="mt-3">
									<span class="text-[9px] font-black uppercase tracking-widest text-[#2E7D32]">Localisation</span>
									<h4 class="text-base font-black text-[#1A237E] dark:text-white leading-snug mt-0.5">
										{{ addr.housePlateNumber }}, {{ addr.neighborhood }}
									</h4>
									<p class="text-xs text-gray-500 mt-0.5">
										{{ addr.city }}, {{ addr.country || "Cameroun" }}
										{{ addr.postalCode ? `(CP: ${addr.postalCode})` : "" }}
									</p>
								</div>

								<!-- GPS -->
								<div class="grid grid-cols-2 gap-2 mt-3">
									<div class="bg-gray-50 dark:bg-slate-800 px-2.5 py-2 rounded-xl text-center">
										<span class="text-[8px] uppercase font-black text-gray-400 block">Latitude</span>
										<span class="text-[11px] font-mono font-bold text-[#1A237E] dark:text-sky-300">{{ addr.coordinates.lat }}° N</span>
									</div>
									<div class="bg-gray-50 dark:bg-slate-800 px-2.5 py-2 rounded-xl text-center">
										<span class="text-[8px] uppercase font-black text-gray-400 block">Longitude</span>
										<span class="text-[11px] font-mono font-bold text-[#1A237E] dark:text-sky-300">{{ addr.coordinates.lng }}° E</span>
									</div>
								</div>
							</div>

							<!-- Actions -->
							<div class="mt-4 pt-3 border-t border-gray-100 dark:border-slate-800 flex items-center gap-2">
								<button
									@click="openAddressDetails(idx)"
									class="flex-1 bg-[#1A237E] hover:bg-[#1A237E]/90 text-white text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-1 transition-colors"
								>
									<span>👁️</span> Détails
								</button>
								<button
									@click="downloadAddressPDF(addr)"
									class="flex-1 bg-[#2E7D32] hover:bg-[#2E7D32]/90 text-white text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-1 transition-colors"
								>
									<FileDown class="w-3.5 h-3.5" /> PDF
								</button>
								<button
									@click="openEditForm(idx)"
									class="flex-1 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-1 transition-colors"
								>
									<Edit class="w-3.5 h-3.5" /> Éditer
								</button>
								<button
									@click="handleShareLink(addr.addressCode)"
									class="p-2.5 border border-gray-200 dark:border-slate-700 hover:border-[#2E7D32] rounded-xl text-gray-500 hover:text-[#2E7D32] transition-all"
								>
									<Share2 class="w-3.5 h-3.5" />
								</button>
								<button
									@click="confirmDeleteAddress(idx)"
									class="p-2.5 border border-rose-200 hover:bg-rose-50 rounded-xl text-rose-400 hover:text-rose-600 transition-all"
								>
									<Trash2 class="w-3.5 h-3.5" />
								</button>
							</div>
						</div>
					</div>
				</div>

				<!-- Map view
				<GlobalCitizenMap
					v-if="localTab === 'map'"
					:addresses="addressesList"
					:isDark="true"
					@share="handleShareLink"
					@delete="confirmDeleteAddress"
					id="global-citizen-map-viewport"
				/> -->
			</div>
		</div>

		<!-- Delete confirmation dialog -->
		<Transition
			enter-active-class="transition-all duration-200 ease-out"
			enter-from-class="opacity-0 scale-95"
			enter-to-class="opacity-100 scale-100"
			leave-active-class="transition-all duration-150 ease-in"
			leave-from-class="opacity-100 scale-100"
			leave-to-class="opacity-0 scale-95"
		>
			<div
				v-if="showDeleteConfirm"
				class="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4"
				id="delete-confirm-overlay"
			>
				<div class="bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900/50 rounded-2xl p-6 max-w-sm w-full text-center shadow-2xl">
					<div class="w-14 h-14 rounded-2xl bg-rose-50 flex items-center justify-center mx-auto mb-4">
						<Trash class="w-7 h-7 text-rose-500 animate-bounce" />
					</div>
					<h3 class="text-base font-black text-gray-800 dark:text-white mb-2">Confirmer la suppression ?</h3>
					<p class="text-sm text-gray-500 dark:text-slate-400 leading-relaxed mb-5">
						Cette action est irréversible. L'adresse sera définitivement retirée de votre espace citoyen.
					</p>
					<div class="flex gap-3">
						<button
							@click="showDeleteConfirm = false"
							class="flex-1 py-2.5 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 text-gray-700 dark:text-slate-300 text-sm font-bold rounded-xl transition-colors cursor-pointer"
						>
							Annuler
						</button>
						<button
							@click="executeDeleteAddress"
							class="flex-1 py-2.5 bg-rose-500 hover:bg-rose-600 text-white text-sm font-bold rounded-xl transition-colors cursor-pointer"
						>
							Supprimer
						</button>
					</div>
				</div>
			</div>
		</Transition>
	</div>

	<!-- Auth fallback -->
	<div v-else class="min-h-screen flex items-center justify-center bg-gray-50">
		<div class="text-center">
			<p class="text-gray-400 font-semibold mb-4">Vous devez être connecté pour accéder à cet espace.</p>
			<button
				@click="navigateTo('/auth/signin')"
				class="px-5 py-2.5 bg-[#2E7D32] text-white font-bold rounded-xl"
			>
				Se connecter
			</button>
		</div>
	</div>
</template>
