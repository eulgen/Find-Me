<script setup lang="ts">
import { ref, computed } from "vue";
import { Filter, Download, MapPin, Search, ChevronRight, X, FileText, Share2 } from "lucide-vue-next";
import { useMemory } from "~/composables/useMemory";

definePageMeta({
	layout: "dashboard-admin",
	middleware: ["admin"],
});

const { data: addressesData } = useMemory<any[]>("adresses", []);

// Mocks complets pour enrichir le localStorage si vide
const mockAddresses = [
	{ id: '1', code: 'YAO-B123', city: 'Yaoundé', quarter: 'Bastos, Rue 1.024', resident: 'Jean-Pierre Nkou', status: 'Validé', phone: '+237 6xx xx xx xx', buildingImg: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' },
	{ id: '2', code: 'DLA-A045', city: 'Douala', quarter: 'Akwa, Bd de la Liberté', resident: 'Marie-Thérèse Ebollo', status: 'En attente', phone: '+237 6xx xx xx xx' },
	{ id: '3', code: 'YAO-K089', city: 'Yaoundé', quarter: 'Kotto, Villa 12', resident: 'Oumarou Bello', status: 'Signalé', phone: '+237 6xx xx xx xx' },
	{ id: '4', code: 'DSG-X992', city: 'Dschang', quarter: 'Centre Ville, Secteur A', resident: 'Lucas Fotso', status: 'Validé', phone: '+237 6xx xx xx xx' },
];

const allAddresses = computed(() => {
	const localAds = addressesData.value || [];
	if (localAds.length > 0) return localAds;
	return mockAddresses;
});

const searchQuery = ref("");
const selectedAddress = ref<any | null>(null);

const filteredAddresses = computed(() => {
	let list = allAddresses.value;
	if (searchQuery.value) {
		const q = searchQuery.value.toLowerCase();
		list = list.filter((a: any) => 
			(a.code && a.code.toLowerCase().includes(q)) || 
			(a.resident && a.resident.toLowerCase().includes(q))
		);
	}
	return list;
});

if (filteredAddresses.value.length > 0 && !selectedAddress.value) {
	selectedAddress.value = filteredAddresses.value[0];
}

const getStatusStyles = (status: string) => {
	const s = (status || 'En attente').toLowerCase();
	if (s.includes('validé')) return 'bg-[#81C784] text-white';
	if (s.includes('signalé')) return 'bg-rose-100 text-rose-700';
	return 'bg-orange-100 text-orange-700'; // En attente
};

</script>

<template>
	<div class="h-full flex flex-col xl:flex-row gap-6">
		
		<!-- COLONNE GAUCHE (Filtres Avancés) -->
		<div class="w-full xl:w-[280px] shrink-0 flex flex-col gap-6">
			<div>
				<h1 class="text-2xl font-black text-[#155dfc] mb-1">Répertoire des Adresses</h1>
				<p class="text-xs text-gray-500 font-medium">Gérez et validez le registre national des adresses FindMe.</p>
			</div>

			<div class="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 flex-1">
				<div class="flex items-center gap-2 mb-6">
					<Filter class="w-5 h-5 text-gray-400" />
					<h3 class="font-black text-gray-800">Filtres Avancés</h3>
				</div>

				<div class="space-y-5">
					<div>
						<label class="block text-xs font-bold text-gray-500 mb-1.5">Pays</label>
						<select class="w-full text-sm bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-700 outline-none focus:border-[#155dfc]">
							<option>Cameroun</option>
						</select>
					</div>
					<div>
						<label class="block text-xs font-bold text-gray-500 mb-1.5">Ville</label>
						<select class="w-full text-sm bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-700 outline-none focus:border-[#155dfc]">
							<option>Toutes les villes</option>
							<option>Yaoundé</option>
							<option>Douala</option>
						</select>
					</div>
					<div>
						<label class="block text-xs font-bold text-gray-500 mb-1.5">Quartier</label>
						<input type="text" placeholder="Ex: Bastos" class="w-full text-sm bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-700 outline-none focus:border-[#155dfc] placeholder-gray-400" />
					</div>
					<div>
						<label class="block text-xs font-bold text-gray-500 mb-2">Statut</label>
						<div class="space-y-3">
							<label class="flex items-center gap-3 cursor-pointer">
								<div class="w-5 h-5 rounded-full bg-[#81C784] flex items-center justify-center">
									<div class="w-2 h-2 bg-white rounded-full"></div>
								</div>
								<span class="text-sm text-gray-700 font-semibold">Validé</span>
							</label>
							<label class="flex items-center gap-3 cursor-pointer">
								<div class="w-5 h-5 rounded-full bg-[#81C784] flex items-center justify-center">
									<div class="w-2 h-2 bg-white rounded-full"></div>
								</div>
								<span class="text-sm text-gray-700 font-semibold">En attente</span>
							</label>
							<label class="flex items-center gap-3 cursor-pointer">
								<div class="w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center"></div>
								<span class="text-sm text-gray-700 font-semibold">Signalé</span>
							</label>
						</div>
					</div>
				</div>

				<div class="mt-8 space-y-3">
					<button class="w-full py-3 bg-black text-white rounded-full text-sm font-bold shadow-lg shadow-black/20 hover:bg-gray-800 transition-all">
						Appliquer les filtres
					</button>
					<button class="w-full py-3 text-gray-500 hover:text-gray-800 text-sm font-bold transition-all">
						Réinitialiser
					</button>
				</div>
			</div>
		</div>

		<!-- COLONNE CENTRALE (Liste) -->
		<div class="flex-1 flex flex-col gap-6 overflow-hidden">
			
			<div class="bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col flex-1 overflow-hidden">
				<div class="p-4 border-b border-gray-100 flex items-center justify-between">
					<p class="text-sm font-bold text-gray-800">{{ filteredAddresses.length }} Adresses trouvées</p>
					<button class="px-4 py-2 bg-white border border-gray-200 rounded-full text-xs font-bold text-gray-700 flex items-center gap-2 hover:bg-gray-50 transition-colors">
						<Download class="w-3.5 h-3.5" /> Exporter CSV
					</button>
				</div>

				<div class="flex-1 overflow-y-auto">
					<table class="w-full text-left border-collapse min-w-[500px]">
						<thead>
							<tr class="bg-white text-[10px] font-black text-gray-400 uppercase tracking-wider border-b border-gray-100">
								<th class="px-5 py-4 w-[120px]">Code</th>
								<th class="px-5 py-4">Ville / Quartier</th>
								<th class="px-5 py-4">Résident</th>
								<th class="px-5 py-4">Statut</th>
								<th class="px-5 py-4 text-right">Actions</th>
							</tr>
						</thead>
						<tbody class="divide-y divide-gray-50">
							<tr 
								v-for="addr in filteredAddresses" 
								:key="addr.id" 
								@click="selectedAddress = addr"
								class="hover:bg-gray-50 cursor-pointer transition-colors"
								:class="selectedAddress?.id === addr.id ? 'bg-[#F4F6F9]' : ''"
							>
								<td class="px-5 py-4">
									<div class="flex items-center gap-3">
										<div class="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center shrink-0">
											<MapPin class="w-4 h-4 text-indigo-500" />
										</div>
										<span class="text-sm font-black text-[#155dfc]">{{ addr.code }}</span>
									</div>
								</td>
								<td class="px-5 py-4">
									<p class="text-sm font-bold text-gray-900">{{ addr.city }}</p>
									<p class="text-[11px] text-gray-500 truncate max-w-[150px]">{{ addr.quarter }}</p>
								</td>
								<td class="px-5 py-4">
									<p class="text-sm font-bold text-gray-700">{{ addr.resident || 'N/A' }}</p>
								</td>
								<td class="px-5 py-4">
									<span class="px-2 py-1 block text-center w-20 rounded-md text-[10px] font-black tracking-wide" :class="getStatusStyles(addr.status)">
										{{ addr.status || 'En attente' }}
									</span>
								</td>
								<td class="px-5 py-4 text-right">
									<!-- Actions invisibles/vides sur la maquette mais prévues -->
								</td>
							</tr>
						</tbody>
					</table>
				</div>

				<div class="p-4 border-t border-gray-100 flex items-center justify-between">
					<p class="text-xs text-gray-500 font-medium">Affichage 1-4 sur {{ allAddresses.length }}</p>
					<div class="flex items-center gap-1">
						<button class="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50">â€¹</button>
						<button class="w-8 h-8 rounded-full bg-black text-white font-bold flex items-center justify-center shadow-sm">1</button>
						<button class="w-8 h-8 rounded-full border border-transparent flex items-center justify-center text-gray-600 font-bold hover:bg-gray-50">2</button>
						<button class="w-8 h-8 rounded-full border border-transparent flex items-center justify-center text-gray-600 font-bold hover:bg-gray-50">3</button>
						<button class="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50">â€º</button>
					</div>
				</div>
			</div>

			<!-- Zone Statistiques & Aide du bas -->
			<div class="grid grid-cols-1 md:grid-cols-2 gap-6 h-[160px] shrink-0">
				<!-- Stat Globales -->
				<div class="bg-[#0A0F2C] rounded-3xl p-6 text-white relative overflow-hidden shadow-lg">
					<div class="absolute -right-10 -bottom-10 w-32 h-32 bg-[#155dfc] rounded-full blur-2xl opacity-50"></div>
					<h3 class="text-lg font-black relative z-10 mb-4">Statistiques Globales</h3>
					<div class="flex gap-8 relative z-10">
						<div>
							<p class="text-[10px] text-gray-400 font-bold tracking-widest uppercase mb-1">Total National</p>
							<p class="text-2xl font-black">12,482</p>
						</div>
						<div>
							<p class="text-[10px] text-gray-400 font-bold tracking-widest uppercase mb-1">Validation (24H)</p>
							<p class="text-2xl font-black">+142</p>
						</div>
					</div>
					<p class="text-[10px] italic text-[#8C9EFF] mt-3 relative z-10">"L'objectif de couverture urbaine est de 85% d'ici la fin de l'année."</p>
				</div>
				<!-- Aide -->
				<div class="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm relative overflow-hidden flex flex-col justify-center items-center text-center">
					<div class="absolute top-4 right-4 text-[#81C784]/30">
						<FileText class="w-16 h-16" />
					</div>
					<h3 class="text-lg font-black text-gray-800 mb-2 relative z-10">Aide Ã  la Validation</h3>
					<p class="text-xs text-gray-500 mb-4 relative z-10 max-w-[200px]">Besoin de guides sur les nomenclatures de quartier ?</p>
					<button class="text-[#00bc7d] text-sm font-black hover:text-[#1B5E20] transition-colors flex items-center gap-1 relative z-10">
						Consulter la Documentation <ChevronRight class="w-4 h-4" />
					</button>
				</div>
			</div>
		</div>

		<!-- COLONNE DROITE (Détails) -->
		<div class="w-full xl:w-[320px] shrink-0 flex flex-col gap-4">
			<div v-if="selectedAddress" class="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-full">
				<div class="p-4 border-b border-gray-100 flex items-center justify-between">
					<h3 class="font-black text-gray-800">Détails de l'Adresse</h3>
					<button class="p-1 text-gray-400 hover:text-gray-800 transition-colors">
						<X class="w-5 h-5" />
					</button>
				</div>

				<div class="overflow-y-auto flex-1 p-5 space-y-6" style="scrollbar-width: none;">
					
					<!-- Image Batiment -->
					<div class="w-full h-40 bg-gray-100 rounded-2xl overflow-hidden relative shadow-inner">
						<img v-if="selectedAddress.buildingImg" :src="selectedAddress.buildingImg" class="w-full h-full object-cover" />
						<div v-else class="w-full h-full flex items-center justify-center text-gray-400"><MapPin class="w-8 h-8" /></div>
					</div>

					<!-- Infos de Base -->
					<div>
						<div class="flex items-start justify-between mb-1">
							<h2 class="text-2xl font-black text-[#155dfc]">{{ selectedAddress.code }}</h2>
							<span class="px-2 py-1 rounded-md text-[10px] font-black tracking-wide" :class="getStatusStyles(selectedAddress.status)">
								{{ selectedAddress.status || 'En attente' }}
							</span>
						</div>
						<p class="text-sm text-gray-600 font-medium">{{ selectedAddress.quarter }}, {{ selectedAddress.city }}</p>
					</div>

					<!-- Map Placeholder -->
					<div class="w-full h-32 bg-gray-200 rounded-2xl overflow-hidden relative">
						<div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/grid-me.png')] opacity-20"></div>
						<div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-[#00bc7d] rounded-full shadow-lg border-2 border-white z-10"></div>
						<button class="absolute bottom-2 right-2 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-[10px] font-bold text-gray-700 shadow-sm flex items-center gap-1 hover:bg-white transition-colors">
							<MapPin class="w-3 h-3" /> Google Maps
						</button>
					</div>

					<!-- Résident -->
					<div class="p-4 border border-gray-100 rounded-2xl flex items-center gap-3 bg-[#F8F9FB]">
						<div class="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-black text-xs shrink-0">
							JN
						</div>
						<div>
							<p class="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Propriétaire / Résident</p>
							<p class="text-sm font-bold text-gray-900">{{ selectedAddress.resident || 'N/A' }}</p>
							<p class="text-[11px] text-gray-500">{{ selectedAddress.phone || '+237 --- --- ---' }}</p>
						</div>
					</div>

					<!-- QR & Actions -->
					<div class="p-4 border border-gray-100 rounded-2xl flex gap-4">
						<!-- QR Placeholder -->
						<div class="w-20 h-20 bg-gray-100 rounded-xl flex items-center justify-center p-2 shrink-0 border border-gray-200">
							<img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=example" class="w-full h-full opacity-50 grayscale" />
						</div>
						<div class="flex-1 flex flex-col justify-center gap-2">
							<button class="w-full py-2 bg-black text-white rounded-lg text-xs font-bold shadow-sm hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
								<FileText class="w-3.5 h-3.5" /> Certificat PDF
							</button>
							<button class="w-full py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-xs font-bold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
								<Share2 class="w-3.5 h-3.5" /> Partager
							</button>
						</div>
					</div>

					<!-- Historique -->
					<div>
						<p class="text-xs font-black text-gray-800 mb-4">Historique des actions</p>
						<div class="space-y-4 relative before:absolute before:inset-y-0 before:left-[5px] before:w-px before:bg-gray-200">
							<div class="relative pl-6">
								<div class="absolute left-0 top-1.5 w-3 h-3 bg-[#81C784] rounded-full ring-4 ring-white"></div>
								<p class="text-xs font-bold text-gray-800">Validé par Admin 02</p>
								<p class="text-[10px] text-gray-500 mt-0.5">14 Mars 2024 Ã  10:30</p>
							</div>
							<div class="relative pl-6">
								<div class="absolute left-0 top-1.5 w-3 h-3 bg-gray-300 rounded-full ring-4 ring-white"></div>
								<p class="text-xs font-bold text-gray-500">Enregistrement initial</p>
								<p class="text-[10px] text-gray-400 mt-0.5">12 Mars 2024 Ã  09:15</p>
							</div>
						</div>
					</div>

				</div>
			</div>
			
			<div v-else class="bg-white rounded-3xl border border-gray-100 shadow-sm flex items-center justify-center h-full p-8 text-center text-gray-400">
				Sélectionnez une adresse pour voir les détails.
			</div>
		</div>

	</div>
</template>
