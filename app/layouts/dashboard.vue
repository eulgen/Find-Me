<!--
  @file app/layouts/dashboard.vue
  @description Layout de l'espace citoyen findMe — sidebar avec logo, profil utilisateur,
  navigation principale, bouton de création d'adresse (ButtonUI) et déconnexion (ButtonUI).
  Parfaitement responsive : Drawer sur mobile, barre latérale sur PC.
-->

<script setup lang="ts">
import { ref, watch, computed, onMounted } from "vue";
import { useRoute, navigateTo } from "#app";
import {
	LayoutDashboard,
	User,
	HelpCircle,
	LogOut,
	Plus,
	Map,
	Menu,
	X
} from "lucide-vue-next";
import ButtonUI from "~/components/ui/ButtonUI.vue";
import FindMeLogo from "~/components/ui/FindMeLogo.vue";
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

// État du menu mobile
const isMobileMenuOpen = ref(false);

/** Initiales utilisateur pour l'avatar par défaut */
const userInitials = computed(() => {
	if (!currentUser.value) return "??";
	const name = currentUser.value.username || currentUser.value.email;
	return name.substring(0, 2).toUpperCase();
});

/** Nom court affiché dans la sidebar */
const userName = computed(() => {
	if (!currentUser.value) return "";
	return currentUser.value.username || currentUser.value.email.split("@")[0];
});

/** Localisation simulée */
const userLocation = "Yaoundé, Cameroun";

/** Déconnecte l'utilisateur et redirige vers la page d'accueil */
const onLogout = () => {
	const prevName = currentUser.value?.username || "Citoyen";
	handleLogout();
	if (typeof window !== "undefined") window.scrollTo({ top: 0 });
	addToast(`Déconnexion réussie. À bientôt, ${prevName} !`, "info");
	navigateTo("/",{external:true});
};

onMounted(() => {
	initTheme();
});

// On dérive la section active directement du chemin d'accès (URL réelle)
const route = useRoute();
const activeSection = computed(() => {
	const path = route.path.replace(/\/$/, ''); // enlève le slash final si présent
	if (path.endsWith('/adresses')) return 'addresses';
	if (path.endsWith('/profil')) return 'profile';
	if (path.endsWith('/support')) return 'support';
	return 'dashboard';
});

/** Navigue vers une vraie page de section du dashboard (Routing Nuxt) */
const goToPage = (section: string) => {
	if (!currentUser.value) return;
	const baseUrl = `/users/${currentUser.value.id}`;
	
	if (section === 'dashboard') navigateTo(baseUrl);
	else if (section === 'addresses') navigateTo(`${baseUrl}/adresses`);
	else if (section === 'profile') navigateTo(`${baseUrl}/profil`);
	else if (section === 'support') navigateTo(`${baseUrl}/support`);
	
	isMobileMenuOpen.value = false;
};

// Fermer le menu mobile automatiquement lorsqu'on change de section
watch(activeSection, () => {
	isMobileMenuOpen.value = false;
});
</script>

