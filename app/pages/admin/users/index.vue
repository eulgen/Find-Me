<script setup lang="ts">
import { ref, computed } from "vue";
import { Users, TrendingUp, Ban, Search, Filter, Eye, MapPin, LogIn, CheckCircle } from "lucide-vue-next";
import { useMemory } from "~/composables/useMemory";

definePageMeta({
	layout: "dashboard-admin",
	middleware: ["admin"],
});

const { data: usersData } = useMemory<any[]>("users", []);

const searchQuery = ref("");
const selectedRole = ref("Tous les Rôles");
const selectedUser = ref<any | null>(null);

// Mocks complets pour enrichir le localStorage si vide
const mockUsers = [
	{ id: '1', username: 'Jean-Paul Kamga', email: 'jp.kamga@findme.cm', rule: 'Agent Zone', city: 'Douala', status: 'Actif', photo: 'https://i.pravatar.cc/150?u=1' },
	{ id: '2', username: 'Marie Diallo', email: 'm.diallo@urban-map.sn', rule: 'ADMIN', city: 'Dakar', status: 'Actif', photo: 'https://i.pravatar.cc/150?u=2' },
	{ id: '3', username: 'Koffi Kouamé', email: 'koffi.k@ivory.dev', rule: 'Utilisateur', city: 'Abidjan', status: 'Inactif', photo: 'https://i.pravatar.cc/150?u=3' },
];

const allUsers = computed(() => {
	const localUsers = usersData.value || [];
	if (localUsers.length > 0) return localUsers;
	return mockUsers;
});

const filteredUsers = computed(() => {
	let list = allUsers.value;
	if (searchQuery.value) {
		const q = searchQuery.value.toLowerCase();
		list = list.filter((u: any) => 
			(u.username && u.username.toLowerCase().includes(q)) || 
			(u.email && u.email.toLowerCase().includes(q))
		);
	}
	if (selectedRole.value !== "Tous les Rôles") {
		list = list.filter((u: any) => u.rule === selectedRole.value);
	}
	return list;
});

// Selection auto du premier user au chargement
if (filteredUsers.value.length > 0 && !selectedUser.value) {
	selectedUser.value = filteredUsers.value[0];
}

const selectUser = (user: any) => {
	selectedUser.value = user;
};

const getInitials = (name: string) => {
	if (!name) return '??';
	const parts = name.split(' ');
	return parts.length > 1 ? (parts[0][0] + parts[1][0]).toUpperCase() : name.substring(0, 2).toUpperCase();
};

const getRoleColor = (role: string) => {
	const r = (role || 'Utilisateur').toLowerCase();
	if (r.includes('admin')) return 'bg-indigo-100 text-indigo-700';
	if (r.includes('agent')) return 'bg-slate-100 text-slate-700';
	return 'bg-gray-100 text-gray-600';
};
</script>

