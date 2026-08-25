<!--
  @file app/pages/admin/support/index.vue
  @description Page de gestion des tickets de support client pour l'Administrateur — design glassmorphism à ton uni émeraude (#00bc7d) et bleu nuit (#0A0D1A) avec squelettes (SkeletonUI).
-->

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { Filter, Send, CheckCircle, RefreshCcw, MoreVertical, User as UserIcon, MapPin, ChevronLeft, ChevronRight, MessageSquare, X, Mail, Clock, Eye } from "lucide-vue-next";
import SkeletonUI from "~/components/ui/SkeletonUI.vue";
import { useAdminData } from "~/composables/useAdminData";
import type { SupportStatus, AdminSupportDTO } from "~/composables/useAdminData";

definePageMeta({
	layout: "dashboard-admin",
	middleware: ["admin"],
});

const {
	adminSupport, adminSupportMeta, isLoadingSupport, fetchAdminSupport,
	markSupportProcessed, updateSupportStatus,
	getInitials, formatDate, formatTime,
} = useAdminData();

const filterStatus = ref<SupportStatus | "">("");

// Modal de traitement du ticket
const isSupportModalOpen = ref(false);
const activeTicket = ref<AdminSupportDTO | null>(null);
const replyText = ref("");
const isSubmittingReply = ref(false);

onMounted(() => fetchAdminSupport(undefined, 0, 20));

const filteredTickets = computed(() => {
	if (!filterStatus.value) return adminSupport.value;
	return adminSupport.value.filter((t) => t.status === filterStatus.value);
});

const pendingCount = computed(() => adminSupport.value.filter(t => t.status === "PENDING").length);
const processedCount = computed(() => adminSupport.value.filter(t => t.status === "PROCESSED").length);

const applyFilter = (status: SupportStatus | "") => {
	filterStatus.value = status;
	fetchAdminSupport(status || undefined, 0, 20);
};

const openSupportModal = (ticket: AdminSupportDTO) => {
	activeTicket.value = ticket;
	replyText.value = "";
	isSupportModalOpen.value = true;
};

const handleMarkProcessedInModal = async () => {
	if (!activeTicket.value) return;
	isSubmittingReply.value = true;
	await markSupportProcessed(activeTicket.value.id);
	activeTicket.value.status = "PROCESSED";
	isSubmittingReply.value = false;
};

const handleChangeStatusInModal = async (newStatus: SupportStatus) => {
	if (!activeTicket.value) return;
	isSubmittingReply.value = true;
	await updateSupportStatus(activeTicket.value.id, newStatus);
	activeTicket.value.status = newStatus;
	isSubmittingReply.value = false;
};

const formatJustDate = (iso?: string) => {
	if (!iso) return "—";
	const d = new Date(iso);
	if (isNaN(d.getTime())) return iso;
	return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" }).toUpperCase();
};

const goToPage = (page: number) => {
	if (page < 0 || page >= adminSupportMeta.value.totalPages) return;
	fetchAdminSupport(filterStatus.value || undefined, page, 20);
};
</script>

