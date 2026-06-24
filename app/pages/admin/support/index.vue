<script setup lang="ts">
import { ref, computed } from "vue";
import { Filter, Send, CheckCircle, RefreshCcw, MoreVertical, MapPin, User as UserIcon } from "lucide-vue-next";
import { useMemory } from "~/composables/useMemory";

definePageMeta({
	layout: "dashboard-admin",
	middleware: ["admin"],
});

const { data: supportData } = useMemory<any[]>("support", []);

// Mocks complets pour enrichir le localStorage si vide
const mockTickets = [
	{ id: 'msg_8281', name: 'Jean Dupont', email: 'jean@example.com', subject: 'Problème de géolocalisation', message: 'YAO-B123 ne s\'affiche pas correctement sur la carte.', status: 'non_traite', createdAt: '2026-10-12T14:30:00Z', location: 'YAO-B123' },
	{ id: 'msg_7721', name: 'Amadou Ndoye', email: 'a.ndoye@example.com', subject: 'Compte bloqué après mise à jour', message: 'Bonjour l\'équipe FindMe, depuis la dernière mise à jour de l\'application hier soir, je ne parviens plus à me connecter à mon compte professionnel.\n\nMon code d\'adresse est YAO-B123. Pouvez-vous vérifier si mon profil a été désactivé par erreur ? Merci.', status: 'non_traite', createdAt: '2026-10-12T10:15:00Z', location: 'DOU-C119', replies: [{ text: 'Bonjour Amadou, nous avons bien reçu votre demande. Je suis en train de vérifier le statut de votre identifiant dans notre base de données Registry.', sender: 'admin', time: '10:45 AM', author: 'Moussa B.' }, { text: 'Merci Moussa. J\'ai aussi remarqué que ma localisation favorite (DOU-C119) ne semble plus être enregistrée.', sender: 'user', time: '11:02 AM' }] },
	{ id: 'msg_9012', name: 'Marie Koulibaly', email: 'mk@example.com', subject: 'Demande de modification d\'adresse', message: 'DOU-L440 est incorrect, la rue a changé de nom.', status: 'traite', createdAt: '2026-10-11T18:22:00Z', location: 'DOU-L440' },
];

const allTickets = computed(() => {
	const localTickets = supportData.value || [];
	if (localTickets.length > 0) return localTickets.reverse(); // Les plus récents en premier
	return mockTickets;
});

const filterType = ref("Recent"); // Recent, Urgent
const selectedTicket = ref<any | null>(null);
const replyText = ref("");

const filteredTickets = computed(() => {
	let list = allTickets.value;
	if (filterType.value === 'Urgent') {
		list = list.filter((t: any) => t.status === 'non_traite');
	}
	return list;
});

if (filteredTickets.value.length > 0 && !selectedTicket.value) {
	// On sélectionne le 2eme ticket s'il s'agit du mock (qui a des réponses pré-remplies), ou le 1er sinon
	selectedTicket.value = allTickets.value.length === mockTickets.length ? mockTickets[1] : filteredTickets.value[0];
}

const getInitials = (name: string) => {
	if (!name) return '??';
	const parts = name.split(' ');
	return parts.length > 1 ? (parts[0][0] + parts[1][0]).toUpperCase() : name.substring(0, 2).toUpperCase();
};

const formatDate = (isoString: string) => {
	const d = new Date(isoString);
	if (isNaN(d.getTime())) return isoString;
	return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }).replace(',', '');
};

const formatJustDate = (isoString: string) => {
	const d = new Date(isoString);
	if (isNaN(d.getTime())) return "12 OCTOBER, 2026";
	return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }).toUpperCase();
};

const formatTime = (isoString: string) => {
	const d = new Date(isoString);
	if (isNaN(d.getTime())) return "10:15 AM";
	return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
};

</script>

