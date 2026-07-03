<!--
  @file app/components/dashboard/AddressManager.vue
  @description Onglet "Mes Adresses" — affichage, création, modification et
  suppression des adresses de l'utilisateur avec design premium glassmorphism.
-->

<script setup lang="ts">
import {
	MapPin, Plus, Map, Share2, FileDown, Edit, Trash2, Trash,
	Check, X, ArrowLeft, ArrowRight, Locate, Upload, Camera, Sparkles, List,
} from "lucide-vue-next";
import ButtonUI from "~/components/ui/ButtonUI.vue";
import { useCitizenSpacePage } from "~/composables/useCitizenSpacePage";
import { useRouter } from "vue-router";
import { useAuth } from "~/composables/useAuth";
import { useToasts } from "~/composables/useToasts";

const {
	addressesList, MAX_ADDRESSES, canAddMore,
	downloadAddressPDF, confirmDeleteAddress, executeDeleteAddress, showDeleteConfirm,
	localTab, isFormOpen, formStep, editIndex, formState, formErrors,
	countries, availableCities, markerPos, handleMapClick, geolocateUser,
	handlePhotoUpload, openCreateForm, openEditForm, cancelForm, nextStep, prevStep, submitForm,
	draftsList, resumeDraft, deleteDraft,
} = useCitizenSpacePage();

const router = useRouter();
const { currentUser } = useAuth();
const { addToast } = useToasts();

