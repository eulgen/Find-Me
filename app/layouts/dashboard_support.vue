<!--
  @file app/layouts/dashboard_support.vue
  @description Layout de l'espace Support Agent findMe — design glassmorphism premium,
  sidebar avec logo FindMe, navigation limitée au Support et Profil, top bar translucide.
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
import ToastNotifications from "~/components/ui/ToastNotifications.vue";
import PageLoader from "~/components/modals/PageLoader.vue";
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
		class="relative min-h-[100dvh] bg-slate-50 dark:bg-[#0A0D1A] flex flex-col overflow-hidden font-sans"
		id="dashboard-support-layout"
	>
		<!-- Décoration fond animée globale -->
		<div class="fixed inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
			<div class="absolute -bottom-[20%] -right-[10%] w-[50vw] h-[50vw] rounded-full bg-emerald-500/5 dark:bg-emerald-900/10 blur-[120px] animate-pulse-slow" />
			<div class="absolute top-[20%] -left-[10%] w-[40vw] h-[40vw] rounded-full bg-teal-500/5 dark:bg-teal-900/10 blur-[100px] animate-pulse-slow" style="animation-delay: 2s;" />
		</div>

		<div
			class="fixed inset-0 pointer-events-none opacity-[0.02] dark:opacity-[0.03] z-0"
			style="background-image: radial-gradient(currentColor 1px, transparent 1px); background-size: 40px 40px; color: #10B981"
			aria-hidden="true"
		/>

		<!-- MOBILE TOP BAR -->
		<header class="md:hidden sticky top-0 z-40 bg-white/70 dark:bg-[#0A0D1A]/70 backdrop-blur-xl border-b border-white/20 dark:border-slate-200 px-4 py-3 flex items-center justify-between shadow-sm">
			<div class="flex items-center gap-3">
				<button @click="isMobileMenuOpen = true" class="p-1.5 -ml-1.5 text-slate-600 dark:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
					<Menu class="w-6 h-6" />
				</button>
				<FindMeLogo size="100" class="cursor-pointer" @click="navigateTo('/')" />
			</div>
			<button class="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-amber-500 to-teal-600 flex items-center justify-center text-white text-xs font-black shadow-lg">
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
				class="fixed md:sticky top-0 left-0 h-[100dvh] z-[70] md:z-10 w-[280px] md:w-[260px] flex-shrink-0 bg-white/60 dark:bg-[#0A0D1A]/60 backdrop-blur-2xl flex flex-col border-r border-white/40 dark:border-slate-200 shadow-[4px_0_24px_rgba(0,0,0,0.02)] transform transition-transform duration-300 ease-out md:translate-x-0"
				:class="isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'"
			>
				<!-- Logo FindMe -->
				<div class="px-6 border-b border-white/20 dark:border-slate-200 flex items-center justify-between py-5">
					<NuxtLink to="/" class="flex items-center gap-2 cursor-pointer transition-opacity hover:opacity-90" title="Retour à l'accueil du site">
						<FindMeLogo size="130" />
					</NuxtLink>
					<button class="md:hidden p-2 -mr-2 text-slate-400 hover:text-slate-800 transition-colors rounded-full hover:bg-slate-100" @click="isMobileMenuOpen = false">
						<X class="w-5 h-5" />
					</button>
				</div>

				<!-- Navigation principale (Support Agent) -->
				<nav class="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto" style="scrollbar-width: none;">
					<button
						v-for="item in navItems"
						:key="item.id"
						@click="goToPage(item.id)"
						class="group relative w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-[13px] font-bold transition-all duration-300 text-left overflow-hidden"
						:class="activeSection === item.id ? 'text-white shadow-lg shadow-amber-500/20' : 'text-slate-600 dark:text-slate-600 hover:text-slate-900 hover:bg-white/50'"
					>
						<div v-if="activeSection === item.id" class="absolute inset-0 bg-gradient-to-r from-amber-500 to-teal-500"></div>
						<component :is="item.icon" class="w-5 h-5 shrink-0 relative z-10 transition-transform" :class="activeSection === item.id ? 'text-white' : 'text-slate-400 group-hover:text-amber-500'" />
						<span class="relative z-10 tracking-wide uppercase">{{ item.label }}</span>
					</button>
				</nav>

				<div class="px-5 pb-6 pt-4 space-y-3">
					<button
						@click="onLogout"
						class="group flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl text-[13px] font-black uppercase tracking-wider text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-100 transition-all duration-300 shadow-sm"
					>
						<LogOut class="w-4 h-4 transition-transform group-hover:-translate-x-1" />
						Déconnexion
					</button>
				</div>
			</aside>

			<!-- MAIN CONTENT AREA -->
			<main class="flex-1 min-w-0 flex flex-col h-[calc(100dvh-3.5rem)] md:h-[100dvh] overflow-y-auto scroll-smooth relative">
				
				<!-- TOP BAR DESKTOP -->
				<header class="hidden md:flex sticky top-0 z-30 bg-white/60 dark:bg-[#0A0D1A]/60 backdrop-blur-2xl border-b border-white/40 dark:border-slate-200 px-8 py-4 items-center justify-between">
					
					<!-- Recherche -->
					<div class="relative w-full max-w-lg group">
						<div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
							<Search class="h-4 w-4 text-slate-400 group-focus-within:text-amber-500 transition-colors" />
						</div>
						<input
							v-model="searchQuery"
							@focus="isSearchFocused = true"
							@blur="setTimeout(() => isSearchFocused = false, 200)"
							type="text"
							class="block w-full pl-11 pr-4 py-2.5 bg-white/50 dark:bg-white border border-white/40 dark:border-slate-300 rounded-2xl text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 focus:bg-white transition-all outline-none shadow-sm backdrop-blur-sm"
							placeholder="Rechercher un ticket de support..."
						/>

						<div
							v-if="isSearchFocused && searchQuery.trim()"
							class="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150 max-h-96 overflow-y-auto"
						>
							<div v-if="globalSearchResults.hasResults" class="p-2 space-y-2">
								<div v-if="globalSearchResults.support.length > 0">
									<p class="px-3 py-1 text-[10px] font-black text-gray-400 uppercase tracking-widest">Support Client</p>
									<div
										v-for="s in globalSearchResults.support"
										:key="s.id"
										@mousedown="selectSearchResult('/support-agent/support')"
										class="flex items-center justify-between p-2.5 hover:bg-amber-50 rounded-xl cursor-pointer transition-colors"
									>
										<div class="flex items-center gap-2.5">
											<div class="w-7 h-7 rounded-full bg-purple-100 text-purple-700 font-bold text-xs flex items-center justify-center">
												💬
											</div>
											<div class="max-w-[280px]">
												<p class="text-xs font-bold text-gray-900 truncate">{{ s.userFullName || s.name }} (Ticket #{{ s.id }})</p>
												<p class="text-[10px] text-gray-500 truncate">{{ s.message }}</p>
											</div>
										</div>
										<span class="text-[9px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-600">Support</span>
									</div>
								</div>
							</div>
							<div v-else class="p-6 text-center text-xs text-gray-400 font-medium">
								Aucun ticket trouvé pour "{{ searchQuery }}"
							</div>
						</div>
					</div>

					<!-- Profil et Notifications -->
					<div class="flex items-center gap-6">
						<div class="flex items-center gap-4 text-slate-500">
							<button
								@click="goToPage('support')"
								title="Support Client — Tickets en attente"
								class="hover:text-amber-500 transition-colors relative group p-2 rounded-full hover:bg-slate-100"
							>
								<Bell class="w-5 h-5 group-hover:animate-bounce" />
								<span
									v-if="pendingSupportCount > 0"
									class="absolute -top-0.5 -right-0.5 min-w-[20px] h-5 px-1 bg-rose-500 text-white font-black text-[10px] rounded-full border-2 border-white flex items-center justify-center shadow-sm"
								>
									{{ pendingSupportCount > 99 ? '99+' : pendingSupportCount }}
								</span>
							</button>
						</div>

						<div class="h-8 w-px bg-slate-200"></div>

						<div class="flex items-center gap-3 cursor-pointer group" @click="goToPage('profile')">
							<div class="text-right hidden lg:block">
								<p class="text-sm font-black text-slate-800 leading-none mb-1 group-hover:text-amber-600 transition-colors">{{ userName }}</p>
								<p class="text-[9px] font-black text-amber-600 uppercase tracking-widest">Support Agent</p>
							</div>
							<div class="relative">
								<div class="w-11 h-11 rounded-full overflow-hidden shrink-0 shadow-md ring-2 ring-white bg-gradient-to-br from-amber-400 to-teal-500 flex items-center justify-center text-white text-[14px] font-black">
									<ClientOnly>
										<img v-if="currentUser?.profileImage" :src="currentUser.profileImage" class="w-full h-full object-cover" alt="Photo de profil" />
										<span v-else>{{ userInitials }}</span>
										<template #fallback><div class="w-full h-full bg-gradient-to-br from-amber-400 to-teal-500"></div></template>
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

		<PageLoader />
		<ToastNotifications />
	</div>
</template>

<style scoped>
::-webkit-scrollbar { display: none; }
.animate-pulse-slow { animation: pulseBg 8s ease-in-out infinite; }
@keyframes pulseBg { 0%, 100% { opacity: 0.5; } 50% { opacity: 0.8; } }
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.page-slide-enter-active, .page-slide-leave-active { transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
.page-slide-enter-from { opacity: 0; transform: translateY(20px) scale(0.98); }
.page-slide-leave-to { opacity: 0; transform: translateY(-20px) scale(0.98); }
</style>
