<!--
  @file Header.vue
  @description En-tête de page animé et sticky pour findMe Cameroun.
  Gère l'accès au menu, le thème et l'utilisateur avec un design ultra-premium.
-->

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { Menu, X, Sun, Moon, LogOut } from "lucide-vue-next";
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
	console.log("route : ", router.currentRoute.value.path)
	handleScroll();
});

onUnmounted(() => {
	window.removeEventListener("scroll", handleScroll);
});

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
		class="fixed top-0 inset-x-0 z-50 transition-all duration-500 ease-out"
		:class="[
			isScrolled 
				? 'bg-white/80 dark:bg-[#0A0D1A]/80 backdrop-blur-xl  dark:border-slate-800/50 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] py-2' 
				: 'bg-white/85 py-2',
		]"
		id="header-container"
	>
		<div class="max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-between gap-6 transition-all duration-500">
			
			<!-- Logo cliquable -->
			<div
				class="cursor-pointer flex-shrink-0 transition-transform duration-300 origin-left"
				@click="scrollToTop"
				id="logo-wrapper"
			>
				<FindMeLogo
					size="130"
					id="logo-badge"
					@click="navigateTo('/')"
				/>
			</div>

			<!-- Navigation Desktop (Pills style) -->
			<nav
				class="hidden lg:flex items-center gap-2 bg-slate-50/50 dark:bg-slate-900/50 p-1.5 rounded-full border border-slate-200/50 dark:border-slate-800/50 backdrop-blur-md"
				:class="{ 'opacity-100 translate-y-0': true, 'opacity-0 -translate-y-4': false }" 
				style="transition: all 0.6s cubic-bezier(0.22,1,0.36,1) 0.1s;"
				id="main-navigation"
			>
				<button
					v-for="item in menuItems"
					:key="item.id"
					@click="handleNavClick(item.id)"
					class="relative px-4 py-2 rounded-full text-[13px] font-bold transition-all duration-300 group focus:outline-none text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400"
				>
					<span class="relative z-10">{{ item.label }}</span>
					<!-- Hover background -->
					<div class="absolute inset-0 bg-white dark:bg-slate-800 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-sm border border-slate-100 dark:border-slate-700"></div>
				</button>
			</nav>

			<!-- Boutons de contrôles Desktop -->
			<div class="hidden lg:flex items-center gap-4 flex-shrink-0" id="header-actions">
				<!-- Toggle Mode Nuit -->
				<button
					@click="emit('toggle-theme')"
					class="relative flex items-center justify-center w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 text-slate-400 hover:text-emerald-500 hover:shadow-md transition-all duration-300 group overflow-hidden"
					:title="isDark ? 'Passer au mode clair' : 'Passer au mode sombre'"
				>
					<div class="absolute inset-0 bg-emerald-50 dark:bg-emerald-900/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
					<Sun v-if="isDark" class="w-4 h-4 text-amber-500 relative z-10 animate-spin-slow" />
					<Moon v-else class="w-4 h-4 relative z-10 transition-transform group-hover:-rotate-12" />
				</button>

				<!-- Espace utilisateur authentifié -->
				<ClientOnly>
					<div
						v-if="currentUser"
						class="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/50 rounded-full p-1 pr-3 shadow-sm transition-all hover:shadow-md"
						id="header-user-status"
					>
						<div
							@click="emit('profile-click')"
							role="button"
							tabindex="0"
							class="flex items-center gap-2.5 cursor-pointer group"
						>
							<div
								class="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center font-black text-xs uppercase shrink-0 overflow-hidden shadow-inner transition-transform"
							>
								<NuxtImg
									v-if="currentUser.photo"
									:src="currentUser.photo"
									class="w-full h-full object-cover"
									alt="Photo de profil"
								/>
								<template v-else>
									{{
										currentUser.username
											? currentUser.username.substring(0, 2)
											: currentUser.email.substring(0, 2)
									}}
								</template>
							</div>
							<span class="text-[13px] font-bold text-slate-700 dark:text-slate-300 truncate max-w-[120px] group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
								{{ currentUser.username || currentUser.email.split("@")[0] }}
							</span>
						</div>
						<div class="w-px h-4 bg-emerald-200 dark:bg-emerald-800 mx-1"></div>
						<button
							@click.stop="emit('logout')"
							class="flex items-center justify-center w-8 h-8 rounded-full text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all cursor-pointer"
							title="Déconnexion"
						>
							<LogOut class="w-4 h-4 transition-transform " />
						</button>
					</div>

					<!-- Boutons non-connecté -->
					<template v-else>
						<button
							@click="navigateTo('/auth/signin')"
							class="group relative inline-flex items-center justify-center px-6 py-2.5 text-[13px] font-bold text-white transition-all duration-300 overflow-hidden rounded-full shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 active:translate-y-0"
						>
							<div class="absolute inset-0 w-full h-full bg-gradient-to-r from-emerald-600 to-teal-500 transition-transform duration-500"></div>
							<span class="relative flex items-center gap-2">
								Se Connecter
							</span>
						</button>
					</template>
					<template #fallback>
						<div class="w-24 h-10 animate-pulse bg-slate-100 dark:bg-slate-800 rounded-full"></div>
					</template>
				</ClientOnly>
			</div>

			<!-- Hamburger mobile -->
			<div class="flex lg:hidden items-center gap-3">
				<button
					@click="emit('toggle-theme')"
					class="flex items-center justify-center w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 text-slate-400"
				>
					<Sun v-if="isDark" class="w-4 h-4 text-amber-500" />
					<Moon v-else class="w-4 h-4" />
				</button>

				<button
					@click="menuOpen = !menuOpen"
					class="flex items-center justify-center w-10 h-10 rounded-full border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 shadow-sm transition-transform"
				>
					<X v-if="menuOpen" class="w-5 h-5" />
					<Menu v-else class="w-5 h-5" />
				</button>
			</div>
		</div>

		<!-- Menu Mobile -->
		<Transition
			enter-active-class="transition-all duration-300 cubic-bezier(0.22,1,0.36,1)"
			enter-from-class="opacity-0 -translate-y-4"
			enter-to-class="opacity-100 translate-y-0"
			leave-active-class="transition-all duration-200 ease-in"
			leave-from-class="opacity-100 translate-y-0"
			leave-to-class="opacity-0 -translate-y-4"
		>
			<div
				v-if="menuOpen"
				class="absolute top-full left-0 w-full lg:hidden bg-white/95 dark:bg-[#0A0D1A]/95 backdrop-blur-2xl border-b border-slate-100 dark:border-slate-800 shadow-2xl overflow-hidden"
			>
				<div class="px-6 py-6 space-y-2 max-w-7xl mx-auto">
					<button
						v-for="(item, index) in menuItems"
						:key="item.id"
						@click="handleNavClick(item.id)"
						class="w-full text-left px-4 py-3 rounded-2xl font-bold text-slate-700 dark:text-slate-300 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all text-sm"
						:style="{ transitionDelay: `${index * 50}ms` }"
					>
						{{ item.label }}
					</button>

					<div class="pt-4 mt-2 border-t border-slate-100 dark:border-slate-800/50 flex flex-col gap-3">
						<button
							v-if="!currentUser"
							@click="navigateTo('/auth/signin')"
							class="w-full py-3.5 text-center text-sm font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-500 rounded-2xl shadow-lg shadow-emerald-500/20"
						>
							Se Connecter
						</button>
						<template v-if="currentUser">
							<button
								@click="emit('profile-click'); menuOpen = false"
								class="w-full text-left px-4 py-3 rounded-2xl font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/10"
							>
								Mon Espace ({{ currentUser.username || currentUser.email }})
							</button>
							<button
								@click="emit('logout'); menuOpen = false"
								class="w-full text-left px-4 py-3 rounded-2xl font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
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
