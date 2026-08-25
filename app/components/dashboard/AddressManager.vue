<!--
  @file app/components/dashboard/AddressManager.vue
  @description Onglet "Mes Adresses" — affichage, création, modification et
  suppression des adresses de l'utilisateur avec design glassmorphism à ton uni émeraude et squelettes (SkeletonUI).
-->

<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import {
	MapPin, Plus, Map, Share2, FileDown, Edit, Trash2, Trash,
	Check, X, ArrowLeft, ArrowRight, Locate, Upload, Camera, Sparkles, List,
} from "lucide-vue-next";
import ButtonUI from "~/components/ui/ButtonUI.vue";
import SkeletonUI from "~/components/ui/SkeletonUI.vue";
import { useCitizenSpacePage } from "~/composables/useCitizenSpacePage";
import { useRouter, useRoute } from "vue-router";
import { useAuth } from "~/composables/useAuth";
import { useToasts } from "~/composables/useToasts";

const {
	addressesList, isLoadingAddresses, fetchAddresses, MAX_ADDRESSES, canAddMore,
	downloadAddressPDF, confirmDeleteAddress, executeDeleteAddress, showDeleteConfirm,
	localTab, isFormOpen, formStep, editIndex, formState, formErrors,
	countries, availableCities, markerPos, handleMapClick, geolocateUser,
	handlePhotoUpload, openCreateForm, openEditForm, cancelForm, nextStep, prevStep, submitForm,
	draftsList, resumeDraft, deleteDraft,
} = useCitizenSpacePage();

const router = useRouter();
const route = useRoute();
const { currentUser } = useAuth();
const { addToast } = useToasts();

const openAddressPage = (addr: any) => {
	const targetId = currentUser.value?.id || route.params.id || 1;
	router.push(`/users/${targetId}/adresses/${addr.addressCode}`);
};

const handleCreateClick = () => {
	const targetId = currentUser.value?.id || route.params.id || 1;
	navigateTo(`/users/${targetId}/adresses/create`);
};

onMounted(async () => {
	await fetchAddresses();
});

const stepLabels = ["Localisation", "Détails", "Photo & Recap"];
const activeFilter = ref<"published" | "draft">("published");

const filters = [
	{ key: "published", label: "Publié" },
	{ key: "draft", label: "Brouillon" },
] as const;

const copyAddressCode = (code: string) => {
	if (navigator.clipboard) {
		navigator.clipboard.writeText(code);
		addToast("📋 Code digital copié dans le presse-papier !", "success");
	}
};

const initGlobalMap = async () => {
	if (typeof window !== 'undefined') {
		const L = (await import('leaflet')).default;
		const mapEl = document.getElementById('leaflet-global-map');
		if (!mapEl) return;
		
		const map = L.map('leaflet-global-map').setView([3.848, 11.5021], 6);
		
		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			maxZoom: 19,
			attribution: '© OpenStreetMap'
		}).addTo(map);
		
		const icon = L.icon({
			iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
			shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
			iconSize: [25, 41],
			iconAnchor: [12, 41]
		});
		
		let bounds = L.latLngBounds([]);
		let hasValidMarkers = false;
		
		addressesList.value.forEach(addr => {
			if (addr.coordinates?.lat && addr.coordinates?.lng) {
				hasValidMarkers = true;
				L.marker([addr.coordinates.lat, addr.coordinates.lng], { icon }).addTo(map)
				 .bindPopup(`<b>${addr.addressCode}</b><br>${addr.neighborhood}`);
				bounds.extend([addr.coordinates.lat, addr.coordinates.lng]);
			}
		});
		
		if (hasValidMarkers) {
			map.fitBounds(bounds, { padding: [50, 50] });
		}
		
		setTimeout(() => map.invalidateSize(), 100);
	}
};

watch(localTab, (newVal) => {
	if (newVal === 'map') {
		setTimeout(() => {
			initGlobalMap();
		}, 100);
	}
});

const closeDeleteModal = () => { showDeleteConfirm.value = false; };
</script>

