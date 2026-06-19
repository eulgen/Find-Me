<!--
  @file app/layouts/dashboard.vue
  @description Layout de l'espace citoyen findMe avec header, sidebar de navigation à gauche,
  zone de contenu principale (slot) et footer.
-->

<script setup lang="ts">
import {
	LayoutDashboard,
	User,
	Settings,
	HelpCircle,
	Bell,
	Globe,
	Moon,
	LogOut,
	Plus,
} from "lucide-vue-next";
import FindMeLogo from "~/components/ui/FindMeLogo.vue";
import Header from "~/components/ui/Header.vue";
import Footer from "~/components/ui/Footer.vue";
import ToastNotifications from "~/components/ui/ToastNotifications.vue";
import WhatsAppSupportFab from "~/components/ui/WhatsAppSupportFab.vue";
import PageLoader from "~/components/modals/PageLoader.vue";
import { useTheme } from "~/composables/useTheme";
import { useAuth } from "~/composables/useAuth";
import { useNavigation } from "~/composables/useNavigation";
import { useToasts } from "~/composables/useToasts";

const { isDark, toggleDarkMode, initTheme } = useTheme();
const { addToast } = useToasts();
const { currentUser, handleLogout } = useAuth();
const { scrollToSection, handleProfileClick } = useNavigation();

// User initials derived from auth state
const userInitials = computed(() => {
	if (!currentUser.value) return "??";
	const name = currentUser.value.username || currentUser.value.email;
	return name.substring(0, 2).toUpperCase();
});

const userName = computed(() => {
	if (!currentUser.value) return "";
	return currentUser.value.username || currentUser.value.email.split("@")[0];
});

const onLogout = () => {
	const prevName = currentUser.value?.username || "Citoyen";
	handleLogout();
	if (typeof window !== "undefined") {
		window.scrollTo({ top: 0 });
	}
	addToast(`Déconnexion réussie. À bientôt, ${prevName} !`, "info");
	navigateTo("/");
};

onMounted(() => {
	initTheme();
});

// Active sidebar section state (shared via route or local)
const route = useRoute();
const activeSection = computed(() => {
	return (route.query.section as string) || "dashboard";
});

const setSection = (section: string) => {
	navigateTo({ query: { ...route.query, section } });
};
</script>

