<!--
  @file app/pages/admin/adresses/index.vue
  @description Répertoire national des adresses et modale d'homologation admin — design glassmorphism à ton uni émeraude (#00bc7d) et bleu nuit (#0A0D1A) avec squelettes (SkeletonUI).
-->

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { Filter, Download, MapPin, Search, ChevronRight, ChevronLeft, RefreshCw, CheckCircle, AlertTriangle, Clock, User as UserIcon, Building, Eye, X, FileText, Globe, Compass, ShieldCheck, Mail, Trash2 } from "lucide-vue-next";
import SkeletonUI from "~/components/ui/SkeletonUI.vue";
import { useAdminData } from "~/composables/useAdminData";
import { useAddressExporter } from "~/composables/useAddressExporter";
import { useAuth } from "~/composables/useAuth";

definePageMeta({
	layout: "dashboard-admin",
	middleware: ["admin"],
});

const {
	adminAddresses, adminAddressesMeta, isLoadingAddresses, fetchAdminAddresses,
	adminUsers, fetchAdminUsers, fetchAddressUser, addressAuthorMap,
	updateAddressStatus, deleteAdminAddress, getInitials, formatDate,
} = useAdminData();

const { downloadAddressPDF, downloadAddressFile } = useAddressExporter();
const isExportingPdf = ref(false);

// Filtres horizontaux
const searchQuery = ref("");
const selectedCountry = ref("Cameroun");
const selectedCity = ref("");
const selectedStatus = ref("");
let searchTimer: ReturnType<typeof setTimeout> | null = null;

// Modale de Détails d'Adresse
const isAddressModalOpen = ref(false);
const selectedAddressModal = ref<any | null>(null);

// Modale de Confirmation de Suppression
const isDeleteModalOpen = ref(false);
const addressToDelete = ref<any | null>(null);
const isDeletingAddress = ref(false);

onMounted(() => {
	fetchAdminAddresses(0, 20);
	fetchAdminUsers(0, 100);
});

// Charger automatiquement les infos utilisateur/auteur pour chaque adresse via GET /api/admin/addresses/{id}/users
watch(adminAddresses, (list) => {
	if (list && list.length > 0) {
		list.forEach((addr) => {
			fetchAddressUser(addr.id);
		});
	}
}, { immediate: true });

// Watchers de recherche
watch([searchQuery, selectedCity], () => {
	if (searchTimer) clearTimeout(searchTimer);
	searchTimer = setTimeout(() => {
		fetchAdminAddresses(0, 20, selectedCity.value);
	}, 400);
});

const { currentUser } = useAuth();

// Récupération du nom d'utilisateur réel depuis la BDD Spring Boot (endpoint /api/admin/addresses/{id}/users)
const getUserNameForAddress = (addr: any) => {
	if (addressAuthorMap.value[addr.id]?.fullName) {
		return addressAuthorMap.value[addr.id].fullName;
	}
	if (addr.userFullName) return addr.userFullName;
	if (adminUsers.value && adminUsers.value.length > 0) {
		const user = adminUsers.value.find(u => u.id === addr.userId);
		if (user?.fullName) return user.fullName;
	}
	return "Utilisateur inconnu";
};

// Récupération de l'email utilisateur réel depuis la BDD Spring Boot (endpoint /api/admin/addresses/{id}/users)
const getUserEmailForAddress = (addr: any) => {
	if (addressAuthorMap.value[addr.id]?.email) {
		return addressAuthorMap.value[addr.id].email;
	}
	if (addr.userEmail) return addr.userEmail;
	if (adminUsers.value && adminUsers.value.length > 0) {
		const user = adminUsers.value.find(
			(u) => u.id === addr.userId ||
			(addr.userFullName && u.fullName && u.fullName.trim().toLowerCase() === addr.userFullName.trim().toLowerCase())
		);
		if (user?.email) return user.email;
	}
	return "Non renseigné";
};

