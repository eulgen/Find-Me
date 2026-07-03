<!--
  @file app/components/dashboard/DashboardOverview.vue
  @description Onglet "Tableau de bord" — design premium glassmorphism.
  Résumé de l'activité utilisateur : carte de bienvenue animée, accès rapide, adresses récentes et statistiques.
-->

<script setup lang="ts">
import {
	MapPin, Plus, Search, ArrowRight, HelpCircle, Map,
} from "lucide-vue-next";
import ButtonUI from "~/components/ui/ButtonUI.vue";
import { useAddresses } from "~/composables/useAddresses";
import { useAuth } from "~/composables/useAuth";

const emit = defineEmits<{
	(e: "navigate", section: string): void;
}>();

const { currentUser } = useAuth();
const { addressesList, MAX_ADDRESSES } = useAddresses();

const userName = computed(() => (currentUser.value?.username || currentUser.value?.email.split("@")[0] || "Citoyen").toUpperCase());

const typeConfig: Record<string, { label: string; class: string }> = {
	home: { label: "PRIVÉ", class: "bg-emerald-50 text-emerald-600 dark:bg-[#0f172b]/20 dark:text-[#0f172b]" },
	work: { label: "TRAVAIL", class: "bg-teal-50 text-teal-600 dark:bg-teal-500/20 dark:text-teal-400" },
	family: { label: "FAMILLE", class: "bg-indigo-50 text-indigo-500 dark:bg-indigo-500/20 dark:text-indigo-400" },
	other: { label: "AUTRE", class: "bg-slate-100 text-slate-600 dark:bg-slate-50 dark:text-slate-700" },
};

const recentAddresses = computed(() => addressesList.value.slice(0, 3));

const stats = computed(() => ({
	addresses: addressesList.value.length,
	shares: addressesList.value.length * 4,
}));
</script>

