<!--
  @file app/layouts/dashboard_support.vue
  @description Layout de l'espace Support Agent findMe — design glassmorphism premium à ton uni émeraude (#00bc7d) et bleu nuit (#0A0D1A).
-->

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute, navigateTo } from "#app";
import {
	LayoutDashboard,
	HelpCircle,
	LogOut,
	Menu,
	X,
	Search,
	Bell,
	UserCircle
} from "lucide-vue-next";
import ButtonUI from "~/components/ui/ButtonUI.vue";
import FindMeLogo from "~/components/ui/FindMeLogo.vue";
import ThemeToggle from "~/components/ui/ThemeToggle.vue";
import ToastNotifications from "~/components/ui/ToastNotifications.vue";
import { useAuth } from "~/composables/useAuth";
import { useToasts } from "~/composables/useToasts";
import { useAdminData } from "~/composables/useAdminData";

const { addToast } = useToasts();
const { currentUser, handleLogout } = useAuth();
const { adminSupport, fetchAdminSupport } = useAdminData();

// État du menu mobile
const isMobileMenuOpen = ref(false);
const searchQuery = ref("");
const isSearchFocused = ref(false);
const isNotificationsOpen = ref(false);

// Nombre de tickets de support client non lus/en attente (PENDING) pour la cloche
const pendingSupportCount = computed(() => {
	return adminSupport.value.filter((t) => t.status === "PENDING").length;
});

onMounted(() => {
	if (adminSupport.value.length === 0) fetchAdminSupport(undefined, 0, 100);
});

// Recherche globale (Support Client)
const globalSearchResults = computed(() => {
	const q = searchQuery.value.trim().toLowerCase();
	if (!q) return { support: [], hasResults: false };

	const support = adminSupport.value.filter((s) =>
		(s.name && s.name.toLowerCase().includes(q)) ||
		(s.userFullName && s.userFullName.toLowerCase().includes(q)) ||
		(s.email && s.email.toLowerCase().includes(q)) ||
		(s.message && s.message.toLowerCase().includes(q))
	).slice(0, 5);

	return { support, hasResults: support.length > 0 };
});

const selectSearchResult = (path: string) => {
	searchQuery.value = "";
	isSearchFocused.value = false;
	navigateTo(path);
};

/** Initiales utilisateur pour l'avatar */
const userInitials = computed(() => {
	if (!currentUser.value) return "SA";
	const name = currentUser.value.fullName || currentUser.value.email;
	return name.substring(0, 2).toUpperCase();
});

/** Nom court affiché */
const userName = computed(() => {
	if (!currentUser.value) return "Agent Support";
	return currentUser.value.fullName || currentUser.value.email.split("@")[0];
});

/** Déconnexion */
const onLogout = () => {
	const prevName = currentUser.value?.fullName || "Agent Support";
	handleLogout();
	if (typeof window !== "undefined") window.scrollTo({ top: 0 });
	addToast(`Déconnexion réussie. À bientôt, ${prevName} !`, "info");
	navigateTo("/", { external: true });
};

// Section active selon la route
const route = useRoute();
const activeSection = computed(() => {
	const path = route.path.replace(/\/$/, '');
	if (path.endsWith('/support-agent/support')) return 'support';
	if (path.endsWith('/support-agent/profile')) return 'profile';
	return 'dashboard';
});

const goToPage = (section: string) => {
	if (section === 'dashboard') navigateTo('/support-agent');
	else if (section === 'support') navigateTo(`/support-agent/support`);
	else if (section === 'profile') navigateTo(`/support-agent/profile`);
	
	isMobileMenuOpen.value = false;
};

// Menu de navigation Support Agent (sans Utilisateurs et sans Adresses)
const navItems = [
	{ id: 'dashboard', label: 'Vue d\'ensemble', icon: LayoutDashboard },
	{ id: 'support', label: 'Support Client', icon: HelpCircle },
	{ id: 'profile', label: 'Mon Profil', icon: UserCircle },
];
</script>

