<script setup lang="ts">
import { computed } from "vue";
import { Users, Map, AlertCircle, TrendingUp, MessageSquare, ExternalLink } from "lucide-vue-next";
import { useMemory } from "~/composables/useMemory";

definePageMeta({
	layout: "dashboard-admin",
	middleware: ["admin"],
});

// RÃ©cupÃ©ration des donnÃ©es depuis localStorage
const { data: usersData } = useMemory<any[]>("users", []);
const { data: addressesData } = useMemory<any[]>("adresses", []);
const { data: supportData } = useMemory<any[]>("support", []);

// --- Statistiques simulÃ©es basÃ©es sur les donnÃ©es ---
const totalUsers = computed(() => {
	const count = usersData.value ? usersData.value.length : 0;
	// Simule un gros chiffre si on n'a presque personne, juste pour correspondre Ã  la maquette
	return count > 50 ? count : 12842; 
});

const pendingAddresses = computed(() => {
	if (!addressesData.value || addressesData.value.length === 0) return 456;
	return addressesData.value.filter((a: any) => a.status === 'pending').length;
});

const urgentTickets = computed(() => {
	if (!supportData.value || supportData.value.length === 0) return 12;
	return supportData.value.filter((s: any) => s.status === 'non_traite').length;
});

// --- Utilisateurs simulÃ©s pour le tableau ---
const recentUsers = computed(() => {
	if (usersData.value && usersData.value.length > 0) {
		return usersData.value.slice(0, 5);
	}
	// Fallback mock
	return [
		{ id: 'u1', username: 'Emmanuel Kamdem', email: 'e.kamdem@email.com', city: 'YaoundÃ©', status: 'ACTIF' },
		{ id: 'u2', username: 'Marie Atangana', email: 'm.atangana@email.com', city: 'Douala', status: 'INACTIF' },
	];
});

// --- Support rÃ©cent pour la barre latÃ©rale ---
const recentSupport = computed(() => {
	if (supportData.value && supportData.value.length > 0) {
		return supportData.value.slice(0, 4);
	}
	// Fallback mock
	return [
		{ id: 't1', title: 'GÃ©olocalisation Bastos', message: "L'adresse de la villa Horizon n'apparait pas...", status: 'URGENT', time: 'Il y a 5m' },
		{ id: 't2', title: 'Compte bloquÃ© (Mobile)', message: "L'utilisateur ne parvient plus Ã  se connecter...", status: 'TRAITÃ‰', time: 'Il y a 2h' },
		{ id: 't3', title: 'Validation Akwa', message: "Demande de vÃ©rification manuelle...", status: 'TRAITÃ‰', time: 'Hier' },
	];
});

// --- Utilitaires visuels ---
const getStatusColor = (status: string) => {
	if (status === 'ACTIF' || status === 'TRAITÃ‰') return 'bg-[#81C784] text-white';
	if (status === 'URGENT' || status === 'non_traite') return 'bg-rose-500 text-white';
	return 'bg-gray-200 text-gray-700';
};

const getInitials = (name: string) => {
	if (!name) return '??';
	const parts = name.split(' ');
	return parts.length > 1 ? (parts[0][0] + parts[1][0]).toUpperCase() : name.substring(0, 2).toUpperCase();
};
</script>

