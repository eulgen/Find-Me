<!--
  @file Header.vue
  @description En-tête de page collant (sticky) pour findMe Cameroun.
  Gère l'accès au menu d'authentification, le basculement Thème Clair/Sombre,
  l'accès au profil ainsi que les défilements fluides du menu.
-->

<script setup lang="ts">
	import { ref, computed } from "vue";
	import { User, Menu, X, Sun, Moon } from "lucide-vue-next";
	import ButtonUI from "./ButtonUI.vue";
	import FindMeLogo from "./FindMeLogo.vue";
	import { useRouter } from "vue-router";

	const router = useRouter();

	const props = defineProps<{
		currentUser: { email: string; username: string } | null;
		isDark: boolean;
	}>();

	const emit = defineEmits<{
		(e: "open-auth"): void;
		(e: "scroll-to-step", stepId: string): void;
		(e: "logout"): void;
		(e: "profile-click"): void;
		(e: "toggle-theme"): void;
	}>();

	const isLoading = ref(false);
	const menuOpen = ref(false);

	const menuItems = computed(() => [
		{ id: "comment-ca-marche", label: "Comment ça marche ?" },
		{ id: "benefices", label: "Avantages" },
		{ id: "demonstration", label: "Démonstration" },
		{ id: "faq", label: "FAQ" },
	]);

	const handleNavClick = (id: string) => {
		menuOpen.value = false;
		emit("scroll-to-step", id);
	};

	const scrollToTop = () => {
		menuOpen.value = false;
		window.scrollTo({ top: 0, behavior: "smooth" });
	};
</script>

