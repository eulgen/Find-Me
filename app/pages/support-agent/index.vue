<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { MessageSquare, CheckCircle, Clock, Send, Eye, Shield, UserCircle, HelpCircle } from "lucide-vue-next";
import { useAdminData } from "~/composables/useAdminData";
import { useAuth } from "~/composables/useAuth";

definePageMeta({
	layout: "dashboard-support",
	middleware: ["support"],
});

const { currentUser } = useAuth();
const {
	adminSupport, adminSupportMeta, isLoadingSupport, fetchAdminSupport,
	markSupportProcessed, getInitials, formatDate, formatTime,
} = useAdminData();

onMounted(() => fetchAdminSupport(undefined, 0, 10));

const pendingTickets = computed(() => adminSupport.value.filter(t => t.status === "PENDING"));
const processedTickets = computed(() => adminSupport.value.filter(t => t.status === "PROCESSED"));

const navigateToSupport = () => {
	navigateTo("/support-agent/support");
};
</script>

<template>
	<div class="space-y-8 max-w-7xl mx-auto w-full">

		<!-- En-tête de bienvenue -->
		<div class="bg-gradient-to-r from-[#0A0F2C] via-indigo-900 to-amber-900 text-white rounded-3xl p-8 shadow-xl relative overflow-hidden">
			<div class="relative z-10 space-y-3 max-w-2xl">
				<span class="bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider inline-block">
					Espace Support Agent
				</span>
				<h1 class="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
					Bonjour, {{ currentUser?.fullName || 'Agent Support' }} 👋
				</h1>
				<p class="text-slate-300 text-sm font-medium leading-relaxed">
					Bienvenue dans votre centre de gestion du support client FindMe. Répondez aux demandes des utilisateurs et suivez l'avancement des tickets.
				</p>
				<div class="pt-2 flex flex-wrap gap-3">
					<button
						@click="navigateToSupport"
						class="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs uppercase tracking-wider rounded-full shadow-lg transition-all"
					>
						Gérer les tickets ({{ pendingTickets.length }} en attente)
					</button>
				</div>
			</div>
		</div>

		<!-- Cartes Statistiques Support -->
		<div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
			<div class="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center justify-between">
				<div>
					<p class="text-xs font-black text-gray-400 uppercase tracking-wider mb-1">Total Tickets</p>
					<p class="text-3xl font-black text-gray-900">
						<span v-if="isLoadingSupport" class="text-gray-300">…</span>
						<span v-else>{{ adminSupportMeta.totalElements.toLocaleString("fr-FR") }}</span>
					</p>
				</div>
				<div class="w-12 h-12 rounded-2xl bg-blue-50 text-[#155dfc] flex items-center justify-center font-bold">
					<MessageSquare class="w-6 h-6" />
				</div>
			</div>

			<div class="bg-white rounded-3xl p-6 shadow-sm border border-rose-100 flex items-center justify-between">
				<div>
					<p class="text-xs font-black text-rose-500 uppercase tracking-wider mb-1">En attente</p>
					<p class="text-3xl font-black text-rose-600">{{ pendingTickets.length }}</p>
				</div>
				<div class="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
					<Clock class="w-6 h-6" />
				</div>
			</div>

			<div class="bg-white rounded-3xl p-6 shadow-sm border border-emerald-100 flex items-center justify-between">
				<div>
					<p class="text-xs font-black text-emerald-500 uppercase tracking-wider mb-1">Traités</p>
					<p class="text-3xl font-black text-emerald-600">{{ processedTickets.length }}</p>
				</div>
				<div class="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
					<CheckCircle class="w-6 h-6" />
				</div>
			</div>
		</div>

		<!-- Derniers tickets de support reçus -->
		<div class="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-4">
			<div class="flex items-center justify-between">
				<h2 class="text-lg font-black text-gray-900 flex items-center gap-2">
					<HelpCircle class="w-5 h-5 text-amber-500" />
					Derniers tickets de support client reçus
				</h2>
				<button @click="navigateToSupport" class="text-xs font-bold text-amber-600 hover:text-amber-700">
					Voir tout →
				</button>
			</div>

			<div v-if="isLoadingSupport" class="py-12 text-center text-gray-400 text-xs animate-pulse">
				Chargement des derniers tickets de support…
			</div>

			<div v-else-if="adminSupport.length > 0" class="divide-y divide-gray-100">
				<div
					v-for="ticket in adminSupport.slice(0, 5)"
					:key="ticket.id"
					@click="navigateToSupport"
					class="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50/80 p-3 rounded-2xl transition-colors cursor-pointer"
				>
					<div class="flex items-center gap-3">
						<div
							class="w-10 h-10 rounded-full text-white flex items-center justify-center font-bold text-sm shrink-0"
							:class="ticket.status === 'PENDING' ? 'bg-rose-500' : 'bg-emerald-500'"
						>
							{{ getInitials(ticket.userFullName || ticket.name) }}
						</div>
						<div>
							<p class="text-sm font-black text-gray-900">{{ ticket.userFullName || ticket.name }}</p>
							<p class="text-xs text-gray-500 line-clamp-1 max-w-md">{{ ticket.message }}</p>
						</div>
					</div>
					<div class="flex items-center gap-3">
						<span
							class="px-3 py-1 rounded-full text-[10px] font-black uppercase"
							:class="ticket.status === 'PENDING' ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-700'"
						>
							{{ ticket.status === 'PENDING' ? 'En attente' : 'Traité' }}
						</span>
						<span class="text-xs text-gray-400 font-medium whitespace-nowrap">
							{{ formatDate(ticket.createdAt) }}
						</span>
					</div>
				</div>
			</div>

			<div v-else class="py-12 text-center text-gray-400 text-xs">
				Aucun ticket de support pour le moment.
			</div>
		</div>

	</div>
</template>