<template>
	<div class="space-y-6">
		
		<!-- En-tÃªte -->
		<div class="flex items-center justify-between">
			<div>
				<h1 class="text-3xl font-black text-[#155dfc] mb-1">Tableau de Bord</h1>
				<p class="text-sm text-gray-500 font-medium">Bienvenue, voici les activitÃ©s rÃ©centes du systÃ¨me.</p>
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
						<p class="text-4xl font-black text-[#155dfc] mb-2">{{ totalUsers.toLocaleString() }}</p>
						<p class="text-xs font-bold text-[#81C784] flex items-center gap-1">
							<TrendingUp class="w-3 h-3" /> +12.5% ce mois
						</p>
					</div>
					<div class="w-14 h-14 bg-[#F4F6F9] rounded-2xl flex items-center justify-center transition-transform">
						<Users class="w-6 h-6 text-[#155dfc]" />
					</div>
				</div>
			</div>

			<!-- Carte 2 -->
			<div class="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition-all">
				<div class="flex justify-between items-start">
					<div>
						<p class="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Adresses en attente</p>
						<p class="text-4xl font-black text-[#155dfc] mb-2">{{ pendingAddresses }}</p>
						<p class="text-xs font-bold text-gray-500">
							<span class="mr-1">â±</span> Traitement moyen 4h
						</p>
					</div>
					<div class="w-14 h-14 bg-[#E8F5E9] rounded-2xl flex items-center justify-center transition-transform">
						<Map class="w-6 h-6 text-[#00bc7d]" />
					</div>
				</div>
			</div>

			<!-- Carte 3 -->
			<div class="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition-all">
				<div class="flex justify-between items-start">
					<div>
						<p class="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Tickets Urgents</p>
						<p class="text-4xl font-black text-rose-600 mb-2">{{ urgentTickets }}</p>
						<p class="text-xs font-bold text-rose-500 flex items-center gap-1">
							<AlertCircle class="w-3 h-3" /> Requiert attention immÃ©diate
						</p>
					</div>
					<div class="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center transition-transform">
						<AlertCircle class="w-6 h-6 text-rose-500" />
					</div>
				</div>
			</div>
		</div>

		<!-- Layout 2 colonnes pour le contenu -->
		<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
			
			<!-- Colonne Principale (Utilisateurs) -->
			<div class="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col">
				<div class="p-6 border-b border-gray-100 flex items-center justify-between">
					<div>
						<h2 class="text-xl font-black text-[#155dfc]">Gestion des Utilisateurs</h2>
						<p class="text-xs text-gray-500 mt-1">GÃ©rez les accÃ¨s et les statuts des comptes.</p>
					</div>
					<div class="flex gap-2">
						<select class="text-sm bg-[#F4F6F9] border-none rounded-full px-4 py-2 text-[#155dfc] font-bold outline-none focus:ring-2 focus:ring-[#155dfc]/20">
							<option>Cameroun (Tous)</option>
						</select>
						<select class="text-sm bg-[#F4F6F9] border-none rounded-full px-4 py-2 text-[#155dfc] font-bold outline-none focus:ring-2 focus:ring-[#155dfc]/20">
							<option>YaoundÃ©</option>
						</select>
					</div>
				</div>

				<div class="flex-1 overflow-x-auto">
					<table class="w-full text-left border-collapse min-w-[600px]">
						<thead>
							<tr class="bg-[#F8F9FB] text-[10px] font-black text-gray-400 uppercase tracking-wider">
								<th class="px-6 py-4 font-black">Utilisateur</th>
								<th class="px-6 py-4 font-black">Ville</th>
								<th class="px-6 py-4 font-black">Statut</th>
								<th class="px-6 py-4 font-black text-right">Action</th>
							</tr>
						</thead>
						<tbody class="divide-y divide-gray-50">
							<tr v-for="user in recentUsers" :key="user.id" class="hover:bg-gray-50/50 transition-colors group">
								<td class="px-6 py-4">
									<div class="flex items-center gap-3">
										<div class="w-10 h-10 rounded-full bg-[#E8EAF6] text-[#155dfc] flex items-center justify-center font-black text-sm">
											{{ getInitials(user.username) }}
										</div>
										<div>
											<p class="text-sm font-black text-[#155dfc]">{{ user.username }}</p>
											<p class="text-xs text-gray-500">{{ user.email }}</p>
										</div>
									</div>
								</td>
								<td class="px-6 py-4 text-sm text-gray-600 font-medium">
									{{ user.city || 'YaoundÃ©' }}
								</td>
								<td class="px-6 py-4">
									<span 
										class="px-3 py-1 rounded-full text-[10px] font-black tracking-wider"
										:class="user.status === 'INACTIF' ? 'bg-gray-200 text-gray-600' : 'bg-[#81C784]/20 text-[#00bc7d]'"
									>
										{{ user.status || 'ACTIF' }}
									</span>
								</td>
								<td class="px-6 py-4 text-right">
									<button class="p-2 text-gray-400 hover:text-[#155dfc] bg-gray-50 hover:bg-[#E8EAF6] rounded-full transition-colors">
										<ExternalLink class="w-4 h-4" />
									</button>
								</td>
							</tr>
						</tbody>
					</table>
				</div>

				<div class="p-4 border-t border-gray-100 flex items-center justify-between">
					<p class="text-xs text-gray-500 font-medium">Affichage 1-10 sur {{ totalUsers.toLocaleString() }} utilisateurs</p>
					<div class="flex items-center gap-1">
						<button class="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50">â€¹</button>
						<button class="w-8 h-8 rounded-full bg-[#155dfc] text-white font-bold flex items-center justify-center shadow-sm">1</button>
						<button class="w-8 h-8 rounded-full border border-transparent flex items-center justify-center text-gray-600 font-bold hover:bg-gray-50">2</button>
						<button class="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50">â€º</button>
					</div>
				</div>
			</div>

			<!-- Colonne LatÃ©rale (Support) -->
			<div class="bg-[#0A0F2C] rounded-3xl p-6 shadow-lg shadow-[#155dfc]/20 text-white relative overflow-hidden flex flex-col h-full">
				<!-- DÃ©coration de fond -->
				<div class="absolute -top-24 -right-24 w-48 h-48 bg-[#155dfc] rounded-full blur-3xl opacity-50"></div>
				
				<div class="relative z-10 flex items-center justify-between mb-8">
					<div>
						<h2 class="text-xl font-black">Support RÃ©cent</h2>
						<p class="text-xs text-[#8C9EFF] mt-1">Interactions en temps rÃ©el</p>
					</div>
					<div class="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center">
						<MessageSquare class="w-5 h-5 text-white" />
					</div>
				</div>

				<div class="relative z-10 space-y-4 flex-1">
					<div 
						v-for="ticket in recentSupport" 
						:key="ticket.id"
						class="bg-white/5 border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-colors cursor-pointer"
					>
						<div class="flex items-center justify-between mb-2">
							<span 
								class="text-[9px] font-black tracking-widest px-2 py-0.5 rounded-sm uppercase"
								:class="ticket.status === 'URGENT' || ticket.status === 'non_traite' ? 'bg-rose-500 text-white' : 'bg-[#81C784]/20 text-[#81C784]'"
							>
								{{ ticket.status === 'non_traite' ? 'URGENT' : (ticket.status || 'TRAITÃ‰') }}
							</span>
							<span class="text-[10px] text-gray-400 font-medium">{{ ticket.time || 'Il y a 5m' }}</span>
						</div>
						<h3 class="text-sm font-bold text-white mb-1">{{ ticket.title || ticket.subject || 'Nouveau Message' }}</h3>
						<p class="text-xs text-gray-400 line-clamp-2 leading-relaxed">
							{{ ticket.message }}
						</p>
					</div>
				</div>
				
				<button @click="navigateTo('/admin/support')" class="relative z-10 mt-6 w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-bold text-white transition-colors">
					Voir tout le support
				</button>
			</div>

		</div>
	</div>
</template>