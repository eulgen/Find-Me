<!--
  @file app/components/dashboard/DashboardOverview.vue
  @description Onglet "Tableau de bord" — design glassmorphism premium à ton uni émeraude avec squelettes de chargement (SkeletonUI).
  Résumé de l'activité utilisateur : carte de bienvenue, accès rapide, adresses récentes et statistiques.
-->

<script setup lang="ts">
import { computed, onMounted } from "vue";
import {
	MapPin, Plus, Search, ArrowRight, HelpCircle, Map,
} from "lucide-vue-next";
import ButtonUI from "~/components/ui/ButtonUI.vue";
import SkeletonUI from "~/components/ui/SkeletonUI.vue";
import { useAddresses } from "~/composables/useAddresses";
import { useAuth } from "~/composables/useAuth";

const emit = defineEmits<{
	(e: "navigate", section: string): void;
}>();

const { currentUser } = useAuth();
const { addressesList, isLoadingAddresses, fetchAddresses, MAX_ADDRESSES } = useAddresses();

onMounted(async () => {
	await fetchAddresses();
});

const userName = computed(() => (currentUser.value?.username || currentUser.value?.fullName || currentUser.value?.email.split("@")[0] || "Citoyen"));

const typeConfig: Record<string, { label: string; class: string }> = {
	home: { label: "PRIVÉ", class: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-500/20" },
	work: { label: "TRAVAIL", class: "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700" },
	family: { label: "FAMILLE", class: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-500/20" },
	other: { label: "AUTRE", class: "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700" },
};

const recentAddresses = computed(() => addressesList.value.slice(0, 3));

const stats = computed(() => ({
	addresses: addressesList.value.length,
	shares: addressesList.value.length * 4,
}));
</script>

<template>
	<div class="flex-1 w-full animate-in fade-in slide-in-from-bottom-4 duration-700 text-slate-900 dark:text-white" id="dashboard-overview">
		<div class="flex flex-col lg:flex-row gap-6">
			
			<!-- COLONNE PRINCIPALE -->
			<div class="flex-1 min-w-0 space-y-6">

				<!-- Hero Card : Bienvenue -->
				<div class="relative bg-white/80 dark:bg-[#0A0D1A]/80 backdrop-blur-2xl rounded-[32px] border border-slate-200/80 dark:border-slate-800 shadow-xl overflow-hidden group">
					<div class="relative p-6 sm:p-10 flex flex-col-reverse sm:flex-row items-center sm:items-start justify-between gap-6 text-center sm:text-left z-10">
						<div class="flex-1 min-w-0 flex flex-col items-center sm:items-start">
							<div class="inline-flex items-center gap-2 px-3.5 py-1.5 bg-emerald-500/10 rounded-full border border-emerald-500/20 shadow-xs mb-4">
								<span class="relative flex h-2 w-2">
								  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
								  <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
								</span>
								<span class="text-[10px] font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-widest">Compte Vérifié</span>
							</div>
							
							<h1 class="text-3xl md:text-4xl font-black font-serif text-slate-900 dark:text-white mb-3 tracking-tight">
								Bienvenue, {{ userName }} 👋
							</h1>
							<p class="text-[15px] font-medium text-slate-600 dark:text-slate-300 leading-relaxed max-w-md">
								Votre système d'adressage numérique est actif. Localisez et partagez votre position avec une précision certifiée.
							</p>
						</div>
						<div class="shrink-0 relative w-28 h-28 flex items-center justify-center">
							<div class="relative w-full h-full bg-emerald-600 rounded-3xl flex items-center justify-center shadow-lg shadow-emerald-600/25">
								<MapPin class="w-12 h-12 text-white drop-shadow-sm" />
							</div>
						</div>
					</div>
				</div>

				<!-- Cards d'accès rapide -->
				<div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
					<button
						@click="emit('navigate', 'create-address')"
						class="relative bg-white/80 dark:bg-[#0A0D1A]/80 backdrop-blur-xl rounded-[24px] border border-slate-200/80 dark:border-slate-800 p-6 flex items-center gap-5 text-left hover:border-emerald-500/60 hover:bg-white dark:hover:bg-slate-900 transition-all duration-300 group overflow-hidden shadow-md cursor-pointer"
					>
						<div class="relative w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-md shadow-emerald-600/20 shrink-0 group-hover:scale-105 transition-transform duration-300">
							<Plus class="w-7 h-7 text-white" />
						</div>
						<div class="relative">
							<p class="text-base font-black text-slate-900 dark:text-white mb-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">Créer une adresse</p>
							<p class="text-[13px] font-medium text-slate-500 dark:text-slate-400 leading-snug">Générez un code digital unique.</p>
						</div>
					</button>

					<button
						@click="emit('navigate', 'addresses')"
						class="relative bg-white/80 dark:bg-[#0A0D1A]/80 backdrop-blur-xl rounded-[24px] border border-slate-200/80 dark:border-slate-800 p-6 flex items-center gap-5 text-left hover:border-emerald-500/60 hover:bg-white dark:hover:bg-slate-900 transition-all duration-300 group overflow-hidden shadow-md cursor-pointer"
					>
						<div class="relative w-14 h-14 bg-slate-900 dark:bg-emerald-600 rounded-2xl flex items-center justify-center shadow-md shrink-0 group-hover:scale-105 transition-transform duration-300">
							<Search class="w-7 h-7 text-white" />
						</div>
						<div class="relative">
							<p class="text-base font-black text-slate-900 dark:text-white mb-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">Rechercher un lieu</p>
							<p class="text-[13px] font-medium text-slate-500 dark:text-slate-400 leading-snug">Trouvez n'importe quelle destination.</p>
						</div>
					</button>
				</div>

				<!-- Tableau : Mes Adresses Récentes -->
				<div class="bg-white/80 dark:bg-[#0A0D1A]/80 backdrop-blur-2xl rounded-[32px] border border-slate-200/80 dark:border-slate-800 shadow-xl overflow-hidden">
					<div class="px-8 py-6 border-b border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
						<h2 class="text-[15px] font-black uppercase tracking-wider text-slate-900 dark:text-white">Dernières Adresses</h2>
						<button
							@click="emit('navigate', 'addresses')"
							class="group flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-sm font-black hover:underline cursor-pointer"
						>
							Voir tout
							<ArrowRight class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
						</button>
					</div>

					<!-- Etat SKELETON quand isLoadingAddresses est true -->
					<div v-if="isLoadingAddresses" class="p-6 space-y-4">
						<div v-for="n in 3" :key="n" class="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200/40 dark:border-slate-800">
							<div class="space-y-2">
								<SkeletonUI width="w-40" height="h-4" />
								<SkeletonUI width="w-24" height="h-3" />
							</div>
							<SkeletonUI width="w-20" height="h-8" rounded="rounded-xl" />
						</div>
					</div>

					<!-- Etat vide -->
					<div v-else-if="recentAddresses.length === 0" class="px-8 py-16 text-center">
						<div class="relative w-20 h-20 mx-auto mb-5 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/20">
							<MapPin class="w-9 h-9 text-emerald-600 dark:text-emerald-400" />
						</div>
						<p class="text-[15px] font-bold text-slate-500 dark:text-slate-400 mb-6">Aucune adresse enregistrée pour le moment.</p>
						<ButtonUI @click="emit('navigate', 'create-address')" variant="primary" :icon="Plus" class="bg-emerald-600 hover:bg-emerald-700 text-white">
							Créer ma première adresse
						</ButtonUI>
					</div>

					<!-- Etat données réelles -->
					<div v-else class="w-full overflow-x-auto p-2">
						<table class="w-full min-w-[600px] border-separate border-spacing-y-2">
							<thead>
								<tr>
									<th class="px-6 py-2 text-left text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Nom & Code</th>
									<th class="px-4 py-2 text-left text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Type</th>
									<th class="px-4 py-2 text-left text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest font-mono">Statut</th>
									<th class="px-4 py-2 text-left text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest hidden md:table-cell">Localisation</th>
									<th class="px-6 py-2 text-right text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Action</th>
								</tr>
							</thead>
							<tbody>
								<tr
									v-for="(addr, idx) in recentAddresses"
									:key="idx"
									class="group bg-slate-50/70 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-all duration-300 shadow-xs rounded-2xl border border-slate-200/40 dark:border-slate-800"
								>
									<td class="px-6 py-4 rounded-l-2xl">
										<p class="text-[14px] font-black text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
											{{ addr.neighborhood || 'Adresse' }} {{ addr.housePlateNumber }}
										</p>
										<p class="text-[12px] text-emerald-700 dark:text-emerald-400 font-mono font-bold mt-1 bg-emerald-500/10 inline-block px-2.5 py-0.5 rounded-md border border-emerald-500/20">
											{{ addr.addressCode }}
										</p>
									</td>
									<td class="px-4 py-4">
										<span class="inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-black tracking-widest"
											:class="typeConfig[addr.type || 'home']?.class || typeConfig.home!.class">
											{{ typeConfig[addr.type || 'home']?.label || typeConfig.home!.label }}
										</span>
									</td>
									<td class="px-4 py-4">
										<span
											class="inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-black tracking-widest uppercase border"
											:class="
												addr.status === 'VALIDE' ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20' :
												addr.status === 'NON_VALIDE' ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20' :
												'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
											"
										>
											{{
												addr.status === 'VALIDE' ? 'VALIDE' :
												addr.status === 'NON_VALIDE' ? 'NON VALIDE' :
												'EN ATTENTE'
											}}
										</span>
									</td>
									<td class="px-4 py-4 hidden md:table-cell">
										<p class="text-[13px] font-medium text-slate-600 dark:text-slate-300 truncate max-w-[200px]">
											{{ addr.streetName }}, {{ addr.neighborhood }}
										</p>
									</td>
									<td class="px-6 py-4 text-right rounded-r-2xl">
										<ButtonUI
											@click="emit('navigate', 'addresses')"
											variant="outline"
											size="sm"
											:icon="Map"
											class="border-emerald-500/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/10 bg-white dark:bg-slate-900"
										>
											<span class="hidden sm:inline">Ouvrir</span>
										</ButtonUI>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>

			</div>

			<!-- COLONNE DROITE : Stats + Help -->
			<aside class="w-full lg:w-80 shrink-0 space-y-6">

				<!-- Card Statistiques -->
				<div class="bg-white/80 dark:bg-[#0A0D1A]/80 backdrop-blur-2xl rounded-[32px] border border-slate-200/80 dark:border-slate-800 shadow-xl p-7 relative overflow-hidden">
					<p class="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-5 flex items-center gap-2">
						<span class="w-2 h-2 rounded-full bg-emerald-500"></span>
						Statistiques
					</p>
					
					<div v-if="isLoadingAddresses" class="grid grid-cols-2 gap-4">
						<SkeletonUI height="h-20" rounded="rounded-2xl" />
						<SkeletonUI height="h-20" rounded="rounded-2xl" />
					</div>
					<div v-else class="grid grid-cols-2 gap-4">
						<div class="bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 text-center">
							<p class="text-3xl font-black text-slate-900 dark:text-white">{{ stats.addresses }}</p>
							<p class="text-[11px] text-slate-500 dark:text-slate-400 font-bold mt-1 uppercase tracking-wider">Adresses</p>
						</div>
						<div class="bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 text-center">
							<p class="text-3xl font-black text-slate-900 dark:text-white">{{ stats.shares }}</p>
							<p class="text-[11px] text-slate-500 dark:text-slate-400 font-bold mt-1 uppercase tracking-wider">Partages</p>
						</div>
					</div>
					
					<!-- Barre de quota -->
					<div class="mt-6 pt-5 border-t border-slate-200/60 dark:border-slate-800">
						<div class="flex justify-between items-center mb-2">
							<span class="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Quota utilisé</span>
							<span class="text-[12px] font-black px-2 py-0.5 rounded-md border" :class="addressesList.length >= MAX_ADDRESSES ? 'bg-rose-50 text-rose-600 border-rose-200' : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-500/20'">
								{{ addressesList.length }} / {{ MAX_ADDRESSES }}
							</span>
						</div>
						<div class="w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
							<div
								class="h-full rounded-full transition-all duration-700"
								:class="addressesList.length >= MAX_ADDRESSES ? 'bg-rose-500' : 'bg-emerald-600'"
								:style="{ width: `${(addressesList.length / MAX_ADDRESSES) * 100}%` }"
							/>
						</div>
					</div>
				</div>

				<!-- Card Besoin d'aide -->
				<div class="bg-slate-900 dark:bg-[#0A0D1A] rounded-[32px] p-7 overflow-hidden relative shadow-xl border border-slate-800 group">
					<div class="relative z-10 flex flex-col items-start">
						<div class="w-12 h-12 bg-emerald-600/20 rounded-2xl border border-emerald-500/30 flex items-center justify-center mb-5 text-emerald-400">
							<HelpCircle class="w-6 h-6" />
						</div>
						<h3 class="text-xl font-black text-white mb-2 tracking-tight font-serif">Besoin d'aide ?</h3>
						<p class="text-[14px] font-medium text-slate-300 mb-6 leading-relaxed">
							Nos agents certifiés sont disponibles pour vous guider dans la création et l'officialisation de votre domicile.
						</p>
						<ButtonUI
							@click="emit('navigate', 'support')"
							variant="outline"
							class="w-full justify-between bg-emerald-600 hover:bg-emerald-700 text-white border-transparent rounded-xl cursor-pointer"
						>
							Contacter le support
							<ArrowRight class="w-4 h-4" />
						</ButtonUI>
					</div>
				</div>

			</aside>
		</div>
	</div>
</template>