<template>
	<header
		class="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b-2 border-[#1A237E]/10"
		id="header-container"
	>
		<div
			class="max-w-7xl mx-auto px-4 md:px-8 py-3.5 flex items-center justify-between"
		>
			<!-- Logo cliquable pour remonter -->
			<div
				class="cursor-pointer hover:scale-102 transition-transform duration-200"
				@click="scrollToTop"
				id="logo-wrapper"
			>
				<FindMeLogo
					size="120"
					id="logo-badge"
					@click="navigateTo('/', { external: true })"
				/>
			</div>

			<!-- Navigation Desktop -->
			<nav
				class="hidden lg:flex items-center space-x-8 text-[#1A237E] font-medium text-sm"
				id="main-navigation"
				role="navigation"
				aria-label="Menu principal"
			>
				<button
					v-for="item in menuItems"
					:key="item.id"
					@click="handleNavClick(item.id)"
					class="hover:text-[#2E7D32] transition-colors focus:outline-none cursor-pointer font-semibold"
					:id="`nav-${item.id}`"
					:aria-label="`Aller à la section ${item.label}`"
				>
					{{ item.label }}
				</button>
			</nav>

			<!-- Boutons de contrôles Desktop (Thème + Profil) -->
			<div class="hidden lg:flex items-center space-x-3.5" id="header-actions">
				<!-- Toggle Mode Nuit -->
				<button
					@click="emit('toggle-theme')"
					class="flex items-center space-x-1.5 px-3 py-1.5 rounded-full border-2 border-[#1A237E]/20 bg-white hover:border-[#1A237E] text-[#1A237E] font-bold text-xs tracking-wide transition-all cursor-pointer"
					:title="isDark ? 'Passer au mode clair' : 'Passer au mode sombre'"
					id="dark-mode-toggle-btn"
					:aria-label="
						isDark ? 'Activer le mode clair' : 'Activer le mode sombre'
					"
				>
					<Sun v-if="isDark" class="w-3.5 h-3.5 text-amber-500" />
					<Moon v-else class="w-3.5 h-3.5 text-indigo-600" />
					<span class="text-[9px] font-black uppercase text-[#1A237E]/80">
						{{ isDark ? "Clair" : "Sombre" }}
					</span>
				</button>

				<!-- Espace utilisateur authentifié -->
				<div
					v-if="currentUser"
					class="flex items-center bg-[#2E7D32]/10 border-2 border-[#2E7D32]/30 rounded-2xl p-0.5 pr-3.5"
					id="header-user-status"
				>
					<div
						@click="emit('profile-click')"
						role="button"
						tabindex="0"
						@keydown.enter="emit('profile-click')"
						@keydown.space.prevent="emit('profile-click')"
						class="flex items-center space-x-3 cursor-pointer hover:bg-[#2E7D32]/10 active:scale-95 transition-all p-1.5 px-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2E7D32]"
						title="Accéder à mon espace citoyen"
						aria-label="Accéder à mon profil citoyen"
					>
						<div
							class="w-8 h-8 rounded-full bg-[#2E7D32] text-white flex items-center justify-center font-black text-xs border border-[#1A237E]/20 shadow-sm uppercase shrink-0"
						>
							{{
								currentUser.username
									? currentUser.username.substring(0, 2)
									: currentUser.email.substring(0, 2)
							}}
						</div>
						<div class="text-left">
							<span
								class="text-[9px] text-[#2E7D32] uppercase font-black tracking-widest block leading-3"
								>Bienvenue</span
							>
							<span
								class="text-xs font-black text-[#1A237E] block truncate max-w-[125px]"
								:title="currentUser.username || currentUser.email"
							>
								{{ currentUser.username || currentUser.email.split("@")[0] }}
							</span>
						</div>
					</div>
					<button
						@click.stop="emit('logout')"
						aria-label="Se déconnecter de votre compte"
						class="text-xs font-black text-rose-600 hover:text-rose-700 hover:underline pl-3 border-l border-[#1A237E]/10 cursor-pointer focus:outline-none transition-colors"
						id="header-logout-btn"
					>
						Déconnexion
					</button>
				</div>

				<!-- Bouton Connexion -->
				<ButtonUI
					v-else
					variant="primary"
					:loading="isLoading"
					:disabled="isLoading"
					:icon="User"
					@click="navigateTo('/auth/signin', { external: true })"
					id="access-app-btn"
				>
					Connexion
				</ButtonUI>
			</div>

			<!-- Hamburger mobile -->
			<div class="flex lg:hidden items-center space-x-2.5">
				<button
					@click="emit('toggle-theme')"
					class="flex items-center space-x-1 px-2 py-1 rounded-full border border-[#1A237E]/20 bg-white text-[#1A237E] font-bold text-xs uppercase cursor-pointer"
					id="dark-mode-toggle-compact"
					:aria-label="
						isDark ? 'Activer le mode clair' : 'Activer le mode sombre'
					"
				>
					<Sun v-if="isDark" class="w-3.5 h-3.5 text-amber-500" />
					<Moon v-else class="w-3.5 h-3.5 text-indigo-600" />
					<span class="text-[10px]">{{ isDark ? "CL" : "DK" }}</span>
				</button>

				<button
					@click="menuOpen = !menuOpen"
					class="p-2 border-2 border-[#1A237E]/20 hover:border-[#1A237E] rounded-xl text-[#1A237E] cursor-pointer hover:bg-[#F5F2FB] transition-colors"
					:aria-label="menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'"
					:aria-expanded="menuOpen"
					id="hamburger-btn"
				>
					<X v-if="menuOpen" class="w-5 h-5 stroke-[2.5]" />
					<Menu v-else class="w-5 h-5 stroke-[2.5]" />
				</button>
			</div>
		</div>

		<!-- Tiroir Mobile déployé -->
		<div
			v-if="menuOpen"
			class="lg:hidden bg-white border-t-2 border-[#1A237E]/10 px-6 py-5 space-y-4"
			id="mobile-menu-drawer"
			role="dialog"
			aria-label="Menu de navigation mobile"
		>
			<div class="flex flex-col space-y-3">
				<button
					v-for="item in menuItems"
					:key="item.id"
					@click="handleNavClick(item.id)"
					class="w-full text-left py-2 font-bold text-[#1A237E] hover:text-[#2E7D32] transition-colors text-sm border-b border-[#1A237E]/5"
					:id="`drawer-nav-${item.id}`"
				>
					{{ item.label }}
				</button>
				<button
					v-if="!currentUser"
					@click="navigateTo('/auth/signin', { external: true })"
					class="w-full text-left py-2 font-bold text-[#2E7D32] transition-colors text-sm"
					id="drawer-nav-auth"
				>
					Connexion Espace Citoyen
				</button>
				<button
					v-else
					@click="
						emit('profile-click');
						menuOpen = false;
					"
					class="w-full text-left py-2 font-bold text-[#2E7D32] transition-colors text-sm"
					id="drawer-nav-profile"
				>
					Mon Espace Citoyen ({{ currentUser.username || currentUser.email }})
				</button>
			</div>
		</div>
	</header>
</template>
