<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { Filter, Send, CheckCircle, RefreshCcw, User as UserIcon, ChevronLeft, ChevronRight, MessageSquare, X, Mail, Clock, Eye } from "lucide-vue-next";
import { useAdminData } from "~/composables/useAdminData";
import type { SupportStatus, AdminSupportDTO } from "~/composables/useAdminData";

definePageMeta({
	layout: "dashboard-support",
	middleware: ["support"],
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
	<div class="space-y-6 max-w-7xl mx-auto w-full">

		<!-- HEADER & STATS -->
		<div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
			<div>
				<p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Espace Agent / Support Client</p>
				<h1 class="text-3xl font-black text-gray-900">Gestion du Support Client</h1>
			</div>

			<div class="flex items-center gap-4">
				<div class="bg-white border border-gray-200 rounded-2xl p-4 min-w-[120px] shadow-sm">
					<p class="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Total</p>
					<p class="text-2xl font-black text-gray-800">
						<span v-if="isLoadingSupport" class="text-gray-400">…</span>
						<span v-else>{{ adminSupportMeta.totalElements.toLocaleString("fr-FR") }}</span>
					</p>
				</div>
				<div class="bg-white border border-rose-200 rounded-2xl p-4 min-w-[120px] shadow-sm">
					<p class="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-1">En attente</p>
					<p class="text-2xl font-black text-rose-600">{{ pendingCount }}</p>
				</div>
				<div class="bg-[#81C784] rounded-2xl p-4 min-w-[120px] shadow-sm shadow-[#81C784]/30">
					<p class="text-[10px] font-black text-white/80 uppercase tracking-widest mb-1">Traités</p>
					<p class="text-2xl font-black text-white">{{ processedCount }}</p>
				</div>
			</div>
		</div>

		<!-- LISTE DU SUPPORT PLEINE LARGEUR -->
		<div class="bg-white rounded-3xl border border-gray-200 shadow-sm flex flex-col overflow-hidden w-full">

			<!-- Filtres de liste -->
			<div class="p-5 border-b border-gray-100 flex items-center justify-between flex-wrap gap-4">
				<div class="flex items-center gap-3">
					<span class="text-sm font-black text-gray-800">Tous les tickets</span>
					<div class="flex bg-gray-100 rounded-full p-1">
						<button
							class="px-4 py-1.5 text-xs font-bold rounded-full transition-colors"
							:class="filterStatus === '' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'"
							@click="applyFilter('')"
						>Tous</button>
						<button
							class="px-4 py-1.5 text-xs font-bold rounded-full transition-colors"
							:class="filterStatus === 'PENDING' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'"
							@click="applyFilter('PENDING')"
						>En attente ({{ pendingCount }})</button>
						<button
							class="px-4 py-1.5 text-xs font-bold rounded-full transition-colors"
							:class="filterStatus === 'PROCESSED' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'"
							@click="applyFilter('PROCESSED')"
						>Traités ({{ processedCount }})</button>
					</div>
				</div>
			</div>

			<!-- Tableau pleine largeur des messages -->
			<div class="overflow-x-auto">
				<table class="w-full text-left border-collapse min-w-[800px]">
					<thead>
						<tr class="bg-gray-50/50 text-[10px] font-black text-gray-400 uppercase tracking-wider border-b border-gray-100">
							<th class="px-6 py-4">Utilisateur</th>
							<th class="px-6 py-4">Email</th>
							<th class="px-6 py-4">Message</th>
							<th class="px-6 py-4">Statut</th>
							<th class="px-6 py-4">Date</th>
							<th class="px-6 py-4 text-right">Détails</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-gray-50">
						<tr v-if="isLoadingSupport" v-for="n in 6" :key="'sk'+n" class="animate-pulse">
							<td class="px-6 py-4">
								<div class="flex items-center gap-3">
									<div class="w-10 h-10 rounded-full bg-gray-200 shrink-0"></div>
									<div class="h-3 bg-gray-200 rounded w-28"></div>
								</div>
							</td>
							<td class="px-6 py-4"><div class="h-3 bg-gray-200 rounded w-36"></div></td>
							<td class="px-6 py-4"><div class="h-3 bg-gray-200 rounded w-64"></div></td>
							<td class="px-6 py-4"><div class="h-5 bg-gray-200 rounded-full w-20"></div></td>
							<td class="px-6 py-4"><div class="h-3 bg-gray-200 rounded w-20"></div></td>
							<td class="px-6 py-4 text-right"><div class="h-9 w-24 bg-gray-200 rounded-full ml-auto"></div></td>
						</tr>

						<tr
							v-else
							v-for="ticket in filteredTickets"
							:key="ticket.id"
							class="hover:bg-gray-50/80 transition-colors group"
						>
							<td class="px-6 py-4">
								<div class="flex items-center gap-3">
									<div
										class="w-10 h-10 rounded-full text-white flex items-center justify-center font-bold text-sm shrink-0"
										:class="ticket.status === 'PENDING' ? 'bg-amber-500' : 'bg-[#81C784]'"
									>
										{{ getInitials(ticket.userFullName || ticket.name) }}
									</div>
									<div>
										<p class="text-sm font-black text-gray-900">{{ ticket.userFullName || ticket.name }}</p>
										<p class="text-[10px] text-gray-400 font-mono">Ticket #{{ ticket.id }}</p>
									</div>
								</div>
							</td>

							<td class="px-6 py-4 text-xs font-semibold text-gray-600">
								{{ ticket.email }}
							</td>

							<td class="px-6 py-4 max-w-md">
								<p class="text-sm text-gray-700 line-clamp-2 leading-snug">{{ ticket.message }}</p>
							</td>

							<td class="px-6 py-4">
								<span
									class="px-3 py-1 rounded-full text-[10px] font-black tracking-wider uppercase"
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
									@click="openSupportModal(ticket)"
									class="inline-flex items-center gap-1.5 px-4 py-2 font-bold text-xs rounded-full bg-amber-50 text-amber-700 hover:bg-amber-500 hover:text-white transition-all shadow-xs border border-amber-200"
								>
									<Eye class="w-3.5 h-3.5" />
									Détails
								</button>
							</td>
						</tr>

						<tr v-if="!isLoadingSupport && filteredTickets.length === 0">
							<td colspan="6" class="px-6 py-12 text-center text-gray-400 text-sm">
								Aucun ticket de support trouvé.
							</td>
						</tr>
					</tbody>
				</table>
			</div>

			<!-- Pagination -->
			<div class="p-4 border-t border-gray-100 flex items-center justify-between bg-white rounded-b-3xl">
				<p class="text-xs text-gray-500 font-medium">
					Affichage de {{ filteredTickets.length }} sur {{ adminSupportMeta.totalElements.toLocaleString("fr-FR") }} tickets
				</p>
				<div class="flex items-center gap-1" v-if="adminSupportMeta.totalPages > 1">
					<button
						@click="goToPage(adminSupportMeta.currentPage - 1)"
						:disabled="adminSupportMeta.currentPage === 0"
						class="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50 disabled:opacity-40"
					>
						<ChevronLeft class="w-4 h-4" />
					</button>
					<button
						v-for="p in Math.min(adminSupportMeta.totalPages, 5)"
						:key="p-1"
						@click="goToPage(p-1)"
						class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors"
						:class="adminSupportMeta.currentPage === p-1 ? 'bg-amber-500 text-white shadow-sm' : 'border border-transparent text-gray-600 hover:bg-gray-50'"
					>
						{{ p }}
					</button>
					<button
						@click="goToPage(adminSupportMeta.currentPage + 1)"
						:disabled="adminSupportMeta.currentPage >= adminSupportMeta.totalPages - 1"
						class="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-40"
					>
						<ChevronRight class="w-4 h-4" />
					</button>
				</div>
			</div>
		</div>

		<!-- MODALE DÉTAILS TICKET SUPPORT AGENT -->
		<Transition name="fade">
			<div v-if="isSupportModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
				<div class="bg-white rounded-3xl border border-gray-200 shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
					
					<div class="bg-amber-600 text-white p-6 relative shrink-0">
						<div class="flex justify-between items-start mb-3">
							<span class="px-2.5 py-0.5 bg-white/20 rounded-md text-[10px] font-black tracking-widest uppercase">
								TICKET #{{ activeTicket?.id }}
							</span>
							<div class="flex items-center gap-2">
								<span
									class="px-3 py-1 rounded-full text-[10px] font-black uppercase"
									:class="activeTicket?.status === 'PENDING' ? 'bg-rose-500 text-white' : 'bg-emerald-500 text-white'"
								>
									{{ activeTicket?.status === 'PENDING' ? 'En attente' : 'Traité' }}
								</span>
								<button @click="isSupportModalOpen = false" class="p-1 text-white/70 hover:text-white rounded-full hover:bg-white/10 transition-colors">
									<X class="w-6 h-6" />
								</button>
							</div>
						</div>
						<h2 class="text-xl font-black mb-2">Message de support client</h2>
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

					<div class="flex-1 overflow-y-auto p-6 bg-gray-50 flex flex-col gap-5">
						<div class="flex justify-center">
							<span class="px-3 py-1 bg-white border border-gray-200 rounded-full text-[10px] font-black text-gray-400 uppercase tracking-wider">
								{{ formatJustDate(activeTicket?.createdAt) }}
							</span>
						</div>

						<div class="flex flex-col gap-1 max-w-[85%] self-start">
							<div class="bg-white border border-gray-200 p-4 rounded-2xl rounded-tl-sm shadow-sm text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
								{{ activeTicket?.message }}
							</div>
							<span class="text-[9px] font-medium text-gray-400 ml-1">
								{{ formatTime(activeTicket?.createdAt) }} · Envoyé par {{ activeTicket?.userFullName || activeTicket?.name }}
							</span>
						</div>
					</div>

					<div class="bg-white border-t border-gray-100 p-6 shrink-0 space-y-4">
						<div class="flex items-center justify-between bg-gray-50 p-3.5 rounded-2xl border border-gray-100">
							<span class="text-xs font-bold text-gray-700">Changer le statut du ticket :</span>
							<div class="flex items-center gap-2">
								<button
									@click="handleChangeStatusInModal('PENDING')"
									:disabled="isSubmittingReply"
									class="px-3 py-1.5 rounded-full text-xs font-bold transition-all border"
									:class="activeTicket?.status === 'PENDING' ? 'bg-rose-600 text-white border-rose-600 shadow-sm' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-100'"
								>
									En attente
								</button>
								<button
									@click="handleChangeStatusInModal('PROCESSED')"
									:disabled="isSubmittingReply"
									class="px-3 py-1.5 rounded-full text-xs font-bold transition-all border"
									:class="activeTicket?.status === 'PROCESSED' ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-100'"
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
								class="w-full bg-[#F4F6F9] border-none rounded-2xl p-4 pr-14 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-amber-500/20 resize-none"
							></textarea>
							<button class="absolute bottom-4 right-4 w-9 h-9 bg-amber-600 rounded-full flex items-center justify-center text-white hover:bg-amber-700 transition-colors shadow-md">
								<Send class="w-4 h-4 ml-0.5" />
							</button>
						</div>
						<div class="flex gap-3">
							<button
								v-if="activeTicket?.status === 'PENDING'"
								@click="handleMarkProcessedInModal"
								:disabled="isSubmittingReply"
								class="flex-1 py-3.5 bg-[#0A7A38] hover:bg-[#08632d] text-white font-bold text-sm rounded-full flex items-center justify-center gap-2 shadow-md shadow-[#0A7A38]/20 transition-all disabled:opacity-50"
							>
								<CheckCircle class="w-4 h-4" /> Marquer comme traité
							</button>
							<button
								v-else
								@click="handleChangeStatusInModal('PENDING')"
								:disabled="isSubmittingReply"
								class="flex-1 py-3.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm rounded-full flex items-center justify-center gap-2 shadow-md transition-all disabled:opacity-50"
							>
								<RefreshCcw class="w-4 h-4" /> Remettre en attente
							</button>
							<button @click="isSupportModalOpen = false" class="px-6 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm rounded-full transition-colors">
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
