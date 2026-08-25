<!--
  @file Header.vue
  @description En-tête de page Gainlove — Redesign ultra-élégant et aéré pour findMe Cameroun.
-->

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { Menu, X, Sun, Moon, LogOut, ArrowRight, UserCheck } from "lucide-vue-next";
import FindMeLogo from "./FindMeLogo.vue";
import { useRouter } from "vue-router";
import type { User } from "~/types/types.js";

const router = useRouter();

const props = defineProps<{
	currentUser: User | null;
	isDark: boolean;
}>();

const emit = defineEmits<{
	(e: "open-auth"): void;
	(e: "scroll-to-step", stepId: string): void;
	(e: "logout"): void;
	(e: "profile-click"): void;
	(e: "toggle-theme"): void;
}>();

const menuOpen = ref(false);
const isScrolled = ref(false);

const handleScroll = () => {
	isScrolled.value = window.scrollY > 20;
};

onMounted(() => {
	window.addEventListener("scroll", handleScroll);
	handleScroll();
});

onUnmounted(() => {
	window.removeEventListener("scroll", handleScroll);
});

const menuItems = computed(() => [
	{ id: "hero-banner", label: "Accueil" },
	{ id: "how-it-works-module", label: "Comment ça marche ?" },
	{ id: "features-highlights", label: "Avantages" },
	{ id: "accordion-faq", label: "FAQ" },
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
		class="fixed top-0 inset-x-0 z-50 transition-all duration-500 ease-out font-sans"
		:class="[
			isScrolled 
				? 'bg-[#FAF8F5]/90 dark:bg-[#0A0D1A]/90 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-800 shadow-xs py-3' 
				: 'bg-[#FAF8F5]/60 dark:bg-[#0A0D1A]/60 backdrop-blur-md py-4',
		]"
		id="header-container"
	>
		<div class="max-w-7xl mx-auto px-6 md:px-10 lg:px-16 flex items-center justify-between gap-6">
			
			<!-- Logo cliquable -->
			<div
				class="cursor-pointer flex-shrink-0 transition-transform duration-300 hover:scale-105"
				@click="scrollToTop"
				id="logo-wrapper"
			>
				<FindMeLogo
					size="160"
					id="logo-badge"
					@click="navigateTo('/')"
				/>
			</div>

			<!-- Navigation Desktop (Gainlove Floating Pill Bar) -->
			<nav
				class="hidden lg:flex items-center gap-1.5 bg-white/80 dark:bg-slate-900/80 px-4 py-1.5 rounded-full border border-slate-200/80 dark:border-slate-800 shadow-xs backdrop-blur-md"
				id="main-navigation"
			>
				<button
					v-for="item in menuItems"
					:key="item.id"
					@click="handleNavClick(item.id)"
					class="px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800"
				>
					{{ item.label }}
				</button>
			</nav>

			<!-- Actions Desktop -->
			<div class="hidden lg:flex items-center gap-4 flex-shrink-0" id="header-actions">
				
				<!-- Toggle Mode Nuit -->
				<button
					@click="emit('toggle-theme')"
					class="flex items-center justify-center w-10 h-10 rounded-full bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:scale-105 transition-all shadow-xs"
					:title="isDark ? 'Passer au mode clair' : 'Passer au mode sombre'"
				>
					<Sun v-if="isDark" class="w-4 h-4 text-amber-500" />
					<Moon v-else class="w-4 h-4 text-slate-700" />
				</button>

				<!-- Utilisateur authentifié ou Bouton CTA -->
				<ClientOnly>
					<div
						v-if="currentUser"
						class="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-full p-1 pr-3 shadow-xs"
						id="header-user-status"
					>
						<div
							@click="emit('profile-click')"
							role="button"
							tabindex="0"
							class="flex items-center gap-2 cursor-pointer group"
						>
							<div
								class="w-8 h-8 rounded-full bg-slate-900 dark:bg-emerald-500 text-white dark:text-slate-950 flex items-center justify-center font-black text-xs uppercase shrink-0 overflow-hidden"
							>
								<img
									v-if="currentUser.profileImage || (currentUser as any).photo"
									:src="currentUser.profileImage || (currentUser as any).photo"
									class="w-full h-full object-cover"
									alt="Photo de profil"
								/>
								<template v-else>
									{{
										currentUser.fullName
											? currentUser.fullName.substring(0, 2).toUpperCase()
											: currentUser.email.substring(0, 2).toUpperCase()
									}}
								</template>
							</div>
							<span class="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[120px]">
								{{ currentUser.fullName || currentUser.email.split("@")[0] }}
							</span>
						</div>
						<div class="w-px h-4 bg-slate-200 dark:bg-slate-800 mx-1"></div>
						<button
							@click.stop="emit('logout')"
							class="flex items-center justify-center w-7 h-7 rounded-full text-slate-400 hover:text-rose-500 transition-colors"
							title="Déconnexion"
						>
							<LogOut class="w-4 h-4" />
						</button>
					</div>

					<!-- Boutons non-connecté -->
					<template v-else>
						<NuxtLink
							to="/auth/signin"
							class="px-5 py-3 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-white transition-all rounded-full hover:bg-slate-100/80 dark:hover:bg-slate-800"
						>
							Se connecter
						</NuxtLink>
						<NuxtLink
							to="/creer-mon-adresse"
							class="group inline-flex items-center justify-center gap-1.5 bg-slate-900 dark:bg-emerald-500 dark:text-slate-950 text-white font-bold text-xs px-4 py-2 rounded-full shadow-xs hover:scale-105 transition-all"
						>
							<span>Créer mon adresse</span>
							<ArrowRight class="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
						</NuxtLink>
					</template>

					<template #fallback>
						<div class="w-32 h-10 animate-pulse bg-slate-200/60 dark:bg-slate-800 rounded-full"></div>
					</template>
				</ClientOnly>
			</div>

			<!-- Mobile Actions & Hamburger -->
			<div class="flex lg:hidden items-center gap-3">
				<button
					@click="emit('toggle-theme')"
					class="flex items-center justify-center w-10 h-10 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 shadow-xs"
				>
					<Sun v-if="isDark" class="w-4 h-4 text-amber-500" />
					<Moon v-else class="w-4 h-4 text-slate-700" />
				</button>

				<button
					@click="menuOpen = !menuOpen"
					class="flex items-center justify-center w-10 h-10 rounded-full border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white bg-white dark:bg-slate-900 shadow-xs"
				>
					<X v-if="menuOpen" class="w-5 h-5" />
					<Menu v-else class="w-5 h-5" />
				</button>
			</div>
		</div>

		<!-- Menu Mobile -->
		<Transition
			enter-active-class="transition-all duration-300 ease-out"
			enter-from-class="opacity-0 -translate-y-4"
			enter-to-class="opacity-100 translate-y-0"
			leave-active-class="transition-all duration-200 ease-in"
			leave-from-class="opacity-100 translate-y-0"
			leave-to-class="opacity-0 -translate-y-4"
		>
			<div
				v-if="menuOpen"
				class="absolute top-full left-0 w-full lg:hidden bg-[#FAF8F5]/95 dark:bg-[#0A0D1A]/95 backdrop-blur-2xl border-b border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden"
			>
				<div class="px-6 py-6 space-y-3 max-w-7xl mx-auto">
					<button
						v-for="item in menuItems"
						:key="item.id"
						@click="handleNavClick(item.id)"
						class="w-full text-left px-4 py-3 rounded-2xl font-bold text-slate-800 dark:text-white hover:bg-white dark:hover:bg-slate-900 transition-all text-sm"
					>
						{{ item.label }}
					</button>

					<div class="pt-4 mt-2 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2.5">
						<template v-if="!currentUser">
							<NuxtLink
								to="/auth/signin"
								@click="menuOpen = false"
								class="w-full py-3.5 text-center text-xs font-bold text-slate-800 dark:text-white bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full shadow-xs"
							>
								Se connecter
							</NuxtLink>
							<NuxtLink
								to="/creer-mon-adresse"
								@click="menuOpen = false"
								class="w-full py-3.5 text-center text-xs font-black uppercase tracking-wider text-white bg-slate-900 dark:bg-emerald-500 dark:text-slate-950 rounded-full shadow-lg"
							>
								Créer mon adresse
							</NuxtLink>
						</template>
						<template v-if="currentUser">
							<button
								@click="emit('profile-click'); menuOpen = false"
								class="w-full text-left px-4 py-3 rounded-2xl font-bold text-slate-900 dark:text-white bg-white dark:bg-slate-900 flex items-center gap-3"
							>
								<span class="truncate">Mon Espace Citoyen</span>
							</button>
							<button
								@click="emit('logout'); menuOpen = false"
								class="w-full text-left px-4 py-3 rounded-2xl font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors text-sm"
							>
								Déconnexion
							</button>
						</template>
					</div>
				</div>
			</div>
		</Transition>
	</header>
</template>
