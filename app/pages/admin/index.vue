<!--
  @file app/pages/admin/index.vue
  @description Vue d'ensemble du Dashboard Administrateur — design glassmorphism à ton uni émeraude (#00bc7d) et bleu nuit (#0A0D1A) avec squelettes (SkeletonUI).
-->

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { Users, Map, AlertCircle, TrendingUp, MessageSquare, ExternalLink, CheckCircle, Clock } from "lucide-vue-next";
import SkeletonUI from "~/components/ui/SkeletonUI.vue";
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
	if (s === "ACTIVE") return "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20";
	if (s === "BLOCKED") return "bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800";
	return "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700";
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
	<div class="space-y-6 max-w-7xl mx-auto w-full animate-in fade-in duration-500 text-slate-900 dark:text-white">

		<!-- En-tête -->
		<div class="flex items-center justify-between flex-wrap gap-4">
			<div>
				<h1 class="text-3xl font-black font-serif text-slate-900 dark:text-white mb-1">Tableau de Bord Administrateur</h1>
				<p class="text-sm font-medium text-slate-600 dark:text-slate-300">Aperçu général et monitoring en temps réel du système FindMe.</p>
			</div>
			<button class="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-full shadow-md transition-all cursor-pointer">
				Exporter Rapport PDF
			</button>
		</div>

		<!-- Cartes Statistiques -->
		<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
			<!-- Carte 1 -->
			<div class="bg-white/80 dark:bg-[#0A0D1A]/80 backdrop-blur-2xl rounded-[32px] p-6 shadow-xl border border-slate-200/80 dark:border-slate-800 relative overflow-hidden group">
				<div class="flex justify-between items-start">
					<div>
						<p class="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">Utilisateurs Totaux</p>
						<p class="text-4xl font-black text-slate-900 dark:text-white mb-2">
							<SkeletonUI v-if="isLoadingUsers" width="w-24" height="h-9" />
							<span v-else>{{ totalUsers.toLocaleString("fr-FR") }}</span>
						</p>
						<p class="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
							<TrendingUp class="w-3.5 h-3.5" /> Données live
						</p>
					</div>
					<div class="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center border border-emerald-500/20">
						<Users class="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
					</div>
				</div>
			</div>

			<!-- Carte 2 -->
			<div class="bg-white/80 dark:bg-[#0A0D1A]/80 backdrop-blur-2xl rounded-[32px] p-6 shadow-xl border border-slate-200/80 dark:border-slate-800 relative overflow-hidden group">
				<div class="flex justify-between items-start">
					<div>
						<p class="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">Adresses Enregistrées</p>
						<p class="text-4xl font-black text-slate-900 dark:text-white mb-2">
							<SkeletonUI v-if="isLoadingAddresses" width="w-24" height="h-9" />
							<span v-else>{{ totalAddresses.toLocaleString("fr-FR") }}</span>
						</p>
						<p class="text-xs font-bold text-slate-500 dark:text-slate-400">
							<span class="mr-1">⏱</span> Cadastre certifié
						</p>
					</div>
					<div class="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center border border-emerald-500/20">
						<Map class="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
					</div>
				</div>
			</div>

			<!-- Carte 3 -->
			<div class="bg-white/80 dark:bg-[#0A0D1A]/80 backdrop-blur-2xl rounded-[32px] p-6 shadow-xl border border-rose-200/80 dark:border-rose-900/50 relative overflow-hidden group">
				<div class="flex justify-between items-start">
					<div>
						<p class="text-[10px] font-black text-rose-600 dark:text-rose-400 uppercase tracking-widest mb-1">Tickets en attente</p>
						<p class="text-4xl font-black text-rose-600 dark:text-rose-400 mb-2">
							<SkeletonUI v-if="isLoadingSupport" width="w-24" height="h-9" />
							<span v-else>{{ urgentTickets }}</span>
						</p>
						<p class="text-xs font-bold text-rose-500 flex items-center gap-1">
							<AlertCircle class="w-3.5 h-3.5" /> Sur {{ totalSupportTickets }} total
						</p>
					</div>
					<div class="w-14 h-14 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-2xl flex items-center justify-center">
						<AlertCircle class="w-6 h-6 text-rose-500" />
					</div>
				</div>
			</div>
		</div>

		<!-- Gestion des Utilisateurs (pleine largeur) -->
		<div class="bg-white/80 dark:bg-[#0A0D1A]/80 backdrop-blur-2xl rounded-[32px] border border-slate-200/80 dark:border-slate-800 shadow-xl flex flex-col overflow-hidden">
			<div class="p-6 border-b border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
				<div>
					<h2 class="text-xl font-black font-serif text-slate-900 dark:text-white">Gestion des Utilisateurs</h2>
					<p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Gérez les accès et les statuts des comptes.</p>
				</div>
				<button
					@click="navigateTo('/admin/users')"
					class="px-4 py-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
				>
					Voir tous
				</button>
			</div>

			<div class="overflow-x-auto">
				<table class="w-full text-left border-collapse min-w-[600px]">
					<thead>
						<tr class="bg-slate-50/70 dark:bg-slate-900/60 text-[10px] font-black text-slate-400 uppercase tracking-wider border-b border-slate-200/60 dark:border-slate-800">
							<th class="px-6 py-4 font-black">Utilisateur</th>
							<th class="px-6 py-4 font-black">Rôle</th>
							<th class="px-6 py-4 font-black">Statut</th>
							<th class="px-6 py-4 font-black">Inscrit le</th>
							<th class="px-6 py-4 font-black text-right">Action</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-slate-200/60 dark:divide-slate-800">
						<!-- Loading skeleton -->
						<tr v-if="isLoadingUsers" v-for="n in 4" :key="'sk'+n">
							<td class="px-6 py-4">
								<div class="flex items-center gap-3">
									<SkeletonUI width="w-10" height="h-10" rounded="rounded-full" />
									<div class="space-y-1.5">
										<SkeletonUI width="w-32" height="h-4" />
										<SkeletonUI width="w-40" height="h-3" />
									</div>
								</div>
							</td>
							<td class="px-6 py-4"><SkeletonUI width="w-20" height="h-5" rounded="rounded-md" /></td>
							<td class="px-6 py-4"><SkeletonUI width="w-16" height="h-5" rounded="rounded-full" /></td>
							<td class="px-6 py-4"><SkeletonUI width="w-24" height="h-3" /></td>
							<td class="px-6 py-4 text-right"><SkeletonUI width="w-8" height="h-8" rounded="rounded-full" class="ml-auto" /></td>
						</tr>
						<!-- Données réelles -->
						<tr v-else v-for="user in adminUsers" :key="user.id" class="hover:bg-slate-50 dark:hover:bg-slate-900/60 transition-colors group">
							<td class="px-6 py-4">
								<div class="flex items-center gap-3">
									<div class="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-black text-sm overflow-hidden shrink-0">
										<img v-if="user.profileImage" :src="user.profileImage" class="w-full h-full object-cover" alt="" />
										<span v-else>{{ getInitials2(user.fullName) }}</span>
									</div>
									<div>
										<p class="text-sm font-black text-slate-900 dark:text-white">{{ user.fullName }}</p>
										<p class="text-xs text-slate-500 dark:text-slate-400">{{ user.email }}</p>
									</div>
								</div>
							</td>
							<td class="px-6 py-4">
								<span class="px-2.5 py-1 rounded-md text-[10px] font-black tracking-wide uppercase"
									:class="user.role === 'ADMIN' ? 'bg-slate-900 text-white dark:bg-slate-800' : user.role === 'SUPPORT_AGENT' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200'"
								>
									{{ user.role || 'USER' }}
								</span>
							</td>
							<td class="px-6 py-4">
								<span class="px-3 py-1 rounded-full text-[10px] font-black tracking-wider" :class="getUserStatusClass(user.status)">
									{{ getUserStatusLabel(user.status) }}
								</span>
							</td>
							<td class="px-6 py-4 text-xs text-slate-500 dark:text-slate-400 font-medium">
								{{ formatDate(user.createdAt) }}
							</td>
							<td class="px-6 py-4 text-right">
								<button @click="navigateTo('/admin/users')" class="p-2 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 bg-slate-100 dark:bg-slate-900 rounded-full transition-colors cursor-pointer">
									<ExternalLink class="w-4 h-4" />
								</button>
							</td>
						</tr>
						<!-- Empty state -->
						<tr v-if="!isLoadingUsers && adminUsers.length === 0">
							<td colspan="5" class="px-6 py-10 text-center text-slate-400 text-sm">
								Aucun utilisateur trouvé.
							</td>
						</tr>
					</tbody>
				</table>
			</div>

			<div class="p-4 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
				<p class="text-xs text-slate-500 dark:text-slate-400 font-medium">{{ totalUsers.toLocaleString("fr-FR") }} utilisateurs au total</p>
				<button @click="navigateTo('/admin/users')" class="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer">Gérer tous les utilisateurs →</button>
			</div>
		</div>

		<!-- Gestion des Supports (sous Utilisateurs) -->
		<div class="bg-white/80 dark:bg-[#0A0D1A]/80 backdrop-blur-2xl rounded-[32px] border border-slate-200/80 dark:border-slate-800 shadow-xl flex flex-col overflow-hidden">
			<div class="p-6 border-b border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
				<div>
					<h2 class="text-xl font-black font-serif text-slate-900 dark:text-white">Gestion des Supports</h2>
					<p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Tickets de support récents avec statuts en temps réel.</p>
				</div>
				<div class="flex items-center gap-3">
					<span class="px-3 py-1 rounded-full text-[10px] font-black bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
						{{ urgentTickets }} en attente
					</span>
					<button @click="navigateTo('/admin/support')" class="px-4 py-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors cursor-pointer">
						Voir tous
					</button>
				</div>
			</div>

			<div class="overflow-x-auto">
				<table class="w-full text-left border-collapse min-w-[700px]">
					<thead>
						<tr class="bg-slate-50/70 dark:bg-slate-900/60 text-[10px] font-black text-slate-400 uppercase tracking-wider border-b border-slate-200/60 dark:border-slate-800">
							<th class="px-6 py-4 font-black">Utilisateur</th>
							<th class="px-6 py-4 font-black">Message</th>
							<th class="px-6 py-4 font-black">Statut</th>
							<th class="px-6 py-4 font-black">Date</th>
							<th class="px-6 py-4 font-black text-right">Action</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-slate-200/60 dark:divide-slate-800">
						<!-- Loading skeleton -->
						<tr v-if="isLoadingSupport" v-for="n in 4" :key="'sks'+n">
							<td class="px-6 py-4">
								<div class="flex items-center gap-3">
									<SkeletonUI width="w-10" height="h-10" rounded="rounded-full" />
									<div class="space-y-1.5"><SkeletonUI width="w-28" height="h-3" /><SkeletonUI width="w-36" height="h-2" /></div>
								</div>
							</td>
							<td class="px-6 py-4"><SkeletonUI width="w-48" height="h-3" /></td>
							<td class="px-6 py-4"><SkeletonUI width="w-20" height="h-5" rounded="rounded-full" /></td>
							<td class="px-6 py-4"><SkeletonUI width="w-24" height="h-3" /></td>
							<td class="px-6 py-4 text-right"><SkeletonUI width="w-24" height="h-8" rounded="rounded-full" class="ml-auto" /></td>
						</tr>
						<!-- Données réelles -->
						<tr v-else v-for="ticket in adminSupport" :key="ticket.id" class="hover:bg-slate-50 dark:hover:bg-slate-900/60 transition-colors">
							<td class="px-6 py-4">
								<div class="flex items-center gap-3">
									<div class="w-10 h-10 rounded-full flex items-center justify-center font-black text-sm text-white shrink-0"
										:class="ticket.status === 'PENDING' ? 'bg-rose-500' : 'bg-emerald-600'"
									>
										{{ getInitials2(ticket.userFullName || ticket.name) }}
									</div>
									<div>
										<p class="text-sm font-black text-slate-900 dark:text-white">{{ ticket.userFullName || ticket.name }}</p>
										<p class="text-xs text-slate-500 dark:text-slate-400">{{ ticket.email }}</p>
									</div>
								</div>
							</td>
							<td class="px-6 py-4 max-w-xs">
								<p class="text-sm text-slate-800 dark:text-slate-200 truncate">{{ ticket.message }}</p>
							</td>
							<td class="px-6 py-4">
								<span class="px-3 py-1 rounded-full text-[10px] font-black tracking-wider uppercase border"
									:class="ticket.status === 'PENDING' ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800' : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20'"
								>
									{{ ticket.status === 'PENDING' ? 'En attente' : 'Traité' }}
								</span>
							</td>
							<td class="px-6 py-4 text-xs text-slate-500 dark:text-slate-400 font-medium">
								{{ formatDate(ticket.createdAt) }}
							</td>
							<td class="px-6 py-4 text-right">
								<button
									v-if="ticket.status === 'PENDING'"
									@click="markSupportProcessed(ticket.id)"
									class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] rounded-full transition-colors cursor-pointer shadow-xs"
								>
									<CheckCircle class="w-3.5 h-3.5" /> Traiter
								</button>
								<span v-else class="inline-flex items-center gap-1.5 text-slate-400 text-[11px] font-medium">
									<CheckCircle class="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Clôturé
								</span>
							</td>
						</tr>
						<!-- Empty state -->
						<tr v-if="!isLoadingSupport && adminSupport.length === 0">
							<td colspan="5" class="px-6 py-10 text-center text-slate-400 text-sm">
								Aucun ticket de support trouvé.
							</td>
						</tr>
					</tbody>
				</table>
			</div>

			<div class="p-4 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
				<p class="text-xs text-slate-500 dark:text-slate-400 font-medium">{{ totalSupportTickets }} tickets au total</p>
				<button @click="navigateTo('/admin/support')" class="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer">Gérer tous les supports →</button>
			</div>
		</div>

	</div>
</template>