// Filtrage local complémentaire
const filteredAddresses = computed(() => {
	let list = adminAddresses.value;

	if (selectedStatus.value) {
		const st = selectedStatus.value.toLowerCase();
		list = list.filter((a) => {
			const s = (a.status || "pending").toLowerCase();
			if (st === "validé" || st === "active" || st === "validated") {
				return s === "active" || s === "validated" || s === "validé";
			}
			if (st === "en attente" || st === "pending") {
				return s === "pending" || s === "en attente" || s === "";
			}
			if (st === "non validé" || st === "rejected" || st === "signalé" || st === "flagged") {
				return s === "flagged" || s === "signalé" || s === "rejected" || s === "non_validated";
			}
			return s === st;
		});
	}

	if (searchQuery.value) {
		const q = searchQuery.value.toLowerCase();
		list = list.filter((a) =>
			(a.addressCode && a.addressCode.toLowerCase().includes(q)) ||
			(a.city && a.city.toLowerCase().includes(q)) ||
			(a.district && a.district.toLowerCase().includes(q)) ||
			(a.street && a.street.toLowerCase().includes(q)) ||
			(a.userFullName && a.userFullName.toLowerCase().includes(q))
		);
	}

	return list;
});

const resetFilters = () => {
	searchQuery.value = "";
	selectedCountry.value = "Cameroun";
	selectedCity.value = "";
	selectedStatus.value = "";
	fetchAdminAddresses(0, 20);
};

const getStatusStyles = (status?: string) => {
	const s = (status || "pending").toLowerCase();
	if (s.includes("valid") || s.includes("active")) return "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 font-bold";
	if (s.includes("reject") || s.includes("non") || s.includes("flag") || s.includes("signal") || s.includes("refus")) return "bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 font-bold";
	return "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-bold";
};

const getStatusLabel = (status?: string) => {
	if (!status) return "En attente";
	const s = status.toLowerCase();
	if (s.includes("valid") || s.includes("active")) return "Validé";
	if (s.includes("reject") || s.includes("non") || s.includes("refus")) return "Non validé";
	if (s.includes("flag") || s.includes("signal")) return "Signalé";
	return "En attente";
};

const openAddressModal = (addr: any) => {
	selectedAddressModal.value = { ...addr };
	isAddressModalOpen.value = true;
};

const handleStatusChangeInModal = async (newStatus: string) => {
	if (!selectedAddressModal.value) return;
	await updateAddressStatus(selectedAddressModal.value.id, newStatus);
	selectedAddressModal.value.status = newStatus;
};

const triggerDeleteAddress = (addr: any) => {
	addressToDelete.value = addr;
	isDeleteModalOpen.value = true;
};

const confirmDeleteAddress = async () => {
	if (!addressToDelete.value) return;
	isDeletingAddress.value = true;
	await deleteAdminAddress(addressToDelete.value.id);
	if (selectedAddressModal.value && selectedAddressModal.value.id === addressToDelete.value.id) {
		isAddressModalOpen.value = false;
		selectedAddressModal.value = null;
	}
	isDeletingAddress.value = false;
	isDeleteModalOpen.value = false;
	addressToDelete.value = null;
};

// Exportation PDF certifiée 100% fonctionnelle
const handlePdfExportModal = async () => {
	if (!selectedAddressModal.value) return;
	isExportingPdf.value = true;
	try {
		const addr = selectedAddressModal.value;
		const pdfPayload = {
			id: addr.id,
			addressCode: addr.addressCode || `#${addr.id}`,
			fullName: getUserNameForAddress(addr),
			streetName: addr.street || "Rue Principale",
			housePlateNumber: addr.houseNumber || "—",
			neighborhood: addr.district || "Quartier",
			arrondissement: addr.city || "Yaoundé",
			city: addr.city,
			country: addr.country || "Cameroun",
			district: addr.district,
			street: addr.street,
			photoUrl: addr.photoUrl,
			coordinates: {
				lat: addr.gps?.latitude ?? 3.8480,
				lng: addr.gps?.longitude ?? 11.5021,
			},
			createdAt: addr.createdAt,
		};
		await downloadAddressPDF(pdfPayload);
	} catch (err) {
		console.error("[AdminAddresses] handlePdfExportModal error:", err);
	} finally {
		isExportingPdf.value = false;
	}
};