<template>
	<div class="flex-1 w-full animate-in fade-in slide-in-from-bottom-4 duration-700" id="dashboard-overview">
		<div class="flex flex-col lg:flex-row gap-6">
			
			<!-- ═══════════════════════════════════════════════════ -->
			<!-- COLONNE PRINCIPALE                                  -->
			<!-- ═══════════════════════════════════════════════════ -->
			<div class="flex-1 min-w-0 space-y-6">

				<!-- ── Hero Card : Bienvenue ── -->
				<div class="relative bg-white/40 dark:bg-[#0A0D1A]/40 backdrop-blur-2xl rounded-[32px] border border-white/60 dark:border-slate-200 shadow-[0_8px_32px_rgba(0,0,0,0.04)] overflow-hidden group">
					<!-- Animated Background Gradient -->
					<div class="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-teal-500/10 opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
					<div class="absolute -right-20 -top-20 w-64 h-64 bg-emerald-400/20 blur-[80px] rounded-full transition-transform duration-700" />
					
					<div class="relative p-6 sm:p-10 flex flex-col-reverse sm:flex-row items-center sm:items-start justify-between gap-6 text-center sm:text-left z-10">
						<div class="flex-1 min-w-0 flex flex-col items-center sm:items-start">
							<!-- Badge vérifié -->
							<div class="inline-flex items-center gap-2 px-3 py-1.5 bg-white/60 dark:bg-white backdrop-blur-md rounded-full border border-emerald-500/20 shadow-sm mb-4">
								<span class="relative flex h-2 w-2">
								  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
								  <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
								</span>
								<span class="text-[10px] font-black text-emerald-600 dark:text-[#0f172b] uppercase tracking-widest">Compte Vérifié</span>
							</div>
							
							<h1 class="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 mb-3 tracking-tight">
								Bienvenue, {{ userName }}
							</h1>
							<p class="text-[15px] font-medium text-slate-600 dark:text-slate-600 leading-relaxed max-w-md">
								Votre système d'adressage numérique est actif.
								Localisez et partagez votre position avec une précision millimétrique.
							</p>
						</div>
						<!-- Illustration décorative -->
						<div class="shrink-0 relative w-32 h-32 flex items-center justify-center transition-transform duration-500">
							<div class="absolute inset-0 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-3xl opacity-20 blur-xl animate-pulse-slow" />
							<div class="relative w-full h-full bg-white/50 dark:bg-slate-50 backdrop-blur-xl border border-white/60 dark:border-slate-300 rounded-3xl flex items-center justify-center shadow-xl">
								<MapPin class="w-14 h-14 text-emerald-500 drop-shadow-md" />
							</div>
						</div>
					</div>
				</div>

				<!-- ── Cards d'accès rapide ── -->
				<div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
					<!-- Créer une adresse -->
					<button
						@click="emit('navigate', 'addresses')"
						class="relative bg-white/40 dark:bg-[#0A0D1A]/40 backdrop-blur-xl rounded-[24px] border border-white/60 dark:border-slate-200 p-6 flex items-center gap-5 text-left hover:border-emerald-500/40 hover:bg-white/60 dark:hover:bg-slate-900/60 transition-all duration-300 group overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.03)]"
					>
						<div class="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
						<div class="relative w-14 h-14 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30 shrink-0 group-hover:rotate-3 transition-transform duration-300">
							<Plus class="w-7 h-7 text-white" />
						</div>
						<div class="relative">
							<p class="text-base font-black text-slate-800 dark:text-[#0f172b] mb-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">Créer une adresse</p>
							<p class="text-[13px] font-medium text-slate-500 dark:text-slate-600 leading-snug">Générez un code digital unique.</p>
						</div>
					</button>

					<!-- Rechercher un lieu -->
					<button
						class="relative bg-white/40 dark:bg-[#0A0D1A]/40 backdrop-blur-xl rounded-[24px] border border-white/60 dark:border-slate-200 p-6 flex items-center gap-5 text-left hover:border-teal-500/40 hover:bg-white/60 dark:hover:bg-slate-900/60 transition-all duration-300 group overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.03)]"
					>
						<div class="absolute inset-0 bg-gradient-to-r from-teal-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
						<div class="relative w-14 h-14 bg-gradient-to-br from-teal-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-teal-500/30 shrink-0 group-hover:-rotate-3 transition-transform duration-300">
							<Search class="w-7 h-7 text-white" />
						</div>
						<div class="relative">
							<p class="text-base font-black text-slate-800 dark:text-[#0f172b] mb-1 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">Rechercher un lieu</p>
							<p class="text-[13px] font-medium text-slate-500 dark:text-slate-600 leading-snug">Trouvez n'importe quelle destination.</p>
						</div>
					</button>
				</div>

				<!-- ── Tableau : Mes Adresses Récentes ── -->
				<div class="bg-white/40 dark:bg-[#0A0D1A]/40 backdrop-blur-2xl rounded-[32px] border border-white/60 dark:border-slate-200 shadow-[0_8px_32px_rgba(0,0,0,0.04)] overflow-hidden">
					<div class="px-8 py-6 border-b border-white/40 dark:border-slate-200 flex items-center justify-between bg-white/20 dark:bg-white">
						<h2 class="text-[15px] font-black uppercase tracking-wider text-slate-800 dark:text-[#0f172b]">Dernières Adresses</h2>
						<button
							@click="emit('navigate', 'addresses')"
							class="group flex items-center gap-1.5 text-emerald-600 dark:text-[#0f172b] text-sm font-black hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
						>
							Voir tout
							<ArrowRight class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
						</button>
					</div>

					<div v-if="recentAddresses.length === 0" class="px-8 py-16 text-center">
						<div class="relative w-24 h-24 mx-auto mb-6">
							<div class="absolute inset-0 bg-emerald-500/10 rounded-full blur-xl animate-pulse" />
							<div class="relative w-full h-full bg-white/60 dark:bg-slate-50 backdrop-blur-md rounded-full flex items-center justify-center border border-white/40 dark:border-slate-300 shadow-lg">
								<MapPin class="w-10 h-10 text-slate-400" />
							</div>
						</div>
						<p class="text-[15px] font-bold text-slate-500 mb-6">Aucune adresse enregistrée pour le moment.</p>
						<ButtonUI @click="emit('navigate', 'addresses')" variant="primary" :icon="Plus">
							Créer ma première adresse
						</ButtonUI>
					</div>

					<div v-else class="w-full overflow-x-auto p-2">
						<table class="w-full min-w-[600px] border-separate border-spacing-y-2">
							<thead>
								<tr>
									<th class="px-6 py-2 text-left text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Nom & Code</th>
									<th class="px-4 py-2 text-left text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Type</th>
									<th class="px-4 py-2 text-left text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest hidden md:table-cell">Localisation</th>
									<th class="px-6 py-2 text-right text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Action</th>
								</tr>
							</thead>
							<tbody>
								<tr
									v-for="(addr, idx) in recentAddresses"
									:key="idx"
									class="group bg-white/40 dark:bg-slate-50 hover:bg-white/80 dark:hover:bg-slate-700/60 transition-all duration-300 shadow-sm hover:shadow-md rounded-2xl"
								>
									<td class="px-6 py-4 rounded-l-2xl">
										<p class="text-[14px] font-black text-slate-800 dark:text-[#0f172b] group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
											{{ addr.neighborhood || 'Adresse' }} {{ addr.housePlateNumber }}
										</p>
										<p class="text-[12px] text-emerald-600 dark:text-[#0f172b] font-mono font-bold mt-1 bg-emerald-50 dark:bg-[#0f172b]/10 inline-block px-2 py-0.5 rounded-md">
											{{ addr.addressCode }}
										</p>
									</td>
									<td class="px-4 py-4">
										<span class="inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-black tracking-widest border border-white/20 shadow-sm"
											:class="typeConfig[addr.type || 'home']?.class || typeConfig.home!.class">
											{{ typeConfig[addr.type || 'home']?.label || typeConfig.home!.label }}
										</span>
									</td>
									<td class="px-4 py-4 hidden md:table-cell">
										<p class="text-[13px] font-medium text-slate-500 dark:text-slate-600 truncate max-w-[200px]">
											{{ addr.streetName }}, {{ addr.neighborhood }}
										</p>
									</td>
									<td class="px-6 py-4 text-right rounded-r-2xl">
										<ButtonUI
											@click="emit('navigate', 'addresses')"
											variant="outline"
											size="sm"
											:icon="Map"
											class="border-emerald-500/20 text-emerald-600 dark:text-[#0f172b] hover:bg-emerald-500/10 shadow-sm bg-white/50 dark:bg-white backdrop-blur-md"
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

			<!-- ═══════════════════════════════════════════════════ -->
			<!-- COLONNE DROITE : Stats + Help                       -->
			<!-- ═══════════════════════════════════════════════════ -->
			<aside class="w-full lg:w-80 shrink-0 space-y-6">

				<!-- ── Card Statistiques ── -->
				<div class="bg-white/40 dark:bg-[#0A0D1A]/40 backdrop-blur-2xl rounded-[32px] border border-white/60 dark:border-slate-200 shadow-[0_8px_32px_rgba(0,0,0,0.04)] p-7 relative overflow-hidden">
					<div class="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-bl-full pointer-events-none" />
					
					<p class="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-5 flex items-center gap-2">
						<span class="w-2 h-2 rounded-full bg-emerald-500"></span>
						Statistiques
					</p>
					
					<div class="grid grid-cols-2 gap-4">
						<div class="bg-white/60 dark:bg-slate-50 backdrop-blur-md border border-white/40 dark:border-slate-300 shadow-sm rounded-2xl p-4 text-center group transition-transform duration-300">
							<p class="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-b from-slate-800 to-slate-500 dark:from-white dark:to-slate-400 group-hover:from-emerald-500 group-hover:to-teal-500 transition-all">{{ stats.addresses }}</p>
							<p class="text-[11px] text-slate-500 dark:text-slate-600 font-bold mt-1 uppercase tracking-wider">Adresses</p>
						</div>
						<div class="bg-white/60 dark:bg-slate-50 backdrop-blur-md border border-white/40 dark:border-slate-300 shadow-sm rounded-2xl p-4 text-center group transition-transform duration-300">
							<p class="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-b from-slate-800 to-slate-500 dark:from-white dark:to-slate-400 group-hover:from-emerald-500 group-hover:to-teal-500 transition-all">{{ stats.shares }}</p>
							<p class="text-[11px] text-slate-500 dark:text-slate-600 font-bold mt-1 uppercase tracking-wider">Partages</p>
						</div>
					</div>
					
					<!-- Barre de quota -->
					<div class="mt-6 pt-5 border-t border-white/40 dark:border-slate-300">
						<div class="flex justify-between items-center mb-2">
							<span class="text-[11px] font-black text-slate-500 uppercase tracking-widest">Quota utilisé</span>
							<span class="text-[12px] font-black bg-white/50 dark:bg-white px-2 py-0.5 rounded-md border border-white/20" :class="addressesList.length >= MAX_ADDRESSES ? 'text-rose-500' : 'text-emerald-600 dark:text-[#0f172b]'">
								{{ addressesList.length }} / {{ MAX_ADDRESSES }}
							</span>
						</div>
						<div class="w-full h-2.5 bg-slate-200/50 dark:bg-slate-50 rounded-full overflow-hidden shadow-inner backdrop-blur-sm">
							<div
								class="h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(52,211,153,0.4)]"
								:class="addressesList.length >= MAX_ADDRESSES ? 'bg-gradient-to-r from-rose-400 to-rose-600' : 'bg-gradient-to-r from-emerald-400 to-teal-500'"
								:style="{ width: `${(addressesList.length / MAX_ADDRESSES) * 100}%` }"
							/>
						</div>
					</div>
				</div>

				<!-- ── Card Besoin d'aide ── -->
				<div class="bg-gradient-to-br from-blue-600 to-indigo-700 dark:from-blue-900 dark:to-indigo-950 rounded-[32px] p-7 overflow-hidden relative shadow-[0_8px_32px_rgba(0,0,0,0.15)] border border-blue-500/30 group">
					<!-- Décorations lumineuses -->
					<div class="absolute -bottom-10 -right-10 w-40 h-40 bg-emerald-500/20 rounded-full blur-[40px] group- group-hover:bg-teal-500/30 transition-all duration-700 ease-out"></div>
					<div class="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-[30px]"></div>

					<div class="relative z-10 flex flex-col items-start">
						<div class="w-12 h-12 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/10 flex items-center justify-center mb-5 shadow-lg group-hover:rotate-6 transition-transform duration-300">
							<HelpCircle class="w-6 h-6 text-white drop-shadow-md" />
						</div>
						<h3 class="text-xl font-black text-white mb-2 tracking-tight">Besoin d'aide ?</h3>
						<p class="text-[14px] font-medium text-slate-300 mb-6 leading-relaxed">
							Nos experts sont disponibles pour vous guider dans la configuration de votre domicile.
						</p>
						<ButtonUI
							@click="emit('navigate', 'support')"
							variant="outline"
							class="w-full justify-between bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/20 backdrop-blur-md rounded-xl"
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

<style scoped>
.animate-pulse-slow {
	animation: pulseBg 6s ease-in-out infinite;
}
@keyframes pulseBg {
	0%, 100% { opacity: 0.2; }
	50% { opacity: 0.4; }
}
</style>
