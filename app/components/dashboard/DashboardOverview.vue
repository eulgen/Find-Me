<!--
  @file app/components/dashboard/DashboardOverview.vue
  @description Onglet "Tableau de bord" — résumé de l'activité utilisateur :
  carte de bienvenue, accès rapide, adresses récentes et statistiques.
  Calqué sur la maquette "tableau de bord.png".
-->

<script setup lang="ts">
import {
	MapPin, Plus, Search, ArrowRight, HelpCircle, LayoutGrid, Map,
	Share2, Eye, Home, Briefcase, Heart,
} from "lucide-vue-next";
import ButtonUI from "~/components/ui/ButtonUI.vue";
import { useAddresses } from "~/composables/useAddresses";
import { useAuth } from "~/composables/useAuth";

// ─── Émissions ────────────────────────────────────────────────────────────
/** Émet la navigation vers une section du dashboard */
const emit = defineEmits<{
	(e: "navigate", section: string): void;
}>();

// ─── Données ──────────────────────────────────────────────────────────────
const { currentUser } = useAuth();
const { addressesList, MAX_ADDRESSES } = useAddresses();

/** Nom affiché dans le message de bienvenue */
const userName = computed(() => (currentUser.value?.username || currentUser.value?.email.split("@")[0] || "Citoyen").toUpperCase());

/** Initiales pour l'avatar par défaut */
const userInitials = computed(() => {
	const name = currentUser.value?.username || currentUser.value?.email || "??";
	return name.substring(0, 2).toUpperCase();
});

/** Badge de type d'adresse avec couleur associée */
const typeConfig: Record<string, { label: string; class: string }> = {
	home: { label: "PRIVÉ", class: "bg-blue-50 text-blue-600 dark:bg-blue-500/10" },
	work: { label: "TRAVAIL", class: "bg-green-50 text-green-600 dark:bg-green-500/10" },
	family: { label: "FAMILLE", class: "bg-pink-50 text-pink-500 dark:bg-pink-500/10" },
	other: { label: "AUTRE", class: "bg-gray-100 text-gray-600 dark:bg-slate-800" },
};

/** 3 dernières adresses créées */
const recentAddresses = computed(() => addressesList.value.slice(0, 3));

/** Statistiques de l'utilisateur */
const stats = computed(() => ({
	addresses: addressesList.value.length,
	shares: addressesList.value.length * 4, // simulé
}));
</script>

