<script setup lang="ts">
import { computed, onMounted } from "vue";
import { Users, Map, AlertCircle, TrendingUp, MessageSquare, ExternalLink, CheckCircle, Clock } from "lucide-vue-next";
import { useAdminData } from "~/composables/useAdminData";

definePageMeta({
	layout: "dashboard-admin",
	middleware: ["admin"],
});

const {
	adminUsers, adminUsersMeta, isLoadingUsers, fetchAdminUsers,
	adminSupport, adminSupportMeta, isLoadingSupport, fetchAdminSupport,
	adminAddresses, adminAddressesMeta, isLoadingAddresses, fetchAdminAddresses,
	markSupportProcessed,
	getInitials, formatDate, formatTime,
} = useAdminData();

onMounted(async () => {
	await Promise.all([
		fetchAdminUsers(0, 10),
		fetchAdminAddresses(0, 1),
		fetchAdminSupport(undefined, 0, 10),
	]);
});

// Statistiques calculées depuis les vraies données
const totalUsers = computed(() => adminUsersMeta.value.totalElements);
const totalAddresses = computed(() => adminAddressesMeta.value.totalElements);
const urgentTickets = computed(() => adminSupport.value.filter(t => t.status === "PENDING").length);
const totalSupportTickets = computed(() => adminSupportMeta.value.totalElements);

const getInitials2 = (name: string) => getInitials(name);

const getUserStatusClass = (status: string) => {
	const s = (status || "").toUpperCase();
	if (s === "ACTIVE") return "bg-emerald-100 text-emerald-700";
	if (s === "BLOCKED") return "bg-rose-100 text-rose-600";
	return "bg-gray-100 text-gray-600";
};

const getUserStatusLabel = (status: string) => {
	const s = (status || "").toUpperCase();
	if (s === "ACTIVE") return "Actif";
	if (s === "BLOCKED") return "Bloqué";
	if (s === "PENDING_VERIFICATION") return "En attente";
	return status || "Inconnu";
};
</script>