<template>
	<div class="h-full flex flex-col xl:flex-row gap-6">
		
		<!-- COLONNE PRINCIPALE -->
		<div class="flex-1 flex flex-col space-y-6">
			
			<!-- En-tête -->
			<div class="flex items-center justify-between flex-wrap gap-4">
				<div>
					<h1 class="text-2xl font-black text-[#155dfc] mb-1">Gestion des Utilisateurs</h1>
					<p class="text-sm text-gray-500 font-medium">Supervisez et gérez les accès au système FindMe.</p>
				</div>
				<button class="px-5 py-2.5 bg-[#0A7A38] rounded-full text-sm font-bold text-white hover:bg-[#08632d] shadow-md shadow-[#0A7A38]/30 transition-all flex items-center gap-2">
					<Users class="w-4 h-4" /> Nouvel Utilisateur
				</button>
			</div>

			<!-- Cartes Statistiques -->
			<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
				<div class="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
					<div class="w-12 h-12 bg-[#81C784]/20 rounded-full flex items-center justify-center shrink-0">
						<Users class="w-5 h-5 text-[#00bc7d]" />
					</div>
					<div>
						<p class="text-[10px] font-black text-gray-500 uppercase tracking-wider mb-0.5">Utilisateurs Actifs</p>
						<p class="text-2xl font-black text-[#155dfc]">1,284</p>
					</div>
				</div>

				<div class="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
					<div class="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center shrink-0">
						<TrendingUp class="w-5 h-5 text-indigo-500" />
					</div>
					<div>
						<p class="text-[10px] font-black text-gray-500 uppercase tracking-wider mb-0.5">Nouveaux (7J)</p>
						<p class="text-2xl font-black text-[#155dfc]">+42</p>
					</div>
				</div>

				<div class="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
					<div class="w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center shrink-0">
						<Ban class="w-5 h-5 text-rose-500" />
					</div>
					<div>
						<p class="text-[10px] font-black text-gray-500 uppercase tracking-wider mb-0.5">Comptes Suspendus</p>
						<p class="text-2xl font-black text-[#155dfc]">18</p>
					</div>
				</div>
			</div>

			<!-- Zone de filtrage et Liste -->
			<div class="bg-white rounded-3xl border border-gray-100 shadow-sm flex-1 flex flex-col overflow-hidden">
				
				<!-- Filtres -->
				<div class="p-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4">
					<div class="flex gap-2">
						<select class="text-sm bg-white border border-gray-200 rounded-full px-4 py-2 text-gray-700 font-semibold outline-none focus:border-[#155dfc]">
							<option>Tous les Pays</option>
							<option>Cameroun</option>
						</select>
						<select v-model="selectedRole" class="text-sm bg-white border border-gray-200 rounded-full px-4 py-2 text-gray-700 font-semibold outline-none focus:border-[#155dfc]">
							<option>Tous les Rôles</option>
							<option>ADMIN</option>
							<option>Agent Zone</option>
							<option>Utilisateur</option>
						</select>
					</div>
					<button class="flex items-center gap-2 text-sm font-bold text-[#155dfc] hover:text-indigo-800">
						<Filter class="w-4 h-4" /> Filtres Avancés
					</button>
				</div>

				<!-- Tableau -->
				<div class="flex-1 overflow-x-auto">
					<table class="w-full text-left border-collapse min-w-[700px]">
						<thead>
							<tr class="bg-white text-[10px] font-black text-gray-400 uppercase tracking-wider border-b border-gray-100">
								<th class="px-6 py-4">Utilisateur</th>
								<th class="px-6 py-4">Rôle</th>
								<th class="px-6 py-4">Ville</th>
								<th class="px-6 py-4">Statut</th>
								<th class="px-6 py-4 text-right"></th>
							</tr>
						</thead>
						<tbody class="divide-y divide-gray-50">
							<tr 
								v-for="user in filteredUsers" 
								:key="user.id" 
								@click="selectUser(user)"
								class="transition-colors group cursor-pointer"
								:class="selectedUser?.id === user.id ? 'bg-[#F4F6F9]' : 'hover:bg-gray-50'"
							>
								<td class="px-6 py-4">
									<div class="flex items-center gap-3">
										<div class="w-10 h-10 rounded-full overflow-hidden bg-[#155dfc] text-white flex items-center justify-center font-bold shrink-0">
											<img v-if="user.photo" :src="user.photo" class="w-full h-full object-cover" />
											<span v-else>{{ getInitials(user.username) }}</span>
										</div>
										<div>
											<p class="text-sm font-black text-gray-900">{{ user.username }}</p>
											<p class="text-xs text-gray-500">{{ user.email }}</p>
										</div>
									</div>
								</td>
								<td class="px-6 py-4">
									<span class="px-2.5 py-1 rounded-md text-[10px] font-black tracking-wide uppercase" :class="getRoleColor(user.rule)">
										{{ user.rule || 'Utilisateur' }}
									</span>
								</td>
								<td class="px-6 py-4 text-sm text-gray-600 font-medium">
									{{ user.city || 'Non renseigné' }}
								</td>
								<td class="px-6 py-4">
									<span 
										class="px-2.5 py-1 rounded-full text-[10px] font-black tracking-wider"
										:class="user.status === 'Inactif' ? 'bg-gray-100 text-gray-600' : 'bg-[#81C784] text-white'"
									>
										{{ user.status || 'Actif' }}
									</span>
								</td>
								<td class="px-6 py-4 text-right">
									<button class="p-1.5 text-gray-400 hover:text-[#155dfc] transition-colors">
										<Eye class="w-5 h-5" />
									</button>
								</td>
							</tr>
						</tbody>
					</table>
				</div>

				<!-- Pagination -->
				<div class="p-4 border-t border-gray-100 flex items-center justify-between bg-white rounded-b-3xl">
					<p class="text-xs text-gray-500 font-medium">Affichage 1-10 sur {{ allUsers.length }}</p>
					<div class="flex items-center gap-1">
						<button class="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50">â€¹</button>
						<button class="w-8 h-8 rounded-full bg-[#81C784] text-white font-bold flex items-center justify-center shadow-sm">1</button>
						<button class="w-8 h-8 rounded-full border border-transparent flex items-center justify-center text-gray-600 font-bold hover:bg-gray-50">2</button>
						<button class="w-8 h-8 rounded-full border border-transparent flex items-center justify-center text-gray-600 font-bold hover:bg-gray-50">3</button>
						<button class="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50">â€º</button>
					</div>
				</div>
			</div>
		</div>

		<!-- COLONNE LATÉRALE (Détails Utilisateur) -->
		<div class="w-full xl:w-[350px] shrink-0 flex flex-col gap-4">
			
			<div v-if="selectedUser" class="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-full">
				<!-- Profil Header -->
				<div class="bg-[#0A0F2C] p-8 flex flex-col items-center text-center relative">
					<div class="absolute inset-0 bg-gradient-to-br from-[#155dfc]/40 to-transparent"></div>
					<div class="w-20 h-20 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white flex items-center justify-center z-10 mb-4">
						<img v-if="selectedUser.photo" :src="selectedUser.photo" class="w-full h-full object-cover" />
						<span v-else class="text-2xl font-black text-[#155dfc]">{{ getInitials(selectedUser.username) }}</span>
					</div>
					<h2 class="text-xl font-black text-white relative z-10">{{ selectedUser.username }}</h2>
					<p class="text-xs text-[#8C9EFF] relative z-10 mb-3">{{ selectedUser.email }}</p>
					<span class="px-4 py-1 bg-[#81C784] text-gray-900 rounded-full text-[10px] font-black uppercase tracking-widest relative z-10">
						{{ selectedUser.rule || 'Utilisateur' }}
					</span>
				</div>

				<div class="p-6 flex-1 flex flex-col">
					<!-- Permissions Toggles -->
					<div class="mb-8">
						<p class="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-4">Permissions</p>
						<div class="space-y-4">
							<div class="flex items-center justify-between">
								<span class="text-sm font-semibold text-gray-700">Édition des adresses</span>
								<div class="w-10 h-6 bg-[#81C784] rounded-full p-1 cursor-pointer flex justify-end">
									<div class="w-4 h-4 bg-white rounded-full shadow-sm"></div>
								</div>
							</div>
							<div class="flex items-center justify-between">
								<span class="text-sm font-semibold text-gray-700">Export de données</span>
								<div class="w-10 h-6 bg-gray-200 rounded-full p-1 cursor-pointer">
									<div class="w-4 h-4 bg-white rounded-full shadow-sm"></div>
								</div>
							</div>
							<div class="flex items-center justify-between">
								<span class="text-sm font-semibold text-gray-700">Accès aux logs system</span>
								<div class="w-10 h-6 bg-gray-200 rounded-full p-1 cursor-pointer">
									<div class="w-4 h-4 bg-white rounded-full shadow-sm"></div>
								</div>
							</div>
						</div>
					</div>

					<!-- Activité Récente -->
					<div class="flex-1">
						<p class="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-4">Activité Récente</p>
						<div class="space-y-5 relative before:absolute before:inset-y-0 before:left-[11px] before:w-[2px] before:bg-gray-100">
							
							<div class="relative pl-8">
								<div class="absolute left-0 top-1 w-6 h-6 bg-gray-100 rounded-full border-4 border-white flex items-center justify-center shadow-sm">
									<MapPin class="w-3 h-3 text-gray-500" />
								</div>
								<p class="text-sm font-bold text-gray-800 leading-tight mb-0.5">Modifié l'adresse #4421-Douala</p>
								<p class="text-[10px] text-gray-400">Il y a 2 heures</p>
							</div>

							<div class="relative pl-8">
								<div class="absolute left-0 top-1 w-6 h-6 bg-gray-100 rounded-full border-4 border-white flex items-center justify-center shadow-sm">
									<LogIn class="w-3 h-3 text-gray-500" />
								</div>
								<p class="text-sm font-bold text-gray-800 leading-tight mb-0.5">Connexion au dashboard Admin</p>
								<p class="text-[10px] text-gray-400">Aujourd'hui, 08:42</p>
							</div>

							<div class="relative pl-8">
								<div class="absolute left-0 top-1 w-6 h-6 bg-gray-100 rounded-full border-4 border-white flex items-center justify-center shadow-sm">
									<CheckCircle class="w-3 h-3 text-gray-500" />
								</div>
								<p class="text-sm font-bold text-gray-800 leading-tight mb-0.5">Validation de 12 nouveaux points</p>
								<p class="text-[10px] text-gray-400">Hier, 17:15</p>
							</div>
						</div>
					</div>

					<!-- Actions -->
					<div class="pt-6 mt-4 border-t border-gray-100 flex gap-3">
						<button class="flex-1 py-2.5 border border-gray-200 text-gray-700 font-bold rounded-full text-sm hover:bg-gray-50 transition-colors">
							Suspendre
						</button>
						<button class="flex-1 py-2.5 bg-[#0A0F2C] text-white font-bold rounded-full text-sm hover:bg-[#155dfc] transition-colors shadow-md shadow-[#0A0F2C]/20">
							Modifier Profil
						</button>
					</div>
				</div>
			</div>
			
			<div v-else class="bg-white rounded-3xl border border-gray-100 shadow-sm flex items-center justify-center h-full p-8 text-center text-gray-400">
				Sélectionnez un utilisateur pour voir les détails.
			</div>

		</div>
	</div>
</template>