<template>
	<div class="h-full flex flex-col gap-6 max-w-7xl mx-auto w-full">
		
		<!-- HEADER & STATS -->
		<div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
			<div>
				<p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Admin / Support Client</p>
				<h1 class="text-3xl font-black text-gray-900">Support Management</h1>
			</div>
			
			<div class="flex items-center gap-4">
				<div class="bg-white border border-gray-200 rounded-2xl p-4 min-w-[120px] shadow-sm">
					<p class="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Total</p>
					<p class="text-2xl font-black text-gray-800">1,284</p>
				</div>
				<div class="bg-white border border-rose-200 rounded-2xl p-4 min-w-[120px] shadow-sm">
					<p class="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-1">Pending</p>
					<p class="text-2xl font-black text-rose-600">12</p>
				</div>
				<div class="bg-[#81C784] rounded-2xl p-4 min-w-[120px] shadow-sm shadow-[#81C784]/30">
					<p class="text-[10px] font-black text-white/80 uppercase tracking-widest mb-1">Solved</p>
					<p class="text-2xl font-black text-white">94%</p>
				</div>
			</div>
		</div>

		<!-- MAIN CONTENT (2 COLUMNS) -->
		<div class="flex-1 flex flex-col lg:flex-row gap-6 min-h-[600px] h-[calc(100vh-250px)]">
			
			<!-- Liste des Tickets -->
			<div class="w-full lg:w-[400px] shrink-0 bg-white rounded-3xl border border-gray-200 shadow-sm flex flex-col overflow-hidden">
				
				<!-- Filtres de liste -->
				<div class="p-4 border-b border-gray-100 flex items-center justify-between">
					<div class="flex items-center gap-3">
						<span class="text-sm font-black text-gray-800">All Tickets</span>
						<div class="flex bg-gray-100 rounded-full p-1">
							<button 
								class="px-3 py-1 text-[10px] font-bold rounded-full transition-colors"
								:class="filterType === 'Recent' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'"
								@click="filterType = 'Recent'"
							>
								Recent
							</button>
							<button 
								class="px-3 py-1 text-[10px] font-bold rounded-full transition-colors"
								:class="filterType === 'Urgent' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'"
								@click="filterType = 'Urgent'"
							>
								Urgent
							</button>
						</div>
					</div>
					<button class="text-gray-400 hover:text-gray-800 flex items-center gap-1 text-[11px] font-bold">
						<Filter class="w-3.5 h-3.5" /> Filter
					</button>
				</div>

				<div class="flex text-[10px] font-black text-gray-400 uppercase tracking-wider px-6 py-3 border-b border-gray-50 bg-gray-50/50">
					<div class="w-[140px]">User</div>
					<div class="flex-1">Issue</div>
					<div class="w-[60px] text-right">Date</div>
				</div>

				<div class="flex-1 overflow-y-auto" style="scrollbar-width: thin;">
					<div 
						v-for="ticket in filteredTickets" 
						:key="ticket.id"
						@click="selectedTicket = ticket"
						class="flex items-start px-6 py-4 border-b border-gray-50 cursor-pointer transition-colors"
						:class="selectedTicket?.id === ticket.id ? 'bg-indigo-50/50 border-l-4 border-l-[#1A237E]' : 'hover:bg-gray-50 border-l-4 border-l-transparent'"
					>
						<!-- User Info -->
						<div class="w-[140px] flex gap-3 shrink-0">
							<div 
								class="w-10 h-10 rounded-full text-white flex items-center justify-center font-bold text-sm shrink-0"
								:class="ticket.status === 'non_traite' ? 'bg-[#1A237E]' : 'bg-[#81C784]'"
							>
								{{ getInitials(ticket.name) }}
							</div>
							<div class="overflow-hidden">
								<p class="text-sm font-bold text-gray-800 truncate">{{ ticket.name }}</p>
								<p class="text-[10px] text-gray-500 truncate">#ID-{{ ticket.id.replace('msg_', '') }}</p>
							</div>
						</div>
						
						<!-- Issue Snippet -->
						<div class="flex-1 min-w-0 pr-4">
							<p class="text-sm font-bold text-gray-800 truncate mb-0.5">{{ ticket.subject || 'Sujet non défini' }}</p>
							<p class="text-[11px] text-gray-500 truncate">{{ ticket.message }}</p>
						</div>

						<!-- Date -->
						<div class="w-[60px] shrink-0 text-right">
							<p class="text-[10px] text-gray-400 font-medium whitespace-pre-line leading-tight">{{ formatDate(ticket.createdAt).replace(' à ', '\n') }}</p>
						</div>
					</div>
					
					<!-- Skeleton placeholders pour faire style -->
					<div class="flex items-start px-6 py-4 opacity-50 pointer-events-none" v-if="filteredTickets.length < 5">
						<div class="w-[140px] flex gap-3"><div class="w-10 h-10 rounded-full bg-gray-200"></div><div class="flex-1 py-1"><div class="h-3 bg-gray-200 rounded mb-2"></div><div class="h-2 bg-gray-200 rounded w-1/2"></div></div></div>
						<div class="flex-1 py-1"><div class="h-3 bg-gray-200 rounded mb-2"></div><div class="h-2 bg-gray-200 rounded w-3/4"></div></div>
						<div class="w-[60px] py-1"><div class="h-2 bg-gray-200 rounded w-full"></div></div>
					</div>
					<div class="flex items-start px-6 py-4 opacity-30 pointer-events-none" v-if="filteredTickets.length < 5">
						<div class="w-[140px] flex gap-3"><div class="w-10 h-10 rounded-full bg-gray-200"></div><div class="flex-1 py-1"><div class="h-3 bg-gray-200 rounded mb-2"></div><div class="h-2 bg-gray-200 rounded w-1/2"></div></div></div>
						<div class="flex-1 py-1"><div class="h-3 bg-gray-200 rounded mb-2"></div><div class="h-2 bg-gray-200 rounded w-3/4"></div></div>
						<div class="w-[60px] py-1"><div class="h-2 bg-gray-200 rounded w-full"></div></div>
					</div>
				</div>

				<div class="p-3 border-t border-gray-100 flex items-center justify-between text-gray-500 bg-gray-50/50">
					<span class="text-[10px] font-bold">Showing 1-10 of 284 results</span>
					<div class="flex items-center gap-1">
						<button class="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-200 text-xs">‹</button>
						<button class="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center font-bold text-xs">1</button>
						<button class="w-6 h-6 rounded-full border border-transparent flex items-center justify-center hover:bg-gray-200 text-xs">2</button>
						<button class="w-6 h-6 rounded-full border border-transparent flex items-center justify-center hover:bg-gray-200 text-xs">3</button>
						<button class="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-200 text-xs">›</button>
					</div>
				</div>
			</div>

			<!-- Conversation View -->
			<div class="flex-1 bg-white rounded-3xl border border-gray-200 shadow-sm flex flex-col overflow-hidden relative">
				<template v-if="selectedTicket">
					<!-- Header Conv -->
					<div class="bg-[#1A237E] text-white p-6 pb-8 relative shrink-0">
						<div class="flex justify-between items-start mb-3">
							<span class="px-2 py-0.5 bg-white/20 rounded-md text-[10px] font-black tracking-widest uppercase">
								TICKET #ID-{{ selectedTicket.id.replace('msg_', '') }}
							</span>
							<button class="text-white/60 hover:text-white"><MoreVertical class="w-5 h-5" /></button>
						</div>
						<h2 class="text-2xl font-black mb-3">{{ selectedTicket.subject || 'Sujet non défini' }}</h2>
						<div class="flex items-center gap-6 text-xs text-white/80 font-medium">
							<div class="flex items-center gap-1.5"><UserIcon class="w-3.5 h-3.5" /> {{ selectedTicket.name }}</div>
							<div class="flex items-center gap-1.5" v-if="selectedTicket.location"><MapPin class="w-3.5 h-3.5" /> {{ selectedTicket.location }}</div>
						</div>
					</div>

					<!-- Chat Area -->
					<div class="flex-1 overflow-y-auto p-6 bg-gray-50 flex flex-col gap-6" style="scrollbar-width: thin;">
						
						<!-- Date Pill -->
						<div class="flex justify-center">
							<span class="px-3 py-1 bg-white border border-gray-200 rounded-full text-[10px] font-black text-gray-400 uppercase tracking-wider">
								{{ formatJustDate(selectedTicket.createdAt) }}
							</span>
						</div>

						<!-- Message de l'utilisateur (Initial) -->
						<div class="flex flex-col gap-1 max-w-[80%] self-start">
							<div class="bg-white border border-gray-200 p-4 rounded-2xl rounded-tl-sm shadow-sm text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
								{{ selectedTicket.message }}
							</div>
							<span class="text-[9px] font-medium text-gray-400 ml-1">{{ formatTime(selectedTicket.createdAt) }} · Sent by User</span>
						</div>

						<!-- Réponses simulées si dispo -->
						<template v-if="selectedTicket.replies">
							<div v-for="(reply, index) in selectedTicket.replies" :key="index" class="flex flex-col gap-1 max-w-[80%]" :class="reply.sender === 'admin' ? 'self-end' : 'self-start'">
								<div 
									class="p-4 shadow-sm text-sm whitespace-pre-wrap leading-relaxed"
									:class="reply.sender === 'admin' ? 'bg-[#0A0F2C] text-white rounded-2xl rounded-tr-sm' : 'bg-white border border-gray-200 text-gray-700 rounded-2xl rounded-tl-sm'"
								>
									{{ reply.text }}
								</div>
								<span class="text-[9px] font-medium text-gray-400 mx-1" :class="reply.sender === 'admin' ? 'text-right' : ''">
									{{ reply.time }} · {{ reply.sender === 'admin' ? `Replied by ${reply.author}` : 'Sent by User' }}
								</span>
							</div>
						</template>

					</div>

					<!-- Bottom Actions & Input -->
					<div class="bg-white border-t border-gray-100 p-5 shrink-0">
						<div class="relative mb-4">
							<textarea 
								v-model="replyText"
								rows="3" 
								placeholder="Write a reply..." 
								class="w-full bg-[#F4F6F9] border-none rounded-2xl p-4 pr-14 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-[#1A237E]/20 resize-none"
							></textarea>
							<button class="absolute bottom-4 right-4 w-10 h-10 bg-[#0A0F2C] rounded-full flex items-center justify-center text-white hover:bg-[#1A237E] transition-colors shadow-md">
								<Send class="w-4 h-4 ml-1" />
							</button>
						</div>
						<div class="flex gap-3">
							<button class="flex-1 py-3 bg-[#0A7A38] text-white font-bold text-sm rounded-full flex items-center justify-center gap-2 hover:bg-[#08632d] shadow-md shadow-[#0A7A38]/20 transition-all">
								<CheckCircle class="w-4 h-4" /> Marquer comme traité
							</button>
							<button class="flex-1 py-3 bg-white border border-gray-200 text-gray-700 font-bold text-sm rounded-full flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors">
								<RefreshCcw class="w-4 h-4" /> Réassigner
							</button>
						</div>
					</div>
				</template>

				<div v-else class="flex-1 flex items-center justify-center text-gray-400">
					Select a ticket to view the conversation.
				</div>
			</div>

		</div>
	</div>
</template>