<template>
	<div class="space-y-6">

		<!-- En-tête -->
		<div class="flex items-center justify-between">
			<div>
				<h1 class="text-3xl font-black text-[#155dfc] mb-1">Tableau de Bord</h1>
				<p class="text-sm text-gray-500 font-medium">Bienvenue, voici les activités récentes du système.</p>
			</div>
			<button class="px-5 py-2.5 bg-white border border-gray-200 rounded-full text-sm font-bold text-[#155dfc] hover:bg-gray-50 shadow-sm transition-all">
				Exporter Rapport
			</button>
		</div>

		<!-- Cartes Statistiques -->
		<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
			<!-- Carte 1 -->
			<div class="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition-all">
				<div class="flex justify-between items-start">
					<div>
						<p class="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Utilisateurs Totaux</p>
						<p class="text-4xl font-black text-[#155dfc] mb-2">
							<span v-if="isLoadingUsers" class="text-2xl text-gray-400">Chargement…</span>
							<span v-else>{{ totalUsers.toLocaleString("fr-FR") }}</span>
						</p>
						<p class="text-xs font-bold text-[#81C784] flex items-center gap-1">
							<TrendingUp class="w-3 h-3" /> Données live
						</p>
					</div>
					<div class="w-14 h-14 bg-[#F4F6F9] rounded-2xl flex items-center justify-center">
						<Users class="w-6 h-6 text-[#155dfc]" />
					</div>
				</div>
			</div>

			<!-- Carte 2 -->
			<div class="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition-all">
				<div class="flex justify-between items-start">
					<div>
						<p class="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Adresses Enregistrées</p>
						<p class="text-4xl font-black text-[#155dfc] mb-2">
							<span v-if="isLoadingAddresses" class="text-2xl text-gray-400">Chargement…</span>
							<span v-else>{{ totalAddresses.toLocaleString("fr-FR") }}</span>
						</p>
						<p class="text-xs font-bold text-gray-500">
							<span class="mr-1">⏱</span> Via répertoire adresses
						</p>
					</div>
					<div class="w-14 h-14 bg-[#E8F5E9] rounded-2xl flex items-center justify-center">
						<Map class="w-6 h-6 text-[#00bc7d]" />
					</div>
				</div>
			</div>

			<!-- Carte 3 -->
			<div class="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition-all">
				<div class="flex justify-between items-start">
					<div>
						<p class="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Tickets en attente</p>
						<p class="text-4xl font-black text-rose-600 mb-2">
							<span v-if="isLoadingSupport" class="text-2xl text-gray-400">Chargement…</span>
							<span v-else>{{ urgentTickets }}</span>
						</p>
						<p class="text-xs font-bold text-rose-500 flex items-center gap-1">
							<AlertCircle class="w-3 h-3" /> Sur {{ totalSupportTickets }} total
						</p>
					</div>
					<div class="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center">
						<AlertCircle class="w-6 h-6 text-rose-500" />
					</div>
				</div>
			</div>
		</div>

		<!-- Gestion des Utilisateurs (pleine largeur) -->
		<div class="bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col">
			<div class="p-6 border-b border-gray-100 flex items-center justify-between">
				<div>
					<h2 class="text-xl font-black text-[#155dfc]">Gestion des Utilisateurs</h2>
					<p class="text-xs text-gray-500 mt-1">Gérez les accès et les statuts des comptes.</p>
				</div>
				<button
					@click="navigateTo('/admin/users')"
					class="px-4 py-2 text-sm font-bold text-[#155dfc] bg-[#F4F6F9] hover:bg-[#e8eaf6] rounded-full transition-colors"
				>
					Voir tous
				</button>
			</div>

			<div class="overflow-x-auto">
				<table class="w-full text-left border-collapse min-w-[600px]">
					<thead>
						<tr class="bg-[#F8F9FB] text-[10px] font-black text-gray-400 uppercase tracking-wider">
							<th class="px-6 py-4 font-black">Utilisateur</th>
							<th class="px-6 py-4 font-black">Rôle</th>
							<th class="px-6 py-4 font-black">Statut</th>
							<th class="px-6 py-4 font-black">Inscrit le</th>
							<th class="px-6 py-4 font-black text-right">Action</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-gray-50">
						<!-- Loading skeleton -->
						<tr v-if="isLoadingUsers" v-for="n in 4" :key="'sk'+n" class="animate-pulse">
							<td class="px-6 py-4">
								<div class="flex items-center gap-3">
									<div class="w-10 h-10 rounded-full bg-gray-200"></div>
									<div class="space-y-1.5">
										<div class="h-3 bg-gray-200 rounded w-32"></div>
										<div class="h-2 bg-gray-200 rounded w-40"></div>
									</div>
								</div>
							</td>
							<td class="px-6 py-4"><div class="h-5 bg-gray-200 rounded-full w-20"></div></td>
							<td class="px-6 py-4"><div class="h-5 bg-gray-200 rounded-full w-16"></div></td>
							<td class="px-6 py-4"><div class="h-3 bg-gray-200 rounded w-24"></div></td>
							<td class="px-6 py-4 text-right"><div class="h-8 w-8 bg-gray-200 rounded-full ml-auto"></div></td>
						</tr>
						<!-- Données réelles -->
						<tr v-else v-for="user in adminUsers" :key="user.id" class="hover:bg-gray-50/50 transition-colors group">
							<td class="px-6 py-4">
								<div class="flex items-center gap-3">
									<div class="w-10 h-10 rounded-full bg-[#E8EAF6] text-[#155dfc] flex items-center justify-center font-black text-sm overflow-hidden shrink-0">
										<img v-if="user.profileImage" :src="user.profileImage" class="w-full h-full object-cover" alt="" />
										<span v-else>{{ getInitials2(user.fullName) }}</span>
									</div>
									<div>
										<p class="text-sm font-black text-[#155dfc]">{{ user.fullName }}</p>
										<p class="text-xs text-gray-500">{{ user.email }}</p>
									</div>
								</div>
							</td>
							<td class="px-6 py-4">
								<span class="px-2.5 py-1 rounded-md text-[10px] font-black tracking-wide uppercase"
									:class="user.role === 'ADMIN' ? 'bg-indigo-100 text-indigo-700' : user.role === 'SUPPORT_AGENT' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'"
								>
									{{ user.role || 'USER' }}
								</span>
							</td>
							<td class="px-6 py-4">
								<span class="px-3 py-1 rounded-full text-[10px] font-black tracking-wider" :class="getUserStatusClass(user.status)">
									{{ getUserStatusLabel(user.status) }}
								</span>
							</td>
							<td class="px-6 py-4 text-xs text-gray-500 font-medium">
								{{ formatDate(user.createdAt) }}
							</td>
							<td class="px-6 py-4 text-right">
								<button @click="navigateTo('/admin/users')" class="p-2 text-gray-400 hover:text-[#155dfc] bg-gray-50 hover:bg-[#E8EAF6] rounded-full transition-colors">
									<ExternalLink class="w-4 h-4" />
								</button>
							</td>
						</tr>
						<!-- Empty state -->
						<tr v-if="!isLoadingUsers && adminUsers.length === 0">
							<td colspan="5" class="px-6 py-10 text-center text-gray-400 text-sm">
								Aucun utilisateur trouvé.
							</td>
						</tr>
					</tbody>
				</table>
			</div>

			<div class="p-4 border-t border-gray-100 flex items-center justify-between">
				<p class="text-xs text-gray-500 font-medium">{{ totalUsers.toLocaleString("fr-FR") }} utilisateurs au total</p>
				<button @click="navigateTo('/admin/users')" class="text-xs font-bold text-[#155dfc] hover:underline">Gérer tous les utilisateurs →</button>
			</div>
		</div>

		<!-- Gestion des Supports (sous Utilisateurs) -->
		<div class="bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col">
			<div class="p-6 border-b border-gray-100 flex items-center justify-between">
				<div>
					<h2 class="text-xl font-black text-[#155dfc]">Gestion des Supports</h2>
					<p class="text-xs text-gray-500 mt-1">Tickets de support récents avec statuts en temps réel.</p>
				</div>
				<div class="flex items-center gap-3">
					<span class="px-3 py-1 rounded-full text-[10px] font-black bg-rose-100 text-rose-600">
						{{ urgentTickets }} en attente
					</span>
					<button @click="navigateTo('/admin/support')" class="px-4 py-2 text-sm font-bold text-[#155dfc] bg-[#F4F6F9] hover:bg-[#e8eaf6] rounded-full transition-colors">
						Voir tous
					</button>
				</div>
			</div>

			<div class="overflow-x-auto">
				<table class="w-full text-left border-collapse min-w-[700px]">
					<thead>
						<tr class="bg-[#F8F9FB] text-[10px] font-black text-gray-400 uppercase tracking-wider">
							<th class="px-6 py-4 font-black">Utilisateur</th>
							<th class="px-6 py-4 font-black">Message</th>
							<th class="px-6 py-4 font-black">Statut</th>
							<th class="px-6 py-4 font-black">Date</th>
							<th class="px-6 py-4 font-black text-right">Action</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-gray-50">
						<!-- Loading skeleton -->
						<tr v-if="isLoadingSupport" v-for="n in 4" :key="'sks'+n" class="animate-pulse">
							<td class="px-6 py-4">
								<div class="flex items-center gap-3">
									<div class="w-10 h-10 rounded-full bg-gray-200"></div>
									<div class="space-y-1.5"><div class="h-3 bg-gray-200 rounded w-28"></div><div class="h-2 bg-gray-200 rounded w-36"></div></div>
								</div>
							</td>
							<td class="px-6 py-4"><div class="h-3 bg-gray-200 rounded w-48"></div></td>
							<td class="px-6 py-4"><div class="h-5 bg-gray-200 rounded-full w-20"></div></td>
							<td class="px-6 py-4"><div class="h-3 bg-gray-200 rounded w-24"></div></td>
							<td class="px-6 py-4 text-right"><div class="h-8 w-24 bg-gray-200 rounded-full ml-auto"></div></td>
						</tr>
						<!-- Données réelles -->
						<tr v-else v-for="ticket in adminSupport" :key="ticket.id" class="hover:bg-gray-50/50 transition-colors">
							<td class="px-6 py-4">
								<div class="flex items-center gap-3">
									<div class="w-10 h-10 rounded-full flex items-center justify-center font-black text-sm text-white shrink-0"
										:class="ticket.status === 'PENDING' ? 'bg-[#155dfc]' : 'bg-[#81C784]'"
									>
										{{ getInitials2(ticket.userFullName || ticket.name) }}
									</div>
									<div>
										<p class="text-sm font-black text-gray-900">{{ ticket.userFullName || ticket.name }}</p>
										<p class="text-xs text-gray-500">{{ ticket.email }}</p>
									</div>
								</div>
							</td>
							<td class="px-6 py-4 max-w-xs">
								<p class="text-sm text-gray-700 truncate">{{ ticket.message }}</p>
							</td>
							<td class="px-6 py-4">
								<span class="px-3 py-1 rounded-full text-[10px] font-black tracking-wider"
									:class="ticket.status === 'PENDING' ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-700'"
								>
									{{ ticket.status === 'PENDING' ? 'En attente' : 'Traité' }}
								</span>
							</td>
							<td class="px-6 py-4 text-xs text-gray-500 font-medium">
								{{ formatDate(ticket.createdAt) }}
							</td>
							<td class="px-6 py-4 text-right">
								<button
									v-if="ticket.status === 'PENDING'"
									@click="markSupportProcessed(ticket.id)"
									class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-[11px] rounded-full transition-colors"
								>
									<CheckCircle class="w-3.5 h-3.5" /> Traiter
								</button>
								<span v-else class="inline-flex items-center gap-1.5 text-gray-400 text-[11px] font-medium">
									<CheckCircle class="w-3.5 h-3.5 text-emerald-500" /> Clôturé
								</span>
							</td>
						</tr>
						<!-- Empty state -->
						<tr v-if="!isLoadingSupport && adminSupport.length === 0">
							<td colspan="5" class="px-6 py-10 text-center text-gray-400 text-sm">
								Aucun ticket de support trouvé.
							</td>
						</tr>
					</tbody>
				</table>
			</div>

			<div class="p-4 border-t border-gray-100 flex items-center justify-between">
				<p class="text-xs text-gray-500 font-medium">{{ totalSupportTickets }} tickets au total</p>
				<button @click="navigateTo('/admin/support')" class="text-xs font-bold text-[#155dfc] hover:underline">Gérer tous les supports →</button>
			</div>
		</div>

	</div>
</template>