<template>
	<div
		class="min-h-[100dvh] bg-[#F4F6F9] dark:bg-[#0E111F] flex flex-col"
		id="dashboard-layout-root"
	>
		<!-- ===== MOBILE TOP BAR ===== -->
		<!-- S'affiche uniquement sur mobile et tablette (en dessous de md) -->
		<header class="md:hidden sticky top-0 z-40 bg-white dark:bg-[#141627] border-b border-gray-100 dark:border-slate-800 px-4 py-3 flex items-center justify-between shadow-sm">
			<div class="flex items-center gap-3">
				<!-- Bouton Hamburger -->
				<button @click="isMobileMenuOpen = true" class="p-1.5 -ml-1.5 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/50">
					<Menu class="w-6 h-6" />
				</button>
				<!-- Logo réduit pour la barre mobile -->
				<FindMeLogo size="90" class=":cursor-pointer" @click="navigateTo('/',{external:true})" />
			</div>
				<!-- Mini avatar pour accès rapide au profil sur mobile -->
			<button 
				@click="goToPage('profile')"
				class="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-[#2E7D32] to-[#1B5E20] flex items-center justify-center text-white text-xs font-black shadow-sm ring-2 ring-transparent focus:ring-[#2E7D32] transition-all"
			>
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
			
			<!-- Mobile Overlay (Fermer le menu au clic à l'extérieur) -->
			<div 
				v-if="isMobileMenuOpen" 
				class="fixed inset-0 bg-black/50 backdrop-blur-[2px] z-[60] md:hidden transition-opacity duration-300" 
				@click="isMobileMenuOpen = false"
				aria-hidden="true"
			></div>

			<!-- ===== SIDEBAR ===== -->
			<!-- En mobile : fixed, passe par-dessus le contenu. En desktop : sticky, prend sa propre place. -->
			<aside
				class="fixed md:sticky top-0 left-0 h-[100dvh] z-[70] md:z-10 w-[280px] md:w-[260px] flex-shrink-0 bg-white dark:bg-[#141627] flex flex-col border-r border-gray-100 dark:border-slate-800 shadow-2xl md:shadow-none transform transition-transform duration-300 ease-in-out md:translate-x-0"
				:class="isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'"
				id="dashboard-sidebar"
			>
				<!-- ── Logo FindMe (Agrandi) ── -->
				<div class="px-6 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between">
					<FindMeLogo size="110" class="drop-shadow-sm hover:cursor-pointer" @click="navigateTo('/',{external:true})"/>
					<button class="md:hidden p-2 -mr-2 text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-slate-800" @click="isMobileMenuOpen = false">
						<X class="w-5 h-5" />
					</button>
				</div>

				<!-- ── Profil utilisateur ── -->
				<div class="px-5 py-5">
					<div
						class="flex items-center gap-3.5 p-3.5 rounded-2xl bg-gray-50 dark:bg-slate-800/50 cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors border border-transparent dark:border-slate-700/50 hover:border-gray-200"
						@click="goToPage('profile')"
						id="sidebar-user-profile"
					>
						<!-- Avatar -->
						<div class="w-12 h-12 rounded-full overflow-hidden shrink-0 shadow-sm ring-[3px] ring-white dark:ring-[#141627]">
							<ClientOnly>
								<NuxtImg
									v-if="currentUser?.photo"
									:src="currentUser.photo"
									class="w-full h-full object-cover"
									alt="Photo de profil"
								/>
								<div
									v-else
									class="w-full h-full bg-gradient-to-br from-[#2E7D32] to-[#1B5E20] flex items-center justify-center text-white text-[15px] font-black"
								>
									{{ userInitials }}
								</div>
								<template #fallback>
									<div class="w-full h-full bg-gradient-to-br from-[#2E7D32] to-[#1B5E20]"></div>
								</template>
							</ClientOnly>
						</div>
						<!-- Infos -->
						<div class="min-w-0 flex-1">
							<ClientOnly>
								<p class="text-[14px] font-bold text-gray-800 dark:text-white truncate leading-tight">{{ userName?.toUpperCase() }}</p>
								<p class="text-[12px] font-medium text-gray-500 dark:text-slate-400 truncate mt-0.5">{{ currentUser?.rule.toUpperCase() }}</p>
								<template #fallback>
									<div class="space-y-1">
										<div class="h-4 bg-gray-200 dark:bg-slate-700 rounded w-3/4 animate-pulse"></div>
										<div class="h-3 bg-gray-200 dark:bg-slate-700 rounded w-1/2 animate-pulse"></div>
									</div>
								</template>
							</ClientOnly>
						</div>
					</div>
				</div>

				<!-- ── Navigation principale ── -->
				<!-- Personnalisation de la scrollbar pour qu'elle soit invisible ou discrète -->
				<nav class="flex-1 px-5 py-2 space-y-2 overflow-y-auto" id="sidebar-nav" style="scrollbar-width: none;">
					<button
						@click="goToPage('dashboard')"
						class="w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-[14.5px] font-bold transition-all duration-200 text-left"
						:class="activeSection === 'dashboard'
							? 'bg-[#2E7D32] text-white shadow-md shadow-[#2E7D32]/25'
							: 'text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white'"
					>
						<LayoutDashboard class="w-[22px] h-[22px] shrink-0" :class="activeSection === 'dashboard' ? 'text-white' : ''" />
						<span>Tableau de bord</span>
					</button>

					<button
						@click="goToPage('addresses')"
						class="w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-[14.5px] font-bold transition-all duration-200 text-left"
						:class="activeSection === 'addresses'
							? 'bg-[#2E7D32] text-white shadow-md shadow-[#2E7D32]/25'
							: 'text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white'"
					>
						<Map class="w-[22px] h-[22px] shrink-0" :class="activeSection === 'addresses' ? 'text-white' : ''" />
						<span>Adresses</span>
					</button>

					<button
						@click="goToPage('profile')"
						class="w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-[14.5px] font-bold transition-all duration-200 text-left"
						:class="activeSection === 'profile'
							? 'bg-[#2E7D32] text-white shadow-md shadow-[#2E7D32]/25'
							: 'text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white'"
					>
						<User class="w-[22px] h-[22px] shrink-0" :class="activeSection === 'profile' ? 'text-white' : ''" />
						<span>Profil</span>
					</button>

					<button
						@click="goToPage('support')"
						class="w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-[14.5px] font-bold transition-all duration-200 text-left"
						:class="activeSection === 'support'
							? 'bg-[#2E7D32] text-white shadow-md shadow-[#2E7D32]/25'
							: 'text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white'"
					>
						<HelpCircle class="w-[22px] h-[22px] shrink-0" :class="activeSection === 'support' ? 'text-white' : ''" />
						<span>Aide &amp; Support</span>
					</button>
				</nav>

				<!-- ── Actions du bas de sidebar ── -->
				<div class="px-5 pb-8 pt-4 border-t border-gray-100 dark:border-slate-800 space-y-3 bg-white dark:bg-[#141627]">
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
			<!-- Le retrait de ml-[220px] corrige le décalage sur grand écran, le min-w-0 gère les débordements (overflow) en mode flex -->
			<main
				class="flex-1 min-w-0 flex flex-col h-[calc(100dvh-3.5rem)] md:h-[100dvh] overflow-y-auto scroll-smooth"
				id="dashboard-main"
			>
				<!-- Conteneur centré pour encadrer le contenu principal, parfait sur mobile et tablette -->
				<div class="flex-1 w-full max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 xl:p-10 flex flex-col transition-all duration-300">
					<slot />
				</div>
			</main>
		</div>

		<!-- Écrans de progression et composants globaux -->
		<PageLoader />
		<ToastNotifications />
		<WhatsAppSupportFab />
	</div>
</template>

<style scoped>
/* Masquer la scrollbar de la navigation pour un look plus épuré, tout en gardant le scroll fonctionnel */
#sidebar-nav::-webkit-scrollbar {
  display: none;
}
</style>