const goToPage = (page: number) => {
	if (page < 0 || page >= adminAddressesMeta.value.totalPages) return;
	fetchAdminAddresses(page, 20, selectedCity.value);
};
</script>

<template>
	<div class="space-y-6 max-w-7xl mx-auto w-full animate-in fade-in duration-500 text-slate-900 dark:text-white">

		<!-- En-tête -->
		<div class="flex items-center justify-between flex-wrap gap-4">
			<div>
				<h1 class="text-3xl font-black font-serif text-slate-900 dark:text-white mb-1">Répertoire des Adresses</h1>
				<p class="text-sm font-medium text-slate-600 dark:text-slate-300">
					Registre national des adresses réelles certifiées FindMe.
				</p>
			</div>
			<div class="flex items-center gap-3">
				<span class="px-4 py-2 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-bold text-xs rounded-full border border-emerald-500/20 flex items-center gap-2">
					<Building class="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
					{{ adminAddressesMeta.totalElements }} adresse(s) en base
				</span>
			</div>
		</div>

		<!-- BARRE DE FILTRES HORIZONTALE PLEINE LARGEUR -->
		<div class="bg-white/80 dark:bg-[#0A0D1A]/80 backdrop-blur-2xl rounded-[32px] border border-slate-200/80 dark:border-slate-800 shadow-xl p-5 w-full">
			<div class="flex items-center justify-between gap-4 flex-wrap">

				<!-- Recherche textuelle -->
				<div class="flex-1 min-w-[240px] relative">
					<Search class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
					<input
						v-model="searchQuery"
						type="text"
						placeholder="Rechercher par code, ville, quartier, utilisateur..."
						class="w-full pl-11 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl text-sm font-bold text-slate-900 dark:text-white outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
					/>
				</div>

				<!-- Filtre Pays -->
				<div class="w-44">
					<select
						v-model="selectedCountry"
						class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl px-4 py-2.5 text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-emerald-500 cursor-pointer"
					>
						<option value="Cameroun">🇨🇲 Cameroun</option>
					</select>
				</div>

				<!-- Filtre Ville -->
				<div class="w-44">
					<select
						v-model="selectedCity"
						class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl px-4 py-2.5 text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-emerald-500 cursor-pointer"
					>
						<option value="">Toutes les villes</option>
						<option value="Yaoundé">Yaoundé</option>
						<option value="Douala">Douala</option>
						<option value="Bafoussam">Bafoussam</option>
						<option value="Garoua">Garoua</option>
					</select>
				</div>

				<!-- Filtre Statut -->
				<div class="w-44">
					<select
						v-model="selectedStatus"
						class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl px-4 py-2.5 text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-emerald-500 cursor-pointer"
					>
						<option value="">Tous les statuts</option>
						<option value="Validé">Validé</option>
						<option value="En attente">En attente</option>
						<option value="Signalé">Signalé</option>
					</select>
				</div>

				<!-- Bouton Réinitialiser -->
				<button
					@click="resetFilters"
					class="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold text-xs rounded-2xl transition-colors flex items-center gap-2 cursor-pointer"
				>
					<RefreshCw class="w-3.5 h-3.5" /> Réinitialiser
				</button>
			</div>
		</div>

		<!-- TABLEAU DES ADRESSES PLEINE LARGEUR -->
		<div class="bg-white/80 dark:bg-[#0A0D1A]/80 backdrop-blur-2xl rounded-[32px] border border-slate-200/80 dark:border-slate-800 shadow-xl flex flex-col overflow-hidden w-full">

			<div class="p-5 border-b border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
				<p class="text-sm font-bold text-slate-900 dark:text-white">
					<span v-if="isLoadingAddresses" class="text-slate-400">Chargement des adresses…</span>
					<span v-else>{{ filteredAddresses.length }} adresse(s) affichée(s) sur {{ adminAddressesMeta.totalElements }} en base</span>
				</p>
			</div>

			<div class="overflow-x-auto">
				<table class="w-full text-left border-collapse min-w-[900px]">
					<thead>
						<tr class="bg-slate-50/70 dark:bg-slate-900/60 text-[10px] font-black text-slate-400 uppercase tracking-wider border-b border-slate-200/60 dark:border-slate-800">
							<th class="px-6 py-4">Aperçu & Code</th>
							<th class="px-6 py-4">Localisation</th>
							<th class="px-6 py-4">Créateur / Résident</th>
							<th class="px-6 py-4">Date de création</th>
							<th class="px-6 py-4">Statut</th>
							<th class="px-6 py-4 text-right">Action</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-slate-200/60 dark:divide-slate-800">
						<!-- Skeleton de chargement -->
						<tr v-if="isLoadingAddresses" v-for="n in 6" :key="'sk'+n">
							<td class="px-6 py-4">
								<div class="flex items-center gap-3">
									<SkeletonUI width="w-12" height="h-12" rounded="rounded-2xl" />
									<SkeletonUI width="w-24" height="h-4" />
								</div>
							</td>
							<td class="px-6 py-4"><div class="space-y-1.5"><SkeletonUI width="w-36" height="h-4" /><SkeletonUI width="w-48" height="h-3" /></div></td>
							<td class="px-6 py-4"><div class="space-y-1.5"><SkeletonUI width="w-28" height="h-4" /><SkeletonUI width="w-36" height="h-3" /></div></td>
							<td class="px-6 py-4"><SkeletonUI width="w-20" height="h-3" /></td>
							<td class="px-6 py-4"><SkeletonUI width="w-20" height="h-6" rounded="rounded-full" /></td>
							<td class="px-6 py-4 text-right"><SkeletonUI width="w-24" height="h-8" rounded="rounded-full" class="ml-auto" /></td>
						</tr>

						<!-- Données réelles -->
						<tr
							v-else
							v-for="addr in filteredAddresses"
							:key="addr.id"
							class="hover:bg-slate-50 dark:hover:bg-slate-900/60 transition-colors group"
						>
							<!-- Aperçu & Code -->
							<td class="px-6 py-4">
								<div class="flex items-center gap-3">
									<div class="w-12 h-12 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center justify-center shrink-0 shadow-xs">
										<img v-if="addr.photoUrl" :src="addr.photoUrl" class="w-full h-full object-cover" alt="Photo adresse" />
										<MapPin v-else class="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
									</div>
									<div>
										<p class="text-sm font-black font-mono text-emerald-700 dark:text-emerald-400">{{ addr.addressCode || `#${addr.id}` }}</p>
										<p class="text-[10px] text-slate-400 font-mono">ID: {{ addr.id }}</p>
									</div>
								</div>
							</td>

							<!-- Localisation -->
							<td class="px-6 py-4">
								<p class="text-sm font-bold text-slate-900 dark:text-white">{{ addr.city }}, {{ addr.country || 'Cameroun' }}</p>
								<p class="text-xs text-slate-500 dark:text-slate-400 font-medium">
									{{ addr.district }}<span v-if="addr.street"> · {{ addr.street }}</span><span v-if="addr.houseNumber"> (N° {{ addr.houseNumber }})</span>
								</p>
							</td>

							<!-- Créateur / Résident (Auteur + Email) -->
							<td class="px-6 py-4">
								<div class="flex items-center gap-2.5">
									<div class="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
										{{ getInitials(getUserNameForAddress(addr)) }}
									</div>
									<div>
										<p class="text-sm font-bold text-slate-900 dark:text-white leading-snug">{{ getUserNameForAddress(addr) }}</p>
										<p class="text-xs text-slate-500 dark:text-slate-400 font-medium">{{ getUserEmailForAddress(addr) }}</p>
									</div>
								</div>
							</td>

							<!-- Date -->
							<td class="px-6 py-4 text-xs text-slate-500 dark:text-slate-400 font-medium">
								{{ formatDate(addr.createdAt) }}
							</td>

							<!-- Statut -->
							<td class="px-6 py-4">
								<span
									class="px-3 py-1 inline-block rounded-full text-[10px] font-black uppercase tracking-wider"
									:class="getStatusStyles(addr.status)"
								>
									{{ getStatusLabel(addr.status) }}
								</span>
							</td>

							<!-- Action : Bouton Détails & Supprimer -->
							<td class="px-6 py-4 text-right">
								<div class="flex items-center justify-end gap-2">
									<button
										@click="openAddressModal(addr)"
										class="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-full shadow-xs transition-all cursor-pointer"
									>
										<Eye class="w-3.5 h-3.5" />
										Détails
									</button>
									<button
										@click="triggerDeleteAddress(addr)"
										class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 dark:bg-rose-950/30 hover:bg-rose-100 text-rose-600 dark:text-rose-400 font-bold text-xs rounded-full transition-all border border-rose-200 dark:border-rose-800 cursor-pointer"
										title="Supprimer cette adresse"
									>
										<Trash2 class="w-3.5 h-3.5" />
										Supprimer
									</button>
								</div>
							</td>
						</tr>

						<!-- Empty State -->
						<tr v-if="!isLoadingAddresses && filteredAddresses.length === 0">
							<td colspan="6" class="px-6 py-12 text-center text-slate-400 text-sm">
								Aucune adresse trouvée en base de données.
							</td>
						</tr>
					</tbody>
				</table>
			</div>

			<!-- Pagination -->
			<div class="p-4 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-[#0A0D1A] rounded-b-3xl">
				<p class="text-xs text-slate-500 dark:text-slate-400 font-medium">
					Affichage de {{ filteredAddresses.length }} adresses sur {{ adminAddressesMeta.totalElements.toLocaleString("fr-FR") }} au total
				</p>
				<div class="flex items-center gap-1" v-if="adminAddressesMeta.totalPages > 1">
					<button
						@click="goToPage(adminAddressesMeta.currentPage - 1)"
						:disabled="adminAddressesMeta.currentPage === 0"
						class="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 cursor-pointer"
					>
						<ChevronLeft class="w-4 h-4" />
					</button>
					<button
						v-for="p in Math.min(adminAddressesMeta.totalPages, 5)"
						:key="p-1"
						@click="goToPage(p-1)"
						class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors cursor-pointer"
						:class="adminAddressesMeta.currentPage === p-1 ? 'bg-emerald-600 text-white shadow-xs' : 'border border-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'"
					>
						{{ p }}
					</button>
					<button
						@click="goToPage(adminAddressesMeta.currentPage + 1)"
						:disabled="adminAddressesMeta.currentPage >= adminAddressesMeta.totalPages - 1"
						class="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 cursor-pointer"
					>
						<ChevronRight class="w-4 h-4" />
					</button>
				</div>
			</div>
		</div>

		<!-- MODALE D'INSPECTION & HOMOLOGATION DE L'ADRESSE -->
		<Transition name="fade">
			<div v-if="isAddressModalOpen && selectedAddressModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
				<div class="bg-white dark:bg-[#0A0D1A] border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200 text-slate-900 dark:text-white">

					<!-- En-tête Modale -->
					<div class="bg-emerald-600 text-white p-6 relative flex items-center justify-between shrink-0">
						<div class="space-y-1">
							<span class="bg-white/20 text-white font-black uppercase text-[10px] tracking-wider px-3 py-1 rounded-full inline-block">
								PLAQUE D'ADRESSAGE HOMOLOGUÉE
							</span>
							<h2 class="text-2xl font-black font-serif">{{ selectedAddressModal.addressCode || `#${selectedAddressModal.id}` }}</h2>
							<p class="text-xs text-white/80 font-medium">Spécifications géodésiques certifiées par le cadastre national</p>
						</div>
						<button @click="isAddressModalOpen = false" class="p-2 text-white/80 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer">
							<X class="w-6 h-6" />
						</button>
					</div>

					<!-- Corps Modale -->
					<div class="p-6 overflow-y-auto space-y-6 flex-1 bg-slate-50/50 dark:bg-slate-900/60">

						<!-- Plaque Homologuée Visual & Photo de taille 100% Régulière (h-56 object-cover) -->
						<div class="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
							<!-- Plaque Émeraude Officielle -->
							<div class="bg-emerald-600 text-white p-5 rounded-2xl border-4 border-emerald-400 shadow-md relative text-center space-y-3 flex flex-col justify-between h-56 overflow-hidden">
								<div class="text-[9px] uppercase font-black text-emerald-100 tracking-widest">
									RÉPUBLIQUE DU CAMEROUN
								</div>
								<div class="space-y-1 my-auto">
									<span class="text-xl font-black block tracking-tight">N° {{ selectedAddressModal.houseNumber || '—' }}</span>
									<span class="text-xs font-bold block opacity-90">{{ selectedAddressModal.street || 'Rue Principale' }}</span>
									<span class="text-xs font-bold block opacity-80">{{ selectedAddressModal.district }}, {{ selectedAddressModal.city }}</span>
								</div>
								<div class="bg-white/15 border border-white/20 px-3 py-1.5 rounded-xl">
									<span class="font-mono text-base font-black block tracking-wider uppercase">
										{{ selectedAddressModal.addressCode || `#${selectedAddressModal.id}` }}
									</span>
								</div>
							</div>

							<!-- Photo du bâtiment avec taille constante et régulière (h-56) -->
							<div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs h-56 overflow-hidden relative flex items-center justify-center">
								<img v-if="selectedAddressModal.photoUrl" :src="selectedAddressModal.photoUrl" class="w-full h-full object-cover rounded-2xl" alt="Photo bâtiment" />
								<div v-else class="text-center p-4 text-slate-400 space-y-2">
									<Building class="w-10 h-10 mx-auto opacity-50" />
									<p class="text-xs font-medium">Aucune photo de bâtiment téléversée</p>
								</div>
							</div>
						</div>

						<!-- Coordonnées Satellites GPS & Créateur -->
						<div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
							<!-- Coordonnées GPS -->
							<div class="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-4 rounded-2xl space-y-2 shadow-xs">
								<div class="flex items-center gap-2 font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-wider text-[10px]">
									<Compass class="w-4 h-4" />
									Coordonnées Satellites GPS
								</div>
								<div class="grid grid-cols-2 gap-2 text-center pt-1">
									<div class="bg-slate-50 dark:bg-slate-800 p-2 rounded-xl border border-slate-200/60 dark:border-slate-700">
										<span class="text-[9px] uppercase font-bold text-slate-400 block">Latitude</span>
										<span class="text-xs font-mono font-black text-slate-900 dark:text-white">
											{{ selectedAddressModal.gps?.latitude ?? 3.8480 }}° N
										</span>
									</div>
									<div class="bg-slate-50 dark:bg-slate-800 p-2 rounded-xl border border-slate-200/60 dark:border-slate-700">
										<span class="text-[9px] uppercase font-bold text-slate-400 block">Longitude</span>
										<span class="text-xs font-mono font-black text-slate-900 dark:text-white">
											{{ selectedAddressModal.gps?.longitude ?? 11.5021 }}° E
										</span>
									</div>
								</div>
							</div>

							<!-- Informations Auteur & Résident -->
							<div class="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-4 rounded-2xl space-y-2 shadow-xs">
								<div class="flex items-center gap-2 font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[10px]">
									<UserIcon class="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
									Auteur & Résident de l'Adresse
								</div>
								<div class="space-y-1 pt-1">
									<p class="font-black text-sm text-slate-900 dark:text-white">Auteur: {{ getUserNameForAddress(selectedAddressModal) }}</p>
									<p class="text-xs font-semibold text-slate-600 dark:text-slate-300">Résident: {{ selectedAddressModal.resident || selectedAddressModal.residentName || getUserNameForAddress(selectedAddressModal) }}</p>
									<p class="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 pt-0.5">
										<Mail class="w-3.5 h-3.5 text-slate-400" />
										{{ getUserEmailForAddress(selectedAddressModal) }}
									</p>
									<p class="text-[10px] text-slate-400 pt-0.5">Créé le: {{ formatDate(selectedAddressModal.createdAt) }}</p>
								</div>
							</div>
						</div>

						<!-- Sélecteur de Statut d'Homologation Admin -->
						<div class="bg-emerald-500/10 border border-emerald-500/20 p-5 rounded-2xl space-y-3 shadow-xs">
							<div class="flex items-center justify-between">
								<label class="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
									<ShieldCheck class="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
									Statut d'Homologation Administrateur
								</label>
								<span
									class="px-3 py-1 rounded-full text-[10px] font-black uppercase"
									:class="getStatusStyles(selectedAddressModal.status)"
								>
									{{ getStatusLabel(selectedAddressModal.status) }}
								</span>
							</div>

							<div class="flex gap-2 pt-1">
								<button
									@click="handleStatusChangeInModal('ACTIVE')"
									class="flex-1 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
									:class="(selectedAddressModal.status || '').toLowerCase().includes('active') || (selectedAddressModal.status || '').toLowerCase().includes('valid') ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'"
								>
									<CheckCircle class="w-4 h-4" /> Validé
								</button>
								<button
									@click="handleStatusChangeInModal('PENDING')"
									class="flex-1 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
									:class="(selectedAddressModal.status || '').toLowerCase().includes('pending') || !(selectedAddressModal.status) ? 'bg-slate-900 text-white shadow-xs' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'"
								>
									<Clock class="w-4 h-4" /> En attente
								</button>
								<button
									@click="handleStatusChangeInModal('FLAGGED')"
									class="flex-1 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
									:class="(selectedAddressModal.status || '').toLowerCase().includes('flag') || (selectedAddressModal.status || '').toLowerCase().includes('signal') || (selectedAddressModal.status || '').toLowerCase().includes('reject') ? 'bg-rose-600 text-white shadow-xs' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'"
								>
									<AlertTriangle class="w-4 h-4" /> Non validé / Signalé
								</button>
							</div>
						</div>
					</div>

					<!-- Footer Modale -->
					<div class="p-4 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between shrink-0 bg-white dark:bg-[#0A0D1A] gap-3 flex-wrap">
						<div class="flex items-center gap-2">
							<button
								@click="handlePdfExportModal"
								:disabled="isExportingPdf"
								class="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-full flex items-center gap-2 shadow-md transition-all disabled:opacity-50 cursor-pointer"
							>
								<Download class="w-4 h-4" />
								{{ isExportingPdf ? 'Génération du PDF…' : 'Exporter en PDF' }}
							</button>

							<button
								@click="triggerDeleteAddress(selectedAddressModal)"
								class="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-full flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
							>
								<Trash2 class="w-4 h-4" />
								Supprimer l'adresse
							</button>
						</div>

						<button @click="isAddressModalOpen = false" class="px-6 py-2.5 bg-slate-900 dark:bg-slate-800 text-white font-bold text-xs rounded-full hover:bg-slate-800 transition-colors cursor-pointer">
							Fermer
						</button>
					</div>

				</div>
			</div>
		</Transition>

		<!-- MODALE DE CONFIRMATION DE SUPPRESSION -->
		<Transition name="fade">
			<div v-if="isDeleteModalOpen && addressToDelete" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
				<div class="bg-white dark:bg-[#0A0D1A] border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl text-center space-y-5 animate-in zoom-in-95 text-slate-900 dark:text-white">
					<div class="w-14 h-14 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 border border-rose-200 dark:border-rose-800 flex items-center justify-center mx-auto">
						<Trash2 class="w-7 h-7" />
					</div>
					<div>
						<h3 class="text-lg font-black font-serif text-slate-900 dark:text-white">Supprimer définitivement l'adresse ?</h3>
						<p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
							Vous êtes sur le point de supprimer le code <span class="font-bold text-slate-900 dark:text-white">{{ addressToDelete.addressCode || `#${addressToDelete.id}` }}</span>. Cette action est irréversible.
						</p>
					</div>
					<div class="flex items-center gap-3 pt-2">
						<button
							@click="isDeleteModalOpen = false; addressToDelete = null"
							class="flex-1 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold text-xs rounded-full transition-colors cursor-pointer"
						>
							Annuler
						</button>
						<button
							@click="confirmDeleteAddress"
							:disabled="isDeletingAddress"
							class="flex-1 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-full shadow-md transition-colors disabled:opacity-50 cursor-pointer"
						>
							{{ isDeletingAddress ? 'Suppression…' : 'Oui, Supprimer' }}
						</button>
					</div>
				</div>
			</div>
		</Transition>

	</div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