<template>
	<div
		class="relative min-h-[100dvh] bg-[#FAF8F5] dark:bg-[#0A0D1A] flex flex-col overflow-hidden font-sans text-slate-900 dark:text-white"
		id="dashboard-support-layout"
	>
		<!-- MOBILE TOP BAR -->
		<header class="md:hidden sticky top-0 z-40 bg-white/80 dark:bg-[#0A0D1A]/80 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800 px-4 py-3 flex items-center justify-between shadow-sm">
			<div class="flex items-center gap-3">
				<button @click="isMobileMenuOpen = true" class="p-1.5 -ml-1.5 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer">
					<Menu class="w-6 h-6" />
				</button>
				<FindMeLogo size="100" class="cursor-pointer" @click="navigateTo('/')" />
			</div>
			<button class="w-9 h-9 rounded-full overflow-hidden bg-emerald-600 flex items-center justify-center text-white text-xs font-black shadow-md">
				<ClientOnly>
					<img v-if="currentUser?.profileImage" :src="currentUser.profileImage" class="w-full h-full object-cover" alt="Profile" />
					<span v-else>{{ userInitials }}</span>
					<template #fallback><span></span></template>
				</ClientOnly>
			</button>
		</header>

		<!-- BODY (Sidebar + Main) -->
		<div class="flex flex-1 relative z-10">
			
			<Transition name="fade">
				<div 
					v-if="isMobileMenuOpen" 
					class="fixed inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm z-[60] md:hidden" 
					@click="isMobileMenuOpen = false"
					aria-hidden="true"
				></div>
			</Transition>

			<!-- SIDEBAR -->
			<aside
				class="fixed md:sticky top-0 left-0 h-[100dvh] z-[70] md:z-10 w-[280px] md:w-[260px] flex-shrink-0 bg-white/80 dark:bg-[#0A0D1A]/80 backdrop-blur-2xl flex flex-col border-r border-slate-200/80 dark:border-slate-800 shadow-xl transform transition-transform duration-300 ease-out md:translate-x-0"
				:class="isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'"
			>
				<!-- Logo FindMe -->
				<div class="px-6 border-b border-slate-200/60 dark:border-slate-800 flex items-center justify-between py-5">
					<NuxtLink to="/" class="flex items-center gap-2 cursor-pointer transition-opacity hover:opacity-90" title="Retour à l'accueil du site">
						<FindMeLogo size="130" />
					</NuxtLink>
					<button class="md:hidden p-2 -mr-2 text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer" @click="isMobileMenuOpen = false">
						<X class="w-5 h-5" />
					</button>
				</div>

				<!-- Navigation principale (Support Agent) -->
				<nav class="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto" style="scrollbar-width: none;">
					<button
						v-for="item in navItems"
						:key="item.id"
						@click="goToPage(item.id)"
						class="group relative w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-[13px] font-bold transition-all duration-300 text-left overflow-hidden cursor-pointer"
						:class="activeSection === item.id 
							? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20' 
							: 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'"
					>
						<component :is="item.icon" class="w-5 h-5 shrink-0 transition-transform" :class="activeSection === item.id ? 'text-white' : 'text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400'" />
						<span class="tracking-wide uppercase">{{ item.label }}</span>
					</button>
				</nav>

				<div class="px-5 pb-6 pt-4 space-y-3">
					<button
						@click="onLogout"
						class="group flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl text-[13px] font-black uppercase tracking-wider text-rose-600 bg-rose-50 dark:bg-rose-950/30 hover:bg-rose-100 dark:hover:bg-rose-900/40 border border-rose-200 dark:border-rose-800 transition-all duration-300 shadow-xs cursor-pointer"
					>
						<LogOut class="w-4 h-4 transition-transform group-hover:-translate-x-1" />
						Déconnexion
					</button>
				</div>
			</aside>

			<!-- MAIN CONTENT AREA -->
			<main class="flex-1 min-w-0 flex flex-col h-[calc(100dvh-3.5rem)] md:h-[100dvh] overflow-y-auto scroll-smooth relative">
				
				<!-- TOP BAR DESKTOP -->
				<header class="hidden md:flex sticky top-0 z-30 bg-white/80 dark:bg-[#0A0D1A]/80 backdrop-blur-2xl border-b border-slate-200/80 dark:border-slate-800 px-8 py-4 items-center justify-between">
					
					<!-- Recherche -->
					<div class="relative w-full max-w-lg group">
						<div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
							<Search class="h-4 w-4 text-slate-400 group-focus-within:text-emerald-600 dark:group-focus-within:text-emerald-400 transition-colors" />
						</div>
						<input
							v-model="searchQuery"
							@focus="isSearchFocused = true"
							@blur="setTimeout(() => isSearchFocused = false, 200)"
							type="text"
							class="block w-full pl-11 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl text-sm font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none"
							placeholder="Rechercher un ticket de support..."
						/>

						<div
							v-if="isSearchFocused && searchQuery.trim()"
							class="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#0A0D1A] rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150 max-h-96 overflow-y-auto"
						>
							<div v-if="globalSearchResults.hasResults" class="p-2 space-y-2">
								<div v-if="globalSearchResults.support.length > 0">
									<p class="px-3 py-1 text-[10px] font-black text-slate-400 uppercase tracking-widest">Support Client</p>
									<div
										v-for="s in globalSearchResults.support"
										:key="s.id"
										@mousedown="selectSearchResult('/support-agent/support')"
										class="flex items-center justify-between p-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl cursor-pointer transition-colors"
									>
										<div class="flex items-center gap-2.5">
											<div class="w-7 h-7 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs flex items-center justify-center border border-emerald-500/20">
												💬
											</div>
											<div class="max-w-[280px]">
												<p class="text-xs font-bold text-slate-900 dark:text-white truncate">{{ s.userFullName || s.name }} (Ticket #{{ s.id }})</p>
												<p class="text-[10px] text-slate-500 dark:text-slate-400 truncate">{{ s.message }}</p>
											</div>
										</div>
										<span class="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">Support</span>
									</div>
								</div>
							</div>
							<div v-else class="p-6 text-center text-xs text-slate-400 font-medium">
								Aucun ticket trouvé pour "{{ searchQuery }}"
							</div>
						</div>
					</div>

					<!-- Profil et Notifications -->
					<div class="flex items-center gap-6">
						<div class="flex items-center gap-3 text-slate-500">
							<ThemeToggle />
							<!-- Cloche de notifications Support -->
							<div class="relative">
								<button
									@click="isNotificationsOpen = !isNotificationsOpen"
									title="Centre de notifications — Support Client"
									class="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors relative group p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
								>
									<Bell class="w-5 h-5" />
									<span
										v-if="pendingSupportCount > 0"
										class="absolute -top-0.5 -right-0.5 min-w-[20px] h-5 px-1 bg-rose-500 text-white font-black text-[10px] rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center shadow-xs"
									>
										{{ pendingSupportCount > 99 ? '99+' : pendingSupportCount }}
									</span>
								</button>

								<!-- Popover déroulant des notifications Support Agent -->
								<div
									v-if="isNotificationsOpen"
									@mouseleave="isNotificationsOpen = false"
									class="absolute right-0 mt-3 w-80 bg-white dark:bg-[#0A0D1A] rounded-2xl shadow-2xl border border-slate-200/80 dark:border-slate-800 p-4 z-50 animate-in zoom-in-95"
								>
									<div class="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800 pb-3 mb-3">
										<h4 class="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">Notifications Support</h4>
										<span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
											{{ pendingSupportCount }} en attente
										</span>
									</div>

									<div class="space-y-2 max-h-72 overflow-y-auto">
										<div
											v-if="pendingSupportCount > 0"
											@click="isNotificationsOpen = false; goToPage('support')"
											class="p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-3"
										>
											<div class="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
												💬
											</div>
											<div class="flex-1">
												<p class="text-xs font-bold text-slate-900 dark:text-white">{{ pendingSupportCount }} ticket(s) non traité(s)</p>
												<p class="text-[10px] text-emerald-700 dark:text-emerald-400 font-medium">Accéder à la gestion du support</p>
											</div>
										</div>

										<div v-else class="py-6 text-center text-xs text-slate-400 font-medium">
											Aucune nouvelle notification
										</div>
									</div>
								</div>
							</div>
						</div>

						<div class="h-8 w-px bg-slate-200 dark:bg-slate-800"></div>

						<div class="flex items-center gap-3 cursor-pointer group" @click="goToPage('profile')">
							<div class="text-right hidden lg:block">
								<p class="text-sm font-black text-slate-900 dark:text-white leading-none mb-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{{ userName }}</p>
								<p class="text-[9px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Support Agent</p>
							</div>
							<div class="relative">
								<div class="w-11 h-11 rounded-full overflow-hidden shrink-0 shadow-md bg-emerald-600 flex items-center justify-center text-white text-[14px] font-black">
									<ClientOnly>
										<img v-if="currentUser?.profileImage" :src="currentUser.profileImage" class="w-full h-full object-cover" alt="Photo de profil" />
										<span v-else>{{ userInitials }}</span>
										<template #fallback><div class="w-full h-full bg-emerald-600"></div></template>
									</ClientOnly>
								</div>
							</div>
						</div>
					</div>
				</header>

				<!-- Contenu dynamique -->
				<div class="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 xl:p-10 flex flex-col transition-all duration-300">
					<Transition name="page-slide" mode="out-in">
						<div :key="activeSection" class="h-full">
							<slot />
						</div>
					</Transition>
				</div>
			</main>
		</div>

		<ToastNotifications />
	</div>
</template>

<style scoped>
::-webkit-scrollbar { display: none; }
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.page-slide-enter-active, .page-slide-leave-active { transition: all 0.3s ease; }
.page-slide-enter-from { opacity: 0; transform: translateY(10px); }
.page-slide-leave-to { opacity: 0; transform: translateY(-10px); }
</style>
