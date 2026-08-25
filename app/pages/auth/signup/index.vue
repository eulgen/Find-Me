<!--
  @file SignUpPage.vue
  @description Page d'inscription citoyenne findMe Cameroun — Design ultra-compact tenant sur 100vh sans scroll.
-->

<script setup lang="ts">
	import { onMounted, watch, computed, ref } from "vue";
	import {
		CheckCircle,
		Check,
		Sparkles,
		CircleCheck,
		Eye,
		EyeOff,
		HeartHandshake
	} from "lucide-vue-next";
	import { useAuth } from "~/composables/useAuth";
	import { useNavigation } from "~/composables/useNavigation";
	import GoogleButtonUI from "~/components/ui/GoogleButtonUI.vue";
	import ICloudButtonUI from "~/components/ui/ICloudButtonUI.vue";
	import FindMeLogo from "~/components/ui/FindMeLogo.vue";
	import ThemeToggle from "~/components/ui/ThemeToggle.vue";

	const {
		authStep,
		authMode,
		authEmail,
		authUsername,
		authPassword,
		isAuthSubmitLoading,
		isAuthDoneLoading,
		handleSignUp,
		currentUser,
		resetAuth,
	} = useAuth();

	const { currentView } = useNavigation();

	definePageMeta({
		layout: 'auth'
	});

	onMounted(() => {
		resetAuth();
		authMode.value = "signup";
	});

	// Password real-time feedback
	const hasMinLength = computed(() => authPassword.value.length >= 8);
	const hasUppercase = computed(() => /[A-Z]/.test(authPassword.value));
	const hasNumber = computed(() => /[0-9]/.test(authPassword.value));
	const showPassword = ref<boolean>(false);

	watch(currentUser, (newUser) => {
		if (newUser && authStep.value === "success") {
			setTimeout(() => {
				navigateTo(`/users/${newUser.id}`);
			}, 2500);
		}
	});

	const handleDone = () => {
		isAuthDoneLoading.value = true;
		setTimeout(() => {
			isAuthDoneLoading.value = false;
			if (currentUser.value) {
				navigateTo(`/users/${currentUser.value.id}`);
			}
			resetAuth();
		}, 900);
	};
</script>

