<!--
  @file app/layouts/dashboard.vue
  @description Layout de l'espace citoyen findMe — design glassmorphism premium à ton uni émeraude (sans gradients).
-->

<script setup lang="ts">
import { ref, watch, computed, onMounted } from "vue";
import { useRoute, navigateTo } from "#app";
import {
	LayoutDashboard,
	User,
	HelpCircle,
	LogOut,
	Map,
	Menu,
	X
} from "lucide-vue-next";
import FindMeLogo from "~/components/ui/FindMeLogo.vue";
import ThemeToggle from "~/components/ui/ThemeToggle.vue";
import ToastNotifications from "~/components/ui/ToastNotifications.vue";
import WhatsAppSupportFab from "~/components/ui/WhatsAppSupportFab.vue";
import DeleteConfirmModal from "~/components/modals/DeleteConfirmModal.vue";
import ShareModal from "~/components/modals/ShareModal.vue";
import { useTheme } from "~/composables/useTheme";
import { useAuth } from "~/composables/useAuth";
import { useNavigation } from "~/composables/useNavigation";
import { useToasts } from "~/composables/useToasts";

const { isDark, toggleDarkMode, initTheme } = useTheme();
const { addToast } = useToasts();
const { currentUser, handleLogout } = useAuth();
const { scrollToSection, handleProfileClick } = useNavigation();

// État du menu mobile
const isMobileMenuOpen = ref(false);

/** Initiales utilisateur pour l'avatar par défaut */
const userInitials = computed(() => {
	if (!currentUser.value) return "??";
	const name = currentUser.value.fullName || currentUser.value.email;
	return name.substring(0, 2).toUpperCase();
});

/** Nom court affiché dans la sidebar */
const userName = computed(() => {
	if (!currentUser.value) return "";
	return currentUser.value.fullName || currentUser.value.email.split("@")[0];
});

/** Déconnecte l'utilisateur et redirige vers la page d'accueil */
const onLogout = () => {
	const prevName = currentUser.value?.fullName || "Citoyen";
	handleLogout();
	if (typeof window !== "undefined") window.scrollTo({ top: 0 });
	addToast(`Déconnexion réussie. À bientôt, ${prevName} !`, "info");
	navigateTo("/", { external: true });
};

onMounted(() => {
	initTheme();
});

// On dérive la section active directement du chemin d'accès
const route = useRoute();
const activeSection = computed(() => {
	const path = route.path.replace(/\/$/, '');
	if (path.endsWith('/adresses')) return 'addresses';
	if (path.endsWith('/profil')) return 'profile';
	if (path.endsWith('/support')) return 'support';
	return 'dashboard';
});

/** Navigue vers une vraie page de section du dashboard */
const goToPage = (section: string) => {
	const baseUrl = '/users/me';
	
	if (section === 'dashboard') navigateTo(baseUrl);
	else if (section === 'addresses') navigateTo(`${baseUrl}/adresses`);
	else if (section === 'profile') navigateTo(`${baseUrl}/profil`);
	else if (section === 'support') navigateTo(`${baseUrl}/support`);
	
	isMobileMenuOpen.value = false;
};

watch(activeSection, () => {
	isMobileMenuOpen.value = false;
});
</script>

