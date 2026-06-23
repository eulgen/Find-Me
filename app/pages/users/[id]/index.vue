<!--
  @file app/pages/users/[id].vue
  @description Page orchestratrice du tableau de bord citoyen FindMe.
  Délègue chaque section à un composant dédié pour maintenir
  la lisibilité et respecter le principe de responsabilité unique.
  Chaque onglet (dashboard, profil, adresses, support) est un composant
  autonome avec sa propre logique et son propre template.

  Navigation : pilotée par la query string `?section=xxx`
  Layout     : utilise le layout `dashboard` (sidebar + header)
  Auth       : protégé par le middleware `auth`
-->

<script setup lang="ts">
/**
 * ──────────────────────────────────────────────────────────────────────────
 * IMPORTS
 * ──────────────────────────────────────────────────────────────────────────
 */
import ButtonUI from "~/components/ui/ButtonUI.vue";
import DashboardOverview from "~/components/dashboard/DashboardOverview.vue";
import UserProfile from "~/components/dashboard/UserProfile.vue";
import AddressManager from "~/components/dashboard/AddressManager.vue";
import HelpSupport from "~/components/dashboard/HelpSupport.vue";
import { useAuth } from "~/composables/useAuth";
import { CheckCircle } from "lucide-vue-next";

/**
 * ──────────────────────────────────────────────────────────────────────────
 * META & MIDDLEWARE
 * ──────────────────────────────────────────────────────────────────────────
 */
definePageMeta({
	middleware: "auth",
	layout: "dashboard",
});

/**
 * ──────────────────────────────────────────────────────────────────────────
 * STATE & ROUTING
 * ──────────────────────────────────────────────────────────────────────────
 */
const route = useRoute();
const router = useRouter();
const { currentUser } = useAuth();

/**
 * Utilisation de l'état global partagé pour la section active
 * Valeurs possibles : 'dashboard' | 'profile' | 'addresses' | 'support'
 */
const activeSection = useState<string>(
	"activeDashboardSection",
	() => (route.query.section as string) || "dashboard"
);

/**
 * ──────────────────────────────────────────────────────────────────────────
 * NAVIGATION HELPERS
 * ──────────────────────────────────────────────────────────────────────────
 */

/**
 * Navigue vers une section du dashboard sans modifier la query string de l'URL.
 * Utilisé par les composants enfants via l'événement `@navigate`.
 * @param section - Identifiant de la section cible
 */
const goToSection = (section: string) => {
	activeSection.value = section;
	
	// Nettoyage discret de l'URL si des query params de navigation y étaient
	if (route.query.section || route.query.action) {
		const newQuery = { ...route.query };
		delete newQuery.section;
		if (section !== 'addresses' || route.query.action !== 'create') {
		   delete newQuery.action;
		}
		router.replace({ query: newQuery });
	}
};

/**
 * ──────────────────────────────────────────────────────────────────────────
 * WATCHERS & HOOKS
 * ──────────────────────────────────────────────────────────────────────────
 */

/**
 * Traitement initial si un intent de création d'adresse est détecté via query string.
 * Si `?section=addresses&action=create`, on nettoie l'URL pour éviter la réouverture.
 */
onMounted(() => {
	if (route.query.section === "addresses" && route.query.action === "create") {
		const newQuery = { ...route.query };
		delete newQuery.section;
		router.replace({ query: newQuery });
	}
});
</script>

<template>
	<!-- ══════════════════════════════════════════════════════════════════ -->
	<!-- DASHBOARD AUTHENTIFIÉ                                             -->
	<!-- ══════════════════════════════════════════════════════════════════ -->
	<div
		v-if="currentUser"
		class="flex-1 flex flex-col min-h-[calc(100vh-3.5rem)] relative"
		id="citizen-dashboard-root"
	>
		<!--
		  Chaque section est un composant autonome qui gère :
		  - Son propre template (fidèle à la maquette)
		  - Sa propre logique métier (via composables dédiés)
		  - Ses propres interactions utilisateur
		-->

		<!-- ─── Onglet 1 : Tableau de bord ─── -->
		<DashboardOverview
			v-if="activeSection === 'dashboard'"
			@navigate="goToSection"
		/>

		<!-- ─── Onglet 2 : Profil utilisateur ─── -->
		<UserProfile
			v-else-if="activeSection === 'profile'"
		/>

		<!-- ─── Onglet 3 : Gestion des adresses ─── -->
		<AddressManager
			v-else-if="activeSection === 'addresses'"
		/>

		<!-- ─── Onglet 4 : Aide & Support ─── -->
		<HelpSupport
			v-else-if="activeSection === 'support'"
		/>

		<!-- ─── Fallback : section inconnue → redirection dashboard ─── -->
		<DashboardOverview
			v-else
			@navigate="goToSection"
		/>
	</div>

	<!-- ══════════════════════════════════════════════════════════════════ -->
	<!-- FALLBACK NON AUTHENTIFIÉ                                          -->
	<!-- ══════════════════════════════════════════════════════════════════ -->
	<div
		v-else
		class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0E111F]"
	>
		<div class="text-center max-w-sm mx-auto p-8">
			<!-- Illustration d'état vide -->
			<div class="w-20 h-20 bg-gray-100 dark:bg-slate-800 rounded-3xl flex items-center justify-center mx-auto mb-6">
				<svg class="w-10 h-10 text-gray-300 dark:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
				</svg>
			</div>
			<h2 class="text-lg font-black text-gray-800 dark:text-white mb-2">
				Accès restreint
			</h2>
			<p class="text-sm text-gray-400 dark:text-slate-500 mb-6 leading-relaxed">
				Vous devez être connecté pour accéder à votre espace citoyen FindMe.
			</p>
			<ButtonUI
				@click="navigateTo('/auth/signin')"
				variant="primary"
				class="shadow-lg shadow-[#2E7D32]/30 px-8"
				:icon="CheckCircle"
			>
				Se connecter
			</ButtonUI>
		</div>
	</div>
</template>
