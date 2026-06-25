<!--
  @file app/layouts/dashboard_admin.vue
  @description Layout de l'espace administrateur findMe — sidebar avec logo, profil admin,
  navigation principale et déconnexion. Design responsive : Drawer sur mobile, barre latérale sur PC.
-->

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute, navigateTo } from "#app";
import {
	LayoutDashboard,
	Users,
	Map,
	HelpCircle,
	LogOut,
	Menu,
	X,
	Search,
	Bell
} from "lucide-vue-next";
import ButtonUI from "~/components/ui/ButtonUI.vue";
import FindMeLogo from "~/components/ui/FindMeLogo.vue";
import ToastNotifications from "~/components/ui/ToastNotifications.vue";
import PageLoader from "~/components/modals/PageLoader.vue";
import { useAuth } from "~/composables/useAuth";
import { useToasts } from "~/composables/useToasts";

const { addToast } = useToasts();
const { currentUser, handleLogout } = useAuth();

// État du menu mobile
const isMobileMenuOpen = ref(false);
const searchQuery = ref("");

/** Initiales utilisateur pour l'avatar par défaut */
const userInitials = computed(() => {
	if (!currentUser.value) return "AD";
	const name = currentUser.value.username || currentUser.value.email;
	return name.substring(0, 2).toUpperCase();
});

/** Nom court affiché dans la sidebar */
const userName = computed(() => {
	if (!currentUser.value) return "Admin";
	return currentUser.value.username || currentUser.value.email.split("@")[0];
});

/** Déconnecte l'utilisateur et redirige vers la page d'accueil */
const onLogout = () => {
	const prevName = currentUser.value?.username || "Admin";
	handleLogout();
	if (typeof window !== "undefined") window.scrollTo({ top: 0 });
	addToast(`Déconnexion réussie. À bientôt, ${prevName} !`, "info");
	navigateTo("/", { external: true });
};

// On dérive la section active directement du chemin d'accès (URL réelle)
const route = useRoute();
const activeSection = computed(() => {
	const path = route.path.replace(/\/$/, '');
	if (path.endsWith('/admin/users')) return 'users';
	if (path.endsWith('/admin/adresses')) return 'adresses';
	if (path.endsWith('/admin/support')) return 'support';
	return 'dashboard';
});

/** Navigue vers une vraie page de section du dashboard admin */
const goToPage = (section: string) => {
	if (section === 'dashboard') navigateTo('/admin');
	else if (section === 'users') navigateTo(`/admin/users`);
	else if (section === 'adresses') navigateTo(`/admin/adresses`);
	else if (section === 'support') navigateTo(`/admin/support`);
	
	isMobileMenuOpen.value = false;
};

// Menu de navigation
const navItems = [
	{ id: 'dashboard', label: 'Vue d\'ensemble', icon: LayoutDashboard },
	{ id: 'users', label: 'Utilisateurs', icon: Users },
	{ id: 'adresses', label: 'Répertoire Adresses', icon: Map },
	{ id: 'support', label: 'Support Client', icon: HelpCircle },
];

</script>