<template>
	<div class="flex flex-col justify-between w-full max-w-[390px] mx-auto h-full max-h-screen py-2 font-sans overflow-hidden">
		
		<!-- Header Logo -->
		<div class="flex-shrink-0 flex items-center justify-between w-full px-2">
			<div class="w-10"></div>
			<FindMeLogo size="130" class="mx-auto cursor-pointer transition-all hover:scale-105" @click="navigateTo('/')" />
			<ThemeToggle />
		</div>

		<!-- Formulaire principal compact -->
		<div class="w-full relative flex-1 flex flex-col justify-center my-auto" id="signup-interactive-area">
			<transition name="slide-fade" mode="out-in">
				
				<!-- ── Saisie d'identifiants ── -->
				<div v-if="authStep === 'login'" key="signup-form" class="space-y-2.5 w-full" id="signup-form-wrapper">
					
					<!-- En-tête Éditorial -->
					<div class="text-center space-y-0.5" id="signup-header-texts">
						<h1 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-serif tracking-tight leading-tight">
							Créer un compte
						</h1>
						<p class="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-tight">
							Rejoignez l'adressage certifié au Cameroun.
						</p>
					</div>

					<!-- Social Auth -->
					<div class="space-y-1.5">
						<GoogleButtonUI />
						<ICloudButtonUI />
					</div>

					<!-- Séparateur -->
					<div class="flex items-center gap-3 py-0.5" id="signup-divider-row">
						<div class="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
						<span class="text-[9px] text-slate-400 font-black uppercase tracking-widest">ou par email</span>
						<div class="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
					</div>

					<!-- Formulaire manuel -->
					<form @submit.prevent="handleSignUp()" class="space-y-2" id="signup-form-body">
						
						<!-- Nom d'utilisateur -->
						<div class="space-y-0.5 group" id="signup-input-username-group">
							<label class="block text-[10px] font-black uppercase tracking-[0.1em] text-slate-700 dark:text-slate-300">
								Nom complet
							</label>
							<input
								type="text"
								required
								class="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-bold placeholder:text-slate-400 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all shadow-2xs"
								placeholder="ex: Jean Eto'o"
								v-model="authUsername"
							/>
						</div>

						<!-- Email -->
						<div class="space-y-0.5 group" id="signup-input-email-group">
							<label class="block text-[10px] font-black uppercase tracking-[0.1em] text-slate-700 dark:text-slate-300">
								Adresse email
							</label>
							<input
								type="email"
								required
								class="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-bold placeholder:text-slate-400 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all shadow-2xs"
								placeholder="exemple@email.com"
								v-model="authEmail"
							/>
						</div>

						<!-- Mot de passe -->
						<div class="space-y-0.5 group" id="signup-input-password-group">
							<label class="block text-[10px] font-black uppercase tracking-[0.1em] text-slate-700 dark:text-slate-300">
								Mot de passe
							</label>
							<div class="relative">
								<input
									:type="showPassword ? 'text' : 'password'"
									required
									class="w-full px-3.5 py-2 pr-10 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-bold placeholder:text-slate-400 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all shadow-2xs"
									placeholder="••••••••"
									v-model="authPassword"
								/>
								<button
									type="button"
									class="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-emerald-600 transition-colors"
									@click="showPassword = !showPassword"
								>
									<Eye v-if="!showPassword" class="w-3.5 h-3.5" />
									<EyeOff v-else class="w-3.5 h-3.5" />
								</button>
							</div>

							<!-- Indicateurs de sécurité -->
							<div class="pt-0.5 flex items-center justify-between text-[9px]" id="password-strength-indicators">
								<div class="flex items-center space-x-1 font-bold transition-colors" :class="hasMinLength ? 'text-emerald-600' : 'text-slate-400'">
									<CircleCheck class="w-3 h-3" />
									<span>8+ carac.</span>
								</div>
								<div class="flex items-center space-x-1 font-bold transition-colors" :class="hasUppercase ? 'text-emerald-600' : 'text-slate-400'">
									<CircleCheck class="w-3 h-3" />
									<span>Majuscule</span>
								</div>
								<div class="flex items-center space-x-1 font-bold transition-colors" :class="hasNumber ? 'text-emerald-600' : 'text-slate-400'">
									<CircleCheck class="w-3 h-3" />
									<span>Chiffre</span>
								</div>
							</div>
						</div>

						<!-- Bouton Submit -->
						<button
							type="submit"
							:disabled="isAuthSubmitLoading"
							class="group relative w-full h-11 mt-1 rounded-full font-black text-xs uppercase tracking-[0.12em] text-white overflow-hidden transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed bg-slate-900 dark:bg-emerald-500 dark:text-slate-950 hover:bg-slate-800"
						>
							<span v-if="!isAuthSubmitLoading" class="relative z-10 flex items-center justify-center gap-1.5">
								<CheckCircle class="w-4 h-4 text-emerald-400 dark:text-slate-950" />
								Créer mon Compte
							</span>
							<span v-else class="relative z-10 flex items-center justify-center gap-2">
								<span class="w-3.5 h-3.5 border-2 border-white dark:border-slate-950 border-t-transparent rounded-full animate-spin" />
								Création...
							</span>
						</button>
					</form>

					<!-- Reassurance Footer -->
					<div class="flex items-center justify-center gap-1.5 pt-0.5 text-[10px] font-bold text-slate-400 dark:text-slate-500">
						<HeartHandshake class="w-3.5 h-3.5 text-emerald-500" />
						<span>100% Gratuit & universel pour tous</span>
					</div>

					<!-- Redirection vers la connexion -->
					<div class="pt-2 text-center border-t border-slate-200/60 dark:border-slate-800" id="toggle-to-signin">
						<span class="text-xs text-slate-500 dark:text-slate-400 font-medium">Déjà membre ?</span>
						<NuxtLink
							to="/auth/signin"
							class="text-xs font-black text-slate-900 dark:text-white hover:text-emerald-600 ml-1.5 underline decoration-2 decoration-emerald-500 underline-offset-4 transition-colors"
						>
							Se connecter
						</NuxtLink>
					</div>
				</div>

				<!-- ── ÉCRAN DE SUCCÈS ── -->
				<div v-else key="signup-success" class="text-center py-4 flex flex-col items-center justify-center h-full space-y-4">
					<div class="relative w-20 h-20 flex items-center justify-center">
						<div class="absolute inset-0 rounded-full bg-emerald-500 shadow-xl shadow-emerald-500/40 animate-success-pop" />
						<Check class="w-10 h-10 text-white relative z-10" />
					</div>

					<div class="space-y-1">
						<h3 class="text-2xl font-black text-slate-900 dark:text-white font-serif tracking-tight">
							Compte Créé !
						</h3>
						<p class="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-sm mx-auto">
							Bienvenue parmi nous, 
							<span class="text-slate-900 dark:text-white font-black block mt-0.5 text-sm">{{ authUsername || authEmail || "Citoyen findMe" }}</span>
						</p>
					</div>

					<button
						@click="handleDone"
						:disabled="isAuthDoneLoading"
						class="group relative w-full h-11 rounded-full font-black text-xs uppercase tracking-[0.12em] text-white overflow-hidden transition-all shadow-md bg-slate-900 dark:bg-emerald-500 dark:text-slate-950"
					>
						<span v-if="!isAuthDoneLoading" class="relative z-10 flex items-center justify-center gap-2">
							<Sparkles class="w-4 h-4 text-emerald-400 dark:text-slate-950" />
							Accéder à mon espace
						</span>
						<span v-else class="relative z-10 flex items-center justify-center gap-2">
							<span class="w-3.5 h-3.5 border-2 border-white dark:border-slate-950 border-t-transparent rounded-full animate-spin" />
							Chargement...
						</span>
					</button>
				</div>

			</transition>
		</div>

		<!-- Footer Spacing filler -->
		<div class="flex-shrink-0"></div>

	</div>
</template>

<style scoped>
.slide-fade-enter-active {
  transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}
.slide-fade-leave-active {
  transition: all 0.25s cubic-bezier(0.22, 1, 0.36, 1);
}
.slide-fade-enter-from {
  transform: translateX(-10px);
  opacity: 0;
}
.slide-fade-leave-to {
  transform: translateX(10px);
  opacity: 0;
}

@keyframes successPop {
	0% { opacity: 0; transform: scale(0.8); }
	60% { opacity: 1; transform: scale(1.1); }
	100% { opacity: 1; transform: scale(1); }
}
.animate-success-pop { animation: successPop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
</style>
