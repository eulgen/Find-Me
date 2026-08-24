<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { Users, TrendingUp, Ban, Search, Filter, Eye, ChevronLeft, ChevronRight, X, MapPin, Mail, Phone, Calendar, Shield, CheckCircle } from "lucide-vue-next";
import { useAdminData } from "~/composables/useAdminData";
import type { AdminUserDTO, AdminAddressDTO } from "~/composables/useAdminData";

definePageMeta({
	layout: "dashboard-admin",
	middleware: ["admin"],
});

const {
	adminUsers, adminUsersMeta, isLoadingUsers, fetchAdminUsers, updateUserRole,
	adminAddresses, fetchAdminAddresses, fetchUserAddresses,
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

// Recherche avec debounce
watch(searchQuery, (val) => {
	if (searchTimer) clearTimeout(searchTimer);
	searchTimer = setTimeout(() => {
		fetchAdminUsers(0, 20, val);
	}, 400);
});

const getRoleColor = (role: string) => {
	const r = (role || "").toUpperCase();
	if (r === "ADMIN") return "bg-indigo-100 text-indigo-700";
	if (r === "SUPPORT_AGENT") return "bg-amber-100 text-amber-700";
	return "bg-gray-100 text-gray-600";
};

const getStatusClass = (status: string) => {
	const s = (status || "").toUpperCase();
	if (s === "ACTIVE") return "bg-emerald-100 text-emerald-700";
	if (s === "BLOCKED") return "bg-rose-100 text-rose-600";
	return "bg-gray-100 text-gray-600";
};

const getStatusLabel = (status: string) => {
	const s = (status || "").toUpperCase();
	if (s === "ACTIVE") return "Actif";
	if (s === "BLOCKED") return "Bloqué";
	if (s === "PENDING_VERIFICATION") return "En attente";
	return status || "Inconnu";
};

// Obtenir le nombre d'adresses d'un utilisateur depuis adminAddresses
const getAddressCountForUser = (user: AdminUserDTO) => {
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
	if (res && res.content && res.content.length > 0) {
		userAddressesList.value = res.content;
		userAddressesTotalPages.value = res.totalPages || 1;
		userAddressesTotalCount.value = res.totalElements || 0;
	} else {
		// Fallback local filter (userId OR fullName match)
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
	<div class="space-y-6">

		<!-- En-tête -->
		<div class="flex items-center justify-between flex-wrap gap-4">
			<div>
				<h1 class="text-2xl font-black text-[#155dfc] mb-1">Gestion des Utilisateurs</h1>
				<p class="text-sm text-gray-500 font-medium">Supervisez et gérez les accès et comptes du système FindMe.</p>
			</div>
		</div>

		<!-- Cartes Statistiques -->
		<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
			<div class="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
				<div class="w-12 h-12 bg-[#81C784]/20 rounded-full flex items-center justify-center shrink-0">
					<Users class="w-5 h-5 text-[#00bc7d]" />
				</div>
				<div>
					<p class="text-[10px] font-black text-gray-500 uppercase tracking-wider mb-0.5">Total Utilisateurs</p>
					<p class="text-2xl font-black text-[#155dfc]">
						<span v-if="isLoadingUsers" class="text-xl text-gray-400">…</span>
						<span v-else>{{ adminUsersMeta.totalElements.toLocaleString("fr-FR") }}</span>
					</p>
				</div>
			</div>

			<div class="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
				<div class="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center shrink-0">
					<TrendingUp class="w-5 h-5 text-indigo-500" />
				</div>
				<div>
					<p class="text-[10px] font-black text-gray-500 uppercase tracking-wider mb-0.5">Comptes Actifs</p>
					<p class="text-2xl font-black text-[#155dfc]">{{ activeCount }}</p>
				</div>
			</div>

			<div class="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
				<div class="w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center shrink-0">
					<Ban class="w-5 h-5 text-rose-500" />
				</div>
				<div>
					<p class="text-[10px] font-black text-gray-500 uppercase tracking-wider mb-0.5">Comptes Bloqués</p>
					<p class="text-2xl font-black text-[#155dfc]">{{ blockedCount }}</p>
				</div>
			</div>
		</div>

		<!-- Zone de filtrage et Liste (Pleine largeur) -->
		<div class="bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col overflow-hidden w-full">

			<!-- Filtres -->
			<div class="p-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4">
				<div class="flex items-center gap-3 flex-1 max-w-sm">
					<div class="relative flex-1">
						<Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
						<input
							v-model="searchQuery"
							type="text"
							placeholder="Rechercher un utilisateur..."
							class="w-full pl-10 pr-4 py-2 bg-[#F4F6F9] border-none rounded-full text-sm text-gray-700 font-medium outline-none focus:ring-2 focus:ring-[#155dfc]/20"
						/>
					</div>
				</div>
				<div class="flex gap-2">
					<select v-model="selectedRole" class="text-sm bg-white border border-gray-200 rounded-full px-4 py-2 text-gray-700 font-semibold outline-none focus:border-[#155dfc]">
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
						<tr class="bg-white text-[10px] font-black text-gray-400 uppercase tracking-wider border-b border-gray-100">
							<th class="px-6 py-4">Utilisateur</th>
							<th class="px-6 py-4">Rôle</th>
							<th class="px-6 py-4">Statut</th>
							<th class="px-6 py-4">Adresses créées</th>
							<th class="px-6 py-4">Inscrit le</th>
							<th class="px-6 py-4 text-right">Action</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-gray-50">
						<!-- Loading skeleton -->
						<tr v-if="isLoadingUsers" v-for="n in 6" :key="'sk'+n" class="animate-pulse">
							<td class="px-6 py-4">
								<div class="flex items-center gap-3">
									<div class="w-10 h-10 rounded-full bg-gray-200"></div>
									<div class="space-y-1.5"><div class="h-3 bg-gray-200 rounded w-32"></div><div class="h-2 bg-gray-200 rounded w-44"></div></div>
								</div>
							</td>
							<td class="px-6 py-4"><div class="h-5 bg-gray-200 rounded-full w-20"></div></td>
							<td class="px-6 py-4"><div class="h-5 bg-gray-200 rounded-full w-16"></div></td>
							<td class="px-6 py-4"><div class="h-5 bg-gray-200 rounded-full w-12"></div></td>
							<td class="px-6 py-4"><div class="h-3 bg-gray-200 rounded w-24"></div></td>
							<td class="px-6 py-4 text-right"><div class="h-8 w-20 bg-gray-200 rounded-full ml-auto"></div></td>
						</tr>
						<!-- Données réelles -->
						<tr
							v-else
							v-for="user in filteredUsers"
							:key="user.id"
							class="hover:bg-gray-50 transition-colors group"
						>
							<td class="px-6 py-4">
								<div class="flex items-center gap-3">
									<div class="w-10 h-10 rounded-full overflow-hidden bg-[#155dfc] text-white flex items-center justify-center font-bold shrink-0">
										<img v-if="user.profileImage" :src="user.profileImage" class="w-full h-full object-cover" alt="" />
										<span v-else>{{ getInitials(user.fullName) }}</span>
									</div>
									<div>
										<p class="text-sm font-black text-gray-900">{{ user.fullName }}</p>
										<p class="text-xs text-gray-500">{{ user.email }}</p>
									</div>
								</div>
							</td>
							<td class="px-6 py-4">
								<span class="px-2.5 py-1 rounded-md text-[10px] font-black tracking-wide uppercase" :class="getRoleColor(user.role)">
									{{ user.role || 'USER' }}
								</span>
							</td>
							<td class="px-6 py-4">
								<span class="px-2.5 py-1 rounded-full text-[10px] font-black tracking-wider" :class="getStatusClass(user.status)">
									{{ getStatusLabel(user.status) }}
								</span>
							</td>
							<td class="px-6 py-4">
								<span class="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 font-bold text-xs rounded-full">
									<MapPin class="w-3.5 h-3.5" />
									{{ getAddressCountForUser(user) }} adresse(s)
								</span>
							</td>
							<td class="px-6 py-4 text-sm text-gray-500 font-medium">
								{{ formatDate(user.createdAt) }}
							</td>
							<td class="px-6 py-4 text-right">
								<button
									@click="openUserModal(user)"
									class="inline-flex items-center gap-1.5 px-4 py-2 bg-[#155dfc] hover:bg-blue-700 text-white font-bold text-xs rounded-full shadow-sm transition-all"
								>
									<Eye class="w-3.5 h-3.5" /> Détails
								</button>
							</td>
						</tr>
						<!-- Empty state -->
						<tr v-if="!isLoadingUsers && filteredUsers.length === 0">
							<td colspan="6" class="px-6 py-10 text-center text-gray-400 text-sm">
								Aucun utilisateur trouvé.
							</td>
						</tr>
					</tbody>
				</table>
			</div>

			<!-- Pagination -->
			<div class="p-4 border-t border-gray-100 flex items-center justify-between bg-white rounded-b-3xl">
				<p class="text-xs text-gray-500 font-medium">
					{{ adminUsersMeta.totalElements.toLocaleString("fr-FR") }} utilisateurs au total
				</p>
				<div class="flex items-center gap-1" v-if="adminUsersMeta.totalPages > 1">
					<button
						@click="goToPage(adminUsersMeta.currentPage - 1)"
						:disabled="adminUsersMeta.currentPage === 0"
						class="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50 disabled:opacity-40"
					>
						<ChevronLeft class="w-4 h-4" />
					</button>
					<button
						v-for="p in Math.min(adminUsersMeta.totalPages, 5)"
						:key="p-1"
						@click="goToPage(p-1)"
						class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors"
						:class="adminUsersMeta.currentPage === p-1 ? 'bg-[#81C784] text-white shadow-sm' : 'border border-transparent text-gray-600 hover:bg-gray-50'"
					>
						{{ p }}
					</button>
					<button
						@click="goToPage(adminUsersMeta.currentPage + 1)"
						:disabled="adminUsersMeta.currentPage >= adminUsersMeta.totalPages - 1"
						class="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-40"
					>
						<ChevronRight class="w-4 h-4" />
					</button>
				</div>
			</div>
		</div>

		<!-- MODALE DÉTAILS UTILISATEUR -->
		<Transition name="fade">
			<div v-if="isUserModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
				<div class="bg-white rounded-3xl border border-gray-100 shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
					
					<!-- Header Modale -->
					<div class="bg-[#0A0F2C] p-6 text-white relative flex items-center justify-between shrink-0">
						<div class="flex items-center gap-4 z-10">
							<div class="w-14 h-14 rounded-full border-2 border-white/80 overflow-hidden bg-white flex items-center justify-center font-black text-xl text-[#155dfc] shrink-0">
								<img v-if="selectedUserModal?.profileImage" :src="selectedUserModal.profileImage" class="w-full h-full object-cover" alt="" />
								<span v-else>{{ getInitials(selectedUserModal?.fullName || "") }}</span>
							</div>
							<div>
								<h2 class="text-xl font-black">{{ selectedUserModal?.fullName }}</h2>
								<p class="text-xs text-[#8C9EFF]">{{ selectedUserModal?.email }}</p>
								<span class="inline-block mt-1 px-3 py-0.5 bg-[#81C784] text-gray-900 rounded-full text-[10px] font-black uppercase">
									{{ selectedUserModal?.role || 'USER' }}
								</span>
							</div>
						</div>
						<button @click="isUserModalOpen = false" class="p-2 text-white/70 hover:text-white rounded-full hover:bg-white/10 transition-colors z-10">
							<X class="w-6 h-6" />
						</button>
					</div>

					<!-- Corps Modale -->
					<div class="p-6 overflow-y-auto space-y-6 flex-1">
						<!-- Grille infos -->
						<div class="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-2xl text-xs">
							<div>
								<span class="text-gray-400 font-medium block mb-0.5">Statut</span>
								<span class="font-bold" :class="selectedUserModal?.status?.toUpperCase() === 'ACTIVE' ? 'text-emerald-600' : 'text-rose-500'">
									{{ getStatusLabel(selectedUserModal?.status || "") }}
								</span>
							</div>
							<div>
								<span class="text-gray-400 font-medium block mb-0.5">Téléphone</span>
								<span class="font-bold text-gray-800">{{ selectedUserModal?.phoneNumber || 'Non renseigné' }}</span>
							</div>
							<div>
								<span class="text-gray-400 font-medium block mb-0.5">Inscrit le</span>
								<span class="font-bold text-gray-800">{{ formatDate(selectedUserModal?.createdAt) }}</span>
							</div>
						</div>

						<!-- Modification du Rôle Utilisateur (3 rôles du système) -->
						<div class="bg-blue-50/50 border border-blue-100 p-4 rounded-2xl space-y-3">
							<div class="flex items-center justify-between">
								<span class="text-xs font-black text-gray-800 uppercase tracking-wider flex items-center gap-2">
									<Shield class="w-4 h-4 text-[#155dfc]" />
									Modifier le rôle de l'utilisateur
								</span>
								<span v-if="isUpdatingRole" class="text-[10px] text-[#155dfc] font-bold animate-pulse">
									Mise à jour du rôle...
								</span>
							</div>
							<div class="grid grid-cols-3 gap-2">
								<button
									@click="handleRoleChangeInModal('USER')"
									:disabled="isUpdatingRole"
									class="py-2.5 px-3 rounded-xl text-xs font-bold transition-all border text-center flex flex-col items-center justify-center gap-0.5"
									:class="selectedUserModal?.role === 'USER' || selectedUserModal?.role === 'CITIZEN' ? 'bg-[#155dfc] text-white border-[#155dfc] shadow-sm' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100'"
								>
									<span>Utilisateur</span>
									<span class="text-[9px] opacity-80 font-mono">USER</span>
								</button>
								<button
									@click="handleRoleChangeInModal('SUPPORT_AGENT')"
									:disabled="isUpdatingRole"
									class="py-2.5 px-3 rounded-xl text-xs font-bold transition-all border text-center flex flex-col items-center justify-center gap-0.5"
									:class="selectedUserModal?.role === 'SUPPORT_AGENT' ? 'bg-amber-600 text-white border-amber-600 shadow-sm' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100'"
								>
									<span>Agent Support</span>
									<span class="text-[9px] opacity-80 font-mono">SUPPORT_AGENT</span>
								</button>
								<button
									@click="handleRoleChangeInModal('ADMIN')"
									:disabled="isUpdatingRole"
									class="py-2.5 px-3 rounded-xl text-xs font-bold transition-all border text-center flex flex-col items-center justify-center gap-0.5"
									:class="selectedUserModal?.role === 'ADMIN' ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100'"
								>
									<span>Administrateur</span>
									<span class="text-[9px] opacity-80 font-mono">ADMIN</span>
								</button>
							</div>
						</div>

						<!-- Section Adresses créées par l'utilisateur -->
						<div>
							<div class="flex items-center justify-between mb-3">
								<h3 class="text-sm font-black text-gray-900 flex items-center gap-2">
									<MapPin class="w-4 h-4 text-[#155dfc]" />
									Adresses créées par cet utilisateur ({{ userAddressesTotalCount }})
								</h3>
							</div>

							<div v-if="isLoadingUserAddresses" class="py-8 text-center text-gray-400 text-xs">
								Chargement des adresses…
							</div>

							<div v-else-if="userAddressesList.length > 0" class="space-y-2.5">
								<div
									v-for="addr in userAddressesList"
									:key="addr.id"
									class="p-3.5 bg-white border border-gray-100 rounded-2xl flex items-center justify-between hover:bg-gray-50/80 transition-colors shadow-sm"
								>
									<div class="flex items-center gap-3">
										<div class="w-9 h-9 rounded-xl bg-blue-50 text-[#155dfc] flex items-center justify-center font-bold shrink-0">
											<MapPin class="w-4.5 h-4.5" />
										</div>
										<div>
											<p class="text-sm font-black text-[#155dfc]">{{ addr.addressCode || addr.id }}</p>
											<p class="text-xs text-gray-500">{{ addr.city }} · {{ addr.district }}, {{ addr.street }}</p>
										</div>
									</div>
									<span class="px-2.5 py-1 rounded-full text-[10px] font-black uppercase" :class="addr.status === 'ACTIVE' || addr.status === 'VALIDATED' ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'">
										{{ addr.status || 'Actif' }}
									</span>
								</div>

								<!-- Pagination adresses modal -->
								<div v-if="userAddressesTotalPages > 1" class="flex items-center justify-between pt-3 text-xs text-gray-500">
									<span>Page {{ userAddressesPage + 1 }} sur {{ userAddressesTotalPages }}</span>
									<div class="flex gap-1">
										<button
											@click="loadUserAddresses(selectedUserModal!.id, userAddressesPage - 1)"
											:disabled="userAddressesPage === 0"
											class="px-2.5 py-1 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40"
										>Précédent</button>
										<button
											@click="loadUserAddresses(selectedUserModal!.id, userAddressesPage + 1)"
											:disabled="userAddressesPage >= userAddressesTotalPages - 1"
											class="px-2.5 py-1 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40"
										>Suivant</button>
									</div>
								</div>
							</div>

							<div v-else class="py-8 text-center text-gray-400 text-xs bg-gray-50 rounded-2xl">
								Cet utilisateur n'a créé aucune adresse pour le moment.
							</div>
						</div>
					</div>

					<!-- Footer Modale -->
					<div class="p-4 border-t border-gray-100 flex justify-end shrink-0 bg-gray-50">
						<button @click="isUserModalOpen = false" class="px-6 py-2.5 bg-gray-900 text-white font-bold text-xs rounded-full hover:bg-gray-800 transition-colors">
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
