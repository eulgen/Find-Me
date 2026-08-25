<!--
  @file app/pages/admin/users/index.vue
  @description Page de gestion des utilisateurs et modification de rôles admin — design glassmorphism à ton uni émeraude (#00bc7d) et bleu nuit (#0A0D1A) avec squelettes (SkeletonUI).
-->

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { Users, TrendingUp, Ban, Search, Filter, Eye, ChevronLeft, ChevronRight, X, MapPin, Mail, Phone, Calendar, Shield, CheckCircle } from "lucide-vue-next";
import SkeletonUI from "~/components/ui/SkeletonUI.vue";
import { useAdminData } from "~/composables/useAdminData";
import type { AdminUserDTO, AdminAddressDTO } from "~/composables/useAdminData";

definePageMeta({
	layout: "dashboard-admin",
	middleware: ["admin"],
});

const {
	adminUsers, adminUsersMeta, isLoadingUsers, fetchAdminUsers, updateUserRole,
	adminAddresses, fetchAdminAddresses, fetchUserAddresses, fetchUserAddressCount, userAddressCountMap,
	getInitials, formatDate,
} = useAdminData();

const searchQuery = ref("");
const selectedRole = ref("Tous les Rôles");
let searchTimer: ReturnType<typeof setTimeout> | null = null;

// Modal état utilisateur
const isUserModalOpen = ref(false);
const selectedUserModal = ref<AdminUserDTO | null>(null);
const userAddressesList = ref<AdminAddressDTO[]>([]);
const userAddressesPage = ref(0);
const userAddressesTotalPages = ref(1);
const userAddressesTotalCount = ref(0);
const isLoadingUserAddresses = ref(false);
const isUpdatingRole = ref(false);

const handleRoleChangeInModal = async (newRole: string) => {
	if (!selectedUserModal.value) return;
	isUpdatingRole.value = true;
	await updateUserRole(selectedUserModal.value.id, newRole);
	selectedUserModal.value.role = newRole;
	isUpdatingRole.value = false;
};

onMounted(() => {
	fetchAdminUsers(0, 20);
	fetchAdminAddresses(0, 100);
});

// Charger le nombre d'adresses pour chaque utilisateur via GET /api/admin/users/{id}/addresses
watch(adminUsers, (users) => {
	if (users && users.length > 0) {
		users.forEach((u) => {
			fetchUserAddressCount(u.id);
		});
	}
}, { immediate: true });

// Recherche avec debounce
watch(searchQuery, (val) => {
	if (searchTimer) clearTimeout(searchTimer);
	searchTimer = setTimeout(() => {
		fetchAdminUsers(0, 20, val);
	}, 400);
});

const getRoleColor = (role: string) => {
	const r = (role || "").toUpperCase();
	if (r === "ADMIN") return "bg-slate-900 text-white dark:bg-slate-800";
	if (r === "SUPPORT_AGENT") return "bg-emerald-600 text-white";
	return "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700";
};

const getStatusClass = (status: string) => {
	const s = (status || "").toUpperCase();
	if (s === "ACTIVE") return "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20";
	if (s === "BLOCKED") return "bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800";
	return "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700";
};

const getStatusLabel = (status: string) => {
	const s = (status || "").toUpperCase();
	if (s === "ACTIVE") return "Actif";
	if (s === "BLOCKED") return "Bloqué";
	if (s === "PENDING_VERIFICATION") return "En attente";
	return status || "Inconnu";
};

const getAddressStatusStyles = (status?: string) => {
	const s = (status || "pending").toLowerCase();
	if (s.includes("valid") || s.includes("active")) return "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 font-bold";
	if (s.includes("reject") || s.includes("non") || s.includes("flag") || s.includes("signal") || s.includes("refus")) return "bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 font-bold";
	return "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-bold";
};

const getAddressStatusLabel = (status?: string) => {
	if (!status) return "En attente";
	const s = status.toLowerCase();
	if (s.includes("valid") || s.includes("active")) return "Validé";
	if (s.includes("reject") || s.includes("non") || s.includes("refus")) return "Non validé";
	if (s.includes("flag") || s.includes("signal")) return "Signalé";
	return "En attente";
};

// Obtenir le nombre d'adresses d'un utilisateur depuis userAddressCountMap ou adminAddresses
const getAddressCountForUser = (user: AdminUserDTO) => {
	if (userAddressCountMap.value[user.id] !== undefined) {
		return userAddressCountMap.value[user.id];
	}
	if (!adminAddresses.value || adminAddresses.value.length === 0) return 0;
	return adminAddresses.value.filter((a) => {
		if (a.userId && a.userId === user.id) return true;
		if (a.userFullName && user.fullName && a.userFullName.trim().toLowerCase() === user.fullName.trim().toLowerCase()) return true;
		return false;
	}).length;
};

// Ouvrir la modale utilisateur
const openUserModal = async (user: AdminUserDTO) => {
	selectedUserModal.value = user;
	isUserModalOpen.value = true;
	await loadUserAddresses(user, 0);
};

const loadUserAddresses = async (user: AdminUserDTO, page: number) => {
	isLoadingUserAddresses.value = true;
	userAddressesPage.value = page;
	const res = await fetchUserAddresses(user.id, page, 5);
	if (res) {
		userAddressesList.value = res.content || [];
		userAddressesTotalPages.value = res.totalPages || 1;
		userAddressesTotalCount.value = res.totalElements || 0;
	} else {
		// Fallback local filter
		const filtered = adminAddresses.value.filter((a) => {
			if (a.userId && a.userId === user.id) return true;
			if (a.userFullName && user.fullName && a.userFullName.trim().toLowerCase() === user.fullName.trim().toLowerCase()) return true;
			return false;
		});
		userAddressesList.value = filtered;
		userAddressesTotalPages.value = 1;
		userAddressesTotalCount.value = filtered.length;
	}
	isLoadingUserAddresses.value = false;
};

// Filtrage local par rôle
const filteredUsers = computed(() => {
	let list = adminUsers.value;
	if (selectedRole.value !== "Tous les Rôles") {
		list = list.filter((u) => u.role === selectedRole.value);
	}
	return list;
});

// Statistiques calculées
const activeCount = computed(() => adminUsers.value.filter(u => u.status?.toUpperCase() === "ACTIVE").length);
const blockedCount = computed(() => adminUsers.value.filter(u => u.status?.toUpperCase() === "BLOCKED").length);

const goToPage = (page: number) => {
	if (page < 0 || page >= adminUsersMeta.value.totalPages) return;
	fetchAdminUsers(page, 20, searchQuery.value);
};
</script>

<template>
	<div class="space-y-6 max-w-7xl mx-auto w-full animate-in fade-in duration-500 text-slate-900 dark:text-white">

		<!-- En-tête -->
		<div class="flex items-center justify-between flex-wrap gap-4">
			<div>
				<h1 class="text-3xl font-black font-serif text-slate-900 dark:text-white mb-1">Gestion des Utilisateurs</h1>
				<p class="text-sm font-medium text-slate-600 dark:text-slate-300">Supervisez et gérez les accès et comptes du système FindMe.</p>
			</div>
		</div>

		<!-- Cartes Statistiques -->
		<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
			<div class="bg-white/80 dark:bg-[#0A0D1A]/80 backdrop-blur-2xl rounded-[32px] p-6 shadow-xl border border-slate-200/80 dark:border-slate-800 flex items-center gap-4">
				<div class="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center shrink-0 border border-emerald-500/20">
					<Users class="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
				</div>
				<div>
					<p class="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-0.5">Total Utilisateurs</p>
					<p class="text-3xl font-black text-slate-900 dark:text-white">
						<SkeletonUI v-if="isLoadingUsers" width="w-20" height="h-8" />
						<span v-else>{{ adminUsersMeta.totalElements.toLocaleString("fr-FR") }}</span>
					</p>
				</div>
			</div>

			<div class="bg-white/80 dark:bg-[#0A0D1A]/80 backdrop-blur-2xl rounded-[32px] p-6 shadow-xl border border-slate-200/80 dark:border-slate-800 flex items-center gap-4">
				<div class="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center shrink-0 border border-emerald-500/20">
					<TrendingUp class="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
				</div>
				<div>
					<p class="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-0.5">Comptes Actifs</p>
					<p class="text-3xl font-black text-slate-900 dark:text-white">
						<SkeletonUI v-if="isLoadingUsers" width="w-16" height="h-8" />
						<span v-else>{{ activeCount }}</span>
					</p>
				</div>
			</div>

			<div class="bg-white/80 dark:bg-[#0A0D1A]/80 backdrop-blur-2xl rounded-[32px] p-6 shadow-xl border border-rose-200/80 dark:border-rose-900/50 flex items-center gap-4">
				<div class="w-14 h-14 bg-rose-50 dark:bg-rose-950/40 rounded-2xl flex items-center justify-center shrink-0 border border-rose-200 dark:border-rose-800">
					<Ban class="w-6 h-6 text-rose-500" />
				</div>
				<div>
					<p class="text-[10px] font-black text-rose-600 dark:text-rose-400 uppercase tracking-widest mb-0.5">Comptes Bloqués</p>
					<p class="text-3xl font-black text-rose-600 dark:text-rose-400">
						<SkeletonUI v-if="isLoadingUsers" width="w-16" height="h-8" />
						<span v-else>{{ blockedCount }}</span>
					</p>
				</div>
			</div>
		</div>

		<!-- Zone de filtrage et Liste (Pleine largeur) -->
		<div class="bg-white/80 dark:bg-[#0A0D1A]/80 backdrop-blur-2xl rounded-[32px] border border-slate-200/80 dark:border-slate-800 shadow-xl flex flex-col overflow-hidden w-full">

			<!-- Filtres -->
			<div class="p-5 border-b border-slate-200/60 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
				<div class="flex items-center gap-3 flex-1 max-w-sm">
					<div class="relative flex-1">
						<Search class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
						<input
							v-model="searchQuery"
							type="text"
							placeholder="Rechercher un utilisateur..."
							class="w-full pl-11 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-full text-sm font-bold text-slate-900 dark:text-white outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
						/>
					</div>
				</div>
				<div class="flex gap-2">
					<select v-model="selectedRole" class="text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-full px-4 py-2 text-slate-900 dark:text-white font-bold outline-none focus:border-emerald-500 cursor-pointer">
						<option>Tous les Rôles</option>
						<option value="ADMIN">ADMIN</option>
						<option value="SUPPORT_AGENT">SUPPORT AGENT</option>
						<option value="USER">USER</option>
					</select>
				</div>
			</div>

			<!-- Tableau pleine largeur -->
			<div class="flex-1 overflow-x-auto">
				<table class="w-full text-left border-collapse min-w-[800px]">
					<thead>
						<tr class="bg-slate-50/70 dark:bg-slate-900/60 text-[10px] font-black text-slate-400 uppercase tracking-wider border-b border-slate-200/60 dark:border-slate-800">
							<th class="px-6 py-4">Utilisateur</th>
							<th class="px-6 py-4">Rôle</th>
							<th class="px-6 py-4">Statut</th>
							<th class="px-6 py-4">Adresses créées</th>
							<th class="px-6 py-4">Inscrit le</th>
							<th class="px-6 py-4 text-right">Action</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-slate-200/60 dark:divide-slate-800">
						<!-- Loading skeleton -->
						<tr v-if="isLoadingUsers" v-for="n in 6" :key="'sk'+n">
							<td class="px-6 py-4">
								<div class="flex items-center gap-3">
									<SkeletonUI width="w-10" height="h-10" rounded="rounded-full" />
									<div class="space-y-1.5"><SkeletonUI width="w-32" height="h-4" /><SkeletonUI width="w-44" height="h-3" /></div>
								</div>
							</td>
							<td class="px-6 py-4"><SkeletonUI width="w-20" height="h-5" rounded="rounded-md" /></td>
							<td class="px-6 py-4"><SkeletonUI width="w-16" height="h-5" rounded="rounded-full" /></td>
							<td class="px-6 py-4"><SkeletonUI width="w-24" height="h-5" rounded="rounded-full" /></td>
							<td class="px-6 py-4"><SkeletonUI width="w-24" height="h-4" /></td>
							<td class="px-6 py-4 text-right"><SkeletonUI width="w-20" height="h-8" rounded="rounded-full" class="ml-auto" /></td>
						</tr>
						<!-- Données réelles -->
						<tr
							v-else
							v-for="user in filteredUsers"
							:key="user.id"
							class="hover:bg-slate-50 dark:hover:bg-slate-900/60 transition-colors group"
						>
							<td class="px-6 py-4">
								<div class="flex items-center gap-3">
									<div class="w-10 h-10 rounded-full overflow-hidden bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0">
										<img v-if="user.profileImage" :src="user.profileImage" class="w-full h-full object-cover" alt="" />
										<span v-else>{{ getInitials(user.fullName) }}</span>
									</div>
									<div>
										<p class="text-sm font-black text-slate-900 dark:text-white">{{ user.fullName }}</p>
										<p class="text-xs text-slate-500 dark:text-slate-400">{{ user.email }}</p>
									</div>
								</div>
							</td>
							<td class="px-6 py-4">
								<span class="px-2.5 py-1 rounded-md text-[10px] font-black tracking-wide uppercase" :class="getRoleColor(user.role)">
									{{ user.role || 'USER' }}
								</span>
							</td>
							<td class="px-6 py-4">
								<span class="px-3 py-1 rounded-full text-[10px] font-black tracking-wider" :class="getStatusClass(user.status)">
									{{ getStatusLabel(user.status) }}
								</span>
							</td>
							<td class="px-6 py-4">
								<span class="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-bold text-xs rounded-full border border-emerald-500/20">
									<MapPin class="w-3.5 h-3.5" />
									{{ getAddressCountForUser(user) }} adresse(s)
								</span>
							</td>
							<td class="px-6 py-4 text-xs text-slate-500 dark:text-slate-400 font-medium">
								{{ formatDate(user.createdAt) }}
							</td>
							<td class="px-6 py-4 text-right">
								<button
									@click="openUserModal(user)"
									class="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-full shadow-xs transition-all cursor-pointer"
								>
									<Eye class="w-3.5 h-3.5" /> Détails
								</button>
							</td>
						</tr>
						<!-- Empty state -->
						<tr v-if="!isLoadingUsers && filteredUsers.length === 0">
							<td colspan="6" class="px-6 py-10 text-center text-slate-400 text-sm">
								Aucun utilisateur trouvé.
							</td>
						</tr>
					</tbody>
				</table>
			</div>

			<!-- Pagination -->
			<div class="p-4 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-[#0A0D1A] rounded-b-3xl">
				<p class="text-xs text-slate-500 dark:text-slate-400 font-medium">
					{{ adminUsersMeta.totalElements.toLocaleString("fr-FR") }} utilisateurs au total
				</p>
				<div class="flex items-center gap-1" v-if="adminUsersMeta.totalPages > 1">
					<button
						@click="goToPage(adminUsersMeta.currentPage - 1)"
						:disabled="adminUsersMeta.currentPage === 0"
						class="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 cursor-pointer"
					>
						<ChevronLeft class="w-4 h-4" />
					</button>
					<button
						v-for="p in Math.min(adminUsersMeta.totalPages, 5)"
						:key="p-1"
						@click="goToPage(p-1)"
						class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors cursor-pointer"
						:class="adminUsersMeta.currentPage === p-1 ? 'bg-emerald-600 text-white shadow-xs' : 'border border-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'"
					>
						{{ p }}
					</button>
					<button
						@click="goToPage(adminUsersMeta.currentPage + 1)"
						:disabled="adminUsersMeta.currentPage >= adminUsersMeta.totalPages - 1"
						class="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 cursor-pointer"
					>
						<ChevronRight class="w-4 h-4" />
					</button>
				</div>
			</div>
		</div>

		<!-- MODALE DÉTAILS UTILISATEUR -->
		<Transition name="fade">
			<div v-if="isUserModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
				<div class="bg-white dark:bg-[#0A0D1A] border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200 text-slate-900 dark:text-white">
					
					<!-- Header Modale -->
					<div class="bg-slate-900 border-b border-slate-800 p-6 text-white relative flex items-center justify-between shrink-0">
						<div class="flex items-center gap-4 z-10">
							<div class="w-14 h-14 rounded-full border-2 border-emerald-400 overflow-hidden bg-emerald-600 flex items-center justify-center font-black text-xl text-white shrink-0">
								<img v-if="selectedUserModal?.profileImage" :src="selectedUserModal.profileImage" class="w-full h-full object-cover" alt="" />
								<span v-else>{{ getInitials(selectedUserModal?.fullName || "") }}</span>
							</div>
							<div>
								<h2 class="text-xl font-black font-serif">{{ selectedUserModal?.fullName }}</h2>
								<p class="text-xs text-emerald-400 font-medium">{{ selectedUserModal?.email }}</p>
								<span class="inline-block mt-1 px-3 py-0.5 bg-emerald-600 text-white rounded-full text-[10px] font-black uppercase">
									{{ selectedUserModal?.role || 'USER' }}
								</span>
							</div>
						</div>
						<button @click="isUserModalOpen = false" class="p-2 text-white/70 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer">
							<X class="w-6 h-6" />
						</button>
					</div>

					<!-- Corps Modale -->
					<div class="p-6 overflow-y-auto space-y-6 flex-1">
						<!-- Grille infos -->
						<div class="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-4 rounded-2xl text-xs">
							<div>
								<span class="text-slate-500 dark:text-slate-400 font-medium block mb-0.5">Statut</span>
								<span class="font-bold" :class="selectedUserModal?.status?.toUpperCase() === 'ACTIVE' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500'">
									{{ getStatusLabel(selectedUserModal?.status || "") }}
								</span>
							</div>
							<div>
								<span class="text-slate-500 dark:text-slate-400 font-medium block mb-0.5">Téléphone</span>
								<span class="font-bold text-slate-900 dark:text-white">{{ selectedUserModal?.phoneNumber || 'Non renseigné' }}</span>
							</div>
							<div>
								<span class="text-slate-500 dark:text-slate-400 font-medium block mb-0.5">Inscrit le</span>
								<span class="font-bold text-slate-900 dark:text-white">{{ formatDate(selectedUserModal?.createdAt) }}</span>
							</div>
						</div>

						<!-- Modification du Rôle Utilisateur -->
						<div class="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl space-y-3">
							<div class="flex items-center justify-between">
								<span class="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
									<Shield class="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
									Modifier le rôle de l'utilisateur
								</span>
								<span v-if="isUpdatingRole" class="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold animate-pulse">
									Mise à jour du rôle...
								</span>
							</div>
							<div class="grid grid-cols-3 gap-2">
								<button
									@click="handleRoleChangeInModal('USER')"
									:disabled="isUpdatingRole"
									class="py-2.5 px-3 rounded-xl text-xs font-bold transition-all border text-center flex flex-col items-center justify-center gap-0.5 cursor-pointer"
									:class="selectedUserModal?.role === 'USER' || selectedUserModal?.role === 'CITIZEN' ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'"
								>
									<span>Utilisateur</span>
									<span class="text-[9px] opacity-80 font-mono">USER</span>
								</button>
								<button
									@click="handleRoleChangeInModal('SUPPORT_AGENT')"
									:disabled="isUpdatingRole"
									class="py-2.5 px-3 rounded-xl text-xs font-bold transition-all border text-center flex flex-col items-center justify-center gap-0.5 cursor-pointer"
									:class="selectedUserModal?.role === 'SUPPORT_AGENT' ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'"
								>
									<span>Agent Support</span>
									<span class="text-[9px] opacity-80 font-mono">SUPPORT_AGENT</span>
								</button>
								<button
									@click="handleRoleChangeInModal('ADMIN')"
									:disabled="isUpdatingRole"
									class="py-2.5 px-3 rounded-xl text-xs font-bold transition-all border text-center flex flex-col items-center justify-center gap-0.5 cursor-pointer"
									:class="selectedUserModal?.role === 'ADMIN' ? 'bg-slate-900 text-white border-slate-900 shadow-xs' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'"
								>
									<span>Administrateur</span>
									<span class="text-[9px] opacity-80 font-mono">ADMIN</span>
								</button>
							</div>
						</div>

						<!-- Section Adresses créées par l'utilisateur -->
						<div>
							<div class="flex items-center justify-between mb-3">
								<h3 class="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
									<MapPin class="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
									Adresses créées par cet utilisateur ({{ userAddressesTotalCount }})
								</h3>
							</div>

							<div v-if="isLoadingUserAddresses" class="space-y-2">
								<SkeletonUI v-for="n in 3" :key="n" height="h-16" rounded="rounded-2xl" />
							</div>

							<div v-else-if="userAddressesList.length > 0" class="space-y-2.5">
								<div
									v-for="addr in userAddressesList"
									:key="addr.id"
									class="p-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl flex items-center justify-between shadow-xs"
								>
									<div class="flex items-center gap-3">
										<div class="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0">
											<MapPin class="w-4.5 h-4.5" />
										</div>
										<div>
											<p class="text-sm font-black text-slate-900 dark:text-white">{{ addr.addressCode || addr.id }}</p>
											<p class="text-xs text-slate-500 dark:text-slate-400">{{ addr.city }} · {{ addr.district }}, {{ addr.street }}</p>
										</div>
									</div>
									<span class="px-2.5 py-1 rounded-full text-[10px] uppercase font-black" :class="getAddressStatusStyles(addr.status)">
										{{ getAddressStatusLabel(addr.status) }}
									</span>
								</div>

								<!-- Pagination adresses modal -->
								<div v-if="userAddressesTotalPages > 1" class="flex items-center justify-between pt-3 text-xs text-slate-500">
									<span>Page {{ userAddressesPage + 1 }} sur {{ userAddressesTotalPages }}</span>
									<div class="flex gap-1">
										<button
											@click="loadUserAddresses(selectedUserModal!.id, userAddressesPage - 1)"
											:disabled="userAddressesPage === 0"
											class="px-2.5 py-1 border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 cursor-pointer"
										>Précédent</button>
										<button
											@click="loadUserAddresses(selectedUserModal!.id, userAddressesPage + 1)"
											:disabled="userAddressesPage >= userAddressesTotalPages - 1"
											class="px-2.5 py-1 border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 cursor-pointer"
										>Suivant</button>
									</div>
								</div>
							</div>

							<div v-else class="py-8 text-center text-slate-400 text-xs bg-slate-50 dark:bg-slate-900 rounded-2xl">
								Cet utilisateur n'a créé aucune adresse pour le moment.
							</div>
						</div>
					</div>

					<!-- Footer Modale -->
					<div class="p-4 border-t border-slate-200/60 dark:border-slate-800 flex justify-end shrink-0 bg-slate-50 dark:bg-slate-900">
						<button @click="isUserModalOpen = false" class="px-6 py-2.5 bg-slate-900 dark:bg-slate-800 text-white font-bold text-xs rounded-full hover:bg-slate-800 cursor-pointer">
							Fermer
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