<template>
	<div
		class="min-h-screen bg-[#F4F6F9] dark:bg-[#0E111F] flex flex-col"
		id="dashboard-layout-root"
	>
		<!-- ===== HEADER ===== -->
		<Header
			:isDark="isDark"
			:currentUser="currentUser"
			@toggle-theme="toggleDarkMode"
			@open-auth="navigateTo('/auth/signin')"
			@scroll-to-step="scrollToSection"
			@logout="onLogout"
			@profile-click="handleProfileClick"
			id="header-bar"
		/>

		<!-- ===== BODY (Sidebar + Main) ===== -->
		<div class="flex flex-1">
			<!-- ===== SIDEBAR ===== -->
			<aside
				class="w-[220px] min-h-[calc(100vh-3.5rem)] bg-white dark:bg-[#141627] flex flex-col border-r border-gray-100 dark:border-slate-800 left-0 top-14 bottom-0 z-40 shadow-sm"
				id="dashboard-sidebar"
			>
				<!-- User Info Card -->
				<div class="px-4 py-4 border-b border-gray-100 dark:border-slate-800">
					<div class="flex items-center gap-3">
						<div
							class="w-10 h-10 rounded-full bg-[#2E7D32] text-white flex items-center justify-center font-black text-sm uppercase shrink-0"
						>
							{{ userInitials }}
						</div>
						<div class="min-w-0">
							<p class="text-[13px] font-bold text-gray-800 dark:text-white truncate">{{ userName }}</p>
							<span
								class="inline-flex items-center gap-1 text-[10px] font-bold text-[#2E7D32] uppercase tracking-wider"
							>
								<span class="w-1.5 h-1.5 rounded-full bg-[#2E7D32] animate-pulse inline-block"></span>
								Citoyen
							</span>
						</div>
					</div>
				</div>

				<!-- Main Nav -->
				<nav class="flex-1 px-3 py-4 space-y-1 overflow-y-auto" id="sidebar-nav">
					<!-- Tableau de bord -->
					<button
						@click="setSection('dashboard')"
						class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-150 text-left"
						:class="
							activeSection === 'dashboard'
								? 'bg-[#2E7D32]/10 text-[#2E7D32]'
								: 'text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-800 dark:hover:text-white'
						"
						id="nav-dashboard"
					>
						<LayoutDashboard class="w-4 h-4 shrink-0" />
						<span>Tableau de bord</span>
					</button>

					<!-- Créer une adresse -->
					<button
						@click="setSection('create')"
						class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-150 text-left"
						:class="
							activeSection === 'create'
								? 'bg-[#2E7D32] text-white shadow-sm'
								: 'text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-800 dark:hover:text-white'
						"
						id="nav-create"
					>
						<Plus class="w-4 h-4 shrink-0" />
						<span>Créer</span>
					</button>

					<!-- Profil Utilisateur -->
					<button
						@click="setSection('profile')"
						class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-150 text-left"
						:class="
							activeSection === 'profile'
								? 'bg-[#2E7D32]/10 text-[#2E7D32]'
								: 'text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-800 dark:hover:text-white'
						"
						id="nav-profile"
					>
						<User class="w-4 h-4 shrink-0" />
						<span>Profil Utilisateur</span>
					</button>

					<!-- Paramètres -->
					<button
						@click="setSection('settings')"
						class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-150 text-left"
						:class="
							activeSection === 'settings'
								? 'bg-[#2E7D32]/10 text-[#2E7D32]'
								: 'text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-800 dark:hover:text-white'
						"
						id="nav-settings"
					>
						<Settings class="w-4 h-4 shrink-0" />
						<span>Paramètres</span>
					</button>

					<!-- Aide & Support -->
					<button
						@click="setSection('help')"
						class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-150 text-left"
						:class="
							activeSection === 'help'
								? 'bg-[#2E7D32]/10 text-[#2E7D32]'
								: 'text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-800 dark:hover:text-white'
						"
						id="nav-help"
					>
						<HelpCircle class="w-4 h-4 shrink-0" />
						<span>Aide &amp; Support</span>
					</button>
				</nav>

				<!-- Bottom actions -->
				<div class="px-3 pb-4 pt-2 border-t border-gray-100 dark:border-slate-800 space-y-1">
					<button
						class="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-[12px] font-medium text-gray-400 dark:text-slate-500 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-700 dark:hover:text-slate-300 transition-all text-left"
						id="sidebar-notifications"
					>
						<Bell class="w-3.5 h-3.5 shrink-0" />
						<span>Notifications</span>
					</button>
					<button
						class="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-[12px] font-medium text-gray-400 dark:text-slate-500 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-700 dark:hover:text-slate-300 transition-all text-left"
						id="sidebar-language"
					>
						<Globe class="w-3.5 h-3.5 shrink-0" />
						<span>Français</span>
					</button>
					<button
						@click="toggleDarkMode"
						class="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-[12px] font-medium text-gray-400 dark:text-slate-500 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-700 dark:hover:text-slate-300 transition-all text-left"
						id="sidebar-darkmode"
					>
						<Moon class="w-3.5 h-3.5 shrink-0" />
						<span>{{ isDark ? "Mode Clair" : "Mode Sombre" }}</span>
					</button>
					<button
						@click="onLogout"
						class="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-[12px] font-medium text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 hover:text-rose-600 transition-all text-left"
						id="sidebar-logout"
					>
						<LogOut class="w-3.5 h-3.5 shrink-0" />
						<span>Déconnexion</span>
					</button>
				</div>
			</aside>

			<!-- ===== MAIN CONTENT AREA ===== -->
			<main
				class="flex-1 ml-[220px] min-h-[calc(100vh-3.5rem)] flex flex-col overflow-y-auto"
				id="dashboard-main"
			>
				<!-- Page slot -->
				<div class="flex-1">
					<slot />
				</div>
			</main>
		</div>

		<!-- ===== FOOTER ===== -->
		<Footer
			@scroll-to-step="scrollToSection"
			id="footer-bar"
			class="z-40"
		/>

		<!-- Écran de progression et d'initialisation de départ -->
		<PageLoader />

		<!-- Angle de notification système (toasts dynamiques) -->
		<ToastNotifications />

		<!-- Bouton flottant WhatsApp de support client direct -->
		<WhatsAppSupportFab />
	</div>
</template>
