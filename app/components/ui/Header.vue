<!--
  @file Header.vue
  @description En-tête de page collant (sticky) pour findMe Cameroun.
  Gère l'accès au menu d'authentification, le basculement Thème Clair/Sombre,
  l'accès au profil ainsi que les défilements fluides du menu.
-->

<script setup lang="ts">
	import { ref, computed } from "vue";
	import { User, Menu, X, Sun, Moon, LogOut, ChevronDown } from "lucide-vue-next";
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
		{ id: "hero-banner", label: "Accueil" },
		{ id: "comment-ca-marche", label: "Comment ça marche ?" },
		{ id: "features-highlights", label: "Fonctionnement" },
		{ id: "accordion-faq", label: "FAQ" },
		{ id: "contact-support", label: "Contact" },
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
		class="sticky top-0 z-50 bg-white/98 backdrop-blur-md border-b border-gray-100 shadow-sm"
		id="header-container"
	>
		<div
			class="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between gap-6"
		>
			<!-- Logo cliquable pour remonter -->
			<div
				class="cursor-pointer flex-shrink-0 transition-opacity hover:opacity-80 duration-200"
				@click="scrollToTop"
				id="logo-wrapper"
			>
				<FindMeLogo
					size="110"
					id="logo-badge"
					@click="navigateTo('/')"
				/>
			</div>

			<!-- Navigation Desktop -->
			<nav
				class="hidden lg:flex items-center gap-1 text-sm font-medium flex-1 justify-center"
				id="main-navigation"
				role="navigation"
				aria-label="Menu principal"
			>
				<button
					v-for="item in menuItems"
					:key="item.id"
					@click="handleNavClick(item.id)"
					class="px-3.5 py-2 rounded-lg text-gray-600 hover:text-[#2E7D32] hover:bg-[#2E7D32]/5 transition-all duration-150 focus:outline-none whitespace-nowrap font-medium text-[13px]"
					:id="`nav-${item.id}`"
					:aria-label="`Aller à la section ${item.label}`"
				>
					{{ item.label }}
				</button>
			</nav>

			<!-- Boutons de contrôles Desktop -->
			<div class="hidden lg:flex items-center gap-3 flex-shrink-0" id="header-actions">
				<!-- Toggle Mode Nuit (discret) -->
				<button
					@click="emit('toggle-theme')"
					class="flex items-center justify-center w-8 h-8 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all cursor-pointer"
					:title="isDark ? 'Passer au mode clair' : 'Passer au mode sombre'"
					id="dark-mode-toggle-btn"
					:aria-label="isDark ? 'Activer le mode clair' : 'Activer le mode sombre'"
				>
					<Sun v-if="isDark" class="w-4 h-4 text-amber-500" />
					<Moon v-else class="w-4 h-4" />
				</button>

				<!-- Espace utilisateur authentifié -->
				<div
					v-if="currentUser"
					class="flex items-center gap-2 bg-[#2E7D32]/8 border border-[#2E7D32]/20 rounded-full px-1 py-1 pr-3"
					id="header-user-status"
				>
					<div
						@click="emit('profile-click')"
						role="button"
						tabindex="0"
						@keydown.enter="emit('profile-click')"
						@keydown.space.prevent="emit('profile-click')"
						class="flex items-center gap-2.5 cursor-pointer hover:opacity-80 transition-opacity"
						title="Accéder à mon espace citoyen"
						aria-label="Accéder à mon profil citoyen"
					>
						<div
							class="w-7 h-7 rounded-full bg-[#2E7D32] text-white flex items-center justify-center font-black text-xs uppercase shrink-0"
						>
							{{
								currentUser.username
									? currentUser.username.substring(0, 2)
									: currentUser.email.substring(0, 2)
							}}
						</div>
						<span class="text-[12px] font-semibold text-gray-700 truncate max-w-[100px]">
							{{ currentUser.username || currentUser.email.split("@")[0] }}
						</span>
					</div>
					<button
						@click.stop="emit('logout')"
						aria-label="Se déconnecter de votre compte"
						class="flex items-center justify-center w-6 h-6 rounded-full text-gray-400 hover:text-rose-500 hover:bg-rose-50 transition-all cursor-pointer ml-1"
						id="header-logout-btn"
						title="Déconnexion"
					>
						<LogOut class="w-3.5 h-3.5" />
					</button>
				</div>

				<!-- Boutons non-connecté -->
				<template v-else>
					<button
						@click="navigateTo('/auth/signin')"
						class="px-4 py-2 text-[13px] font-semibold text-gray-600 hover:text-[#2E7D32] transition-colors rounded-lg hover:bg-gray-50"
						id="signin-link-btn"
					>
						Se connecter
					</button>
					<button
						@click="navigateTo('/auth/signin')"
						class="px-5 py-2 text-[13px] font-bold text-white bg-[#2E7D32] hover:bg-[#1B5E20] rounded-full transition-all duration-200 shadow-sm hover:shadow-md active:scale-95"
						id="access-app-btn"
					>
						S'inscrire
					</button>
				</template>
			</div>

			<!-- Hamburger mobile -->
			<div class="flex lg:hidden items-center gap-2">
				<button
					@click="emit('toggle-theme')"
					class="flex items-center justify-center w-8 h-8 rounded-full text-gray-400 hover:bg-gray-100 transition-all cursor-pointer"
					id="dark-mode-toggle-compact"
					:aria-label="isDark ? 'Activer le mode clair' : 'Activer le mode sombre'"
				>
					<Sun v-if="isDark" class="w-4 h-4 text-amber-500" />
					<Moon v-else class="w-4 h-4" />
				</button>

				<button
					@click="menuOpen = !menuOpen"
					class="flex items-center justify-center w-9 h-9 rounded-xl border border-gray-200 text-gray-600 cursor-pointer hover:bg-gray-50 hover:border-gray-300 transition-all"
					:aria-label="menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'"
					:aria-expanded="menuOpen"
					id="hamburger-btn"
				>
					<X v-if="menuOpen" class="w-5 h-5 stroke-2" />
					<Menu v-else class="w-5 h-5 stroke-2" />
				</button>
			</div>
		</div>

		<!-- Tiroir Mobile déployé -->
		<Transition
			enter-active-class="transition-all duration-200 ease-out"
			enter-from-class="opacity-0 -translate-y-2"
			enter-to-class="opacity-100 translate-y-0"
			leave-active-class="transition-all duration-150 ease-in"
			leave-from-class="opacity-100 translate-y-0"
			leave-to-class="opacity-0 -translate-y-2"
		>
			<div
				v-if="menuOpen"
				class="lg:hidden bg-white border-t border-gray-100 px-4 py-5 space-y-1 shadow-lg"
				id="mobile-menu-drawer"
				role="dialog"
				aria-label="Menu de navigation mobile"
			>
				<button
					v-for="item in menuItems"
					:key="item.id"
					@click="handleNavClick(item.id)"
					class="w-full text-left px-3 py-2.5 rounded-lg font-medium text-gray-600 hover:text-[#2E7D32] hover:bg-[#2E7D32]/5 transition-all text-sm"
					:id="`drawer-nav-${item.id}`"
				>
					{{ item.label }}
				</button>

				<div class="pt-3 border-t border-gray-100 mt-3 flex flex-col gap-2">
					<button
						v-if="!currentUser"
						@click="navigateTo('/auth/signin')"
						class="w-full py-2.5 text-center text-sm font-semibold text-gray-600 hover:text-[#2E7D32] border border-gray-200 rounded-lg hover:border-[#2E7D32]/30 transition-all"
						id="drawer-nav-auth"
					>
						Se connecter
					</button>
					<button
						v-if="!currentUser"
						@click="navigateTo('/auth/signin')"
						class="w-full py-2.5 text-center text-sm font-bold text-white bg-[#2E7D32] rounded-lg hover:bg-[#1B5E20] transition-all"
					>
						S'inscrire
					</button>
					<button
						v-if="currentUser"
						@click="emit('profile-click'); menuOpen = false"
						class="w-full text-left px-3 py-2.5 rounded-lg font-semibold text-[#2E7D32] hover:bg-[#2E7D32]/5 transition-all text-sm"
						id="drawer-nav-profile"
					>
						Mon Espace Citoyen ({{ currentUser.username || currentUser.email }})
					</button>
					<button
						v-if="currentUser"
						@click="emit('logout'); menuOpen = false"
						class="w-full text-left px-3 py-2.5 rounded-lg font-semibold text-rose-500 hover:bg-rose-50 transition-all text-sm"
					>
						Déconnexion
					</button>
				</div>
			</div>
		</Transition>
	</header>
</template>