const openAddressPage = (addr: any) => {
	router.push(`/users/${currentUser.value?.id || 'me'}/adresses/${addr.addressCode}`);
};

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
	<div class="flex-1 w-full animate-in fade-in slide-in-from-bottom-4 duration-700" id="address-manager-section">

		<!-- ════════════════════════════════════════════════════════ -->
		<!-- VUE LISTE : Affichage des adresses                     -->
		<!-- ════════════════════════════════════════════════════════ -->
		<div class="space-y-6">

			<!-- ── Banner Hero Glassmorphism ── -->
			<div class="relative bg-white/40 dark:bg-[#0A0D1A]/40 backdrop-blur-2xl rounded-[32px] border border-white/60 dark:border-slate-200 shadow-[0_8px_32px_rgba(0,0,0,0.04)] overflow-hidden group">
				<div class="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-teal-500/10 opacity-50" />
				<div class="absolute -right-20 -top-20 w-64 h-64 bg-emerald-400/20 blur-[80px] rounded-full transition-transform duration-700" />

				<div class="relative p-8 sm:p-10 flex flex-col-reverse sm:flex-row items-center sm:items-center justify-between gap-6 text-center sm:text-left z-10">
					<div class="flex-1 flex flex-col items-center sm:items-start">
						<p class="text-[10px] font-black text-emerald-600 dark:text-[#0f172b] uppercase tracking-widest mb-2 flex items-center gap-1.5">
							<Sparkles class="w-3 h-3" /> Bienvenue sur FindMe
						</p>
						<h1 class="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 leading-tight mb-3">
							Votre monde est désormais<br>
							<span class="bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-teal-500">parfaitement localisé.</span>
						</h1>
						<p class="text-[15px] text-slate-600 dark:text-slate-600 mb-6 leading-relaxed max-w-sm mx-auto sm:mx-0">
							Gérez vos points d'intérêt avec une précision millimétrique. Créez des codes digitaux uniques pour votre domicile, lieu de travail ou commerces.
						</p>
						<div class="flex flex-wrap justify-center sm:justify-start gap-4">
							<ButtonUI @click="openCreateForm" variant="primary" size="md" class="shadow-lg shadow-emerald-500/20">
								Créer une adresse
							</ButtonUI>
							<ButtonUI variant="outline" size="md" class="border-white/40 dark:border-slate-300 bg-white/50 dark:bg-slate-50 backdrop-blur-sm">
								En savoir plus
							</ButtonUI>
						</div>
					</div>
					<!-- Illustration -->
					<div class="shrink-0 relative w-36 h-36 flex items-center justify-center transition-transform duration-500">
						<div class="absolute inset-0 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-3xl opacity-20 blur-xl animate-pulse-slow" />
						<div class="relative w-full h-full bg-white/50 dark:bg-slate-50 backdrop-blur-xl border border-white/60 dark:border-slate-300 rounded-3xl flex items-center justify-center shadow-xl">
							<MapPin class="w-16 h-16 text-emerald-500 drop-shadow-md" />
						</div>
					</div>
				</div>
			</div>

			<!-- ── Barre de filtres + Actions ── -->
			<div class="flex items-center justify-between flex-wrap gap-4 bg-white/40 dark:bg-[#0A0D1A]/40 backdrop-blur-xl p-3 rounded-2xl border border-white/60 dark:border-slate-200 shadow-sm">
				<!-- Filtres catégories -->
				<div class="flex items-center gap-2">
					<button
						v-for="f in filters"
						:key="f.key"
						@click="activeFilter = f.key"
						class="px-5 py-2 rounded-xl text-[13px] font-black transition-all duration-300"
						:class="activeFilter === f.key
							? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-500/20'
							: 'text-slate-500 dark:text-slate-600 hover:bg-white/60 dark:hover:bg-slate-800/60 hover:text-slate-800 dark:hover:text-white'"
					>
						{{ f.label }}
					</button>
				</div>

				<div class="flex items-center gap-4">
					<!-- Toggle vue -->
					<div class="flex items-center bg-white/60 dark:bg-white p-1 rounded-xl shadow-inner border border-white/40 dark:border-slate-200">
						<button @click="localTab = 'list'" class="p-2 rounded-lg transition-all duration-300" :class="localTab === 'list' ? 'bg-white dark:bg-slate-50 shadow-sm text-emerald-600 dark:text-[#0f172b]' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'">
							<List class="w-4 h-4" />
						</button>
						<button @click="localTab = 'map'" class="p-2 rounded-lg transition-all duration-300" :class="localTab === 'map' ? 'bg-white dark:bg-slate-50 shadow-sm text-emerald-600 dark:text-[#0f172b]' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'">
							<Map class="w-4 h-4" />
						</button>
					</div>
				</div>
			</div>

			<!-- ── Contenu Principal ── -->
			<ClientOnly>
				<div v-if="localTab === 'list'" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

					<!-- Cartes Publiées -->
					<template v-if="activeFilter === 'published'">
						<div v-for="(addr, idx) in addressesList" :key="idx"
							class="relative bg-white/40 dark:bg-[#0A0D1A]/40 backdrop-blur-2xl rounded-[32px] border border-white/60 dark:border-slate-200 shadow-[0_8px_24px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_40px_rgba(16,185,129,0.1)] overflow-hidden group transition-all duration-500"
						>
							<div class="absolute inset-0 bg-gradient-to-b from-white/60 to-transparent dark:from-white/5 pointer-events-none mix-blend-overlay z-10" />
							
							<!-- Image -->
							<div class="h-40 relative overflow-hidden bg-slate-100 dark:bg-white">
								<img v-if="addr.photoRaw" :src="addr.photoRaw" class="w-full h-full object-cover transition-transform duration-700" />
								<div v-else class="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
									<MapPin class="w-12 h-12 text-slate-300 dark:text-slate-600 drop-shadow-sm" />
								</div>
								<div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>
								
								<div class="absolute top-4 left-4 z-20">
									<div class="px-2.5 py-1 bg-emerald-500/90 backdrop-blur-md border border-emerald-400/30 text-white text-[10px] font-black uppercase tracking-widest rounded-lg shadow-lg">
										PUBLIÉ
									</div>
								</div>
							</div>

							<!-- Corps -->
							<div class="p-6 relative z-20 bg-white/60 dark:bg-white backdrop-blur-md">
								<div class="flex items-center gap-3 mb-2">
									<div class="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center shrink-0 shadow-md">
										<MapPin class="w-4 h-4 text-white drop-shadow-sm" />
									</div>
									<h4 class="text-base font-black text-slate-800 dark:text-[#0f172b] truncate">
										{{ addr.neighborhood }}, {{ addr.city }}
									</h4>
								</div>
								<p class="text-[13px] font-medium text-slate-500 dark:text-slate-600 mb-4 leading-snug pl-11 truncate">
									{{ addr.streetName }}, {{ addr.housePlateNumber }}
								</p>

								<!-- Code digital -->
								<div class="flex items-center justify-between bg-white/50 dark:bg-slate-50 backdrop-blur-sm border border-white/60 dark:border-slate-300 rounded-2xl px-4 py-3 mb-4 cursor-pointer hover:border-emerald-500/50 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/20 transition-all group/code shadow-inner">
									<div @click="copyAddressCode(addr.addressCode)" class="flex-1">
										<p class="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest group-hover/code:text-emerald-600 dark:group-hover/code:text-emerald-400 transition-colors mb-0.5">Code Digital</p>
										<p class="text-lg font-mono font-black text-slate-800 dark:text-[#0f172b] group-hover/code:text-emerald-600 dark:group-hover/code:text-emerald-400 transition-colors tracking-wider">{{ addr.addressCode }}</p>
									</div>
									<button @click="openAddressPage(addr)" class="w-8 h-8 rounded-xl bg-white/60 dark:bg-slate-700/60 border border-white/40 dark:border-slate-600/50 text-slate-500 hover:text-emerald-600 hover:border-emerald-500/30 hover:bg-emerald-50 flex items-center justify-center transition-all shadow-sm">
										<Edit class="w-4 h-4" />
									</button>
								</div>

								<div class="flex items-center gap-2">
									<ButtonUI @click="openAddressPage(addr)" variant="primary" size="sm" class="flex-1 text-[12px] shadow-md shadow-emerald-500/20 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 border-none">
										Détails
									</ButtonUI>
									<ButtonUI @click="downloadAddressPDF(addr)" variant="outline" size="sm" :icon="FileDown" class="w-10 px-0 bg-white/50 dark:bg-slate-50 border-white/60 dark:border-slate-300 text-slate-600 dark:text-slate-700" />
									<ButtonUI @click="confirmDeleteAddress(idx)" variant="outline" size="sm" :icon="Trash2" class="w-10 px-0 bg-white/50 dark:bg-slate-50 border-rose-200 dark:border-rose-900/50 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20" />
								</div>
							</div>
						</div>
					</template>

					<!-- Cartes Brouillons -->
					<template v-if="activeFilter === 'draft'">
						<div v-for="(draft, idx) in draftsList" :key="idx"
							class="relative bg-white/40 dark:bg-[#0A0D1A]/40 backdrop-blur-2xl rounded-[32px] border border-white/60 dark:border-slate-200 shadow-sm hover:shadow-lg overflow-hidden group transition-all duration-500"
						>
							<div class="h-40 relative overflow-hidden bg-slate-100 dark:bg-white">
								<img v-if="draft.form?.photo" :src="draft.form.photo" class="w-full h-full object-cover transition-transform duration-700 opacity-50 grayscale" />
								<div v-else class="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
									<Edit class="w-12 h-12 text-slate-300 dark:text-slate-600 drop-shadow-sm" />
								</div>
								
								<div class="absolute top-4 left-4 z-20">
									<div class="px-2.5 py-1 bg-amber-500/90 backdrop-blur-md border border-amber-400/30 text-white text-[10px] font-black uppercase tracking-widest rounded-lg shadow-lg">
										BROUILLON (Étape {{ draft.step }})
									</div>
								</div>
							</div>

							<div class="p-6 relative z-20 bg-white/60 dark:bg-white backdrop-blur-md">
								<div class="flex items-center gap-3 mb-2">
									<div class="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shrink-0 shadow-md">
										<Edit class="w-4 h-4 text-white drop-shadow-sm" />
									</div>
									<h4 class="text-base font-black text-slate-800 dark:text-[#0f172b] truncate">
										{{ draft.form.neighborhood || "En attente" }}, {{ draft.form.city || "-" }}
									</h4>
								</div>
								<p class="text-[13px] font-medium text-slate-500 dark:text-slate-600 mb-6 pl-11 truncate">
									{{ draft.form.street || "Configuration non terminée" }}
								</p>

								<div class="flex items-center gap-2">
									<ButtonUI @click="resumeDraft(draft.id)" variant="primary" size="sm" class="flex-1 text-[12px] shadow-md shadow-amber-500/20 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 border-none">
										Reprendre
									</ButtonUI>
									<ButtonUI @click="deleteDraft(draft.id)" variant="outline" size="sm" :icon="Trash2" class="w-10 px-0 bg-white/50 dark:bg-slate-50 border-rose-200 dark:border-rose-900/50 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20" />
								</div>
							</div>
						</div>
					</template>

					<!-- Bouton Créer (Add Card) -->
					<button
						@click="openCreateForm"
						class="bg-white/30 dark:bg-white backdrop-blur-md rounded-[32px] border-2 border-dashed border-slate-300 dark:border-slate-300 hover:border-emerald-500 hover:bg-emerald-50/30 dark:hover:bg-emerald-900/20 flex flex-col items-center justify-center gap-4 p-8 transition-all duration-300 group min-h-[300px]"
					>
						<div class="w-16 h-16 bg-white/60 dark:bg-slate-50 backdrop-blur-sm group-hover:bg-emerald-500 shadow-sm group-hover:shadow-lg group-hover:shadow-emerald-500/30 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:rotate-6">
							<MapPin class="w-8 h-8 text-slate-400 dark:text-slate-500 group-hover:text-white transition-colors" />
						</div>
						<div class="text-center">
							<p class="text-base font-black text-slate-600 dark:text-slate-600 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">Nouvelle adresse</p>
							<p class="text-[13px] font-medium text-slate-500 dark:text-slate-500 mt-1 px-4">Enregistrez un nouveau lieu pour obtenir un code digital.</p>
						</div>
					</button>

				</div>

				<!-- ── Vue Carte Globale ── -->
				<div v-else-if="localTab === 'map'" class="w-full h-[600px] bg-slate-100 dark:bg-white rounded-[32px] overflow-hidden relative border border-white/60 dark:border-slate-200 shadow-lg">
					<div id="leaflet-global-map" class="w-full h-full z-0"></div>
				</div>

				<!-- ── État vide (Adresses publiées) ── -->
				<div v-if="activeFilter === 'published' && addressesList.length === 0" class="relative bg-white/40 dark:bg-[#0A0D1A]/40 backdrop-blur-2xl rounded-[32px] border border-white/60 dark:border-slate-200 p-16 text-center shadow-[0_8px_32px_rgba(0,0,0,0.04)] overflow-hidden">
					<div class="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent pointer-events-none" />
					<div class="relative w-28 h-28 mx-auto mb-8 group">
						<div class="absolute inset-0 bg-emerald-500/20 rounded-full blur-2xl animate-pulse" />
						<div class="relative w-full h-full bg-white/60 dark:bg-slate-50 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/40 dark:border-slate-300 shadow-xl transition-transform duration-500">
							<MapPin class="w-12 h-12 text-slate-400" />
						</div>
					</div>
					<h3 class="text-2xl font-black text-slate-800 dark:text-[#0f172b] mb-3">Aucune adresse enregistrée</h3>
					<p class="text-[15px] font-medium text-slate-500 dark:text-slate-600 mb-8 max-w-sm mx-auto">
						Créez votre première adresse pour générer votre plaque digitale FindMe.
					</p>
					<ButtonUI @click="openCreateForm" variant="primary" size="lg" :icon="Plus" class="shadow-xl shadow-emerald-500/25 px-8">
						Créer ma première adresse
					</ButtonUI>
				</div>

				<!-- ── État vide (Brouillons) ── -->
				<div v-if="activeFilter === 'draft' && draftsList.length === 0" class="bg-white/40 dark:bg-[#0A0D1A]/40 backdrop-blur-2xl rounded-[32px] border border-white/60 dark:border-slate-200 p-16 text-center shadow-sm">
					<div class="w-24 h-24 bg-white/60 dark:bg-slate-50 backdrop-blur-md rounded-3xl flex items-center justify-center mx-auto mb-6 border border-white/40 dark:border-slate-300 shadow-md">
						<Edit class="w-10 h-10 text-slate-400" />
					</div>
					<h3 class="text-xl font-black text-slate-800 dark:text-[#0f172b] mb-2">Aucun brouillon</h3>
					<p class="text-[15px] font-medium text-slate-500 dark:text-slate-600 mb-6 max-w-sm mx-auto">
						Vous n'avez pas de création d'adresse en attente de finalisation.
					</p>
				</div>
			
				<template #fallback>
					<div class="w-full h-64 flex items-center justify-center">
						<div class="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin"></div>
					</div>
				</template>
			</ClientOnly>
		</div>

		<!-- ════════════════════════════════════════════════════════ -->
		<!-- MODALE DE CONFIRMATION DE SUPPRESSION                  -->
		<!-- ════════════════════════════════════════════════════════ -->
		<Transition
			enter-active-class="transition-all duration-300 ease-out"
			enter-from-class="opacity-0"
			enter-to-class="opacity-100"
			leave-active-class="transition-all duration-300 ease-in"
			leave-from-class="opacity-100"
			leave-to-class="opacity-0"
		>
			<div v-if="showDeleteConfirm" class="fixed inset-0 z-[100] bg-slate-900/40 dark:bg-black/60 backdrop-blur-md flex items-center justify-center p-4" @click.self="closeDeleteModal">
				<div class="bg-white/80 dark:bg-white backdrop-blur-2xl border border-white/60 dark:border-slate-200 rounded-[32px] p-8 max-w-sm w-full text-center shadow-[0_16px_64px_rgba(0,0,0,0.1)]">
					<div class="w-20 h-20 rounded-full bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center mx-auto mb-6 shadow-inner">
						<Trash class="w-10 h-10 text-rose-500 animate-bounce" />
					</div>
					<h3 class="text-xl font-black text-slate-800 dark:text-[#0f172b] mb-3 tracking-tight">Supprimer l'adresse ?</h3>
					<p class="text-[14px] font-medium text-slate-500 dark:text-slate-600 leading-relaxed mb-8">
						Cette action est irréversible. L'adresse et son code unique seront définitivement supprimés.
					</p>
					<div class="flex gap-4">
						<ButtonUI @click="closeDeleteModal" variant="outline" class="flex-1 bg-white/50 dark:bg-slate-50 border-white/60 dark:border-slate-300 text-slate-600 dark:text-slate-700">Annuler</ButtonUI>
						<ButtonUI @click="executeDeleteAddress" variant="danger" class="flex-1 shadow-lg shadow-rose-500/20" :icon="Trash2">Supprimer</ButtonUI>
					</div>
				</div>
			</div>
		</Transition>

	</div>
</template>

<style scoped>
.animate-pulse-slow {
	animation: pulseBg 6s ease-in-out infinite;
}
@keyframes pulseBg {
	0%, 100% { opacity: 0.2; }
	50% { opacity: 0.4; }
}
</style>
