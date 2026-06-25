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
 * Navigue vers une section du dashboard en utilisant de véritables URL (Nuxt Pages).
 * Utilisé par les composants enfants (ex: DashboardOverview) via l'événement `@navigate`.
 * @param section - Identifiant de la section cible
 */
const goToSection = (section: string) => {
	if (!currentUser.value) return;
	const baseUrl = `/users/${currentUser.value.id}`;
	
	if (section === 'dashboard') router.push(baseUrl);
	else if (section === 'addresses') router.push(`${baseUrl}/adresses`);
	else if (section === 'profile') router.push(`${baseUrl}/profil`);
	else if (section === 'support') router.push(`${baseUrl}/support`);
};

/**
 * ──────────────────────────────────────────────────────────────────────────
 * WATCHERS & HOOKS
 * ──────────────────────────────────────────────────────────────────────────
 */

onMounted(() => {
	// L'action `create` n'est plus gérée ici car les adresses sont sur `/adresses`
	// Cependant, si nécessaire, vous pourriez rediriger vers `/adresses?action=create`
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
		<!-- ─── Onglet 1 : Tableau de bord ─── -->
		<DashboardOverview @navigate="goToSection" />
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
				aria-label="Se connecter"
			>
				Se connecter
			</ButtonUI>
		</div>
	</div>
</template>
