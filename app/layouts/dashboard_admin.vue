<!--
  @file app/layouts/dashboard_admin.vue
  @description Layout de l'espace administrateur findMe — design glassmorphism premium,
  sidebar avec logo, profil admin, navigation animée et top bar translucide.
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

// On dérive la section active directement du chemin d'accès
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
		class="relative min-h-[100dvh] bg-slate-50 dark:bg-[#0A0D1A] flex flex-col overflow-hidden font-sans"
		id="dashboard-admin-layout"
	>
		<!-- ── Décoration fond animée globale ── -->
		<div class="fixed inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
			<div class="absolute -bottom-[20%] -right-[10%] w-[50vw] h-[50vw] rounded-full bg-emerald-500/5 dark:bg-emerald-900/10 blur-[120px] animate-pulse-slow" />
			<div class="absolute top-[20%] -left-[10%] w-[40vw] h-[40vw] rounded-full bg-teal-500/5 dark:bg-teal-900/10 blur-[100px] animate-pulse-slow" style="animation-delay: 2s;" />
		</div>

		<!-- ── Grille subtile ── -->
		<div
			class="fixed inset-0 pointer-events-none opacity-[0.02] dark:opacity-[0.03] z-0"
			style="background-image: radial-gradient(currentColor 1px, transparent 1px); background-size: 40px 40px; color: #10B981"
			aria-hidden="true"
		/>

		<!-- ===== MOBILE TOP BAR ===== -->
		<header class="md:hidden sticky top-0 z-40 bg-white/70 dark:bg-[#0A0D1A]/70 backdrop-blur-xl border-b border-white/20 dark:border-slate-200 px-4 py-3 flex items-center justify-between shadow-sm">
			<div class="flex items-center gap-3">
				<button @click="isMobileMenuOpen = true" class="p-1.5 -ml-1.5 text-slate-600 dark:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/50">
					<Menu class="w-6 h-6" />
				</button>
				<FindMeLogo size="100" class="cursor-pointer" @click="navigateTo('/admin')" />
			</div>
			<button class="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-xs font-black shadow-lg ring-2 ring-transparent transition-all">
				<ClientOnly>
					<img v-if="currentUser?.photo" :src="currentUser.photo" class="w-full h-full object-cover" alt="Profile" />
					<span v-else>{{ userInitials }}</span>
					<template #fallback><span></span></template>
				</ClientOnly>
			</button>
		</header>

		<!-- ===== BODY (Sidebar + Main) ===== -->
		<div class="flex flex-1 relative z-10">
			
			<!-- Mobile Overlay -->
			<Transition name="fade">
				<div 
					v-if="isMobileMenuOpen" 
					class="fixed inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm z-[60] md:hidden" 
					@click="isMobileMenuOpen = false"
					aria-hidden="true"
				></div>
			</Transition>

			<!-- ===== SIDEBAR (Glassmorphism) ===== -->
			<aside
				class="fixed md:sticky top-0 left-0 h-[100dvh] z-[70] md:z-10 w-[280px] md:w-[260px] flex-shrink-0 bg-white/60 dark:bg-[#0A0D1A]/60 backdrop-blur-2xl flex flex-col border-r border-white/40 dark:border-slate-200 shadow-[4px_0_24px_rgba(0,0,0,0.02)] dark:shadow-[4px_0_24px_rgba(0,0,0,0.2)] transform transition-transform duration-300 ease-out md:translate-x-0"
				:class="isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'"
			>
				<!-- ── Logo FindMe Admin ── -->
				<div class="px-6 border-b border-white/20 dark:border-slate-200 flex items-center justify-between py-5">
					<div>
						<div class="flex items-center gap-3">
							<div class="w-9 h-9 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/20">
								<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 text-white">
									<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
									<polyline points="9 22 9 12 15 12 15 22" />
								</svg>
							</div>
							<div>
								<h1 class="text-lg font-black text-slate-800 dark:text-[#0f172b] leading-none tracking-tight">findMe<span class="text-emerald-500">Admin</span></h1>
								<p class="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-0.5">Control Center</p>
							</div>
						</div>
					</div>
					<button class="md:hidden p-2 -mr-2 text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800" @click="isMobileMenuOpen = false">
						<X class="w-5 h-5" />
					</button>
				</div>

				<!-- ── Navigation principale ── -->
				<nav class="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto" style="scrollbar-width: none;">
					<button
						v-for="item in navItems"
						:key="item.id"
						@click="goToPage(item.id)"
						class="group relative w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-[13px] font-bold transition-all duration-300 text-left overflow-hidden"
						:class="activeSection === item.id ? 'text-white shadow-lg shadow-emerald-500/20' : 'text-slate-600 dark:text-slate-600 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-800/50'"
					>
						<div v-if="activeSection === item.id" class="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500"></div>
						<component :is="item.icon" class="w-5 h-5 shrink-0 relative z-10 transition-transform " :class="activeSection === item.id ? 'text-white' : 'text-slate-400 dark:text-slate-500 group-hover:text-emerald-500'" />
						<span class="relative z-10 tracking-wide uppercase">{{ item.label }}</span>
					</button>
				</nav>

				<!-- ── Actions du bas de sidebar ── -->
				<div class="px-5 pb-6 pt-4 space-y-3">
					<button
						@click="onLogout"
						class="group flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl text-[13px] font-black uppercase tracking-wider text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/10 hover:bg-rose-100 dark:hover:bg-rose-900/20 border border-rose-100 dark:border-rose-900/30 transition-all duration-300 shadow-sm"
					>
						<LogOut class="w-4 h-4 transition-transform group-hover:-translate-x-1" />
						Déconnexion
					</button>
				</div>
			</aside>

			<!-- ===== MAIN CONTENT AREA ===== -->
			<main class="flex-1 min-w-0 flex flex-col h-[calc(100dvh-3.5rem)] md:h-[100dvh] overflow-y-auto scroll-smooth relative">
				
				<!-- ===== TOP BAR DESKTOP (Glassmorphism) ===== -->
				<header class="hidden md:flex sticky top-0 z-30 bg-white/60 dark:bg-[#0A0D1A]/60 backdrop-blur-2xl border-b border-white/40 dark:border-slate-200 px-8 py-4 items-center justify-between">
					
					<!-- Barre de recherche -->
					<div class="relative w-full max-w-lg group">
						<div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
							<Search class="h-4 w-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
						</div>
						<input
							v-model="searchQuery"
							type="text"
							class="block w-full pl-11 pr-4 py-2.5 bg-white/50 dark:bg-white border border-white/40 dark:border-slate-300 rounded-2xl text-sm font-bold text-slate-900 dark:text-[#0f172b] placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 focus:bg-white dark:focus:bg-slate-900 transition-all outline-none shadow-sm backdrop-blur-sm"
							placeholder="Rechercher un utilisateur, matricule..."
						/>
					</div>

					<!-- Profil et Actions -->
					<div class="flex items-center gap-6">
						<div class="flex items-center gap-4 text-slate-500 dark:text-slate-600">
							<button class="hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors relative group">
								<Bell class="w-5 h-5 group-hover:animate-bounce" />
								<span class="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white dark:border-[#0A0D1A]"></span>
							</button>
							<button class="hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors group">
								<HelpCircle class="w-5 h-5 group-hover:rotate-12 transition-transform" />
							</button>
						</div>

						<div class="h-8 w-px bg-slate-200 dark:bg-slate-700"></div>

						<div class="flex items-center gap-3 cursor-pointer group">
							<div class="text-right hidden lg:block">
								<p class="text-sm font-black text-slate-800 dark:text-[#0f172b] leading-none mb-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{{ userName }}</p>
								<p class="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Super Admin</p>
							</div>
							<div class="relative">
								<div class="w-11 h-11 rounded-full overflow-hidden shrink-0 shadow-md ring-2 ring-white dark:ring-slate-800 transition-transform bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-[14px] font-black">
									<ClientOnly>
										<img v-if="currentUser?.photo" :src="currentUser.photo" class="w-full h-full object-cover" alt="Photo de profil" />
										<span v-else>{{ userInitials }}</span>
										<template #fallback><div class="w-full h-full bg-gradient-to-br from-emerald-400 to-teal-500"></div></template>
									</ClientOnly>
								</div>
								<div class="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-[#0A0D1A] rounded-full shadow-sm"></div>
							</div>
						</div>
					</div>
				</header>

				<!-- Contenu dynamique de la page -->
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
::-webkit-scrollbar {
  display: none;
}

.animate-pulse-slow {
	animation: pulseBg 8s ease-in-out infinite;
}
@keyframes pulseBg {
	0%, 100% { opacity: 0.5; }
	50% { opacity: 0.8; }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.page-slide-enter-active,
.page-slide-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
.page-slide-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.98);
}
.page-slide-leave-to {
  opacity: 0;
  transform: translateY(-20px) scale(0.98);
}
</style>
