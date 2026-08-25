<!--
  @file app/pages/support-agent/index.vue
  @description Vue d'ensemble du Dashboard Support Agent — design glassmorphism à ton uni émeraude (#00bc7d) et bleu nuit (#0A0D1A) avec squelettes.
-->

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { MessageSquare, CheckCircle, Clock, Send, Eye, Shield, UserCircle, HelpCircle, ArrowRight } from "lucide-vue-next";
import SkeletonUI from "~/components/ui/SkeletonUI.vue";
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
	<div class="space-y-8 max-w-7xl mx-auto w-full animate-in fade-in duration-500 text-slate-900 dark:text-white">

		<!-- En-tête de bienvenue -->
		<div class="bg-slate-900 dark:bg-[#0A0D1A] text-white rounded-[32px] p-8 shadow-xl relative overflow-hidden border border-slate-800">
			<div class="relative z-10 space-y-3 max-w-2xl">
				<span class="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider inline-block">
					Espace Support Agent
				</span>
				<h1 class="text-3xl sm:text-4xl font-black font-serif tracking-tight leading-tight">
					Bonjour, {{ currentUser?.fullName || 'Agent Support' }} 👋
				</h1>
				<p class="text-slate-300 text-sm font-medium leading-relaxed">
					Bienvenue dans votre centre de gestion du support client FindMe. Répondez aux demandes des utilisateurs et suivez l'avancement des tickets certifiés.
				</p>
				<div class="pt-2 flex flex-wrap gap-3">
					<button
						@click="navigateToSupport"
						class="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider rounded-full shadow-md cursor-pointer transition-all flex items-center gap-2"
					>
						Gérer les tickets ({{ pendingTickets.length }} en attente)
						<ArrowRight class="w-4 h-4" />
					</button>
				</div>
			</div>
		</div>

		<!-- Cartes Statistiques Support -->
		<div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
			<!-- Total -->
			<div class="bg-white/80 dark:bg-[#0A0D1A]/80 backdrop-blur-2xl rounded-[32px] p-6 shadow-xl border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
				<div>
					<p class="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Total Tickets</p>
					<p class="text-3xl font-black text-slate-900 dark:text-white">
						<SkeletonUI v-if="isLoadingSupport" width="w-16" height="h-8" />
						<span v-else>{{ adminSupportMeta.totalElements.toLocaleString("fr-FR") }}</span>
					</p>
				</div>
				<div class="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-bold">
					<MessageSquare class="w-6 h-6" />
				</div>
			</div>

			<!-- En attente -->
			<div class="bg-white/80 dark:bg-[#0A0D1A]/80 backdrop-blur-2xl rounded-[32px] p-6 shadow-xl border border-rose-200/80 dark:border-rose-900/50 flex items-center justify-between">
				<div>
					<p class="text-xs font-black text-rose-600 dark:text-rose-400 uppercase tracking-wider mb-1">En attente</p>
					<p class="text-3xl font-black text-rose-600 dark:text-rose-400">
						<SkeletonUI v-if="isLoadingSupport" width="w-16" height="h-8" />
						<span v-else>{{ pendingTickets.length }}</span>
					</p>
				</div>
				<div class="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 flex items-center justify-center font-bold">
					<Clock class="w-6 h-6" />
				</div>
			</div>

			<!-- Traités -->
			<div class="bg-white/80 dark:bg-[#0A0D1A]/80 backdrop-blur-2xl rounded-[32px] p-6 shadow-xl border border-emerald-500/20 flex items-center justify-between">
				<div>
					<p class="text-xs font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-wider mb-1">Traités</p>
					<p class="text-3xl font-black text-emerald-700 dark:text-emerald-400">
						<SkeletonUI v-if="isLoadingSupport" width="w-16" height="h-8" />
						<span v-else>{{ processedTickets.length }}</span>
					</p>
				</div>
				<div class="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-bold">
					<CheckCircle class="w-6 h-6" />
				</div>
			</div>
		</div>

		<!-- Derniers tickets de support reçus -->
		<div class="bg-white/80 dark:bg-[#0A0D1A]/80 backdrop-blur-2xl rounded-[32px] border border-slate-200/80 dark:border-slate-800 shadow-xl p-6 sm:p-8 space-y-4">
			<div class="flex items-center justify-between">
				<h2 class="text-lg font-black font-serif text-slate-900 dark:text-white flex items-center gap-2">
					<HelpCircle class="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
					Derniers tickets de support client reçus
				</h2>
				<button @click="navigateToSupport" class="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer">
					Voir tout →
				</button>
			</div>

			<!-- Skeleton state pendant la récupération de données -->
			<div v-if="isLoadingSupport" class="space-y-3 py-2">
				<div v-for="n in 5" :key="n" class="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-2xl flex items-center justify-between">
					<div class="flex items-center gap-3">
						<SkeletonUI width="w-10" height="h-10" rounded="rounded-full" />
						<div class="space-y-1.5">
							<SkeletonUI width="w-32" height="h-4" />
							<SkeletonUI width="w-48" height="h-3" />
						</div>
					</div>
					<SkeletonUI width="w-20" height="h-6" rounded="rounded-full" />
				</div>
			</div>

			<div v-else-if="adminSupport.length > 0" class="divide-y divide-slate-200/60 dark:divide-slate-800">
				<div
					v-for="ticket in adminSupport.slice(0, 5)"
					:key="ticket.id"
					@click="navigateToSupport"
					class="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-900/60 p-3 rounded-2xl transition-colors cursor-pointer"
				>
					<div class="flex items-center gap-3">
						<div
							class="w-10 h-10 rounded-full text-white flex items-center justify-center font-bold text-sm shrink-0"
							:class="ticket.status === 'PENDING' ? 'bg-rose-500' : 'bg-emerald-600'"
						>
							{{ getInitials(ticket.userFullName || ticket.name) }}
						</div>
						<div>
							<p class="text-sm font-black text-slate-900 dark:text-white">{{ ticket.userFullName || ticket.name }}</p>
							<p class="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 max-w-md">{{ ticket.message }}</p>
						</div>
					</div>
					<div class="flex items-center gap-3">
						<span
							class="px-3 py-1 rounded-full text-[10px] font-black uppercase border"
							:class="ticket.status === 'PENDING' ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800' : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20'"
						>
							{{ ticket.status === 'PENDING' ? 'En attente' : 'Traité' }}
						</span>
						<span class="text-xs text-slate-400 font-medium whitespace-nowrap">
							{{ formatDate(ticket.createdAt) }}
						</span>
					</div>
				</div>
			</div>

			<div v-else class="py-12 text-center text-slate-400 text-xs">
				Aucun ticket de support pour le moment.
			</div>
		</div>

	</div>
</template>