<template>
	<div
		class="min-h-[100dvh] bg-[#F4F6F9] dark:bg-[#0E111F] flex flex-col font-sans"
		id="dashboard-admin-layout"
	>
		<!-- ===== MOBILE TOP BAR ===== -->
		<header class="md:hidden sticky top-0 z-40 bg-white dark:bg-[#141627] border-b border-gray-100 dark:border-slate-800 px-4 py-3 flex items-center justify-between shadow-sm">
			<div class="flex items-center gap-3">
				<button @click="isMobileMenuOpen = true" class="p-1.5 -ml-1.5 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/50">
					<Menu class="w-6 h-6" />
				</button>
				<FindMeLogo size="90" class="cursor-pointer" @click="navigateTo('/admin')" />
			</div>
			<button class="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-[#2E7D32] to-[#1B5E20] flex items-center justify-center text-white text-xs font-black shadow-sm ring-2 ring-transparent transition-all">
				<ClientOnly>
					<img v-if="currentUser?.photo" :src="currentUser.photo" class="w-full h-full object-cover" alt="Profile" />
					<span v-else>{{ userInitials }}</span>
					<template #fallback>
						<span></span>
					</template>
				</ClientOnly>
			</button>
		</header>

		<!-- ===== BODY (Sidebar + Main) ===== -->
		<div class="flex flex-1 relative overflow-hidden">
			
			<!-- Mobile Overlay -->
			<div 
				v-if="isMobileMenuOpen" 
				class="fixed inset-0 bg-black/50 backdrop-blur-[2px] z-[60] md:hidden transition-opacity duration-300" 
				@click="isMobileMenuOpen = false"
				aria-hidden="true"
			></div>

			<!-- ===== SIDEBAR ===== -->
			<aside
				class="fixed md:sticky top-0 left-0 h-[100dvh] z-[70] md:z-10 w-[280px] md:w-[260px] flex-shrink-0 bg-white dark:bg-[#141627] flex flex-col border-r border-gray-100 dark:border-slate-800 shadow-2xl md:shadow-none transform transition-transform duration-300 ease-in-out md:translate-x-0"
				:class="isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'"
			>
				<!-- ── Logo FindMe Admin ── -->
				<div class="px-6 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between py-5">
					<div>
						<div class="flex items-center gap-2">
							<div class="w-8 h-8 bg-[#2E7D32] rounded-lg flex items-center justify-center shrink-0">
								<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 text-white">
									<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
									<polyline points="9 22 9 12 15 12 15 22" />
								</svg>
							</div>
							<div>
								<h1 class="text-lg font-black text-gray-800 dark:text-white leading-none tracking-tight">FindMe Admin</h1>
								<p class="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-0.5">Institutional</p>
							</div>
						</div>
					</div>
					<button class="md:hidden p-2 -mr-2 text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-slate-800" @click="isMobileMenuOpen = false">
						<X class="w-5 h-5" />
					</button>
				</div>

				<!-- ── Navigation principale ── -->
				<nav class="flex-1 px-5 py-4 space-y-2 overflow-y-auto" style="scrollbar-width: none;">
					<button
						v-for="item in navItems"
						:key="item.id"
						@click="goToPage(item.id)"
						class="w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-[14.5px] font-bold transition-all duration-200 text-left"
						:class="activeSection === item.id
							? 'bg-[#2E7D32] text-white shadow-md shadow-[#2E7D32]/25'
							: 'text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white'"
					>
						<component :is="item.icon" class="w-[22px] h-[22px] shrink-0" :class="activeSection === item.id ? 'text-white' : ''" />
						<span>{{ item.label }}</span>
					</button>
				</nav>

				<!-- ── Actions du bas de sidebar ── -->
				<div class="px-5 pb-8 pt-4 border-t border-gray-100 dark:border-slate-800 space-y-3">
					<ButtonUI
						@click="onLogout"
						variant="danger"
						:icon="LogOut"
						class="w-full py-3 text-[14.5px] font-bold rounded-xl"
					>
						Déconnexion
					</ButtonUI>
				</div>
			</aside>

			<!-- ===== MAIN CONTENT AREA ===== -->
			<main class="flex-1 min-w-0 flex flex-col h-[calc(100dvh-3.5rem)] md:h-[100dvh] overflow-y-auto scroll-smooth">
				
				<!-- ===== TOP BAR DESKTOP ===== -->
				<header class="hidden md:flex sticky top-0 z-30 bg-white dark:bg-[#141627] border-b border-gray-100 dark:border-slate-800 px-8 py-4 items-center justify-between">
					
					<!-- Barre de recherche -->
					<div class="relative w-full max-w-lg">
						<div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
							<Search class="h-4 w-4 text-gray-400" />
						</div>
						<input
							v-model="searchQuery"
							type="text"
							class="block w-full pl-10 pr-4 py-2.5 bg-[#F4F6F9] dark:bg-slate-800 border-none rounded-xl text-sm placeholder-gray-500 focus:ring-2 focus:ring-[#2E7D32]/50 transition-all outline-none"
							placeholder="Rechercher un utilisateur, un matricule ou une adresse..."
						/>
					</div>

					<!-- Profil et Actions -->
					<div class="flex items-center gap-6">
						<div class="flex items-center gap-4 text-gray-500 dark:text-slate-400">
							<button class="hover:text-gray-800 dark:hover:text-white transition-colors relative">
								<Bell class="w-5 h-5" />
								<span class="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 rounded-full border-2 border-white dark:border-[#141627]"></span>
							</button>
							<button class="hover:text-gray-800 dark:hover:text-white transition-colors">
								<HelpCircle class="w-5 h-5" />
							</button>
						</div>

						<div class="h-8 w-px bg-gray-200 dark:bg-slate-700"></div>

						<div class="flex items-center gap-3">
							<div class="text-right hidden lg:block">
								<p class="text-sm font-bold text-gray-800 dark:text-white leading-none mb-1">{{ userName }}</p>
								<p class="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Super Administrateur</p>
							</div>
							<div class="relative">
								<div class="w-10 h-10 rounded-full overflow-hidden shrink-0 shadow-sm ring-[3px] ring-white dark:ring-[#141627] bg-gradient-to-br from-[#2E7D32] to-[#1B5E20] flex items-center justify-center text-white text-[13px] font-black">
									<ClientOnly>
										<img v-if="currentUser?.photo" :src="currentUser.photo" class="w-full h-full object-cover" alt="Photo de profil" />
										<span v-else>{{ userInitials }}</span>
										<template #fallback>
											<div class="w-full h-full bg-gradient-to-br from-[#2E7D32] to-[#1B5E20]"></div>
										</template>
									</ClientOnly>
								</div>
								<div class="absolute bottom-0 right-0 w-3 h-3 bg-[#2E7D32] border-2 border-white dark:border-[#141627] rounded-full"></div>
							</div>
						</div>
					</div>
				</header>

				<!-- Contenu dynamique de la page -->
				<div class="flex-1 w-full max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 xl:p-10 flex flex-col transition-all duration-300">
					<slot />
				</div>
			</main>
		</div>

		<PageLoader />
		<ToastNotifications />
	</div>
</template>

<style>
/* Motif de fond en pointillés subtil pour imiter la maquette (optionnel) */
#dashboard-admin-layout main {
	background-image: radial-gradient(#E5E7EB 1px, transparent 0);
	background-size: 20px 20px;
}
</style>