<template>
	<div
		class="relative min-h-[100dvh] bg-[#FAF8F5] dark:bg-[#0A0D1A] flex flex-col overflow-hidden font-sans text-slate-900 dark:text-white"
		id="dashboard-layout-root"
	>
		<!-- ── Décoration fond à ton uni émeraude ── -->
		<div class="fixed inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
			<div class="absolute -top-[20%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-emerald-500/5 dark:bg-emerald-500/10 blur-[120px]" />
			<div class="absolute top-[60%] -right-[10%] w-[40vw] h-[40vw] rounded-full bg-emerald-500/5 dark:bg-emerald-500/10 blur-[100px]" />
		</div>

		<!-- ── Grille subtile ── -->
		<div
			class="fixed inset-0 pointer-events-none opacity-[0.02] dark:opacity-[0.03] z-0"
			style="background-image: radial-gradient(currentColor 1px, transparent 1px); background-size: 40px 40px; color: #00bc7d"
			aria-hidden="true"
		/>

		<!-- ===== MOBILE TOP BAR ===== -->
		<header class="md:hidden sticky top-0 z-40 bg-white/80 dark:bg-[#0A0D1A]/80 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800 px-4 py-3 flex items-center justify-between shadow-xs">
			<div class="flex items-center gap-3">
				<button @click="isMobileMenuOpen = true" class="p-1.5 -ml-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/50">
					<Menu class="w-6 h-6" />
				</button>
				<FindMeLogo size="100" class="cursor-pointer" @click="navigateTo('/')" />
			</div>
			<div class="flex items-center gap-2">
				<ThemeToggle />
				<button 
					@click="goToPage('profile')"
					class="w-8 h-8 rounded-full overflow-hidden bg-emerald-600 flex items-center justify-center text-white text-xs font-black shadow-md ring-2 ring-emerald-500/30 transition-all"
				>
					<ClientOnly>
						<img v-if="currentUser?.profileImage" :src="currentUser.profileImage" class="w-full h-full object-cover" alt="Profile" />
						<span v-else>{{ userInitials }}</span>
						<template #fallback><span></span></template>
					</ClientOnly>
				</button>
			</div>
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

			<!-- ===== SIDEBAR (Glassmorphism Ton Uni) ===== -->
			<aside
				class="fixed md:sticky top-0 left-0 h-[100dvh] z-[70] md:z-10 w-[280px] md:w-[260px] flex-shrink-0 bg-white/80 dark:bg-[#0A0D1A]/80 backdrop-blur-2xl flex flex-col border-r border-slate-200/80 dark:border-slate-800 shadow-xl transform transition-transform duration-300 ease-out md:translate-x-0"
				:class="isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'"
				id="dashboard-sidebar"
			>
				<!-- ── Logo ── -->
				<div class="px-6 border-b border-slate-200/60 dark:border-slate-800 flex items-center justify-between h-[72px]">
					<FindMeLogo size="120" class="cursor-pointer" @click="navigateTo('/')"/>
					<ThemeToggle />
				</div>

				<!-- ── Profil utilisateur ── -->
				<div class="px-5 py-6">
					<div
						class="group flex items-center gap-3.5 p-3 rounded-2xl bg-slate-100/70 dark:bg-slate-900/80 cursor-pointer hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-all duration-300 border border-slate-200/80 dark:border-slate-800 hover:border-emerald-500/50"
						@click="goToPage('profile')"
					>
						<!-- Avatar uni -->
						<div class="w-11 h-11 rounded-full overflow-hidden shrink-0 shadow-md ring-2 ring-emerald-500/30 transition-transform">
							<ClientOnly>
								<img v-if="currentUser?.profileImage" :src="currentUser.profileImage" class="w-full h-full object-cover" alt="Profile" />
								<div v-else class="w-full h-full bg-emerald-600 flex items-center justify-center text-white text-[14px] font-black">
									{{ userInitials }}
								</div>
								<template #fallback><div class="w-full h-full bg-emerald-600"></div></template>
							</ClientOnly>
						</div>
						<!-- Infos -->
						<div class="min-w-0 flex-1">
							<ClientOnly>
								<p class="text-[13px] font-black text-slate-900 dark:text-white truncate leading-tight transition-colors group-hover:text-emerald-600 dark:group-hover:text-emerald-400">{{ userName?.toUpperCase() }}</p>
								<p class="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 truncate mt-0.5 tracking-wider">{{ currentUser?.role?.toUpperCase() }}</p>
								<template #fallback>
									<div class="space-y-1">
										<div class="h-3 bg-slate-200 dark:bg-slate-700 rounded w-3/4 animate-pulse"></div>
										<div class="h-2 bg-slate-200 dark:bg-slate-700 rounded w-1/2 animate-pulse"></div>
									</div>
								</template>
							</ClientOnly>
						</div>
					</div>
				</div>

				<!-- ── Navigation principale ── -->
				<nav class="flex-1 px-4 py-2 space-y-1.5 overflow-y-auto" style="scrollbar-width: none;">
					<button
						@click="goToPage('dashboard')"
						class="group relative w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-[13px] font-bold transition-all duration-300 text-left overflow-hidden cursor-pointer"
						:class="activeSection === 'dashboard' ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900/60'"
					>
						<LayoutDashboard class="w-5 h-5 shrink-0 relative z-10 transition-transform" :class="activeSection === 'dashboard' ? 'text-white' : 'text-slate-400 dark:text-slate-500 group-hover:text-emerald-600 dark:group-hover:text-emerald-400'" />
						<span class="relative z-10 tracking-wide uppercase">Vue d'ensemble</span>
					</button>

					<button
						@click="goToPage('addresses')"
						class="group relative w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-[13px] font-bold transition-all duration-300 text-left overflow-hidden cursor-pointer"
						:class="activeSection === 'addresses' ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900/60'"
					>
						<Map class="w-5 h-5 shrink-0 relative z-10 transition-transform" :class="activeSection === 'addresses' ? 'text-white' : 'text-slate-400 dark:text-slate-500 group-hover:text-emerald-600 dark:group-hover:text-emerald-400'" />
						<span class="relative z-10 tracking-wide uppercase">Mes Adresses</span>
					</button>

					<button
						@click="goToPage('profile')"
						class="group relative w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-[13px] font-bold transition-all duration-300 text-left overflow-hidden cursor-pointer"
						:class="activeSection === 'profile' ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900/60'"
					>
						<User class="w-5 h-5 shrink-0 relative z-10 transition-transform" :class="activeSection === 'profile' ? 'text-white' : 'text-slate-400 dark:text-slate-500 group-hover:text-emerald-600 dark:group-hover:text-emerald-400'" />
						<span class="relative z-10 tracking-wide uppercase">Mon Profil</span>
					</button>

					<button
						@click="goToPage('support')"
						class="group relative w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-[13px] font-bold transition-all duration-300 text-left overflow-hidden cursor-pointer"
						:class="activeSection === 'support' ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900/60'"
					>
						<HelpCircle class="w-5 h-5 shrink-0 relative z-10 transition-transform" :class="activeSection === 'support' ? 'text-white' : 'text-slate-400 dark:text-slate-500 group-hover:text-emerald-600 dark:group-hover:text-emerald-400'" />
						<span class="relative z-10 tracking-wide uppercase">Aide &amp; Support</span>
					</button>
				</nav>

				<!-- ── Actions du bas de sidebar ── -->
				<div class="px-5 pb-6 pt-4 space-y-3 border-t border-slate-200/60 dark:border-slate-800">
					<button
						@click="onLogout"
						class="group flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl text-[13px] font-black uppercase tracking-wider text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 hover:bg-rose-100 dark:hover:bg-rose-900/40 border border-rose-200/60 dark:border-rose-900/40 transition-all duration-300 cursor-pointer"
						aria-label="Se déconnecter"
					>
						<LogOut class="w-4 h-4 transition-transform group-hover:-translate-x-1" />
						Déconnexion
					</button>
				</div>
			</aside>

			<!-- ===== MAIN CONTENT AREA ===== -->
			<main
				class="flex-1 min-w-0 flex flex-col h-[calc(100dvh-3.5rem)] md:h-[100dvh] overflow-y-auto scroll-smooth relative"
				id="dashboard-main"
			>
				<div class="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-10 flex flex-col transition-all duration-300">
					<!-- Transition wrapper pour les vues enfants -->
					<Transition name="page-slide" mode="out-in">
						<div :key="activeSection" class="h-full">
							<slot />
						</div>
					</Transition>
				</div>
			</main>
		</div>

		<ToastNotifications />
		<WhatsAppSupportFab />
		<DeleteConfirmModal />
		<ShareModal />
	</div>
</template>

<style scoped>
/* Scrollbar masquée */
::-webkit-scrollbar {
  display: none;
}

/* Transition du menu mobile overlay */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Transition des pages enfants */
.page-slide-enter-active,
.page-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.page-slide-enter-from {
  opacity: 0;
  transform: translateY(12px);
}
.page-slide-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}
</style>