<template>
	<div class="flex-1 w-full animate-in fade-in slide-in-from-bottom-4 duration-700 text-slate-900 dark:text-white" id="address-manager-section">

		<!-- VUE LISTE : Affichage des adresses -->
		<div class="space-y-6">

			<!-- Banner Hero Glassmorphism Ton Uni -->
			<div class="relative bg-white/80 dark:bg-[#0A0D1A]/80 backdrop-blur-2xl rounded-[32px] border border-slate-200/80 dark:border-slate-800 shadow-xl overflow-hidden group">
				<div class="relative p-8 sm:p-10 flex flex-col-reverse sm:flex-row items-center sm:items-center justify-between gap-6 text-center sm:text-left z-10">
					<div class="flex-1 flex flex-col items-center sm:items-start">
						<p class="text-[10px] font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-widest mb-2 flex items-center gap-1.5 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
							<Sparkles class="w-3 h-3" /> Espace Adressage Certifié
						</p>
						<h1 class="text-3xl md:text-4xl font-black font-serif text-slate-900 dark:text-white leading-tight mb-3">
							Votre monde est désormais<br>
							<span class="text-emerald-600 dark:text-emerald-400">parfaitement localisé.</span>
						</h1>
						<p class="text-[15px] font-medium text-slate-600 dark:text-slate-300 mb-6 leading-relaxed max-w-sm mx-auto sm:mx-0">
							Gérez vos adresses avec une précision millimétrique. Créez des codes digitaux uniques pour votre domicile, travail ou commerce.
						</p>
						<div class="flex flex-wrap justify-center sm:justify-start gap-4">
							<ButtonUI @click="handleCreateClick" variant="primary" size="md" class="bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 cursor-pointer">
								Créer une adresse
							</ButtonUI>
						</div>
					</div>

					<div class="shrink-0 relative w-32 h-32 flex items-center justify-center">
						<div class="relative w-full h-full bg-emerald-600 rounded-3xl flex items-center justify-center shadow-lg shadow-emerald-600/20">
							<MapPin class="w-14 h-14 text-white drop-shadow-sm" />
						</div>
					</div>
				</div>
			</div>

			<!-- Barre de filtres + Actions -->
			<div class="flex items-center justify-between flex-wrap gap-4 bg-white/80 dark:bg-[#0A0D1A]/80 backdrop-blur-xl p-3 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-md">
				<div class="flex items-center gap-2">
					<button
						v-for="f in filters"
						:key="f.key"
						@click="activeFilter = f.key"
						class="px-5 py-2 rounded-xl text-[13px] font-black transition-all duration-300 cursor-pointer"
						:class="activeFilter === f.key
							? 'bg-emerald-600 text-white shadow-sm'
							: 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'"
					>
						{{ f.label }}
					</button>
				</div>

				<div class="flex items-center gap-4">
					<div class="flex items-center bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200/80 dark:border-slate-800">
						<button @click="localTab = 'list'" class="p-2 rounded-lg transition-all duration-300 cursor-pointer" :class="localTab === 'list' ? 'bg-white dark:bg-slate-800 shadow-xs text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'">
							<List class="w-4 h-4" />
						</button>
						<button @click="localTab = 'map'" class="p-2 rounded-lg transition-all duration-300 cursor-pointer" :class="localTab === 'map' ? 'bg-white dark:bg-slate-800 shadow-xs text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'">
							<Map class="w-4 h-4" />
						</button>
					</div>
				</div>
			</div>

			<!-- Contenu Principal -->
			<ClientOnly>
				<!-- Etat SKELETON pour le chargement des adresses -->
				<div v-if="isLoadingAddresses" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
					<div v-for="n in 3" :key="n" class="bg-white/80 dark:bg-[#0A0D1A]/80 backdrop-blur-2xl rounded-[32px] border border-slate-200/80 dark:border-slate-800 shadow-xl overflow-hidden p-6 space-y-4">
						<SkeletonUI height="h-40" rounded="rounded-2xl" />
						<div class="space-y-2">
							<SkeletonUI width="w-48" height="h-5" />
							<SkeletonUI width="w-32" height="h-4" />
						</div>
						<SkeletonUI height="h-12" rounded="rounded-2xl" />
						<div class="flex gap-2">
							<SkeletonUI class="flex-1" height="h-10" rounded="rounded-full" />
							<SkeletonUI class="flex-1" height="h-10" rounded="rounded-full" />
						</div>
					</div>
				</div>

				<div v-else-if="localTab === 'list'" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

					<!-- Cartes Publiées -->
					<template v-if="activeFilter === 'published'">
						<div v-for="(addr, idx) in addressesList" :key="idx"
							class="relative bg-white/80 dark:bg-[#0A0D1A]/80 backdrop-blur-2xl rounded-[32px] border border-slate-200/80 dark:border-slate-800 shadow-xl hover:border-emerald-500/50 overflow-hidden group transition-all duration-300"
						>
							<div class="h-40 relative overflow-hidden bg-slate-100 dark:bg-slate-900">
								<img v-if="addr.photoRaw" :src="addr.photoRaw" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
								<div v-else class="w-full h-full flex items-center justify-center bg-slate-100 dark:bg-slate-900">
									<MapPin class="w-12 h-12 text-slate-300 dark:text-slate-700" />
								</div>
								
								<div class="absolute top-4 left-4 z-20">
									<div class="px-2.5 py-1 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest rounded-lg shadow-md">
										PUBLIÉ
									</div>
								</div>
							</div>

							<div class="p-6 relative z-20">
								<div class="flex items-center gap-3 mb-2">
									<div class="w-8 h-8 bg-emerald-600 rounded-xl flex items-center justify-center shrink-0 shadow-xs">
										<MapPin class="w-4 h-4 text-white" />
									</div>
									<h4 class="text-base font-black text-slate-900 dark:text-white truncate">
										{{ addr.neighborhood }}, {{ addr.city }}
									</h4>
								</div>
								<p class="text-[13px] font-medium text-slate-600 dark:text-slate-300 mb-4 leading-snug pl-11 truncate">
									{{ addr.streetName }}, {{ addr.housePlateNumber }}
								</p>

								<div class="flex items-center justify-between bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl px-4 py-3 mb-4 cursor-pointer hover:border-emerald-500/40 transition-all group/code">
									<div @click="copyAddressCode(addr.addressCode)" class="flex-1">
										<p class="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest group-hover/code:text-emerald-600 dark:group-hover/code:text-emerald-400 transition-colors mb-0.5">Code Digital</p>
										<p class="text-base font-black font-mono text-emerald-700 dark:text-emerald-400 tracking-wider">
											{{ addr.addressCode }}
										</p>
									</div>
								</div>

								<div class="flex gap-2">
									<ButtonUI @click="openAddressPage(addr)" variant="primary" size="sm" class="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full">
										Consulter
									</ButtonUI>
									<ButtonUI @click="downloadAddressPDF(addr)" variant="outline" size="sm" :icon="FileDown" class="border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 rounded-full" />
								</div>
							</div>
						</div>

						<div v-if="addressesList.length === 0" class="col-span-full py-16 text-center bg-white/80 dark:bg-[#0A0D1A]/80 backdrop-blur-2xl rounded-[32px] border border-slate-200/80 dark:border-slate-800">
							<MapPin class="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
							<p class="text-base font-bold text-slate-500 dark:text-slate-400 mb-4">Vous n'avez pas encore d'adresses publiées.</p>
							<ButtonUI @click="handleCreateClick" variant="primary" class="bg-emerald-600 hover:bg-emerald-700 text-white">
								Créer ma première adresse
							</ButtonUI>
						</div>
					</template>

					<!-- Cartes Brouillons -->
					<template v-else>
						<div v-for="(draft, idx) in draftsList" :key="idx"
							class="relative bg-white/80 dark:bg-[#0A0D1A]/80 backdrop-blur-2xl rounded-[32px] border border-slate-200/80 dark:border-slate-800 shadow-xl overflow-hidden p-6"
						>
							<div class="flex items-center justify-between mb-4">
								<span class="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-black uppercase tracking-widest rounded-lg">BROUILLON</span>
								<button @click="deleteDraft(idx)" class="text-rose-500 hover:text-rose-700 p-1 cursor-pointer">
									<Trash2 class="w-4 h-4" />
								</button>
							</div>
							<h4 class="text-base font-black text-slate-900 dark:text-white mb-1">{{ draft.neighborhood || 'Brouillon sans nom' }}</h4>
							<p class="text-xs text-slate-500 dark:text-slate-400 mb-6">{{ draft.city }} · Étape {{ draft.step }}/3</p>
							<ButtonUI @click="resumeDraft(idx)" variant="primary" size="sm" class="w-full bg-slate-900 text-white rounded-full">
								Reprendre la création
							</ButtonUI>
						</div>

						<div v-if="draftsList.length === 0" class="col-span-full py-16 text-center bg-white/80 dark:bg-[#0A0D1A]/80 backdrop-blur-2xl rounded-[32px] border border-slate-200/80 dark:border-slate-800">
							<p class="text-base font-bold text-slate-500 dark:text-slate-400">Aucun brouillon en cours.</p>
						</div>
					</template>

				</div>

				<!-- Vue Carte globale -->
				<div v-else-if="localTab === 'map'" class="bg-white/80 dark:bg-[#0A0D1A]/80 backdrop-blur-2xl rounded-[32px] border border-slate-200/80 dark:border-slate-800 shadow-xl overflow-hidden p-4">
					<div id="leaflet-global-map" class="w-full h-[550px] rounded-2xl"></div>
				</div>
			</ClientOnly>

		</div>

	</div>
</template>