<template>
	<div class="space-y-6 max-w-7xl mx-auto w-full animate-in fade-in duration-500 text-slate-900 dark:text-white">

		<!-- HEADER & STATS -->
		<div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
			<div>
				<p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Admin / Support Client</p>
				<h1 class="text-3xl font-black font-serif text-slate-900 dark:text-white">Gestion du Support Client</h1>
			</div>

			<div class="flex items-center gap-4">
				<div class="bg-white/80 dark:bg-[#0A0D1A]/80 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 min-w-[120px] shadow-sm">
					<p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total</p>
					<p class="text-2xl font-black text-slate-900 dark:text-white">
						<SkeletonUI v-if="isLoadingSupport" width="w-16" height="h-7" />
						<span v-else>{{ adminSupportMeta.totalElements.toLocaleString("fr-FR") }}</span>
					</p>
				</div>
				<div class="bg-white/80 dark:bg-[#0A0D1A]/80 border border-rose-200/80 dark:border-rose-900/50 rounded-2xl p-4 min-w-[120px] shadow-sm">
					<p class="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-1">En attente</p>
					<p class="text-2xl font-black text-rose-600 dark:text-rose-400">
						<SkeletonUI v-if="isLoadingSupport" width="w-16" height="h-7" />
						<span v-else>{{ pendingCount }}</span>
					</p>
				</div>
				<div class="bg-emerald-600 text-white rounded-2xl p-4 min-w-[120px] shadow-md">
					<p class="text-[10px] font-black text-emerald-100 uppercase tracking-widest mb-1">Traités</p>
					<p class="text-2xl font-black text-white">
						<SkeletonUI v-if="isLoadingSupport" width="w-16" height="h-7" class="bg-emerald-500/50" />
						<span v-else>{{ processedCount }}</span>
					</p>
				</div>
			</div>
		</div>

		<!-- LISTE DU SUPPORT PLEINE LARGEUR -->
		<div class="bg-white/80 dark:bg-[#0A0D1A]/80 backdrop-blur-2xl rounded-[32px] border border-slate-200/80 dark:border-slate-800 shadow-xl flex flex-col overflow-hidden w-full">

			<!-- Filtres de liste -->
			<div class="p-5 border-b border-slate-200/60 dark:border-slate-800 flex items-center justify-between flex-wrap gap-4">
				<div class="flex items-center gap-3">
					<span class="text-sm font-black text-slate-900 dark:text-white">Tous les tickets</span>
					<div class="flex bg-slate-100 dark:bg-slate-900 rounded-full p-1 border border-slate-200/80 dark:border-slate-800">
						<button
							class="px-4 py-1.5 text-xs font-bold rounded-full transition-all cursor-pointer"
							:class="filterStatus === '' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'"
							@click="applyFilter('')"
						>Tous</button>
						<button
							class="px-4 py-1.5 text-xs font-bold rounded-full transition-all cursor-pointer"
							:class="filterStatus === 'PENDING' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'"
							@click="applyFilter('PENDING')"
						>En attente ({{ pendingCount }})</button>
						<button
							class="px-4 py-1.5 text-xs font-bold rounded-full transition-all cursor-pointer"
							:class="filterStatus === 'PROCESSED' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'"
							@click="applyFilter('PROCESSED')"
						>Traités ({{ processedCount }})</button>
					</div>
				</div>
			</div>

			<!-- Tableau pleine largeur des messages -->
			<div class="overflow-x-auto">
				<table class="w-full text-left border-collapse min-w-[800px]">
					<thead>
						<tr class="bg-slate-50/70 dark:bg-slate-900/60 text-[10px] font-black text-slate-400 uppercase tracking-wider border-b border-slate-200/60 dark:border-slate-800">
							<th class="px-6 py-4">Utilisateur</th>
							<th class="px-6 py-4">Email</th>
							<th class="px-6 py-4">Message</th>
							<th class="px-6 py-4">Statut</th>
							<th class="px-6 py-4">Date</th>
							<th class="px-6 py-4 text-right">Détails</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-slate-200/60 dark:divide-slate-800">
						<!-- Loading skeletons -->
						<tr v-if="isLoadingSupport" v-for="n in 6" :key="'sk'+n">
							<td class="px-6 py-4">
								<div class="flex items-center gap-3">
									<SkeletonUI width="w-10" height="h-10" rounded="rounded-full" />
									<SkeletonUI width="w-32" height="h-4" />
								</div>
							</td>
							<td class="px-6 py-4"><SkeletonUI width="w-36" height="h-4" /></td>
							<td class="px-6 py-4"><SkeletonUI width="w-64" height="h-4" /></td>
							<td class="px-6 py-4"><SkeletonUI width="w-20" height="h-6" rounded="rounded-full" /></td>
							<td class="px-6 py-4"><SkeletonUI width="w-20" height="h-4" /></td>
							<td class="px-6 py-4 text-right"><SkeletonUI width="w-20" height="h-8" rounded="rounded-full" class="ml-auto" /></td>
						</tr>
						<!-- Données réelles -->
						<tr
							v-else
							v-for="ticket in filteredTickets"
							:key="ticket.id"
							class="hover:bg-slate-50 dark:hover:bg-slate-900/60 transition-colors group"
						>
							<!-- Utilisateur -->
							<td class="px-6 py-4">
								<div class="flex items-center gap-3">
									<div
										class="w-10 h-10 rounded-full text-white flex items-center justify-center font-bold text-sm shrink-0"
										:class="ticket.status === 'PENDING' ? 'bg-rose-500' : 'bg-emerald-600'"
									>
										{{ getInitials(ticket.userFullName || ticket.name) }}
									</div>
									<div>
										<p class="text-sm font-black text-slate-900 dark:text-white">{{ ticket.userFullName || ticket.name }}</p>
										<p class="text-[10px] text-slate-400 font-mono">Ticket #{{ ticket.id }}</p>
									</div>
								</div>
							</td>

							<!-- Email -->
							<td class="px-6 py-4 text-xs font-semibold text-slate-600 dark:text-slate-300">
								{{ ticket.email }}
							</td>

							<!-- Snippet Message -->
							<td class="px-6 py-4 max-w-md">
								<p class="text-sm text-slate-800 dark:text-slate-200 line-clamp-2 leading-snug">{{ ticket.message }}</p>
							</td>

							<!-- Statut -->
							<td class="px-6 py-4">
								<span
									class="px-3 py-1 rounded-full text-[10px] font-black tracking-wider uppercase border"
									:class="ticket.status === 'PENDING' ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800' : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20'"
								>
									{{ ticket.status === 'PENDING' ? 'En attente' : 'Traité' }}
								</span>
							</td>

							<!-- Date -->
							<td class="px-6 py-4 text-xs text-slate-500 dark:text-slate-400 font-medium">
								{{ formatDate(ticket.createdAt) }}
							</td>

							<!-- Bouton Détails -->
							<td class="px-6 py-4 text-right">
								<button
									@click="openSupportModal(ticket)"
									class="inline-flex items-center gap-1.5 px-4 py-2 font-bold text-xs rounded-full bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-xs cursor-pointer"
								>
									<Eye class="w-3.5 h-3.5" />
									Détails
								</button>
							</td>
						</tr>
						<!-- Empty state -->
						<tr v-if="!isLoadingSupport && filteredTickets.length === 0">
							<td colspan="6" class="px-6 py-12 text-center text-slate-400 text-sm">
								Aucun ticket de support trouvé.
							</td>
						</tr>
					</tbody>
				</table>
			</div>

			<!-- Pagination -->
			<div class="p-4 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-[#0A0D1A] rounded-b-3xl">
				<p class="text-xs text-slate-500 dark:text-slate-400 font-medium">
					Affichage de {{ filteredTickets.length }} sur {{ adminSupportMeta.totalElements.toLocaleString("fr-FR") }} tickets
				</p>
				<div class="flex items-center gap-1" v-if="adminSupportMeta.totalPages > 1">
					<button
						@click="goToPage(adminSupportMeta.currentPage - 1)"
						:disabled="adminSupportMeta.currentPage === 0"
						class="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 cursor-pointer"
					>
						<ChevronLeft class="w-4 h-4" />
					</button>
					<button
						v-for="p in Math.min(adminSupportMeta.totalPages, 5)"
						:key="p-1"
						@click="goToPage(p-1)"
						class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors cursor-pointer"
						:class="adminSupportMeta.currentPage === p-1 ? 'bg-emerald-600 text-white shadow-xs' : 'border border-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'"
					>
						{{ p }}
					</button>
					<button
						@click="goToPage(adminSupportMeta.currentPage + 1)"
						:disabled="adminSupportMeta.currentPage >= adminSupportMeta.totalPages - 1"
						class="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 cursor-pointer"
					>
						<ChevronRight class="w-4 h-4" />
					</button>
				</div>
			</div>
		</div>

		<!-- MODALE / ESPACE TRAITEMENT MESSAGE DE SUPPORT -->
		<Transition name="fade">
			<div v-if="isSupportModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
				<div class="bg-white dark:bg-[#0A0D1A] border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200 text-slate-900 dark:text-white">
					
					<!-- Header de la conversation -->
					<div class="bg-emerald-600 text-white p-6 relative shrink-0">
						<div class="flex justify-between items-start mb-3">
							<span class="px-2.5 py-0.5 bg-white/20 rounded-md text-[10px] font-black tracking-widest uppercase">
								TICKET #{{ activeTicket?.id }}
							</span>
							<div class="flex items-center gap-2">
								<span
									class="px-3 py-1 rounded-full text-[10px] font-black uppercase"
									:class="activeTicket?.status === 'PENDING' ? 'bg-rose-500 text-white' : 'bg-emerald-700 text-white'"
								>
									{{ activeTicket?.status === 'PENDING' ? 'En attente' : 'Traité' }}
								</span>
								<button @click="isSupportModalOpen = false" class="p-1 text-white/70 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer">
									<X class="w-6 h-6" />
								</button>
							</div>
						</div>
						<h2 class="text-xl font-black font-serif mb-2">Message de support client</h2>
						<div class="flex items-center gap-6 text-xs text-white/90 font-medium">
							<div class="flex items-center gap-1.5">
								<UserIcon class="w-3.5 h-3.5" />
								{{ activeTicket?.userFullName || activeTicket?.name }}
							</div>
							<div class="flex items-center gap-1.5">
								<Mail class="w-3.5 h-3.5" />
								{{ activeTicket?.email }}
							</div>
						</div>
					</div>

					<!-- Zone de conversation (Message utilisateur) -->
					<div class="flex-1 overflow-y-auto p-6 bg-slate-50 dark:bg-slate-900/60 flex flex-col gap-5">
						<div class="flex justify-center">
							<span class="px-3 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">
								{{ formatJustDate(activeTicket?.createdAt) }}
							</span>
						</div>

						<!-- Message de l'utilisateur -->
						<div class="flex flex-col gap-1 max-w-[85%] self-start">
							<div class="bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 p-4 rounded-2xl rounded-tl-sm shadow-xs text-sm text-slate-900 dark:text-white whitespace-pre-wrap leading-relaxed">
								{{ activeTicket?.message }}
							</div>
							<span class="text-[9px] font-medium text-slate-400 ml-1">
								{{ formatTime(activeTicket?.createdAt) }} · Envoyé par {{ activeTicket?.userFullName || activeTicket?.name }}
							</span>
						</div>
					</div>

					<!-- Formulaire de réponse et action de traitement -->
					<div class="bg-white dark:bg-[#0A0D1A] border-t border-slate-200/60 dark:border-slate-800 p-6 shrink-0 space-y-4">
						<!-- Contrôle du statut du ticket -->
						<div class="flex items-center justify-between bg-slate-50 dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800">
							<span class="text-xs font-bold text-slate-700 dark:text-slate-300">Changer le statut du ticket :</span>
							<div class="flex items-center gap-2">
								<button
									@click="handleChangeStatusInModal('PENDING')"
									:disabled="isSubmittingReply"
									class="px-3 py-1.5 rounded-full text-xs font-bold transition-all border cursor-pointer"
									:class="activeTicket?.status === 'PENDING' ? 'bg-rose-600 text-white border-rose-600 shadow-xs' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'"
								>
									En attente
								</button>
								<button
									@click="handleChangeStatusInModal('PROCESSED')"
									:disabled="isSubmittingReply"
									class="px-3 py-1.5 rounded-full text-xs font-bold transition-all border cursor-pointer"
									:class="activeTicket?.status === 'PROCESSED' ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'"
								>
									Traité
								</button>
							</div>
						</div>

						<div class="relative">
							<textarea
								v-model="replyText"
								rows="2"
								placeholder="Écrire votre message de réponse au client..."
								class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 pr-14 text-sm text-slate-900 dark:text-white outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 resize-none"
							></textarea>
							<button class="absolute bottom-4 right-4 w-9 h-9 bg-emerald-600 hover:bg-emerald-700 rounded-full flex items-center justify-center text-white transition-colors shadow-md cursor-pointer">
								<Send class="w-4 h-4 ml-0.5" />
							</button>
						</div>
						<div class="flex gap-3">
							<button
								v-if="activeTicket?.status === 'PENDING'"
								@click="handleMarkProcessedInModal"
								:disabled="isSubmittingReply"
								class="flex-1 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-full flex items-center justify-center gap-2 shadow-md transition-all disabled:opacity-50 cursor-pointer"
							>
								<CheckCircle class="w-4 h-4" /> Marquer comme traité
							</button>
							<button
								v-else
								@click="handleChangeStatusInModal('PENDING')"
								:disabled="isSubmittingReply"
								class="flex-1 py-3.5 bg-slate-800 hover:bg-slate-900 text-white font-bold text-sm rounded-full flex items-center justify-center gap-2 shadow-md transition-all disabled:opacity-50 cursor-pointer"
							>
								<RefreshCcw class="w-4 h-4" /> Remettre en attente
							</button>
							<button @click="isSupportModalOpen = false" class="px-6 py-3.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-sm rounded-full transition-colors cursor-pointer">
								Fermer
							</button>
						</div>
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