<template>
	<div class="flex-1 w-full animate-in fade-in duration-300" id="dashboard-overview">
		<!-- ── Layout principal : contenu gauche + sidebar droite ── -->
		<div class="flex flex-col lg:flex-row gap-6">
			<!-- ═══════════════════════════════════════════════════ -->
			<!-- COLONNE PRINCIPALE                                  -->
			<!-- ═══════════════════════════════════════════════════ -->
			<div class="flex-1 min-w-0 space-y-6">

				<!-- ── Hero Card : Bienvenue ── -->
				<div class="bg-white dark:bg-slate-900 rounded-[24px] border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden relative">
					<div class="p-5 sm:p-7 flex flex-col-reverse sm:flex-row items-center sm:items-start justify-between gap-6 text-center sm:text-left">
						<div class="flex-1 min-w-0 flex flex-col items-center sm:items-start">
							<!-- Badge vérifié -->
							<div class="inline-flex items-center gap-1.5 px-3 py-1 bg-[#2E7D32]/10 text-[#2E7D32] rounded-full text-[11px] font-black uppercase tracking-wider mb-3">
								<span class="w-1.5 h-1.5 bg-[#2E7D32] rounded-full animate-pulse"></span>
								Compte Vérifié
							</div>
							<h1 class="text-2xl md:text-3xl font-black text-gray-800 dark:text-white mb-2 leading-tight">
								Bienvenue, {{ userName }}
							</h1>
							<p class="text-sm text-gray-500 dark:text-slate-400 leading-relaxed max-w-md">
								Votre système d'adressage numérique est actif.
								Localisez et partagez en un clic.
							</p>
						</div>
						<!-- Illustration décorative -->
						<div class="shrink-0 w-28 h-28 bg-gradient-to-br from-[#2E7D32]/10 to-[#1A237E]/10 rounded-2xl flex items-center justify-center">
							<MapPin class="w-14 h-14 text-[#2E7D32]/40" />
						</div>
					</div>
				</div>

				<!-- ── Cards d'accès rapide ── -->
				<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<!-- Créer une adresse -->
					<button
						@click="emit('navigate', 'addresses')"
						class="bg-white dark:bg-slate-900 rounded-[20px] border border-gray-100 dark:border-slate-800 p-5 flex items-center gap-4 text-left hover:border-[#2E7D32]/30 hover:shadow-md transition-all duration-200 group"
						id="quick-create-address"
					>
						<div class="w-12 h-12 bg-gradient-to-br from-[#2E7D32] to-[#1B5E20] rounded-2xl flex items-center justify-center shadow-lg shadow-[#2E7D32]/25 shrink-0 group-hover:scale-105 transition-transform">
							<Plus class="w-6 h-6 text-white" />
						</div>
						<div>
							<p class="font-black text-[#2E7D32] mb-0.5">Créer une adresse</p>
							<p class="text-xs text-gray-400 dark:text-slate-500 leading-snug">Générez un code digital unique pour votre domicile</p>
						</div>
					</button>

					<!-- Rechercher un lieu -->
					<button
						class="bg-white dark:bg-slate-900 rounded-[20px] border border-gray-100 dark:border-slate-800 p-5 flex items-center gap-4 text-left hover:border-[#1A237E]/30 hover:shadow-md transition-all duration-200 group"
						id="quick-search-place"
					>
						<div class="w-12 h-12 bg-gradient-to-br from-[#1A237E] to-[#0D144A] rounded-2xl flex items-center justify-center shadow-lg shadow-[#1A237E]/25 shrink-0 group-hover:scale-105 transition-transform">
							<Search class="w-6 h-6 text-white" />
						</div>
						<div>
							<p class="font-black text-[#1A237E] dark:text-blue-400 mb-0.5">Rechercher un lieu</p>
							<p class="text-xs text-gray-400 dark:text-slate-500 leading-snug">Trouvez n'importe quelle destination à Yaoundé</p>
						</div>
					</button>
				</div>

				<!-- ── Tableau : Mes Adresses Récentes ── -->
				<div class="bg-white dark:bg-slate-900 rounded-[24px] border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden">
					<!-- En-tête du tableau -->
					<div class="px-6 py-5 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between">
						<h2 class="text-base font-black text-gray-800 dark:text-white">Mes Adresses Récentes</h2>
						<button
							@click="emit('navigate', 'addresses')"
							class="flex items-center gap-1 text-[#2E7D32] text-sm font-bold hover:underline"
						>
							Voir tout
							<ArrowRight class="w-3.5 h-3.5" />
						</button>
					</div>

					<!-- État vide -->
					<div v-if="recentAddresses.length === 0" class="px-6 py-12 text-center">
						<div class="w-16 h-16 bg-gray-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
							<MapPin class="w-8 h-8 text-gray-300 dark:text-slate-600" />
						</div>
						<p class="text-sm font-bold text-gray-400 dark:text-slate-500 mb-4">Aucune adresse enregistrée</p>
						<ButtonUI @click="emit('navigate', 'addresses')" variant="primary" :icon="Plus" size="sm">
							Créer ma première adresse
						</ButtonUI>
					</div>

					<!-- Tableau des adresses -->
					<div v-else class="w-full overflow-x-auto">
						<table class="w-full min-w-[500px]">
							<thead>
							<tr class="bg-gray-50 dark:bg-slate-800/50">
								<th class="px-6 py-3 text-left text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-wider">Nom</th>
								<th class="px-4 py-3 text-left text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-wider">Type</th>
								<th class="px-4 py-3 text-left text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-wider hidden md:table-cell">Localisation</th>
								<th class="px-4 py-3 text-right text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-wider">Actions</th>
							</tr>
						</thead>
						<tbody class="divide-y divide-gray-50 dark:divide-slate-800">
							<tr
								v-for="(addr, idx) in recentAddresses"
								:key="idx"
								class="hover:bg-gray-50/50 dark:hover:bg-slate-800/30 transition-colors duration-150"
							>
								<td class="px-6 py-4">
									<p class="text-sm font-black text-gray-800 dark:text-white">
										{{ addr.neighborhood || 'Adresse' }} {{ addr.housePlateNumber }}
									</p>
									<p class="text-[11px] text-[#2E7D32] font-mono font-bold mt-0.5">{{ addr.addressCode }}</p>
								</td>
								<td class="px-4 py-4">
									<span class="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-black"
										:class="typeConfig[addr.type || 'home']?.class || typeConfig.home!.class">
										{{ typeConfig[addr.type || 'home']?.label || typeConfig.home!.label }}
									</span>
								</td>
								<td class="px-4 py-4 hidden md:table-cell">
									<p class="text-xs text-gray-500 dark:text-slate-400 truncate max-w-[160px]">
										{{ addr.streetName }}, {{ addr.neighborhood }}
									</p>
								</td>
								<td class="px-4 py-4 text-right">
									<ButtonUI
										@click="emit('navigate', 'addresses')"
										variant="outline"
										size="sm"
										:icon="Map"
										class="border-[#2E7D32]/20 text-[#2E7D32] hover:bg-[#2E7D32]/5"
									>
										<span class="hidden sm:inline">Carte</span>
									</ButtonUI>
								</td>
							</tr>
						</tbody>
						</table>
					</div>
				</div>

			</div>

			<!-- ═══════════════════════════════════════════════════ -->
			<!-- COLONNE DROITE : Stats + Help                       -->
			<!-- ═══════════════════════════════════════════════════ -->
			<aside class="w-full lg:w-72 shrink-0 space-y-4">

				<!-- ── Card Statistiques ── -->
				<div class="bg-white dark:bg-slate-900 rounded-[20px] border border-gray-100 dark:border-slate-800 shadow-sm p-5">
					<p class="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-3">Statistiques</p>
					<div class="grid grid-cols-2 gap-3">
						<div class="bg-gray-50 dark:bg-slate-800 rounded-xl p-3 text-center">
							<p class="text-2xl font-black text-gray-800 dark:text-white">{{ stats.addresses }}</p>
							<p class="text-[11px] text-gray-400 dark:text-slate-500 font-semibold mt-0.5">Adresses</p>
						</div>
						<div class="bg-gray-50 dark:bg-slate-800 rounded-xl p-3 text-center">
							<p class="text-2xl font-black text-gray-800 dark:text-white">{{ stats.shares }}</p>
							<p class="text-[11px] text-gray-400 dark:text-slate-500 font-semibold mt-0.5">Partages</p>
						</div>
					</div>
					<!-- Barre de quota -->
					<div class="mt-4">
						<div class="flex justify-between items-center mb-1.5">
							<span class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Quota utilisé</span>
							<span class="text-[10px] font-black" :class="addressesList.length >= MAX_ADDRESSES ? 'text-rose-500' : 'text-[#2E7D32]'">
								{{ addressesList.length }}/{{ MAX_ADDRESSES }}
							</span>
						</div>
						<div class="w-full h-1.5 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
							<div
								class="h-full rounded-full transition-all duration-500"
								:class="addressesList.length >= MAX_ADDRESSES ? 'bg-rose-500' : 'bg-[#2E7D32]'"
								:style="{ width: `${(addressesList.length / MAX_ADDRESSES) * 100}%` }"
							/>
						</div>
					</div>
				</div>

				<!-- ── Card Besoin d'aide ── -->
				<div class="bg-gradient-to-br from-[#1A237E] via-[#0D144A] to-black rounded-[20px] p-5 overflow-hidden relative shadow-xl shadow-[#1A237E]/30">
					<!-- Décorations -->
					<div class="absolute -bottom-8 -right-8 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
					<div class="absolute top-6 -right-4 w-16 h-16 bg-indigo-500/20 rounded-full blur-xl"></div>

					<div class="relative z-10">
						<div class="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center mb-3">
							<HelpCircle class="w-5 h-5 text-white" />
						</div>
						<h3 class="text-base font-black text-white mb-1">Besoin d'aide ?</h3>
						<p class="text-xs text-indigo-200 mb-4 leading-relaxed">
							Nos experts vous accompagnent dans la configuration de vos adresses numériques.
						</p>
						<ButtonUI
							@click="emit('navigate', 'support')"
							variant="outline"
							class="w-full border-white/20 text-white hover:bg-white/10 hover:border-white/40"
						>
							Contacter le support
						</ButtonUI>
					</div>
				</div>

				<!-- ── Accès rapide (quota maximal) ── -->
				<div
					v-if="addressesList.length >= MAX_ADDRESSES"
					class="bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 rounded-[20px] p-4"
				>
					<p class="text-xs font-black text-rose-600 dark:text-rose-400 mb-1">Limite atteinte</p>
					<p class="text-[11px] text-rose-500 dark:text-rose-400/80 leading-snug">
						Vous avez atteint le quota maximum de {{ MAX_ADDRESSES }} adresses. Supprimez-en une pour en créer une nouvelle.
					</p>
				</div>

			</aside>
		</div>
	</div>
</template>
